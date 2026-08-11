// Headless invariant checker for persona definitions.
//
// The engine and persona files are plain browser scripts with no top-level DOM
// access, so they evaluate cleanly in a bare vm context. This loads them all and
// asserts that each persona's registries are internally consistent and meet the
// depth floors agreed in docs/superpowers/specs/2026-08-11-persona-depth-and-consequence-design.md.
//
// Usage: node tools/check-personas.js [personaId ...] [--counts]
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

var FLOORS = {
  events: 30,
  decisions: 20,
  noise: 10,
  consequences: 12,
  stateChanges: 12,
  locks: 3
};

function loadContext() {
  var ctx = vm.createContext({ console: console });
  var files = [path.join(SRC, 'nz-cascading-impact-simulator.js')];
  Object.keys(PERSONAS).forEach(function (id) {
    files.push(path.join(SRC, 'personas', PERSONAS[id]));
  });
  files.forEach(function (file) {
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  });
  return ctx;
}

function decisionsOf(events) {
  return events.filter(function (e) { return e.type === 'decision' && e.decisionId; });
}

function optionKeys(decision) {
  return decision.options.map(function (o) { return o.key; });
}

function checkPersona(ctx, id, errors, counts) {
  function fail(msg) { errors.push(id + ': ' + msg); }

  var events = ctx.PERSONA_EVENTS[id];
  if (!events) { fail('no PERSONA_EVENTS entry'); return; }

  var decisions = decisionsOf(events);
  var byId = {};
  var lockCount = 0;
  decisions.forEach(function (d) {
    if (byId[d.decisionId]) fail('duplicate decisionId "' + d.decisionId + '"');
    byId[d.decisionId] = d;
    d.options.forEach(function (o) {
      if (typeof o.locked === 'function') lockCount++;
    });
  });

  // 1. Every decision has complete facilitator notes.
  decisions.forEach(function (d) {
    var n = ctx.FACILITATOR_NOTES[d.decisionId];
    if (!n) { fail('no FACILITATOR_NOTES for "' + d.decisionId + '"'); return; }
    ['learningObjective', 'bestPractice', 'teachingNote', 'references', 'discussionPrompts'].forEach(function (f) {
      if (!n[f]) fail('FACILITATOR_NOTES["' + d.decisionId + '"] missing ' + f);
    });
    // 2. bestPractice names a real option key.
    if (n.bestPractice && optionKeys(d).indexOf(n.bestPractice) === -1) {
      fail('FACILITATOR_NOTES["' + d.decisionId + '"].bestPractice "' + n.bestPractice + '" is not an option key');
    }
  });

  // 3 & 5. Registry keys resolve to real decisions and real option keys.
  var prefix = decisions.length ? decisions[0].decisionId.split('_')[0] + '_' : null;
  [['CONSEQUENCE_MAP', ctx.CONSEQUENCE_MAP], ['STYLE_TAGS', ctx.STYLE_TAGS],
   ['SOFT_METRIC_EFFECTS', ctx.SOFT_METRIC_EFFECTS], ['UTILITY_EFFECTS', ctx.UTILITY_EFFECTS]
  ].forEach(function (pair) {
    var name = pair[0], registry = pair[1];
    Object.keys(registry).forEach(function (key) {
      if (!prefix || key.indexOf(prefix) !== 0) return;
      var d = byId[key];
      if (!d) { fail(name + '["' + key + '"] has no matching decision'); return; }
      var keys = optionKeys(d);
      Object.keys(registry[key]).forEach(function (optKey) {
        if (keys.indexOf(optKey) === -1) {
          fail(name + '["' + key + '"] references option "' + optKey + '" which does not exist');
        }
      });
    });
  });

  // 4. Metric keys exist in this persona's defaults.
  var softDefaults = ctx.SOFT_METRIC_DEFAULTS[id] || {};
  var utilDefaults = ctx.UTILITY_DEFAULTS[id] || {};
  [['SOFT_METRIC_EFFECTS', ctx.SOFT_METRIC_EFFECTS, softDefaults],
   ['UTILITY_EFFECTS', ctx.UTILITY_EFFECTS, utilDefaults]
  ].forEach(function (triple) {
    var name = triple[0], registry = triple[1], defaults = triple[2];
    Object.keys(registry).forEach(function (key) {
      if (!prefix || key.indexOf(prefix) !== 0) return;
      Object.keys(registry[key]).forEach(function (optKey) {
        Object.keys(registry[key][optKey]).forEach(function (metric) {
          if (!defaults[metric]) fail(name + '["' + key + '"]["' + optKey + '"] uses unknown metric "' + metric + '"');
        });
      });
    });
  });

  // 6. Depth counts.
  var consequenceIds = Object.keys(ctx.CONSEQUENCE_MAP).filter(function (k) {
    return prefix && k.indexOf(prefix) === 0;
  });
  var stateChangeIds = consequenceIds.filter(function (k) {
    return Object.keys(ctx.CONSEQUENCE_MAP[k]).some(function (optKey) {
      return typeof ctx.CONSEQUENCE_MAP[k][optKey].stateChange === 'function';
    });
  });

  var c = {
    events: events.length,
    decisions: decisions.length,
    noise: (ctx.NOISE_POOL[id] || []).length,
    consequences: consequenceIds.length,
    stateChanges: stateChangeIds.length,
    locks: lockCount
  };
  counts[id] = c;

  Object.keys(FLOORS).forEach(function (metric) {
    if (c[metric] < FLOORS[metric]) {
      fail(metric + ' = ' + c[metric] + ', floor is ' + FLOORS[metric]);
    }
  });
}

function main() {
  var args = process.argv.slice(2);
  var countsOnly = args.indexOf('--counts') !== -1;
  var targets = args.filter(function (a) { return a !== '--counts'; });
  if (!targets.length) targets = Object.keys(PERSONAS);

  var ctx = loadContext();
  var errors = [];
  var counts = {};
  targets.forEach(function (id) {
    if (!PERSONAS[id]) { errors.push('unknown persona "' + id + '"'); return; }
    checkPersona(ctx, id, errors, counts);
  });

  console.log(['persona', 'events', 'decisions', 'noise', 'conseq', 'stateChg', 'locks'].join('\t'));
  Object.keys(counts).forEach(function (id) {
    var c = counts[id];
    console.log([id, c.events, c.decisions, c.noise, c.consequences, c.stateChanges, c.locks].join('\t'));
  });

  if (countsOnly) return;

  if (errors.length) {
    console.error('\n' + errors.length + ' violation(s):');
    errors.forEach(function (e) { console.error('  - ' + e); });
    process.exit(1);
  }
  console.log('\nAll persona invariants pass.');
}

main();
