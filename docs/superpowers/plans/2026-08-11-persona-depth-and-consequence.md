# Persona Depth and Consequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all six personas longer, consequential and fully documented for facilitators, and fix the engine bug that currently corrupts the debrief.

**Architecture:** The engine (`src/nz-cascading-impact-simulator.js`) already implements every mechanic needed; the personas simply don't use them. Tasks 1-3 fix a decision-identity bug, cap event pacing, and add a headless invariant checker. Tasks 4-9 uplift one persona file each — the files are self-contained and touch only their own registry keys, so they are independent.

**Tech Stack:** Plain ES5 browser JavaScript, no build step, no framework. Script tags in `src/index.html`. Node.js (`node:vm`, no dependencies) for the invariant checker.

## Global Constraints

- ES5 only in `src/` — `var`, no arrow functions, no template literals, no `const`/`let`. Match the surrounding style exactly.
- No new runtime dependencies. No build step. `src/index.html:995-1000` must not need changes.
- Persona files stay purely additive: each registers itself by extending engine registries inside an IIFE.
- Do NOT rewrite existing persona prose for tone. The user explicitly ruled that out. Existing body/option text changes only where a mechanical change requires it.
- Per-persona floors enforced by the checker: events >= 30, decisions >= 20, noise pool >= 10, `CONSEQUENCE_MAP` entries >= 12, entries carrying `stateChange` >= 12, locked options >= 3, facilitator-note coverage == 100%.
- Authoring targets sit just above the floors: ~32 events, ~22 decisions, ~15 `stateChange`, 3-4 locks.
- British/NZ English spelling, consistent with existing content ("prioritise", "recognise").
- Commit after each task.

---

### Task 1: Fix decision-identity matching

`GameState.decisions` records omit `decisionId`, so three consumers re-derive it by scanning `choiceLog` for any decision whose chosen option *letter* matches. Letters collide constantly, so the facilitator guide shows the wrong teaching note, `buildConsequenceChain` attributes consequences to the wrong decision, and `generateStyleProfile` (which lacks a `break`) accumulates tags from every decision sharing that letter.

**Files:**
- Modify: `src/nz-cascading-impact-simulator.js:924` (record push)
- Modify: `src/nz-cascading-impact-simulator.js:1588-1595` (facilitator guide)
- Modify: `src/nz-cascading-impact-simulator.js:2072-2088` (`generateStyleProfile`)
- Modify: `src/nz-cascading-impact-simulator.js:2104-2114` (`buildConsequenceChain`)
- Create: `tools/check-personas.js` is Task 3; this task is verified manually in-browser plus by the Task 3 checker afterwards.

**Interfaces:**
- Produces: every element of `GameState.decisions` gains `decisionId` (string). Noise decisions carry the decision title as their id (existing fallback at `:907`), which matches no registry entry, so consumers skip them exactly as before.

- [ ] **Step 1: Add `decisionId` to the pushed record**

In `makeDecision`, at the `GameState.decisions.push(...)` call, add `decisionId: decId` as the first property:

```js
  GameState.decisions.push({ decisionId: decId, time: currentDecision.time, key: key, label: option.label, desc: option.desc || '', title: currentDecision.title, score: option.effect ? (option.effect.score || 0) : 0, isNoise: currentDecision.isNoise || false });
```

- [ ] **Step 2: Use it in the facilitator guide**

Replace the scan loop inside the `for (var fg = ...)` body:

```js
      var fd = GameState.decisions[fg];
      var fn = fd.decisionId ? FACILITATOR_NOTES[fd.decisionId] : null;
      if (!fn) continue;
```

(Deletes the `var fDecId = null;` declaration and the `for (var fid in GameState.choiceLog)` loop.)

- [ ] **Step 3: Use it in `generateStyleProfile`**

Replace the whole body of the outer loop:

```js
  for (var i = 0; i < GameState.decisions.length; i++) {
    var d = GameState.decisions[i];
    var tags = d.decisionId && STYLE_TAGS[d.decisionId] ? STYLE_TAGS[d.decisionId][d.key] : null;
    if (!tags) continue;
    for (var axis in tags) {
      totals[axis] = (totals[axis] || 0) + tags[axis];
      counts[axis] = (counts[axis] || 0) + 1;
    }
  }
```

- [ ] **Step 4: Use it in `buildConsequenceChain`**

Replace the scan with a direct lookup:

```js
  for (var i = 0; i < GameState.decisions.length; i++) {
    var d = GameState.decisions[i];
    if (!d.decisionId) continue;
    var consequence = CONSEQUENCE_MAP[d.decisionId] && CONSEQUENCE_MAP[d.decisionId][d.key];
    if (consequence && consequence.inject) {
      chains.push({
        sourceDecision: d.title,
        sourceTime: d.time,
        sourceKey: d.key,
        sourceLabel: d.label,
        consequenceTitle: consequence.inject.title,
        consequenceBody: consequence.inject.body,
        scorePenalty: consequence.inject.scorePenalty || 0
      });
    }
  }
```

- [ ] **Step 5: Verify in the browser**

Open `src/index.html`, enable facilitator mode, play the `ngata` persona choosing option **A** on at least three consecutive decisions (the case that previously collided), reach the debrief, open the Facilitator Guide tab.
Expected: each row's teaching note matches its own decision title, and "Best: X" reflects that decision's own `bestPractice`.

- [ ] **Step 6: Commit**

```bash
git add src/nz-cascading-impact-simulator.js
git commit -m "fix: attribute debrief content by decisionId, not option letter"
```

---

### Task 2: Cap inter-event delay

`processNextEvent` computes `delay` as 200ms per sim-minute of gap with no upper bound, so a 60-minute gap renders as 12 seconds of dead air. Longer persona timelines make this worse.

**Files:**
- Modify: `src/nz-cascading-impact-simulator.js:765`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Apply the cap**

```js
  var delay = GameState.eventIndex === 0 ? 1000 : Math.min(4000, Math.max(2000, (event.time - prevTime) * 200));
```

- [ ] **Step 2: Verify in the browser**

Play the `af8` scenario, which has 40-50 minute gaps, and confirm no wait between events exceeds ~4 seconds.

- [ ] **Step 3: Commit**

```bash
git add src/nz-cascading-impact-simulator.js
git commit -m "fix: cap inter-event delay at 4s so long timelines don't stall"
```

---

### Task 3: Headless persona invariant checker

There is no test framework. This script is the test gate for Tasks 4-9. The engine has no top-level DOM access, so engine and persona sources evaluate cleanly in a bare `node:vm` context with no stubs.

**Files:**
- Create: `tools/check-personas.js`

**Interfaces:**
- Consumes: `decisionId` on decision events; all engine registries.
- Produces: CLI `node tools/check-personas.js [personaId...]`. Exit 0 when clean, exit 1 and a list of violations otherwise. `--counts` prints the per-persona count table without failing on floor violations.

- [ ] **Step 1: Write the checker**

```js
// Headless invariant checker for persona definitions.
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

  // 1. Every decision has facilitator notes.
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

  // 6. Counts.
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

  var header = ['persona', 'events', 'decisions', 'noise', 'conseq', 'stateChg', 'locks'];
  console.log(header.join('\t'));
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
```

- [ ] **Step 2: Run it and confirm it fails against today's content**

Run: `node tools/check-personas.js`
Expected: exit 1, with violations on every persona — missing facilitator notes for roughly half the decisions, and floor failures for events, decisions, noise, consequences, stateChanges and locks. This proves the checker detects the gaps Tasks 4-9 close.

- [ ] **Step 3: Confirm the counts view works**

Run: `node tools/check-personas.js --counts`
Expected: exit 0 and a six-row table matching the current-state table in the spec.

- [ ] **Step 4: Commit**

```bash
git add tools/check-personas.js
git commit -m "test: add headless persona invariant checker"
```

---

## Tasks 4-9: Persona uplift

Tasks 4-9 are the same six steps applied to one persona file each. They are independent — no task consumes anything from another — so they may be done in any order, but each must end with its own passing check and commit.

**The shared six steps, per persona:**

- [ ] **Step 1: Add events to reach ~32 events / ~22 decisions**

Append and interleave new `decision` events in `PERSONA_EVENTS.<id>`, keeping `time` values monotonically increasing and gaps in the existing 10-15 minute range. Each new decision needs: `time`, `type: 'decision'`, `tag`, `title`, `body`, `decisionId` (prefixed to match the persona's existing convention), `prompt`, and 3-4 `options` each with `key`, `label`, `desc` and `effect: { score }`. Score magnitudes follow the existing convention: best option +5, weak -2 or -3, worst -5 or -6.

- [ ] **Step 2: Register effects for every new decision**

Every new `decisionId` gets entries in `SOFT_METRIC_EFFECTS` and `STYLE_TAGS`, and in `UTILITY_EFFECTS` where the choice consumes a tracked resource. Metric keys must already exist in that persona's `SOFT_METRIC_DEFAULTS` / `UTILITY_DEFAULTS` — the checker enforces this.

- [ ] **Step 3: Grow the noise pool from 5 to 10**

Append five more `NOISE_POOL.<id>` entries in the existing shape (`tag: 'NOISE'`, `title`, `body`, `source`, `prompt`, three `options` with `effect: { score }` in the -3..+2 range). Noise entries have no `decisionId` and no facilitator notes.

- [ ] **Step 4: Add consequences with visible state change**

Grow `CONSEQUENCE_MAP.<id>` to at least 12 decisions, with two or more option keys covered on the pivotal ones. Every consequence entry pairs a reactive `inject` with a `stateChange` function that visibly moves the common operating picture, using the engine mutators:

```js
    'ngata_generator': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Generator Dies Mid-Procedure',
          body: '...',
          source: 'Practice Manager',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Power (generator)', 'Failed', 'failed');
          updateUtilityDirect('power', 0);
          updateCascadeItem('cascade-tracker', 'Refrigeration Loss', 'High', 'high');
        }
      }
    },
```

The mutators match by label and silently no-op on a typo, so every label used must exist in that persona's `SCENARIO_CONFIGS[...].panels` or `UTILITY_DEFAULTS[...]`. Verify each label by reading the persona's own config block.

- [ ] **Step 5: Add 3-4 locked options**

Give later decisions path dependency on earlier ones. The predicate receives `GameState.choiceLog` and should return a reason string so the player sees why:

```js
        { key: 'A', label: 'Send a small forward team to the school', desc: '...', effect: { score: 5 },
          locked: function (log) {
            return log['ngata_school'] === 'B' ? 'You already sent most of your clinical staff to the school' : false;
          } },
```

- [ ] **Step 6: Write facilitator notes for every decision**

Bring `FACILITATOR_NOTES` to 100% coverage of this persona's `decisionId`s — the pre-existing undocumented decisions as well as the new ones. Each needs `learningObjective`, `bestPractice` (an option key that exists on that decision), `teachingNote`, `references` (array of `{label, desc}`) and `discussionPrompts` (array of strings), matching the depth of the existing six entries.

- [ ] **Step 7: Run the checker for this persona**

Run: `node tools/check-personas.js <personaId>`
Expected: exit 0, "All persona invariants pass."

- [ ] **Step 8: Commit**

```bash
git add src/personas/<file>.js
git commit -m "feat: deepen <persona> — more decisions, real consequences, full facilitator notes"
```

---

### Task 4: Emily Ngata (`ngata`)

**Files:** Modify `src/personas/emily-ngata.js`. Checker id: `ngata`.

From 18 events / 13 decisions to ~32 / ~22. Nine new decisions drawn from the unmined brief material in `designs/Persona Dr Emily Ngata.txt`: morphine and pain-relief rationing; end-of-life care for unsurvivable injuries; the patient refusing treatment while family insists it continue; generator failure and what stays powered; the pharmacist collapsing from exhaustion; the EOC asking her to become Medical Advisor and leave clinical care; her own child arriving unexpectedly and asking to go home; dialysis patients unable to travel; and the four conflicting-advice channels currently rendered only as static panel decoration at `emily-ngata.js:46-53` (Regional Hospital "transfer all" vs Heli Coordinator "hold critical" vs National Clinical Group "conserve meds" vs the local paramedic's treat-in-vehicles proposal against the senior nurse's safety objection).

Natural locks: sending most staff to the school (`ngata_school` = B) should close later forward-deployment options; handing the Fire Service everything (`ngata_fire_supplies` = B) should close later options that spend supplies.

Existing decision ids needing notes added: `ngata_blood`, `ngata_ventilator`, `ngata_school`, `ngata_ambulance`, `ngata_fire_supplies`, `ngata_oxygen_welfare`, `ngata_media`.

### Task 5: Michael Te Rangi (`terangi`)

**Files:** Modify `src/personas/michael-terangi.js`. Checker id: `terangi`.

From 18 / 13 to ~32 / ~22. Unmined material in `designs/Persona Michael Te Rangi.txt`: the EOC requesting exclusive priority restoration; the rest home report; the supermarket offering to privately fund repairs to its own feeder (equity versus speed); main transmission corridor damage. Remaining decisions authored from the brief's themes — SCADA blindness and deciding without visibility, restoration sequencing against critical-customer lists (hospital, water treatment, wastewater, fuel terminals, telecommunications sites, dairy factories, Police and Fire stations), fuel logistics for crews, and public communication of an outage duration nobody can honestly estimate.

Existing decision ids needing notes added: identify the seven without entries by running `node tools/check-personas.js terangi`.

### Task 6: Sarah Chen (`sarahchen`)

**Files:** Modify `src/personas/sarah-chen.js`. Checker id: `sarahchen`.

From 18 / 13 to ~32 / ~22. Unmined material in `designs/Persona Sarah Chen.txt`: the supermarket manager's supply-pooling proposal; the bank representative's call about the personally guaranteed loan; the two migrant staff with no family in New Zealand; gas-leak and liability exposure while customers keep entering a structurally damaged shop. Remaining decisions from the brief's themes — cash-only trading with no EFTPOS, rationing scarce stock with no obviously fair answer, her volunteer-firefighter husband's absence, and four weeks of wages against an indefinite closure.

Existing decision ids needing notes added: run `node tools/check-personas.js sarahchen`.

### Task 7: Mark Williams (`markwilliams`)

**Files:** Modify `src/personas/mark-williams.js`. Checker id: `markwilliams`.

From 17 / 13 to ~32 / ~22. Note that `designs/Persona Mark Williams.txt` concatenates three personas — Williams' own brief is lines 1-925 only. Unmined: the tunnel-versus-van shelter trade-off as a decision in its own right (rockfall exposure versus crush risk versus cold); overnight cold and weather exposure; ongoing monitoring of the concussed child; water, food and toileting for eight children; keeping two siblings together against splitting the group. Remaining decisions from the brief's themes — the asthmatic child's inhaler, managing eight frightened children's phones and their parents simultaneously, and decisions well outside a coach's expertise.

Existing decision ids needing notes added: run `node tools/check-personas.js markwilliams`.

### Task 8: School Principal (`principal`)

**Files:** Modify `src/personas/principal.js`. Checker id: `principal`.

From 23 / 17 to ~32 / ~22 — the smallest content gap of the six, five new decisions. Unmined material in `designs/Persona School Principal.txt`: international students living with host families; students with epilepsy, wheelchair users and students with autism; medication unavailable at school; toilets and sanitation across a long day and overnight; separation of students from unknown adults; parents arriving without identification against custody and protection orders; and the four parent archetypes (Angry, Protective, Distrustful, Social Media) as distinct pressure sources — good candidates for the five new noise entries as well.

This file already has one `stateChange` (the only one in the codebase) — follow its shape for the rest.

Existing decision ids needing notes added: run `node tools/check-personas.js principal`.

### Task 9: Seismic Science Advisor (`seismic`)

**Files:** Modify `src/personas/seismic-scientist.js`. Checker id: `seismic`.

From 19 / 13 to ~32 / ~22. **No source brief exists** — `designs/` holds briefs for Ngata, Williams, Chen, Te Rangi and the Principal only. All nine new decisions must be authored fresh from the persona's established themes, visible in its existing decision ids: aftershock forecasting and probability communication (`sci_aftershock`, `sci_certainty`), public messaging (`sci_messaging`, `sci_maps`), field deployment under risk (`sci_deploy`, `sci_road`), cascading geohazards (`sci_landslide_dam`), political and ministerial pressure (`sci_minister`, `sci_leak`), scientific disagreement and peer review under time pressure (`sci_conflicting`, `sci_peer_review`), mana whenua engagement (`sci_mana_whenua`), and equity of monitoring coverage (`sci_equity`).

This is the highest-effort persona. Before writing, read the whole of `src/personas/seismic-scientist.js` to absorb its register and the `SOFT_METRIC_DEFAULTS.seismic` axes, so new decisions score against the same axes as the existing thirteen.

Existing decision ids needing notes added: run `node tools/check-personas.js seismic`.

---

### Task 10: Full-suite verification

**Files:** No source changes expected. If the checker fails, fix the offending persona file and re-run.

- [ ] **Step 1: Run the whole suite**

Run: `node tools/check-personas.js`
Expected: exit 0, six-row count table with every persona at or above the floors, "All persona invariants pass."

- [ ] **Step 2: Manual browser pass**

Open `src/index.html` and play one persona end to end with facilitator mode on. Confirm all four:
1. The common operating picture visibly changes during the run — panel values, cascade levels or resource meters move in response to decisions.
2. At least one option renders struck through with a reason naming an earlier choice.
3. The debrief's Facilitator Guide has an entry for every decision made, with the teaching note matching its own decision title.
4. No wait between events exceeds ~4 seconds.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve persona invariant violations found in full-suite check"
```

---

## Self-Review

**Spec coverage:** Part 1 (bug fix) → Task 1. Part 2 (length, noise pools) → Tasks 4-9 Steps 1-3. Part 3.1 (`stateChange`) → Step 4. Part 3.2 (`CONSEQUENCE_MAP`) → Step 4. Part 3.3 (locks) → Step 5. Part 4 (facilitator notes) → Step 6. Part 5 (pacing) → Task 2. Verification → Tasks 3 and 10. Sequencing → task order. No gaps.

**Known deviation from the skill's TDD default:** this repo has no test framework and the deliverable for Tasks 4-9 is authored scenario content, not logic. Writing each of ~130 new decisions twice — once as a test fixture, once as content — would produce a plan larger than the implementation with no defect-detection benefit. Instead the checker (Task 3) is written and proven failing against current content *before* any persona work begins, and it is the gate every persona task must pass. Tasks 1-3, which are logic, keep a real fail-then-pass cycle.
