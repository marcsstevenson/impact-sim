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
    // No status bar: every item restated a panel row, and the strip is never
    // re-rendered, so it went stale as soon as a consequence moved the panel.
    statusBar: [],
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
        { label: 'Satellite Phone', value: 'Working', cls: 'good' }
      ],
      transportTitle: 'Access & Transfer',
      transport: [
        { label: 'Roads', value: 'Closed', cls: 'failed' },
        { label: 'Base Hospital', value: 'Cut Off', cls: 'failed' },
        { label: 'Helicopters', value: 'Grounded', cls: 'failed' },
        { label: 'Carpark Triage', value: 'Active', cls: 'degraded' }
      ],
      cascadeTitle: 'Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '🏗️', name: 'Clinic Structure', level: 'High', cls: 'high' },
        { icon: '🚱', name: 'Water / Gastro', level: 'High', cls: 'high' },
        { icon: '🧊', name: 'Refrigeration Loss', level: 'Moderate', cls: 'moderate' }
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
    'ngata_evacuate': { 'A': { space: 10 } },
    'ngata_conflicting': { 'B': { staffEnergy: -8 }, 'D': { staffEnergy: -4 } },
    'ngata_dialysis': { 'A': { meds: -5 }, 'C': { space: -5 } },
    'ngata_morphine': { 'A': { meds: -10 }, 'B': { meds: -35 }, 'C': { meds: -3 }, 'D': { meds: -20 } },
    'ngata_end_of_life': { 'A': { meds: -5, space: 10 }, 'B': { meds: -15, space: -5 }, 'D': { space: -5 } },
    'ngata_refusal': { 'B': { meds: -8, space: -5 } },
    'ngata_own_child': { 'B': { staffEnergy: -10 }, 'D': { staffEnergy: -5 } },
    'ngata_generator': { 'A': { power: -10 }, 'B': { power: -12 }, 'C': { power: -30 }, 'D': { power: 5 } },
    'ngata_pharmacist': { 'A': { meds: -5, staffEnergy: -5 }, 'C': { meds: -25 } },
    'ngata_advisor': { 'C': { staffEnergy: -5 }, 'D': { staffEnergy: -10 } }
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
    'ngata_media': { 'A': { communityTrust: 8, ethics: 5 }, 'B': { communityTrust: -8, ethics: -6 }, 'C': { communityTrust: -3 }, 'D': { communityTrust: -4 } },
    'ngata_conflicting': { 'A': { triageQuality: 8, composure: 5, populationBenefit: 4 }, 'B': { triageQuality: -6, populationBenefit: -4 }, 'C': { triageQuality: -5, composure: -4 }, 'D': { communityTrust: -4, populationBenefit: -3 } },
    'ngata_dialysis': { 'A': { populationBenefit: 7, triageQuality: 5, ethics: 3 }, 'B': { populationBenefit: -6, triageQuality: -4 }, 'C': { triageQuality: -5, populationBenefit: -3 }, 'D': { communityTrust: -5, ethics: -4 } },
    'ngata_morphine': { 'A': { triageQuality: 7, ethics: 5, populationBenefit: 4 }, 'B': { populationBenefit: -7, triageQuality: -4 }, 'C': { ethics: -5, communityTrust: -4 }, 'D': { triageQuality: -5, ethics: -3 } },
    'ngata_end_of_life': { 'A': { ethics: 8, populationBenefit: 6, triageQuality: 5 }, 'B': { populationBenefit: -6, triageQuality: -5 }, 'C': { ethics: -10, communityTrust: -6 }, 'D': { ethics: -7, communityTrust: -4 } },
    'ngata_refusal': { 'A': { ethics: 8, communityTrust: 5, composure: 3 }, 'B': { ethics: -8, communityTrust: -3 }, 'C': { ethics: -4 }, 'D': { ethics: -6, composure: -4 } },
    'ngata_own_child': { 'A': { composure: 8, populationBenefit: 4, staffWelfare: 3 }, 'B': { populationBenefit: -12, triageQuality: -7 }, 'C': { composure: -4 }, 'D': { composure: -5, triageQuality: -4 } },
    'ngata_generator': { 'A': { triageQuality: 7, populationBenefit: 5, composure: 3 }, 'B': { populationBenefit: -4, triageQuality: -2 }, 'C': { triageQuality: -7, populationBenefit: -6 }, 'D': { triageQuality: -6, populationBenefit: -5 } },
    'ngata_pharmacist': { 'A': { populationBenefit: 7, ethics: 5, staffWelfare: 4 }, 'B': { populationBenefit: -6, communityTrust: -4 }, 'C': { ethics: -9, communityTrust: -5 }, 'D': { staffWelfare: -8, ethics: -4 } },
    'ngata_advisor': { 'A': { populationBenefit: 7, ethics: 4, communityTrust: 3 }, 'B': { populationBenefit: -3 }, 'C': { triageQuality: -6, staffWelfare: -4 }, 'D': { composure: -6, triageQuality: -5 } }
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
    'ngata_media': { 'A': { decisive: 1, communityTrust: 1, centralized: 1 }, 'B': { decisive: 1, communityTrust: -1 }, 'C': { decisive: -2 }, 'D': { centralized: 1, communityTrust: -1 } },
    'ngata_conflicting': { 'A': { decisive: 2, centralized: 1, lifeSafety: 1 }, 'B': { decisive: -1, centralized: 2 }, 'C': { decisive: -2, centralized: 1 }, 'D': { decisive: 1, centralized: 2, communityTrust: -1 } },
    'ngata_dialysis': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -2, lifeSafety: -1 }, 'C': { decisive: 1, lifeSafety: -1 }, 'D': { decisive: -2, communityTrust: -1 } },
    'ngata_morphine': { 'A': { decisive: 1, centralized: 1, lifeSafety: 1 }, 'B': { decisive: 1, lifeSafety: -1, communityTrust: 1 }, 'C': { decisive: 1, centralized: 2, lifeSafety: -1 }, 'D': { decisive: -2, centralized: -2 } },
    'ngata_end_of_life': { 'A': { decisive: 2, lifeSafety: 1, centralized: 1 }, 'B': { decisive: -1, lifeSafety: -1 }, 'C': { decisive: 2, lifeSafety: -2, communityTrust: -1 }, 'D': { decisive: -2, lifeSafety: -1 } },
    'ngata_refusal': { 'A': { decisive: 1, communityTrust: 2, centralized: -1 }, 'B': { decisive: 1, centralized: 2, communityTrust: -1 }, 'C': { decisive: -1 }, 'D': { decisive: -2, centralized: -2 } },
    'ngata_own_child': { 'A': { decisive: 2, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -2, centralized: -2 }, 'C': { decisive: 1, lifeSafety: 1 }, 'D': { decisive: -1, lifeSafety: -1 } },
    'ngata_generator': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: 1 }, 'C': { decisive: -2, lifeSafety: -2 }, 'D': { decisive: 1, lifeSafety: -2 } },
    'ngata_pharmacist': { 'A': { decisive: 2, centralized: 1, communityTrust: 1 }, 'B': { decisive: -2, centralized: 1 }, 'C': { decisive: 1, centralized: -2, communityTrust: 1 }, 'D': { decisive: 1, lifeSafety: -1 } },
    'ngata_advisor': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: -1, lifeSafety: 1 }, 'C': { decisive: 2, lifeSafety: -1 }, 'D': { decisive: -1, centralized: 2 } }
  });

  Object.assign(CONSEQUENCE_MAP, {
    'ngata_triage': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Sickest Never Reached the Door',
          body: 'Seeing people in arrival order means the patients who could not queue never got seen. Two casualties who ' +
            'arrived early and quietly - a head injury and an internal bleed - deteriorated in the carpark while walking ' +
            'wounded were treated ahead of them. Triage exists precisely because the sickest are rarely the loudest.',
          source: 'Carpark Triage',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Critical (red)', '~18', 'failed');
          updatePanelItem('transport-section', 'Carpark Triage', 'Overwhelmed', 'failed');
        }
      }
    },
    'ngata_conflicting': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Transfers That Cannot Happen',
          body: 'You spent the morning organising the transfers the regional hospital asked for. The roads did not open, the ' +
            'helicopters did not fly, and the patients you prepared for transfer went untreated while you prepared them. ' +
            'The hospital was giving advice for a road network that no longer exists.',
          source: 'Regional Hospital / Roading',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Regional Hospital', '"Where are they?"', 'failed');
          updatePanelItem('transport-section', 'Base Hospital', 'Still Cut Off', 'failed');
        }
      }
    },
    'ngata_oxygen': {
      'D': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Decision Made Itself',
          body: 'While you delayed, the 8-year-old in severe asthma tired and arrested. The choice you could not bear to make ' +
            'was made by the clock instead, and it picked the patient you were most likely to have saved. Indecision is a ' +
            'decision; it is just one nobody signs.',
          source: 'Resus',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Oxygen', 'Critical', 'failed');
          updateUtilityDirect('oxygen', 12);
        }
      }
    },
    'ngata_dialysis': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Too Late for Simple Measures',
          body: 'Left until they were acutely unwell, two of the dialysis patients are now hyperkalaemic and arrhythmic - a ' +
            'problem that fluid and potassium restriction would have held for days, and that you cannot fix here at all. The ' +
            'slower clock was still a clock.',
          source: 'Clinical / Bloods',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Critical (red)', '~15', 'failed');
          updateCascadeItem('cascade-tracker', 'Refrigeration Loss', 'High', 'high');
        }
      }
    },
    'ngata_morphine': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Nothing Left for the Reductions',
          body: 'Adequate pain relief for everyone this morning means none tonight. Two fractures need reducing, a chest drain ' +
            'needs siting, and you have paracetamol. The patients who get the worst of this are the ones who arrived after ' +
            'the supply ran out - and they had no say in it.',
          source: 'Resus / Supply',
          scorePenalty: -5
        },
        stateChange: function () {
          updateUtilityDirect('meds', 4);
          updatePanelItem('agency-status', 'Pharmacist', '"Nothing left"', 'failed');
        }
      }
    },
    'ngata_ventilator': {
      'D': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Two Staff, Three Patients, No End',
          body: 'Hand-ventilating three patients by rotation has consumed two of your four clinical staff for hours, and all ' +
            'three patients are deteriorating anyway. The casualties in the corridor have effectively lost half the team. ' +
            'Refusing to choose was itself the choice that failed all three.',
          source: 'Resus',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Doctors / Nurses', '2 / 2 tied up', 'failed');
          updateUtilityDirect('staffEnergy', 25);
        }
      }
    },
    'ngata_end_of_life': {
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'A Death Without Comfort, in Public',
          body: 'Withdrawing analgesia to conserve supplies did not conserve much and cost everything else. Two patients died ' +
            'in pain, in a corridor, in front of their families and your staff. The clinical decision to stop active ' +
            'treatment was defensible; stopping comfort was not, and the town will remember which one you did.',
          source: 'Clinical Governance',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Nat. Clinical Group', '"Review required"', 'failed');
          updateCascadeItem('cascade-tracker', 'Clinic Structure', 'High', 'high');
        }
      }
    },
    'ngata_refusal': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Treated Against His Will',
          body: 'You treated a competent adult who had clearly refused, because his family pushed. He is quietly furious, the ' +
            'family is now divided, and a treatment space and scarce supplies went where the patient did not want them. ' +
            'Capacity does not lapse in a disaster.',
          source: 'Clinical Governance',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Treatment Spaces', '5', 'failed');
        }
      }
    },
    'ngata_own_child': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Clinical Lead Is Gone',
          body: 'You left with your uninjured child. The critical patient coming through the door was received by a nurse ' +
            'with no doctor behind her, and the triage system you built stopped being enforced within the hour. Eighty ' +
            'casualties lost the only clinical leadership in the valley.',
          source: 'Alpine Community Medical Centre',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Doctors / Nurses', '1 / 2', 'failed');
          updatePanelItem('transport-section', 'Carpark Triage', 'Unmanaged', 'failed');
        }
      }
    },
    'ngata_school': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Casualty Hub Empties of Clinicians',
          body: 'Sending most of your clinical staff to the school left 80+ casualties with almost no one. The carpark triage ' +
            'area is unstaffed, two patients deteriorated unnoticed, and the school team cannot do definitive work there ' +
            'either. Both sites are now under-resourced instead of one being adequately covered.',
          source: 'Carpark / Secondary School',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Doctors / Nurses', '1 / 1', 'failed');
          updatePanelItem('transport-section', 'Carpark Triage', 'Unstaffed', 'failed');
        }
      }
    },
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
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Clinic Structure', 'Extreme', 'extreme');
          updatePanelItem('cdem-groups', 'Treatment Spaces', '3', 'failed');
          updatePanelItem('agency-status', 'Building Engineer', '"I warned you"', 'failed');
        }
      }
    },
    'ngata_generator': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Generator Dies Mid-Procedure',
          body: 'Running everything drained the tank hours early. The generator stopped without warning during a procedure, ' +
            'taking the ventilator, the concentrator and the lights with it. The fridge came back to ambient overnight and ' +
            'the insulin and vaccines are gone. Nothing was prioritised, so everything failed together.',
          source: 'Practice Manager',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Power (generator)', 'Failed', 'failed');
          updatePanelItem('lifelines-section', 'Refrigeration', 'Lost', 'failed');
          updateCascadeItem('cascade-tracker', 'Refrigeration Loss', 'Extreme', 'extreme');
          updateUtilityDirect('power', 0);
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
        },
        stateChange: function () {
          updateUtilityDirect('blood', 5);
          updatePanelItem('agency-status', 'Pharmacist', '"We are out"', 'failed');
        }
      }
    },
    'ngata_pharmacist': {
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Pharmacy Cannot Be Accounted For',
          body: 'An unsupervised pharmacy means controlled drugs are gone, two residents have taken the wrong medication, and ' +
            'there is no record of what left the building. You cannot now tell anyone - the coroner, the pharmacy council, ' +
            'or the next clinician - what any patient has actually taken.',
          source: 'Clinical Governance',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Pharmacist', 'Uncontrolled', 'failed');
          updateUtilityDirect('meds', 8);
        }
      }
    },
    'ngata_oxygen_welfare': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Your Own Critical Patients Lose Their Oxygen',
          body: 'Sending every cylinder to the welfare centre left the oxygen-dependent patients in front of you with nothing. ' +
            'Two deteriorated within the hour and one arrested. The evacuees needed help, but not at the price of the ' +
            'patients already on your oxygen - a managed split existed.',
          source: 'Resus',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Oxygen', 'Exhausted', 'failed');
          updateUtilityDirect('oxygen', 0);
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
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Doctors / Nurses', '2 / 2 spent', 'failed');
          updateUtilityDirect('staffEnergy', 8);
        }
      }
    },
    'ngata_media': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Your Guess Becomes the Headline',
          body: 'The off-the-cuff figure you gave is now the confirmed death toll on every bulletin, and it is wrong. Families ' +
            'of the missing have read it as fact, Civil Defence is publicly correcting you, and every accurate thing you say ' +
            'from here is discounted.',
          source: 'Civil Defence / Media',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Civil Defence', '"Correcting you"', 'failed');
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
    },
    'ngata_conflicting': {
      learningObjective: 'Reconcile conflicting remote advice against local reality, and keep every channel informed rather than silent.',
      bestPractice: 'A',
      teachingNote: 'Four credible sources are giving four incompatible instructions, and none of them can see your carpark. ' +
        'The skill is to extract what is useful from each, decide locally on what you can actually observe, and tell each ' +
        'channel plainly what you have decided - rather than deferring to seniority, following whoever called last, or ' +
        'going silent on the only working link.',
      references: [
        { label: 'Local clinical judgement', desc: 'remote advice is an input, not an instruction, when the adviser cannot see the scene' },
        { label: 'Closing the loop', desc: 'telling each channel your decision keeps them useful for resupply and transfer' }
      ],
      discussionPrompts: [
        'Which of the four channels is actually decision-useful here, and which is noise?',
        'How do you disagree with a senior remote clinician without losing the relationship?'
      ]
    },
    'ngata_dialysis': {
      learningObjective: 'Manage patients on a slower clock before they become emergencies, rather than after.',
      bestPractice: 'A',
      teachingNote: 'Chronic patients are the disaster’s second wave. Missed dialysis kills over days, not minutes, which ' +
        'means simple measures - fluid and potassium restriction, monitoring, a named transfer deadline - still work if ' +
        'started early. Waiting until they are acutely unwell throws away the only window where you could have helped.',
      references: [
        { label: 'Chronic care in disasters', desc: 'dialysis, insulin and cardiac patients deteriorate predictably and preventably' },
        { label: 'Transfer prioritisation', desc: 'a named clinical deadline stops slower-clock patients being forgotten behind trauma' }
      ],
      discussionPrompts: [
        'How do you keep chronic patients visible when every new arrival is bleeding?',
        'What does a defensible transfer priority list look like on day two?'
      ]
    },
    'ngata_morphine': {
      learningObjective: 'Ration scarce analgesia by a stated rule applied consistently, and say out loud what the rule is.',
      bestPractice: 'A',
      teachingNote: 'The failure modes sit either side of the answer: give everyone full analgesia and there is nothing for ' +
        'tonight’s procedures or tomorrow’s casualties; withhold almost everything for a hypothetical surgical case and you ' +
        'leave treatable pain untreated now. A stated rule - opioids for severe pain and procedures, everything else for the ' +
        'rest - is both more effective and more defensible than leaving it to individual judgement.',
      references: [
        { label: 'Crisis standards of care', desc: 'scarce medication is allocated by stated criteria, not first contact' },
        { label: 'Analgesia as a clinical duty', desc: 'untreated severe pain is harm, not merely discomfort' }
      ],
      discussionPrompts: [
        'What is your rule, and could every clinician on the floor state it the same way?',
        'How do you tell a patient in pain what they are getting and why?'
      ]
    },
    'ngata_end_of_life': {
      learningObjective: 'Understand that "expectant" is a category of care - comfort, dignity and presence - not abandonment.',
      bestPractice: 'A',
      teachingNote: 'This is the decision that most often goes wrong in both directions. Continuing full active treatment on ' +
        'unsurvivable injuries consumes what would save others; withdrawing comfort along with the active treatment is not ' +
        'stewardship, it is abandonment. Expectant patients are owed analgesia, dignity, privacy and someone with them, and ' +
        'the decision is owed a written rationale.',
      references: [
        { label: 'Expectant category', desc: 'in mass casualty triage, expectant patients receive comfort care, not nothing' },
        { label: 'Documentation', desc: 'a written rationale protects the patient, the family and the clinician afterwards' }
      ],
      discussionPrompts: [
        'What does good expectant care actually look like with six spaces and four staff?',
        'Who sits with the patient, and how do you make that possible?'
      ]
    },
    'ngata_refusal': {
      learningObjective: 'Respect an informed refusal from a patient with capacity, even when the family objects.',
      bestPractice: 'A',
      teachingNote: 'Capacity does not lapse in a disaster. A competent adult may refuse treatment, including for altruistic ' +
        'reasons, and treating him anyway to satisfy his family is assault. But the refusal must be checked: is it informed, ' +
        'or is it despair, guilt or a misunderstanding of how scarce the resource really is? Confirm capacity, explore the ' +
        'reasoning, honour the decision, document it, and support the family.',
      references: [
        { label: 'Capacity and consent', desc: 'a competent adult’s informed refusal stands regardless of family wishes' },
        { label: 'Testing a refusal', desc: 'distinguish an informed altruistic choice from despair or misinformation' }
      ],
      discussionPrompts: [
        'How do you test whether this refusal is informed without appearing to override it?',
        'What do you owe the family once you have honoured his decision?'
      ]
    },
    'ngata_own_child': {
      learningObjective: 'Meet a personal shock in the middle of a response without either abandoning the floor or absorbing the child into it.',
      bestPractice: 'A',
      teachingNote: 'Both extremes fail. Leaving with an uninjured child abandons eighty casualties who have no other ' +
        'clinician; keeping the child at your side through a resuscitation traumatises them and splits your attention at the ' +
        'worst moment. Sixty seconds of contact, then a trusted adult and a useful job, settles the child and settles you - ' +
        'and turning them away coldly costs you both something for no operational gain.',
      references: [
        { label: 'Responder family reunification', desc: 'brief, structured contact restores function better than suppression' },
        { label: 'Child protection', desc: 'children should not be present at resuscitations or fatalities' }
      ],
      discussionPrompts: [
        'Who in your town is the trusted adult you would hand your own child to?',
        'How do you make that arrangement before the earthquake rather than during it?'
      ]
    },
    'ngata_generator': {
      learningObjective: 'Prioritise a failing power supply by clinical consequence, and state the order before it fails.',
      bestPractice: 'A',
      teachingNote: 'A generator that cannot carry the building forces an explicit order: life support, then the cold chain, ' +
        'then everything else. Running everything drains the tank early and takes life support down without warning; ' +
        'shutting down entirely to "save fuel" switches off the very things the fuel exists to protect. Working by torchlight ' +
        'is the acceptable cost.',
      references: [
        { label: 'Essential load planning', desc: 'life support and cold chain before lighting and convenience' },
        { label: 'Cold chain', desc: 'insulin and vaccines can often be preserved by cycling rather than continuous power' }
      ],
      discussionPrompts: [
        'What is your load order, and is it written down anywhere before the day?',
        'How long can your fridge hold temperature without power, and do you know that number?'
      ]
    },
    'ngata_pharmacist': {
      learningObjective: 'Maintain medication governance when the only authorised dispenser is out of action.',
      bestPractice: 'A',
      teachingNote: 'The pharmacist is now a patient, and the town still needs its cardiac, respiratory, psychiatric and ' +
        'insulin medication. A supervised process under your clinical authority, with a written record of what was issued to ' +
        'whom, keeps medication moving and keeps it accountable. An open, self-serve pharmacy is a controlled-drug and ' +
        'patient-safety catastrophe that cannot be reconstructed afterwards.',
      references: [
        { label: 'Clinical governance', desc: 'dispensing under medical authority requires supervision and a record' },
        { label: 'Staff as casualties', desc: 'a collapsed responder is a patient, not a resource to be restarted' }
      ],
      discussionPrompts: [
        'Who else in your town could dispense safely under supervision, and do they know that?',
        'What is the minimum record that makes this defensible afterwards?'
      ]
    },
    'ngata_advisor': {
      learningObjective: 'Weigh where your clinical judgement does the most good - the floor in front of you or the district behind it.',
      bestPractice: 'A',
      teachingNote: 'By this point your value is increasingly your population view rather than your hands. Taking a defined, ' +
        'part-time advisory seat with a proper handover extends that judgement across the district while keeping the floor ' +
        'led. Refusing outright leaves the district’s health response without the one person who has seen this from inside; ' +
        'accepting fully and walking off, or trying to do both without handing over, fails both jobs.',
      references: [
        { label: 'CIMS advisory roles', desc: 'technical advisers inform the controller without taking operational command' },
        { label: 'Clinical handover', desc: 'a role change is safe only with an explicit, documented handover' }
      ],
      discussionPrompts: [
        'What does a good handover of clinical lead sound like at hour twenty?',
        'How do you stay useful to the EOC without losing situational awareness of your own floor?'
      ]
    },
    'ngata_blood': {
      learningObjective: 'Commit a scarce, life-saving product to the most salvageable immediate threat, with stewardship and a resupply request.',
      bestPractice: 'A',
      teachingNote: 'Blood is the clearest case where hedging kills. Spreading it thinly across three patients is ' +
        'sub-therapeutic for all of them; holding it back for a hypothetical later casualty lets a salvageable haemorrhage ' +
        'die now; allocating on visible distress uses the wrong signal entirely. Use it decisively where it changes an ' +
        'outcome, record the rationale, and escalate for resupply in the same breath.',
      references: [
        { label: 'Massive haemorrhage', desc: 'transfusion is time-critical and dose-dependent; partial doses do not work' },
        { label: 'Resource stewardship', desc: 'committing a scarce product and requesting resupply are one action, not two' }
      ],
      discussionPrompts: [
        'What makes a patient the right recipient for the last units you have?',
        'How do you record this decision so it is defensible in a review months later?'
      ]
    },
    'ngata_ventilator': {
      learningObjective: 'Allocate a single life-support device by likelihood of survival with it, and reassess as patients change.',
      bestPractice: 'A',
      teachingNote: 'One ventilator and three candidates is the textbook scarce-resource allocation. The answer is survival ' +
        'benefit from ventilation specifically, documented and reviewable - not "most critical", not arrival order. Refusing ' +
        'to choose and hand-ventilating by rotation feels fair but consumes half your clinical staff for hours and usually ' +
        'fails all three.',
      references: [
        { label: 'Crisis standards of care', desc: 'single life-support devices are allocated by likelihood of benefit, then reassessed' },
        { label: 'Reassessment duty', desc: 'allocation is provisional; deterioration changes the answer' }
      ],
      discussionPrompts: [
        'What would make you reallocate the ventilator once it is committed?',
        'Who else should be part of that decision, and what do you record?'
      ]
    },
    'ngata_school': {
      learningObjective: 'Weigh a forward deployment against the survival of the casualty hub that has no substitute.',
      bestPractice: 'A',
      teachingNote: 'Five dying children is a real call, and so are the eighty casualties who have nowhere else to go. A ' +
        'small capable team with a triage kit, sent only if the centre can survive it and coordinated with Civil Defence, ' +
        'answers both. Stripping the centre leaves two under-resourced sites instead of one adequate one - and going ' +
        'yourself because your own children are there lets a personal stake override a population decision.',
      references: [
        { label: 'Forward clinical teams', desc: 'send capability forward only when the hub remains viable without it' },
        { label: 'Conflict of interest', desc: 'name a personal stake aloud so it can be checked by someone else' }
      ],
      discussionPrompts: [
        'What is the minimum staffing your centre needs before you can send anyone anywhere?',
        'Who tells you when your personal stake is driving a clinical decision?'
      ]
    },
    'ngata_ambulance': {
      learningObjective: 'Allocate a rare transfer window by clinical benefit and time-criticality, not status or sympathy.',
      bestPractice: 'A',
      teachingNote: 'The transfer should go to the patient who is salvageable but will die without the definitive care only ' +
        'the hospital can provide. Spending it on the most critical patient regardless of whether transfer can save them ' +
        'wastes the window; choosing the firefighter or Police officer to return an essential worker to duty imports a ' +
        'non-clinical criterion; and delaying until you are certain lets the window close with the ambulance idle.',
      references: [
        { label: 'Transfer triage', desc: 'transfer follows benefit and time-criticality, not severity alone' },
        { label: 'Decision under uncertainty', desc: 'a rare window closes; a good decision now beats a perfect one late' }
      ],
      discussionPrompts: [
        'How do you explain this choice to the four families whose patient did not go?',
        'What would have to change for you to reverse it if a second window opened?'
      ]
    },
    'ngata_fire_supplies': {
      learningObjective: 'Divide supplies proportionately between two genuine life-safety needs, with a record.',
      bestPractice: 'A',
      teachingNote: 'Both requests are legitimate: trapped casualties need IV fluids, dressings and analgesia, and so do the ' +
        'patients you are already treating. A negotiated, prioritised split with a written record serves both. Handing over ' +
        'everything empties the casualty-clearing hub of the supplies that let it clear casualties; refusing outright leaves ' +
        'a rescue without what you could have spared; and referring them to a hospital that is ninety minutes away and cut ' +
        'off is a non-answer.',
      references: [
        { label: 'Mutual aid', desc: 'shared scarce supplies are negotiated and recorded, not surrendered or refused wholesale' },
        { label: 'Casualty clearing', desc: 'a clearing station without supplies stops being one' }
      ],
      discussionPrompts: [
        'What do you keep back as an absolute minimum, and how did you arrive at that number?',
        'Who records the split, and what happens if the Fire Service asks again in two hours?'
      ]
    },
    'ngata_oxygen_welfare': {
      learningObjective: 'Balance the patients you can see against a vulnerable population you cannot, without sacrificing either.',
      bestPractice: 'A',
      teachingNote: 'This is the population-versus-individual tension in its sharpest form. Keeping enough for your current ' +
        'oxygen-dependent critical patients while sharing what can genuinely be spared - and escalating hard for resupply - ' +
        'is the defensible division. Sending everything abandons the patients already on your oxygen; keeping everything ' +
        'writes off evacuees you could have helped; and telling Civil Defence to sort it out abandons a clinical judgement ' +
        'only you can make.',
      references: [
        { label: 'Population versus individual', desc: 'the greatest achievable benefit rarely means all-or-nothing' },
        { label: 'Escalation', desc: 'a documented split plus a resupply request is a stronger position than either alone' }
      ],
      discussionPrompts: [
        'How do you calculate what can "safely be spared" when patients are still deteriorating?',
        'What does the welfare centre need to be told so it can plan around your answer?'
      ]
    },
    'ngata_media': {
      learningObjective: 'Communicate honestly under uncertainty - confirm what you know, decline what you do not, and correct the rumour by being useful.',
      bestPractice: 'A',
      teachingNote: 'A guessed death toll becomes fact within the hour and destroys your credibility when the real numbers ' +
        'emerge. A flat refusal cedes the story to the "people are dying in corridors" rumour already circulating. ' +
        'Minimising buys quiet now and costs everything later. Give what you can confirm, be explicit about the uncertainty, ' +
        'and state plainly what the centre is doing and what it needs.',
      references: [
        { label: 'Crisis communication', desc: 'bounded honesty about uncertainty outperforms both silence and estimation' },
        { label: 'Rumour management', desc: 'accurate, decision-useful information displaces rumour better than denial' }
      ],
      discussionPrompts: [
        'What can you confirm right now, and what would you have to check first?',
        'What does the community actually need from this interview, as opposed to what the journalist wants?'
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
    },
    {
      tag: 'NOISE', title: 'A Volunteer Wants to Photograph the Response',
      body: 'A local volunteer is taking photographs "so the country can see what we are dealing with", including of patients ' +
        'being treated in the carpark.',
      source: 'Carpark',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Stop the photography of patients immediately, explain why, and offer a non-identifying alternative', desc: 'Patient dignity and privacy do not suspend in a disaster, and a clear reason keeps a willing volunteer onside.', effect: { score: 2 } },
        { key: 'B', label: 'Let them carry on - the country should see this', desc: 'Identifiable images of injured patients, shared before families have been told, is a harm you cannot take back.', effect: { score: -3 } },
        { key: 'C', label: 'Confiscate the phone', desc: 'The instinct is right but the method is not yours to use, and it turns a supporter into an adversary.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: '"I Only Need a Repeat Prescription"',
      body: 'A resident has queued patiently for two hours to ask for a routine repeat prescription, standing among crush ' +
        'injuries and major bleeding.',
      source: 'Reception',
      prompt: 'How do you deal with the request?',
      options: [
        { key: 'A', label: 'Route them to a separate, simple medication process away from the treatment area', desc: 'Real need, wrong queue. Separating routine dispensing from trauma keeps both moving.', effect: { score: 2 } },
        { key: 'B', label: 'Stop and write the prescription now', desc: 'Pulls the clinical lead out of a mass-casualty floor for a task that could wait or be delegated.', effect: { score: -2 } },
        { key: 'C', label: 'Tell them to come back next week', desc: 'For a cardiac or psychiatric medication, next week is not a safe answer - and the roads may still be closed.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Staff Member Wants to Post an Appeal',
      body: 'A healthcare assistant wants to post publicly asking for supplies and volunteers, tagging the medical centre and ' +
        'listing exactly what you are short of.',
      source: 'Staff',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Coordinate one accurate appeal through Civil Defence rather than an unmanaged public post', desc: 'Gets the same reach without publishing your vulnerabilities or triggering an unusable flood of donations.', effect: { score: 2 } },
        { key: 'B', label: 'Let them post it now - you need the help', desc: 'An unmanaged appeal brings crowds, unusable donations and traffic you cannot handle, and advertises exactly what you lack.', effect: { score: -2 } },
        { key: 'C', label: 'Ban all staff from posting anything', desc: 'A blanket ban with no alternative channel means the rumours fill the gap instead.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Two Helpers Are Arguing in the Corridor',
      body: 'Two volunteers are arguing loudly about how the carpark queue should be organised, in front of waiting patients ' +
        'and families.',
      source: 'Carpark Triage',
      prompt: 'How do you intervene?',
      options: [
        { key: 'A', label: 'Step in, name who is running the queue, give each a specific task, and move on', desc: 'Ambiguous authority is what caused it; naming one person and giving both a job ends it in thirty seconds.', effect: { score: 2 } },
        { key: 'B', label: 'Ignore it - you have patients to treat', desc: 'A public argument among your helpers corrodes confidence in the whole operation in front of the people waiting.', effect: { score: -2 } },
        { key: 'C', label: 'Send both volunteers away', desc: 'Solves the noise by losing two pairs of hands you cannot spare.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Someone Has Moved a Patient',
      body: 'A well-meaning family member has moved an elderly patient out of the cold corridor and into a side room - away ' +
        'from the observation your nurse had them under.',
      source: 'Treatment Area',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Recover the patient to where they can be observed, explain why placement is clinical, and thank the family for the instinct', desc: 'Placement is a clinical decision. Correcting it while acknowledging the kindness keeps the family working with you.', effect: { score: 2 } },
        { key: 'B', label: 'Leave the patient where they are - at least they are warm', desc: 'An unobserved elderly patient in a side room is exactly how a quiet deterioration becomes a death nobody noticed.', effect: { score: -3 } },
        { key: 'C', label: 'Reprimand the family in front of the waiting room', desc: 'Right call, wrong delivery - a public dressing-down for an act of kindness costs you goodwill you need.', effect: { score: -1 } }
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
        { key: 'B', label: 'Treat the most seriously injured first regardless of their survival odds, because the sickest person in the room has the strongest claim on you', desc: 'Pouring scarce effort into the unsurvivable means the salvageable patients next to them die waiting.', effect: { score: -2 } },
        { key: 'C', label: 'Treat all of the children first, on the basis that they have the most life ahead of them and no parent in that carpark would argue otherwise', desc: 'Humane by instinct, but age is not urgency; a child with a sprain ahead of an adult who is bleeding out costs lives.', effect: { score: -3 } },
        { key: 'D', label: 'See people strictly in the order they arrived, so the process is transparently fair and nobody has to be told that somebody else came first', desc: 'First-come-first-served abandons triage entirely; the sickest, who often cannot queue, die in the carpark.', effect: { score: -5 } }
      ]
    },
    {
      time: 16, type: 'decision', tag: 'ADVICE',
      title: 'Four Channels, Four Different Answers',
      body: 'Within minutes the advice starts contradicting itself. The regional hospital says transfer all serious patients; ' +
        'the roads are impassable. The helicopter coordinator says hold your critical patients until flights resume; the ' +
        'forecast says 24 hours. The National Clinical Advisory Group says conserve critical medications; the patients in ' +
        'front of you need them now. Your local paramedic wants to treat people in their vehicles to free clinic space, and ' +
        'your senior nurse says that is unsafe.',
      decisionId: 'ngata_conflicting',
      prompt: 'How do you handle the conflicting advice?',
      options: [
        { key: 'A', label: 'Take what is useful from each, decide locally against what you can actually see, and tell each channel plainly what you are doing and why', desc: 'Remote advisers cannot see your carpark. Local clinical judgement, openly explained, keeps every channel useful instead of paralysing.', effect: { score: 5 } },
        { key: 'B', label: 'Follow the regional hospital in every case, since they are the senior clinical authority and the one that will be reviewing your decisions later', desc: '"Transfer all" is undeliverable on closed roads; you spend the morning organising transfers that cannot happen while patients wait.', effect: { score: -4 } },
        { key: 'C', label: 'Follow whichever advice arrived most recently, on the basis that the latest message is likely to reflect the most current picture', desc: 'Lets the order of the phone queue set your clinical policy, so the plan reverses every time the sat phone rings.', effect: { score: -3 } },
        { key: 'D', label: 'Stop answering the satellite phone until the surge is under control, so that four competing voices stop pulling clinicians off the floor', desc: 'Cuts you off from resupply, transfer windows and the one link that still works - the advice was conflicting, not worthless.', effect: { score: -3 } }
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
        { key: 'B', label: 'Leave now and go and find your family yourself, because nobody else can identify your children and you cannot work while you do not know', desc: 'Removing the clinical lead from a mass-casualty scene collapses the response for 65 people who have no one else.', effect: { score: -6 } },
        { key: 'C', label: 'Stay and lead, but say nothing to anyone and push the fear down, so the team never sees that their clinical lead is frightened', desc: 'Suppressed, unaddressed terror about your own children quietly degrades the very judgement the team depends on.', effect: { score: -3 } },
        { key: 'D', label: 'Send one of your two nurses to the school to check on your children, since they can be there and back in twenty minutes on the 4WD', desc: 'Pulls a needed clinician off the floor for your personal worry when the 4WD and a message could do it.', effect: { score: -2 } }
      ]
    },
    {
      time: 30, type: 'inject', tag: 'SITUATION',
      title: 'The Chronically Ill Start Arriving',
      body: 'Behind the trauma, a second queue is forming. Three dialysis patients cannot reach their scheduled sessions and ' +
        'cannot travel. Insulin-dependent residents have no refrigeration at home. Elderly patients are already a day behind ' +
        'on cardiac and respiratory medication. None of them are bleeding, and all of them are on a clock.',
      source: 'Reception / Practice Manager'
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
        { key: 'B', label: 'Give the oxygen to the sickest patients first regardless of survivability, because need is the only basis you are willing to be judged on', desc: 'Spends a finite resource on those least likely to survive while reversible patients deteriorate without it.', effect: { score: -3 } },
        { key: 'C', label: 'Allocate first-come first-served in the order they were carried in, so that no clinician has to rank one patient above another by hand', desc: 'Order of arrival has nothing to do with who will live or die; it just removes clinical judgement.', effect: { score: -3 } },
        { key: 'D', label: 'Hold off deciding while you gather more information, because choosing which of them breathes is not a call anyone should make in ninety seconds', desc: 'Indecision is itself a decision, and the patients who needed oxygen now are the ones it fails.', effect: { score: -4 } }
      ]
    },
    {
      time: 42, type: 'decision', tag: 'CLINICAL',
      title: 'The Dialysis Patients',
      body: 'Three dialysis patients have missed a session and cannot travel; the base hospital is cut off and helicopters are ' +
        'grounded. Without dialysis they will deteriorate over roughly two to three days - slower than your trauma patients, ' +
        'and just as fatal.',
      decisionId: 'ngata_dialysis',
      prompt: 'How do you manage the dialysis patients?',
      options: [
        { key: 'A', label: 'Start conservative management now - fluid and potassium restriction, monitoring and bloods where you can - and put them on the transfer priority list with a named clinical deadline', desc: 'Buys real days for patients on a slower clock, and puts a date on the transfer so they are not forgotten behind the trauma.', effect: { score: 5 } },
        { key: 'B', label: 'Do nothing for them until they become acutely unwell, since the crush injuries in front of you will die today and dialysis patients have days', desc: 'By the time a missed-dialysis patient is acutely unwell you have lost the window where simple measures would have worked.', effect: { score: -4 } },
        { key: 'C', label: 'Use your scarce transfer capacity on them straight away, ahead of the acute casualties, because without a machine they have no local option at all', desc: 'Spends a rare transfer window on patients with days in hand, while a patient with hours does not get it.', effect: { score: -3 } },
        { key: 'D', label: 'Tell the families honestly that there is nothing you can do for them here, so that nobody is given false hope about a machine you do not have', desc: 'Untrue - conservative management and a place on the transfer list are both available, and both matter.', effect: { score: -4 } }
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
        { key: 'B', label: 'Spread small amounts of blood across all three patients, so that each of them gets something and no family is told their relative got nothing', desc: 'Sub-therapeutic transfusion helps no one fully and may waste a resource that could have saved one life outright.', effect: { score: -2 } },
        { key: 'C', label: 'Hold all four units back for casualties who may still arrive, since the roads are being cleared and worse injuries could come through the door', desc: 'Lets a salvageable mother haemorrhage now on the chance of a future patient who may never come.', effect: { score: -5 } },
        { key: 'D', label: 'Give it to the farmer, who is the most visibly distressed and whose family is standing in the corridor watching everything you do', desc: 'Distress is not the clinical question; this allocates a life-saving resource on the wrong basis.', effect: { score: -3 } }
      ]
    },
    {
      time: 54, type: 'decision', tag: 'CLINICAL',
      title: 'The Morphine Runs Low',
      body: 'Your morphine supply is critically low and resupply is at best a day away. Patients with fractures and crush ' +
        'injuries are in severe pain now, and the casualties still arriving will need it too.',
      decisionId: 'ngata_morphine',
      prompt: 'How do you manage the pain relief?',
      options: [
        { key: 'A', label: 'Ration deliberately: reserve opioids for severe pain and procedures, use every other analgesic you have for the rest, and tell patients honestly what they are getting and why', desc: 'A stated rule applied consistently, with honest explanation - the only way scarce analgesia reaches the pain that most needs it.', effect: { score: 5 } },
        { key: 'B', label: 'Give everyone adequate pain relief now and deal with resupply when it becomes a problem, because people are screaming in a carpark tonight', desc: 'Empties the supply within hours, so tonight’s fracture reductions and tomorrow’s casualties get nothing at all.', effect: { score: -4 } },
        { key: 'C', label: 'Withhold morphine almost entirely so it is preserved for a surgical emergency, and manage everything else with whatever else is on the shelf', desc: 'Leaves patients in severe, treatable pain for a hypothetical case, which is its own kind of harm.', effect: { score: -4 } },
        { key: 'D', label: 'Let each clinician use their own judgement with no shared rule, since they are all experienced and know their own patients better than you do', desc: 'Without a shared rule the supply drains unevenly and two patients with identical injuries get very different care.', effect: { score: -3 } }
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
        { key: 'B', label: 'Give the ventilator to the most critically deteriorating patient regardless of the odds, because the sickest person has the greatest need', desc: 'Tying up the only ventilator on the least survivable patient lets a salvageable one die.', effect: { score: -3 } },
        { key: 'C', label: 'Give it to the elderly patient on the grounds that they arrived first, so the allocation rests on something nobody can argue was a judgement', desc: 'Arrival order is not survivability; this is not how a single life-support device should be allocated.', effect: { score: -3 } },
        { key: 'D', label: 'Refuse to choose and hand-ventilate all three in rotation, so that every one of them gets a share and no single patient is written off', desc: 'Manual rotation across three patients with two doctors and 65 casualties is unsustainable and fails all of them.', effect: { score: -5 } }
      ]
    },
    {
      time: 66, type: 'decision', tag: 'ETHICAL',
      title: 'The Expectant Patients',
      body: 'Two patients have injuries you cannot survive here - not with six spaces, no surgeon and no transfer. They are ' +
        'conscious. Continuing active treatment consumes staff and supplies that would change the outcome for others.',
      decisionId: 'ngata_end_of_life',
      prompt: 'How do you care for the expectant patients?',
      options: [
        { key: 'A', label: 'Move them to comfort-focused care with pain relief, dignity, privacy and someone with them, document the decision, and redirect active treatment to the salvageable', desc: 'Expectant is a care category, not abandonment. Comfort, dignity and company are owed; the active effort goes where it changes an outcome.', effect: { score: 5 } },
        { key: 'B', label: 'Continue full active treatment on both of them regardless of the odds, because withdrawing care is not a decision to make in a carpark', desc: 'Consumes the staff and supplies that would save other patients, without changing what happens to these two.', effect: { score: -4 } },
        { key: 'C', label: 'Withdraw everything from them including pain relief, so that the drugs and staff time go to patients who can still be saved tonight', desc: 'Expectant care still means analgesia and dignity. Withdrawing comfort is not resource stewardship, it is abandonment.', effect: { score: -6 } },
        { key: 'D', label: 'Leave them in the corridor without a decision either way, since something may change and nobody has to be the person who called it', desc: 'The worst of both: they get neither comfort nor cure, in public, while your team improvises around them.', effect: { score: -5 } }
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
        { key: 'B', label: 'Continue full CPR on the 79-year-old and have the children wait, because stopping resuscitation on somebody with a rhythm is not something you do', desc: 'Ties up scarce staff in a low-survivability resuscitation while three salvageable children deteriorate untreated.', effect: { score: -5 } },
        { key: 'C', label: 'Split the team so half stay on the CPR and half go to the children, and nobody has to be abandoned while there is still anything to try', desc: 'Halves the team on both, likely failing the arrest anyway and slowing care to the children who could be saved.', effect: { score: -3 } },
        { key: 'D', label: 'Hand the decision to the junior nurse running the bay and step away, so the call is made by whoever is closest to the patient', desc: 'Offloads the hardest call of the day onto someone without the authority or support to carry it.', effect: { score: -4 } }
      ]
    },
    {
      time: 78, type: 'decision', tag: 'ETHICAL',
      title: '"Save It For Someone Else"',
      body: 'An elderly patient with a survivable but resource-hungry injury refuses treatment, saying the supplies should go ' +
        'to younger patients. He is lucid and appears to have capacity. His family are distraught and insisting you treat ' +
        'him anyway.',
      decisionId: 'ngata_refusal',
      prompt: 'Whose wishes prevail?',
      options: [
        { key: 'A', label: 'Confirm he has capacity, check the refusal is informed rather than despairing, honour it, document it, and support the family through it', desc: 'A competent adult’s informed refusal stands, even when the family disagrees - but only after you have checked it is a real choice and not despair.', effect: { score: 5 } },
        { key: 'B', label: 'Treat him anyway because his family is insisting and they will have to live with the outcome long after tonight is over', desc: 'Treating a competent adult against his stated wishes to satisfy his relatives is assault, however kindly meant.', effect: { score: -4 } },
        { key: 'C', label: 'Accept the refusal immediately without checking capacity or exploring it further, because a competent adult refusing treatment is his right', desc: 'A refusal driven by guilt or despair is not an informed one; accepting it unexamined is not respecting autonomy.', effect: { score: -3 } },
        { key: 'D', label: 'Let the family argue it out among themselves and act on whatever they settle on, since they know him and you have eighty other patients', desc: 'Hands a clinical and legal decision that is yours to a distressed family in a corridor.', effect: { score: -4 } }
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
        { key: 'B', label: 'Send most of your clinical staff to the school, since there are children trapped there and you have two doctors standing in a carpark', desc: 'Stripping the centre to respond to the school abandons 80+ casualties who have nowhere else to go.', effect: { score: -6 } },
        { key: 'C', label: 'Refuse to send anyone at all and hold every clinician at the centre, because the eighty casualties already here are your responsibility', desc: 'Defensible as triage, but sending nothing to five dying children when a small team could have gone is hard to justify.', effect: { score: -2 } },
        { key: 'D', label: 'Go to the school yourself, because your own children are there and you are the most experienced clinician available to the ones who are trapped', desc: 'Removes the clinical lead from the casualty hub, and lets your personal stake override the population decision.', effect: { score: -4 } }
      ]
    },
    {
      time: 96, type: 'decision', tag: 'ETHICAL',
      title: 'Your Own Child Walks In',
      body: 'One of your children appears in the doorway - uninjured, filthy, shaking. They ask if you can go home now. ' +
        'Behind them, a critical patient is being carried in from the carpark.',
      decisionId: 'ngata_own_child',
      prompt: 'What do you do?',
      options: [
        { key: 'A', label: 'Take sixty seconds to hold them, hand them to a trusted staff member or family friend with something useful to do, and go straight to the incoming patient', desc: 'Sixty seconds settles your child and settles you. Giving them a job and a safe adult keeps them out of the resus room without sending them away.', effect: { score: 5 } },
        { key: 'B', label: 'Leave with your child now and get them somewhere safe, because you are their mother before you are anybody else’s clinical lead tonight', desc: 'Your child is safe and uninjured; the patient coming through the door is neither. Walking out now abandons the whole response.', effect: { score: -6 } },
        { key: 'C', label: 'Send them away with whoever brought them without stopping what you are doing, so the resuscitation in front of you is never interrupted', desc: 'Defensible under pressure, but a frightened child turned away at the door is a wound you will both carry, and it takes no longer to do it kindly.', effect: { score: -2 } },
        { key: 'D', label: 'Keep them at your side through the resuscitation, so you can see they are safe and they can see that you have not disappeared on them', desc: 'Exposes your child to a traumatic death and divides your attention at the exact moment the patient needs all of it.', effect: { score: -3 } }
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
        { key: 'B', label: 'Transfer the most critically injured patient regardless of whether the transfer can save them, because the sickest person gets the only vehicle', desc: 'Spends the one transfer on someone it likely cannot save, while a patient it could save stays behind.', effect: { score: -3 } },
        { key: 'C', label: 'Transfer the firefighter or the Police officer, on the basis that getting an essential worker back on duty helps everybody still trapped out there', desc: 'Status and utility are not the triage question for a clinical transfer; it should follow medical benefit.', effect: { score: -3 } },
        { key: 'D', label: 'Hold the ambulance until you are completely sure of the right choice, rather than commit your only transfer to the wrong patient', desc: 'A rare transfer window sits idle while you deliberate, and the patient who needed it loses the chance.', effect: { score: -4 } }
      ]
    },
    {
      time: 108, type: 'cascade', tag: 'CASCADE',
      title: 'Landslide Closes the Last Access Road',
      body: 'A large slip has come down across the last passable road out of the valley. The 4WD route you have been using for ' +
        'welfare checks and the promised resupply run are both gone. Whatever is in the building tonight is what you have.',
      source: 'Civil Defence / Roading Contractor'
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
        { key: 'B', label: 'Evacuate immediately, stopping the procedures mid-way and moving everybody at once, because a building the engineer will not sign off is not one to argue in', desc: 'A panicked all-at-once evacuation that interrupts surgery can kill the very patients you are moving.', effect: { score: -3 } },
        { key: 'C', label: 'Ignore the engineer and keep operating, because you cannot move eighty casualties into a carpark in the dark on one person’s opinion', desc: 'Overriding a structural-safety warning gambles every life in the building on the next aftershock missing.', effect: { score: -6 } },
        { key: 'D', label: 'Wait for a second engineer to confirm the assessment before doing anything, so that eighty people are not moved twice on a contested judgement', desc: 'Delays acting on a clear safety warning while patients and staff remain in a building flagged as unsafe.', effect: { score: -2 } }
      ]
    },
    {
      time: 122, type: 'decision', tag: 'CASCADE',
      title: 'The Generator Falters',
      body: 'The generator is surging and fuel is down to a few hours. It cannot carry the whole building. Running off it right ' +
        'now: the resuscitation room, the ventilator, the oxygen concentrator, the vaccine and insulin fridge, the lights ' +
        'across the treatment area, and the sat-phone charger.',
      decisionId: 'ngata_generator',
      prompt: 'What stays powered?',
      options: [
        { key: 'A', label: 'Power life support and the resuscitation room first, then the fridge, and drop lighting and everything else to torches and head lamps', desc: 'A stated priority order that protects life support and the cold chain, and accepts working by torchlight as the cost.', effect: { score: 5 } },
        { key: 'B', label: 'Keep the ventilator and the oxygen concentrator running and let the fridge go, since a patient breathing now outranks medication for next week', desc: 'Life support is the right first call, but writing off the fridge outright loses the insulin and vaccines when a few hours of cycling would have saved them.', effect: { score: -3 },
          locked: function (log) {
            return log['ngata_ventilator'] === 'D' ? 'No patient is on the ventilator - you chose to hand-ventilate by rotation' : false;
          } },
        { key: 'C', label: 'Keep everything running as it is and hope the fuel lasts until morning, rather than start switching off equipment somebody may need', desc: 'Runs the tank dry hours early and takes life support down with it, with no warning and nothing prioritised.', effect: { score: -5 } },
        { key: 'D', label: 'Shut the generator down entirely to save every litre for the night ahead, when the cold and the dark will make everything harder', desc: 'Saves fuel by switching off the ventilator and the cold chain now - the thing the fuel exists to protect.', effect: { score: -4 } }
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
        { key: 'A', label: 'Negotiate a prioritised split - share what they critically need for the trapped casualties, keep what your current patients need, and document it', desc: 'Two life-safety needs met proportionately, with a record - rather than stripping either the rescue or the casualty hub bare.', effect: { score: 5 },
          locked: function (log) {
            return log['ngata_morphine'] === 'B' ? 'There is nothing left to split - the pain relief was used up hours ago' : false;
          } },
        { key: 'B', label: 'Hand over everything they ask for, because people trapped under a building will die tonight and your patients are at least under a roof', desc: 'Empties the casualty-clearing hub of the supplies it needs to keep clearing casualties, including the next surge.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse the request outright - your eighty patients come first, and every dressing that leaves this building is one you cannot replace', desc: 'Leaves a rescue of trapped, dying people without the supplies you could have shared from a managed split.', effect: { score: -2 } },
        { key: 'D', label: 'Tell them to source it from the regional hospital instead, since that is where the supply chain sits and you are already running on fumes', desc: 'The hospital is 90 minutes away and cut off; this is a non-answer dressed up as a referral.', effect: { score: -2 } }
      ]
    },
    {
      time: 136, type: 'inject', tag: 'HAZARD',
      title: 'Smoke Over the Industrial Yard',
      body: 'Thick smoke is rising from a commercial yard at the edge of town. The Fire Service is committed to the collapse ' +
        'rescue and cannot get to it. Nobody yet knows whether it is a fuel store or a chemical store, or which way the wind ' +
        'will carry it over the casualties in your carpark.',
      source: 'Fire and Emergency / Observation'
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
        { key: 'A', label: 'Keep enough to cover your current critical patients, share what can be safely spared with the welfare centre, escalate hard for resupply, and document the split', desc: 'A transparent, clinically-reasoned division that does not sacrifice the patients in front of you or abandon the evacuees.', effect: { score: 5 },
          locked: function (log) {
            return log['ngata_oxygen'] === 'B' ? 'Nothing can be spared - your oxygen is committed to patients who cannot be weaned off it' : false;
          } },
        { key: 'B', label: 'Keep all of the oxygen here for your current patients, because you can see them and you cannot see whoever the welfare centre is worried about', desc: 'Defensible for the patients you can see, but writes off vulnerable evacuees you could have helped with a managed share.', effect: { score: -2 } },
        { key: 'C', label: 'Send all the oxygen to the welfare centre, since there are more people there and the greater number has the stronger claim on a scarce resource', desc: 'Leaves your current oxygen-dependent critical patients without the resource keeping them alive right now.', effect: { score: -5 } },
        { key: 'D', label: 'Refuse to decide and tell Civil Defence to sort the allocation out themselves, since coordinating scarce resources is precisely their job', desc: 'Punts a clinical-ethical allocation you are best placed to make, and helps no one while you defer.', effect: { score: -3 } }
      ]
    },
    {
      time: 156, type: 'decision', tag: 'CLINICAL',
      title: 'The Pharmacist Collapses',
      body: 'The town’s only pharmacist has collapsed from exhaustion after twenty hours on his feet. Dispensing has stopped. ' +
        'A queue of residents needs regular medication - cardiac, respiratory, psychiatric, insulin - and nobody else in town ' +
        'is authorised to hand it out.',
      decisionId: 'ngata_pharmacist',
      prompt: 'How do you keep medication moving?',
      options: [
        { key: 'A', label: 'Treat him as a patient, then stand up a supervised dispensing process under your clinical authority with a nurse and the practice manager, recording everything issued', desc: 'Uses the authority you do have, keeps a governance trail, and treats the collapsed pharmacist as the patient he now is.', effect: { score: 5 } },
        { key: 'B', label: 'Stop all dispensing until he recovers, because medication issued without a pharmacist is exactly the sort of thing that ends careers', desc: 'A town-wide medication gap of unknown length, when a supervised process under your authority was available.', effect: { score: -4 } },
        { key: 'C', label: 'Let residents help themselves from the pharmacy under loose supervision, since most of them know their own repeats better than anyone here does', desc: 'An unsupervised open pharmacy is a controlled-drug and patient-safety catastrophe you will never be able to account for.', effect: { score: -6 } },
        { key: 'D', label: 'Wake him and get him back on his feet with strong coffee, because he is the only person in the district licensed to do the job', desc: 'Sends a collapsed clinician back to dispense controlled medication - unsafe for him and for everyone he serves.', effect: { score: -5 } }
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
        { key: 'B', label: 'Push everyone through the night, because the patients cannot wait and there is nobody coming to relieve any of you before morning', desc: 'Fatigued clinicians making errors harm the very patients you are trying to save; "push through" is how the next error reaches someone.', effect: { score: -5 } },
        { key: 'C', label: 'Let staff rest only if they ask for it, so that nobody is stood down who still has something left and the willing keep working', desc: 'The most exhausted and committed never ask; leaving rest to self-report fails exactly the people most at risk.', effect: { score: -1 } },
        { key: 'D', label: 'Send the most visibly upset staff home and work the rest harder, so the people still holding together are not slowed down by distress', desc: 'Loses people you need and overloads the remainder, accelerating the fatigue spiral rather than breaking it.', effect: { score: -3 } }
      ]
    },
    {
      time: 170, type: 'inject', tag: 'RUMOUR',
      title: 'The Town Is Reading Something Else',
      body: 'Patchy cell coverage has returned, and with it the rumours: the clinic has run out of doctors, nobody is being ' +
        'treated, people are dying in the corridors. Some of it is not far off. Most of it is wrong. Families are setting out ' +
        'on foot in the dark because of it.',
      source: 'Community / Social Media'
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
        { key: 'B', label: 'Give an off-the-cuff estimate to satisfy them and get them off the phone, because a number now buys you a clear run at the floor', desc: 'A guessed death toll, wrong in either direction, becomes "fact" and detonates trust when the real numbers emerge.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse to say anything at all until the situation is clearer, so that nothing you say tonight has to be corrected publicly tomorrow', desc: 'A flat no-comment cedes the story to the "people are dying in corridors" rumour already filling the gap.', effect: { score: -3 } },
        { key: 'D', label: 'Downplay the scale of it to keep the community calm, since a frightened district converging on this building helps nobody at all', desc: 'Minimising the truth buys quiet now and costs you all credibility the moment the scale becomes clear.', effect: { score: -3 } }
      ]
    },
    {
      time: 184, type: 'decision', tag: 'ETHICAL',
      title: 'The EOC Wants You as Medical Advisor',
      body: 'Civil Defence asks you to take the Medical Advisor seat at the Emergency Operations Centre, shaping the health ' +
        'response for the whole district over the coming days. Accepting means leaving the floor and the patients in front ' +
        'of you.',
      decisionId: 'ngata_advisor',
      prompt: 'How do you answer?',
      options: [
        { key: 'A', label: 'Accept in a defined, part-time way, hand clinical lead to your colleague with a proper handover, and keep a route back to the floor', desc: 'Your population view is worth more at the EOC than a second pair of hands is on the floor - provided the floor is properly handed over, not abandoned.', effect: { score: 5 },
          locked: function (log) {
            return log['ngata_school'] === 'B' ? 'Most of your clinical staff are still at the school - there is no one to hand clinical lead to' : false;
          } },
        { key: 'B', label: 'Refuse the role outright and stay on the clinical floor, where you can see patients and where two doctors are already doing the work of six', desc: 'Understandable, but it leaves the district’s health response without the one clinician who has seen what this looks like from the inside.', effect: { score: -2 } },
        { key: 'C', label: 'Accept the role fully and leave the clinical floor immediately, because the decisions made at the Civil Defence table will affect far more people', desc: 'Walking off the floor mid-response with no handover repeats the mistake of abandoning the casualty hub, just with better paperwork.', effect: { score: -4 } },
        { key: 'D', label: 'Try to hold both roles at once without handing anything over, so that neither the centre nor the coordination table loses its clinical lead', desc: 'Half a clinical lead and half a medical advisor - the failure mode that produces missed patients and bad district advice at the same time.', effect: { score: -5 } }
      ]
    },
    {
      time: 188, type: 'info', tag: 'NIGHT',
      title: 'Snow Closes In',
      body: 'The forecast snow arrives after dark. The carpark triage area cannot hold overnight, the welfare centre is full, ' +
        'and the temperature is dropping through zero. Everyone who is going to be treated tonight is already inside the ' +
        'building.',
      source: 'MetService / Civil Defence'
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
