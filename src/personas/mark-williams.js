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
    statusBar: [
      { id: 'children', label: 'Children:', value: '8 aboard', cls: 'good' },
      { id: 'injured', label: 'Injured:', value: '2', cls: 'critical' },
      { id: 'coverage', label: 'Coverage:', value: 'Patchy', cls: 'warning' },
      { id: 'road', label: 'Road:', value: 'Blocked', cls: 'critical' },
      { id: 'weather', label: 'Snow:', value: 'Forecast', cls: 'warning' }
    ],
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
        { label: 'Social Media', value: 'Spreading', cls: 'failed' },
        { label: 'EMA Alert', value: 'Pending', cls: 'unknown' },
        { label: 'Phone Battery', value: 'Draining', cls: 'degraded' },
        { label: 'Radio', value: 'None', cls: 'failed' }
      ],
      transportTitle: 'Road & Terrain',
      transport: [
        { label: 'Road Ahead', value: 'Bridge Damaged', cls: 'failed' },
        { label: 'Road Behind', value: 'Rockfall', cls: 'failed' },
        { label: 'Tunnel (800m)', value: 'Unknown', cls: 'unknown' },
        { label: 'River Below', value: 'Rising', cls: 'degraded' },
        { label: 'Steep Slopes', value: 'Unstable', cls: 'failed' },
        { label: 'Tree Fall Risk', value: 'Moderate', cls: 'degraded' }
      ],
      cascadeTitle: 'Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '🪨', name: 'Rockfall', level: 'High', cls: 'high' },
        { icon: '⛰️', name: 'Landslide / Dam', level: 'Moderate', cls: 'moderate' },
        { icon: '🌊', name: 'Tsunami (river)', level: 'Watch', cls: 'moderate' },
        { icon: '🌲', name: 'Falling Trees', level: 'Moderate', cls: 'moderate' },
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
    'mark_night': { 'A': { warmth: 8, fuel: -5 }, 'C': { warmth: 10, fuel: -25 } }
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
    'mark_convoy': { 'A': { fairness: 8, parentTrust: 6, composure: 4 }, 'B': { fairness: -10, parentTrust: -6 }, 'C': { fairness: -4, childSafety: -3 }, 'D': { childSafety: -4 } }
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
    'mark_convoy': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, communityTrust: 1 }, 'C': { centralized: -2 }, 'D': { decisive: -1, lifeSafety: -1 } }
  });

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
      time: 150, type: 'decision', tag: 'ETHICAL',
      title: 'Rescue Convoy - Room for Six',
      body: 'In the morning a rescue convoy reaches you, but it has room for only six children. Two must wait until a later ' +
        'run. How you choose - and how you explain it to their parents - both matter.',
      decisionId: 'mark_convoy',
      prompt: 'How do you decide who goes and who waits?',
      options: [
        { key: 'A', label: 'Send the six by clear, fair criteria (medical need and vulnerability), keep the two most robust with you, record who went where, and tell their parents the honest reason and the plan', desc: 'Transparent, need-based, documented and communicated. Defensible to every parent long after the event.', effect: { score: 5 } },
        { key: 'B', label: 'Send your own daughter and her friends first', desc: 'Favouritism that you could never justify to the parents of the children left behind in the cold.', effect: { score: -6 } },
        { key: 'C', label: 'Let the children decide among themselves who stays', desc: 'Abandons your accountability for the decision; the most frightened and least assertive lose out.', effect: { score: -4 } },
        { key: 'D', label: 'Refuse to split the group - everyone waits for a vehicle that can take all eight', desc: 'Keeps injured and vulnerable children in the cold when six could already be safe and warm.', effect: { score: -3 } }
      ]
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
