// ============================================================================
// PERSONA: VOLUNTEER PARENT MANAGER  -  Mark Williams
// One adult, eight children (11-13), a 12-seat minivan stranded on a remote
// alpine highway when a M7.9 Alpine Fault earthquake strikes. Every option
// exposes someone to risk; there are no perfect decisions.
// Source brief: "Persona Mark Williams".
//
// Loaded AFTER nz-cascading-impact-simulator.js; registers itself by extending
// the engine's shared registries (purely additive).
// ============================================================================
(function () {
  'use strict';

  SCENARIO_CONFIGS.markwilliams = {
    label: 'PARENT MANAGER',
    actorTitle: 'Mark',
    classification: 'R3',
    classCSS: 'r3',
    classText: 'STRANDED - REMOTE',
    debriefName: 'M7.9 Alpine Fault - Under-13 Team Van',
    facObjective: 'a lone adult responsible for eight children stranded on a remote alpine highway, making impossible ' +
      'decisions where every option exposes someone to risk. Key themes: protecting children’s lives, child-centred and ' +
      'defensible ethics, fairness, medical prioritisation, managing fear and misinformation, and emotional leadership ' +
      'under deep uncertainty.',
    startScore: 50,
    metrics: { children: 8, injured: 2, fuelHours: 6 },
    // No status bar: every item restated a panel row, and because the strip is
    // never re-rendered it went stale the moment a consequence moved the panel
    // ("Children: 8 aboard" above a roster reading 5 / 8).
    statusBar: [],
    panels: {
      groupsTitle: 'The Children',
      groups: [
        { label: 'Children Aboard', value: '8 / 8', cls: 'good' },
        { label: 'Broken Arm', value: '1', cls: 'degraded' },
        { label: 'Head Injury (drowsy)', value: '1', cls: 'failed' },
        { label: 'Panic Attack', value: '1', cls: 'degraded' },
        { label: 'Asthma (low inhaler)', value: '1', cls: 'degraded' },
        { label: 'Diabetic (insulin trapped)', value: '1', cls: 'failed' }
      ],
      agenciesTitle: 'Conflicting Advice',
      agencies: [
        { label: 'NZ Police', value: '"Stay put"', cls: 'unknown' },
        { label: 'Fire Service', value: '"Move off slopes"', cls: 'unknown' },
        { label: 'Ambulance', value: 'Cannot Reach', cls: 'failed' },
        { label: 'Parents', value: 'Calling', cls: 'degraded' },
        { label: 'Passing Truckie', value: '"Bridge open"', cls: 'unknown' },
        { label: 'Local Farmer', value: '"Follow me"', cls: 'unknown' }
      ],
      lifelinesTitle: 'Comms & Phones',
      lifelines: [
        { label: 'Cell Coverage', value: 'Patchy', cls: 'degraded' },
        { label: 'Parent Calls', value: 'Flooding', cls: 'degraded' },
        { label: 'Social Media', value: 'Spreading', cls: 'failed' }
      ],
      transportTitle: 'Road & Terrain',
      transport: [
        { label: 'Road Ahead', value: 'Bridge Damaged', cls: 'failed' },
        { label: 'Road Behind', value: 'Rockfall', cls: 'failed' },
        { label: 'Tunnel (800m)', value: 'Unknown', cls: 'unknown' },
        { label: 'River Below', value: 'Rising', cls: 'degraded' },
        { label: 'Steep Slopes', value: 'Unstable', cls: 'failed' }
      ],
      cascadeTitle: 'Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '🪨', name: 'Rockfall', level: 'High', cls: 'high' },
        { icon: '🌊', name: 'Tsunami (river)', level: 'Watch', cls: 'moderate' },
        { icon: '❄️', name: 'Overnight Snow', level: 'High', cls: 'high' }
      ],
      resourcesTitle: 'Supplies'
    }
  };

  UTILITY_DEFAULTS.markwilliams = {
    water: { label: 'Water (4 bottles)', value: 40, unit: '%' },
    food: { label: 'Snacks (8 bars)', value: 40, unit: '%' },
    warmth: { label: 'Warmth', value: 25, unit: '%' },
    fuel: { label: 'Van Fuel', value: 50, unit: '%' },
    phoneBattery: { label: 'Phone Battery', value: 45, unit: '%' },
    firstAid: { label: 'First Aid', value: 20, unit: '%' }
  };

  SOFT_METRIC_DEFAULTS.markwilliams = {
    childSafety: { label: 'Child Safety', value: 60, icon: '🛡️' },
    groupCalm: { label: 'Group Calm', value: 55, icon: '🧘' },
    parentTrust: { label: 'Parent Trust', value: 55, icon: '🤝' },
    fairness: { label: 'Fairness', value: 60, icon: '⚖️' },
    composure: { label: 'Composure', value: 60, icon: '🫡' },
    comms: { label: 'Communication', value: 50, icon: '📢' }
  };

  Object.assign(UTILITY_EFFECTS, {
    'mark_phones': { 'A': { phoneBattery: -5 } },
    'mark_insulin': { 'A': { firstAid: 10 } },
    'mark_night': { 'A': { warmth: 8, fuel: -5 }, 'C': { warmth: 10, fuel: -25 } },
    'mark_tunnel': { 'A': { warmth: -5 }, 'B': { warmth: 5, water: -10, food: -10, firstAid: -10 }, 'D': { warmth: -5 } },
    'mark_headinjury': { 'A': { firstAid: -5, phoneBattery: -5 }, 'C': { firstAid: -10, warmth: -10 } },
    'mark_asthma': { 'A': { firstAid: -5 }, 'B': { firstAid: -15 }, 'D': { firstAid: -5 } },
    'mark_count': { 'B': { warmth: -10 }, 'C': { food: -10, water: -10 } },
    'mark_water': { 'A': { water: -15, food: -15 }, 'B': { water: -35, food: -35 }, 'D': { water: -10, food: -10 } },
    'mark_cold': { 'A': { warmth: 12 }, 'B': { warmth: 20, fuel: -15 }, 'C': { warmth: -5, food: -10 }, 'D': { warmth: -15 } },
    'mark_parent_arrives': { 'A': { warmth: 3 }, 'B': { warmth: 5 } },
    'mark_ema': { 'A': { phoneBattery: -5 }, 'C': { phoneBattery: -5 }, 'D': { phoneBattery: 5 } },
    'mark_handover': { 'A': { phoneBattery: -10 } }
  });

  Object.assign(SOFT_METRIC_EFFECTS, {
    'mark_stay_move': { 'A': { childSafety: 6, groupCalm: 3, composure: 3 }, 'B': { childSafety: -8, composure: -3 }, 'C': { childSafety: -4, groupCalm: -3 }, 'D': { childSafety: -5, groupCalm: -4 } },
    'mark_injured': { 'A': { childSafety: 6, composure: 4 }, 'B': { childSafety: -2, groupCalm: -2 }, 'C': { childSafety: -8, fairness: -5 }, 'D': { childSafety: -6 } },
    'mark_own_child': { 'A': { childSafety: 6, fairness: 6, composure: 3 }, 'B': { fairness: -6, childSafety: -3 }, 'C': { childSafety: -2, composure: -2 }, 'D': { groupCalm: -4, composure: -3 } },
    'mark_phones': { 'A': { comms: 8, groupCalm: 5, parentTrust: 4 }, 'B': { comms: -4, childSafety: -3, parentTrust: -2 }, 'C': { comms: -3, groupCalm: -3 }, 'D': { comms: -5, parentTrust: -3 } },
    'mark_insulin': { 'A': { childSafety: 6, composure: 3 }, 'B': { childSafety: -8 }, 'C': { childSafety: -6, fairness: -4 }, 'D': { childSafety: -4 } },
    'mark_advice': { 'A': { composure: 6, childSafety: 5, parentTrust: 3 }, 'B': { childSafety: -10, parentTrust: 2 }, 'C': { childSafety: -4 }, 'D': { composure: -5, groupCalm: -3 } },
    'mark_stranger': { 'A': { childSafety: 5, composure: 4, fairness: 3 }, 'B': { childSafety: -6, fairness: -2 }, 'C': { composure: -2 }, 'D': { childSafety: -5, fairness: -4 } },
    'mark_tsunami': { 'A': { childSafety: 8, groupCalm: 3, composure: 3 }, 'B': { childSafety: -12 }, 'C': { childSafety: -5 }, 'D': { childSafety: -5, groupCalm: -3 } },
    'mark_truth': { 'A': { groupCalm: 8, composure: 6, parentTrust: 3 }, 'B': { composure: -3, groupCalm: 2 }, 'C': { groupCalm: -6 }, 'D': { groupCalm: -4, composure: -2 } },
    'mark_runaway': { 'A': { childSafety: 6, groupCalm: 3, composure: 3 }, 'B': { childSafety: -4, groupCalm: -3 }, 'C': { childSafety: -8, fairness: -4 }, 'D': { childSafety: -5 } },
    'mark_helicopter': { 'A': { fairness: 8, childSafety: 6, composure: 4 }, 'B': { fairness: -10, childSafety: -3, parentTrust: -4 }, 'C': { fairness: -2, childSafety: -2 }, 'D': { childSafety: -6 } },
    'mark_night': { 'A': { childSafety: 6, groupCalm: 4, composure: 3 }, 'B': { childSafety: -8, groupCalm: -3 }, 'C': { childSafety: -3 }, 'D': { childSafety: -4 } },
    'mark_convoy': { 'A': { fairness: 8, parentTrust: 6, composure: 4 }, 'B': { fairness: -10, parentTrust: -6 }, 'C': { fairness: -4, childSafety: -3 }, 'D': { childSafety: -4 } },
    'mark_tunnel': { 'A': { childSafety: 8, composure: 5, groupCalm: 3 }, 'B': { childSafety: -9, groupCalm: -4 }, 'C': { childSafety: -4 }, 'D': { childSafety: -12, parentTrust: -6 } },
    'mark_headinjury': { 'A': { childSafety: 10, comms: 5, composure: 4 }, 'B': { childSafety: -14, parentTrust: -7 }, 'C': { childSafety: -10, groupCalm: -6 }, 'D': { childSafety: -8, groupCalm: -4 } },
    'mark_asthma': { 'A': { childSafety: 9, groupCalm: 5, composure: 3 }, 'B': { childSafety: -7 }, 'C': { childSafety: -9, groupCalm: -4 }, 'D': { childSafety: -6, groupCalm: -5 } },
    'mark_count': { 'A': { childSafety: 9, groupCalm: 5, fairness: 3 }, 'B': { childSafety: -14, parentTrust: -8 }, 'C': { childSafety: -14, parentTrust: -8 }, 'D': { childSafety: -6, groupCalm: -3 } },
    'mark_water': { 'A': { fairness: 8, groupCalm: 6, childSafety: 4 }, 'B': { fairness: -5, childSafety: -5 }, 'C': { childSafety: -7, groupCalm: -4 }, 'D': { childSafety: -8, groupCalm: -5 } },
    'mark_cold': { 'A': { childSafety: 9, groupCalm: 5, composure: 3 }, 'B': { childSafety: 5, groupCalm: 3 }, 'C': { childSafety: -7, groupCalm: -3 }, 'D': { childSafety: -12, parentTrust: -5 } },
    'mark_parent_arrives': { 'A': { parentTrust: 9, fairness: 5, childSafety: 4 }, 'B': { parentTrust: -12, childSafety: -8 }, 'C': { parentTrust: -7, fairness: -3 }, 'D': { parentTrust: -10, childSafety: -6 } },
    'mark_ema': { 'A': { groupCalm: 9, comms: 6, composure: 4 }, 'B': { groupCalm: -7, comms: -4 }, 'C': { groupCalm: -6 }, 'D': { groupCalm: -8, parentTrust: -5 } },
    'mark_handover': { 'A': { parentTrust: 10, fairness: 6, childSafety: 5 }, 'B': { childSafety: -14, parentTrust: -9 }, 'C': { parentTrust: -7, childSafety: -4 }, 'D': { childSafety: -12, parentTrust: -8 } }
  });

  Object.assign(STYLE_TAGS, {
    'mark_stay_move': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: 2, lifeSafety: -1 }, 'D': { decisive: 1, centralized: -2, lifeSafety: -1 } },
    'mark_injured': { 'A': { decisive: 1, lifeSafety: 2 }, 'B': { decisive: 2, lifeSafety: -1 }, 'C': { decisive: 1, lifeSafety: -2, centralized: -1 }, 'D': { decisive: -2, lifeSafety: -1 } },
    'mark_own_child': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { lifeSafety: -1, communityTrust: 1 }, 'C': { decisive: -1 }, 'D': { centralized: 1, communityTrust: -2 } },
    'mark_phones': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { centralized: -2 }, 'C': { centralized: 2 }, 'D': { decisive: -2 } },
    'mark_insulin': { 'A': { decisive: 1, lifeSafety: 2 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: 1, lifeSafety: -2, centralized: -1 }, 'D': { decisive: -2 } },
    'mark_advice': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2, communityTrust: 1 }, 'C': { decisive: 1, lifeSafety: -1 }, 'D': { decisive: -2 } },
    'mark_stranger': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { lifeSafety: 1, centralized: -2 }, 'C': { communityTrust: -1 }, 'D': { centralized: -2, lifeSafety: -1 } },
    'mark_tsunami': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -2, lifeSafety: -2 }, 'C': { decisive: 2, lifeSafety: -1 }, 'D': { centralized: -2 } },
    'mark_truth': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { communityTrust: 1 }, 'C': { communityTrust: -1 }, 'D': { centralized: 1, communityTrust: -2 } },
    'mark_runaway': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 2, centralized: -2 }, 'C': { decisive: -1, lifeSafety: -2 }, 'D': { centralized: -2 } },
    'mark_helicopter': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -1, communityTrust: 1 }, 'C': { decisive: 1 }, 'D': { decisive: -2, lifeSafety: -2 } },
    'mark_night': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { lifeSafety: -1 }, 'D': { decisive: 1, lifeSafety: -1 } },
    'mark_convoy': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, communityTrust: 1 }, 'C': { centralized: -2 }, 'D': { decisive: -1, lifeSafety: -1 } },
    'mark_tunnel': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -1 }, 'C': { decisive: -1 }, 'D': { decisive: 1, lifeSafety: -2, centralized: -2 } },
    'mark_headinjury': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -2, lifeSafety: -2 }, 'C': { decisive: 2, lifeSafety: -2 }, 'D': { centralized: -2, lifeSafety: -1 } },
    'mark_asthma': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -1, centralized: -2 }, 'C': { decisive: 1, lifeSafety: -2 }, 'D': { decisive: -1, lifeSafety: -1 } },
    'mark_count': { 'A': { decisive: 2, lifeSafety: 2, centralized: 2 }, 'B': { decisive: 1, lifeSafety: -2, centralized: -2 }, 'C': { decisive: -1, lifeSafety: -2, centralized: -2 }, 'D': { decisive: -1, centralized: 1 } },
    'mark_water': { 'A': { decisive: 1, centralized: 2, communityTrust: 1 }, 'B': { decisive: 1, communityTrust: 1, centralized: -1 }, 'C': { decisive: 1, centralized: 2, lifeSafety: -1 }, 'D': { decisive: -2, centralized: -2 } },
    'mark_cold': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: 1 }, 'C': { decisive: 1, lifeSafety: -1 }, 'D': { decisive: -1, lifeSafety: -2 } },
    'mark_parent_arrives': { 'A': { decisive: 1, lifeSafety: 1, centralized: 2 }, 'B': { decisive: 1, centralized: -2, lifeSafety: -2 }, 'C': { decisive: 1, centralized: 2, communityTrust: -2 }, 'D': { decisive: 1, lifeSafety: -2 } },
    'mark_ema': { 'A': { decisive: 1, communityTrust: 2, centralized: 1 }, 'B': { decisive: 1, communityTrust: -2 }, 'C': { decisive: -1 }, 'D': { decisive: 1, centralized: 2, communityTrust: -2 } },
    'mark_handover': { 'A': { decisive: 1, lifeSafety: 2, centralized: 2 }, 'B': { decisive: -2, centralized: -2, lifeSafety: -2 }, 'C': { decisive: 1, centralized: 1, communityTrust: -1 }, 'D': { decisive: -1, lifeSafety: -2 } }
  });

  // More than one choice on a single run can take children out of the group:
  // mark_tunnel D strands one on the slope, mark_count C loses the two brothers
  // to the farmhouse, mark_parent_arrives B releases three to a parent. Each of
  // those consequences used to write a fixed count off the eight-child baseline,
  // so any two together reported more children than Mark actually has. Derive it
  // from the choice log instead - the current decision is already on
  // GameState.decisions by the time its consequence fires.
  var CHILDREN_LOST = {
    'mark_tunnel': { 'D': 1 },
    'mark_count': { 'C': 2 },
    'mark_parent_arrives': { 'B': 3 }
  };

  function childrenAboard() {
    var remaining = 8;
    for (var i = 0; i < GameState.decisions.length; i++) {
      var d = GameState.decisions[i];
      var lost = CHILDREN_LOST[d.decisionId];
      if (lost && lost[d.key]) remaining -= lost[d.key];
    }
    return Math.max(0, remaining) + ' / 8';
  }

  Object.assign(CONSEQUENCE_MAP, {
    'mark_stay_move': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Rockfall Strikes the Stationary Van',
          body: 'Staying inside, the van took a hit from the rockfall an aftershock loosened above the road. A rear window ' +
            'is shattered and a child has fresh cuts; everyone is now panicked and cold with glass through the cabin. The ' +
            'sheltered spot off the slope would have been the safer place to be.',
          source: 'Roadside / Aftershock',
          scorePenalty: -4
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Rockfall', 'Extreme', 'extreme');
          updatePanelItem('transport-section', 'Steep Slopes', 'Actively Shedding', 'failed');
        }
      }
    },
    'mark_injured': {
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Injured Child Deteriorates Alone',
          body: 'Left in the van while you moved the others, the head-injured child became more drowsy and unresponsive, ' +
            'with no one watching them. Leaving the most vulnerable child unsupervised is the decision that will be ' +
            'questioned hardest.',
          source: 'The Van',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Broken Arm', 'Worsened', 'failed');
          updateUtilityDirect('firstAid', 5);
        }
      }
    },
    'mark_advice': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Unstable Route Fails',
          body: 'Driving around the closure on the parents’ insistence, the van reached a section that had looked passable ' +
            'and was not - a slip across the road, with rockfall behind now blocking the retreat. You are more isolated ' +
            'than before, with eight children, on an unstable stretch you cannot confirm.',
          source: 'Roadside',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Passing Truckie', 'Wrong', 'failed');
          updatePanelItem('transport-section', 'Road Ahead', 'Bridge Gone', 'failed');
        }
      }
    },
    'mark_tsunami': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Minutes Lost on the Low Ground',
          body: 'Waiting to confirm the warning kept the group on the low ground near the river. The water reaches are ' +
            'reportedly rising and you are now moving later, slower and with more frightened children than if you had gone ' +
            'the moment the alert sounded. With a tsunami, the instruction is do not wait.',
          source: 'Emergency Mobile Alert',
          scorePenalty: -5
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Tsunami (river)', 'High', 'high');
          updatePanelItem('transport-section', 'River Below', 'Rising Fast', 'failed');
        }
      }
    },
    'mark_tunnel': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Tunnel Is Not What You Hoped',
          body: 'Eight hundred metres of unstable slope with a broken arm and a drowsy head injury took forty minutes, and the ' +
            'tunnel mouth is partly choked with fallen rock. It is out of the rain and it is also unlit, unassessed and ' +
            'ringing with every aftershock. The van, the supplies and the first-aid kit are back down the road, and so is ' +
            'the vehicle rescuers are looking for.',
          source: 'Roadside',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('transport-section', 'Tunnel (800m)', 'Partly Choked', 'failed');
          updateUtilityDirect('firstAid', 0);
          updateUtilityDirect('water', 5);
        }
      },
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Only One Came Back',
          body: 'You sent two boys along the slope to check the tunnel. One came back forty minutes later, soaked and ' +
            'frightened, saying the other slipped on the wet scree and cannot get up. You now have an injured child you ' +
            'cannot reach, seven children you cannot leave, and a decision you will be asked about for the rest of your life.',
          source: 'Roadside',
          scorePenalty: -8
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Children Aboard', childrenAboard(), 'failed');
          updateCascadeItem('cascade-tracker', 'Rockfall', 'Extreme', 'extreme');
        }
      }
    },
    'mark_headinjury': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'He Cannot Be Woken',
          body: 'You let him sleep. An hour later he cannot be roused at all, his breathing has changed, and one pupil looks ' +
            'wrong in the torchlight. There is no ambulance, no helicopter in this weather and no road out. The thing you ' +
            'needed to notice was the change over time, and nobody was watching for it.',
          source: 'Roadside',
          scorePenalty: -8
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Head Injury (drowsy)', 'Unresponsive', 'failed');
          updatePanelItem('agency-status', 'Ambulance', 'Still Unreachable', 'failed');
        }
      }
    },
    'mark_asthma': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Inhaler Is Empty',
          body: 'Used every time she felt frightened, the inhaler ran out before dark. The cold night air has tightened her ' +
            'chest badly and she has nothing left. She is sitting upright, wide-eyed, working hard to breathe, and there ' +
            'are still hours until anyone reaches you.',
          source: 'Roadside',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Asthma (low inhaler)', 'Inhaler Empty', 'failed');
          updateUtilityDirect('firstAid', 0);
        }
      }
    },
    'mark_count': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Two Children Unaccounted For',
          body: 'The brothers have not come back and there is no signal to reach them. It is getting dark, the slope between ' +
            'here and the farmhouse is shedding rock, and you cannot go after them without leaving the rest of them alone. Every ' +
            'person who reaches you tonight will ask the same first question - how many are there - and you cannot answer it.',
          source: 'Roadside',
          scorePenalty: -8
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Children Aboard', childrenAboard(), 'failed');
          updatePanelItem('agency-status', 'Parents', 'Two Unreachable', 'failed');
        }
      }
    },
    'mark_cold': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Quiet One',
          body: 'The child who stopped complaining is now shivering in bursts, confused about where he is and fumbling with ' +
            'his jacket. That is not tiredness. You have wet kit, no dry layers organised, and hours of darkness left, and ' +
            'the point at which this was easy to prevent was two hours ago.',
          source: 'Roadside',
          scorePenalty: -7
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Overnight Snow', 'Extreme', 'extreme');
          updateUtilityDirect('warmth', 0);
        }
      }
    },
    'mark_parent_arrives': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Nobody Knows Where They Went',
          body: 'Two children left in a stranger’s ute with no record and no consent from their parents. Both sets of parents ' +
            'reached the reunification point at seven and were told their children had left with someone whose full name ' +
            'you do not have. It took Police two hours to confirm they were safe.',
          source: 'NZ Police / Parents',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Children Aboard', childrenAboard(), 'failed');
          updatePanelItem('agency-status', 'Parents', 'Demanding Answers', 'failed');
          updatePanelItem('agency-status', 'NZ Police', '"Who took them?"', 'failed');
        }
      }
    },
    'mark_ema': {
      'D': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'You Took Their Phones',
          body: 'Collecting the phones removed the last link eight frightened children had to their parents, and it did not ' +
            'unsee the alert they had already read. Two have stopped speaking to you. The parents who were mid-conversation ' +
            'when the calls cut off are now ringing Police.',
          source: 'Roadside / Parents',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Parent Calls', 'Cut Off', 'failed');
          updatePanelItem('agency-status', 'Parents', 'Calling Police', 'failed');
        }
      }
    },
    'mark_handover': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'One Child Went With the Wrong Adult',
          body: 'In the crowd and the shouting, a child left with a family friend her mother had not authorised and did not ' +
            'know was there. It was ninety minutes before anyone realised, and in those ninety minutes her mother was ' +
            'searching a reunification point for a daughter who had already gone. Nobody was hurt. That was luck.',
          source: 'Reunification Point / NZ Police',
          scorePenalty: -8
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Parents', 'One Child Missing', 'failed');
          updatePanelItem('agency-status', 'NZ Police', 'Investigating', 'failed');
        }
      }
    }
  });

  Object.assign(FACILITATOR_NOTES, {
    'mark_own_child': {
      learningObjective: 'Deliberately prioritise the child in greatest need over the natural instinct to protect your own.',
      bestPractice: 'A',
      teachingNote: 'Every child in the van deserves equal protection, and the most injured child needs you most right now. ' +
        'Go to them, and keep your daughter supported with a calm task or a trusted buddy - rather than letting the ' +
        'parent-instinct override the triage that fairness and child safety require.',
      references: [
        { label: 'Duty of care', desc: 'a responsible adult owes equal protection to every child in their charge' }
      ],
      discussionPrompts: [
        'How do you notice and check your own bias toward your own child under stress?',
        'How do you support your daughter without abandoning the more injured child?'
      ]
    },
    'mark_insulin': {
      learningObjective: 'Manage life-critical medical needs, taking the risk yourself rather than putting it on a child.',
      bestPractice: 'A',
      teachingNote: 'A diabetic child without insulin is a life-threatening countdown. Retrieving it is justified - but the ' +
        'adult takes that risk, with the children clear and braced, not a child sent under an unstable load. Leaving it or ' +
        'waiting indefinitely for rescue both gamble the child’s life.',
      references: [
        { label: 'Medical prioritisation', desc: 'life-critical medication outranks property risk; the adult carries the hazard' }
      ],
      discussionPrompts: [
        'What makes a risk worth taking yourself but never delegating to a child?',
        'What is your plan if the insulin cannot be retrieved at all?'
      ]
    },
    'mark_advice': {
      learningObjective: 'Weigh conflicting advice against what you can see, and refuse routes you cannot confirm are safe.',
      bestPractice: 'A',
      teachingNote: 'Police, Fire, a truckie, a farmer and the parents will all tell you different things. Act on the ' +
        'official agencies and your own observation, and never drive eight children onto an unstable, unconfirmed route ' +
        'on parental pressure. The fastest-sounding option is often the most dangerous.',
      references: [
        { label: 'Source credibility', desc: 'weight official, on-scene and verifiable advice; discount unconfirmed routes' }
      ],
      discussionPrompts: [
        'Whose advice carries most weight here, and why?',
        'How do you say no to a frightened, demanding parent on the phone?'
      ]
    },
    'mark_tsunami': {
      learningObjective: 'On an Emergency Mobile Alert near a river to the coast, move to high ground immediately.',
      bestPractice: 'A',
      teachingNote: 'Long or Strong, Get Gone: a strong coastal earthquake and an EMA are the warning. Get the group off the ' +
        'low ground by the river to the nearest high ground on foot, together, now - rather than waiting to confirm, ' +
        'outrunning it along the river road, or letting phones fragment the group.',
      references: [
        { label: 'Long or Strong, Get Gone', desc: 'self-evacuate to high ground immediately; do not wait for official confirmation' }
      ],
      discussionPrompts: [
        'Where is the nearest high ground, and how do you keep eight children together getting there?',
        'How do you move the injured child to high ground when you must go now?'
      ]
    },
    'mark_truth': {
      learningObjective: 'Be honest and calm with frightened children - reassurance through a plan, not false promises.',
      bestPractice: 'A',
      teachingNote: 'Children looking to you for certainty you do not have still need honesty. Acknowledge it is scary and ' +
        'serious, admit you do not have every answer, and give them the next concrete steps - rather than a promise you ' +
        'cannot keep or the full grim catalogue of hazards.',
      references: [
        { label: 'Psychological first aid', desc: 'calm, honest, age-appropriate reassurance with a clear next action' }
      ],
      discussionPrompts: [
        'How do you answer "are we going to die?" honestly without terrifying them?',
        'What does calm leadership look like when you feel anything but calm?'
      ]
    },
    'mark_helicopter': {
      learningObjective: 'Allocate scarce rescue capacity by need, explicitly resisting favouring your own child.',
      bestPractice: 'A',
      teachingNote: 'Three seats and eight children forces a triage by medical need - the head-injured, the diabetic without ' +
        'insulin, the asthmatic running low - regardless of whose child they are. Sending your own daughter by default, or ' +
        'refusing to choose and wasting the flight, both fail the most critical children.',
      references: [
        { label: 'Triage / fairness', desc: 'scarce life-saving capacity allocated by clinical need, transparently' }
      ],
      discussionPrompts: [
        'How will you explain a need-based choice to the parents of the children who waited?',
        'What records help you defend this decision afterwards?'
      ]
    },
    'mark_stay_move': {
      learningObjective: 'Identify the dominant immediate threat and move the group clear of it without scattering them.',
      bestPractice: 'A',
      teachingNote: 'There is no safe option, only a least-bad one. Active rockfall onto a stationary van is the acute threat, ' +
        'so the group moves - but only a short distance, to the most sheltered spot clear of the fall line, staying tight ' +
        'together. Walking away from the area exposes injured, cold children to slopes and weather and strings the group ' +
        'out; sending children to scout puts them into the exact hazard.',
      references: [
        { label: 'Dominant hazard', desc: 'identify which threat will hurt someone first, and act on that one' },
        { label: 'Group integrity', desc: 'a tight group can be counted, seen and managed; a strung-out one cannot' }
      ],
      discussionPrompts: [
        'How far is far enough, and how do you judge the fall line from the road?',
        'What do you say to eight frightened children to get them moving together?'
      ]
    },
    'mark_tunnel': {
      learningObjective: 'Assess a shelter option before committing a group to it, and weigh hard shelter against staying findable.',
      bestPractice: 'A',
      teachingNote: 'The tunnel is genuinely attractive with snow forecast, and moving eight children including a broken arm ' +
        'and a head injury 800 metres along an unstable slope to an unassessed structure is a serious commitment. Walking ' +
        'the route yourself while there is light keeps every option open. Ruling it out entirely closes off hard shelter ' +
        'before you know anything; sending children to assess a structure they cannot assess is the worst version.',
      references: [
        { label: 'Shelter assessment', desc: 'unassessed hard shelter can be more dangerous than open ground in aftershocks' },
        { label: 'Staying findable', desc: 'rescuers search for the vehicle; moving away from it has a real cost' }
      ],
      discussionPrompts: [
        'What would make you commit the group to the tunnel, and what would rule it out?',
        'How long do you have before the light and the weather make the decision for you?'
      ]
    },
    'mark_injured': {
      learningObjective: 'Work within the limits of a first-aid certificate: stabilise, protect, monitor, and do not improvise beyond your training.',
      bestPractice: 'A',
      teachingNote: 'A coach with a first-aid certificate can immobilise, keep a casualty warm and still, monitor for change ' +
        'and record what he sees. He cannot reduce a fracture, clear a spine or diagnose. The failure modes are attempting ' +
        'more than the training supports, and doing nothing because the training feels inadequate.',
      references: [
        { label: 'Scope of practice', desc: 'first aid is stabilise, protect and monitor until help arrives' },
        { label: 'Casualty records', desc: 'a written record of change over time is what a paramedic most needs on arrival' }
      ],
      discussionPrompts: [
        'What can you actually do for a broken arm on a roadside, and what must you not attempt?',
        'What do you write down, and how often?'
      ]
    },
    'mark_headinjury': {
      learningObjective: 'Recognise deteriorating consciousness as the sign that matters, and monitor and escalate rather than let it pass.',
      bestPractice: 'A',
      teachingNote: 'A child who was talking normally and is now hard to rouse, slow to answer and has vomited is ' +
        'deteriorating, and that trajectory is the single most important piece of information anyone will want. Keep him ' +
        'still and warm, do not let him sleep unmonitored, write down times and changes, and make him the thing you escalate ' +
        'on every call. Letting him sleep is how the change goes unnoticed; carrying him out abandons seven others; ' +
        'delegating the watch to frightened children misses a subtle sign.',
      references: [
        { label: 'Head injury red flags', desc: 'declining consciousness, vomiting and slowed responses indicate deterioration' },
        { label: 'Escalation', desc: 'a timed deterioration record is what gets a casualty prioritised when contact is made' }
      ],
      discussionPrompts: [
        'What exactly do you write down, and how often do you check him?',
        'How do you keep watching him while managing seven other children?'
      ]
    },
    'mark_asthma': {
      learningObjective: 'Address the environmental and emotional drivers of an asthma attack, and use a nearly-empty reliever deliberately.',
      bestPractice: 'A',
      teachingNote: 'Dust, cold air and panic are all making this worse, and all three are things you can change without ' +
        'using a dose. Getting her out of the dust, sitting her upright and settling the fear is what makes the remaining ' +
        'doses last into the night. Unlimited panic-driven use empties the inhaler within the hour; withholding it entirely ' +
        'misreads a worsening attack as a future one; and telling her to calm down treats an airway problem as behaviour.',
      references: [
        { label: 'Asthma triggers', desc: 'dust, cold air and anxiety compound an attack and are partly controllable' },
        { label: 'Scarce medication', desc: 'deliberate spacing is what turns a few doses into overnight cover' }
      ],
      discussionPrompts: [
        'What can you change about her environment in the next two minutes?',
        'What is your plan if the inhaler runs out before help arrives?'
      ]
    },
    'mark_phones': {
      learningObjective: 'Manage eight children’s phones, eight sets of parents and one draining battery as a single communication problem.',
      bestPractice: 'A',
      teachingNote: 'Every phone ringing at once is both a welfare need and a battery problem. A structured approach - one ' +
        'accurate message, brief supervised contact, a single point for updates, and power conserved for emergency calls - ' +
        'meets the parents’ need without burning the capability you may need for a casualty. Letting everyone call freely ' +
        'exhausts the batteries; banning contact leaves eight families to imagine the worst.',
      references: [
        { label: 'Battery discipline', desc: 'communication capacity is a finite resource to be allocated, like any other' },
        { label: 'Single point of contact', desc: 'one channel for updates prevents eight contradictory versions circulating' }
      ],
      discussionPrompts: [
        'What does the one message to all parents actually say?',
        'How much battery do you hold back, and what for?'
      ]
    },
    'mark_count': {
      learningObjective: 'Keep the group intact - an accurate count is the one thing you can guarantee and the first thing anyone will ask.',
      bestPractice: 'A',
      teachingNote: 'Two capable teenagers wanting to fetch help is well-meant and is the start of every search-and-rescue ' +
        'callout in this scenario. Keeping all eight together, explaining plainly why nobody leaves, and giving the brothers ' +
        'a real job converts a flight risk into help. Going with them abandons six; letting them go creates two casualties ' +
        'you cannot reach or count; refusing without explanation means they go anyway and you find out late.',
      references: [
        { label: 'Group accountability', desc: 'know how many you have and where they are, continuously' },
        { label: 'Managing capable teenagers', desc: 'purpose and inclusion hold a group better than prohibition' }
      ],
      discussionPrompts: [
        'What jobs are genuinely useful for two determined sixteen-year-olds?',
        'How do you explain the risk without frightening the younger ones?'
      ]
    },
    'mark_water': {
      learningObjective: 'Ration scarce supplies by need rather than equality, say the rule out loud, and treat toileting as a real problem.',
      bestPractice: 'A',
      teachingNote: 'Equal shares are not fair when one child is diabetic and needs food on a schedule. Announcing a simple ' +
        'plan pre-empts the arguments, and organising a discreet supervised toilet arrangement prevents the far worse ' +
        'outcome of children wandering off alone on a wet slope. Sharing everything now leaves nothing for the night; ' +
        'holding it all back fails the diabetic child; and dealing with it only when someone complains is how you lose ' +
        'track of someone.',
      references: [
        { label: 'Need-based allocation', desc: 'equal and fair diverge as soon as one person has a clinical need' },
        { label: 'Dignity in welfare', desc: 'toileting is a genuine safety issue in an extended roadside wait' }
      ],
      discussionPrompts: [
        'What does the diabetic child need, and how do you find out?',
        'How do you arrange toileting for eight children with dignity and supervision?'
      ]
    },
    'mark_cold': {
      learningObjective: 'Recognise developing hypothermia in children, especially the one who has gone quiet.',
      bestPractice: 'A',
      teachingNote: 'Wet team kit, wind and a falling temperature will produce hypothermia in children faster than in adults, ' +
        'and the child who has stopped complaining is further along than the ones still shivering. Getting everyone out of ' +
        'the wind and off the wet ground, dry layers onto the coldest first, and physical closeness costs nothing and works. ' +
        'Making them run burns energy they have not eaten; telling them to tough it out ignores the sign that matters.',
      references: [
        { label: 'Hypothermia in children', desc: 'greater surface-area ratio and less reserve; onset is faster than in adults' },
        { label: 'Ground insulation', desc: 'conductive loss to wet ground exceeds convective loss to air' }
      ],
      discussionPrompts: [
        'Which child worries you most, and why is it the quiet one?',
        'What do you actually have that insulates them from the ground?'
      ]
    },
    'mark_parent_arrives': {
      learningObjective: 'Release children only to parents or people the parents have authorised, and record every handover.',
      bestPractice: 'A',
      teachingNote: 'A parent may collect their own child, and that should happen. Other people’s children go only with their ' +
        'parents’ knowledge and agreement, however sensible the offer looks and however cold it is getting. The record - ' +
        'child’s name, adult’s name, time - takes fifteen seconds and is the difference between a good decision and one you ' +
        'cannot explain. Refusing to release his own daughter is neither lawful nor sensible.',
      references: [
        { label: 'Custody and release', desc: 'a child is released to a parent or an authorised person, verified at the point of release' },
        { label: 'Handover records', desc: 'the written record is what resolves the confusion two hours later' }
      ],
      discussionPrompts: [
        'What would you need before sending a second child in that ute?',
        'What exactly do you write down, and where?'
      ]
    },
    'mark_ema': {
      learningObjective: 'Interpret an official alert for the people in front of you, and pair the news with a plan.',
      bestPractice: 'A',
      teachingNote: 'Eight children have read the alert before you have. The only variable left is whether they understand ' +
        'it. Reading it properly, telling them plainly what it does and does not mean for this stretch of road, and saying ' +
        'what you are going to do about it converts an alarm into a plan. Telling them not to worry confirms it is worse ' +
        'than they feared; reading regional wording aloud invites the worst interpretation; taking the phones removes their ' +
        'only link to their parents for information they have already seen.',
      references: [
        { label: 'Emergency Mobile Alerts', desc: 'written for a whole region, not for one location; interpretation is local' },
        { label: 'Risk communication to children', desc: 'accurate information plus a visible plan reduces panic; reassurance alone does not' }
      ],
      discussionPrompts: [
        'What does this alert actually mean for where you are standing?',
        'What is the plan you attach to it, and can an eight-year-old repeat it back?'
      ]
    },
    'mark_night': {
      learningObjective: 'Plan for an overnight stay you did not intend, using what you have before you need it.',
      bestPractice: 'A',
      teachingNote: 'Once it is clear nobody is reaching you tonight, the problem changes from waiting to surviving until ' +
        'morning: warmth, shelter, a sleep and watch arrangement, conserved battery and fuel, and a group that knows what ' +
        'the plan is. The failures are burning the resources early, and refusing to accept that the night is happening ' +
        'until it has already started.',
      references: [
        { label: 'Unplanned overnight', desc: 'commit to the overnight plan while you still have light and choices' },
        { label: 'Resource pacing', desc: 'fuel and battery spent before dark are not available at three in the morning' }
      ],
      discussionPrompts: [
        'At what point do you decide the night is happening, and what changes then?',
        'Who sleeps, who watches, and how do you rotate it with only one adult?'
      ]
    },
    'mark_convoy': {
      learningObjective: 'Allocate scarce places by transparent need, record it, and explain it to every parent - including those whose child waited.',
      bestPractice: 'A',
      teachingNote: 'Six places and eight children is the same allocation problem a controller faces, at a scale where every ' +
        'affected family knows your name. Medical need and vulnerability, applied openly and written down, is defensible ' +
        'years later. Sending your own daughter and her friends is the one thing no parent will forgive; letting the ' +
        'children decide abandons your accountability; refusing to split keeps injured children in the cold when six could ' +
        'be warm.',
      references: [
        { label: 'Need-based allocation', desc: 'clinical need and vulnerability, applied consistently and transparently' },
        { label: 'Conflict of interest', desc: 'your own child in the group is a bias to declare, not to act on' }
      ],
      discussionPrompts: [
        'How do you keep your own daughter out of the criteria?',
        'What do you say to the parents of the two who waited?'
      ]
    },
    'mark_handover': {
      learningObjective: 'Run a controlled reunification: verify every adult, record every release, and stay with the last child.',
      bestPractice: 'A',
      teachingNote: 'This is where a well-run day is most often undone. A crowded, noisy reunification point with more adults ' +
        'than children is exactly where a child leaves with the wrong person. Verify each adult against parental ' +
        'authorisation, write down every handover with names and times, and stay with the child nobody has come for until ' +
        'their parent is reached. Letting adults sort it out among themselves, handing everyone to Police who know none of ' +
        'them, or leaving the last child with a stranger all fail in the final five minutes.',
      references: [
        { label: 'Reunification procedure', desc: 'verify, release, record - one child at a time, however loud the room' },
        { label: 'The last child', desc: 'the child nobody has come for is the one who most needs the responsible adult to stay' }
      ],
      discussionPrompts: [
        'How do you verify an adult you have never met in a crowded car park?',
        'What do you do if nobody comes for the last child by midnight?'
      ]
    },
    'mark_stranger': {
      learningObjective: 'Hold your primary duty of care while still helping within its limits.',
      bestPractice: 'A',
      teachingNote: 'Injured adults begging for help is the hardest kind of competing claim, because refusing feels ' +
        'monstrous and the eight children are your actual responsibility. The answer is neither extreme: help from close by ' +
        'in ways that do not leave eight children unsupervised - pass water, get information, brief them, carry word out - ' +
        'while your duty of care stays where it started. Going fully to their aid abandons the children; doing nothing at ' +
        'all is neither necessary nor defensible.',
      references: [
        { label: 'Duty of care limits', desc: 'a responsible adult cannot discharge one duty by abandoning another' },
        { label: 'Bounded assistance', desc: 'identify what help is possible without leaving your primary group' }
      ],
      discussionPrompts: [
        'What can you genuinely do for them from where you can still see the children?',
        'How do you explain the limit to adults who are frightened and in pain?'
      ]
    },
    'mark_runaway': {
      learningObjective: 'Recover a bolting child without splitting the group or losing sight of either.',
      bestPractice: 'A',
      teachingNote: 'A frightened child running back toward a damaged road forces an instant choice, and the instinct - ' +
        'sprint after them - leaves seven children alone beside a river with active rockfall. As the only adult, you move ' +
        'the whole group as one, calling the child back, never losing line of sight in either direction. Sending other ' +
        'children after them multiplies the problem; letting them go is not an option; freezing loses the moment.',
      references: [
        { label: 'Single-adult supervision', desc: 'you cannot be in two places; the group moves with you or not at all' },
        { label: 'Flight behaviour', desc: 'frightened children run toward parents, not away from danger' }
      ],
      discussionPrompts: [
        'What could you have done ten minutes earlier that would have prevented this?',
        'How do you move eight children quickly without turning it into a stampede?'
      ]
    }
  });

  NOISE_POOL.markwilliams = [
    {
      tag: 'NOISE', title: 'A Parent Calls Every Two Minutes',
      body: 'One parent keeps getting through on the patchy signal, demanding a live update every couple of minutes and ' +
        'second-guessing every decision. Each call drains battery you need and pulls you off the children.',
      source: 'Parent (phone)',
      prompt: 'How do you handle the constant calls?',
      options: [
        { key: 'A', label: 'Give one clear update, agree a set check-in time, and explain you must conserve battery for emergencies', desc: 'Keeps the parent informed while protecting your battery and your attention. A predictable check-in calms most anxious parents.', effect: { score: 2 } },
        { key: 'B', label: 'Take every call to keep them happy', desc: 'Drains the battery you need for a real emergency and pulls you off eight children for one parent.', effect: { score: -2 } },
        { key: 'C', label: 'Stop answering that parent entirely', desc: 'Cuts off a frightened parent completely; the silence makes them more likely to drive into the zone.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Child Wants to Film a "Rescue Vlog"',
      body: 'One of the older children, coping by performing, wants to film a dramatic "rescue vlog" of the injured kids ' +
        'and the wrecked road for their followers.',
      source: 'The Van',
      prompt: 'How do you handle the would-be vlogger?',
      options: [
        { key: 'A', label: 'Gently redirect them to a real, useful job and explain why filming injured friends is not okay', desc: 'Channels the nervous energy into help, and protects the dignity and privacy of the injured children.', effect: { score: 2 } },
        { key: 'B', label: 'Let them film - it keeps them occupied', desc: 'Puts injured, identifiable children online in front of their parents and the world.', effect: { score: -2 } },
        { key: 'C', label: 'Snatch the phone and shout at them', desc: 'Escalates with a frightened child and costs you composure the whole group is watching.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Siblings Argue Near the Slope Edge',
      body: 'Two siblings are bickering and shoving, and one has drifted toward the unstable edge above the river while you ' +
        'were focused on the injured child.',
      source: 'Roadside',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Calmly and firmly bring both back from the edge and give them each a task close to you', desc: 'Removes the immediate fall risk and converts restless energy into something useful within arm’s reach.', effect: { score: 2 } },
        { key: 'B', label: 'Shout at them from where you are', desc: 'A shout may startle a child near a drop into stepping the wrong way; you need to close the distance.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore it and trust they will sort themselves out', desc: 'A child near an unstable edge above a river is not something to leave to chance.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Motorist Offers to Take "a Couple of Kids"',
      body: 'A passing motorist stops and offers to take "a couple of the kids" with them toward town to lighten your load. ' +
        'You do not know them.',
      source: 'Passing Motorist',
      prompt: 'How do you respond to the offer?',
      options: [
        { key: 'A', label: 'Decline - keep all the children with you, but take the motorist’s details and ask them to pass a message to authorities', desc: 'You cannot hand children to an unknown adult, but you can use them to get word out. Keep the group together.', effect: { score: 2 } },
        { key: 'B', label: 'Send two children with them to reduce numbers', desc: 'Handing children to a stranger you cannot verify is the safeguarding failure an emergency tempts you into.', effect: { score: -3 } },
        { key: 'C', label: 'Wave them on without a word', desc: 'Misses a chance to get a verified message out to authorities through a willing passer-by.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Fight Over the Last Snacks',
      body: 'You handed out a few of the snack bars and now the children are squabbling - someone got a bigger piece, the ' +
        'injured child has not eaten, and a couple are demanding "it is not fair".',
      source: 'The Van',
      prompt: 'How do you handle the snack dispute?',
      options: [
        { key: 'A', label: 'Set a simple visible rule - equal shares, extra fluids for the injured child - and explain it out loud', desc: 'A clear, transparent fairness rule defuses the squabble and models the need-based fairness you are trying to hold.', effect: { score: 2 } },
        { key: 'B', label: 'Give the loudest children more to quiet them', desc: 'Rewards the squabbling and teaches the group that complaining works.', effect: { score: -2 } },
        { key: 'C', label: 'Take all the snacks back until they stop arguing', desc: 'Punishes hungry, frightened children collectively and raises the tension rather than lowering it.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Child Wants to Livestream',
      body: 'One of the older children is filming the group and the rockfall and wants to put it up, saying it will help ' +
        'people find you.',
      source: 'The Van',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Stop the livestream, explain that parents should not learn where their child is from a video, and use the battery to contact the parents directly instead', desc: 'A livestream reaches strangers before parents and burns the battery you need for the calls that matter.', effect: { score: 2 } },
        { key: 'B', label: 'Let them post it - visibility might bring help', desc: 'Footage of frightened, injured children reaching their parents through social media before you do is a harm you cannot undo.', effect: { score: -3 } },
        { key: 'C', label: 'Confiscate the phone without explanation', desc: 'Right instinct, and taking a child’s only link to their parents without a word makes the group harder to hold.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Two of Them Start Fighting',
      body: 'Two boys who are usually friends have started shoving each other over a jacket, and the rest of the group is ' +
        'gathering round.',
      source: 'The Van',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Split them up calmly, give each one a separate task, and get the group focused on something with a purpose', desc: 'Fear coming out sideways. Separation plus a job resolves it faster than any conversation about the jacket.', effect: { score: 2 } },
        { key: 'B', label: 'Shout at both of them in front of the group', desc: 'Raises the temperature for everyone and tells eight frightened children the adult has lost his grip.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore it and let them work it out', desc: 'A scuffle on a wet slope above a river is not something to let run its course.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Parent Demands You Put Their Child On',
      body: 'A mother who has finally got through is insisting you hand the phone to her son immediately and keep it there, ' +
        'while your battery sits at eleven per cent.',
      source: 'Parent Call',
      prompt: 'How do you handle the call?',
      options: [
        { key: 'A', label: 'Give him ninety seconds with her, explain the battery situation to her plainly, and agree one contact point for updates', desc: 'Meets the real need on both ends and protects the battery every other family also depends on.', effect: { score: 2 } },
        { key: 'B', label: 'Hand the phone over and let them talk as long as they need', desc: 'One family gets the battery that seven others and every emergency call depend on.', effect: { score: -2 } },
        { key: 'C', label: 'Refuse and hang up', desc: 'A mother who cannot reach her child will assume the worst and ring everyone else instead.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Someone Offers a Lift to Three',
      body: 'A car has got through from the far side and the driver, a stranger, offers to take three children out to the ' +
        'nearest town.',
      source: 'Roadside',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Decline to send children with an unknown adult, take his details and route, and ask him to carry a written message out to Police and the parents', desc: 'Turns an unusable offer into a genuinely useful one - a message getting out is worth more than three unsupervised seats.', effect: { score: 2 } },
        { key: 'B', label: 'Send the three youngest with him to get them warm', desc: 'Handing children to an unvetted stranger is the decision no explanation afterwards will survive.', effect: { score: -3 } },
        { key: 'C', label: 'Wave him on without speaking to him', desc: 'Declining is right; losing the chance to send a message out with him is a wasted opportunity.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Your Own Phone Rings - It Is Your Wife',
      body: 'Your wife is on the line, frightened, wanting to know about your daughter and about you, while three children ' +
        'are waiting to use the same phone to reach their own parents.',
      source: 'Family',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Tell her both of you are safe in thirty seconds, ask her to start ringing the other parents for you, and get back to the queue', desc: 'Settles her, and turns your own family call into the extra communication channel the group badly needs.', effect: { score: 2 } },
        { key: 'B', label: 'Stay on the line as long as she needs', desc: 'Understandable, and it spends the battery three other families are waiting on.', effect: { score: -2 } },
        { key: 'C', label: 'Decline the call to keep the phone free', desc: 'Thirty seconds would have settled her and gained you a second person making calls from a place with power.', effect: { score: -1 } }
      ]
    }
  ];

  // ---- Event sequence -------------------------------------------------------
  PERSONA_EVENTS.markwilliams = [
    {
      time: 0, type: 'inject', tag: 'MAINSHOCK',
      title: 'M7.9 Alpine Fault - Violent Shaking on the Highway',
      body: 'Returning from an away tournament with eight Under-13 players, a magnitude 7.9 Alpine Fault earthquake strikes ' +
        'as the 12-seat van crosses a remote alpine highway. Violent shaking forces you to stop. Rockfalls come down nearby, ' +
        'dust clouds cut visibility, powerlines drop across sections of road, and vehicles crash ahead and behind. You are ' +
        '45 minutes from home, 30 from the nearest township, the only adult, and the road is blocked in both directions.',
      source: 'On the Road',
      aftershock: true
    },
    {
      time: 3, type: 'info', tag: 'SITUATION',
      title: 'The Van Holds - But Inside Is Chaos',
      body: 'The van stayed upright. One child has a suspected broken arm; another a head injury from striking the seat and ' +
        'is becoming drowsy; one is having a panic attack; all eight are frightened and several are crying. An asthmatic ' +
        'child is low on inhaler and a diabetic child’s insulin is packed under heavy luggage. Within minutes every child’s ' +
        'phone starts ringing as parents desperately try to make contact - and your own daughter is one of the eight.',
      source: 'The Van'
    },
    {
      time: 8, type: 'decision', tag: 'MARK',
      title: 'Aftershock - Stay or Move?',
      body: 'A major aftershock brings fresh rockfall around the van. The road is blocked both ways, with steep slopes and a ' +
        'river below. Inside the van means shelter from the weather but exposure to rockfall; outside means less crush risk ' +
        'but cold and unstable slopes. There is no clearly safe option.',
      decisionId: 'mark_stay_move',
      prompt: 'Do you keep everyone in the van or get them out?',
      options: [
        { key: 'A', label: 'Move everyone a short distance to the most sheltered spot clear of the rockfall path, keeping the group tight together', desc: 'Gets the group out from under the active rockfall onto the van without scattering them far into the cold and slopes. Reads the dominant threat.', effect: { score: 5 } },
        { key: 'B', label: 'Keep everyone in the van and hope the rockfall misses', desc: 'A stationary van under an active rockfall is the acute danger; shelter from weather does not help if the roof comes in.', effect: { score: -4 } },
        { key: 'C', label: 'Evacuate everyone and start walking away from the area immediately', desc: 'Moving far exposes injured and cold children to the slopes and weather, and splits your attention across a strung-out group.', effect: { score: -2 } },
        { key: 'D', label: 'Send the older children to scout a safer spot while you stay with the injured', desc: 'Splits the group and sends children into the exact rockfall and slope hazard you are trying to escape.', effect: { score: -3 } }
      ]
    },
    {
      time: 13, type: 'decision', tag: 'MARK',
      title: 'The Tunnel, 800 Metres Away',
      body: 'A road tunnel sits about 800 metres ahead. It would be hard shelter out of the rockfall and the weather, and it ' +
        'would mean walking eight children - one with a broken arm, one drowsy from a head injury - along an unstable slope, ' +
        'away from the van, the supplies and the only place anyone knows to look for you.',
      decisionId: 'mark_tunnel',
      prompt: 'Do you move the group to the tunnel?',
      options: [
        { key: 'A', label: 'Stay near the van for now, but walk the route yourself with one older child to see whether the tunnel is sound and reachable before the light goes', desc: 'Keeps the group where rescuers will look and where the supplies are, while finding out whether the tunnel is a real option before you need it in the dark.', effect: { score: 5 } },
        { key: 'B', label: 'Move everyone to the tunnel now', desc: 'Walks injured children along an unstable slope to an unassessed structure, away from the vehicle rescuers are looking for and everything you have.', effect: { score: -4 } },
        { key: 'C', label: 'Rule the tunnel out entirely and stop thinking about it', desc: 'Closes off your only hard-shelter option before you know anything about it, with snow forecast and hours of daylight left.', effect: { score: -2 } },
        { key: 'D', label: 'Send two older children ahead to check the tunnel', desc: 'Sends unaccompanied children along an active rockfall slope to assess a structure they have no way of assessing.', effect: { score: -5 } }
      ]
    },
    {
      time: 18, type: 'decision', tag: 'MARK',
      title: 'The Seriously Injured Child',
      body: 'The head-injured child is becoming drowsy. Moving them may worsen a head or spinal injury, but staying exposes ' +
        'the whole group to further rockfall. No ambulance can reach you.',
      decisionId: 'mark_injured',
      prompt: 'How do you handle the seriously injured child?',
      options: [
        { key: 'A', label: 'Stabilise and protect them in place, keep them still and monitored for drowsiness, and shield the spot - move only if the rockfall forces it', desc: 'A head/spinal injury should not be moved unless the danger forces it. Keep them still, warm and watched.', effect: { score: 5 } },
        { key: 'B', label: 'Move the whole group including the injured child now to escape the rockfall', desc: 'Sometimes the hazard forces a move, but moving a possible head/spinal injury when not strictly necessary risks worsening it.', effect: { score: -2 } },
        { key: 'C', label: 'Leave the injured child in the van and move the others to safety', desc: 'Abandons the most vulnerable child, unsupervised, as their condition worsens. The decision that will haunt you.', effect: { score: -5 } },
        { key: 'D', label: 'Wait for an ambulance to take charge of the injured child', desc: 'No ambulance is coming for a long time, and the child is getting drowsier. Waiting is not a plan.', effect: { score: -4 } }
      ]
    },
    {
      time: 23, type: 'decision', tag: 'MARK',
      title: 'The Drowsy One',
      body: 'The boy who hit his head on the seat back was talking normally twenty minutes ago. He is now hard to rouse, ' +
        'answering slowly, and has been sick once. You are a rugby coach with a first-aid certificate and no way to get him ' +
        'to a hospital.',
      decisionId: 'mark_headinjury',
      prompt: 'How do you manage the head injury?',
      options: [
        { key: 'A', label: 'Keep him still and warm, do not let him sleep unmonitored, write down the time and what changes, and make him the single thing you escalate on every call that connects', desc: 'You cannot treat him, but you can observe, record and escalate - and a written deterioration record is what gets him prioritised the moment anyone reaches you.', effect: { score: 5 } },
        { key: 'B', label: 'Let him sleep - he is exhausted and it will pass', desc: 'Declining consciousness after a head injury is the sign that matters, and sleep is exactly how it goes unnoticed.', effect: { score: -6 } },
        { key: 'C', label: 'Carry him toward the roadblock to find help', desc: 'Moving a deteriorating head injury along an unstable slope, while abandoning seven children, risks both him and them.', effect: { score: -5 } },
        { key: 'D', label: 'Ask the other children to keep an eye on him', desc: 'Hands responsibility for the most serious casualty to frightened children, and the change you need to notice is subtle.', effect: { score: -4 } }
      ]
    },
    {
      time: 28, type: 'decision', tag: 'ETHICAL',
      title: 'Your Own Child vs Everyone Else',
      body: 'Your daughter is terrified and begs you not to leave her side. At the same moment, the more seriously injured ' +
        'child needs your hands now. Every child in the van deserves equal protection.',
      decisionId: 'mark_own_child',
      prompt: 'Where do you put yourself?',
      options: [
        { key: 'A', label: 'Go to the most injured child, and settle your daughter with a calm task and a trusted older buddy beside her', desc: 'Deliberately prioritises greatest need over instinct, while keeping your daughter supported. The fair, child-centred call.', effect: { score: 5 } },
        { key: 'B', label: 'Stay with your daughter - she needs you most', desc: 'Understandable as a parent, but the injured child needs you more right now, and the other parents trusted you to protect every child.', effect: { score: -4 } },
        { key: 'C', label: 'Try to do both at once, moving between them', desc: 'Split between two children, neither the injured one nor your daughter gets what they actually need.', effect: { score: -2 } },
        { key: 'D', label: 'Tell your daughter to toughen up and deal with it on her own', desc: 'Harsh on a frightened child and corrosive to the calm leadership the whole group is reading off you.', effect: { score: -3 } }
      ]
    },
    {
      time: 33, type: 'decision', tag: 'MARK',
      title: 'The Inhaler Is Nearly Empty',
      body: 'The asthmatic girl is wheezing in the cold and dust. Her reliever inhaler rattles almost empty - perhaps a few ' +
        'doses left - and she is frightened, which is making the breathing worse. There is no spare.',
      decisionId: 'mark_asthma',
      prompt: 'How do you manage her asthma?',
      options: [
        { key: 'A', label: 'Get her out of the dust, sit her upright, calm the panic that is driving the attack, and use the remaining doses deliberately rather than continuously', desc: 'Dust and fear are both making it worse and both are things you can change. That is what makes the last few doses last.', effect: { score: 5 } },
        { key: 'B', label: 'Let her take the inhaler whenever she feels she needs it', desc: 'Panic-driven use empties the inhaler within the hour, and the attack that genuinely needs it will come later tonight.', effect: { score: -4 } },
        { key: 'C', label: 'Hold the inhaler back entirely for a serious attack', desc: 'A worsening asthma attack in a cold, dusty environment is the serious attack; withholding is how it becomes an emergency.', effect: { score: -5 } },
        { key: 'D', label: 'Tell her to calm down and breathe normally', desc: 'Telling a frightened child with a genuine airway problem to calm down treats the symptom as behaviour.', effect: { score: -4 } }
      ]
    },
    {
      time: 38, type: 'decision', tag: 'MARK',
      title: 'Phones, Panic and a Livestream',
      body: 'Children are calling parents and posting "we are trapped", "the bridge collapsed", "we are going to die". One is ' +
        'livestreaming the injured kids; another cannot reach their parents and is becoming hysterical. Some parents are ' +
        'already driving toward the location - into the earthquake zone.',
      decisionId: 'mark_phones',
      prompt: 'How do you manage the phones and the panic?',
      options: [
        { key: 'A', label: 'Use one phone for controlled contact, ask the others to stop posting and lend their phones for one accurate group message, and give the hysterical child a job and reassurance', desc: 'One calm, accurate channel out, the rumours slowed, and the hysterical child anchored with a role. Controlled, not chaotic.', effect: { score: 5 } },
        { key: 'B', label: 'Let the children keep using their phones freely', desc: 'Panic messages and a livestream of injured kids send parents racing into the zone and strip the children’s privacy.', effect: { score: -3 } },
        { key: 'C', label: 'Collect all the phones to stop the panic', desc: 'Cuts your only link to the outside world and escalates fear in already frightened children, though the intent is understandable.', effect: { score: -2 } },
        { key: 'D', label: 'Ignore the phones and focus only on the injuries', desc: 'Leaves misinformation and the livestream running, and parents self-deploying onto dangerous roads.', effect: { score: -3 } }
      ]
    },
    {
      time: 44, type: 'decision', tag: 'MARK',
      title: 'Two of Them Want to Walk to the Farmhouse',
      body: 'A farmhouse roof is visible perhaps a kilometre across the valley. Two of the children - brothers, and the oldest ' +
        'two in the group - are certain they can reach it and bring back help. They are already picking up their bags.',
      decisionId: 'mark_count',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Keep all eight together, say plainly why nobody leaves the group, and give the two brothers a real job so they are contributing instead of leaving', desc: 'An intact group of eight is the only thing you can actually guarantee. Two teenagers with a purpose stop being a flight risk.', effect: { score: 5 } },
        { key: 'B', label: 'Go with them yourself and leave the other six', desc: 'Leaves six children, including a head injury and an asthmatic, with no adult at all.', effect: { score: -6 } },
        { key: 'C', label: 'Let the two brothers go - they are nearly adults and it might bring help faster', desc: 'You now have two unaccounted-for children on unstable ground and no way to reach or count them. Every rescuer’s first question is how many, and you no longer know where two of them are.', effect: { score: -6 } },
        { key: 'D', label: 'Refuse without explaining and hope they drop it', desc: 'A flat no with no reason to two determined teenagers means they go anyway, and you find out later.', effect: { score: -3 } }
      ]
    },
    {
      time: 46, type: 'inject', tag: 'WEATHER',
      title: 'The Rain Starts',
      body: 'Fine rain begins, turning the dust to a slick film on the road and the slope above. The children in shorts and ' +
        'team kit are already shivering, and the temperature has dropped noticeably in the last half hour. The forecast ' +
        'said snow after dark.',
      source: 'Roadside'
    },
    {
      time: 50, type: 'decision', tag: 'MARK',
      title: 'The Diabetic Child’s Insulin',
      body: 'The diabetic child needs insulin, but it is packed underneath heavy, unstable luggage that could shift in an ' +
        'aftershock. No ambulance can reach you.',
      decisionId: 'mark_insulin',
      prompt: 'Do you retrieve the insulin?',
      options: [
        { key: 'A', label: 'Carefully retrieve it yourself with the children clear and braced, working fast but watching the load', desc: 'The insulin is life-critical; you take the calculated risk, not a child, and manage it. The right hands on the hazard.', effect: { score: 5 } },
        { key: 'B', label: 'Leave it - retrieving it is too risky', desc: 'A diabetic child without insulin is a life-threatening countdown that outweighs the manageable risk of a careful retrieval.', effect: { score: -4 } },
        { key: 'C', label: 'Send an older, lighter child in to grab it quickly', desc: 'Puts a child under the unstable load you were unwilling to risk yourself. Never delegate that hazard to a child.', effect: { score: -5 } },
        { key: 'D', label: 'Wait until rescuers arrive to retrieve it safely', desc: 'Rescue could be many hours away; the child may need the insulin long before then.', effect: { score: -3 } }
      ]
    },
    {
      time: 56, type: 'decision', tag: 'MARK',
      title: 'Four Bottles, Eight Bars, Eight Children',
      body: 'The van has four bottles of water and eight muesli bars. Nobody has eaten since before the game, the diabetic ' +
        'child needs food on a schedule, and two of the younger ones need a toilet and are too embarrassed to say so in ' +
        'front of the group.',
      decisionId: 'mark_water',
      prompt: 'How do you handle food, water and toileting?',
      options: [
        { key: 'A', label: 'Set a simple rationing plan out loud, feed the diabetic child on her schedule first, and organise a discreet, supervised toilet arrangement away from the group', desc: 'Saying the plan out loud stops the arguments before they start, and the toileting problem is real, urgent and easily solved with a little dignity.', effect: { score: 5 },
          locked: function (log) {
            return log['mark_count'] === 'C' ? 'You cannot ration for a group of eight when two of them walked out an hour ago' : false;
          } },
        { key: 'B', label: 'Share everything out equally now so nobody feels hard done by', desc: 'Equal is not fair here - the diabetic child needs food on a schedule, and nothing is left for tonight.', effect: { score: -4 } },
        { key: 'C', label: 'Hold all the food and water back for the night', desc: 'A diabetic child cannot wait for a rationing plan that starts at nightfall, and eight hungry children get harder to manage, not easier.', effect: { score: -4 } },
        { key: 'D', label: 'Deal with food when someone complains and let them sort out toileting themselves', desc: 'Children who wander off alone to find a toilet on an unstable slope in the rain is exactly the incident you cannot afford.', effect: { score: -5 } }
      ]
    },
    {
      time: 60, type: 'decision', tag: 'MARK',
      title: 'Conflicting Advice',
      body: 'Advice floods in and contradicts itself: Police say stay where you are; Fire say move away from the unstable ' +
        'slopes; a passing truckie says the bridge behind you is still open; a local farmer offers to lead you across his ' +
        'private land; and parents are phoning demanding you drive around the closure now. Who do you act on?',
      decisionId: 'mark_advice',
      prompt: 'Whose advice do you act on?',
      options: [
        { key: 'A', label: 'Weigh it against what you can see, act on the official agencies and the safest verifiable option, and refuse any route you cannot confirm is safe', desc: 'Official advice plus your own eyes, and a hard no to unverified routes with eight children aboard. Defensible under pressure.', effect: { score: 5 } },
        { key: 'B', label: 'Do what the parents demand and drive around the closure now', desc: 'Driving an unstable, unconfirmed route under parental pressure is exactly how you strand or hurt the whole group.', effect: { score: -6 } },
        { key: 'C', label: 'Follow the farmer across private land because it sounds fastest', desc: 'An unverified route across unknown ground; "fastest" is not "safest" with this cargo.', effect: { score: -3 } },
        { key: 'D', label: 'Freeze - there are too many conflicting voices to choose', desc: 'Paralysis is itself a decision, and the children need you to make a call.', effect: { score: -4 } }
      ]
    },
    {
      time: 66, type: 'decision', tag: 'MARK',
      title: 'Wet Kit, Falling Temperature',
      body: 'The rain has soaked through team kit that was never meant for standing still in. Two of the younger children are ' +
        'shivering hard and one has stopped complaining, which worries you more. The van has a heater and a tank of fuel, ' +
        'and it is also the thing you moved everyone away from.',
      decisionId: 'mark_cold',
      prompt: 'How do you keep eight children warm?',
      options: [
        { key: 'A', label: 'Get everyone out of the wind and off the wet ground, layer whatever dry kit bags contain onto the coldest children first, and keep the group physically close together', desc: 'Insulation from the ground and the wind, and shared body heat, do more than anything else available to you - and cost no fuel.', effect: { score: 5 } },
        { key: 'B', label: 'Put everyone back in the van with the heater running', desc: 'The most effective option you have, if the van is still an option and the rockfall risk has genuinely eased.', effect: { score: 2 },
          locked: function (log) {
            return log['mark_tunnel'] === 'B' ? 'The van is 800 metres back down the road - you moved the group to the tunnel' : false;
          } },
        { key: 'C', label: 'Get them moving and running around to warm up', desc: 'Exercise on a wet, unstable slope with a head injury and an asthmatic in the group, burning the energy from food you do not have.', effect: { score: -4 } },
        { key: 'D', label: 'Tell them to tough it out - it is only a few hours', desc: 'The child who has stopped complaining is the one already in trouble. Cold children stop asking for help before they stop needing it.', effect: { score: -6 } }
      ]
    },
    {
      time: 72, type: 'decision', tag: 'ETHICAL',
      title: 'An Injured Stranger',
      body: 'You find another crashed vehicle nearby with injured adults inside, begging for help. Going fully to their aid ' +
        'means leaving eight children unsupervised by the road for several minutes.',
      decisionId: 'mark_stranger',
      prompt: 'Where does your priority lie?',
      options: [
        { key: 'A', label: 'Keep the children as your first duty - do what you safely can for the adults from nearby (pass water, brief them, get word out) without leaving the children unsupervised', desc: 'Your duty of care is the eight children; you help within that limit rather than abandoning them or doing nothing.', effect: { score: 5 } },
        { key: 'B', label: 'Leave the children and go fully assist the injured adults', desc: 'Leaves eight children you are responsible for unsupervised by a hazardous road to help others.', effect: { score: -4 } },
        { key: 'C', label: 'Ignore the adults entirely and keep your distance', desc: 'Your priority is right, but a flat refusal when some safe help was possible is harder to defend than partial aid.', effect: { score: -2 } },
        { key: 'D', label: 'Send the older children over to help the injured adults', desc: 'Sends children into a trauma and hazard scene that is not theirs to manage.', effect: { score: -5 } }
      ]
    },
    {
      time: 78, type: 'cascade', tag: 'AFTERSHOCK',
      title: 'Rockfall Around the Van',
      body: 'A strong aftershock rolls through the valley. Rock comes down across the road on both sides of the van, close ' +
        'enough to hear it land. Dust rises off the slope above, the river below sounds louder than it did, and three of the ' +
        'children are screaming.',
      source: 'Roadside',
      aftershock: true
    },
    {
      time: 84, type: 'decision', tag: 'CASCADE',
      title: 'Emergency Mobile Alert - Tsunami',
      body: 'An Emergency Mobile Alert sounds on every phone: "Strong earthquake near the coast. Move immediately to higher ' +
        'ground or as far inland as possible." The van is near the lower reaches of a river that flows to the coast. The ' +
        'children ask if a tsunami is coming, and nobody knows whether the route ahead or behind is safer.',
      decisionId: 'mark_tsunami',
      prompt: 'How do you respond to the tsunami alert?',
      options: [
        { key: 'A', label: 'Move the group to the nearest higher ground on foot now, away from the river, keeping everyone together - do not wait for confirmation', desc: 'An EMA and a strong coastal quake are the warning. Get off the low river ground to high ground immediately, as one group.', effect: { score: 5 } },
        { key: 'B', label: 'Stay put and wait to confirm whether the warning applies to you', desc: 'With a tsunami the instruction is do not wait, and you are on low ground by a river to the coast - the exact danger.', effect: { score: -6 } },
        { key: 'C', label: 'Drive fast along the river road to try to outrun it', desc: 'The road may be blocked or damaged, and staying low along the river is the risk, not the escape.', effect: { score: -3 } },
        { key: 'D', label: 'Let the children decide based on what their phones are saying', desc: 'Contradictory posts fragment the group at the moment you most need everyone moving the same way.', effect: { score: -4 } }
      ]
    },
    {
      time: 90, type: 'decision', tag: 'ETHICAL',
      title: 'A Parent Arrives',
      body: 'One child’s father has got through on a back road in a ute. He is taking his daughter home now, and he has room ' +
        'for two more. He does not know the other children, he cannot reach their parents, and he wants to leave in the next ' +
        'five minutes before the light goes.',
      decisionId: 'mark_parent_arrives',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Release his own daughter to him with her name, his name and the time written down, and only send other children if you can reach their parents and get agreement first', desc: 'A parent may take their own child. Other people’s children go only with their parents’ consent, and every release gets recorded.', effect: { score: 5 } },
        { key: 'B', label: 'Let him take his daughter and two others to get them out of the cold', desc: 'Handing children to a man their parents have not agreed to, with no record, is the thing you will not be able to explain to anyone.', effect: { score: -6 } },
        { key: 'C', label: 'Refuse to release any child, including his own daughter', desc: 'A parent collecting their own child is exactly what should happen; refusing is neither lawful nor sensible.', effect: { score: -4 } },
        { key: 'D', label: 'Ask him to take the two injured children instead of his daughter', desc: 'Sends the head injury and the broken arm away with an adult nobody has authorised, and their parents find out afterwards.', effect: { score: -5 } }
      ]
    },
    {
      time: 96, type: 'decision', tag: 'ETHICAL',
      title: '"Are We Going to Die?"',
      body: 'The threat passes for now, but the children are looking to you for certainty you do not have. One asks you ' +
        'directly, and the others go quiet waiting for the answer: "Are we going to die?"',
      decisionId: 'mark_truth',
      prompt: 'How do you answer them?',
      options: [
        { key: 'A', label: 'Be honest but calm: it is scary and serious, you do not have every answer, but your job is to keep them safe and here is exactly what you are all going to do next', desc: 'Honesty plus reassurance plus a plan, pitched for their age. It steadies the group without a promise you cannot keep.', effect: { score: 5 } },
        { key: 'B', label: 'Promise them nothing bad will happen and everything is fine', desc: 'A promise you cannot guarantee; if it breaks, so does their trust in everything else you tell them.', effect: { score: -3 } },
        { key: 'C', label: 'Tell them the full grim truth of every hazard you are worried about', desc: 'Accurate but terrifying and not age-appropriate; it floods frightened children with fear they cannot act on.', effect: { score: -3 } },
        { key: 'D', label: 'Refuse to answer and tell them to stop asking', desc: 'Leaves them more frightened and alone, and reads as you not coping either.', effect: { score: -2 } }
      ]
    },
    {
      time: 101, type: 'inject', tag: 'COMMS',
      title: 'One Child Cannot Reach Anyone',
      body: 'Seven of the eight have now had some contact with a parent. One has not. His mother’s phone rings out, his ' +
        'father is overseas, and the emergency contact on the team sheet is a landline in a suburb with no power. He has ' +
        'stopped asking to use your phone and has gone very quiet.',
      source: 'Roadside'
    },
    {
      time: 106, type: 'decision', tag: 'MARK',
      title: 'A Child Bolts for Reception',
      body: 'A frightened child suddenly runs back toward the damaged road, chasing a phone signal to reach their parents. ' +
        'You are the only adult: chasing them alone abandons the other seven near the hazards, but ignoring it leaves that ' +
        'child in extreme danger.',
      decisionId: 'mark_runaway',
      prompt: 'What do you do about the child who ran?',
      options: [
        { key: 'A', label: 'Keep the whole group together and move them as one toward the child while calling them back, never splitting off alone or losing sight of either', desc: 'As the only adult, you cannot abandon seven to chase one - so you move everyone together and never lose line of sight.', effect: { score: 5 } },
        { key: 'B', label: 'Run after the child alone, leaving the other seven unsupervised by the road', desc: 'Abandons seven children beside rockfall and slopes to recover one. Trades one risk for a bigger one.', effect: { score: -4 } },
        { key: 'C', label: 'Let the child go - chasing risks everyone', desc: 'Leaves a frightened child to run toward a damaged road and the river. Abandonment, not prioritisation.', effect: { score: -5 } },
        { key: 'D', label: 'Send another child to fetch them', desc: 'Sends a second child toward the same hazard. Two children at risk instead of one.', effect: { score: -3 } }
      ]
    },
    {
      time: 112, type: 'decision', tag: 'MARK',
      title: 'The Emergency Alert Sounds',
      body: 'Every phone in the group goes off at once with an Emergency Mobile Alert. The children read it before you do. ' +
        'Two of them are already crying and one is reading it aloud to the others in a rising voice.',
      decisionId: 'mark_ema',
      prompt: 'How do you handle the alert?',
      options: [
        { key: 'A', label: 'Read it properly yourself, tell them plainly what it does and does not mean for where you are standing, and say what you are going to do about it', desc: 'Eight children have already read it. The only thing you control is whether they understand it - and a plan attached to the news is what stops the panic.', effect: { score: 5 } },
        { key: 'B', label: 'Tell them to put their phones away and not to worry about it', desc: 'They have already read it, and being told not to worry by the adult who will not discuss it confirms that it is worse than they thought.', effect: { score: -4 } },
        { key: 'C', label: 'Read it aloud to the group exactly as written and let them draw their own conclusions', desc: 'Official alert wording is written for the whole region, not for eight frightened children on one road, and it will be read at its worst.', effect: { score: -3 } },
        { key: 'D', label: 'Collect the phones so they cannot see any more alerts', desc: 'Takes away their only contact with their parents, in exchange for information they have already seen.', effect: { score: -5 } }
      ]
    },
    {
      time: 118, type: 'decision', tag: 'ETHICAL',
      title: 'Helicopter - Three Seats',
      body: 'A rescue helicopter arrives, but it can carry only three children. The pilot asks: "Who goes first?" Your own ' +
        'daughter is among the eight.',
      decisionId: 'mark_helicopter',
      prompt: 'Who goes on the helicopter first?',
      options: [
        { key: 'A', label: 'The three with the greatest medical need - the head-injured, the diabetic without insulin, and the asthmatic running low - regardless of whose child they are', desc: 'Need-based triage, applied without favour to your own child. The fair and defensible allocation of a life-saving seat.', effect: { score: 5 } },
        { key: 'B', label: 'Your own daughter and her two closest friends', desc: 'Favouring your own child over more injured children is the bias the situation is built to test, and the hardest to defend to the other parents.', effect: { score: -6 } },
        { key: 'C', label: 'The three youngest children', desc: 'Age is a weak proxy when other children are medically critical right now.', effect: { score: -2 } },
        { key: 'D', label: 'Refuse to choose and send no one until everyone can go together', desc: 'Wastes a life-saving flight while critically injured children stay on the mountainside.', effect: { score: -4 } }
      ]
    },
    {
      time: 124, type: 'inject', tag: 'WEATHER',
      title: 'The Rain Turns to Sleet',
      body: 'The rain hardens into sleet and the wind gets up through the valley. Visibility is closing, the slope above is ' +
        'shedding water and small stones, and the light is going faster than the forecast said. Nobody is going to reach ' +
        'you by air tonight.',
      source: 'Roadside / MetService'
    },
    {
      time: 132, type: 'cascade', tag: 'NIGHTFALL',
      title: 'Night Falls and Snow Begins',
      body: 'Night closes in and snow starts to fall. The van has limited fuel, no rescuers have arrived, and the temperature ' +
        'is dropping toward dangerous. The children are cold, frightened and exhausted.',
      source: 'On the Road',
      aftershock: false
    },
    {
      time: 138, type: 'decision', tag: 'MARK',
      title: 'Surviving the Night',
      body: 'With snow falling, limited fuel and no rescue yet, you have to get the group through a freezing night.',
      decisionId: 'mark_night',
      prompt: 'How do you get everyone through the night?',
      options: [
        { key: 'A', label: 'Shelter in the van, run the engine briefly and intermittently for heat with a window cracked, huddle for warmth, and conserve fuel and battery for morning', desc: 'Shelter-in-place, manage the carbon-monoxide risk, share body heat, and keep a reserve. The survivable plan.', effect: { score: 5 } },
        { key: 'B', label: 'Keep everyone walking through the night to reach help', desc: 'Marching eight cold, injured children through snow and hazards in the dark invites hypothermia and falls.', effect: { score: -5 } },
        { key: 'C', label: 'Run the engine continuously all night for maximum heat', desc: 'Burns the fuel you need and risks carbon-monoxide build-up in a stationary vehicle.', effect: { score: -3 } },
        { key: 'D', label: 'Light a fire right beside the van', desc: 'A fire next to a possibly leaking vehicle and dry brush, in a child-filled spot, trades cold for burn and CO risk.', effect: { score: -3 } }
      ]
    },
    {
      time: 144, type: 'inject', tag: 'SITUATION',
      title: 'Others Join the Group',
      body: 'The occupants of a car caught behind the rockfall have made their way along to you: an elderly couple and a woman ' +
        'travelling alone. They have no shelter, no water and no warm clothing, and they have gravitated to the only ' +
        'organised group on the road. You are now responsible for eleven people instead of eight.',
      source: 'Roadside'
    },
    {
      time: 150, type: 'decision', tag: 'ETHICAL',
      title: 'Rescue Convoy - Room for Six',
      body: 'In the morning a rescue convoy reaches you, but it has room for only six children. Two must wait until a later ' +
        'run. How you choose - and how you explain it to their parents - both matter.',
      decisionId: 'mark_convoy',
      prompt: 'How do you decide who goes and who waits?',
      options: [
        { key: 'A', label: 'Send the six by clear, fair criteria (medical need and vulnerability), keep the two most robust with you, record who went where, and tell their parents the honest reason and the plan', desc: 'Transparent, need-based, documented and communicated. Defensible to every parent long after the event.', effect: { score: 5 },
          locked: function (log) {
            return log['mark_count'] === 'C' ? 'You cannot allocate places for a group you can no longer count - two are still out there' : false;
          } },
        { key: 'B', label: 'Send your own daughter and her friends first', desc: 'Favouritism that you could never justify to the parents of the children left behind in the cold.', effect: { score: -6 } },
        { key: 'C', label: 'Let the children decide among themselves who stays', desc: 'Abandons your accountability for the decision; the most frightened and least assertive lose out.', effect: { score: -4 } },
        { key: 'D', label: 'Refuse to split the group - everyone waits for a vehicle that can take all eight', desc: 'Keeps injured and vulnerable children in the cold when six could already be safe and warm.', effect: { score: -3 } }
      ]
    },
    {
      time: 156, type: 'decision', tag: 'ETHICAL',
      title: 'Handing Them Over',
      body: 'At the reunification point there are more adults than children and everyone is shouting. A grandmother is ' +
        'insisting she takes two of them, a family friend says he was told to collect one, and one child’s mother still ' +
        'has not been reached. Police are asking you, as the responsible adult, who goes with whom.',
      decisionId: 'mark_handover',
      prompt: 'How do you hand the children over?',
      options: [
        { key: 'A', label: 'Release each child only to a parent or someone the parent has authorised, verify each one, write down every handover with names and times, and stay with the last child until their parent is reached', desc: 'The last hour is where a well-run day gets undone. A written, verified handover - and staying with the child nobody has come for - is the whole job.', effect: { score: 5 },
          locked: function (log) {
            return log['mark_parent_arrives'] === 'B' ? 'You released two children without their parents’ consent hours ago - there is no consistent process left to run' : false;
          } },
        { key: 'B', label: 'Let the adults sort it out among themselves - they all know each other', desc: 'A crowded, shouting reunification point is exactly where a child leaves with the wrong adult and nobody notices for an hour.', effect: { score: -6 } },
        { key: 'C', label: 'Hand every child to Police and leave', desc: 'Police have no relationship with these children and no idea who is authorised; you are the person who does.', effect: { score: -4 } },
        { key: 'D', label: 'Release the ones you are sure about and leave the last child with a stranger', desc: 'The child nobody has come for is the one who most needs you to stay, and the last five minutes is not the place to stop.', effect: { score: -6 } }
      ]
    },
    {
      time: 160, type: 'info', tag: 'REUNIFICATION',
      title: 'The Last One',
      body: 'Seven children have gone with their parents. The eighth sits beside you with a borrowed jacket, still waiting, ' +
        'while a Police officer works the phone. His mother is found at a welfare centre across town at ten past nine. She ' +
        'has been ringing a number that has had no signal since half past three.',
      source: 'Reunification Point'
    },
    {
      time: 164, type: 'info', tag: 'HANDOVER',
      title: 'Everyone Out - The Hardest Lesson',
      body: 'By late morning all eight children are off the mountain and reunited with their families. There were no perfect ' +
        'decisions out there: every choice protected some children while increasing risk for others. Your job was never to ' +
        'find the perfect solution, but to make choices that were ethically defensible, child-centred, transparent, ' +
        'proportionate and adaptable - while carrying the weight of eight children whose parents had entrusted their lives ' +
        'to you, knowing each decision could be questioned long after the emergency ended.',
      source: 'Reunited'
    }
  ];

})();
