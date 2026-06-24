// ============================================================================
// PERSONA: SCHOOL PRINCIPAL  -  Te Awa Area School
// Alpine Fault earthquake, 11:18 a.m. on a winter school day.
// Source brief: Notion "Disaster Sim" (Principal Russel Thomason).
//
// This file is loaded AFTER nz-cascading-impact-simulator.js and registers the
// persona by extending the engine's shared registries. No engine code is
// duplicated here; adding a persona is purely additive.
// ============================================================================
(function () {
  'use strict';

  // ---- Config: header, status bar, classification, dashboards ---------------
  SCENARIO_CONFIGS.principal = {
    label: 'SCHOOL PRINCIPAL',
    actorTitle: 'Principal',
    classification: 'L2',
    classCSS: 'l2',
    classText: 'SCHOOL EMERGENCY',
    debriefName: 'Alpine Fault — Te Awa Area School',
    facObjective: 'a school-level life-safety and welfare response when normal systems have failed. ' +
      'Key themes: accurate student accounting, safe family reunification, safeguarding under pressure, ' +
      'inclusion of migrant and rural families, and duty of care to both students and staff.',
    startScore: 50,
    metrics: {
      studentsTotal: 420, studentsAccounted: 388, staffPresent: 24,
      reunified: 0, injuredMinor: 9, injuredSerious: 2
    },
    statusBar: [
      { id: 'students', label: 'Students Accounted:', value: '388/420', cls: 'warning' },
      { id: 'staff', label: 'Staff On Site:', value: '24/26', cls: 'good' },
      { id: 'reunified', label: 'Reunified:', value: '0', cls: 'warning' },
      { id: 'warmth', label: 'Warmth:', value: 'Heating Out', cls: 'critical' },
      { id: 'comms', label: 'Comms:', value: 'Power & Net Down', cls: 'critical' }
    ],
    panels: {
      groupsTitle: 'Roll & Welfare',
      groups: [
        { label: 'Students Accounted', value: '388 / 420', cls: 'degraded' },
        { label: 'Unaccounted', value: '32', cls: 'failed' },
        { label: 'Staff On Site', value: '24 / 26', cls: 'good' },
        { label: 'Injured (minor)', value: '9', cls: 'degraded' },
        { label: 'Injured (serious)', value: '2', cls: 'failed' },
        { label: 'Reunified', value: '0', cls: 'unknown' }
      ],
      agenciesTitle: 'External Support',
      agencies: [
        { label: 'NZ Police', value: 'Stretched', cls: 'degraded' },
        { label: 'FENZ', value: 'En Route', cls: 'degraded' },
        { label: 'St John', value: 'Delayed', cls: 'failed' },
        { label: 'Civil Defence EOC', value: 'Activating', cls: 'degraded' },
        { label: 'Min. of Education', value: 'Notified', cls: 'unknown' },
        { label: 'Bus Operator', value: 'No Service', cls: 'failed' }
      ],
      lifelinesTitle: 'Site & Utilities',
      lifelines: [
        { label: 'Power', value: 'Out', cls: 'failed' },
        { label: 'Heating', value: 'Off', cls: 'failed' },
        { label: 'Water', value: 'Untested', cls: 'unknown' },
        { label: 'Internet', value: 'Down', cls: 'failed' },
        { label: 'Cell Coverage', value: 'Intermittent', cls: 'degraded' },
        { label: 'Toilets', value: 'At Risk', cls: 'degraded' }
      ],
      transportTitle: 'Buildings & Access',
      transport: [
        { label: 'Main Teaching Block', value: 'Damaged', cls: 'degraded' },
        { label: 'School Hall', value: 'Minor Damage', cls: 'degraded' },
        { label: 'Gymnasium', value: 'Usable', cls: 'good' },
        { label: 'School Buses', value: 'Grounded', cls: 'failed' },
        { label: 'Township Roads', value: 'Blocked', cls: 'failed' },
        { label: 'Rural Roads', value: 'Cut Off', cls: 'failed' }
      ],
      cascadeTitle: 'Emerging Risks',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '❄️', name: 'Overnight Snow', level: 'High', cls: 'high' },
        { icon: '🥶', name: 'Cold / Hypothermia', level: 'Moderate', cls: 'moderate' },
        { icon: '🚽', name: 'Sanitation / Gastro', level: 'Moderate', cls: 'moderate' },
        { icon: '📱', name: 'Misinformation', level: 'Moderate', cls: 'moderate' },
        { icon: '🏗️', name: 'Structural', level: 'Moderate', cls: 'moderate' }
      ],
      resourcesTitle: 'Welfare Supplies'
    }
  };

  // ---- Welfare supplies (the resource meters) -------------------------------
  UTILITY_DEFAULTS.principal = {
    food: { label: 'Food (meals)', value: 35, unit: '%' },
    water: { label: 'Drinking Water', value: 55, unit: '%' },
    warmth: { label: 'Blankets / Warmth', value: 30, unit: '%' },
    power: { label: 'Generator / Power', value: 10, unit: '%' },
    comms: { label: 'Comms Reach', value: 25, unit: '%' },
    sanitation: { label: 'Sanitation', value: 45, unit: '%' }
  };

  // ---- Response metrics (the "soft" leadership metrics) ---------------------
  SOFT_METRIC_DEFAULTS.principal = {
    studentSafety: { label: 'Student Safety', value: 60, icon: '🛡️' },
    parentTrust: { label: 'Parent Trust', value: 55, icon: '🤝' },
    staffCapacity: { label: 'Staff Capacity', value: 65, icon: '⚡' },
    safeguarding: { label: 'Safeguarding', value: 65, icon: '⚖️' },
    inclusion: { label: 'Inclusion', value: 55, icon: '🌐' },
    comms: { label: 'Public Messaging', value: 50, icon: '📢' }
  };

  // ---- Decision -> meter effects -------------------------------------------
  Object.assign(UTILITY_EFFECTS, {
    'prin_accounting': { 'A': { comms: 5 }, 'D': { comms: 3 } },
    'prin_misinformation': { 'A': { comms: 8 }, 'D': { comms: 4 }, 'C': { comms: -5 } },
    'prin_medical': { 'C': { warmth: 5 } },
    'prin_shelter': { 'A': { warmth: 5, sanitation: -5 }, 'B': { warmth: 5, sanitation: -15 }, 'D': { warmth: 8 } },
    'prin_food': { 'A': { food: 5 }, 'B': { food: -20 }, 'D': { food: 8 } },
    'prin_overnight': { 'A': { warmth: -5 }, 'C': { warmth: -10, food: -5 } }
  });

  // ---- Decision -> response-metric effects ---------------------------------
  Object.assign(SOFT_METRIC_EFFECTS, {
    'prin_accounting': {
      'A': { studentSafety: 8, staffCapacity: 3 },
      'B': { studentSafety: -5, staffCapacity: -10, safeguarding: -3 },
      'C': { studentSafety: -8, parentTrust: -3 },
      'D': { studentSafety: 6, safeguarding: 3 }
    },
    'prin_reunification': {
      'A': { safeguarding: 10, parentTrust: 5 },
      'B': { safeguarding: -12, parentTrust: 5, studentSafety: -5 },
      'C': { safeguarding: 5, parentTrust: -5 },
      'D': { safeguarding: 8, parentTrust: 6 }
    },
    'prin_gate': {
      'A': { parentTrust: 6, safeguarding: 3 },
      'B': { safeguarding: -10, parentTrust: 3 },
      'C': { parentTrust: -5, safeguarding: 2 },
      'D': { parentTrust: 5, safeguarding: 4, staffCapacity: -3 }
    },
    'prin_medical': {
      'A': { studentSafety: 8, inclusion: 6, staffCapacity: -5 },
      'B': { studentSafety: -8, inclusion: -5 },
      'C': { studentSafety: 6, inclusion: 5, staffCapacity: -3 },
      'D': { inclusion: 2, safeguarding: -5, staffCapacity: 3 }
    },
    'prin_misinformation': {
      'A': { inclusion: 10, comms: 8, parentTrust: 5 },
      'B': { inclusion: -8, comms: -3 },
      'C': { inclusion: -5, comms: -8, parentTrust: -5 },
      'D': { inclusion: 5, comms: 4 }
    },
    'prin_rural_bus': {
      'A': { studentSafety: 6, parentTrust: 3 },
      'B': { studentSafety: -10, parentTrust: -5 },
      'C': { studentSafety: -3 },
      'D': { studentSafety: -2, staffCapacity: -5 }
    },
    'prin_staff': {
      'A': { staffCapacity: 6, parentTrust: 3 },
      'B': { staffCapacity: -8 },
      'C': { staffCapacity: -5 },
      'D': { staffCapacity: 4, studentSafety: 3 }
    },
    'prin_shelter': {
      'A': { safeguarding: 6, parentTrust: 5, inclusion: 3 },
      'B': { safeguarding: -10, parentTrust: 3 },
      'C': { parentTrust: -5, inclusion: -3, safeguarding: 5 },
      'D': { safeguarding: 4, parentTrust: 5, staffCapacity: 4 }
    },
    'prin_privacy': {
      'A': { studentSafety: 6, safeguarding: 5, inclusion: 3 },
      'B': { studentSafety: -5, safeguarding: 3 },
      'C': { safeguarding: -12, parentTrust: -5 },
      'D': { studentSafety: -6, safeguarding: 2 }
    },
    'prin_food': {
      'A': { studentSafety: 4, inclusion: 3 },
      'B': { studentSafety: 2, parentTrust: 2 },
      'C': { studentSafety: -4 },
      'D': { studentSafety: 5, comms: 3 }
    },
    'prin_overnight': {
      'A': { safeguarding: 8, studentSafety: 6, parentTrust: 5 },
      'B': { safeguarding: -12, studentSafety: -3 },
      'C': { studentSafety: 4, staffCapacity: -6, safeguarding: 5 },
      'D': { safeguarding: -10 }
    },
    'prin_helicopter': {
      'A': { parentTrust: 5, inclusion: 5, comms: 3 },
      'B': { parentTrust: -3, inclusion: -3 },
      'C': { parentTrust: 4, inclusion: 3 },
      'D': { parentTrust: -8, comms: -5 }
    }
  });

  // ---- Decision -> leadership-style axes ------------------------------------
  Object.assign(STYLE_TAGS, {
    'prin_accounting': { 'A': { decisive: 2, lifeSafety: 1, centralized: 2 }, 'B': { decisive: 2, lifeSafety: -1, centralized: -1 }, 'C': { decisive: -2, lifeSafety: -1 }, 'D': { decisive: 1, lifeSafety: 2, centralized: 1 } },
    'prin_reunification': { 'A': { decisive: 1, centralized: 2 }, 'B': { decisive: 2, centralized: -2, communityTrust: 1 }, 'C': { decisive: -1, centralized: 1 }, 'D': { decisive: 1, centralized: 1, communityTrust: 1 } },
    'prin_gate': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { decisive: 2, centralized: -2, communityTrust: 1 }, 'C': { decisive: 1, centralized: 2, communityTrust: -2 }, 'D': { decisive: 1, communityTrust: 1 } },
    'prin_medical': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: 1, lifeSafety: 2 }, 'D': { decisive: 1, lifeSafety: -1, communityTrust: 1 } },
    'prin_misinformation': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: 1, communityTrust: -1 }, 'C': { decisive: -2 }, 'D': { communityTrust: 1 } },
    'prin_rural_bus': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -1 }, 'D': { decisive: 2, lifeSafety: -1, centralized: -1 } },
    'prin_staff': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { centralized: 2, communityTrust: -2 }, 'C': { centralized: 1, communityTrust: -1 }, 'D': { decisive: 1, centralized: 1 } },
    'prin_shelter': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: -2, communityTrust: 2 }, 'C': { centralized: 2, communityTrust: -2 }, 'D': { centralized: 0, communityTrust: 1 } },
    'prin_privacy': { 'A': { decisive: 1, lifeSafety: 1 }, 'B': { decisive: -1, centralized: 1 }, 'C': { decisive: 1, centralized: -1 }, 'D': { decisive: -1 } },
    'prin_food': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 1, communityTrust: 1 }, 'C': { decisive: -1, centralized: 1 }, 'D': { decisive: 1, centralized: 1 } },
    'prin_overnight': { 'A': { decisive: 1, centralized: 1, communityTrust: 1, lifeSafety: 1 }, 'B': { decisive: 1, centralized: -2, communityTrust: 2 }, 'C': { centralized: 2, lifeSafety: 1 }, 'D': { decisive: 2, centralized: -2, communityTrust: 1 } },
    'prin_helicopter': { 'A': { decisive: 1, communityTrust: 1, lifeSafety: 1 }, 'B': { decisive: 1, communityTrust: -1 }, 'C': { centralized: 1, communityTrust: 1 }, 'D': { decisive: 1, communityTrust: 1 } }
  });

  // ---- Consequence chains (reactive injects from poor choices) --------------
  Object.assign(CONSEQUENCE_MAP, {
    'prin_accounting': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Staff Member Injured in Aftershock',
          body: 'Two teachers entered the damaged main block to look for the missing Year 6 student. ' +
            'A sharp aftershock brought down a section of ceiling. One teacher is now injured and trapped briefly, ' +
            'pulling staff and attention away from the wider group at the very moment you needed them. The missing ' +
            'student, it turns out, had already walked to the assembly point.',
          source: 'Deputy Principal / Assembly Point',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Injured (serious)', '3', 'failed');
          updatePanelItem('cdem-groups', 'Staff On Site', '23 / 26', 'degraded');
        }
      }
    },
    'prin_gate': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Released Child Was Subject to a Protection Order',
          body: 'The child you released at the gate is subject to a custody and protection order that names the ' +
            'collecting adult as a non-contact party. The office records would have flagged it, but the gate release ' +
            'bypassed the verification step. Police and Oranga Tamariki are now involved, and the school faces a ' +
            'serious safeguarding review.',
          source: 'School Office / NZ Police',
          scorePenalty: -4
        }
      }
    },
    'prin_rural_bus': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Student Injured Attempting the Bridge',
          body: 'The group set off to walk back across the damaged bridge as instructed. One student slipped on the ' +
            'broken approach and fell, sustaining a leg injury, and the rest are now strung out along an unstable ' +
            'structure in worsening weather. A 4WD recovery is being scrambled in far harder conditions than if they ' +
            'had stayed with the bus.',
          source: 'Bus Driver / Rural Volunteer',
          scorePenalty: -5
        }
      }
    }
  });

  // ---- Facilitator notes (shown in Facilitator Mode + debrief) --------------
  Object.assign(FACILITATOR_NOTES, {
    'prin_accounting': {
      learningObjective: 'Establish accurate, structured accountability before committing staff to risky searches.',
      bestPractice: 'A',
      teachingNote: 'A single central tally board turns chaos into a managed problem within minutes. Searches should be ' +
        'exterior-first and risk-assessed; interior search of a damaged structure is a FENZ/USAR task, not a job for ' +
        'untrained staff during aftershocks. Start a written log immediately.',
      references: [
        { label: 'MoE Emergency Planning', desc: 'schools account for all students and staff at a safe assembly point' },
        { label: 'Drop, Cover, Hold', desc: 'evacuate only once shaking stops; keep clear of buildings and glass' }
      ],
      discussionPrompts: [
        'What is your single source of truth for who is present, and who maintains it?',
        'Under what conditions, if any, is it acceptable to send staff into a damaged building?'
      ]
    },
    'prin_reunification': {
      learningObjective: 'Controlled reunification protects children even when it is slower and less comfortable.',
      bestPractice: 'A',
      teachingNote: 'Children should be released only to verified caregivers. Custody and protection orders may apply and ' +
        'are invisible in a crowd. A single signed release point with ID checked against emergency contacts is slower ' +
        'but defensible; ad hoc release at the gate is how children end up with the wrong adult.',
      references: [
        { label: 'Safeguarding / Reunification', desc: 'release only to listed, verified caregivers; record every release' }
      ],
      discussionPrompts: [
        'How do you balance a parent’s distress against the time a proper ID check takes?',
        'What records prove, afterwards, that each child was released to the right person?'
      ]
    },
    'prin_medical': {
      learningObjective: 'Protect known high-needs students first; their margin for error is smallest.',
      bestPractice: 'A',
      teachingNote: 'Insulin-dependent, epileptic, wheelchair-using and acutely anxious or neurodiverse students can ' +
        'deteriorate fast in cold, noise and uncertainty. Naming a specific adult to each high-needs student is more ' +
        'reliable than hoping general supervision catches a crisis in time.',
      references: [
        { label: 'Individual Health / Care Plans', desc: 'pre-agreed plans for medication, seizures, mobility and sensory needs' }
      ],
      discussionPrompts: [
        'Which students would you name first, and who covers them if that adult has to leave?',
        'How do you keep a neurodiverse student regulated when the environment itself is the trigger?'
      ]
    },
    'prin_privacy': {
      learningObjective: 'In a life-safety event, privacy matters but must not block urgent welfare action.',
      bestPractice: 'A',
      teachingNote: 'Sharing the minimum need-to-know (e.g. the insulin-dependent child) through a verified Civil Defence ' +
        'liaison, and logging what was shared and why, is both lawful and humane. Refusing outright can cost a life; ' +
        'handing over the entire register over-discloses and breaches trust. Share narrowly, deliberately, and on the record.',
      references: [
        { label: 'Privacy Act 2020', desc: 'permits disclosure to prevent or lessen a serious threat to life or health' }
      ],
      discussionPrompts: [
        'What is the smallest set of information that actually serves the welfare need?',
        'How do you verify the person asking is genuinely the Civil Defence welfare liaison?'
      ]
    },
    'prin_shelter': {
      learningObjective: 'Use the school as a community asset only where it does not compromise student safety.',
      bestPractice: 'A',
      teachingNote: 'The community will expect the school to become a welfare centre. Controlled, screened use of the gym ' +
        'with a separate supervised zone for students keeps the safeguarding line intact. Throwing the doors open is ' +
        'compassionate but mixes unknown adults with children; a flat refusal burns the trust you will need overnight.',
      references: [
        { label: 'Welfare in an Emergency', desc: 'schools may host welfare functions with Civil Defence under managed access' }
      ],
      discussionPrompts: [
        'Where is the physical line between the public welfare area and the supervised student area?',
        'Who screens people at the entry, and what is the rule for letting an adult in?'
      ]
    }
  });

  // ---- Ambient distractions (noise) -----------------------------------------
  NOISE_POOL.principal = [
    {
      tag: 'NOISE', title: 'Board Chair Wants a Status Call Now',
      body: 'The Board of Trustees chair is on a crackling phone line wanting a full briefing "for the board" and asking ' +
        'whether the school will be open tomorrow. They are anxious and want detail you do not yet have.',
      source: 'Board of Trustees Chair',
      prompt: 'How do you handle the board chair?',
      options: [
        { key: 'A', label: 'Give a 60-second factual update, promise a fuller brief once students are safe, end the call', desc: 'Maintains the relationship without surrendering scarce attention. The board needs reassurance, not a running commentary while you are running a life-safety response.', effect: { score: 2 } },
        { key: 'B', label: 'Stop and give a full detailed briefing now', desc: 'Every minute narrating to the board is a minute not spent on accounting and reunification. The detail does not exist yet anyway.', effect: { score: -1 } },
        { key: 'C', label: 'Ignore the call entirely', desc: 'The board is a governance partner you will need for the recovery. A flat no-contact breeds rumour and undermines you later.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Local Reporter at the Fence',
      body: 'A reporter from the regional paper is at the fence photographing distressed families and asking staff "is it ' +
        'true a child is missing?" Parents nearby are starting to listen.',
      source: 'Regional News',
      prompt: 'How do you handle the reporter?',
      options: [
        { key: 'A', label: 'Hold one short, calm factual line and direct them to Civil Defence for the wider picture', desc: 'Controls the narrative without feeding speculation. A single steady message at the fence prevents a rumour becoming the story among waiting parents.', effect: { score: 2 } },
        { key: 'B', label: 'Let staff answer questions freely — transparency is good', desc: 'Unmanaged comments from stressed staff create contradictory, alarming coverage and may breach student privacy.', effect: { score: -2 } },
        { key: 'C', label: 'Have them removed and say nothing', desc: 'A vacuum fills itself. "School refused to comment while a child was missing" writes its own headline.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Volunteer Parents Want to Help — No Sign-In',
      body: 'A dozen parents who have already collected their children are offering to help and drifting through the grounds. ' +
        'None have signed in and several are near the supervised student area.',
      source: 'Office / Assembly Point',
      prompt: 'How do you use the volunteer parents?',
      options: [
        { key: 'A', label: 'Sign them in, badge them, and give them defined tasks away from the student area', desc: 'Turns goodwill into useful capacity while keeping the safeguarding line clean. Known adults, named tasks, clear boundary.', effect: { score: 2 } },
        { key: 'B', label: 'Let them help wherever they see a need', desc: 'Unscreened, unbadged adults moving freely among children is exactly the safeguarding gap an emergency creates.', effect: { score: -2 } },
        { key: 'C', label: 'Thank them and ask them all to leave', desc: 'Wastes willing hands you are short of, and pushes goodwill away at the moment you need the community most.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Caretaker Reports a Gas Smell Near the Kitchen',
      body: 'The caretaker can smell gas near the canteen kitchen. It may be a cracked line, or it may be nothing. The canteen ' +
        'is where you were planning to prepare the one available meal.',
      source: 'Site Caretaker',
      prompt: 'How do you respond to the gas smell?',
      options: [
        { key: 'A', label: 'Isolate the area, shut the gas at the main, keep everyone clear until it is checked', desc: 'Correct and immediate. A suspected gas leak is a life-safety issue that outranks meal planning. Isolate first, reassess later.', effect: { score: 2 } },
        { key: 'B', label: 'Carry on — you need the kitchen for food', desc: 'Cooking next to a possible gas leak after an earthquake risks turning a welfare problem into a fire or explosion.', effect: { score: -3 } },
        { key: 'C', label: 'Send the caretaker in alone to investigate', desc: 'Sending one person into a suspected gas hazard is the wrong call; isolate and keep clear rather than risking the caretaker.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Rumour: "All Schools Are Closing for a Week"',
      body: 'Parents at the gate are repeating a rumour that the Ministry has ordered all schools shut for a week. There is no ' +
        'such announcement. Some families are making travel plans around it.',
      source: 'Parents at Gate',
      prompt: 'How do you handle the closure rumour?',
      options: [
        { key: 'A', label: 'State plainly what you do and do not know, and when you will next update them', desc: 'Honesty plus a next-update time starves the rumour of oxygen and keeps families anchored to your messaging, not the gate gossip.', effect: { score: 2 } },
        { key: 'B', label: 'Confirm the rumour to get families to disperse', desc: 'Repeating something you cannot verify destroys your credibility the moment it proves false — and you will need that credibility tonight.', effect: { score: -2 } },
        { key: 'C', label: 'Say nothing and let it pass', desc: 'Unaddressed rumours harden into "fact" and drive families to act on false information.', effect: { score: -1 } }
      ]
    }
  ];

  // ---- Event sequence -------------------------------------------------------
  // Times are minutes since the mainshock; the engine paces the gaps.
  PERSONA_EVENTS.principal = [
    {
      time: 0, type: 'inject', tag: 'MAINSHOCK',
      title: 'Alpine Fault Rupture — Severe Shaking During Class',
      body: 'At 11:18 a.m. a major Alpine Fault earthquake strikes. Shaking is violent and prolonged across Te Awa Area ' +
        'School. Students drop, cover and hold under desks as light fittings swing and glass breaks. Power and internet ' +
        'fail instantly; the heating dies with them. When the shaking finally stops, the main teaching block is visibly ' +
        'damaged, the hall has cracked plaster, and the gymnasium appears sound. It is winter, snow is forecast overnight, ' +
        'and 420 students in Years 1 to 13 are now your responsibility with no working phones or buses.',
      source: 'GeoNet — Automatic Detection',
      aftershock: true
    },
    {
      time: 4, type: 'info', tag: 'FIRST ACTIONS',
      title: 'Shaking Stops — Evacuate to the Field',
      body: 'Following Drop, Cover, Hold, staff evacuate classes to the open sports field, away from buildings, glass, ' +
        'powerlines and the slope behind the school. Some classrooms are dark and partly blocked. Cell coverage is ' +
        'flickering in and out. Your immediate job is to keep children away from hazards, account for everyone, treat any ' +
        'life-threatening injuries, and start a written log. The wider community emergency is not yet your problem — ' +
        'the children in front of you are.',
      source: 'Deputy Principal / Senior Staff'
    },
    {
      time: 10, type: 'decision', tag: 'PRINCIPAL',
      title: 'Student Accounting',
      body: 'Classes are assembling on the field but the count is messy: students were at PE, in specialist rooms, and on a ' +
        'senior work-experience block. A Year 6 teacher reports one student missing — friends say he ran back inside ' +
        'for his bag. The main block is damaged and aftershocks are ongoing.',
      decisionId: 'prin_accounting',
      prompt: 'How do you run student accounting in the first minutes?',
      options: [
        { key: 'A', label: 'Immediate roll at the assembly point — teachers count their classes and report gaps to one central board', desc: 'Fast, structured accountability. A single tally board shows who is missing within minutes and frees you to direct the response. This is the foundation everything else rests on.', effect: { score: 5 } },
        { key: 'B', label: 'Send teachers into the damaged block now to find the missing Year 6 student', desc: 'Compassionate, but turns staff into casualties if the structure is unstable. Untrained adults entering damaged buildings during aftershocks is how rescuers get hurt.', effect: { score: -5 } },
        { key: 'C', label: 'Wait for FENZ to arrive before any count or search', desc: 'Roads are blocked and FENZ is delayed. Waiting means children are unaccounted for an unknown length of time while you stand idle.', effect: { score: -3 } },
        { key: 'D', label: 'Exterior head count and visual sweep first; mark the damaged block for FENZ; log everything', desc: 'Balanced: account for everyone you can safely reach, sweep the exterior for the missing student, and hand the dangerous interior to professionals. The written log starts now.', effect: { score: 3 } }
      ]
    },
    {
      time: 25, type: 'inject', tag: 'PARENTS',
      title: 'Parents Beginning to Arrive',
      body: 'Word is spreading through the township. The first parents are arriving on foot and by car, distressed and ' +
        'calling out for their children. Some are injured. A few are demanding their child immediately. Others you ' +
        'recognise are not on any emergency-contact list. With no phones, you cannot verify anything electronically.',
      source: 'Front Gate'
    },
    {
      time: 32, type: 'decision', tag: 'PRINCIPAL',
      title: 'Parent Reunification',
      body: 'Parents are gathering at the gate and the pressure to hand children over quickly is intense. But custody and ' +
        'protection orders may apply, some caregivers are not listed contacts, and language barriers are slowing every ' +
        'check. Release the wrong child to the wrong adult and the consequences are irreversible.',
      decisionId: 'prin_reunification',
      prompt: 'How do you release children to families?',
      options: [
        { key: 'A', label: 'One signed release point — photo ID checked against emergency contacts before any child leaves', desc: 'Slower and harder, but defensible. Every release is verified and recorded. This is the protection a child cannot give themselves.', effect: { score: 5 } },
        { key: 'B', label: 'Release children to any adult they recognise, to cut the distress quickly', desc: 'Fast and humane-feeling, but recognition is not authorisation. This is exactly how a child ends up with someone an order was meant to keep away.', effect: { score: -5 } },
        { key: 'C', label: 'Hold all children until the full roll is confirmed, then release in waves', desc: 'Maximum control, but leaves frightened children and parents waiting longer than necessary and stokes anger at the gate.', effect: { score: 1 } },
        { key: 'D', label: 'Signed release point with ID checks, plus a calm waiting area for children away from the gate', desc: 'Keeps the verification discipline of A while shielding children from the crush and noise of the gate. Slightly more staff-intensive.', effect: { score: 3 } }
      ]
    },
    {
      time: 46, type: 'decision', tag: 'PRINCIPAL',
      title: 'Inject — A Father Forces the Gate',
      body: 'A distressed father pushes through the gate, shouting for his daughter. He is frightening younger children and ' +
        'will not stop for staff. You half-recognise him but cannot recall the family’s situation, and the office ' +
        'records are inside a building you have not cleared.',
      decisionId: 'prin_gate',
      prompt: 'How do you respond to the father at the gate?',
      options: [
        { key: 'A', label: 'Meet him calmly, walk him to the release point, verify and reunite him there', desc: 'De-escalation plus process. He gets movement toward his child while the verification step stays intact. Calm is contagious; so is panic.', effect: { score: 4 } },
        { key: 'B', label: 'Just let him take her now to avoid a scene', desc: 'Ends the confrontation but bypasses every safeguarding check at the one moment they matter most. You do not know what the records would have told you.', effect: { score: -4 } },
        { key: 'C', label: 'Call Police and lock the gate down', desc: 'Police are stretched and may be a long time. Locking down a grieving parent escalates fear among everyone watching and may be disproportionate.', effect: { score: 0 } },
        { key: 'D', label: 'Assign a trusted, calm staff member to manage him while reunification staff verify', desc: 'Buys de-escalation and keeps the process running in parallel, at the cost of one adult pulled off other duties.', effect: { score: 3 } }
      ]
    },
    {
      time: 60, type: 'cascade', tag: 'AFTERSHOCK',
      title: 'M6 Aftershock — Panic Spreads',
      body: 'A strong aftershock rolls through. More plaster falls from the hall and a window cracks. On the field a student ' +
        'has a panic attack and several younger children begin crying and clinging to staff. The emotional temperature ' +
        'spikes just as you are trying to hold an orderly reunification line. Frightened children are harder to keep safe.',
      source: 'GeoNet / Assembly Point',
      aftershock: true
    },
    {
      time: 72, type: 'decision', tag: 'PRINCIPAL',
      title: 'High-Needs Students',
      body: 'You have an insulin-dependent student, a student with epilepsy, a wheelchair user whose access routes are now ' +
        'blocked, students who rely on medication kept at home, and several neurodiverse students overwhelmed by the noise ' +
        'and cold. Adult supervision is finite and the aftershock has scattered your attention.',
      decisionId: 'prin_medical',
      prompt: 'How do you cover high-needs students with limited adults?',
      options: [
        { key: 'A', label: 'Name a specific adult to each high-needs student now (insulin, epilepsy, mobility, acute anxiety)', desc: 'These students have the smallest margin for error. A named adult per student is far more reliable than hoping general supervision catches a crisis in time.', effect: { score: 5 } },
        { key: 'B', label: 'Keep all staff on general supervision and respond to medical issues as they arise', desc: 'Treats every student as equally robust. The insulin-dependent or epileptic student cannot afford a delayed response.', effect: { score: -4 } },
        { key: 'C', label: 'Move high-needs students to the warmer, quieter gym office with a dedicated aide', desc: 'Reduces sensory load and cold for the most vulnerable, and concentrates support. Costs you the use of one adult and a managed move.', effect: { score: 3 } },
        { key: 'D', label: 'Ask reliable senior students to buddy high-needs peers so staff stay on the wider group', desc: 'Stretches adult coverage, but places safeguarding and medical responsibility on minors who are also frightened. A support, not a substitute.', effect: { score: -2 } }
      ]
    },
    {
      time: 90, type: 'inject', tag: 'MISINFORMATION',
      title: 'A False Message Spreads',
      body: 'A Mandarin-language WeChat message is circulating among some families claiming the school has collapsed and ' +
        'children are trapped. It is false — but several international and migrant parents cannot read the official ' +
        'channels and are now terrified, and a couple are driving dangerously to reach the school.',
      source: 'Bilingual Staff Member'
    },
    {
      time: 96, type: 'decision', tag: 'PRINCIPAL',
      title: 'Correcting Misinformation',
      body: 'The false "school collapsed" message is gaining traction in languages you do not control, across channels you ' +
        'cannot see. Several families distrust official sources at the best of times. You have no power, no internet, and ' +
        'only intermittent cell coverage to fight it with.',
      decisionId: 'prin_misinformation',
      prompt: 'How do you correct the misinformation across language groups?',
      options: [
        { key: 'A', label: 'Have a trusted bilingual parent record a short truth message and post written notices in key languages at the gate', desc: 'Meets families where they are, in languages they trust, through people they trust. The fastest way to kill a rumour is an authentic voice inside the same network.', effect: { score: 5 } },
        { key: 'B', label: 'Make an English-only announcement and assume it filters through', desc: 'Leaves the exact families who are most frightened and least served by official channels still in the dark.', effect: { score: -3 } },
        { key: 'C', label: 'Ignore it — parents will see the school standing when they arrive', desc: 'Meanwhile they are driving dangerously on damaged roads to reach a "collapsed" school. The rumour causes harm before they ever arrive.', effect: { score: -4 } },
        { key: 'D', label: 'Ask a bilingual senior student to translate the correction while staff confirm the facts', desc: 'Workable and quick, but leans on a student for a high-stakes communication. Useful as a bridge, not the whole plan.', effect: { score: 2 } }
      ]
    },
    {
      time: 112, type: 'inject', tag: 'RURAL',
      title: 'Bus Driver Makes Contact',
      body: 'A garbled call gets through from a school bus driver: 18 students are stranded with him near a damaged bridge ' +
        'on a rural road out of town. The bus is intact and the students are with him, but the bridge approach has ' +
        'partly collapsed and the light will start to fade in a few hours. He is asking what to do.',
      source: 'Bus Driver (sat-phone)'
    },
    {
      time: 118, type: 'decision', tag: 'PRINCIPAL',
      title: '18 Students Stranded',
      body: 'The 18 stranded students are safe for now but on the wrong side of a damaged bridge, in the cold, with night ' +
        'approaching. You cannot reach them yourself and emergency services are committed elsewhere. Whatever you decide, ' +
        'you are deciding it for other people’s children at a distance.',
      decisionId: 'prin_rural_bus',
      prompt: 'What do you direct for the stranded bus group?',
      options: [
        { key: 'A', label: 'Keep them with the bus and driver; send a known local 4WD volunteer plus a staff member with a first-aid kit', desc: 'Shelter-in-place with the trusted adult they already have, while help comes to them by the safest available means. The bus is warmth, light and a known location.', effect: { score: 4 } },
        { key: 'B', label: 'Tell them to walk back across the damaged bridge to town', desc: 'Sends children on foot across a partly collapsed structure in failing light. The fastest line on a map is the most dangerous one here.', effect: { score: -6 } },
        { key: 'C', label: 'Keep them with the bus and wait for emergency services', desc: 'Safe in principle, but services may not come for hours and the children are getting cold with no plan and no contact.', effect: { score: 0 } },
        { key: 'D', label: 'Send two staff in a school van immediately, thinning the team at school', desc: 'Well-meant, but strips adults from 400 children at the school to reach 18, possibly into the same blocked conditions.', effect: { score: -2 } }
      ]
    },
    {
      time: 136, type: 'decision', tag: 'PRINCIPAL',
      title: 'Inject — A Teacher Needs to Leave',
      body: 'A teacher quietly tells you their own child is at another school across town and they need to go now. Two other ' +
        'staff are checking their phones, clearly worried about their own families. If too many leave, student safety ' +
        'fails; if you force people to stay, morale and trust collapse. They are parents and community members too.',
      decisionId: 'prin_staff',
      prompt: 'How do you respond to the teacher who wants to leave?',
      options: [
        { key: 'A', label: 'Release them, and proactively organise word/welfare checks on all staff families to stop a cascade', desc: 'You cannot order someone to abandon their own child. Getting ahead of it — accounting for staff families — is what keeps the others able to stay and focus.', effect: { score: 4 } },
        { key: 'B', label: 'Require them to stay until relief arrives', desc: 'Technically defensible, but a parent trapped at work while their own child is unaccounted for makes poor decisions and remembers it for years.', effect: { score: -3 } },
        { key: 'C', label: 'Release them but flag it as a staffing/HR matter for later', desc: 'Framing a parent’s fear for their child as an HR issue is the kind of cold institutional response that corrodes a staff’s trust in you.', effect: { score: -2 } },
        { key: 'D', label: 'Release them and immediately reassign duties so high-needs cover is maintained', desc: 'Honours the human need and patches the operational hole at once, though without the proactive welfare-check that prevents the next three departures.', effect: { score: 3 } }
      ]
    },
    {
      time: 150, type: 'inject', tag: 'COMMUNITY',
      title: 'The Community Looks to the School',
      body: 'Townspeople with nowhere warm to go are drifting toward the school, and a Civil Defence volunteer asks whether ' +
        'the gym can become a community welfare centre. The school is the obvious refuge — but it is full of other ' +
        'people’s children, and the public arriving includes adults nobody can vouch for.',
      source: 'Civil Defence Volunteer / Townspeople'
    },
    {
      time: 156, type: 'decision', tag: 'PRINCIPAL',
      title: 'Shelter Role',
      body: 'The community expects the school to become a welfare hub, and the gym is your one clearly safe, usable building. ' +
        'But it is also where you are keeping students warm. Opening up too far creates safeguarding and operational risk; ' +
        'turning people away in the cold damages the trust you will need overnight.',
      decisionId: 'prin_shelter',
      prompt: 'How do you handle the school as a shelter?',
      options: [
        { key: 'A', label: 'Negotiate controlled use — gym as a screened welfare area with a separate supervised zone for students, one staffed entry', desc: 'Lets the school be the community asset it should be while keeping a hard line between unknown adults and children. Access is managed, not open.', effect: { score: 5 } },
        { key: 'B', label: 'Open the school fully to everyone who needs shelter', desc: 'Generous and fast, but mixes traumatised students with unscreened adults and overwhelms your supervision and sanitation at once.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse all public access — students only', desc: 'Keeps the safeguarding line absolutely clean, but turns cold, frightened community members away from the obvious refuge and costs you goodwill.', effect: { score: -2 } },
        { key: 'D', label: 'Hand the gym to Civil Defence to run as a welfare centre while you hold students in a separate supervised block', desc: 'Delegates the welfare-centre burden to the agency with the mandate, freeing you for students — if Civil Defence can actually staff it now.', effect: { score: 3 } }
      ]
    },
    {
      time: 174, type: 'decision', tag: 'PRINCIPAL',
      title: 'Ethical — Request for Student Information',
      body: 'The Civil Defence welfare team asks you to hand over a list of medically vulnerable students and their home ' +
        'addresses, to help direct welfare support across the township. Privacy obligations are real — but so is the ' +
        'insulin-dependent child whose home medication may now be unreachable.',
      decisionId: 'prin_privacy',
      prompt: 'What student information do you share?',
      options: [
        { key: 'A', label: 'Share the minimum need-to-know for urgent welfare via a verified CD liaison, and log what you shared and why', desc: 'Lawful and humane. Disclosure to prevent a serious threat to health is permitted; narrow, deliberate, recorded sharing serves the child without dumping the whole register.', effect: { score: 5 } },
        { key: 'B', label: 'Refuse until a formal written data-sharing agreement is in place', desc: 'Process-correct in calm times, but in a life-safety event this can leave a vulnerable child unsupported while paperwork catches up.', effect: { score: -2 } },
        { key: 'C', label: 'Hand over the full student medical register and address list', desc: 'Solves the request by over-disclosing every family’s sensitive data to people and purposes you have not verified. Trust, once breached, does not come back.', effect: { score: -4 } },
        { key: 'D', label: 'Share nothing — it is not the school’s role', desc: 'Treats privacy as absolute. A child could be harmed by the information you withheld when a narrow, verified disclosure was available.', effect: { score: -3 } }
      ]
    },
    {
      time: 190, type: 'cascade', tag: 'NIGHTFALL',
      title: 'Snow Confirmed — Nightfall Approaching',
      body: 'MetService’s overnight snow warning is confirmed and the temperature is dropping fast. Heating is still out, ' +
        'many students arrived wet from the evacuation, and blankets are limited. Rural students cannot get home before ' +
        'dark. The toilets may not flush and water may be contaminated, raising the gastro risk if the school becomes a ' +
        'shelter. The question shifts from "respond" to "survive the night safely".',
      source: 'MetService / Site Caretaker'
    },
    {
      time: 198, type: 'decision', tag: 'PRINCIPAL',
      title: 'Food',
      body: 'Stocktake of the canteen, staffroom, breakfast-club supplies, emergency water drums and leftover lunches comes ' +
        'to roughly one meal for everyone — not enough for overnight. Hungry, frightened children are hard to keep ' +
        'calm, but burning the whole supply now leaves nothing for the night ahead.',
      decisionId: 'prin_food',
      prompt: 'How do you use the limited food?',
      options: [
        { key: 'A', label: 'Register and ration now — small portions, youngest and high-needs first, hold a reserve', desc: 'Stretches a single meal across an uncertain night and protects the most vulnerable. Disciplined, fair, and sustainable.', effect: { score: 4 } },
        { key: 'B', label: 'Feed everyone fully now to calm them, and deal with later, later', desc: 'Buys calm for an hour and leaves you with nothing when the night gets long and cold. Comfort now, crisis later.', effect: { score: -3 } },
        { key: 'C', label: 'Hold all food until you know whether students stay overnight', desc: 'Prudent on paper, but leaves hungry, anxious children unfed now, which worsens behaviour and welfare in the meantime.', effect: { score: -2 } },
        { key: 'D', label: 'Ration immediately, and send a verified resupply request to the EOC and community before dark', desc: 'Manages the supply you have and works the problem you cannot solve alone — getting more food moving while the light lasts.', effect: { score: 5 } }
      ]
    },
    {
      time: 214, type: 'decision', tag: 'PRINCIPAL',
      title: 'Overnight Arrangements',
      body: 'Rural students and some town students cannot safely get home tonight. Local families are kindly offering to take ' +
        'children in. Keeping everyone at school requires staffing, warmth and food you are short of; informal billeting ' +
        'with whoever offers creates real safeguarding risk. Either way, you are accountable for every child until handed ' +
        'to a verified caregiver.',
      decisionId: 'prin_overnight',
      prompt: 'What is your overnight plan for children who cannot get home?',
      options: [
        { key: 'A', label: 'Keep them in the warmest safe building with staffing, food and a written register; allow only vetted billeting with ID and sign-out', desc: 'Holds the duty-of-care line: known location, known adults, recorded handovers. Billeting is allowed but verified, not improvised.', effect: { score: 5 } },
        { key: 'B', label: 'Let local families take any children to reduce the numbers staying', desc: 'Eases your logistics by handing children to adults nobody has checked, with no record of who went where. The classic disaster safeguarding failure.', effect: { score: -5 } },
        { key: 'C', label: 'Keep every child at school overnight, no exceptions', desc: 'Maximises control and oversight, but strains your warmth, food and exhausted staff to the limit and may be unnecessary for low-risk, verified handovers.', effect: { score: 1 } },
        { key: 'D', label: 'Release children to any family heading their direction to get them home', desc: 'Solves transport by abandoning verification entirely — children leaving with unconfirmed adults into the night and the snow.', effect: { score: -4 } }
      ]
    },
    {
      time: 232, type: 'decision', tag: 'PRINCIPAL',
      title: 'Inject — Demand for a Helicopter',
      body: 'An international parent, frantic and unfamiliar with earthquakes, demands that their child be evacuated by ' +
        'helicopter immediately. There is no medical reason, the child is safe and warm, and rotary assets are reserved ' +
        'for life-threatening cases across a whole region in crisis. The parent is escalating in front of others.',
      decisionId: 'prin_helicopter',
      prompt: 'How do you respond to the helicopter demand?',
      options: [
        { key: 'A', label: 'Calmly explain prioritisation, reassure them their child is safe and warm, and stay with them a moment', desc: 'Acknowledges the fear, holds the line on scarce life-safety assets, and rebuilds trust through presence rather than confrontation.', effect: { score: 4 } },
        { key: 'B', label: 'Refuse bluntly and move on', desc: 'The decision is right but the delivery leaves a terrified parent humiliated and more distrustful, in front of an audience.', effect: { score: -1 } },
        { key: 'C', label: 'Escalate the request to the Civil Defence welfare team and keep the parent informed', desc: 'Routes the demand to the right authority and keeps the parent in the loop, at the cost of a little time and follow-up.', effect: { score: 3 } },
        { key: 'D', label: 'Promise to arrange it to calm them down, knowing you cannot', desc: 'Buys quiet for five minutes and detonates your credibility the moment the helicopter does not come — with someone you will rely on all night.', effect: { score: -4 } }
      ]
    },
    {
      time: 248, type: 'info', tag: 'HANDOVER',
      title: 'The Night Holds — Transition to Welfare',
      body: 'By evening the picture stabilises: every student is accounted for, reunifications are recorded, high-needs ' +
        'students are supported, and those who must stay are warm, fed and supervised in one safe building. Civil Defence ' +
        'is now running the community welfare function alongside you. You could not solve the whole emergency — your ' +
        'job was narrower and harder: keep children alive, account for every one, reunite them safely, support the most ' +
        'vulnerable, and use the school as a community asset only where it did not compromise their safety.',
      source: 'School Command / Civil Defence'
    }
  ];

})();
