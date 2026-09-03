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
    // No status bar: every item restated a panel row, and the strip is never
    // re-rendered, so it went stale as soon as a consequence moved the panel.
    statusBar: [],
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
        { label: 'Water', value: 'Untested', cls: 'unknown' },
        { label: 'Cell Network', value: 'Congested', cls: 'degraded' },
        { label: 'Toilets', value: 'At Risk', cls: 'degraded' }
      ],
      transportTitle: 'Buildings & Access',
      transport: [
        { label: 'Main Teaching Block', value: 'Damaged', cls: 'degraded' },
        { label: 'School Hall', value: 'Moderate Damage', cls: 'degraded' },
        { label: 'Gymnasium', value: 'Usable', cls: 'good' },
        { label: 'Rural Roads', value: 'Cut Off', cls: 'failed' }
      ],
      cascadeTitle: 'Emerging Risks',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '🌊', name: 'Tsunami Threat', level: 'Watch', cls: 'high' },
        { icon: '📱', name: 'Misinformation', level: 'High', cls: 'high' },
        { icon: '👥', name: 'Crowd Pressure', level: 'Moderate', cls: 'moderate' },
        { icon: '❄️', name: 'Overnight Snow', level: 'High', cls: 'high' },
        { icon: '🚽', name: 'Sanitation / Gastro', level: 'Moderate', cls: 'moderate' }
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
    'prin_overnight': { 'A': { warmth: -5 }, 'C': { warmth: -10, food: -5 } },
    'prin_international': { 'A': { food: -5, warmth: -5 } },
    'prin_language': { 'A': { comms: 15 }, 'B': { comms: -5 }, 'C': { comms: -10 }, 'D': { comms: -10 } },
    'prin_identification': { 'A': { comms: -5 } },
    'prin_unknown_adults': { 'A': { comms: -5 }, 'D': { food: -5, warmth: -5 } },
    'prin_sanitation': { 'A': { sanitation: 15, water: -10 }, 'B': { sanitation: -30 }, 'C': { sanitation: -20 }, 'D': { sanitation: -25 } }
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
    },
    'prin_international': {
      'A': { safeguarding: 9, inclusion: 6, parentTrust: 4 },
      'B': { safeguarding: -10, studentSafety: -6 },
      'C': { inclusion: -7, safeguarding: -5 },
      'D': { inclusion: -5, parentTrust: -3 }
    },
    'prin_language': {
      'A': { inclusion: 10, comms: 7, parentTrust: 5 },
      'B': { inclusion: -7, comms: -4 },
      'C': { comms: -5, inclusion: -3 },
      'D': { inclusion: -8, parentTrust: -4 }
    },
    'prin_identification': {
      'A': { safeguarding: 12, studentSafety: 7, parentTrust: 3 },
      'B': { safeguarding: -16, studentSafety: -10 },
      'C': { safeguarding: -9, studentSafety: -5 },
      'D': { safeguarding: -12, studentSafety: -7 }
    },
    'prin_unknown_adults': {
      'A': { safeguarding: 11, studentSafety: 6, staffCapacity: 3 },
      'B': { safeguarding: -14, studentSafety: -8 },
      'C': { safeguarding: -11, studentSafety: -6 },
      'D': { staffCapacity: -5, inclusion: -3 }
    },
    'prin_sanitation': {
      'A': { studentSafety: 9, staffCapacity: -3, parentTrust: 4 },
      'B': { studentSafety: -12, parentTrust: -6 },
      'C': { safeguarding: -10, studentSafety: -7 },
      'D': { studentSafety: -8, parentTrust: -4 }
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
    'prin_helicopter': { 'A': { decisive: 1, communityTrust: 1, lifeSafety: 1 }, 'B': { decisive: 1, communityTrust: -1 }, 'C': { centralized: 1, communityTrust: 1 }, 'D': { decisive: 1, communityTrust: 1 } },
    'prin_international': { 'A': { decisive: 1, lifeSafety: 2, centralized: 2 }, 'B': { decisive: 1, lifeSafety: -2, centralized: -2 }, 'C': { decisive: -1, centralized: -1 }, 'D': { decisive: -2 } },
    'prin_language': { 'A': { decisive: 1, communityTrust: 2, centralized: 1 }, 'B': { decisive: 1, centralized: 1, communityTrust: -1 }, 'C': { decisive: 1, communityTrust: -1 }, 'D': { decisive: -2, communityTrust: -1 } },
    'prin_identification': { 'A': { decisive: 2, lifeSafety: 2, centralized: 2 }, 'B': { decisive: 1, lifeSafety: -2, centralized: -2 }, 'C': { decisive: -1, lifeSafety: -2 }, 'D': { decisive: -2, lifeSafety: -2 } },
    'prin_unknown_adults': { 'A': { decisive: 1, lifeSafety: 2, centralized: 2 }, 'B': { decisive: 1, lifeSafety: -2, communityTrust: 1 }, 'C': { decisive: -1, lifeSafety: -2, centralized: -2 }, 'D': { decisive: 1, centralized: 2, communityTrust: -2 } },
    'prin_sanitation': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: 1, lifeSafety: -2 }, 'D': { decisive: -2, centralized: 1 } }
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
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Tsunami Threat', 'Extreme', 'extreme');
          updatePanelItem('agency-status', 'Civil Defence EOC', 'Escalating', 'failed');
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
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Crowd Pressure', 'Extreme', 'extreme');
          updatePanelItem('agency-status', 'NZ Police', 'Requested', 'failed');
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
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Misinformation', 'Extreme', 'extreme');
          updatePanelItem('agency-status', 'Media', 'Amplifying', 'failed');
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
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Injured (serious)', '3', 'failed');
          updatePanelItem('transport-section', 'Rural Roads', 'Rescue Underway', 'failed');
        }
      }
    },
    'prin_international': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Two Students Sent to Red-Stickered Homes',
          body: 'Two international students were released to host addresses in the worst-hit street and found the houses ' +
            'unsafe and empty. They walked back in the dark. Their overseas guardians learned all of this from the students ' +
            'themselves, and the Code of Practice review will ask who checked the host families before release.',
          source: 'Min. of Education / Host Families',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Min. of Education', 'Code Review', 'failed');
          updatePanelItem('cdem-groups', 'Unaccounted', '8', 'failed');
        }
      }
    },
    'prin_language': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Families Who Heard Nothing',
          body: 'Nine families never received a message they could read. Six of them drove to the school through a cordon ' +
            'because a neighbour told them the building had collapsed, and three others are still ringing a number nobody ' +
            'is answering. The rumour reached them; you did not.',
          source: 'Front Gate / Community',
          scorePenalty: -5
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Misinformation', 'Extreme', 'extreme');
          updateCascadeItem('cascade-tracker', 'Crowd Pressure', 'High', 'high');
          updateUtilityDirect('comms', 10);
        }
      }
    },
    'prin_identification': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Child Should Not Have Left',
          body: 'The man was the subject of the protection order. The child left the site with him at ten past four. Police ' +
            'located them ninety minutes later and she is unharmed, and every part of what happens next - the review, the ' +
            'mother, the Ministry - turns on the fact that the order was on her file and the deputy said so.',
          source: 'NZ Police / Oranga Tamariki',
          scorePenalty: -9
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'NZ Police', 'Investigating', 'failed');
          updatePanelItem('agency-status', 'Min. of Education', 'Serious Incident', 'failed');
          updatePanelItem('cdem-groups', 'Unaccounted', '7', 'failed');
        }
      }
    },
    'prin_unknown_adults': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Nobody Knows Who Was in the Gym',
          body: 'Unscreened adults were among 380 children for three hours with no log and no identification. Two students ' +
            'have described a man who spoke to them at length and nobody can say who he was. There is no visitor record to ' +
            'work from, and that absence is now the finding.',
          source: 'NZ Police / Safeguarding',
          scorePenalty: -8
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Crowd Pressure', 'Extreme', 'extreme');
          updatePanelItem('agency-status', 'NZ Police', 'On Site', 'failed');
          updatePanelItem('agency-status', 'Min. of Education', 'Serious Incident', 'failed');
        }
      }
    },
    'prin_sanitation': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Gastro Through the Gymnasium',
          body: 'By two in the morning nineteen students and four staff are vomiting in a single unventilated room with no ' +
            'running water. The toilets that were kept open are the source, there is no way to isolate anyone, and Public ' +
            'Health is asking why hand hygiene was not put in place when the water pressure went.',
          source: 'Public Health / Gymnasium',
          scorePenalty: -8
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Sanitation / Gastro', 'Extreme', 'extreme');
          updatePanelItem('lifelines-section', 'Toilets', 'Contaminated', 'failed');
          updatePanelItem('cdem-groups', 'Injured (minor)', '28', 'failed');
          updateUtilityDirect('sanitation', 0);
        }
      }
    },
    'prin_overnight': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Children Released With No Record',
          body: 'Children left with whichever families were heading their way, and there is no register of who went with ' +
            'whom. Four parents arrived at eight to collect children who had already gone somewhere nobody wrote down, and ' +
            'it took Police until after midnight to account for all of them.',
          source: 'NZ Police / Parents',
          scorePenalty: -8
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Reunified', 'Unverified', 'failed');
          updatePanelItem('agency-status', 'NZ Police', 'Tracing Children', 'failed');
          updateCascadeItem('cascade-tracker', 'Crowd Pressure', 'High', 'high');
        }
      }
    },
    'prin_staff': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Staff Room Empties Anyway',
          body: 'Requiring the teacher to stay while her own child was unaccounted for did not keep her working - it kept ' +
            'her in the staff room on the phone, and it told every other staff member with a child out there exactly where ' +
            'they stand. Three more have since left without asking.',
          source: 'Staff',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Staff On Site', '19 / 26', 'failed');
          updateUtilityDirect('comms', 15);
        }
      }
    },
    'prin_medical': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'A Seizure Nobody Was Watching For',
          body: 'With no named adult assigned to high-needs students, the student with epilepsy seized in a corner of the ' +
            'gymnasium and was found by another child. He is stable. The insulin-dependent student has not eaten since ' +
            'breakfast and nobody has been tracking that either.',
          source: 'Gymnasium / St John',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Injured (serious)', '3', 'failed');
          updatePanelItem('agency-status', 'St John', 'Still Delayed', 'failed');
        }
      }
    },
    'prin_misinformation': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Wrong Story Sets',
          body: 'Left uncorrected, the claim that students were injured in a collapsed classroom has been picked up by a ' +
            'regional news site and is now the accepted account. Parents are arriving in numbers the gate cannot hold, and ' +
            'every accurate message you send after this reads as a school managing its reputation.',
          source: 'Media / Front Gate',
          scorePenalty: -6
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Misinformation', 'Extreme', 'extreme');
          updatePanelItem('agency-status', 'Media', 'Running It', 'failed');
          updateCascadeItem('cascade-tracker', 'Crowd Pressure', 'High', 'high');
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
    },
    'prin_international': {
      learningObjective: 'Recognise that pastoral responsibility for international students sits with the school, and act on it immediately.',
      bestPractice: 'A',
      teachingNote: 'Eleven students whose legal guardians are overseas and asleep, with host families in the worst-hit ' +
        'street, cannot be handled as ordinary day students. Holding them under supervision, verifying each host family ' +
        'before release, and starting guardian notification now is what the Code of Practice requires and what common sense ' +
        'demands. Releasing them "as normal" ignores that two host homes are damaged and three families unreachable; ' +
        'waiting for guardians to make contact leaves eleven students in limbo overnight.',
      references: [
        { label: 'Code of Practice for pastoral care', desc: 'schools carry pastoral responsibility for international students' },
        { label: 'Guardian notification', desc: 'time-zone differences mean the school initiates contact, not the guardian' }
      ],
      discussionPrompts: [
        'What does "verifying a host family" actually involve when phones are congested?',
        'Who at your school knows the Code of Practice obligations well enough to act on them today?'
      ]
    },
    'prin_language': {
      learningObjective: 'Reach every family, not just the ones your default channel happens to serve.',
      bestPractice: 'A',
      teachingNote: 'One message, in English, by text and app, reaches the families who were always easiest to reach. ' +
        'Seasonal-worker households, recent migrants and host families need the same information in a language they read ' +
        'and through a channel they have. Bilingual staff, community leaders, word of mouth and a physical noticeboard at ' +
        'the gate cost almost nothing. Resending in English more often solves nothing; unchecked machine translation of ' +
        'safety-critical information about children is how reassurance becomes alarm.',
      references: [
        { label: 'Inclusive crisis communication', desc: 'language and channel are separate barriers and both must be addressed' },
        { label: 'Trusted messengers', desc: 'community leaders reach households the school roll cannot' }
      ],
      discussionPrompts: [
        'Which languages does your community actually need, and who on staff could translate today?',
        'What reaches a family with no power, no data and no English?'
      ]
    },
    'prin_reunification': {
      learningObjective: 'Run a single controlled reunification process rather than releasing children ad hoc.',
      bestPractice: 'A',
      teachingNote: 'Reunification is the highest-risk part of the day because it is where children leave your supervision. ' +
        'One controlled point, one queue, verification against emergency contacts, and a written record of every release is ' +
        'slower than letting parents collect from classrooms and it is the only version that ends with every child ' +
        'accounted for. Ad hoc release feels compassionate in the moment and produces the child nobody can locate at seven ' +
        'o’clock.',
      references: [
        { label: 'Reunification procedure', desc: 'single controlled point, verified release, written record' },
        { label: 'Roll integrity', desc: 'every uncontrolled release degrades the roll you are trying to close' }
      ],
      discussionPrompts: [
        'Where is your reunification point, and does every staff member know it without being told?',
        'What is the minimum you record for each release?'
      ]
    },
    'prin_tsunami_info': {
      learningObjective: 'Communicate a life-safety instruction clearly to students, staff and parents at the same time.',
      bestPractice: 'A',
      teachingNote: 'During a tsunami response the information problem is as urgent as the movement problem. Parents ' +
        'converging on a school that is evacuating uphill create exactly the traffic that blocks the route. One clear ' +
        'message - where the school is going, that students are with staff, and not to come to the school - has to go out ' +
        'at the same moment the movement starts, not after it.',
      references: [
        { label: 'Concurrent messaging', desc: 'the instruction to parents goes out with the evacuation, not after it' },
        { label: 'Do not converge', desc: 'parents driving to an evacuating school block the route for everyone' }
      ],
      discussionPrompts: [
        'What is the one sentence parents most need in that message?',
        'Who sends it while you are moving 380 students uphill?'
      ]
    },
    'prin_identification': {
      learningObjective: 'Apply safeguarding rules hardest under pressure - no verification, no release, and no information either.',
      bestPractice: 'A',
      teachingNote: 'This is the decision with the most serious possible consequence in the whole scenario. A man with no ' +
        'identification, not on the contact list, agitated, and a protection order on the child’s file. The safe answer is ' +
        'no release, no confirmation that she is even present, the conversation moved away from the gate and the crowd, and ' +
        'Police involved immediately. Knowing a child’s details is not authorisation. Confirming her presence is itself a ' +
        'breach. Asking the child to choose puts a nine-year-old in front of the person the order exists to protect her ' +
        'from.',
      references: [
        { label: 'Protection orders', desc: 'the school does not confirm presence or release to a person subject to an order' },
        { label: 'Verification under pressure', desc: 'a growing queue is not a reason to lower the verification standard' }
      ],
      discussionPrompts: [
        'How would you know about a protection order if the office system is down?',
        'What do you actually say to him, and where do you say it?'
      ]
    },
    'prin_medical': {
      learningObjective: 'Assign named adults to high-needs students rather than assuming general supervision covers them.',
      bestPractice: 'A',
      teachingNote: 'An insulin-dependent student, a student with epilepsy, a wheelchair user whose accessible routes are ' +
        'blocked and students with autism in a loud, crowded, unfamiliar room all have needs that general supervision will ' +
        'not meet. Naming a specific adult to each, with the medication and equipment they need identified, is the control. ' +
        '"Everyone keep an eye out" means the seizure is found by another child.',
      references: [
        { label: 'Individual support plans', desc: 'high-needs students need a named adult, not general supervision' },
        { label: 'Accessible egress', desc: 'evacuation routes that are inaccessible to a wheelchair user are not evacuation routes' }
      ],
      discussionPrompts: [
        'Who are your high-needs students, and does a relieving teacher know?',
        'Where is their medication, and can you reach it if the block is off limits?'
      ]
    },
    'prin_misinformation': {
      learningObjective: 'Correct a damaging false claim fast, in the channel where it is spreading.',
      bestPractice: 'A',
      teachingNote: 'A false claim about injured children in a collapsed classroom will outrun anything you do unless you ' +
        'respond quickly, factually, and in the same channel. Silence lets it become the accepted account and brings ' +
        'frightened parents to a gate that cannot hold them. The correction has to be specific - what is actually true - ' +
        'rather than a general appeal not to spread rumours.',
      references: [
        { label: 'Rumour correction', desc: 'speed, specificity and same-channel response; general denials do not displace a story' },
        { label: 'Crowd consequences', desc: 'misinformation converts directly into gate pressure and blocked access' }
      ],
      discussionPrompts: [
        'What is the specific true statement that displaces this rumour?',
        'Which channel is it actually spreading in, and are you on it?'
      ]
    },
    'prin_unknown_adults': {
      learningObjective: 'Convert willing volunteers into safe help through one entry point, a visitor log and visible identification.',
      bestPractice: 'A',
      teachingNote: 'You are desperately short of adults and unscreened adults among 380 frightened children is the ' +
        'safeguarding failure that defines the day. One staffed entry point, a written visitor log, visible identification ' +
        'and a standing rule that no unaccompanied adult is in a student area keeps the help and removes the risk. ' +
        '"Staff will keep an eye out" fails because exhausted staff cannot run an informal vetting system and everyone ' +
        'assumes someone else checked. Turning everyone away holds the line and costs you adults you need.',
      references: [
        { label: 'Visitor control', desc: 'single entry, log, identification, no unaccompanied adults in student areas' },
        { label: 'Safeguarding under surge', desc: 'the controls matter most exactly when you are least able to run them' }
      ],
      discussionPrompts: [
        'Who staffs the entry point when you are already short of adults?',
        'What does the visitor log need to capture to be worth anything afterwards?'
      ]
    },
    'prin_rural_bus': {
      learningObjective: 'Keep an isolated group sheltering in place rather than moving them across a damaged structure.',
      bestPractice: 'A',
      teachingNote: 'Eighteen students stranded near a damaged bridge are safest where they are, with the driver, while a ' +
        'proper recovery is organised. Instructing them to walk back across a damaged bridge moves children onto an ' +
        'unstable structure in worsening weather to solve your problem rather than theirs. Shelter in place, maintain ' +
        'contact, and get a 4WD recovery organised through Civil Defence.',
      references: [
        { label: 'Shelter in place', desc: 'moving a group across a compromised structure is rarely the lower risk' },
        { label: 'Remote group management', desc: 'maintain contact and a named responsible adult with the group' }
      ],
      discussionPrompts: [
        'What does the driver need from you in the next five minutes?',
        'How do you keep 18 sets of parents informed about a group you cannot reach?'
      ]
    },
    'prin_staff': {
      learningObjective: 'Release a staff member to their own child while preventing a staffing cascade.',
      bestPractice: 'A',
      teachingNote: 'You cannot order a parent to stay at work while their own child is unaccounted for, and trying to ' +
        'produces neither work nor loyalty - it keeps them in the staff room on the phone and tells every other staff ' +
        'parent where they stand. Release them, and at the same time proactively organise word and welfare checks on all ' +
        'staff families so the same fear does not empty your site one teacher at a time. Framing it as an HR matter is the ' +
        'worst available version.',
      references: [
        { label: 'Staff as parents', desc: 'staff with unaccounted children are not a workforce you can retain by instruction' },
        { label: 'Preventing cascade', desc: 'proactive welfare checks for all staff families pre-empt sequential departures' }
      ],
      discussionPrompts: [
        'How do you find out which staff have children unaccounted for, before they ask?',
        'What cover do you put in place before releasing someone with high-needs duties?'
      ]
    },
    'prin_sanitation': {
      learningObjective: 'Treat a sanitation failure with 300 people on site as an urgent public-health problem, not a facilities one.',
      bestPractice: 'A',
      teachingNote: 'Backed-up toilets, no handwashing, one unventilated room and meals being served is a gastro outbreak ' +
        'with a start time - and two students are already unwell. Closing the affected toilets, standing up a supervised ' +
        'alternative with separate arrangements for staff and students, getting sanitiser to every entry, and escalating ' +
        'for portable units tonight addresses it. Sending 380 children to an unlit treeline is a safeguarding failure as ' +
        'well as a public-health one; waiting for Civil Defence leaves the problem running for hours.',
      references: [
        { label: 'Sanitation in mass shelter', desc: 'hand hygiene is the single highest-value control when water fails' },
        { label: 'Dignity and supervision', desc: 'alternative arrangements must be supervised, lit and age-appropriate' }
      ],
      discussionPrompts: [
        'What do you have on site right now that provides hand hygiene without running water?',
        'How do you supervise alternative toileting for 380 children after dark?'
      ]
    },
    'prin_food': {
      learningObjective: 'Ration limited food by need across an uncertain night, with a register and a reserve.',
      bestPractice: 'A',
      teachingNote: 'One meal’s worth of food and an unknown number of hours means small portions, youngest and high-needs ' +
        'students first, a register of who has eaten, and a held reserve. The failure modes are serving everything at once ' +
        'because people are hungry now, and treating equal portions as fair when a diabetic student needs food on a ' +
        'schedule.',
      references: [
        { label: 'Rationing under uncertainty', desc: 'hold a reserve when you do not know how long the event runs' },
        { label: 'Need-based distribution', desc: 'clinical need and age take priority over equal shares' }
      ],
      discussionPrompts: [
        'How long do you plan the food to last, and on what basis?',
        'Who tracks that the high-needs students have actually eaten?'
      ]
    },
    'prin_overnight': {
      learningObjective: 'Keep students in supervised, recorded custody overnight, allowing only vetted and documented billeting.',
      bestPractice: 'A',
      teachingNote: 'The warmest safe building, staffed, with food and a written register is the baseline. Billeting is ' +
        'acceptable only with identification, parental agreement and a record. Letting local families take children to ' +
        'reduce your numbers hands children to unvetted adults; releasing them to any family heading their direction ' +
        'abandons verification entirely and produces a night of Police tracing children whose whereabouts nobody wrote ' +
        'down.',
      references: [
        { label: 'Overnight custody', desc: 'supervision, warmth, food and a written register are the minimum' },
        { label: 'Vetted billeting', desc: 'identification plus parental agreement plus a record, or it does not happen' }
      ],
      discussionPrompts: [
        'What does a billeting record need to contain?',
        'Who is awake and watching at three in the morning, and who relieves them?'
      ]
    },
    'prin_helicopter': {
      learningObjective: 'Hold a scarce life-safety asset against an emotional demand, without dismissing the parent making it.',
      bestPractice: 'A',
      teachingNote: 'A parent demanding helicopter evacuation for their child is frightened, not unreasonable, and the ' +
        'answer is still no while the aircraft is committed to medical priorities. Explaining the prioritisation calmly, ' +
        'confirming their child is safe and warm, and staying with them a moment holds the line and rebuilds trust. ' +
        'Dismissing them or promising something you cannot deliver both cost you more than the conversation would have.',
      references: [
        { label: 'Scarce asset prioritisation', desc: 'medical need determines aeromedical tasking, not parental pressure' },
        { label: 'Presence as reassurance', desc: 'staying with a frightened parent does more than any explanation alone' }
      ],
      discussionPrompts: [
        'What do you say to a parent whose fear is entirely reasonable and whose request you must refuse?',
        'How do you avoid this becoming the story the whole gate hears?'
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
    },
    {
      tag: 'NOISE', title: 'A Teacher Posts a Photo of the Students',
      body: 'A well-meaning teacher has posted a photo of her class sitting safely on the field, captioned "all safe", to '
        + 'reassure parents. Several students are clearly identifiable.',
      source: 'Staff',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Ask her to take it down, explain why identifiable images of students go out only through the school channel, and get an official reassurance message out instead', desc: 'The instinct is right and the channel is wrong. An official message does the same job without publishing children.', effect: { score: 2 } },
        { key: 'B', label: 'Leave it - parents are desperate for reassurance', desc: 'Identifiable images of students, including any subject to a protection order, published outside your control.', effect: { score: -3 } },
        { key: 'C', label: 'Reprimand her in front of the staff group', desc: 'Right call, wrong delivery, to an exhausted teacher who was trying to help.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Student Will Not Leave the Toilet Block',
      body: 'A Year 9 student has locked herself in a toilet cubicle and will not come out or speak to anyone. The block is '
        + 'one of the buildings flagged for a structural check.',
      source: 'Deputy Principal',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Send the staff member she trusts most, talk to her through the door without a crowd, and treat it as distress rather than defiance', desc: 'A frightened child in an unchecked building needs one calm familiar adult, not an audience or an instruction.', effect: { score: 2 } },
        { key: 'B', label: 'Leave her - she will come out when she is ready', desc: 'She is alone in a building flagged for structural checks while aftershocks continue.', effect: { score: -3 } },
        { key: 'C', label: 'Have the caretaker force the door', desc: 'Turns a distressed student into a spectacle and a confrontation, in front of everyone.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Parent Offers to Take "A Few Extra Kids"',
      body: 'A parent collecting her son offers to take three of his friends home too, so they are not stuck at school. She '
        + 'is a familiar face and she means it kindly.',
      source: 'Reunification Point',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Thank her, and release the other three only once you have reached each of their parents and recorded the agreement', desc: 'A good offer, and it becomes safe only with parental agreement and a written record of who went where.', effect: { score: 2 } },
        { key: 'B', label: 'Let her take them - it is three fewer children to shelter', desc: 'Three children released without their parents knowing, to an address you have not recorded.', effect: { score: -3 } },
        { key: 'C', label: 'Refuse outright without explaining', desc: 'The offer is genuinely useful once verified, and a flat refusal turns a helpful parent into an angry one.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'The Board Chair Wants a Statement',
      body: 'Your Board Chair is on the phone wanting to approve any public statement before it goes out, and wants a written '
        + 'briefing on the school\u2019s liability position tonight.',
      source: 'Board Chair',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Agree a short verbal update now, tell him operational messages go out without pre-approval while students are still on site, and offer a written brief tomorrow', desc: 'Keeps governance informed without inserting an approval step between you and 420 families tonight.', effect: { score: 2 } },
        { key: 'B', label: 'Route every message through him for approval', desc: 'Adds a delay to time-critical safety messaging while children are still unaccounted for.', effect: { score: -2 } },
        { key: 'C', label: 'Tell him you have no time for governance tonight', desc: 'You will need the Board behind you for weeks; two minutes now buys that.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Someone Has Started a Fundraiser',
      body: 'A parent has set up an online fundraiser using the school\u2019s name and crest, with donations going to an account '
        + 'the school does not control.',
      source: 'Community',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Thank them privately, ask them to remove the school name and crest, and point any genuine donations to the official Civil Defence or school channel', desc: 'Well-intentioned, and the school cannot vouch for funds it does not control or a use of its name it did not approve.', effect: { score: 2 } },
        { key: 'B', label: 'Leave it - the community wants to help', desc: 'The school\u2019s name is on an account it cannot see, and the school will own whatever happens to that money.', effect: { score: -2 } },
        { key: 'C', label: 'Publicly denounce it', desc: 'A public denunciation of a parent trying to help costs far more goodwill than a private ask would.', effect: { score: -2 } }
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
      time: 20, type: 'decision', tag: 'PRINCIPAL',
      title: 'The International Students',
      body: 'Eleven international students live with local host families. Two of those homes are in the worst-hit street, ' +
        'three host families cannot be reached, and every one of these students has a legal guardian overseas in a ' +
        'different time zone. Under the Code of Practice, pastoral responsibility for them sits with the school.',
      decisionId: 'prin_international',
      prompt: 'How do you handle the international students?',
      options: [
        { key: 'A', label: 'Hold all eleven at school under supervision, verify each host family before releasing anyone, and start notifying overseas guardians and your Code of Practice contact now', desc: 'The school carries pastoral responsibility for them. Verifying hosts before release, and notifying guardians early, is exactly what that means.', effect: { score: 5 } },
        { key: 'B', label: 'Release them to their host families as they would go on a normal day', desc: 'Two host homes are in the worst-hit street and three families are unreachable. "As normal" is not available today.', effect: { score: -5 } },
        { key: 'C', label: 'Treat them like any other student and deal with it at reunification', desc: 'Their guardians are overseas and cannot come to a reunification point; they need a different process, started now.', effect: { score: -4 } },
        { key: 'D', label: 'Wait until the overseas guardians make contact before doing anything', desc: 'It is the middle of the night where most of them are. Waiting to be contacted leaves eleven students in limbo for hours.', effect: { score: -3 } }
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
      time: 34, type: 'decision', tag: 'PRINCIPAL',
      title: 'Families Who Cannot Read Your Message',
      body: 'Your first parent message has gone out in English by text and on the school app. A significant number of your ' +
        'families - seasonal worker households, recent migrants, host families of international students - either do not ' +
        'read English easily or have no data. Some are already at the gate having understood none of it.',
      decisionId: 'prin_language',
      prompt: 'How do you reach every family?',
      options: [
        { key: 'A', label: 'Get the same message out in the community’s main languages using your own bilingual staff and community leaders, and use word of mouth and a physical noticeboard at the gate for families with no data', desc: 'One message in one language reaches some of your community. The channel matters as much as the words for the families who most need it.', effect: { score: 5 } },
        { key: 'B', label: 'Resend the English message more often and more clearly', desc: 'Volume does not solve comprehension, and it does nothing at all for families with no data.', effect: { score: -4 } },
        { key: 'C', label: 'Use an automatic translation tool and send it unchecked', desc: 'An unchecked machine translation of safety-critical information about children is how a reassurance becomes an alarm.', effect: { score: -3 } },
        { key: 'D', label: 'Rely on those families hearing it from other parents', desc: 'The families with the least connection to the school network are precisely the ones the grapevine misses.', effect: { score: -4 } }
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
      time: 74, type: 'inject', tag: 'SITUATION',
      title: 'The Gymnasium Fills',
      body: 'With the teaching block off limits and the hall damaged, 380 students, 24 staff and a growing number of adults ' +
        'are now in the gymnasium. It is the only usable building on site, the heating is off, and it is the same room ' +
        'Civil Defence has begun asking about for community shelter.',
      source: 'Site'
    },
    {
      time: 76, type: 'decision', tag: 'ETHICAL',
      title: 'The Adult With No Identification',
      body: 'A man at the gate says he is here for a Year 4 student. He has no identification, he is not on her emergency ' +
        'contact list, and he is agitated and insistent. Your office system is down, but your deputy remembers there is a ' +
        'protection order on that child’s file.',
      decisionId: 'prin_identification',
      prompt: 'How do you handle him?',
      options: [
        { key: 'A', label: 'Do not release the child, do not confirm she is even here, move the conversation away from the gate, and get Police to it immediately', desc: 'A protection order means the safest answer is no release and no information, delivered calmly and away from the crowd, with Police involved.', effect: { score: 5 } },
        { key: 'B', label: 'Release her - he knows her name and details and the queue behind him is growing', desc: 'Knowing a child’s details is not authorisation, and a protection order exists precisely for this moment.', effect: { score: -8 } },
        { key: 'C', label: 'Tell him she is here but he cannot take her, and let him wait at the gate', desc: 'Confirming her presence to a person subject to a protection order is itself a safeguarding failure, and leaving him at the gate keeps the risk on site.', effect: { score: -5 } },
        { key: 'D', label: 'Ask the child whether she wants to go with him', desc: 'Puts a nine-year-old in the position of making a protection decision, in front of the adult concerned.', effect: { score: -7 } }
      ]
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
      time: 114, type: 'inject', tag: 'ROLL',
      title: 'The Unaccounted List Shortens - and Sticks',
      body: 'Steady work on the roll has traced most of the missing: absent that morning, collected early, or found in ' +
        'another muster group. Six names are left. Two were seen walking toward the river track at lunchtime, one is a ' +
        'rural bus student, and three have no confirmed sighting since the bell.',
      source: 'Deputy Principal / Roll'
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
      time: 142, type: 'decision', tag: 'ETHICAL',
      title: 'Volunteers Are Arriving',
      body: 'Community members are turning up wanting to help: two are parents you know, four are not. One has already ' +
        'walked through the gymnasium handing out water to students. Nobody has been checked, nobody is wearing anything ' +
        'identifying, and your staff cannot tell a volunteer from a parent from a stranger.',
      decisionId: 'prin_unknown_adults',
      prompt: 'How do you manage adults on site?',
      options: [
        { key: 'A', label: 'One staffed entry point, a written visitor log, visible identification for anyone approved, and a standing rule that no unaccompanied adult is in a student area', desc: 'Turns willing help into safe help. The visitor log and the no-unaccompanied-adult rule are the whole of the safeguarding control.', effect: { score: 5 } },
        { key: 'B', label: 'Accept the help - you are desperately short of adults and these are locals', desc: 'Unscreened adults moving freely among 380 frightened children is the safeguarding failure the day will be remembered for.', effect: { score: -7 } },
        { key: 'C', label: 'Let volunteers move freely but ask staff to keep an eye out', desc: 'Exhausted staff managing 380 students cannot also run an informal vetting system, and everyone will assume someone else checked.', effect: { score: -6 } },
        { key: 'D', label: 'Turn all volunteers away', desc: 'Safeguarding holds, and you lose badly needed adults when a controlled entry process was available.', effect: { score: -2 } }
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
      time: 184, type: 'inject', tag: 'WEATHER',
      title: 'Snow Brought Forward',
      body: 'MetService moves the snow warning forward by four hours. The gymnasium has no heating, a third of your students ' +
        'are in summer uniform, and the rural roads that were going to reopen this evening will not. Whoever is on site at ' +
        'six o’clock is on site for the night.',
      source: 'MetService / Civil Defence EOC'
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
        { key: 'A', label: 'Negotiate controlled use - gym as a screened welfare area with a separate supervised zone for students, one staffed entry', desc: 'Lets the school be the community asset it should be while keeping a hard line between unknown adults and children.', effect: { score: 5 },
          locked: function (log) {
            return log['prin_unknown_adults'] === 'C' ? 'Unscreened adults have been moving through the site for an hour - there is no controlled perimeter left to negotiate from' : false;
          } },
        { key: 'B', label: 'Open the school fully to everyone who needs shelter', desc: 'Generous and fast, but mixes traumatised students with unscreened adults and overwhelms your supervision and sanitation at once.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse all public access - students only', desc: 'Keeps the safeguarding line absolutely clean, but turns cold community members away from the obvious refuge and costs you goodwill.', effect: { score: -2 } },
        { key: 'D', label: 'Hand the gym to Civil Defence to run as a welfare centre while you hold students in a separate supervised block', desc: 'Delegates the welfare burden to the agency with the mandate, freeing you for students - if Civil Defence can staff it now.', effect: { score: 3 } }
      ]
    },
    {
      time: 198, type: 'decision', tag: 'PRINCIPAL',
      title: 'The Toilets Fail',
      body: 'Water pressure has gone and the wastewater line under the quad is broken. The student toilets are backing up and ' +
        'unusable, there is no handwashing, and you are looking at 300-plus people on site overnight with meals to be ' +
        'served. Two students have already been sick.',
      decisionId: 'prin_sanitation',
      prompt: 'How do you manage sanitation overnight?',
      options: [
        { key: 'A', label: 'Close the affected toilets, set up a designated alternative with supervision and separate arrangements for staff and students, get hand sanitiser to every entry, and escalate to Civil Defence for portable units tonight', desc: 'A designated, supervised alternative plus hand hygiene is what stops a sanitation failure becoming a gastro outbreak among 300 people in one room.', effect: { score: 5 } },
        { key: 'B', label: 'Keep the toilets open and ask everyone to be careful', desc: 'Backed-up toilets with no handwashing, feeding 300 people in the same building, is a gastro outbreak with a start time.', effect: { score: -7 } },
        { key: 'C', label: 'Close all toilets and tell people to use the treeline', desc: 'Unsupervised, unlit toileting for 380 children in the dark is both a safeguarding and a public-health failure at once.', effect: { score: -6 } },
        { key: 'D', label: 'Wait for Civil Defence to solve it', desc: 'The portable units will not arrive for hours, and the problem is happening now with children already unwell.', effect: { score: -4 } }
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
        { key: 'A', label: 'Register and ration now - small portions, youngest and high-needs first, hold a reserve', desc: 'Stretches a single meal across an uncertain night and protects the most vulnerable. Disciplined and fair.', effect: { score: 4 },
          locked: function (log) {
            return log['prin_sanitation'] === 'C' ? 'You cannot serve 300 meals with every toilet closed and nowhere to wash hands' : false;
          } },
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
        { key: 'A', label: 'Keep them in the warmest safe building with staffing, food and a written register; allow only vetted billeting with ID and sign-out', desc: 'Holds the duty-of-care line: known location, known adults, recorded handovers. Billeting is allowed but verified, not improvised.', effect: { score: 5 },
          locked: function (log) {
            return log['prin_shelter'] === 'B' ? 'The gymnasium is full of unscreened evacuees - there is no separate supervised space left to bed students in' : false;
          } },
        { key: 'B', label: 'Let local families take any children to reduce the numbers staying', desc: 'Eases your logistics by handing children to unchecked adults with no record of who went where. The classic disaster safeguarding failure.', effect: { score: -5 } },
        { key: 'C', label: 'Keep every child at school overnight, no exceptions', desc: 'Maximises oversight, but strains warmth, food and exhausted staff and may be unnecessary for low-risk verified handovers.', effect: { score: 1 } },
        { key: 'D', label: 'Release children to any family heading their direction to get them home', desc: 'Solves transport by abandoning verification entirely - children leaving with unconfirmed adults into the night and snow.', effect: { score: -4 } }
      ]
    },
    {
      time: 248, type: 'info', tag: 'NIGHT',
      title: 'The Long Night',
      body: 'By eleven the gymnasium is quiet. Children are asleep on mats in rows under borrowed blankets, two teachers are ' +
        'walking the room in rotation, and the register sits on a table by the door with every name on it. Snow is settling ' +
        'on the roof. Nobody has been able to tell you when the roads will open.',
      source: 'Gymnasium'
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
        { key: 'A', label: 'Calmly explain prioritisation, reassure them their child is safe and warm, and stay with them a moment', desc: 'Acknowledges the fear, holds the line on scarce life-safety assets, and rebuilds trust through presence rather than confrontation.', effect: { score: 4 },
          locked: function (log) {
            return log['prin_overnight'] === 'D' ? 'You released children to any family heading their way - you cannot tell this parent where their child is' : false;
          } },
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
