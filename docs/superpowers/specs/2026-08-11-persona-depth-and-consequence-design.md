# Persona Depth and Consequence — Design

Date: 2026-08-11
Status: Approved for planning

## Problem

User feedback on the six implemented personas: they are **too short** and **not hard
hitting enough**. Diagnosis confirmed with the user resolves to three concrete gaps:

1. Runs are too short.
2. Choices don't bite — decisions feel consequence-free.
3. The debrief is thin — facilitator notes cover under half the decisions.

Explicitly **out of scope**: rewriting persona prose for tone. The user ruled this out.
Existing body and option text stays as it is unless a mechanical change requires editing it.

## Current state

Six personas, each a self-registering IIFE under `src/personas/` loaded after the engine
by `src/index.html:995-1000`. Each extends shared engine registries: `SCENARIO_CONFIGS`,
`PERSONA_EVENTS`, `NOISE_POOL`, `UTILITY_DEFAULTS`, `SOFT_METRIC_DEFAULTS`,
`UTILITY_EFFECTS`, `SOFT_METRIC_EFFECTS`, `STYLE_TAGS`, `CONSEQUENCE_MAP`,
`FACILITATOR_NOTES`.

| File | Events | Decisions | Fac. notes | Consequence entries | `stateChange` | Locked options | Noise |
|---|---|---|---|---|---|---|---|
| `emily-ngata.js` | 18 | 13 | 6 | 3 | 0 | 0 | 5 |
| `mark-williams.js` | 17 | 13 | 6 | 4 | 0 | 0 | 5 |
| `michael-terangi.js` | 18 | 13 | 6 | 3 | 0 | 0 | 5 |
| `sarah-chen.js` | 18 | 13 | 6 | 3 | 0 | 0 | 5 |
| `seismic-scientist.js` | 19 | 13 | 6 | 3 | 0 | 0 | 5 |
| `principal.js` | 23 | 17 | 8 | 5 | 1 | 0 | 5 |
| base `af8` + `local` (reference) | 65 | 24 | full | heavy | 26 | 5 | 24 |

The base scenario is the existence proof: every mechanic needed already works in this
engine. The personas simply do not use them.

## Part 1 — Engine bug fix (blocking prerequisite)

`GameState.decisions` records omit the `decisionId`
(`src/nz-cascading-impact-simulator.js:924`). Three consumers re-derive it by scanning
`choiceLog` for any decision whose **chosen option letter** matches:

- `src/nz-cascading-impact-simulator.js:1591-1592` — facilitator guide
- `src/nz-cascading-impact-simulator.js:2076-2087` — `generateStyleProfile`
- `src/nz-cascading-impact-simulator.js:2108-2113` — `buildConsequenceChain`

With 13 decisions over 3-4 options, letters collide constantly, so:

- The facilitator guide renders the **wrong** teaching note, learning objective and
  "Best: X" comparison against a decision's title.
- `buildConsequenceChain` attributes consequences to the wrong source decision.
- `generateStyleProfile` has no `break`, so it accumulates style tags from **every**
  decision sharing that letter — the resulting profile is noise.

This scales with decision count and would corrupt the very debrief Part 4 is meant to
enrich, so it lands first.

**Fix:** include `decisionId: decId` in the object pushed at `:924`, then replace all
three scan loops with a direct `d.decisionId` lookup. Noise decisions have no
`decisionId` (they fall back to `currentDecision.title` at `:907`); consumers must skip
records whose `decisionId` has no registry entry, which is the existing behaviour for
unmatched ids.

## Part 2 — Length

**Target per persona: ~32 events, ~22 decisions.** `principal.js` starts at 23/17 and
needs the least; the other five go from ~18/13.

Source material. Each brief's numbered `Inject N` items are largely already implemented,
so most new decisions come from the briefs' unmined thematic sections and from net-new
material authored in the same register and consistent with each brief's stated assessment
criteria. Expect roughly 3-5 recoverable threads per persona from the briefs and the
remainder authored fresh.

Note: `designs/Persona Mark Williams.txt` contains three personas concatenated (Williams,
Chen, Principal). Its size does not indicate unused Williams material.

Confirmed unmined seams:

- **Emily Ngata** — morphine/pain-relief rationing; end-of-life care for unsurvivable
  injuries; the patient refusing treatment while family insists; generator failure; the
  pharmacist collapsing from exhaustion; the EOC requesting she become Medical Advisor
  (removing her from clinical care); her own child arriving unexpectedly; dialysis
  patients unable to travel; the four conflicting-advice channels currently rendered only
  as static panel decoration (`emily-ngata.js:46-53`); the landslide blocking the access
  road; the commercial fire; social-media rumours.
- **Michael Te Rangi** — EOC requesting exclusive priority restoration; the rest home
  report; the supermarket offering to privately fund repairs to its own feeder; main
  transmission corridor damage.
- **Sarah Chen** — the supermarket manager's supply-pooling proposal; the bank
  representative's call; migrant staff with no family in New Zealand; gas-leak/liability
  exposure while customers keep entering.
- **Mark Williams** — the tunnel-versus-van shelter trade-off in its own right; cold and
  weather exposure overnight; ongoing monitoring of the concussed child; water, food and
  toileting for eight children; sibling separation.
- **School Principal** — already closest to target. Unmined: international students living
  with host families; students with epilepsy, wheelchair users and students with autism;
  medication unavailable at school; toilets and sanitation over a long day; separation of
  students from unknown adults; parents arriving without identification against custody
  and protection orders; the four parent archetypes (Angry, Protective, Distrustful,
  Social Media) as distinct pressure sources.
- **Seismic Scientist** — **no source brief exists.** `designs/` holds briefs for Ngata,
  Williams, Chen, Te Rangi and the Principal only; `seismic-scientist.js` was authored
  without one. All ~9 new decisions must be written fresh from the persona's existing
  themes (aftershock forecasting, scientific uncertainty in public messaging, advisory
  conflict, peer review under time pressure, mana whenua engagement, information leaks,
  equity of coverage). This is the highest-effort persona of the six and should be planned
  as such.

**Noise pools: 5 → 10 per persona.** With `NOISE_CONFIG = {minGap: 3, maxGap: 5,
startAfterEvent: 3}` (`nz-cascading-impact-simulator.js:2770`), a ~32-event run fires
noise roughly 7-8 times. A 5-item pool empties around two-thirds through, so the back half
of every longer session would lose its interference entirely.

## Part 3 — Bite

Three mechanics, all proven in the base scenario, all effectively unused by personas.

### 3.1 `stateChange` — target ~15 per persona

This is the main reason a persona run feels inert: the common operating picture never
moves. Base scenario uses `stateChange` 26 times; the personas use it once in total
(`principal.js`).

Wire consequences to the existing mutators so a bad call is visible on screen:

- `updatePanelItem(panelId, label, newValue, newCls)` — `:1342`
- `updateMeterItem(panelId, label, newPct, newCls)` — `:1368`
- `updateCascadeItem(trackerId, name, newLevel, newCls)` — `:1397`
- `updateUtilityDirect(utilKey, newValue)` — `:1900`

Every `stateChange` must target a label that exists in that persona's
`SCENARIO_CONFIGS[...].panels` or `UTILITY_DEFAULTS[...]` — the mutators match by label
and silently no-op on a typo.

### 3.2 `CONSEQUENCE_MAP` — cover at least 12 of ~22 decisions

Currently 3-5 entries per persona, so roughly ten of thirteen choices produce no reactive
inject at all. Pivotal decisions get entries on two or more option keys, not just the
single worst one. Reactive injects use the existing shape (`type`, `tag`, `title`, `body`,
`source`, `scorePenalty`, optional `aftershock`) and fire 3s after the choice via
`applyConsequences` (`:1017-1039`).

### 3.3 `opt.locked` — 3-4 per persona

`opt.locked(choiceLog)` is supported at `showDecision` (`:842-848`) and renders the option
struck through with a reason string. Base scenario uses it 5 times; personas never. Use it
for genuine path dependency — e.g. stripping the clinic to answer the school call at H+90
crosses out the forward-team option later, with the reason naming the earlier choice.

The predicate returns `true` or a reason `string`; returning a string is preferred so the
player sees *why*.

## Part 4 — Debrief completeness

`FACILITATOR_NOTES` currently covers 6 of 13 decisions (8 of 17 for `principal`).
Undocumented decisions are silently skipped (`:1595`), so over half of each run is absent
from the facilitator guide.

**Target: 100% coverage.** Every `decisionId` gets `learningObjective`, `bestPractice`,
`teachingNote`, `references` (array of `{label, desc}`) and `discussionPrompts` (array of
strings). `bestPractice` must name an option key that exists on that decision — the
debrief compares against it directly at `:1598`.

## Part 5 — Pacing tweak

`processNextEvent` computes `delay = Math.max(2000, (event.time - prevTime) * 200)`
(`:765`). Longer timelines mean larger sim-time gaps and dead air — a 60-minute gap
renders as 12 seconds of nothing. Change to
`Math.min(4000, Math.max(2000, (event.time - prevTime) * 200))`.

This affects the base scenarios too, which already have 40-50 minute gaps. That is
intended: the cap improves them equally.

## Verification

There is no test harness — the app is plain script tags with no build step. Add
`tools/check-personas.js`, a dependency-free Node script that stubs the browser globals,
loads the engine and each persona file, and asserts these invariants per persona:

1. Every `decisionId` in `PERSONA_EVENTS[id]` has a `FACILITATOR_NOTES` entry.
2. Every `FACILITATOR_NOTES[...].bestPractice` names an option key present on that
   decision.
3. Every key in `CONSEQUENCE_MAP`, `STYLE_TAGS`, `SOFT_METRIC_EFFECTS` and
   `UTILITY_EFFECTS` that is namespaced to a persona corresponds to a real `decisionId`.
4. Every `SOFT_METRIC_EFFECTS` / `UTILITY_EFFECTS` metric key exists in that persona's
   `SOFT_METRIC_DEFAULTS` / `UTILITY_DEFAULTS`.
5. Every option key referenced in a `CONSEQUENCE_MAP` or `STYLE_TAGS` sub-object exists on
   the corresponding decision.
6. Counts meet the floors: events >= 30, decisions >= 20, noise pool >= 10,
   `CONSEQUENCE_MAP` entries >= 12, `stateChange` count >= 12, locked options >= 3,
   facilitator-note coverage == 100%. These are the enforced minima; the authoring
   targets in Parts 2 and 3 (~32 events, ~22 decisions, ~15 `stateChange`, 3-4 locks) sit
   just above them so ordinary variation does not fail the check.

Manual verification alongside the script: play one full run of one persona in the browser
and confirm the COP visibly changes, a locked option appears struck through, and the
debrief's facilitator guide names the correct decision against each teaching note.

## Sequencing

The engine work is shared and blocking; the persona work is six independent files that
touch only their own registry keys.

1. Part 1 bug fix and Part 5 pacing tweak, plus the check-script skeleton from
   Verification.
2. All six personas in parallel, per file: events -> consequences / `stateChange` /
   locked options -> facilitator notes. Notes are written last so they are authored
   against the final decision set.
3. Run the check script; fix violations; manual browser pass.

## Accepted consequences

- **Session length.** ~22 decisions plus ~8 noise interrupts is roughly a 45-60 minute
  run per persona, up from ~25-30 minutes. This is the direct and intended consequence of
  "too short", but it changes how these are facilitated.
- **File size.** Persona files grow from ~575 to ~950-1000 lines. That remains within the
  established pattern (`principal.js` is already 834).
