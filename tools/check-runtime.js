// Runtime smoke check for persona consequence and lock logic.
//
// The static checker (check-personas.js) verifies that stateChange targets
// resolve against the persona's panel config. This one goes further: it stubs
// the DOM, boots each persona through the engine's real init path, then invokes
// every stateChange function and every locked() predicate to confirm they
// execute without error and actually mutate the panel they claim to.
//
// Usage: node tools/check-runtime.js
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var SRC = path.join(__dirname, '..', 'src');
var PERSONAS = {
  principal: 'principal.js',
  seismic: 'seismic-scientist.js',
  markwilliams: 'mark-williams.js',
  sarahchen: 'sarah-chen.js',
  ngata: 'emily-ngata.js',
  terangi: 'michael-terangi.js'
};

// Minimal DOM: elements remember their innerHTML and expose querySelector
// results built from the sit-item markup the engine generates.
function makeStubDocument(calls) {
  function makeEl(id) {
    var el = {
      id: id,
      innerHTML: '',
      style: {},
      textContent: '',
      className: '',
      children: [],
      querySelectorAll: function () { return []; },
      querySelector: function () { return null; },
      appendChild: function () {},
      classList: { add: function () {}, remove: function () {} }
    };
    return el;
  }
  var els = {};
  var doc = {
    getElementById: function (id) {
      if (!els[id]) els[id] = makeEl(id);
      calls.getElementById[id] = (calls.getElementById[id] || 0) + 1;
      return els[id];
    },
    createElement: function () { return makeEl('created'); },
    querySelectorAll: function () { return []; }
  };

  // Populate the panels a persona actually renders, richly enough that the COP
  // mutators can find a row by its label. Without this they no-op silently and
  // nothing downstream of them can be tested.
  doc.__loadPanels = function (config, utilities) {
    function row(cls, labelCls, label, valueCls, value) {
      var labelEl = makeEl('');
      labelEl.className = labelCls;
      labelEl.textContent = label;
      var valueEl = makeEl('');
      valueEl.className = valueCls;
      valueEl.textContent = value;
      var meter = makeEl('');
      meter.className = 'meter-fill';
      meter.style = { width: '50%' };
      var pct = makeEl('');
      pct.className = '__pct';
      var item = makeEl('');
      item.className = cls;
      item.querySelector = function (sel) {
        if (sel === '.' + labelCls) return labelEl;
        if (sel === '.' + valueCls) return valueEl;
        if (sel === '.meter-fill') return meter;
        if (sel.indexOf('min-width') > -1) return pct;
        return null;
      };
      return item;
    }
    function fill(id, items, itemCls, labelCls, valueCls, labelKey, valueKey) {
      var el = doc.getElementById(id);
      var rows = (items || []).map(function (i) {
        return row(itemCls, labelCls, i[labelKey], valueCls, i[valueKey]);
      });
      el.querySelectorAll = function (sel) { return sel === '.' + itemCls ? rows : []; };
      return rows;
    }
    var p = config.panels || {};
    fill('cdem-groups', p.groups, 'sit-item', 'sit-label', 'sit-value', 'label', 'value');
    fill('agency-status', p.agencies, 'sit-item', 'sit-label', 'sit-value', 'label', 'value');
    fill('lifelines-section', p.lifelines, 'sit-item', 'sit-label', 'sit-value', 'label', 'value');
    fill('transport-section', p.transport, 'sit-item', 'sit-label', 'sit-value', 'label', 'value');
    fill('cascade-tracker', p.cascades, 'cascade-item', 'cascade-name', 'cascade-level', 'name', 'level');

    var resources = doc.getElementById('resources-section');
    var utilRows = {};
    Object.keys(utilities || {}).forEach(function (k) {
      utilRows[k] = row('sit-item', 'sit-label', utilities[k].label, 'sit-value', utilities[k].value);
    });
    resources.querySelector = function (sel) {
      var m = /\[data-util="([^"]+)"\]/.exec(sel);
      return m ? (utilRows[m[1]] || null) : null;
    };

    var feed = doc.getElementById('event-feed');
    feed.appended = [];
    feed.appendChild = function (child) { feed.appended.push(child); };
    return feed;
  };
  return doc;
}

function loadContext() {
  var calls = { getElementById: {} };
  // Off by default so loading the files does not run any scheduled work; the
  // checks that need to drive a timer-based engine path flip it on.
  var timers = { sync: false };
  var ctx = vm.createContext({
    console: console,
    document: makeStubDocument(calls),
    setTimeout: function (fn) { if (timers.sync && typeof fn === 'function') fn(); return 0; },
    clearTimeout: function () {},
    setInterval: function () { return 0; },
    clearInterval: function () {},
    Math: Math,
    Date: Date
  });
  var files = [path.join(SRC, 'nz-cascading-impact-simulator.js')];
  Object.keys(PERSONAS).forEach(function (id) {
    files.push(path.join(SRC, 'personas', PERSONAS[id]));
  });
  files.forEach(function (file) {
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  });
  ctx.__calls = calls;
  ctx.__timers = timers;
  return ctx;
}

function main() {
  var ctx = loadContext();
  var errors = [];
  var stats = { stateChanges: 0, locks: 0, lockReasons: 0, injects: 0, announced: 0 };
  var foreclosed = [];

  Object.keys(PERSONAS).forEach(function (id) {
    ctx.GameState.scenario = id;
    ctx.initUtilities();
    ctx.initSoftMetrics();

    var events = ctx.PERSONA_EVENTS[id];
    var decisions = events.filter(function (e) { return e.type === 'decision' && e.decisionId; });
    var prefix = decisions[0].decisionId.split('_')[0] + '_';

    // 1. Every stateChange executes without throwing, and moves a utility when
    //    it calls updateUtilityDirect.
    Object.keys(ctx.CONSEQUENCE_MAP).forEach(function (key) {
      if (key.indexOf(prefix) !== 0) return;
      Object.keys(ctx.CONSEQUENCE_MAP[key]).forEach(function (optKey) {
        var sc = ctx.CONSEQUENCE_MAP[key][optKey].stateChange;
        if (typeof sc !== 'function') return;
        var utilMatch = /updateUtilityDirect\(\s*'([^']+)'\s*,\s*(\d+)/.exec(sc.toString());
        try {
          sc();
          stats.stateChanges++;
        } catch (e) {
          errors.push(id + ': ' + key + '[' + optKey + '].stateChange threw: ' + e.message);
          return;
        }
        if (utilMatch) {
          var util = utilMatch[1];
          var expected = parseInt(utilMatch[2], 10);
          var actual = ctx.GameState.utilities[util] && ctx.GameState.utilities[util].value;
          if (actual !== expected) {
            errors.push(id + ': ' + key + '[' + optKey + '] set ' + util + ' to ' + actual + ', expected ' + expected);
          }
        }
      });
    });

    // 2. Every locked() predicate runs for an empty log, its own trigger value,
    //    and a non-trigger value - and returns a usable reason when triggered.
    decisions.forEach(function (d) {
      d.options.forEach(function (opt) {
        if (typeof opt.locked !== 'function') return;
        stats.locks++;
        var src = opt.locked.toString();
        var m = /log\['([^']+)'\]\s*===\s*'([^']+)'/.exec(src);
        if (!m) {
          errors.push(id + ': ' + d.decisionId + '[' + opt.key + '].locked has an unrecognised predicate shape');
          return;
        }
        var depId = m[1], trigger = m[2];
        if (!decisions.some(function (x) { return x.decisionId === depId; })) {
          errors.push(id + ': ' + d.decisionId + '[' + opt.key + '].locked depends on "' + depId + '" which is not a decision');
          return;
        }
        var depIndex = decisions.findIndex(function (x) { return x.decisionId === depId; });
        var ownIndex = decisions.findIndex(function (x) { return x.decisionId === d.decisionId; });
        if (depIndex >= ownIndex) {
          errors.push(id + ': ' + d.decisionId + '[' + opt.key + '].locked depends on "' + depId + '" which comes later in the run');
        }
        var dep = decisions[depIndex];
        if (!dep.options.some(function (o) { return o.key === trigger; })) {
          errors.push(id + ': ' + d.decisionId + '[' + opt.key + '].locked triggers on "' + depId + '" = ' + trigger + ', which is not an option there');
        }
        try {
          if (opt.locked({}) !== false) {
            errors.push(id + ': ' + d.decisionId + '[' + opt.key + '].locked is truthy with an empty choice log');
          }
          var triggered = {};
          triggered[depId] = trigger;
          var reason = opt.locked(triggered);
          if (typeof reason !== 'string' || reason.length < 10) {
            errors.push(id + ': ' + d.decisionId + '[' + opt.key + '].locked did not return a usable reason string when triggered');
          } else {
            stats.lockReasons++;
          }
        } catch (e) {
          errors.push(id + ': ' + d.decisionId + '[' + opt.key + '].locked threw: ' + e.message);
        }
      });
    });

    // 3. No decision is fully locked out. Losing the best option to an earlier
    //    bad choice is intended, so that is reported rather than failed.
    decisions.forEach(function (d) {
      var worstCaseLog = {};
      decisions.forEach(function (x) {
        x.options.forEach(function (o) {
          if (typeof o.locked !== 'function') return;
          var m = /log\['([^']+)'\]\s*===\s*'([^']+)'/.exec(o.locked.toString());
          if (m) worstCaseLog[m[1]] = m[2];
        });
      });
      var available = d.options.filter(function (o) {
        return typeof o.locked !== 'function' || o.locked(worstCaseLog) === false;
      });
      if (!available.length) {
        errors.push(id + ': ' + d.decisionId + ' has every option locked in the worst case');
        return;
      }
      // Locking the best option is deliberate - it is how an earlier bad choice
      // bites. Report which decisions become unwinnable so the design stays
      // visible, but do not fail on it.
      var best = Math.max.apply(null, available.map(function (o) {
        return (o.effect && o.effect.score) || 0;
      }));
      if (best <= 0) {
        foreclosed.push(id + '/' + d.decisionId + ' (best remaining ' + best + ')');
      }
    });
  });

  // 4. The scenario clock must never run backwards. A consequence inject
  //    advances it before the next scripted event lands, so drive the engine's
  //    real applyConsequences for every inject-bearing option and check the
  //    resulting time against both the decision it followed and the event due
  //    next. Timestamps in the feed come from the same clock.
  var realProcessNext = ctx.processNextEvent;
  var realAddEventToFeed = ctx.addEventToFeed;
  var feedTimes = [];
  ctx.processNextEvent = function () {};
  ctx.addEventToFeed = function (event) { feedTimes.push(event.time); return realAddEventToFeed.apply(null, arguments); };
  ctx.__timers.sync = true;
  Object.keys(PERSONAS).forEach(function (id) {
    ctx.GameState.scenario = id;
    ctx.initUtilities();
    ctx.initSoftMetrics();
    var events = ctx.PERSONA_EVENTS[id];
    events.forEach(function (e, i) {
      if (e.type !== 'decision' || !e.decisionId) return;
      var cm = ctx.CONSEQUENCE_MAP[e.decisionId];
      if (!cm) return;
      Object.keys(cm).forEach(function (optKey) {
        if (!cm[optKey].inject) return;
        var following = events[i + 1];
        ctx.GameState.decisions = [];
        ctx.GameState.eventIndex = i;
        // GameState.time free-runs on a 1s interval while the player reads and
        // decides, so by the time a consequence fires the live clock is well
        // ahead of the scripted event. Model that drift - assuming the clock
        // still equalled the event time is what let a real feed regression
        // (H+00:15, H+00:13, H+00:56 in the browser) pass this check.
        ctx.GameState.time = e.time + 40.5;
        feedTimes.length = 0;
        try {
          ctx.applyConsequences(e.decisionId, optKey);
        } catch (err) {
          errors.push(id + ': applyConsequences(' + e.decisionId + ', ' + optKey + ') threw: ' + err.message);
          return;
        }
        stats.injects++;
        if (feedTimes.length !== 1) {
          errors.push(id + ': ' + e.decisionId + '[' + optKey + '] wrote ' + feedTimes.length + ' feed entries, expected 1');
          return;
        }
        var stamped = feedTimes[0];
        if (stamped !== Math.floor(stamped)) {
          errors.push(id + ': ' + e.decisionId + '[' + optKey + '] inject is stamped at a fractional minute (' + stamped + ')');
        }
        if (stamped < e.time) {
          errors.push(id + ': ' + e.decisionId + '[' + optKey + '] inject is stamped at ' + stamped +
            ', before the decision it follows at ' + e.time);
        }
        if (following && stamped > following.time) {
          errors.push(id + ': ' + e.decisionId + '[' + optKey + '] inject is stamped at ' + stamped +
            ', past the next event "' + (following.title || following.decisionId) + '" at ' + following.time +
            ' - the feed would run backwards');
        }
      });
    });
  });
  ctx.__timers.sync = false;
  ctx.processNextEvent = realProcessNext;
  ctx.addEventToFeed = realAddEventToFeed;

  // 5. Losses that stack on one run have to compose. Mark can lose children to
  //    three separate choices; each consequence must report what is actually
  //    left, not the eight-child baseline minus its own loss.
  var panelWrites = [];
  var realUpdatePanelItem = ctx.updatePanelItem;
  ctx.updatePanelItem = function (panelId, label, value, cls) {
    panelWrites.push({ panelId: panelId, label: label, value: value, cls: cls });
    return realUpdatePanelItem.apply(null, arguments);
  };
  ctx.GameState.scenario = 'markwilliams';
  ctx.GameState.decisions = [];
  [
    { decisionId: 'mark_tunnel', key: 'D', expected: '7 / 8' },
    { decisionId: 'mark_count', key: 'C', expected: '5 / 8' },
    { decisionId: 'mark_parent_arrives', key: 'B', expected: '2 / 8' }
  ].forEach(function (step) {
    ctx.GameState.decisions.push({ decisionId: step.decisionId, key: step.key });
    panelWrites.length = 0;
    ctx.CONSEQUENCE_MAP[step.decisionId][step.key].stateChange();
    var write = panelWrites.filter(function (w) { return w.label === 'Children Aboard'; }).pop();
    if (!write) {
      errors.push('markwilliams: ' + step.decisionId + '[' + step.key + '] no longer reports Children Aboard');
    } else if (write.value !== step.expected) {
      errors.push('markwilliams: after ' + step.decisionId + '[' + step.key + '] Children Aboard reads "' +
        write.value + '", expected "' + step.expected + '"');
    }
  });
  ctx.updatePanelItem = realUpdatePanelItem;
  ctx.GameState.decisions = [];

  // 6. Every consequence that degrades the COP must say so in the feed. The
  //    panels sit outside where the player is reading, so a silent mutation is
  //    a consequence they never see. Drive the real engine against a DOM stub
  //    with the persona's actual rows in it.
  ctx.processNextEvent = function () {};
  ctx.__timers.sync = true;
  Object.keys(PERSONAS).forEach(function (id) {
    ctx.GameState.scenario = id;
    ctx.initUtilities();
    ctx.initSoftMetrics();
    var config = ctx.SCENARIO_CONFIGS[id];
    var p = config.panels || {};
    var baseline = {};
    [p.groups, p.agencies, p.lifelines, p.transport].forEach(function (list) {
      (list || []).forEach(function (i) { baseline[i.label] = String(i.value); });
    });
    (p.cascades || []).forEach(function (c) { baseline[c.name] = String(c.level); });

    var events = ctx.PERSONA_EVENTS[id];
    var prefix = events.filter(function (e) { return e.decisionId; })[0].decisionId.split('_')[0] + '_';
    Object.keys(ctx.CONSEQUENCE_MAP).forEach(function (decId) {
      if (decId.indexOf(prefix) !== 0) return;
      Object.keys(ctx.CONSEQUENCE_MAP[decId]).forEach(function (optKey) {
        var sc = ctx.CONSEQUENCE_MAP[decId][optKey].stateChange;
        if (typeof sc !== 'function') return;
        var src = sc.toString();

        // What the source claims to touch, and the literal value where there is one.
        var targets = [];
        var m;
        var panelRe = /update(?:Panel|Meter)Item\(\s*'[^']+'\s*,\s*'([^']+)'\s*,\s*(?:'([^']*)')?/g;
        while ((m = panelRe.exec(src)) !== null) targets.push({ label: m[1], value: m[2] });
        var cascadeRe = /updateCascadeItem\(\s*'[^']+'\s*,\s*'([^']+)'\s*,\s*'([^']*)'/g;
        while ((m = cascadeRe.exec(src)) !== null) targets.push({ label: m[1], value: m[2] });
        var utilRe = /updateUtilityDirect\(\s*'([^']+)'\s*,\s*(\d+)/g;
        while ((m = utilRe.exec(src)) !== null) {
          var u = ctx.GameState.utilities[m[1]];
          if (u) targets.push({ label: u.label, value: m[2] + '%', from: u.value + '%' });
        }
        if (!targets.length) return;

        // A label can name both a panel row and a utility meter, so count
        // occurrences rather than testing presence - otherwise one announcement
        // masks a sibling mutation that silently found no row.
        var expected = {};
        targets.forEach(function (t) {
          var from = t.from !== undefined ? t.from : baseline[t.label];
          var known = t.value !== null && t.value !== undefined;
          if (known && from === t.value) return; // already showing that value
          expected[t.label] = (expected[t.label] || 0) + 1;
        });

        ctx.initUtilities();
        var feed = ctx.document.__loadPanels(config, ctx.GameState.utilities);
        // makeDecision pushes the choice before the consequence fires, and a
        // stateChange may read it back, so mirror that here.
        ctx.GameState.decisions = [{ decisionId: decId, key: optKey }];
        ctx.GameState.eventIndex = 0;
        ctx.GameState.time = 0;
        try {
          ctx.applyConsequences(decId, optKey);
        } catch (err) {
          errors.push(id + ': applyConsequences(' + decId + ', ' + optKey + ') threw against a populated DOM: ' + err.message);
          return;
        }
        var block = feed.appended.filter(function (c) { return (c.innerHTML || '').indexOf('cop-changes') > -1; }).pop();
        if (!block) {
          errors.push(id + ': ' + decId + '[' + optKey + '] changed the COP but announced nothing in the feed');
          return;
        }
        stats.announced++;
        var announced = {};
        var labelRe = /<span class="cop-change-label">([^<]*)<\/span>/g;
        while ((m = labelRe.exec(block.innerHTML)) !== null) {
          announced[m[1]] = (announced[m[1]] || 0) + 1;
        }
        Object.keys(expected).forEach(function (label) {
          var got = announced[label] || 0;
          if (got >= expected[label]) return;
          errors.push(id + ': ' + decId + '[' + optKey + '] moved "' + label + '" ' + expected[label] +
            ' time(s) but announced ' + got + ' - a mutator found no such row');
        });
      });
    });
  });
  ctx.__timers.sync = false;
  ctx.processNextEvent = realProcessNext;

  console.log('stateChange functions executed: ' + stats.stateChanges);
  console.log('consequences announcing COP damage: ' + stats.announced);
  console.log('consequence injects clock-checked: ' + stats.injects);
  console.log('locked predicates exercised:    ' + stats.locks + ' (' + stats.lockReasons + ' returned a reason)');
  console.log('decisions with no positive option left if every lock triggers: ' + foreclosed.length);
  foreclosed.forEach(function (f) { console.log('  ' + f); });

  if (errors.length) {
    console.error('\n' + errors.length + ' violation(s):');
    errors.forEach(function (e) { console.error('  - ' + e); });
    process.exit(1);
  }
  console.log('\nAll persona runtime checks pass.');
}

main();
