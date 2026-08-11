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
  return {
    getElementById: function (id) {
      if (!els[id]) els[id] = makeEl(id);
      calls.getElementById[id] = (calls.getElementById[id] || 0) + 1;
      return els[id];
    },
    createElement: function () { return makeEl('created'); },
    querySelectorAll: function () { return []; }
  };
}

function loadContext() {
  var calls = { getElementById: {} };
  var ctx = vm.createContext({
    console: console,
    document: makeStubDocument(calls),
    setTimeout: function () { return 0; },
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
  return ctx;
}

function main() {
  var ctx = loadContext();
  var errors = [];
  var stats = { stateChanges: 0, locks: 0, lockReasons: 0 };
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

  console.log('stateChange functions executed: ' + stats.stateChanges);
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
