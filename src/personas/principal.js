// ============================================================================
// PERSONA: SCHOOL PRINCIPAL  -  Te Awa Area School
// M7.9 Alpine Fault earthquake, 11:18 a.m. on a winter school day.
// Source brief: "Persona School Principal" (Te Awa Area School), incorporating
// the student-cellphone/social-media, parent-behaviour, student-privacy and
// Emergency Mobile Alert tsunami-evacuation complexities.
//
// Loaded AFTER nz-cascading-impact-simulator.js; registers itself by extending
// the engine's shared registries (purely additive).
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
    debriefName: 'M7.9 Alpine Fault — Te Awa Area School',
    facObjective: 'a school-level life-safety and welfare response when normal systems have failed and the emergency ' +
      'is unfolding both on the ground and online. Key themes: accurate student accounting, safe family reunification, ' +
      'safeguarding and student privacy, managing misinformation and a frightened parent crowd, inclusion of migrant ' +
      'and rural families, and adapting through cascading hazards including a tsunami evacuation.',
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
      { id: 'comms', label: 'Network:', value: 'Congested', cls: 'critical' }
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
        { label: 'Media', value: 'Converging', cls: 'failed' }
      ],
      lifelinesTitle: 'Site & Utilities',
      lifelines: [
        { label: 'Power', value: 'Out', cls: 'failed' },
        { label: 'Heating', value: 'Off', cls: 'failed' },
        { label: 'Water', value: 'Untested', cls: 'unknown' },
        { label: 'Internet', value: 'Down', cls: 'failed' },
        { label: 'Cell Network', value: 'Congested', cls: 'degraded' },
        { label: 'Toilets', value: 'At Risk', cls: 'degraded' }
      ],
      transportTitle: 'Buildings & Access',
      transport: [
        { label: 'Main Teaching Block', value: 'Damaged', cls: 'degraded' },
        { label: 'School Hall', value: 'Moderate Damage', cls: 'degraded' },
        { label: 'Gymnasium', value: 'Usable', cls: 'good' },
        { label: 'School Buses', value: 'Grounded', cls: 'failed' },
        { label: 'Township Roads', value: 'Blocked', cls: 'failed' },
        { label: 'Rural Roads', value: 'Cut Off', cls: 'failed' }
      ],
      cascadeTitle: 'Emerging Risks',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '🌊', name: 'Tsunami Threat', level: 'Watch', cls: 'high' },
        { icon: '📱', name: 'Misinformation', level: 'High', cls: 'high' },
        { icon: '👥', name: 'Crowd Pressure', level: 'Moderate', cls: 'moderate' },
        { icon: '❄️', name: 'Overnight Snow', level: 'High', cls: 'high' },
        { icon: '🚽', name: 'Sanitation / Gastro', level: 'Moderate', cls: 'moderate' },
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
    comms: { label: 'Crisis Comms', value: 50, icon: '📢' }
  };

  // ---- Decision -> meter effects -------------------------------------------
  Object.assign(UTILITY_EFFECTS, {
    'prin_accounting': { 'A': { comms: 5 }, 'D': { comms: 3 } },
    'prin_phones': { 'A': { comms: 8 }, 'C': { comms: -5 } },
    'prin_misinformation': { 'A': { comms: 8 }, 'D': { comms: 4 }, 'C': { comms: -5 } },
    'prin_viral_rumour': { 'A': { comms: 8 }, 'D': { comms: 3 }, 'B': { comms: -6 } },
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
    'prin_phones': {
      'A': { comms: 8, parentTrust: 4, safeguarding: 3 },
      'B': { comms: -3, staffCapacity: -5, parentTrust: -2 },
      'C': { comms: -8, safeguarding: -6, parentTrust: -3 },
      'D': { comms: -3, parentTrust: -2 }
    },
    'prin_reunification': {
      'A': { safeguarding: 10, parentTrust: 5 },
      'B': { safeguarding: -12, parentTrust: 5, studentSafety: -5 },
      'C': { safeguarding: 5, parentTrust: -5 },
      'D': { safeguarding: 8, parentTrust: 6 }
    },
    'prin_tsunami': {
      'A': { studentSafety: 8, safeguarding: 5, staffCapacity: -3 },
      'B': { studentSafety: -12, safeguarding: -3 },
      'C': { safeguarding: -12, studentSafety: -5 },
      'D': { studentSafety: -6, safeguarding: -4, inclusion: -2 }
    },
    'prin_tsunami_info': {
      'A': { comms: 8, studentSafety: 6, parentTrust: 3 },
      'B': { studentSafety: -6 },
      'C': { studentSafety: -5, safeguarding: -3 },
      'D': { studentSafety: -10 }
    },
    'prin_parents': {
      'A': { parentTrust: 6, safeguarding: 5, staffCapacity: -3 },
      'B': { safeguarding: -8, parentTrust: -4 },
      'C': { parentTrust: -4, safeguarding: 2 },
      'D': { parentTrust: -5 }
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
    'prin_viral_rumour': {
      'A': { comms: 10, parentTrust: 6, studentSafety: 3 },
      'B': { comms: -8, parentTrust: -5, studentSafety: -3 },
      'C': { comms: -3, parentTrust: -3 },
      'D': { comms: 3, parentTrust: 2 }
    },
    'prin_student_privacy': {
      'A': { safeguarding: 8, parentTrust: 5, comms: 3 },
      'B': { safeguarding: 4, parentTrust: -2, staffCapacity: -3 },
      'C': { safeguarding: -10, parentTrust: -4 },
      'D': { safeguarding: -3, comms: 2 }
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
    'prin_phones': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: 2, communityTrust: -1 }, 'C': { decisive: -1, centralized: -2 }, 'D': { centralized: 2, communityTrust: -1 } },
    'prin_reunification': { 'A': { decisive: 1, centralized: 2 }, 'B': { decisive: 2, centralized: -2, communityTrust: 1 }, 'C': { decisive: -1, centralized: 1 }, 'D': { decisive: 1, centralized: 1, communityTrust: 1 } },
    'prin_tsunami': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -2, lifeSafety: -2 }, 'C': { decisive: 1, centralized: -2, communityTrust: 1 }, 'D': { decisive: 1, lifeSafety: -1 } },
    'prin_tsunami_info': { 'A': { decisive: 1, centralized: 2, lifeSafety: 2 }, 'B': { decisive: -2, lifeSafety: -1 }, 'C': { centralized: -2, communityTrust: 1 }, 'D': { decisive: 1, lifeSafety: -2 } },
    'prin_parents': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: -2, communityTrust: 1 }, 'C': { centralized: 2, communityTrust: -2 }, 'D': { decisive: -2, centralized: 1 } },
    'prin_medical': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: 1, lifeSafety: 2 }, 'D': { decisive: 1, lifeSafety: -1, communityTrust: 1 } },
    'prin_misinformation': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: 1, communityTrust: -1 }, 'C': { decisive: -2 }, 'D': { communityTrust: 1 } },
    'prin_viral_rumour': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: -2 }, 'C': { decisive: 1, centralized: 2, communityTrust: -1 }, 'D': { decisive: 1, centralized: 1 } },
    'prin_student_privacy': { 'A': { decisive: 1, communityTrust: 1, centralized: 1 }, 'B': { centralized: 2, communityTrust: -1 }, 'C': { decisive: -2 }, 'D': { decisive: 1, communityTrust: 1 } },
    'prin_rural_bus': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -1 }, 'D': { decisive: 2, lifeSafety: -1, centralized: -1 } },
    'prin_staff': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { centralized: 2, communityTrust: -2 }, 'C': { centralized: 1, communityTrust: -1 }, 'D': { decisive: 1, centralized: 1 } },
    'prin_shelter': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: -2, communityTrust: 2 }, 'C': { centralized: 2, communityTrust: -2 }, 'D': { centralized: 0, communityTrust: 1 } },
    'prin_privacy': { 'A': { decisive: 1, lifeSafety: 1, centralized: 0 }, 'B': { decisive: -1, centralized: 1 }, 'C': { decisive: 1, centralized: -1 }, 'D': { decisive: -1 } },
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
          body: 'Two teachers entered the damaged main block to look for the missing Year 6 student. A sharp aftershock ' +
            'brought down a section of ceiling. One teacher is now injured, pulling staff and attention away from the ' +
            'wider group at the very moment you needed them. The missing student, it turns out, had already walked to ' +
            'the assembly point.',
          source: 'Deputy Principal / Assembly Point',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Injured (serious)', '3', 'failed');
          updatePanelItem('cdem-groups', 'Staff On Site', '23 / 26', 'degraded');
        }
      }
    },
    'prin_tsunami': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Minutes Lost — The Bus Enters the Zone',
          body: 'While the warning was being verified, precious minutes drained away. The inbound bus with 40 students ' +
            'drove into the tsunami evacuation zone before it could be redirected, and your own group is now moving to ' +
            'high ground later and slower than it should be. With a tsunami, the rule is do not wait — and the wait has ' +
            'cost you the safety margin.',
          source: 'Civil Defence / Bus Driver',
          scorePenalty: -5
        }
      }
    },
    'prin_parents': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Wrong-Release in the Chaos',
          body: 'Making exceptions for the loudest parents collapsed the orderly process. In the crush, a child was ' +
            'released to an adult who was not an authorised caregiver, and the social-media parent’s livestream of ' +
            'the confrontation is now spreading with your school named. A safeguarding incident and a reputational one, ' +
            'both born of the same shortcut.',
          source: 'Reunification Point / Office',
          scorePenalty: -3
        }
      }
    },
    'prin_viral_rumour': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Parents Self-Deploy onto Damaged Roads',
          body: 'Left uncorrected, the "gym collapsed, hundreds trapped" post kept spreading. Parents abandoned cars on ' +
            'blocked roads and ran toward the school; one was injured on a damaged road and the gridlock is now blocking ' +
            'the emergency vehicles you actually need. The rumour did real-world harm while you stayed silent.',
          source: 'NZ Police / Front Gate',
          scorePenalty: -4
        }
      }
    },
    'prin_rural_bus': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Student Injured Attempting the Bridge',
          body: 'The group set off to walk back across the damaged bridge as instructed. One student slipped on the broken ' +
            'approach and was injured, and the rest are now strung out along an unstable structure in worsening weather. ' +
            'A 4WD recovery is being scrambled in far harder conditions than if they had stayed with the bus.',
          source: 'Bus Driver / Rural Volunteer',
          scorePenalty: -5
        }
      }
    }
  });

  // ---- Facilitator notes -----------------------------------------------------
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
    'prin_phones': {
      learningObjective: 'Treat student phones as a communication channel to manage, not a problem to confiscate.',
      bestPractice: 'A',
      teachingNote: 'Confiscating 420 phones is impractical and inflames fear, and a posting ban with nothing truthful to ' +
        'share just leaves a vacuum the rumours fill. Briefing students with an accurate line they can share turns them ' +
        'into part of your communications, slows misinformation, and reduces parents self-deploying.',
      references: [
        { label: 'Crisis communication', desc: 'fill the information vacuum fast with an authoritative, shareable message' }
      ],
      discussionPrompts: [
        'What is the one accurate sentence you would want every student to send their family right now?',
        'How do you protect injured students’ privacy while phones are in use?'
      ]
    },
    'prin_tsunami': {
      learningObjective: 'On an Emergency Mobile Alert / natural tsunami warning, act immediately and keep accountability on the move.',
      bestPractice: 'A',
      teachingNote: 'Long or Strong, Get Gone: a strong or long earthquake near the coast is itself the warning, and an EMA ' +
        'is an instruction to move now, not to verify. Evacuate to high ground by the planned route, keep classes together ' +
        'with their rolls so accountability survives the move, and redirect the inbound bus away from the zone. Waiting, ' +
        'self-release to parents, or leaving the injured all cost lives.',
      references: [
        { label: 'Long or Strong, Get Gone', desc: 'natural warning of tsunami; self-evacuate immediately without waiting for official confirmation' },
        { label: 'Emergency Mobile Alert', desc: 'an EMA instruction to evacuate is to be acted on, not verified' }
      ],
      discussionPrompts: [
        'How do you keep a roll-based head count during a moving evacuation on foot?',
        'What is your plan for non-ambulant and injured students when you must move now?'
      ]
    },
    'prin_parents': {
      learningObjective: 'Hold a single fair reunification process and de-escalate, even under aggressive pressure.',
      bestPractice: 'A',
      teachingNote: 'Making exceptions for the loudest parents rewards aggression and collapses the fair, safe process for ' +
        'everyone. Name what is happening calmly, keep one verified release process, and use staff plus Police to separate ' +
        'a physical altercation. Consistency under pressure is what protects children and preserves trust.',
      references: [
        { label: 'Reunification / crowd management', desc: 'one controlled release process; do not negotiate it away under pressure' }
      ],
      discussionPrompts: [
        'How do you de-escalate an angry parent without abandoning the process that protects every child?',
        'When does a parent confrontation become a Police matter rather than a school one?'
      ]
    },
    'prin_viral_rumour': {
      learningObjective: 'Correct dangerous misinformation fast, through every channel, before it drives real-world harm.',
      bestPractice: 'A',
      teachingNote: 'A viral "the gym collapsed" post can put parents on damaged roads and gridlock emergency vehicles ' +
        'within minutes. Issue an immediate factual correction across every channel you have - school social media, ' +
        'students, a sign at the gate, and Police/media liaison - rather than ignoring it or only chasing the student who ' +
        'posted it.',
      references: [
        { label: 'Misinformation response', desc: 'speed and reach beat accuracy-after-the-fact; correct on every channel at once' }
      ],
      discussionPrompts: [
        'What channels can you actually reach the district through with the power and network down?',
        'How do you correct a rumour without amplifying it further?'
      ]
    },
    'prin_student_privacy': {
      learningObjective: 'Protect the dignity and privacy of injured children without an unwinnable confiscation battle.',
      bestPractice: 'A',
      teachingNote: 'Injured, identifiable children livestreamed to thousands - before their families even know - is a ' +
        'child-protection failure, not just a PR one. Calmly stop the filming of injured peers, move the injured out of ' +
        'view, and escalate removal of the viral video through the platform and Police, rather than ignoring it or fighting ' +
        'every device.',
      references: [
        { label: 'Student privacy / safeguarding', desc: 'protect identities of injured minors; families informed before the public' }
      ],
      discussionPrompts: [
        'How do you balance stopping the harm against not escalating with frightened students?',
        'Who needs to know about an injured child before any image reaches the public?'
      ]
    },
    'prin_privacy': {
      learningObjective: 'In a life-safety event, privacy matters but must not block urgent welfare action.',
      bestPractice: 'A',
      teachingNote: 'Sharing the minimum need-to-know (e.g. the insulin-dependent child) through a verified Civil Defence ' +
        'liaison, and logging what was shared and why, is both lawful and humane. Refusing outright can cost a life; ' +
        'handing over the entire register over-discloses and breaches trust.',
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
      teachingNote: 'Controlled, screened use of the gym with a separate supervised zone for students keeps the ' +
        'safeguarding line intact. Throwing the doors open mixes unknown adults with children; a flat refusal burns the ' +
        'trust you will need overnight.',
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
      body: 'The Board of Trustees chair is on a crackling line wanting a full briefing "for the board" and asking whether ' +
        'the school will be open tomorrow. They are anxious and want detail you do not yet have.',
      source: 'Board of Trustees Chair',
      prompt: 'How do you handle the board chair?',
      options: [
        { key: 'A', label: 'Give a 60-second factual update, promise a fuller brief once students are safe, end the call', desc: 'Maintains the relationship without surrendering scarce attention to a running commentary while you run a life-safety response.', effect: { score: 2 } },
        { key: 'B', label: 'Stop and give a full detailed briefing now', desc: 'Every minute narrating to the board is a minute not spent on accounting and reunification. The detail does not exist yet anyway.', effect: { score: -1 } },
        { key: 'C', label: 'Ignore the call entirely', desc: 'The board is a governance partner you will need for the recovery. A flat no-contact breeds rumour and undermines you later.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Conspiracy Parent at the Fence',
      body: 'A parent is loudly telling others at the fence that the government is hiding fatalities, that a far bigger quake ' +
        'is imminent, and that teachers "know more than they are saying." A small group is starting to listen.',
      source: 'Front Gate',
      prompt: 'How do you handle the conspiracy claims?',
      options: [
        { key: 'A', label: 'Calmly restate what you know and do not know, and what you will share and when, to the wider group', desc: 'Anchors the listening parents to your steady, factual message rather than the loudest voice. You cannot convince the believer, but you can hold the audience.', effect: { score: 2 } },
        { key: 'B', label: 'Argue with the parent to shut the claims down', desc: 'A public argument elevates the conspiracy and burns time you do not have. You will not win it and the audience sees a fight, not facts.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore it entirely', desc: 'Unchallenged, the claims harden into "what the school will not admit" among the very parents you need to keep calm.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Spontaneous Volunteers in the Grounds',
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
      tag: 'NOISE', title: 'A Local Reporter Wants "the Numbers"',
      body: 'A regional reporter at the fence is pressing staff: "How many are injured? Is it true a child is missing?" ' +
        'Waiting parents are listening in.',
      source: 'Regional News',
      prompt: 'How do you handle the reporter?',
      options: [
        { key: 'A', label: 'Hold one calm factual line, protect student privacy, and direct them to Civil Defence for the wider picture', desc: 'Controls the narrative without feeding speculation or breaching the privacy of injured children in front of an anxious crowd.', effect: { score: 2 } },
        { key: 'B', label: 'Let staff answer questions freely - transparency is good', desc: 'Unmanaged comments create contradictory, alarming coverage and can name or identify injured students.', effect: { score: -2 } },
        { key: 'C', label: 'Have them removed and say nothing', desc: 'A vacuum fills itself: "school refused to comment while a child was missing" writes its own headline.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Caretaker Reports a Gas Smell Near the Canteen',
      body: 'The caretaker can smell gas near the canteen kitchen - the very place you were planning to prepare the one ' +
        'available meal. It may be a cracked line, or nothing.',
      source: 'Site Caretaker',
      prompt: 'How do you respond to the gas smell?',
      options: [
        { key: 'A', label: 'Isolate the area, shut the gas at the main, keep everyone clear until it is checked', desc: 'Correct and immediate. A suspected gas leak after a quake is a life-safety issue that outranks meal planning.', effect: { score: 2 } },
        { key: 'B', label: 'Carry on - you need the kitchen for food', desc: 'Cooking next to a possible gas leak risks turning a welfare problem into a fire or explosion.', effect: { score: -3 } },
        { key: 'C', label: 'Send the caretaker in alone to investigate', desc: 'Sending one person into a suspected gas hazard is the wrong call; isolate and keep clear instead.', effect: { score: -1 } }
      ]
    }
  ];

  // ---- Event sequence -------------------------------------------------------
  // Times are minutes since the mainshock; the engine paces the gaps.
  PERSONA_EVENTS.principal = [
    {
      time: 0, type: 'inject', tag: 'MAINSHOCK',
      title: 'M7.9 Alpine Fault Rupture - Severe Shaking During Class',
      body: 'At 11:18 a.m. a magnitude 7.9 Alpine Fault earthquake strikes. Shaking is violent and prolonged across Te Awa ' +
        'Area School. Students drop, cover and hold as light fittings swing and glass breaks. Power and internet fail ' +
        'instantly and the heating dies with them; the cell network is overloaded and intermittent. When the shaking stops, ' +
        'the main teaching block is damaged, the hall has moderate damage, and the gymnasium appears sound. It is winter, ' +
        'snow is forecast overnight, landslides have blocked the roads, and 420 students in Years 1 to 13 are now your ' +
        'responsibility - with aftershocks continuing and several international families unable to understand the official ' +
        'emergency messaging.',
      source: 'GeoNet - Automatic Detection',
      aftershock: true
    },
    {
      time: 4, type: 'info', tag: 'FIRST ACTIONS',
      title: 'Shaking Stops - Evacuate to the Field',
      body: 'Following Drop, Cover, Hold, staff evacuate classes to the open sports field, away from buildings, glass, ' +
        'powerlines and the slope behind the school. Your immediate job is to keep children away from hazards, account for ' +
        'everyone, treat any life-threatening injuries, establish a student assembly area, and start a written decision log. ' +
        'The wider community emergency is not yet your problem - the children in front of you are.',
      source: 'Deputy Principal / Senior Staff'
    },
    {
      time: 10, type: 'decision', tag: 'PRINCIPAL',
      title: 'Student Accounting',
      body: 'Classes are assembling on the field but the count is messy: students were at PE, in specialist rooms, and on a ' +
        'senior work-experience block. A Year 6 teacher reports one student missing - friends say he ran back inside for ' +
        'his bag. The main block is damaged and aftershocks are ongoing.',
      decisionId: 'prin_accounting',
      prompt: 'How do you run student accounting in the first minutes?',
      options: [
        { key: 'A', label: 'Immediate roll at the assembly point - teachers count their classes and report gaps to one central board', desc: 'Fast, structured accountability. A single tally board shows who is missing within minutes and frees you to direct the response.', effect: { score: 5 } },
        { key: 'B', label: 'Send teachers into the damaged block now to find the missing Year 6 student', desc: 'Compassionate, but turns staff into casualties if the structure is unstable. Untrained adults in a damaged building during aftershocks is how rescuers get hurt.', effect: { score: -5 } },
        { key: 'C', label: 'Wait for FENZ to arrive before any count or search', desc: 'Roads are blocked and FENZ is delayed. Waiting leaves children unaccounted for an unknown length of time while you stand idle.', effect: { score: -3 } },
        { key: 'D', label: 'Exterior head count and visual sweep first; mark the damaged block for FENZ; log everything', desc: 'Account for everyone you can safely reach, sweep the exterior for the missing student, and hand the dangerous interior to professionals.', effect: { score: 3 } }
      ]
    },
    {
      time: 26, type: 'decision', tag: 'PRINCIPAL',
      title: 'Student Phones & Social Media',
      body: 'Within minutes hundreds of students are calling parents and posting from the field. The cell network is ' +
        'congesting, some messages fail, and some posts are factual while others exaggerate - and a few students are posting ' +
        'for attention: "the school has collapsed", "people are dead", "teachers are trapped". The posts are already moving ' +
        'through the district faster than any official word, and some parents who heard nothing are assuming the worst.',
      decisionId: 'prin_phones',
      prompt: 'How do you manage student phones and social media?',
      options: [
        { key: 'A', label: 'Let students keep phones but brief them fast, give a truthful line to share, and ask them to stop posting unverified claims', desc: 'Treats students as part of your communications. A shared accurate message slows the rumours and reaches families you cannot - confiscation cannot.', effect: { score: 5 } },
        { key: 'B', label: 'Collect all student phones to stop the misinformation', desc: 'Impractical for 420 frightened students, cuts the one comms channel that is working, and escalates fear - though the safeguarding intent is understandable.', effect: { score: -3 } },
        { key: 'C', label: 'Allow unrestricted phone use and focus only on physical safety', desc: 'Lets misinformation and the filming of injured children run unchecked, and drives parents to self-deploy onto blocked roads.', effect: { score: -4 } },
        { key: 'D', label: 'Ban all posting and threaten consequences, with nothing truthful offered to share instead', desc: 'Authority without an alternative. With no accurate line to spread, the rumours simply fill the vacuum you left.', effect: { score: -2 } }
      ]
    },
    {
      time: 42, type: 'decision', tag: 'PRINCIPAL',
      title: 'Parent Reunification',
      body: 'Parents began arriving within minutes and are gathering at the gate, distressed and demanding their children. ' +
        'But custody and protection orders may apply, some caregivers are not listed contacts, emergency contacts are ' +
        'unreachable, and language barriers are slowing every check. Release the wrong child to the wrong adult and the ' +
        'consequences are irreversible.',
      decisionId: 'prin_reunification',
      prompt: 'How do you release children to families?',
      options: [
        { key: 'A', label: 'One signed release point - photo ID checked against emergency contacts before any child leaves', desc: 'Slower and harder, but defensible. Every release is verified and recorded. This is the protection a child cannot give themselves.', effect: { score: 5 } },
        { key: 'B', label: 'Release children to any adult they recognise to cut the distress quickly', desc: 'Recognition is not authorisation. This is exactly how a child ends up with someone an order was meant to keep away.', effect: { score: -5 } },
        { key: 'C', label: 'Hold all children until the full roll is confirmed, then release in waves', desc: 'Maximum control, but leaves frightened children and parents waiting longer than necessary and stokes anger at the gate.', effect: { score: 1 } },
        { key: 'D', label: 'Signed release point with ID checks, plus a calm waiting area for children away from the gate', desc: 'Keeps the verification discipline of A while shielding children from the crush and noise of the gate.', effect: { score: 3 } }
      ]
    },
    {
      time: 48, type: 'decision', tag: 'CASCADE',
      title: 'Emergency Mobile Alert - Tsunami Evacuation',
      body: 'Forty-five minutes after the quake every phone suddenly sounds the Emergency Mobile Alert: "Strong earthquake ' +
        'near the coast. Move immediately to higher ground or as far inland as possible. Do not wait." The school lies ' +
        'inside the tsunami evacuation zone. Younger students are crying, some seniors are already running, arriving parents ' +
        'are demanding their children, a bus with 40 students is five minutes out and heading toward the zone, and your ' +
        'evacuation route passes damaged buildings and downed power lines. One teacher thinks the alert may be an error.',
      decisionId: 'prin_tsunami',
      prompt: 'What do you do on the tsunami alert?',
      options: [
        { key: 'A', label: 'Evacuate now to high ground by the planned route, keeping classes together with their rolls, and redirect the inbound bus away from the zone', desc: 'An EMA and a strong coastal quake are the warning - you act, you do not verify. Keeping classes and rolls together preserves accountability on the move.', effect: { score: 5 } },
        { key: 'B', label: 'Hold and verify the warning first before moving anyone', desc: 'With a tsunami the rule is do not wait. Verifying burns the exact minutes that are the difference between high ground and the water.', effect: { score: -6 } },
        { key: 'C', label: 'Release children to any parents present and let families self-evacuate', desc: 'Loses accountability and safeguarding in a moving crisis - and most children have no parent there to take them.', effect: { score: -5 } },
        { key: 'D', label: 'Evacuate, but leave the injured students to wait for ambulances', desc: 'Abandons the most vulnerable. No ambulance is coming in time; the injured must be moved with the group.', effect: { score: -3 } }
      ]
    },
    {
      time: 56, type: 'decision', tag: 'CASCADE',
      title: 'Conflicting Information During the Evacuation',
      body: 'Mid-evacuation the information fractures: a parent shouts that the warning has been cancelled, a teacher says it ' +
        'only applies to beaches, and students are sharing contradictory TikTok and Facebook posts. People are slowing, some ' +
        'want to turn back, and you need everyone to keep moving to high ground.',
      decisionId: 'prin_tsunami_info',
      prompt: 'How do you keep one trusted source while continuing the evacuation?',
      options: [
        { key: 'A', label: 'Name one official source (Civil Defence / EMA) as the only one you act on, tell everyone to keep moving until it stands down, and ignore social media', desc: 'A single authoritative source plus "keep moving until it stands down" stops the group fragmenting on unverified all-clears.', effect: { score: 5 } },
        { key: 'B', label: 'Stop and check the conflicting claims before continuing', desc: 'Halting a tsunami evacuation to chase unverified claims is the dangerous outcome the alert exists to prevent.', effect: { score: -5 } },
        { key: 'C', label: 'Let people decide for themselves based on what they are hearing', desc: 'Fragments the group, loses your head count, and lets the most confident rumour win.', effect: { score: -4 } },
        { key: 'D', label: 'Turn back because a parent said the warning was cancelled', desc: 'Acting on an unverified all-clear from a single panicked source is potentially fatal.', effect: { score: -6 } }
      ]
    },
    {
      time: 70, type: 'info', tag: 'STAND-DOWN',
      title: 'Tsunami Warning Downgraded - Regroup on High Ground',
      body: 'Civil Defence downgrades the tsunami threat for your area: the school evacuated in time and is now regrouped at ' +
        'the high-ground assembly point. Rolls are being re-checked after the moving evacuation. Attention returns to the ' +
        'grinding welfare problem - cold, frightened children, converging parents, and a long afternoon and night ahead with ' +
        'no power and blocked roads.',
      source: 'Civil Defence / School Command'
    },
    {
      time: 82, type: 'decision', tag: 'PRINCIPAL',
      title: 'Managing the Parent Crowd',
      body: 'Parents are converging on the reunification point and behaving very differently: one is furious and blaming the ' +
        'school, one is trying to force past staff to reach his child, one distrusts you and wants to search classrooms ' +
        'himself, and one is livestreaming the confrontation and tagging media. Then two parents arguing over queue priority ' +
        'come to blows.',
      decisionId: 'prin_parents',
      prompt: 'How do you manage the parent crowd and the altercation?',
      options: [
        { key: 'A', label: 'Hold one fair reunification process for everyone, calmly name what is happening, and direct a staff member plus Police to separate the fighting parents', desc: 'Consistency plus de-escalation plus safety. The process that protects every child is exactly what you do not trade away under pressure.', effect: { score: 5 } },
        { key: 'B', label: 'Make exceptions for the loudest and most aggressive parents to defuse them', desc: 'Rewards aggression, collapses the fair process, and signals to everyone else that shouting works. The safeguarding line goes with it.', effect: { score: -5 } },
        { key: 'C', label: 'Lock down the reunification point and hand all of it to Police', desc: 'Police are stretched and may be slow; locking down abandons your role and frightens the compliant majority.', effect: { score: -2 } },
        { key: 'D', label: 'Pause reunification entirely until the crowd calms', desc: 'Punishes every waiting family, increases panic, and raises the pressure rather than releasing it.', effect: { score: -3 } }
      ]
    },
    {
      time: 96, type: 'cascade', tag: 'AFTERSHOCK',
      title: 'M6 Aftershock - Panic Spreads',
      body: 'A strong aftershock rolls through. More plaster falls from the damaged hall and a window cracks. On the high-ground ' +
        'assembly a student has a severe panic attack and several younger children begin crying and clinging to staff. The ' +
        'emotional temperature spikes just as you are trying to hold an orderly reunification line.',
      source: 'GeoNet / Assembly Point',
      aftershock: true
    },
    {
      time: 106, type: 'decision', tag: 'PRINCIPAL',
      title: 'High-Needs Students',
      body: 'You have an insulin-dependent diabetic student, a student with epilepsy, a wheelchair user whose access routes ' +
        'are blocked, students with autism overwhelmed by the noise, students with severe anxiety, and several who rely on ' +
        'medication kept at home. Adult supervision is finite and the aftershock has scattered your attention.',
      decisionId: 'prin_medical',
      prompt: 'How do you cover high-needs students with limited adults?',
      options: [
        { key: 'A', label: 'Name a specific adult to each high-needs student now (insulin, epilepsy, mobility, autism, acute anxiety)', desc: 'These students have the smallest margin for error. A named adult per student beats hoping general supervision catches a crisis in time.', effect: { score: 5 } },
        { key: 'B', label: 'Keep all staff on general supervision and respond to medical issues as they arise', desc: 'Treats every student as equally robust. The insulin-dependent or epileptic student cannot afford a delayed response.', effect: { score: -4 } },
        { key: 'C', label: 'Move high-needs students to the warmer, quieter space with a dedicated aide', desc: 'Reduces sensory load and cold for the most vulnerable and concentrates support, at the cost of one adult and a managed move.', effect: { score: 3 } },
        { key: 'D', label: 'Ask reliable senior students to buddy high-needs peers so staff stay on the wider group', desc: 'Stretches coverage but places medical and safeguarding responsibility on frightened minors. A support, not a substitute.', effect: { score: -2 } }
      ]
    },
    {
      time: 120, type: 'decision', tag: 'PRINCIPAL',
      title: 'False Message Across Language Groups',
      body: 'A Mandarin-language WeChat message is circulating among some families claiming the school has collapsed and ' +
        'children are trapped. It is false - but several international and migrant parents cannot read the official channels ' +
        'and are now terrified, and a couple are driving dangerously to reach the school.',
      decisionId: 'prin_misinformation',
      prompt: 'How do you correct the misinformation across language groups?',
      options: [
        { key: 'A', label: 'Have a trusted bilingual parent record a short truth message and post written notices in key languages at the gate', desc: 'Meets families where they are, in languages they trust, through people they trust. The fastest way to kill a rumour is an authentic voice inside the same network.', effect: { score: 5 } },
        { key: 'B', label: 'Make an English-only announcement and assume it filters through', desc: 'Leaves the exact families who are most frightened and least served by official channels still in the dark.', effect: { score: -3 } },
        { key: 'C', label: 'Ignore it - parents will see the school standing when they arrive', desc: 'Meanwhile they are driving dangerously on damaged roads to reach a "collapsed" school. The rumour causes harm before they arrive.', effect: { score: -4 } },
        { key: 'D', label: 'Ask a bilingual senior student to translate the correction while staff confirm the facts', desc: 'Workable and quick, but leans on a student for a high-stakes communication. Useful as a bridge, not the whole plan.', effect: { score: 2 } }
      ]
    },
    {
      time: 134, type: 'decision', tag: 'PRINCIPAL',
      title: 'Viral Rumour - "The Gym Has Collapsed"',
      body: 'A Year 11 student has posted "the gym has collapsed and hundreds are trapped." It is false - the gym is intact ' +
        'and was sheltering students - but it has thousands of views, parents are abandoning vehicles on blocked roads and ' +
        'running toward the school, and media helicopters have been dispatched.',
      decisionId: 'prin_viral_rumour',
      prompt: 'How do you respond to the viral collapse rumour?',
      options: [
        { key: 'A', label: 'Issue an immediate factual correction through every channel - school social media, students, a sign at the gate, and Police/media liaison', desc: 'Speed and reach are everything. Hitting every channel at once is the only way to outrun a rumour already going viral.', effect: { score: 5 } },
        { key: 'B', label: 'Ignore it - people will see the gym standing when they arrive', desc: 'Meanwhile they crash blocked roads to get there and gridlock the emergency vehicles. The rumour does real harm before anyone arrives.', effect: { score: -4 } },
        { key: 'C', label: 'Ask Police to find and stop the student who posted it', desc: 'Chases the source while the rumour keeps spreading and you miss the one thing that helps: the correction.', effect: { score: -3 } },
        { key: 'D', label: 'Post a correction only to the school page and assume it spreads', desc: 'Right instinct, too narrow. One channel cannot outrun a post already viewed thousands of times.', effect: { score: 1 } }
      ]
    },
    {
      time: 148, type: 'decision', tag: 'ETHICAL',
      title: 'Student Livestream of Injured Classmates',
      body: 'A student is livestreaming the response to thousands of viewers. The stream shows injured students, identifiable ' +
        'faces, staff discussions and your procedures. Separately, a Year 12 student has uploaded video of an injured ' +
        'classmate that is going viral. The families of those children have not yet been told.',
      decisionId: 'prin_student_privacy',
      prompt: 'How do you handle the livestream and the injured-classmate video?',
      options: [
        { key: 'A', label: 'Calmly ask students to stop filming injured peers and explain why, move the injured out of view, and escalate removal of the viral video via the platform/Police', desc: 'Protects the dignity and privacy of injured children, and gets their families informed before the public - without an unwinnable confiscation battle.', effect: { score: 5 } },
        { key: 'B', label: 'Confiscate the phones immediately', desc: 'Defensible on privacy, but escalates with frightened students, you cannot catch every device, and it raises evidence/footage questions.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore it and focus only on life safety', desc: 'Injured, identifiable children are broadcast to the world and their families blindsided. A clear safeguarding failure.', effect: { score: -4 } },
        { key: 'D', label: 'Speak directly into the livestream to control the message', desc: 'Well-meant, but it legitimises the stream and keeps injured children on camera while you talk.', effect: { score: -1 } }
      ]
    },
    {
      time: 162, type: 'decision', tag: 'PRINCIPAL',
      title: '18 Students Stranded',
      body: 'A garbled call gets through from a rural school bus driver: 18 students are stranded with him near a damaged ' +
        'bridge on a rural road out of town. The bus is intact and the students are with him, but the bridge approach has ' +
        'partly collapsed and the light will start to fade in a few hours.',
      decisionId: 'prin_rural_bus',
      prompt: 'What do you direct for the stranded bus group?',
      options: [
        { key: 'A', label: 'Keep them with the bus and driver; send a known local 4WD volunteer plus a staff member with a first-aid kit', desc: 'Shelter-in-place with the trusted adult they already have, while help comes to them by the safest available means.', effect: { score: 4 } },
        { key: 'B', label: 'Tell them to walk back across the damaged bridge to town', desc: 'Sends children on foot across a partly collapsed structure in failing light. The fastest line on a map is the most dangerous one here.', effect: { score: -6 } },
        { key: 'C', label: 'Keep them with the bus and wait for emergency services', desc: 'Safe in principle, but services may not come for hours and the children are getting cold with no plan and no contact.', effect: { score: 0 } },
        { key: 'D', label: 'Send two staff in a school van immediately, thinning the team at the assembly point', desc: 'Well-meant, but strips adults from 400 children to reach 18, possibly into the same blocked conditions.', effect: { score: -2 } }
      ]
    },
    {
      time: 176, type: 'decision', tag: 'PRINCIPAL',
      title: 'A Teacher Needs to Leave',
      body: 'A teacher quietly tells you their own child is at another school across town and they need to go now. Two other ' +
        'staff are checking their phones, clearly worried about their own families. If too many leave, student safety fails; ' +
        'if you force people to stay, morale and trust collapse. They are parents and community members too.',
      decisionId: 'prin_staff',
      prompt: 'How do you respond to the teacher who wants to leave?',
      options: [
        { key: 'A', label: 'Release them, and proactively organise word/welfare checks on all staff families to stop a cascade', desc: 'You cannot order someone to abandon their own child. Getting ahead of it is what keeps the others able to stay and focus.', effect: { score: 4 } },
        { key: 'B', label: 'Require them to stay until relief arrives', desc: 'A parent trapped at work while their own child is unaccounted for makes poor decisions and remembers it for years.', effect: { score: -3 } },
        { key: 'C', label: 'Release them but flag it as a staffing/HR matter for later', desc: 'Framing a parent’s fear for their child as an HR issue is the cold institutional response that corrodes trust.', effect: { score: -2 } },
        { key: 'D', label: 'Release them and immediately reassign duties so high-needs cover is maintained', desc: 'Honours the human need and patches the operational hole at once, without the proactive welfare-check that prevents the next departures.', effect: { score: 3 } }
      ]
    },
    {
      time: 190, type: 'decision', tag: 'PRINCIPAL',
      title: 'School as a Welfare Centre',
      body: 'Townspeople with nowhere warm to go are drifting toward the school, and a Civil Defence volunteer asks whether ' +
        'the gym can become a community welfare centre. The school is the obvious refuge - but it is full of other people’s ' +
        'children, and the public arriving includes adults nobody can vouch for.',
      decisionId: 'prin_shelter',
      prompt: 'How do you handle the school as a shelter?',
      options: [
        { key: 'A', label: 'Negotiate controlled use - gym as a screened welfare area with a separate supervised zone for students, one staffed entry', desc: 'Lets the school be the community asset it should be while keeping a hard line between unknown adults and children.', effect: { score: 5 } },
        { key: 'B', label: 'Open the school fully to everyone who needs shelter', desc: 'Generous and fast, but mixes traumatised students with unscreened adults and overwhelms your supervision and sanitation at once.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse all public access - students only', desc: 'Keeps the safeguarding line absolutely clean, but turns cold community members away from the obvious refuge and costs you goodwill.', effect: { score: -2 } },
        { key: 'D', label: 'Hand the gym to Civil Defence to run as a welfare centre while you hold students in a separate supervised block', desc: 'Delegates the welfare burden to the agency with the mandate, freeing you for students - if Civil Defence can staff it now.', effect: { score: 3 } }
      ]
    },
    {
      time: 204, type: 'decision', tag: 'ETHICAL',
      title: 'Request for Student Information',
      body: 'The Civil Defence welfare team asks you to hand over a list of medically vulnerable students and their home ' +
        'addresses, to help direct welfare support across the township. Privacy obligations are real - but so is the ' +
        'insulin-dependent child whose home medication may now be unreachable.',
      decisionId: 'prin_privacy',
      prompt: 'What student information do you share?',
      options: [
        { key: 'A', label: 'Share the minimum need-to-know for urgent welfare via a verified CD liaison, and log what you shared and why', desc: 'Lawful and humane. Narrow, deliberate, recorded sharing serves the child without dumping the whole register.', effect: { score: 5 } },
        { key: 'B', label: 'Refuse until a formal written data-sharing agreement is in place', desc: 'Process-correct in calm times, but here it can leave a vulnerable child unsupported while paperwork catches up.', effect: { score: -2 } },
        { key: 'C', label: 'Hand over the full student medical register and address list', desc: 'Over-discloses every family’s sensitive data to people and purposes you have not verified. Trust, once breached, does not return.', effect: { score: -4 } },
        { key: 'D', label: 'Share nothing - it is not the school’s role', desc: 'Treats privacy as absolute. A child could be harmed by the information you withheld when a narrow, verified disclosure was available.', effect: { score: -3 } }
      ]
    },
    {
      time: 218, type: 'cascade', tag: 'NIGHTFALL',
      title: 'Snow Confirmed - Nightfall Approaching',
      body: 'The overnight snow warning is confirmed and the temperature is dropping fast. Heating is still out, many students ' +
        'arrived wet from the evacuations, and blankets are limited. Rural students cannot get home before dark, the toilets ' +
        'may not flush, and water may be contaminated. The question shifts from "respond" to "survive the night safely".',
      source: 'MetService / Site Caretaker'
    },
    {
      time: 226, type: 'decision', tag: 'PRINCIPAL',
      title: 'Food',
      body: 'Stocktake of the canteen, staffroom, breakfast-club supplies, emergency water and leftover lunches comes to ' +
        'roughly one meal for everyone - not enough for overnight. Hungry, frightened children are hard to keep calm, but ' +
        'burning the whole supply now leaves nothing for the night ahead.',
      decisionId: 'prin_food',
      prompt: 'How do you use the limited food?',
      options: [
        { key: 'A', label: 'Register and ration now - small portions, youngest and high-needs first, hold a reserve', desc: 'Stretches a single meal across an uncertain night and protects the most vulnerable. Disciplined and fair.', effect: { score: 4 } },
        { key: 'B', label: 'Feed everyone fully now to calm them, and deal with later, later', desc: 'Buys calm for an hour and leaves you with nothing when the night gets long and cold.', effect: { score: -3 } },
        { key: 'C', label: 'Hold all food until you know whether students stay overnight', desc: 'Prudent on paper, but leaves hungry, anxious children unfed now, worsening behaviour and welfare.', effect: { score: -2 } },
        { key: 'D', label: 'Ration immediately, and send a verified resupply request to the EOC/community before dark', desc: 'Manages the supply you have and works the problem you cannot solve alone - getting more food moving while the light lasts.', effect: { score: 5 } }
      ]
    },
    {
      time: 240, type: 'decision', tag: 'PRINCIPAL',
      title: 'Overnight Arrangements',
      body: 'Rural students and some town students cannot safely get home tonight. Local families are kindly offering to take ' +
        'children in. Keeping everyone at school requires staffing, warmth and food you are short of; informal billeting with ' +
        'whoever offers creates real safeguarding risk. Either way, you are accountable for every child until handed to a ' +
        'verified caregiver.',
      decisionId: 'prin_overnight',
      prompt: 'What is your overnight plan for children who cannot get home?',
      options: [
        { key: 'A', label: 'Keep them in the warmest safe building with staffing, food and a written register; allow only vetted billeting with ID and sign-out', desc: 'Holds the duty-of-care line: known location, known adults, recorded handovers. Billeting is allowed but verified, not improvised.', effect: { score: 5 } },
        { key: 'B', label: 'Let local families take any children to reduce the numbers staying', desc: 'Eases your logistics by handing children to unchecked adults with no record of who went where. The classic disaster safeguarding failure.', effect: { score: -5 } },
        { key: 'C', label: 'Keep every child at school overnight, no exceptions', desc: 'Maximises oversight, but strains warmth, food and exhausted staff and may be unnecessary for low-risk verified handovers.', effect: { score: 1 } },
        { key: 'D', label: 'Release children to any family heading their direction to get them home', desc: 'Solves transport by abandoning verification entirely - children leaving with unconfirmed adults into the night and snow.', effect: { score: -4 } }
      ]
    },
    {
      time: 254, type: 'decision', tag: 'PRINCIPAL',
      title: 'Demand for a Helicopter',
      body: 'An international parent, frantic and unfamiliar with earthquakes, demands that their child be evacuated by ' +
        'helicopter immediately. There is no medical reason, the child is safe and warm, and rotary assets are reserved for ' +
        'life-threatening cases across a whole region in crisis. The parent is escalating in front of others.',
      decisionId: 'prin_helicopter',
      prompt: 'How do you respond to the helicopter demand?',
      options: [
        { key: 'A', label: 'Calmly explain prioritisation, reassure them their child is safe and warm, and stay with them a moment', desc: 'Acknowledges the fear, holds the line on scarce life-safety assets, and rebuilds trust through presence rather than confrontation.', effect: { score: 4 } },
        { key: 'B', label: 'Refuse bluntly and move on', desc: 'The decision is right but the delivery leaves a terrified parent humiliated and more distrustful, in front of an audience.', effect: { score: -1 } },
        { key: 'C', label: 'Escalate the request to the Civil Defence welfare team and keep the parent informed', desc: 'Routes the demand to the right authority and keeps the parent in the loop, at the cost of a little time and follow-up.', effect: { score: 3 } },
        { key: 'D', label: 'Promise to arrange it to calm them down, knowing you cannot', desc: 'Buys quiet for five minutes and detonates your credibility the moment the helicopter does not come.', effect: { score: -4 } }
      ]
    },
    {
      time: 268, type: 'info', tag: 'HANDOVER',
      title: 'The Night Holds - The Hardest Lesson',
      body: 'By evening the picture stabilises: every student is accounted for through the quake, the tsunami evacuation and ' +
        'the aftershocks; reunifications are recorded; high-needs students are supported; misinformation has been answered; ' +
        'and those who must stay are warm, fed and supervised in one safe building. Civil Defence now runs the community ' +
        'welfare function alongside you. The hardest lesson stands: you could not solve the whole emergency. Success was ' +
        'balancing life safety, child protection, communication, accountability and public trust under intense pressure with ' +
        'incomplete information - and the hardest problems were not operational, they were human.',
      source: 'School Command / Civil Defence'
    }
  ];

})();
