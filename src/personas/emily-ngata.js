// ============================================================================
// PERSONA: CLINICAL DIRECTOR  -  Dr Emily Ngata, Alpine Community Medical Centre
// A rural clinical leader in a small alpine township (pop ~5,800) when a M7.9
// Alpine Fault earthquake strikes at 10:34 a.m. and 60+ casualties arrive at a
// medical centre with six treatment spaces. Disaster medicine: the greatest
// achievable benefit across a community when demand vastly exceeds resources.
// Source brief: "Persona Dr Emily Ngata".
//
// Loaded AFTER nz-cascading-impact-simulator.js; registers itself by extending
// the engine's shared registries (purely additive).
// ============================================================================
(function () {
  'use strict';

  SCENARIO_CONFIGS.ngata = {
    label: 'CLINICAL DIRECTOR',
    actorTitle: 'Dr Ngata',
    classification: 'R3',
    classCSS: 'r3',
    classText: 'MASS CASUALTY',
    debriefName: 'M7.9 Alpine Fault - Alpine Community Medical Centre',
    facObjective: 'a rural clinical leader providing the greatest achievable benefit across a whole community when demand ' +
      'vastly exceeds resources. Key themes: mass-casualty triage, scarce-resource allocation (oxygen, blood, ventilator, ' +
      'morphine), family versus professional duty, staff welfare and fatigue, public health, and transparent, ethical, ' +
      'defensible decisions that each carry moral injury.',
    startScore: 50,
    metrics: { presenting: 65, spaces: 6, doctors: 2, nurses: 2 },
    statusBar: [
      { id: 'casualties', label: 'Presenting:', value: '65', cls: 'critical' },
      { id: 'spaces', label: 'Treatment Spaces:', value: '6', cls: 'warning' },
      { id: 'clinicians', label: 'Doctors:', value: '2', cls: 'warning' },
      { id: 'transfer', label: 'Hospital:', value: '90+ min, cut off', cls: 'critical' },
      { id: 'power', label: 'Power:', value: 'Generator', cls: 'warning' }
    ],
    panels: {
      groupsTitle: 'Casualty Load',
      groups: [
        { label: 'Presenting', value: '65', cls: 'failed' },
        { label: 'Treatment Spaces', value: '6', cls: 'degraded' },
        { label: 'Critical (red)', value: '~12', cls: 'failed' },
        { label: 'Serious (orange)', value: '~25', cls: 'degraded' },
        { label: 'Walking Wounded', value: '~28', cls: 'degraded' },
        { label: 'Doctors / Nurses', value: '2 / 2', cls: 'degraded' }
      ],
      agenciesTitle: 'Advice & Liaison',
      agencies: [
        { label: 'Regional Hospital', value: '"Transfer all"', cls: 'unknown' },
        { label: 'Heli Coordinator', value: '"Hold critical"', cls: 'unknown' },
        { label: 'Nat. Clinical Group', value: '"Conserve meds"', cls: 'unknown' },
        { label: 'Civil Defence', value: '"Become CCS"', cls: 'degraded' },
        { label: 'Building Engineer', value: '"Evacuation risk"', cls: 'failed' },
        { label: 'Pharmacist', value: '"Ration now"', cls: 'degraded' }
      ],
      lifelinesTitle: 'Clinic & Utilities',
      lifelines: [
        { label: 'Power (generator)', value: 'On Fuel', cls: 'degraded' },
        { label: 'Water', value: 'Disrupted', cls: 'degraded' },
        { label: 'Oxygen', value: 'Limited', cls: 'degraded' },
        { label: 'Refrigeration', value: 'At Risk', cls: 'degraded' },
        { label: 'Telecoms', value: 'Intermittent', cls: 'degraded' },
        { label: 'Satellite Phone', value: 'Working', cls: 'good' }
      ],
      transportTitle: 'Access & Transfer',
      transport: [
        { label: 'Roads', value: 'Closed', cls: 'failed' },
        { label: 'Ambulance', value: 'Cannot Reach', cls: 'failed' },
        { label: 'Base Hospital', value: 'Cut Off', cls: 'failed' },
        { label: 'Helicopters', value: 'Grounded', cls: 'failed' },
        { label: 'Carpark Triage', value: 'Active', cls: 'degraded' },
        { label: '4WD Vehicle', value: 'Available', cls: 'good' }
      ],
      cascadeTitle: 'Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '🏗️', name: 'Clinic Structure', level: 'High', cls: 'high' },
        { icon: '🌊', name: 'Tsunami (coastal)', level: 'Watch', cls: 'moderate' },
        { icon: '🚱', name: 'Water / Gastro', level: 'High', cls: 'high' },
        { icon: '🧊', name: 'Refrigeration Loss', level: 'Moderate', cls: 'moderate' },
        { icon: '❄️', name: 'Snow / Cold', level: 'High', cls: 'high' }
      ],
      resourcesTitle: 'Clinical Resources'
    }
  };

  UTILITY_DEFAULTS.ngata = {
    oxygen: { label: 'Oxygen', value: 30, unit: '%' },
    blood: { label: 'Blood Products', value: 35, unit: '%' },
    meds: { label: 'Morphine / Meds', value: 40, unit: '%' },
    power: { label: 'Generator Fuel', value: 50, unit: '%' },
    staffEnergy: { label: 'Staff Energy', value: 60, unit: '%' },
    space: { label: 'Treatment Space', value: 20, unit: '%' }
  };

  SOFT_METRIC_DEFAULTS.ngata = {
    populationBenefit: { label: 'Population Benefit', value: 55, icon: '👥' },
    triageQuality: { label: 'Triage Quality', value: 60, icon: '🩺' },
    staffWelfare: { label: 'Staff Welfare', value: 60, icon: '👩‍⚕️' },
    ethics: { label: 'Ethical Standing', value: 65, icon: '⚖️' },
    communityTrust: { label: 'Community Trust', value: 55, icon: '🤝' },
    composure: { label: 'Composure', value: 55, icon: '🫡' }
  };

  Object.assign(UTILITY_EFFECTS, {
    'ngata_oxygen': { 'A': { oxygen: -10 }, 'B': { oxygen: -15 }, 'D': { oxygen: -8 } },
    'ngata_blood': { 'A': { blood: -15 }, 'B': { blood: -30 } },
    'ngata_ventilator': { 'A': { power: -5 } },
    'ngata_fire_supplies': { 'A': { meds: -5 }, 'B': { meds: -20, blood: -10 } },
    'ngata_oxygen_welfare': { 'A': { oxygen: -10 }, 'B': { oxygen: -25 } },
    'ngata_evacuate': { 'A': { space: 10 } }
  });

  Object.assign(SOFT_METRIC_EFFECTS, {
    'ngata_triage': { 'A': { triageQuality: 8, populationBenefit: 6, ethics: 4 }, 'B': { triageQuality: -6, populationBenefit: -4 }, 'C': { triageQuality: -4, communityTrust: 2 }, 'D': { triageQuality: -8, ethics: -4 } },
    'ngata_family': { 'A': { composure: 6, populationBenefit: 5, triageQuality: 3 }, 'B': { populationBenefit: -10, triageQuality: -6 }, 'C': { composure: -4, populationBenefit: -3 }, 'D': { composure: 4, staffWelfare: -3 } },
    'ngata_oxygen': { 'A': { triageQuality: 8, populationBenefit: 6, ethics: 4 }, 'B': { populationBenefit: -6, ethics: -3 }, 'C': { triageQuality: -4, ethics: -2 }, 'D': { triageQuality: -6, communityTrust: -3 } },
    'ngata_blood': { 'A': { triageQuality: 6, populationBenefit: 5, ethics: 3 }, 'B': { populationBenefit: -6 }, 'C': { triageQuality: -5, populationBenefit: -4 }, 'D': { ethics: -3 } },
    'ngata_ventilator': { 'A': { triageQuality: 8, ethics: 5, populationBenefit: 4 }, 'B': { triageQuality: -5, ethics: -3 }, 'C': { triageQuality: -4 }, 'D': { triageQuality: -6, populationBenefit: -3 } },
    'ngata_cpr': { 'A': { triageQuality: 8, populationBenefit: 6, ethics: 3, composure: -2 }, 'B': { populationBenefit: -8, triageQuality: -5 }, 'C': { triageQuality: -3 }, 'D': { ethics: -4, staffWelfare: -3 } },
    'ngata_school': { 'A': { populationBenefit: 6, triageQuality: 4, communityTrust: 3 }, 'B': { populationBenefit: -8, triageQuality: -5 }, 'C': { populationBenefit: -3 }, 'D': { communityTrust: -4, ethics: -2 } },
    'ngata_ambulance': { 'A': { triageQuality: 8, ethics: 5, populationBenefit: 4 }, 'B': { triageQuality: -6, ethics: -4 }, 'C': { ethics: -3, communityTrust: -2 }, 'D': { triageQuality: -4 } },
    'ngata_evacuate': { 'A': { triageQuality: 6, ethics: 5, staffWelfare: 4 }, 'B': { triageQuality: -10, staffWelfare: -6 }, 'C': { ethics: -8, triageQuality: -5 }, 'D': { populationBenefit: -3 } },
    'ngata_fire_supplies': { 'A': { ethics: 6, communityTrust: 5, populationBenefit: 4 }, 'B': { populationBenefit: -8, triageQuality: -5 }, 'C': { communityTrust: -4 }, 'D': { communityTrust: -3 } },
    'ngata_oxygen_welfare': { 'A': { populationBenefit: 6, ethics: 5, communityTrust: 4 }, 'B': { triageQuality: -8, ethics: -3 }, 'C': { populationBenefit: -8, communityTrust: -4 }, 'D': { ethics: -3 } },
    'ngata_staff_fatigue': { 'A': { staffWelfare: 8, triageQuality: 5, ethics: 4 }, 'B': { staffWelfare: -10, triageQuality: -8 }, 'C': { staffWelfare: 3, populationBenefit: -3 }, 'D': { staffWelfare: -5 } },
    'ngata_media': { 'A': { communityTrust: 8, ethics: 5 }, 'B': { communityTrust: -8, ethics: -6 }, 'C': { communityTrust: -3 }, 'D': { communityTrust: -4 } }
  });

  Object.assign(STYLE_TAGS, {
    'ngata_triage': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: 1 }, 'C': { lifeSafety: -1, communityTrust: 1 }, 'D': { decisive: -2, centralized: -1 } },
    'ngata_family': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { lifeSafety: -1, centralized: -2 }, 'C': { decisive: -1 }, 'D': { centralized: -1, communityTrust: 1 } },
    'ngata_oxygen': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -1 }, 'C': { decisive: -1, communityTrust: 1 }, 'D': { decisive: -2 } },
    'ngata_blood': { 'A': { decisive: 1, lifeSafety: 2 }, 'B': { decisive: 1, lifeSafety: -1 }, 'C': { decisive: -2, lifeSafety: -1 }, 'D': { decisive: -1 } },
    'ngata_ventilator': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -1 }, 'C': { lifeSafety: -1, communityTrust: 1 }, 'D': { decisive: -2 } },
    'ngata_cpr': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -1, lifeSafety: -1 }, 'C': { decisive: 1 }, 'D': { decisive: -2 } },
    'ngata_school': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -1, centralized: -2 }, 'C': { decisive: -1 }, 'D': { communityTrust: -1 } },
    'ngata_ambulance': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -1 }, 'C': { communityTrust: 1, lifeSafety: -1 }, 'D': { decisive: -2 } },
    'ngata_evacuate': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -2 }, 'C': { decisive: 2, lifeSafety: -2, centralized: -1 }, 'D': { decisive: -2 } },
    'ngata_fire_supplies': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, communityTrust: 1, lifeSafety: -1 }, 'C': { centralized: 2, communityTrust: -1 }, 'D': { decisive: -2 } },
    'ngata_oxygen_welfare': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { centralized: 1, communityTrust: -1 }, 'C': { lifeSafety: -1, communityTrust: 2 }, 'D': { decisive: -2 } },
    'ngata_staff_fatigue': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: 1 }, 'D': { decisive: -1 } },
    'ngata_media': { 'A': { decisive: 1, communityTrust: 1, centralized: 1 }, 'B': { decisive: 1, communityTrust: -1 }, 'C': { decisive: -2 }, 'D': { centralized: 1, communityTrust: -1 } }
  });

  Object.assign(CONSEQUENCE_MAP, {
    'ngata_evacuate': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Aftershock Brings Down a Ceiling Section',
          body: 'You kept the whole centre operating despite the engineer’s warning. A further aftershock dropped a section ' +
            'of ceiling across a corridor packed with waiting casualties and staff, causing fresh injuries and forcing the ' +
            'chaotic evacuation you were trying to avoid - now under far worse conditions, mid-procedure. The structural ' +
            'warning was the one you could not safely ignore.',
          source: 'Building Engineer / GeoNet',
          scorePenalty: -5
        }
      }
    },
    'ngata_staff_fatigue': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'A Second Medication Error',
          body: 'Pushing exhausted staff on through hour 20, a second medication error occurs - this one reaching a patient. ' +
            'A fatigued team making errors is now harming the very people it is trying to save, and the error will sit with ' +
            'the staff member long after the earthquake. Rest was not a luxury; it was patient safety.',
          source: 'Clinical Governance',
          scorePenalty: -4
        }
      }
    },
    'ngata_fire_supplies': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Clinic Runs Dry',
          body: 'Having handed the Fire Service the bulk of your IV fluids, dressings and pain relief, a bus of injured ' +
            'tourists arrives and you have little left to treat them with. The casualty-clearing hub cannot clear casualties ' +
            'without its own supplies - a shared, prioritised split would have served both.',
          source: 'Resus / Supply',
          scorePenalty: -4
        }
      }
    }
  });

  Object.assign(FACILITATOR_NOTES, {
    'ngata_triage': {
      learningObjective: 'Triage by clinical urgency and survivability to do the greatest good, not by sympathy or status.',
      bestPractice: 'A',
      teachingNote: 'Mass-casualty triage means treating those who will die without immediate care but can survive with it ' +
        '(immediate/red), holding the walking wounded, and recognising the expectant. "Children first" or "loudest first" ' +
        'feels humane but costs more lives overall. A structured, transparent system is the kindest thing in the chaos.',
      references: [
        { label: 'Mass-casualty triage', desc: 'sort by urgency and survivability (immediate / urgent / minor / expectant)' }
      ],
      discussionPrompts: [
        'How do you make a triage category visible and consistent across the team and the carpark?',
        'How do you support staff through the moral weight of an "expectant" decision?'
      ]
    },
    'ngata_family': {
      learningObjective: 'Hold clinical leadership of a mass-casualty scene while finding a humane way to check on family.',
      bestPractice: 'A',
      teachingNote: 'As one of only two doctors, leaving collapses the response for 65 casualties. Delegate a check on your ' +
        'family (the 4WD, a message via the sat phone), stay and lead, and name the personal cost openly - rather than ' +
        'abandoning the centre or suppressing the worry until it impairs your judgement.',
      references: [
        { label: 'Command continuity', desc: 'in a mass-casualty event the clinical lead’s presence is itself a critical resource' }
      ],
      discussionPrompts: [
        'What is the most humane way to get word on your family without leaving the scene?',
        'How do you acknowledge the personal toll without it destabilising the team?'
      ]
    },
    'ngata_oxygen': {
      learningObjective: 'Allocate a scarce, life-sustaining resource by clinical benefit and survivability, transparently.',
      bestPractice: 'A',
      teachingNote: 'Three cylinders cannot cover five oxygen-dependent patients. Allocate to those who will most benefit and ' +
        'are most likely to survive with it (and can be weaned), reassess continually, and be transparent about the basis - ' +
        'rather than first-come-first-served or freezing because the choice is unbearable.',
      references: [
        { label: 'Crisis standards of care', desc: 'allocate scarce life-sustaining resources by likelihood of benefit' }
      ],
      discussionPrompts: [
        'What makes a patient the right or wrong call for scarce oxygen here?',
        'How and how often do you reassess the allocation as patients change?'
      ]
    },
    'ngata_cpr': {
      learningObjective: 'Reallocate effort from a low-survivability arrest to salvageable patients in a mass-casualty setting.',
      bestPractice: 'A',
      teachingNote: 'Prolonged CPR on a 79-year-old arrest ties up the staff three critically injured children need to ' +
        'survive. In a mass-casualty context, redirecting effort to the salvageable is the doctrine - but it is moral injury, ' +
        'and the team needs support and a clear, documented rationale.',
      references: [
        { label: 'Disaster reallocation', desc: 'effort follows survivability when resources cannot cover all' }
      ],
      discussionPrompts: [
        'How does this decision differ from the same arrest on a normal day?',
        'How do you support the staff who have to stop?'
      ]
    },
    'ngata_evacuate': {
      learningObjective: 'Respond to a structural safety warning without abandoning patients mid-procedure.',
      bestPractice: 'A',
      teachingNote: 'You cannot ignore an engineer who says the building should not stay occupied after another aftershock, ' +
        'and you cannot drop surgical patients. Safely complete or pause the critical procedure while beginning a controlled, ' +
        'staged evacuation of everyone else to an alternative space - not "keep operating regardless" or "abandon and run".',
      references: [
        { label: 'Structural safety', desc: 'an occupied building flagged unsafe after aftershocks is a life-safety risk to all inside' }
      ],
      discussionPrompts: [
        'Where is your alternative clinical space, and how fast can you stand it up?',
        'How do you stage an evacuation that protects the sickest patients?'
      ]
    },
    'ngata_staff_fatigue': {
      learningObjective: 'Enforce rest and rotation - fatigued clinicians making errors are a patient-safety hazard.',
      bestPractice: 'A',
      teachingNote: 'After 18 hours, a medication error, a nurse asleep on her feet and another in tears are the warning ' +
        'signs. Mandatory rest and rotation, even at reduced throughput, prevents the errors that harm patients - "push ' +
        'through" trades a slower service now for a dangerous one.',
      references: [
        { label: 'Fatigue and safety', desc: 'clinical error rises sharply with fatigue; rest is a patient-safety control' }
      ],
      discussionPrompts: [
        'How do you rotate rest when every clinician feels indispensable?',
        'What service do you reduce first to make rest possible?'
      ]
    }
  });

  NOISE_POOL.ngata = [
    {
      tag: 'NOISE', title: 'A Parent Demands Their Uninjured Child Be Seen',
      body: 'A frightened parent is loudly demanding immediate treatment for their distressed but physically uninjured child, ' +
        'while a farmer with suspected internal bleeding waits quietly nearby.',
      source: 'Triage / Carpark',
      prompt: 'How do you handle the demand?',
      options: [
        { key: 'A', label: 'Calmly explain the triage system, direct the child to reassurance/first-aid support, and keep the farmer in the priority queue', desc: 'Holds the triage line that keeps the sickest alive, while still meeting the child’s real (non-clinical) need for reassurance.', effect: { score: 2 } },
        { key: 'B', label: 'See the child now to quiet the parent', desc: 'Rewards the loudest voice over clinical need; the farmer with internal bleeding pays for it.', effect: { score: -2 } },
        { key: 'C', label: 'Dismiss the parent sharply', desc: 'Holds the queue but needlessly burns trust with a frightened family in front of the whole waiting room.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: '"Can I Take Mum Home?"',
      body: 'A relative wants to take their elderly mother - stable but frail, on the oxygen waiting list - home now, "to ' +
        'free up a space and get her warm".',
      source: 'Family',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Explain the risks clearly, document the conversation, and support a safe decision either way', desc: 'Respects family autonomy with informed consent and a record, rather than a rushed yes or a flat no.', effect: { score: 2 } },
        { key: 'B', label: 'Send her home immediately to free the space', desc: 'Frees a space by discharging a frail oxygen-dependent patient into a cold, powerless home without proper assessment.', effect: { score: -2 } },
        { key: 'C', label: 'Refuse to discuss it - you are too busy', desc: 'Misses a chance to safely free a space and leaves the family feeling shut out.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: '"Why Are Tourists Treated Before Locals?"',
      body: 'A group of locals is angry that injured tourists from the bus are being treated ahead of residents who "were ' +
        'here first".',
      source: 'Waiting Room',
      prompt: 'How do you respond to the accusation?',
      options: [
        { key: 'A', label: 'Explain plainly that treatment order follows injury severity, not who someone is or where they are from', desc: 'Defends the principle that triage is need-based and blind to status or origin - the ethical core of the response.', effect: { score: 2 } },
        { key: 'B', label: 'Quietly move locals up the queue to keep the peace', desc: 'Abandons need-based triage for local politics; the most injured patient, whoever they are, pays for it.', effect: { score: -3 } },
        { key: 'C', label: 'Ignore the complaint', desc: 'Lets a corrosive "us vs them" narrative grow unchecked in a crowded, frightened room.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'An Offer of Expired Medication',
      body: 'A well-meaning local offers a box of their own leftover and expired medications "in case it helps", and wants ' +
        'you to use it.',
      source: 'Community',
      prompt: 'How do you handle the offer?',
      options: [
        { key: 'A', label: 'Thank them, decline using unverified/expired medication clinically, and redirect their goodwill to a useful task', desc: 'Avoids the patient-safety and governance risk of unverified drugs while keeping a willing helper onside.', effect: { score: 2 } },
        { key: 'B', label: 'Use it - any medication is better than none', desc: 'Unverified, expired medication is a clinical-governance and patient-safety hazard, not a stopgap.', effect: { score: -3 } },
        { key: 'C', label: 'Brush them off curtly', desc: 'Declining is right, but a curt brush-off needlessly bruises community goodwill you will rely on.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Nurse’s Phone Keeps Ringing',
      body: 'One of your nurses’ phones keeps ringing with family calls; she is trying to work but is visibly distracted and ' +
        'distressed between patients.',
      source: 'Resus',
      prompt: 'How do you support her?',
      options: [
        { key: 'A', label: 'Give her two minutes to get word on her family, then bring her back focused - and check the rest of the team', desc: 'A brief, humane release valve keeps a distracted clinician safe to practise and signals you see your staff as people.', effect: { score: 2 } },
        { key: 'B', label: 'Tell her to switch the phone off and keep working', desc: 'A clinician sick with worry about her family is distracted and error-prone; ignoring it does not make it go away.', effect: { score: -1 } },
        { key: 'C', label: 'Send her home for the rest of the day', desc: 'Overcorrects - you lose a needed nurse when two minutes and a check-in would have settled her.', effect: { score: 0 } }
      ]
    }
  ];

  // ---- Event sequence -------------------------------------------------------
  PERSONA_EVENTS.ngata = [
    {
      time: 0, type: 'inject', tag: 'MAINSHOCK',
      title: 'M7.9 Alpine Fault - The Town Comes Down',
      body: 'At 10:34 a.m. a magnitude 7.9 Alpine Fault earthquake strikes. Severe structural damage spreads across the ' +
        'township; roads close in multiple directions; power, water and telecommunications fail. Ambulances cannot reach you, ' +
        'the base hospital is over 90 minutes away and cut off, helicopters are grounded by weather, and heavy snow is ' +
        'forecast overnight. As Clinical Director and one of only two doctors in town, you have a small generator, limited ' +
        'oxygen, six treatment spaces - and the casualties are already coming.',
      source: 'Alpine Community Medical Centre',
      aftershock: true
    },
    {
      time: 4, type: 'info', tag: 'SITUATION',
      title: 'The Carpark Becomes a Triage Area',
      body: 'Within 45 minutes more than 60 casualties are arriving: multiple fractures, crush and head injuries, major ' +
        'bleeding, a heart attack, a labouring mother at 36 weeks, a child in severe asthma, elderly patients needing ' +
        'oxygen. The waiting room overflows and the carpark becomes an unofficial triage area. Your job now is not to give ' +
        'every patient the best possible care - it is to do the greatest achievable good for the whole community with what ' +
        'you have.',
      source: 'Medical Centre / Carpark'
    },
    {
      time: 10, type: 'decision', tag: 'CLINICAL',
      title: 'Mass-Casualty Triage',
      body: 'Sixty-five patients are present and serious injuries keep arriving, but you have only six treatment spaces and ' +
        'two doctors. Every choice means someone waits. How do you set the priority?',
      decisionId: 'ngata_triage',
      prompt: 'How do you prioritise treatment?',
      options: [
        { key: 'A', label: 'Run a structured triage by clinical urgency and survivability - treat those who die without immediate care but can survive with it, hold the walking wounded, recognise the expectant', desc: 'The disaster-medicine standard: a transparent, consistent system that saves the most lives, however hard the categories feel.', effect: { score: 5 } },
        { key: 'B', label: 'Treat the most seriously injured first, regardless of survival odds', desc: 'Pouring scarce effort into the unsurvivable means the salvageable patients next to them die waiting.', effect: { score: -2 } },
        { key: 'C', label: 'Treat all children first', desc: 'Humane by instinct, but age is not urgency; a child with a sprain ahead of an adult who is bleeding out costs lives.', effect: { score: -3 } },
        { key: 'D', label: 'See people in the order they arrived to be fair', desc: 'First-come-first-served abandons triage entirely; the sickest, who often cannot queue, die in the carpark.', effect: { score: -5 } }
      ]
    },
    {
      time: 24, type: 'decision', tag: 'ETHICAL',
      title: 'Family vs Professional Duty',
      body: 'You have no contact with your husband or two teenage children, and reports suggest the secondary school has ' +
        'suffered building damage. Your staff know, and nobody says it. If you leave to find them, clinical leadership of 65 ' +
        'casualties collapses; if you stay, you may never forgive yourself.',
      decisionId: 'ngata_family',
      prompt: 'Do you stay or go to find your family?',
      options: [
        { key: 'A', label: 'Stay and lead, and send the 4WD and a sat-phone message to check on your family and get word back', desc: 'As one of two doctors, your presence is itself a critical resource. Delegate the check, stay and lead, and name the cost.', effect: { score: 5 } },
        { key: 'B', label: 'Leave now to find your family yourself', desc: 'Removing the clinical lead from a mass-casualty scene collapses the response for 65 people who have no one else.', effect: { score: -6 } },
        { key: 'C', label: 'Stay, but say nothing and push the fear down', desc: 'Suppressed, unaddressed terror about your own children quietly degrades the very judgement the team depends on.', effect: { score: -3 } },
        { key: 'D', label: 'Send a nurse to the school to check on your children', desc: 'Pulls a needed clinician off the floor for your personal worry when the 4WD and a message could do it.', effect: { score: -2 } }
      ]
    },
    {
      time: 36, type: 'decision', tag: 'CLINICAL',
      title: 'Oxygen Allocation',
      body: 'Only three oxygen cylinders remain, and five patients need oxygen: an 8-year-old in severe asthma, a 78-year-old ' +
        'with pneumonia, a crush-injury patient, a heart-failure patient and a COPD patient. There is not enough for everyone.',
      decisionId: 'ngata_oxygen',
      prompt: 'How do you allocate the oxygen?',
      options: [
        { key: 'A', label: 'Allocate to those most likely to benefit and survive with it and be weaned (e.g. the reversible asthma), reassess continually, and be transparent about the basis', desc: 'Crisis standards of care: scarce, life-sustaining oxygen goes where it does the most good, reviewed as patients change.', effect: { score: 5 } },
        { key: 'B', label: 'Give oxygen to the sickest, lowest-survivability patients first', desc: 'Spends a finite resource on those least likely to survive while reversible patients deteriorate without it.', effect: { score: -3 } },
        { key: 'C', label: 'First-come, first-served as they were brought in', desc: 'Order of arrival has nothing to do with who will live or die; it just removes clinical judgement.', effect: { score: -3 } },
        { key: 'D', label: 'Freeze - the choice is unbearable, so you delay deciding', desc: 'Indecision is itself a decision, and the patients who needed oxygen now are the ones it fails.', effect: { score: -4 } }
      ]
    },
    {
      time: 48, type: 'decision', tag: 'CLINICAL',
      title: 'Blood Products',
      body: 'Your limited emergency blood supply could go to the labouring mother with severe haemorrhage, a teenager with a ' +
        'pelvic fracture, or a farmer with crush injuries. Using it now means none remains for later casualties.',
      decisionId: 'ngata_blood',
      prompt: 'How do you use the scarce blood?',
      options: [
        { key: 'A', label: 'Use it decisively on the most salvageable immediate life-threat (the haemorrhaging mother), with stewardship and a clear record, and request urgent resupply', desc: 'Blood saves the life in front of you that is most salvageable now; stewardship and a resupply request manage the future risk.', effect: { score: 5 } },
        { key: 'B', label: 'Spread small amounts across all three to be fair', desc: 'Sub-therapeutic transfusion helps no one fully and may waste a resource that could have saved one life outright.', effect: { score: -2 } },
        { key: 'C', label: 'Hold all the blood back for casualties who might arrive later', desc: 'Lets a salvageable mother haemorrhage now on the chance of a future patient who may never come.', effect: { score: -5 } },
        { key: 'D', label: 'Give it to the farmer because he is the most visibly distressed', desc: 'Distress is not the clinical question; this allocates a life-saving resource on the wrong basis.', effect: { score: -3 } }
      ]
    },
    {
      time: 60, type: 'decision', tag: 'CLINICAL',
      title: 'The Only Ventilator',
      body: 'You have one portable ventilator and three patients who need it: a child with a traumatic brain injury, an adult ' +
        'pulled from a vehicle, and an elderly patient in respiratory failure. Someone will almost certainly die.',
      decisionId: 'ngata_ventilator',
      prompt: 'Who gets the ventilator?',
      options: [
        { key: 'A', label: 'Allocate by best survival chance with ventilation, document the rationale, and reassess if a patient deteriorates beyond saving', desc: 'A single ventilator goes to the patient most likely to survive because of it - a transparent, reviewable clinical judgement.', effect: { score: 5 } },
        { key: 'B', label: 'Give it to the most critically deteriorating patient regardless of odds', desc: 'Tying up the only ventilator on the least survivable patient lets a salvageable one die.', effect: { score: -3 } },
        { key: 'C', label: 'Give it to the elderly patient because they arrived first', desc: 'Arrival order is not survivability; this is not how a single life-support device should be allocated.', effect: { score: -3 } },
        { key: 'D', label: 'Refuse to choose and hand-ventilate all three by rotation', desc: 'Manual rotation across three patients with two doctors and 65 casualties is unsustainable and fails all of them.', effect: { score: -5 } }
      ]
    },
    {
      time: 72, type: 'decision', tag: 'ETHICAL',
      title: 'CPR or Redirect?',
      body: 'A 79-year-old patient suffers a cardiac arrest just as three critically injured children arrive together. Running ' +
        'prolonged CPR will tie up the staff the children need to survive.',
      decisionId: 'ngata_cpr',
      prompt: 'Do you continue CPR or redirect the team?',
      options: [
        { key: 'A', label: 'Stop prolonged CPR and redirect the team to the three salvageable children, document the decision, and support the staff through it', desc: 'In a mass-casualty event effort follows survivability. It is moral injury, but it gives three children the chance the arrest cannot use.', effect: { score: 5 } },
        { key: 'B', label: 'Continue full CPR on the 79-year-old and have the children wait', desc: 'Ties up scarce staff in a low-survivability resuscitation while three salvageable children deteriorate untreated.', effect: { score: -5 } },
        { key: 'C', label: 'Split the team - half on CPR, half on the children', desc: 'Halves the team on both, likely failing the arrest anyway and slowing care to the children who could be saved.', effect: { score: -3 } },
        { key: 'D', label: 'Hand the decision to a junior nurse and step away', desc: 'Offloads the hardest call of the day onto someone without the authority or support to carry it.', effect: { score: -4 } }
      ]
    },
    {
      time: 84, type: 'cascade', tag: 'SURGE',
      title: 'Aftershock - and a Bus of Injured Tourists',
      body: 'A strong aftershock rolls through, shaking dust from the cracked ceilings, just as a bus carrying injured tourists ' +
        'arrives: twenty more casualties at once, several serious, none speaking much English. Your six spaces are long full, ' +
        'the carpark triage area is overflowing, and the whole picture has just been reset upward.',
      source: 'Carpark / GeoNet',
      aftershock: true
    },
    {
      time: 90, type: 'decision', tag: 'CLINICAL',
      title: 'The School Reports Critical Children',
      body: 'A runner reaches you from the secondary school - the school your own children attend - reporting five critically ' +
        'injured students trapped and bleeding. They are asking you to send clinical staff. Doing so strips an already ' +
        'overwhelmed centre treating 80+ casualties.',
      decisionId: 'ngata_school',
      prompt: 'How do you respond to the school’s call?',
      options: [
        { key: 'A', label: 'Send a small, capable team with a triage kit only if the centre can survive it, coordinate with Civil Defence/first-aiders, and push for any available transport', desc: 'A targeted forward response that does not collapse the casualty hub, while mobilising other help. Balances both life-safety needs.', effect: { score: 5 } },
        { key: 'B', label: 'Send most of your clinical staff to the school', desc: 'Stripping the centre to respond to the school abandons 80+ casualties who have nowhere else to go.', effect: { score: -6 } },
        { key: 'C', label: 'Refuse to send anyone and keep all staff at the centre', desc: 'Defensible as triage, but sending nothing to five dying children when a small team could have gone is hard to justify.', effect: { score: -2 } },
        { key: 'D', label: 'Go to the school yourself because your own children are there', desc: 'Removes the clinical lead from the casualty hub, and lets your personal stake override the population decision.', effect: { score: -4 } }
      ]
    },
    {
      time: 102, type: 'decision', tag: 'CLINICAL',
      title: 'The One Ambulance',
      body: 'A single ambulance has become available and can transport one patient out to definitive care. Your candidates ' +
        'include an 8-year-old, the labouring/haemorrhaging mother, a volunteer firefighter, an elderly patient and a Police ' +
        'officer.',
      decisionId: 'ngata_ambulance',
      prompt: 'Who gets the one transfer?',
      options: [
        { key: 'A', label: 'Transfer the patient who is salvageable but will die without the definitive care only the hospital can give', desc: 'The transfer goes where it changes survival - clinical benefit and time-criticality, not occupation or sympathy.', effect: { score: 5 } },
        { key: 'B', label: 'Transfer the most critically injured patient regardless of whether transfer can save them', desc: 'Spends the one transfer on someone it likely cannot save, while a patient it could save stays behind.', effect: { score: -3 } },
        { key: 'C', label: 'Transfer the firefighter or Police officer to get an essential worker back on duty', desc: 'Status and utility are not the triage question for a clinical transfer; it should follow medical benefit.', effect: { score: -3 } },
        { key: 'D', label: 'Delay the ambulance until you are completely sure', desc: 'A rare transfer window sits idle while you deliberate, and the patient who needed it loses the chance.', effect: { score: -4 } }
      ]
    },
    {
      time: 116, type: 'decision', tag: 'CASCADE',
      title: 'Evacuate the Building?',
      body: 'A major aftershock opens new structural cracks. The building engineer advises the centre should not remain ' +
        'occupied if another significant aftershock hits. Three patients are mid-procedure, and you have 80+ casualties ' +
        'inside and around the building.',
      decisionId: 'ngata_evacuate',
      prompt: 'How do you respond to the structural warning?',
      options: [
        { key: 'A', label: 'Safely complete or pause the critical procedures while beginning a controlled, staged evacuation of everyone else to an alternative space', desc: 'Takes the structural warning seriously without abandoning surgical patients - stage the move, protect the sickest, stand up an alternative.', effect: { score: 5 } },
        { key: 'B', label: 'Evacuate immediately, including stopping the procedures and moving everyone at once', desc: 'A panicked all-at-once evacuation that interrupts surgery can kill the very patients you are moving.', effect: { score: -3 } },
        { key: 'C', label: 'Ignore the engineer and keep operating - you cannot move 80 casualties', desc: 'Overriding a structural-safety warning gambles every life in the building on the next aftershock missing.', effect: { score: -6 } },
        { key: 'D', label: 'Wait for a second engineer to confirm before doing anything', desc: 'Delays acting on a clear safety warning while patients and staff remain in a building flagged as unsafe.', effect: { score: -2 } }
      ]
    },
    {
      time: 130, type: 'decision', tag: 'ETHICAL',
      title: 'The Fire Service Wants Your Supplies',
      body: 'The Fire Service, working a collapse with trapped people, requests all of your IV fluids, trauma dressings and ' +
        'pain medication. Your own centre needs those same supplies for the casualties it is treating and the surge still ' +
        'arriving.',
      decisionId: 'ngata_fire_supplies',
      prompt: 'How do you handle the Fire Service request?',
      options: [
        { key: 'A', label: 'Negotiate a prioritised split - share what they critically need for the trapped casualties, keep what your current patients need, and document it', desc: 'Two life-safety needs met proportionately, with a record - rather than stripping either the rescue or the casualty hub bare.', effect: { score: 5 } },
        { key: 'B', label: 'Hand over everything they ask for - trapped people come first', desc: 'Empties the casualty-clearing hub of the supplies it needs to keep clearing casualties, including the next surge.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse - your patients come first, full stop', desc: 'Leaves a rescue of trapped, dying people without the supplies you could have shared from a managed split.', effect: { score: -2 } },
        { key: 'D', label: 'Tell them to source it from the regional hospital instead', desc: 'The hospital is 90 minutes away and cut off; this is a non-answer dressed up as a referral.', effect: { score: -2 } }
      ]
    },
    {
      time: 142, type: 'cascade', tag: 'PUBLIC HEALTH',
      title: 'Six Hours In - Public Health Deteriorates',
      body: 'By mid-afternoon the second wave of the disaster is biological: drinking water is unsafe, toilets are failing, ' +
        'insulin refrigeration is compromised and vaccines are warming, gastroenteritis risk is climbing, and elderly ' +
        'residents cannot get their regular medications. Snow is closing in for the night, and a tsunami warning has been ' +
        'issued for nearby coastal settlements.',
      source: 'Public Health / MetService'
    },
    {
      time: 150, type: 'decision', tag: 'ETHICAL',
      title: 'The Welfare Centre Wants Your Oxygen',
      body: 'A Civil Defence welfare centre, now sheltering vulnerable evacuees overnight, requests your last oxygen ' +
        'cylinders. Keeping them may save the critical patients in front of you; sending them may save several vulnerable ' +
        'evacuees through a long, cold night.',
      decisionId: 'ngata_oxygen_welfare',
      prompt: 'What do you do with the last oxygen?',
      options: [
        { key: 'A', label: 'Keep enough to cover your current critical patients, share what can be safely spared with the welfare centre, escalate hard for resupply, and document the split', desc: 'A transparent, clinically-reasoned division that does not sacrifice the patients in front of you or abandon the evacuees.', effect: { score: 5 } },
        { key: 'B', label: 'Keep all the oxygen for your current patients', desc: 'Defensible for the patients you can see, but writes off vulnerable evacuees you could have helped with a managed share.', effect: { score: -2 } },
        { key: 'C', label: 'Send all the oxygen to the welfare centre for the greater number', desc: 'Leaves your current oxygen-dependent critical patients without the resource keeping them alive right now.', effect: { score: -5 } },
        { key: 'D', label: 'Refuse to decide and tell Civil Defence to sort it out', desc: 'Punts a clinical-ethical allocation you are best placed to make, and helps no one while you defer.', effect: { score: -3 } }
      ]
    },
    {
      time: 164, type: 'decision', tag: 'CLINICAL',
      title: 'Exhausted Staff',
      body: 'Eighteen hours in, one doctor has made a medication error (caught in time), a nurse fell asleep standing up, and ' +
        'another is in tears after treating multiple fatalities. The casualties are still coming and there is no relief crew.',
      decisionId: 'ngata_staff_fatigue',
      prompt: 'How do you handle your exhausted team?',
      options: [
        { key: 'A', label: 'Enforce mandatory rest and rotation, reduce to essential services, and rest yourself too - a fatigued team is a patient-safety hazard', desc: 'Protects both staff and patients: a brief, structured rest prevents the errors that fatigue is already starting to cause.', effect: { score: 5 } },
        { key: 'B', label: 'Push everyone through - the patients cannot wait', desc: 'Fatigued clinicians making errors harm the very patients you are trying to save; "push through" is how the next error reaches someone.', effect: { score: -5 } },
        { key: 'C', label: 'Let staff rest only if they ask, otherwise keep going', desc: 'The most exhausted and committed never ask; leaving rest to self-report fails exactly the people most at risk.', effect: { score: -1 } },
        { key: 'D', label: 'Send the most upset staff home and work the rest harder', desc: 'Loses people you need and overloads the remainder, accelerating the fatigue spiral rather than breaking it.', effect: { score: -3 } }
      ]
    },
    {
      time: 178, type: 'decision', tag: 'ETHICAL',
      title: 'The Media Wants a Death Toll',
      body: 'A journalist with a satellite link asks you directly: "How many people have died?" The numbers are genuinely ' +
        'uncertain, and social-media rumours are already claiming the clinic has run out of doctors and people are dying in ' +
        'the corridors.',
      decisionId: 'ngata_media',
      prompt: 'How do you answer the journalist?',
      options: [
        { key: 'A', label: 'Be honest about the uncertainty: give what you can confirm, decline to invent a toll, and state plainly what the centre is doing and needs', desc: 'Honest, bounded and decision-useful - it builds trust and quietly corrects the rumours without a number you cannot stand behind.', effect: { score: 5 } },
        { key: 'B', label: 'Give an off-the-cuff estimate to satisfy them', desc: 'A guessed death toll, wrong in either direction, becomes "fact" and detonates trust when the real numbers emerge.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse to say anything at all', desc: 'A flat no-comment cedes the story to the "people are dying in corridors" rumour already filling the gap.', effect: { score: -3 } },
        { key: 'D', label: 'Downplay it to keep the community calm', desc: 'Minimising the truth buys quiet now and costs you all credibility the moment the scale becomes clear.', effect: { score: -3 } }
      ]
    },
    {
      time: 192, type: 'info', tag: 'HANDOVER',
      title: 'Through the First Day - The Hardest Lesson',
      body: 'A relief team and the first transfers finally arrive. You held a structured triage, allocated scarce oxygen, ' +
        'blood and the ventilator by survivability, protected exhausted staff, and kept the community’s trust through ' +
        'honesty. The hardest lesson holds: modern disaster medicine is rarely about the best care for every individual - it ' +
        'is about the greatest achievable benefit across a whole community when demand vastly exceeds resources. Every ' +
        'decision left someone waiting and carried moral injury; the work was to make them transparent, ethical and ' +
        'defensible while preserving compassion and judgement. Many of the hardest were not medical - they were human.',
      source: 'Alpine Community Medical Centre'
    }
  ];

})();
