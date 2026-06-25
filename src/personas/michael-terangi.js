// ============================================================================
// PERSONA: UTILITY MANAGING DIRECTOR  -  Michael Te Rangi, Alpine Utilities Ltd
// Managing Director of a regional electricity distribution network (~42,000
// customers) when a M7.9 Alpine Fault earthquake strikes at 10:34 a.m. and
// 38,000 customers lose power. Restoring the network safely when every decision
// leaves someone without power - a leadership problem, not just an engineering one.
// Source brief: "Persona Michael Te Rangi".
//
// Loaded AFTER nz-cascading-impact-simulator.js; registers itself by extending
// the engine's shared registries (purely additive).
// ============================================================================
(function () {
  'use strict';

  SCENARIO_CONFIGS.terangi = {
    label: 'UTILITY MD',
    actorTitle: 'Michael',
    classification: 'R3',
    classCSS: 'r3',
    classText: 'NETWORK DOWN',
    debriefName: 'M7.9 Alpine Fault - Alpine Utilities Ltd',
    facObjective: 'a utility managing director restoring an earthquake-damaged electricity network safely when every ' +
      'decision leaves someone without power. Key themes: field-crew safety versus restoration speed, prioritising ' +
      'critical infrastructure, urban versus rural and population versus vulnerability, leadership under political ' +
      'pressure, transparency about uncertain timelines, and financial stewardship versus community function.',
    startScore: 50,
    metrics: { customersOff: 38000, substationsOffline: 5, crews: 8 },
    statusBar: [
      { id: 'off', label: 'Customers Off:', value: '38,000', cls: 'critical' },
      { id: 'subs', label: 'Substations Offline:', value: '5/18', cls: 'critical' },
      { id: 'crews', label: 'Field Crews:', value: '8 avail', cls: 'warning' },
      { id: 'scada', label: 'SCADA:', value: 'Degraded', cls: 'warning' },
      { id: 'heli', label: 'Helicopters:', value: 'Grounded', cls: 'critical' }
    ],
    panels: {
      groupsTitle: 'Network Status',
      groups: [
        { label: 'Customers Off', value: '~38,000', cls: 'failed' },
        { label: 'Substations Offline', value: '5 / 18', cls: 'failed' },
        { label: 'Transmission Faults', value: 'Multiple', cls: 'failed' },
        { label: 'SCADA Visibility', value: 'Degraded', cls: 'degraded' },
        { label: 'Field Crews', value: '8 avail', cls: 'degraded' },
        { label: 'Trapped Crews', value: 'Unknown', cls: 'unknown' }
      ],
      agenciesTitle: 'Stakeholders',
      agencies: [
        { label: 'Mayor', value: '"Town centre"', cls: 'unknown' },
        { label: 'Board Chair', value: '"Industrial"', cls: 'unknown' },
        { label: 'Civil Defence', value: '"Life safety"', cls: 'degraded' },
        { label: 'National Grid', value: '"Transmission"', cls: 'unknown' },
        { label: 'Health Authority', value: '"Hospital"', cls: 'unknown' },
        { label: 'Media', value: '"Residential now"', cls: 'degraded' }
      ],
      lifelinesTitle: 'Critical Customers',
      lifelines: [
        { label: 'Hospital', value: 'Backup ~6h', cls: 'degraded' },
        { label: 'Water Treatment', value: 'Backup ~2h', cls: 'failed' },
        { label: 'Wastewater Pumps', value: 'Failing', cls: 'failed' },
        { label: 'Telecoms Towers', value: 'Discharging', cls: 'degraded' },
        { label: 'Fuel Terminal', value: 'Offline', cls: 'failed' },
        { label: 'Rest Homes (O2)', value: 'At Risk', cls: 'failed' }
      ],
      transportTitle: 'Field Conditions',
      transport: [
        { label: 'Mountain Towers', value: 'Unknown', cls: 'unknown' },
        { label: 'Underground Cable', value: 'Unknown', cls: 'unknown' },
        { label: 'Roads', value: 'Landslides', cls: 'failed' },
        { label: 'Bridges', value: 'Suspect', cls: 'degraded' },
        { label: 'Helicopters', value: 'Grounded', cls: 'failed' },
        { label: 'Live Conductors', value: 'Hazard', cls: 'failed' }
      ],
      cascadeTitle: 'Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '🪨', name: 'Rockfall / Slips', level: 'High', cls: 'high' },
        { icon: '⚡', name: 'Live Lines', level: 'High', cls: 'high' },
        { icon: '🛢️', name: 'Fuel Shortage', level: 'Moderate', cls: 'moderate' },
        { icon: '❄️', name: 'Snow', level: 'High', cls: 'high' },
        { icon: '🌊', name: 'Tsunami (coastal)', level: 'Watch', cls: 'moderate' }
      ],
      resourcesTitle: 'Resources'
    }
  };

  UTILITY_DEFAULTS.terangi = {
    crews: { label: 'Field Crews', value: 45, unit: '%' },
    generation: { label: 'Backup Generation', value: 30, unit: '%' },
    fuel: { label: 'Fuel', value: 40, unit: '%' },
    comms: { label: 'SCADA / Comms', value: 35, unit: '%' },
    heli: { label: 'Helicopter', value: 10, unit: '%' },
    spares: { label: 'Spares / Plant', value: 50, unit: '%' }
  };

  SOFT_METRIC_DEFAULTS.terangi = {
    crewSafety: { label: 'Crew Safety', value: 65, icon: '🦺' },
    restoration: { label: 'Restoration', value: 45, icon: '🔌' },
    criticalServices: { label: 'Critical Services', value: 50, icon: '🏥' },
    publicTrust: { label: 'Public Trust', value: 55, icon: '🤝' },
    stakeholder: { label: 'Stakeholder Mgmt', value: 55, icon: '🏛️' },
    finances: { label: 'Financial Stewardship', value: 55, icon: '💰' }
  };

  Object.assign(UTILITY_EFFECTS, {
    'terangi_crew_safety': { 'A': { crews: -5 }, 'B': { crews: -15 } },
    'terangi_hospital_water': { 'A': { crews: -10, generation: -5 } },
    'terangi_urban_rural': { 'A': { crews: -10 }, 'B': { crews: -10 } },
    'terangi_helicopter': { 'A': { heli: -10 }, 'B': { heli: -10 }, 'C': { heli: -10 } },
    'terangi_diesel': { 'A': { generation: 25, fuel: -15 }, 'B': { generation: -10 } },
    'terangi_marae': { 'A': { crews: -8, generation: -10 } }
  });

  Object.assign(SOFT_METRIC_EFFECTS, {
    'terangi_crew_safety': { 'A': { crewSafety: 8, restoration: 3, publicTrust: 2 }, 'B': { crewSafety: -12, restoration: 3 }, 'C': { restoration: -6, criticalServices: -4 }, 'D': { crewSafety: -4 } },
    'terangi_hospital_water': { 'A': { criticalServices: 8, publicTrust: 5, restoration: 3 }, 'B': { criticalServices: -6 }, 'C': { criticalServices: -8, publicTrust: -4 }, 'D': { criticalServices: -5 } },
    'terangi_political': { 'A': { stakeholder: 8, publicTrust: 6, criticalServices: 4 }, 'B': { stakeholder: -8, publicTrust: -5 }, 'C': { stakeholder: -6, criticalServices: -4 }, 'D': { stakeholder: -4 } },
    'terangi_urban_rural': { 'A': { restoration: 6, criticalServices: 4, publicTrust: 3 }, 'B': { publicTrust: -6, criticalServices: -3 }, 'C': { restoration: -8 }, 'D': { stakeholder: -4 } },
    'terangi_dairy': { 'A': { criticalServices: 6, publicTrust: 5, finances: -2 }, 'B': { publicTrust: -8, criticalServices: -4, finances: 3 }, 'C': { stakeholder: -3 }, 'D': { finances: -3 } },
    'terangi_trapped_crew': { 'A': { crewSafety: 10, publicTrust: 4, restoration: -3 }, 'B': { crewSafety: -12, restoration: 3 }, 'C': { crewSafety: -6 }, 'D': { crewSafety: -4 } },
    'terangi_helicopter': { 'A': { crewSafety: 8, restoration: 3 }, 'B': { restoration: 4, crewSafety: -2 }, 'C': { criticalServices: 6 }, 'D': { restoration: 3 } },
    'terangi_unsafe_rockface': { 'A': { crewSafety: 10, publicTrust: 4 }, 'B': { crewSafety: -12, restoration: 3 }, 'C': { crewSafety: -6 }, 'D': { restoration: -4 } },
    'terangi_pm_briefing': { 'A': { publicTrust: 8, stakeholder: 5 }, 'B': { publicTrust: -8, stakeholder: -4 }, 'C': { publicTrust: -3 }, 'D': { publicTrust: -4 } },
    'terangi_marae': { 'A': { criticalServices: 6, publicTrust: 6, restoration: -2 }, 'B': { publicTrust: -8, criticalServices: -4 }, 'C': { publicTrust: -3 }, 'D': { stakeholder: -3 } },
    'terangi_diesel': { 'A': { criticalServices: 8, publicTrust: 5, finances: -4 }, 'B': { criticalServices: -8, publicTrust: -5, finances: 4 }, 'C': { finances: -6, criticalServices: 3 }, 'D': { stakeholder: -3 } },
    'terangi_crew_refusal': { 'A': { crewSafety: 10, stakeholder: 3 }, 'B': { crewSafety: -12, restoration: 3 }, 'C': { crewSafety: -10, stakeholder: -4 }, 'D': { crewSafety: -3 } },
    'terangi_fatigue': { 'A': { crewSafety: 8, restoration: -2, stakeholder: -2 }, 'B': { crewSafety: -12, restoration: 3 }, 'C': { crewSafety: 3, restoration: -2 }, 'D': { crewSafety: -4 } }
  });

  Object.assign(STYLE_TAGS, {
    'terangi_crew_safety': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -2, lifeSafety: 1 }, 'D': { decisive: -1, centralized: -1 } },
    'terangi_hospital_water': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: 1 }, 'C': { decisive: 1, lifeSafety: -1 }, 'D': { decisive: -2 } },
    'terangi_political': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { centralized: 1, communityTrust: -2 }, 'C': { centralized: 2, communityTrust: -1 }, 'D': { decisive: -2 } },
    'terangi_urban_rural': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, communityTrust: -1 }, 'C': { communityTrust: 2, centralized: -1 }, 'D': { decisive: -2 } },
    'terangi_dairy': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { centralized: 1, communityTrust: -2 }, 'C': { decisive: -1 }, 'D': { decisive: -1 } },
    'terangi_trapped_crew': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -1, lifeSafety: -1 }, 'D': { decisive: -2 } },
    'terangi_helicopter': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -1 }, 'C': { decisive: 1, lifeSafety: 1 }, 'D': { decisive: 1 } },
    'terangi_unsafe_rockface': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: 1, lifeSafety: -1 }, 'D': { decisive: -2 } },
    'terangi_pm_briefing': { 'A': { decisive: 1, communityTrust: 1, centralized: 1 }, 'B': { decisive: 1, communityTrust: -2 }, 'C': { decisive: -1 }, 'D': { communityTrust: -1 } },
    'terangi_marae': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 2 }, 'B': { decisive: 1, communityTrust: -2 }, 'C': { communityTrust: -1 }, 'D': { decisive: -2 } },
    'terangi_diesel': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -2 }, 'C': { decisive: 1, centralized: -1 }, 'D': { decisive: -2 } },
    'terangi_crew_refusal': { 'A': { decisive: 1, lifeSafety: 2, communityTrust: 1 }, 'B': { decisive: 2, lifeSafety: -2, centralized: 2 }, 'C': { centralized: 2, communityTrust: -2 }, 'D': { decisive: -2 } },
    'terangi_fatigue': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { lifeSafety: 1 }, 'D': { decisive: -1 } }
  });

  Object.assign(CONSEQUENCE_MAP, {
    'terangi_crew_safety': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'A Crew Hit by Rockfall',
          body: 'Driving restoration hard without standing down the genuinely unsafe work, a crew working below an unstable ' +
            'slope was caught by an aftershock-triggered rockfall. There are injuries, the worksite is now a rescue, and ' +
            'restoration there has stopped entirely. No restored feeder is worth a lineworker’s life - the safe work could ' +
            'have continued; the unsafe work should not have.',
          source: 'Field Operations / Health & Safety',
          scorePenalty: -5
        }
      }
    },
    'terangi_unsafe_rockface': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Rock Face Lets Go',
          body: 'You sent the crew in beneath the unstable rock faces over the Health & Safety Manager’s explicit objection. ' +
            'A slab came down across the worksite. There are serious injuries, an investigation now sits over the whole ' +
            'response, and the restoration you were chasing is further away than ever. "Absolutely not" was the right call.',
          source: 'Health & Safety / Field Supervisor',
          scorePenalty: -6
        }
      }
    },
    'terangi_diesel': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Critical Services Start to Fail',
          body: 'With a seven-day transmission repair ahead and no emergency generation hired, the backup runways ran out: the ' +
            'water treatment plant and a rest home’s oxygen lost power before the network could reach them. Saving money in ' +
            'the moment has cost the community its most critical services - the spend that protected lives was the defensible one.',
          source: 'Critical Customers / Civil Defence',
          scorePenalty: -5
        }
      }
    }
  });

  Object.assign(FACILITATOR_NOTES, {
    'terangi_crew_safety': {
      learningObjective: 'Risk-assess each task and stand down genuinely unsafe work - no restoration is worth a crew’s life.',
      bestPractice: 'A',
      teachingNote: 'A blanket stop delays power to tens of thousands; reckless continuation kills lineworkers. The answer is ' +
        'task-by-task risk assessment with hazard controls, spotters and stand-down where conditions (live conductors, ' +
        'unstable slopes, aftershocks) are genuinely unsafe - restoration as fast as safety allows, not faster.',
      references: [
        { label: 'Worker safety primacy', desc: 'restoration speed never overrides a credible, uncontrolled life-safety risk to crews' }
      ],
      discussionPrompts: [
        'Who has authority to stand down a task, and how fast can they exercise it?',
        'How do you keep safe work going while pausing the unsafe?'
      ]
    },
    'terangi_hospital_water': {
      learningObjective: 'Sequence critical-infrastructure restoration by backup runway and consequence, not by status.',
      bestPractice: 'A',
      teachingNote: 'The hospital has ~6 hours of generation; the water plant has ~2. Restore the service about to fail first ' +
        '(water - losing it removes safe drinking water for the whole town), then the hospital within its window, while ' +
        'chasing generator fuel for both. Sequencing by runway and consequence beats defaulting to the highest-profile site.',
      references: [
        { label: 'Critical-infrastructure prioritisation', desc: 'restore by time-to-failure and breadth of consequence' }
      ],
      discussionPrompts: [
        'How do the two backup runways change the order of restoration?',
        'What do you do in parallel to extend both runways (fuel, generators)?'
      ]
    },
    'terangi_political': {
      learningObjective: 'Prioritise against a transparent, published framework, not the loudest or most powerful caller.',
      bestPractice: 'A',
      teachingNote: 'The Mayor, Board Chair and Civil Defence all make reasonable but conflicting demands. A pre-agreed ' +
        'prioritisation framework (life safety > critical infrastructure > economic), applied consistently and explained the ' +
        'same way to everyone, protects both the decisions and your credibility - letting power jump the queue corrodes both.',
      references: [
        { label: 'Restoration prioritisation framework', desc: 'objective criteria applied transparently across all stakeholders' }
      ],
      discussionPrompts: [
        'How do you say no to the Mayor and the Board Chair with the same framework?',
        'What makes a prioritisation decision defensible months later?'
      ]
    },
    'terangi_unsafe_rockface': {
      learningObjective: 'Uphold the Health & Safety stop - "calculated risk" pressure does not override an unacceptable hazard.',
      bestPractice: 'A',
      teachingNote: 'When the Health & Safety Manager says "absolutely not" to working beneath unstable rock faces, that stands ' +
        'even when Civil Defence urges calculated risks. Back the safety call and find a safer method or sequence; sending ' +
        'crews under an uncontrolled rockfall hazard for a feeder is how lineworkers die.',
      references: [
        { label: 'HSWA / stop-work authority', desc: 'an uncontrolled serious hazard is not a "calculated risk" to delegate to crews' }
      ],
      discussionPrompts: [
        'When is a risk "calculated" versus simply unacceptable?',
        'How do you resist operational and political pressure to override a safety stop?'
      ]
    },
    'terangi_marae': {
      learningObjective: 'Treat a welfare centre sheltering vulnerable people as a critical, life-safety load, not just numbers.',
      bestPractice: 'A',
      teachingNote: 'A marae now sheltering 350 vulnerable evacuees overnight has become a life-safety load, even though its ' +
        'feeder serves fewer than 5,000 urban homes. Prioritise it or provide interim generation, and explain the ' +
        'life-safety basis - a pure customer-count rule would abandon the most vulnerable people in the cold.',
      references: [
        { label: 'Vulnerability weighting', desc: 'restoration priority reflects life-safety and vulnerability, not raw customer numbers alone' }
      ],
      discussionPrompts: [
        'When does a "small" feeder become a critical load?',
        'How do you bridge the gap with interim generation while a feeder waits?'
      ]
    },
    'terangi_pm_briefing': {
      learningObjective: 'Be transparent about uncertainty under political pressure rather than promising false timelines.',
      bestPractice: 'A',
      teachingNote: 'Facing the Prime Minister and the media with incomplete information, give what you genuinely know, honest ' +
        'ranges, and what you are doing - not a confident restoration time you cannot meet. A missed promise destroys trust ' +
        'in every future message; honest uncertainty, clearly framed, holds it.',
      references: [
        { label: 'Communicating uncertainty', desc: 'honest ranges and next-update commitments beat false precision under pressure' }
      ],
      discussionPrompts: [
        'How do you give a frightened public something useful without a firm time you cannot keep?',
        'What do you commit to (next update, what you are doing) instead of a restoration date?'
      ]
    }
  });

  NOISE_POOL.terangi = [
    {
      tag: 'NOISE', title: 'Shareholder Demands a Cost Estimate',
      body: 'A major shareholder is on the line demanding to know "exactly how much this is going to cost" and what it means ' +
        'for the dividend, while you are still trying to find out how many towers are down.',
      source: 'Shareholder',
      prompt: 'How do you handle the shareholder?',
      options: [
        { key: 'A', label: 'Acknowledge the concern, explain the priority is safe restoration and you will provide figures once the damage is assessed, and refer them to the Board channel', desc: 'Honest and bounded: you cannot cost an unassessed network, and your attention belongs on safety and restoration right now.', effect: { score: 2 } },
        { key: 'B', label: 'Make up a cost figure to satisfy them', desc: 'A guessed number on an unassessed network will be wrong and will follow you; it is worse than "we do not know yet".', effect: { score: -2 } },
        { key: 'C', label: 'Refuse to take shareholder calls at all', desc: 'Shareholders are a legitimate stakeholder; a flat refusal breeds exactly the panic and rumour you do not need.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Contractor Wants a Payment Guarantee',
      body: 'A key contractor will not deploy additional crews until they have a written payment guarantee, with the banks ' +
        'unreachable and your own finances uncertain.',
      source: 'Contractor',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Give a clear commitment within your delegated authority, document it, and escalate anything beyond it to the Board', desc: 'Keeps crews moving with a commitment you can actually stand behind, while protecting the company from open-ended exposure.', effect: { score: 2 } },
        { key: 'B', label: 'Promise them anything to get the crews moving now', desc: 'Open-ended guarantees you have no authority for create a financial and legal mess that outlasts the earthquake.', effect: { score: -2 } },
        { key: 'C', label: 'Refuse any commitment and lose the crews', desc: 'Loses extra restoration capacity you badly need over a commitment you could have scoped within your authority.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Social Media: "Only Helping Wealthy Suburbs"',
      body: 'A post claiming your crews "are only restoring power to the wealthy suburbs and abandoning rural communities" is ' +
        'spreading and being picked up by talkback.',
      source: 'Social Media',
      prompt: 'How do you respond to the accusation?',
      options: [
        { key: 'A', label: 'Publish your prioritisation criteria plainly - life safety and critical services first - and show what is being done for rural and vulnerable communities', desc: 'Transparency about the actual basis for restoration order is the strongest answer to a "favouring the rich" narrative.', effect: { score: 2 } },
        { key: 'B', label: 'Argue with individual posters online', desc: 'Feeds the pile-on and drags your scarce attention into the comments instead of the response.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore it and hope it passes', desc: 'An unanswered "abandoning rural communities" claim hardens into accepted truth and erodes trust where you need it.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Staff Member Wants to Check on Family',
      body: 'A control-room operator, whose own home is damaged, asks to leave briefly to check on their family. Several others ' +
        'in the room are quietly anxious about theirs too.',
      source: 'Control Room',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Arrange cover and a short, staggered release for staff to get word on their families, and check welfare across the room', desc: 'Staff who know their families are safe work better and stay longer; getting ahead of it prevents a cascade of departures.', effect: { score: 2 } },
        { key: 'B', label: 'Refuse - the control room cannot lose anyone right now', desc: 'A control-room operator sick with worry about their damaged home is error-prone, and refusal breeds resentment and walkouts.', effect: { score: -2 } },
        { key: 'C', label: 'Let everyone go at once to be fair', desc: 'Emptying the control room at the same moment loses the network visibility you need to restore safely.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Politician Misquotes Your Timeline',
      body: 'A local politician has just told media that "the power company says everyone will be back on by tonight" - which ' +
        'you never said and cannot deliver. It is already spreading.',
      source: 'Media Monitoring',
      prompt: 'How do you respond to the misquote?',
      options: [
        { key: 'A', label: 'Issue a prompt, factual correction of the timeline without attacking the politician, and restate what you can actually commit to', desc: 'Corrects a false expectation fast before it sets, and protects your credibility for the genuinely hard days ahead.', effect: { score: 2 } },
        { key: 'B', label: 'Let it stand to avoid a public clash with a politician', desc: 'An uncorrected "back on by tonight" becomes the promise you are blamed for breaking when the lights stay off.', effect: { score: -2 } },
        { key: 'C', label: 'Publicly attack the politician for lying', desc: 'Turns a correction into a feud that becomes the story, instead of the accurate timeline you needed to land.', effect: { score: -1 } }
      ]
    }
  ];

  // ---- Event sequence -------------------------------------------------------
  PERSONA_EVENTS.terangi = [
    {
      time: 0, type: 'inject', tag: 'MAINSHOCK',
      title: 'M7.9 Alpine Fault - The Network Falls Over',
      body: 'At 10:34 a.m. a magnitude 7.9 Alpine Fault earthquake strikes. Within minutes Alpine Utilities sees multiple ' +
        'transmission faults, five substations offline, hundreds of protection trips, unknown damage to mountain transmission ' +
        'towers, fibre comms partially lost and SCADA visibility degraded. Roads are blocked by landslides, helicopters are ' +
        'grounded, fuel deliveries are interrupted, and nearly 38,000 customers have lost power. As Managing Director, you ' +
        'know that without electricity, water, fuel, communications, supermarkets and medical facilities all begin to fail.',
      source: 'Control Room',
      aftershock: true
    },
    {
      time: 4, type: 'info', tag: 'SITUATION',
      title: 'Everyone Wants Answers You Do Not Have',
      body: 'The information is incomplete: you do not yet know how many poles are down, the state of the transmission towers, ' +
        'substation integrity, the extent of underground cable damage, whether any field crews are trapped, or how long the ' +
        'outage will last. Several crews are already on the road. Restoring power is not just an engineering problem now - it ' +
        'is a leadership problem of safety, ethics, politics, economics and public trust, and everyone wants answers ' +
        'immediately.',
      source: 'Alpine Utilities Ltd'
    },
    {
      time: 10, type: 'decision', tag: 'NETWORK',
      title: 'Crew Safety vs Restoration',
      body: 'Several crews are already travelling into a landscape of live conductors, rockfall, damaged poles, unstable slopes, ' +
        'suspect bridges and continuing aftershocks. Standing them down protects them but delays restoration for tens of ' +
        'thousands; pushing on risks your people.',
      decisionId: 'terangi_crew_safety',
      prompt: 'How do you manage the crews in the field?',
      options: [
        { key: 'A', label: 'Risk-assess each task: stand down genuinely unsafe work, and continue safe work with hazard controls, spotters and clear stop-work authority', desc: 'Restoration as fast as safety allows, not faster. Safe tasks proceed; live-conductor and unstable-slope work waits.', effect: { score: 5 } },
        { key: 'B', label: 'Push all crews to restore as fast as possible - the town needs power', desc: 'Driving crews into uncontrolled live-line, rockfall and aftershock hazards is how a restoration becomes a fatality.', effect: { score: -5 } },
        { key: 'C', label: 'Stand all crews down completely until everything is assessed', desc: 'A blanket stop protects crews but needlessly delays power to tens of thousands, including critical services, where safe work was possible.', effect: { score: -2 } },
        { key: 'D', label: 'Leave it to each crew to decide for themselves', desc: 'No coordinated risk picture means inconsistent calls and crews making safety decisions without the information you hold.', effect: { score: -2 } }
      ]
    },
    {
      time: 22, type: 'inject', tag: 'CRITICAL',
      title: 'Hospital Generators Failing Early',
      body: 'The regional hospital reports its backup generators are running hotter and dirtier than expected on contaminated ' +
        'fuel and may fail hours earlier than planned. At the same time the water treatment plant warns its generators have ' +
        'only about two hours left, and wastewater pumps are starting to fail with untreated sewage threatening the river.',
      source: 'Critical Customers'
    },
    {
      time: 28, type: 'decision', tag: 'NETWORK',
      title: 'Hospital or Water?',
      body: 'Your first restored substation can re-energise only one critical load. The hospital has roughly six hours of ' +
        'backup generation left; the water treatment plant has only about two. If water treatment fails, the whole town may ' +
        'lose safe drinking water.',
      decisionId: 'terangi_hospital_water',
      prompt: 'Which critical load do you restore first?',
      options: [
        { key: 'A', label: 'Restore water treatment first (shortest runway, town-wide consequence), then the hospital within its window - and chase generator fuel for both in parallel', desc: 'Sequences by time-to-failure and breadth of consequence: water is about to go and affects everyone, the hospital still has hours.', effect: { score: 5 } },
        { key: 'B', label: 'Restore the hospital first - it is the highest-profile life-safety site', desc: 'Defaults to profile over runway; the hospital still had six hours while the water plant fails in two, risking the town’s drinking water.', effect: { score: -3 } },
        { key: 'C', label: 'Restore the wastewater pumps first to stop the sewage', desc: 'An environmental problem is real but ranks below safe drinking water and the hospital for immediate life safety.', effect: { score: -4 } },
        { key: 'D', label: 'Wait until you can restore both together', desc: 'Holding the one substation for a both-at-once solution lets the water plant fail while you wait.', effect: { score: -3 } }
      ]
    },
    {
      time: 40, type: 'decision', tag: 'NETWORK',
      title: 'Conflicting Stakeholders',
      body: 'The calls come in together. The Mayor: "Restore the town centre first." The Board Chair: "Protect our major ' +
        'industrial customers." Civil Defence: "Support life safety before economics." Each is reasonable; none align.',
      decisionId: 'terangi_political',
      prompt: 'How do you set restoration priorities?',
      options: [
        { key: 'A', label: 'Apply a transparent, published prioritisation framework - life safety, then critical infrastructure, then economic - and explain the same basis to all three', desc: 'An objective framework applied consistently protects both the decisions and your credibility, and gives everyone the same honest answer.', effect: { score: 5 } },
        { key: 'B', label: 'Do what the Board Chair wants - protect the major industrial customers', desc: 'Lets commercial power jump the queue ahead of life safety and critical services. Indefensible when the public sees it.', effect: { score: -5 } },
        { key: 'C', label: 'Do what the Mayor wants - restore the town centre first', desc: 'Political profile, not need, drives the order; the hospital, water and vulnerable wait behind the visible town centre.', effect: { score: -4 } },
        { key: 'D', label: 'Try to give every caller something to keep them all happy', desc: 'Fragmenting scarce crews to placate everyone restores nothing critical fully and satisfies no one.', effect: { score: -2 } }
      ]
    },
    {
      time: 52, type: 'decision', tag: 'ETHICAL',
      title: 'Urban vs Rural',
      body: 'One repair can restore either 9,000 urban customers or 600 isolated rural ones - and those 600 include elderly ' +
        'residents, farms, a remote marae and rural schools with no other support.',
      decisionId: 'terangi_urban_rural',
      prompt: 'Which repair do you make?',
      options: [
        { key: 'A', label: 'Restore the 9,000 now for the greatest function, commit the vulnerable rural feeder as the very next task, and arrange interim welfare/generation for them in the meantime', desc: 'Maximises restored function without abandoning the vulnerable: greatest good now, the rural feeder scheduled next, interim support bridging the gap.', effect: { score: 5 } },
        { key: 'B', label: 'Restore the 600 rural customers first because they are more vulnerable', desc: 'Compassionate, but leaving 9,000 (including their own critical services) off for a much smaller group is hard to defend without an interim option.', effect: { score: -2 } },
        { key: 'C', label: 'Refuse to choose and split the crew across both', desc: 'Splitting the repair crew likely restores neither group promptly and wastes scarce capacity.', effect: { score: -4 } },
        { key: 'D', label: 'Decide quietly and avoid explaining the basis', desc: 'Whatever you choose, doing it opaquely invites the "abandoned the rural communities" narrative and erodes trust.', effect: { score: -2 } }
      ]
    },
    {
      time: 64, type: 'decision', tag: 'ETHICAL',
      title: 'The Dairy Processor',
      body: 'A major dairy processor requests urgent restoration - without power, millions of litres of milk will be lost. ' +
        'Civil Defence argues firmly that residential communities and life safety come first.',
      decisionId: 'terangi_dairy',
      prompt: 'How do you weigh the dairy processor?',
      options: [
        { key: 'A', label: 'Restore life-safety and critical residential loads first, schedule the dairy as soon as it does not delay those, and be transparent with the processor about why', desc: 'Community function and life safety outrank a commercial loss, but the economic harm is real and gets a fair, scheduled place - explained openly.', effect: { score: 5 } },
        { key: 'B', label: 'Restore the dairy first to save the milk and protect a major customer', desc: 'Puts a commercial loss ahead of residential life safety and critical services. The wrong order, and a damaging look.', effect: { score: -5 } },
        { key: 'C', label: 'Refuse the dairy any priority and tell them to wait indefinitely', desc: 'The economic damage to a major employer is real; a flat "wait indefinitely" with no schedule is neither fair nor necessary.', effect: { score: -2 } },
        { key: 'D', label: 'Promise the dairy a slot you know you cannot honour', desc: 'A false commitment to placate a big customer destroys trust the moment it is missed.', effect: { score: -2 } }
      ]
    },
    {
      time: 76, type: 'decision', tag: 'NETWORK',
      title: 'A Crew Trapped by a Landslide',
      body: 'One of your field crews is cut off by a fresh landslide, with rockfall continuing. Diverting resources to reach ' +
        'them will pull effort off restoration; pressing on with restoration leaves your own people stranded in a hazard zone.',
      decisionId: 'terangi_trapped_crew',
      prompt: 'How do you respond to the trapped crew?',
      options: [
        { key: 'A', label: 'Prioritise getting your people to safety - coordinate the rescue with emergency services and account for every crew before pushing restoration there', desc: 'Worker life safety comes first; a trapped crew is a rescue, and your people have to be able to trust that you will come for them.', effect: { score: 5 } },
        { key: 'B', label: 'Press on with restoration and let the crew sit tight until it is convenient', desc: 'Treating a trapped crew as a lower priority than feeders tells every lineworker their safety is negotiable.', effect: { score: -5 } },
        { key: 'C', label: 'Send another crew in immediately by the same unstable route', desc: 'Rushing a second crew into the same active rockfall risks turning one trapped crew into two.', effect: { score: -3 } },
        { key: 'D', label: 'Wait for the crew to find their own way out', desc: 'Leaves your people to self-rescue from an active hazard with no coordinated support - an abdication of duty of care.', effect: { score: -3 } }
      ]
    },
    {
      time: 88, type: 'decision', tag: 'NETWORK',
      title: 'The One Helicopter Mission',
      body: 'A break in the weather makes the only available helicopter operational for a single mission. The options: inspect ' +
        'the mountain transmission towers, deliver crews to a remote fault, rescue the trapped workers, or fly a generator to ' +
        'the hospital.',
      decisionId: 'terangi_helicopter',
      prompt: 'What is the one helicopter mission?',
      options: [
        { key: 'A', label: 'Rescue the trapped workers - a life-safety mission outranks inspection or restoration', desc: 'With your own people in danger, the single flight goes to getting them out. Worker life safety first, every time.', effect: { score: 5 } },
        { key: 'B', label: 'Deliver crews to the remote fault to speed restoration', desc: 'Valuable for restoration, but choosing feeders over your trapped people when both are on the list is the wrong order.', effect: { score: -2 } },
        { key: 'C', label: 'Fly a generator to the hospital to protect its power', desc: 'A genuine life-safety mission - but the hospital still has backup, while the trapped crew’s safety is immediate.', effect: { score: 1 } },
        { key: 'D', label: 'Use it to inspect the transmission towers for the big picture', desc: 'Situational awareness matters, but it does not save a life today the way the rescue does.', effect: { score: -1 } }
      ]
    },
    {
      time: 100, type: 'decision', tag: 'NETWORK',
      title: 'Restore Beneath Unstable Rock Faces?',
      body: 'A field supervisor reports: "We can probably restore power if we work beneath some unstable rock faces." Your ' +
        'Health & Safety Manager says, flatly: "Absolutely not." Civil Defence is urging you to "take calculated risks".',
      decisionId: 'terangi_unsafe_rockface',
      prompt: 'Do you authorise work beneath the rock faces?',
      options: [
        { key: 'A', label: 'Back the Health & Safety stop - no work beneath uncontrolled unstable rock faces - and task the crews to a safer method or sequence', desc: 'An uncontrolled serious hazard is not a "calculated risk" to delegate to crews. The safety stop holds, and you find another way.', effect: { score: 5 } },
        { key: 'B', label: 'Override H&S and send the crews in - the restoration is too important', desc: 'Sending crews under unstable rock faces over an explicit safety objection is how lineworkers are killed, and it is on you.', effect: { score: -6 } },
        { key: 'C', label: 'Let the supervisor and crew decide on the spot', desc: 'Pushes an unacceptable, contested hazard decision down onto the people most exposed to it.', effect: { score: -3 } },
        { key: 'D', label: 'Delay any decision and leave the fault unaddressed', desc: 'Avoids the unsafe work but also abandons the restoration entirely, when a safer method or sequence was the answer.', effect: { score: -2 } }
      ]
    },
    {
      time: 112, type: 'cascade', tag: 'AFTERSHOCK',
      title: 'Aftershock - Transmission Corridor Cut',
      body: 'A strong aftershock brings a major landslide down across the main transmission corridor, snow begins to fall, ' +
        'and fuel shortages worsen. The situation is now deteriorating faster than your crews can repair it, and the big ' +
        'question - how long the worst-hit communities will be without power - just got much harder to answer.',
      source: 'Field Operations / GeoNet',
      aftershock: true
    },
    {
      time: 120, type: 'decision', tag: 'ETHICAL',
      title: 'The Marae Welfare Centre',
      body: 'An isolated rural marae has become a welfare centre sheltering 350 evacuees overnight. Restoring its feeder would ' +
        'delay restoring power to about 5,000 urban homes.',
      decisionId: 'terangi_marae',
      prompt: 'How do you treat the marae feeder?',
      options: [
        { key: 'A', label: 'Treat the marae as a critical life-safety load - prioritise its feeder or provide interim generation - and explain the basis to the urban customers waiting', desc: '350 vulnerable people sheltering overnight is a life-safety load, not a customer count. Restore or bridge it, transparently.', effect: { score: 5 } },
        { key: 'B', label: 'Restore the 5,000 urban homes first - the numbers are clear', desc: 'A raw customer-count rule abandons 350 vulnerable evacuees in the cold; numbers alone are not the priority basis.', effect: { score: -4 } },
        { key: 'C', label: 'Decide quietly for the urban homes and avoid explaining it', desc: 'Even if the call were defensible, doing it opaquely guarantees the "rural communities abandoned" story.', effect: { score: -3 } },
        { key: 'D', label: 'Defer the decision to Civil Defence entirely', desc: 'The feeder allocation is yours to make with Civil Defence’s welfare input - handing it off wholesale just stalls help.', effect: { score: -2 } }
      ]
    },
    {
      time: 134, type: 'decision', tag: 'OWNER',
      title: 'The Prime Minister Wants a Briefing',
      body: 'The Prime Minister requests a national media briefing. You have incomplete information, large uncertainty about ' +
        'restoration times, and intense political pressure to sound reassuring.',
      decisionId: 'terangi_pm_briefing',
      prompt: 'How much uncertainty do you disclose?',
      options: [
        { key: 'A', label: 'Be transparent: give what you genuinely know, honest ranges, what you are doing and the next update time - no restoration date you cannot stand behind', desc: 'Honest uncertainty, clearly framed, builds the trust you need for the hard days ahead and survives contact with reality.', effect: { score: 5 } },
        { key: 'B', label: 'Give a confident, optimistic restoration timeline to reassure the public', desc: 'A reassuring date you cannot meet destroys trust in every message that follows when the lights stay off.', effect: { score: -5 } },
        { key: 'C', label: 'Refuse to give any information until you know more', desc: 'A vacuum at a national briefing fills with rumour; you can be honest about uncertainty without going silent.', effect: { score: -3 } },
        { key: 'D', label: 'Downplay the damage to avoid alarming people', desc: 'Minimising a seven-day transmission problem buys calm now and costs all credibility when the scale emerges.', effect: { score: -3 } }
      ]
    },
    {
      time: 148, type: 'decision', tag: 'ETHICAL',
      title: 'Emergency Diesel at Enormous Cost',
      body: 'A crew confirms widespread damage to the main transmission corridor - estimated seven days to repair. The Board ' +
        'asks whether to hire emergency diesel generation at enormous cost. Civil Defence says "do whatever it takes"; the ' +
        'Finance Manager warns the company may never recover financially.',
      decisionId: 'terangi_diesel',
      prompt: 'Do you hire the emergency generation?',
      options: [
        { key: 'A', label: 'Hire emergency generation for the critical loads (hospital, water, welfare), staged and documented, and engage the Board, regulator and Government on cost recovery', desc: 'Spends to keep life-critical services running, but scoped to what matters and with cost-recovery in train - life safety over short-term finances, responsibly.', effect: { score: 5 } },
        { key: 'B', label: 'Refuse the expense to protect the company’s finances', desc: 'Saving money while critical services lose power for seven days trades community lives and function for the balance sheet.', effect: { score: -5 } },
        { key: 'C', label: 'Hire generation for everything regardless of cost - "whatever it takes"', desc: 'Unscoped, open-ended hire may bankrupt the company the community needs for its long recovery; "whatever it takes" still needs targeting.', effect: { score: -2 } },
        { key: 'D', label: 'Defer the decision until you have full costings', desc: 'Critical loads are failing now; waiting for perfect costings before protecting the hospital and water is too slow.', effect: { score: -3 } }
      ]
    },
    {
      time: 162, type: 'decision', tag: 'NETWORK',
      title: 'A Crew Leader Refuses a Task',
      body: 'A crew leader refuses an assigned restoration task, judging the conditions unsafe. Operations management believes ' +
        'the risk is acceptable and wants the work done. The crew leader is the person standing in front of the hazard.',
      decisionId: 'terangi_crew_refusal',
      prompt: 'How do you handle the refusal?',
      options: [
        { key: 'A', label: 'Back the crew leader’s stop-work right, reassess the hazard together with them and H&S, and only proceed if it can be genuinely controlled', desc: 'The person at the hazard has the right to stop, and protecting that right is what keeps your whole workforce safe and willing.', effect: { score: 5 } },
        { key: 'B', label: 'Direct them to do the task - operations says the risk is acceptable', desc: 'Overriding a frontline safety refusal from the office is how you get someone hurt and destroy stop-work culture.', effect: { score: -5 } },
        { key: 'C', label: 'Replace them with a crew that will not argue', desc: 'Punishing a safety refusal by swapping in a more compliant crew is both dangerous and a signal no lineworker forgets.', effect: { score: -4 } },
        { key: 'D', label: 'Leave operations and the crew to fight it out', desc: 'Ducking the call leaves a safety dispute unresolved at an active worksite, with no one backing the person at the hazard.', effect: { score: -3 } }
      ]
    },
    {
      time: 176, type: 'decision', tag: 'NETWORK',
      title: 'Exhausted Crews, 20 Hours In',
      body: 'Twenty hours in, the crews are exhausted and one has just narrowly avoided electrocution. Your Operations Manager ' +
        'recommends mandatory rest; Civil Defence is urging you to keep working through to restore power faster.',
      decisionId: 'terangi_fatigue',
      prompt: 'Do you rest the crews or push on?',
      options: [
        { key: 'A', label: 'Enforce mandatory rest and rotation - exhausted crews near live conductors are a fatality waiting to happen', desc: 'The near-miss is the warning. Rested crews restore safely; pushing fatigued lineworkers around live lines is how the near-miss becomes a death.', effect: { score: 5 } },
        { key: 'B', label: 'Push the crews on through - Civil Defence needs power restored faster', desc: 'After a near-electrocution, driving exhausted crews on around live conductors gambles a lineworker’s life for hours of restoration.', effect: { score: -5 } },
        { key: 'C', label: 'Let crews rest only if they ask to', desc: 'The most committed crews never ask; leaving rest to self-report fails exactly the people most at risk of the next near-miss.', effect: { score: -1 } },
        { key: 'D', label: 'Keep the most experienced crews working and rest the rest', desc: 'Experience does not make a fatigued lineworker safe near live lines; it just changes who has the accident.', effect: { score: -3 } }
      ]
    },
    {
      time: 190, type: 'info', tag: 'HANDOVER',
      title: 'Critical Loads Holding - The Hardest Lesson',
      body: 'The first restored substations are holding, emergency generation is keeping the hospital, water plant and welfare ' +
        'centre alive, the trapped crew is out, and your people are resting in rotation. You never had enough information, ' +
        'crews, fuel, time, money or equipment, and every restoration decision created winners and losers. The hardest lesson ' +
        'holds: restoring electricity was never just an engineering problem - it was a leadership problem of ethics, politics, ' +
        'economics, safety and public trust. The goal was not the fastest possible restoration, but the greatest community ' +
        'function while ensuring no worker was unnecessarily placed in harm’s way.',
      source: 'Alpine Utilities Ltd'
    }
  ];

})();
