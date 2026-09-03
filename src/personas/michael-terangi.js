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
    // No status bar: every item restated a panel row, and the strip is never
    // re-rendered, so it went stale as soon as a consequence moved the panel.
    statusBar: [],
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
        { label: 'Fuel Terminal', value: 'Offline', cls: 'failed' },
        { label: 'Rest Homes (O2)', value: 'At Risk', cls: 'failed' }
      ],
      transportTitle: 'Field Conditions',
      transport: [
        { label: 'Mountain Towers', value: 'Unknown', cls: 'unknown' },
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
        { icon: '❄️', name: 'Snow', level: 'High', cls: 'high' }
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
    'terangi_marae': { 'A': { crews: -8, generation: -10 } },
    'terangi_scada': { 'A': { comms: 10 }, 'B': { comms: -10 }, 'C': { crews: 10 }, 'D': { comms: -15 } },
    'terangi_eoc_priority': { 'A': { generation: -10 }, 'B': { generation: -30 }, 'D': { generation: -10 } },
    'terangi_rest_home': { 'A': { generation: -20, crews: -5 }, 'D': { generation: -8 } },
    'terangi_backfeed': { 'A': { crews: -10 }, 'B': { crews: -5 }, 'C': { crews: -5 } },
    'terangi_transmission': { 'A': { spares: -10 }, 'D': { crews: -15, spares: -15 } },
    'terangi_fuel_logistics': { 'A': { fuel: -15 }, 'B': { fuel: -30, generation: -20 }, 'C': { fuel: -25, crews: -20 }, 'D': { fuel: -35 } },
    'terangi_supermarket': { 'B': { crews: -10, spares: -10 } },
    'terangi_board': { 'A': { spares: 10 }, 'B': { generation: -15, spares: -10 }, 'D': { crews: -10 } },
    'terangi_estimate': { 'C': { comms: -5 } }
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
    'terangi_fatigue': { 'A': { crewSafety: 8, restoration: -2, stakeholder: -2 }, 'B': { crewSafety: -12, restoration: 3 }, 'C': { crewSafety: 3, restoration: -2 }, 'D': { crewSafety: -4 } },
    'terangi_scada': { 'A': { crewSafety: 9, restoration: -2, stakeholder: 3 }, 'B': { crewSafety: -12, restoration: 4 }, 'C': { restoration: -8, criticalServices: -5 }, 'D': { crewSafety: -8, restoration: -3 } },
    'terangi_eoc_priority': { 'A': { stakeholder: 8, criticalServices: 5, publicTrust: 4 }, 'B': { criticalServices: -8, publicTrust: -4 }, 'C': { stakeholder: -7, criticalServices: -3 }, 'D': { stakeholder: -10, publicTrust: -5 } },
    'terangi_rest_home': { 'A': { criticalServices: 9, publicTrust: 6, finances: -3 }, 'B': { criticalServices: -10, publicTrust: -7 }, 'C': { criticalServices: -7, publicTrust: -4 }, 'D': { criticalServices: -4, publicTrust: -3 } },
    'terangi_backfeed': { 'A': { crewSafety: 10, publicTrust: 4, restoration: -3 }, 'B': { crewSafety: -8, restoration: 2 }, 'C': { crewSafety: -5, publicTrust: -2 }, 'D': { crewSafety: -14 } },
    'terangi_transmission': { 'A': { stakeholder: 9, publicTrust: 5, restoration: 3 }, 'B': { stakeholder: -7, publicTrust: -4 }, 'C': { stakeholder: -9, publicTrust: -3 }, 'D': { restoration: -8, stakeholder: -5 } },
    'terangi_fuel_logistics': { 'A': { criticalServices: 8, restoration: 4, finances: 2 }, 'B': { criticalServices: -10, restoration: 3 }, 'C': { restoration: -9, criticalServices: 4 }, 'D': { criticalServices: -8, restoration: -5 } },
    'terangi_supermarket': { 'A': { publicTrust: 9, stakeholder: 5, finances: -2 }, 'B': { publicTrust: -12, stakeholder: -5, finances: 5 }, 'C': { publicTrust: -3, criticalServices: -3 }, 'D': { publicTrust: -12, stakeholder: -8 } },
    'terangi_board': { 'A': { stakeholder: 8, criticalServices: 6, finances: 3 }, 'B': { criticalServices: -10, publicTrust: -6, finances: 4 }, 'C': { stakeholder: -9, finances: -6 }, 'D': { publicTrust: -12, criticalServices: -6 } },
    'terangi_estimate': { 'A': { publicTrust: 9, stakeholder: 4 }, 'B': { publicTrust: -10, stakeholder: -4 }, 'C': { publicTrust: -6 }, 'D': { publicTrust: -12, stakeholder: -7 } }
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
    'terangi_fatigue': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { lifeSafety: 1 }, 'D': { decisive: -1 } },
    'terangi_scada': { 'A': { decisive: 1, lifeSafety: 2, centralized: 2 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -2, centralized: 1 }, 'D': { centralized: -2, lifeSafety: -1 } },
    'terangi_eoc_priority': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: 2, communityTrust: -1 }, 'C': { decisive: 1, centralized: -1, communityTrust: -1 }, 'D': { decisive: -1, communityTrust: -2 } },
    'terangi_rest_home': { 'A': { decisive: 2, lifeSafety: 2, communityTrust: 1 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: -2, lifeSafety: -1 }, 'D': { decisive: 1, lifeSafety: -1 } },
    'terangi_backfeed': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 1, lifeSafety: -1 }, 'C': { decisive: 1, lifeSafety: -1 }, 'D': { decisive: -1, lifeSafety: -2 } },
    'terangi_transmission': { 'A': { decisive: 2, centralized: 1, communityTrust: 1 }, 'B': { decisive: -2, centralized: 1 }, 'C': { centralized: 2, communityTrust: -1 }, 'D': { decisive: -1, lifeSafety: -1 } },
    'terangi_fuel_logistics': { 'A': { decisive: 1, lifeSafety: 1, centralized: 2 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: 1, lifeSafety: 1 }, 'D': { decisive: -2, centralized: -2 } },
    'terangi_supermarket': { 'A': { decisive: 1, centralized: 1, communityTrust: 2 }, 'B': { decisive: 1, communityTrust: -2 }, 'C': { decisive: 1, communityTrust: -1 }, 'D': { decisive: -1, communityTrust: -2 } },
    'terangi_board': { 'A': { decisive: 2, lifeSafety: 1, communityTrust: 1 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: 2, centralized: -2 }, 'D': { decisive: 1, lifeSafety: -2, communityTrust: -2 } },
    'terangi_estimate': { 'A': { decisive: 1, communityTrust: 2, centralized: 1 }, 'B': { decisive: 1, communityTrust: -1 }, 'C': { decisive: -2 }, 'D': { decisive: -1, communityTrust: -2 } }
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
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Field Crews', '6 avail', 'failed');
          updateCascadeItem('cascade-tracker', 'Rockfall / Slips', 'Extreme', 'extreme');
          updateUtilityDirect('crews', 20);
        }
      }
    },
    'terangi_scada': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Re-Energised Onto a Crew',
          body: 'Switching from stale telemetry, the control room closed a breaker onto a section a crew was still working. ' +
            'The earth was on and nobody was killed, but only because of the crew’s own discipline, not your system. Every ' +
            'switching operation is now frozen pending investigation, which is where you would have been anyway.',
          source: 'Control Room / Health & Safety',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'SCADA Visibility', 'Not Trusted', 'failed');
          updateCascadeItem('cascade-tracker', 'Live Lines', 'Extreme', 'extreme');
          updateUtilityDirect('comms', 10);
        }
      }
    },
    'terangi_eoc_priority': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Water Plant Goes Dark',
          body: 'With your portable generation committed exclusively to the EOC, the water treatment plant ran its backup dry. ' +
            'The town is now on a boil-water notice it cannot comply with, because it has no power to boil anything. The EOC ' +
            'is well lit and coordinating a problem you created.',
          source: 'Water Treatment / Public Health',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Water Treatment', 'Failed', 'failed');
          updateUtilityDirect('generation', 5);
        }
      }
    },
    'terangi_rest_home': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Two Residents Did Not Survive the Night',
          body: 'The concentrators failed at about two in the morning. Ambulances could not reach the homes on closed roads, ' +
            'which everyone knew when the decision was made. Two oxygen-dependent residents died. The homes were not on your ' +
            'critical-customer list, and that list was yours to write.',
          source: 'Health Authority / Coroner',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Rest Homes (O2)', 'Fatalities', 'failed');
          updatePanelItem('agency-status', 'Health Authority', '"Explain this"', 'failed');
        }
      }
    },
    'terangi_backfeed': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'A Lineworker Takes a Shock',
          body: 'A second resident had done exactly the same thing three streets away. A lineworker contacted a conductor he ' +
            'had every reason to believe was dead and is in the medical centre with burns. He tested; the generator started ' +
            'while he was working. The systemic fix was the public warning you did not send.',
          source: 'Health & Safety',
          scorePenalty: -7
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Live Lines', 'Extreme', 'extreme');
          updatePanelItem('transport-section', 'Live Conductors', 'Uncontrolled', 'failed');
          updatePanelItem('cdem-groups', 'Field Crews', '7 avail', 'failed');
        }
      }
    },
    'terangi_transmission': {
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Board Finds Out From the News',
          body: 'Civil Defence briefed the Government, the Government briefed the media, and your Board Chair learned that the ' +
            'transmission corridor is weeks from repair by watching the evening bulletin. The finding was right; withholding ' +
            'it from your own directors was not, and your authority with them is gone at the worst possible moment.',
          source: 'Board Chair',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Board Chair', '"Why the news?"', 'failed');
          updatePanelItem('cdem-groups', 'Transmission Faults', 'Weeks to Repair', 'failed');
        }
      }
    },
    'terangi_fuel_logistics': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Generators Run Dry Before the Network Is Back',
          body: 'The fleet is fuelled and moving, and the restoration is still days away. The generators keeping the water ' +
            'plant and the rest homes alive ran out overnight. Your crews had diesel to drive to faults they could not yet ' +
            'fix, while the loads that needed power tonight lost it.',
          source: 'Logistics / Critical Customers',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Water Treatment', 'Failed', 'failed');
          updatePanelItem('lifelines-section', 'Rest Homes (O2)', 'No Power', 'failed');
          updateCascadeItem('cascade-tracker', 'Fuel Shortage', 'Extreme', 'extreme');
          updateUtilityDirect('generation', 5);
        }
      }
    },
    'terangi_supermarket': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: '"They Sold the Queue"',
          body: 'The supermarket’s lights came on while three streets of houses stayed dark, and the payment did not stay ' +
            'secret for six hours. Every customer still waiting now believes the restoration order is for sale, the ' +
            'regulator has asked for the file, and your published priority list means nothing to anyone.',
          source: 'Media / Commerce Commission',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', '"Pay to jump"', 'failed');
          updatePanelItem('agency-status', 'Mayor', '"Explain yourself"', 'failed');
        }
      }
    },
    'terangi_board': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Restoring by Revenue',
          body: 'Industrial feeders came back while the hospital was still on generators and the rest homes were still on ' +
            'batteries. The basis leaked within a day. This is now a Ministerial matter, the regulator is involved, and the ' +
            'trust you will need for a two-year recovery has been spent to protect a quarter’s revenue.',
          source: 'Regulator / Minister',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Civil Defence', '"Unacceptable"', 'failed');
          updatePanelItem('agency-status', 'Media', '"Revenue first"', 'failed');
          updatePanelItem('lifelines-section', 'Hospital', 'Still on Backup', 'failed');
        }
      }
    },
    'terangi_estimate': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Day Six, Still Dark',
          body: 'The five-day figure you published became the promise. It is day six, the transmission corridor is untouched, ' +
            'and families who stayed in cold houses on the strength of your date are now evacuating in worse conditions than ' +
            'if they had left on day one. The range was the honest answer and it was available.',
          source: 'Civil Defence / Media',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', '"Broken promise"', 'failed');
          updatePanelItem('agency-status', 'Mayor', '"Lost the town"', 'failed');
        }
      }
    },
    'terangi_trapped_crew': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Your Crew Spent the Night in the Slip Zone',
          body: 'Told to sit tight until it was convenient, the trapped crew spent the night in an active rockfall zone in ' +
            'freezing conditions. They got out in the morning with one hypothermic and all four wondering what the company ' +
            'would have done if it had been worse. Every lineworker in the district now knows the answer.',
          source: 'Field Operations',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Trapped Crews', '1 overnight', 'failed');
          updateUtilityDirect('crews', 18);
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
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Field Crews', '5 avail', 'failed');
          updateCascadeItem('cascade-tracker', 'Rockfall / Slips', 'Extreme', 'extreme');
          updateUtilityDirect('crews', 15);
        }
      }
    },
    'terangi_crew_refusal': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Stop-Work Is Now Meaningless',
          body: 'You directed the crew leader to do the task anyway. The work was completed without incident, and something ' +
            'more expensive was lost: the next crew to judge a job unsafe will weigh whether it is worth their position ' +
            'first. You will not know which job that was until someone is hurt on it.',
          source: 'Health & Safety / Union',
          scorePenalty: -5
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Live Lines', 'Extreme', 'extreme');
          updateUtilityDirect('crews', 22);
        }
      }
    },
    'terangi_fatigue': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Near-Miss Becomes a Contact',
          body: 'Twenty-six hours in, a crew member who had already had one near-electrocution made contact with a live ' +
            'conductor. He is alive. He will not be back at work this year, and the investigation will ask why an exhausted ' +
            'crew was working live after a near-miss was reported to you.',
          source: 'Health & Safety / WorkSafe',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Field Crews', '5 avail', 'failed');
          updateCascadeItem('cascade-tracker', 'Live Lines', 'Extreme', 'extreme');
          updateUtilityDirect('crews', 10);
        }
      }
    },
    'terangi_marae': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: '350 People, A Second Cold Night',
          body: 'The urban feeders came back and the marae did not. Three hundred and fifty evacuees, including elderly ' +
            'residents and infants, spent a second night below zero with no heating, while 5,000 homes with intact heat ' +
            'pumps were restored ahead of them on a customer count.',
          source: 'Civil Defence / Marae Committee',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Civil Defence', '"Welfare failing"', 'failed');
          updatePanelItem('agency-status', 'Media', '"Rural abandoned"', 'failed');
        }
      }
    },
    'terangi_pm_briefing': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Timeline You Gave the Nation',
          body: 'The confident restoration date you gave at the national briefing is now being quoted back at you by every ' +
            'customer, the Mayor and the Minister. The transmission corridor has not moved. Every accurate thing you say ' +
            'from here is heard as another number that will slip.',
          source: 'Media / Minister',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', '"Which date now?"', 'failed');
          updatePanelItem('agency-status', 'Mayor', '"You promised"', 'failed');
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
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Water Treatment', 'Failed', 'failed');
          updatePanelItem('lifelines-section', 'Rest Homes (O2)', 'Failed', 'failed');
          updateUtilityDirect('generation', 5);
        }
      }
    },
    'terangi_hospital_water': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Both Critical Loads Lose Their Runway',
          body: 'Neither the hospital feeder nor the water treatment plant was prioritised in time. The hospital is on its ' +
            'last generator hours with theatres on the emergency circuit, and the town’s water supply is unsafe. Two loads ' +
            'were competing; choosing neither meant losing both.',
          source: 'Health Authority / Water Treatment',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Hospital', 'Critical', 'failed');
          updatePanelItem('lifelines-section', 'Water Treatment', 'Failed', 'failed');
        }
      }
    },
    'terangi_political': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Town Centre Came Back First',
          body: 'You restored the town centre because the Mayor asked loudest. The hospital is still on generators, the water ' +
            'plant is still failing, and the retail street is lit. The Health Authority has escalated to the Minister, and ' +
            'the restoration order now looks political rather than clinical - because it was.',
          source: 'Health Authority / Minister',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Health Authority', '"Escalating"', 'failed');
          updatePanelItem('lifelines-section', 'Hospital', 'Still on Backup', 'failed');
        }
      }
    },
    'terangi_helicopter': {
      'D': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Good Photographs, Same Problems',
          body: 'The tower inspection produced an excellent damage picture and nothing else. The weather closed within the ' +
            'hour, the trapped crew spent another night out, and the hospital generator problem was unchanged. You bought ' +
            'situational awareness with the only flight anyone was going to get.',
          source: 'Field Operations',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('transport-section', 'Mountain Towers', 'Mapped, Unreachable', 'failed');
          updatePanelItem('transport-section', 'Helicopters', 'Weathered In', 'failed');
          updateUtilityDirect('heli', 0);
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
    },
    'terangi_scada': {
      learningObjective: 'Operate a network safely when telemetry is unreliable - confirmation from a person, under a written rule.',
      bestPractice: 'A',
      teachingNote: 'Degraded SCADA is the condition in which lineworkers are killed. Switching from stale telemetry risks ' +
        'energising a fault or a crew; freezing all switching stops restoration entirely; letting depots switch independently ' +
        'guarantees they eventually energise each other’s people. Positive ground confirmation under an agreed safe-switching ' +
        'rule is slower and is the only defensible method.',
      references: [
        { label: 'Safe switching', desc: 'no switching without positive confirmation of the state of the network and the location of crews' },
        { label: 'Degraded telemetry', desc: 'stale SCADA is more dangerous than no SCADA because it looks authoritative' }
      ],
      discussionPrompts: [
        'What does "positive confirmation" mean when comms are intermittent?',
        'Who has authority to switch when the control room cannot see the network?'
      ]
    },
    'terangi_eoc_priority': {
      learningObjective: 'Hold a defensible critical-customer list against a powerful stakeholder asking for exclusivity.',
      bestPractice: 'A',
      teachingNote: 'The EOC is a genuine critical load, and so are the hospital, the water plant and the rest homes. The ' +
        'value of a published priority list is precisely that it lets you place the EOC high without giving it everything - ' +
        'and lets you refuse the next exclusive request on the same basis. Agreeing verbally while doing something else ' +
        'destroys the relationship you will need for a fortnight.',
      references: [
        { label: 'Critical customer lists', desc: 'a published, defensible basis is what makes a priority order survive pressure' },
        { label: 'Stakeholder management', desc: 'saying no with a stated basis preserves the relationship; saying yes falsely does not' }
      ],
      discussionPrompts: [
        'What is on your critical-customer list today, and who agreed it?',
        'How do you tell a coordination centre it is important but not exclusive?'
      ]
    },
    'terangi_rest_home': {
      learningObjective: 'Recognise a life-safety load that is missing from your list, and fix both the immediate risk and the list.',
      bestPractice: 'A',
      teachingNote: 'Oxygen-dependent residents on failing concentrators are a critical load whether or not the paperwork ' +
        'says so. The response has two halves: generation to all three homes tonight, and a corrected critical-customer list ' +
        'so this cannot recur. Deferring to an ambulance service that cannot reach them, or picking one home without a ' +
        'stated basis, are both indefensible afterwards.',
      references: [
        { label: 'Vulnerable customer registers', desc: 'medically dependent customers must be identified before the event, not during it' },
        { label: 'Life-safety loads', desc: 'a load is critical because of consequence, not because of its place on a list' }
      ],
      discussionPrompts: [
        'How would you know about a medically dependent customer who is not on your register?',
        'What would it take to get generation to three sites tonight, and who decides the order?'
      ]
    },
    'terangi_urban_rural': {
      learningObjective: 'Balance the greatest restored function against the most vulnerable customers, with an interim bridge.',
      bestPractice: 'A',
      teachingNote: 'This is population versus vulnerability in its cleanest form. Restoring 9,000 first maximises community ' +
        'function - including those customers’ own critical services - provided the vulnerable rural feeder is committed as ' +
        'the very next task and interim welfare or generation bridges the gap. Splitting a scarce crew across both usually ' +
        'restores neither, and deciding opaquely invites the "rural communities abandoned" story whatever you chose.',
      references: [
        { label: 'Restoration sequencing', desc: 'customer counts, vulnerability and interim options are three separate inputs' },
        { label: 'Transparency', desc: 'the basis for the order matters as much as the order itself' }
      ],
      discussionPrompts: [
        'What interim support makes a "you are next" commitment credible to the rural feeder?',
        'How do you explain this order to the 600 without sounding like you counted them and moved on?'
      ]
    },
    'terangi_backfeed': {
      learningObjective: 'Treat an unauthorised generator back-feed as a systemic hazard requiring a public warning, not a one-off fix.',
      bestPractice: 'A',
      teachingNote: 'A single back-feed found means others exist. The correct response has three parts: stop work and re-treat ' +
        'the whole area as live, locate and isolate the source, and get a public safety message out about generator ' +
        'connection - because the message is what stops the next three tonight. Relying on crews testing before touching is ' +
        'exactly the individual-practice defence that fails against a systemic hazard.',
      references: [
        { label: 'Generator back-feed', desc: 'unauthorised connection energises the network through the local transformer' },
        { label: 'Hierarchy of controls', desc: 'eliminate the systemic source; do not rely on individual behaviour as the last defence' }
      ],
      discussionPrompts: [
        'What does your public message say, and how does it reach people with no power and patchy cell coverage?',
        'How do your crews change their method for the rest of this event?'
      ]
    },
    'terangi_dairy': {
      learningObjective: 'Rank commercial loss below life safety and critical services, while still treating the economic harm as real.',
      bestPractice: 'A',
      teachingNote: 'A dairy factory losing a season’s milk is genuine economic damage to a major employer, and it still sits ' +
        'below residential life safety and critical services. The defensible answer restores those first, gives the dairy a ' +
        'real scheduled slot as soon as it does not delay them, and explains the basis openly. Promising a slot you cannot ' +
        'honour is worse than refusing one.',
      references: [
        { label: 'Restoration priority', desc: 'life safety, then critical services, then economic function' },
        { label: 'Commercial stakeholders', desc: 'a fair scheduled place with an honest explanation beats a false promise' }
      ],
      discussionPrompts: [
        'How do you tell a major employer their loss is real and still not first?',
        'What would make the dairy a critical load rather than a commercial one?'
      ]
    },
    'terangi_transmission': {
      learningObjective: 'Escalate material bad news immediately, to everyone who is planning against the old assumption.',
      bestPractice: 'A',
      teachingNote: 'A weeks-long transmission outage invalidates every plan in the district, so the entire value of the ' +
        'finding is in how fast it travels. Waiting for a verified estimate leaves everyone planning against a number you ' +
        'know is wrong; telling Civil Defence but not the Board is a governance failure as well as a practical one; and ' +
        'pushing on with the old plan spends crews on work that cannot deliver.',
      references: [
        { label: 'Escalation', desc: 'material findings are escalated on discovery, with the uncertainty stated' },
        { label: 'Governance', desc: 'directors cannot discharge their duties on information they do not have' }
      ],
      discussionPrompts: [
        'What is the minimum you can say in the first five minutes without a verified estimate?',
        'Who needs this finding, and what decision does each of them change because of it?'
      ]
    },
    'terangi_trapped_crew': {
      learningObjective: 'Treat a trapped crew as a rescue that outranks restoration - your people must be able to trust that you will come.',
      bestPractice: 'A',
      teachingNote: 'A trapped crew is a life-safety incident, not a scheduling problem. Coordinate the rescue with emergency ' +
        'services and account for every crew before pushing restoration in that area. Sending a second crew up the same ' +
        'unstable route risks two trapped crews; leaving them to self-rescue, or to "sit tight until convenient", tells every ' +
        'lineworker in the company exactly what their safety is worth.',
      references: [
        { label: 'Duty of care', desc: 'the employer’s obligation to workers in a hazard zone is not discretionary' },
        { label: 'Crew accounting', desc: 'know where every crew is before authorising work in the same area' }
      ],
      discussionPrompts: [
        'How do you account for eight crews when comms are intermittent?',
        'What does this decision teach the rest of your workforce about stopping work?'
      ]
    },
    'terangi_fuel_logistics': {
      learningObjective: 'Ration a shared scarce input between restoration capacity and life-safety generation, with a stated split.',
      bestPractice: 'A',
      teachingNote: 'The same diesel runs the trucks that will end the outage and the generators keeping people alive tonight. ' +
        'A stated split, reviewed each shift, keeps both running and makes the trade-off visible. Fuelling only the fleet ' +
        'bets lives on an optimistic restoration schedule; fuelling only generators guarantees there is no restoration to end ' +
        'the problem; and letting depots draw freely means the last critical load to ask goes without.',
      references: [
        { label: 'Resource rationing', desc: 'a stated, reviewed split beats first-come-first-served under scarcity' },
        { label: 'Competing demands', desc: 'the same input serving response and life support must be explicitly divided' }
      ],
      discussionPrompts: [
        'What is your split, and what evidence would change it at the next shift review?',
        'Who is authorised to draw fuel, and how do you enforce that across three depots?'
      ]
    },
    'terangi_helicopter': {
      learningObjective: 'Allocate a single scarce asset by life-safety consequence, not by information value or restoration speed.',
      bestPractice: 'A',
      teachingNote: 'One flight, four candidate missions. With your own people in danger, worker life safety takes the ' +
        'airframe. The hospital generator mission is a genuine life-safety alternative but the hospital still has backup, ' +
        'while the crew’s exposure is immediate. Crew delivery and tower inspection are both valuable and neither saves a ' +
        'life today.',
      references: [
        { label: 'Scarce asset allocation', desc: 'rank missions by consequence of not flying them, not by long-term value' },
        { label: 'Worker safety primacy', desc: 'a utility that will not fly for its own trapped crew cannot ask them to take risks' }
      ],
      discussionPrompts: [
        'What would have to be true for the hospital mission to outrank the rescue?',
        'How does the weather window change the calculation if it is closing in an hour?'
      ]
    },
    'terangi_supermarket': {
      learningObjective: 'Refuse to let restoration order be bought, while still assessing the underlying need on its merits.',
      bestPractice: 'A',
      teachingNote: 'The supermarket may genuinely deserve a high place as the town’s only food distribution - and that ' +
        'assessment must be made on the published list, not because money was offered. Accepting the payment tells every ' +
        'waiting customer the order is for sale; refusing to discuss it at all misses a real community need; and taking the ' +
        'money without delivering priority is worse than either.',
      references: [
        { label: 'Equity of restoration', desc: 'a priority order that can be purchased is not a priority order' },
        { label: 'Regulatory exposure', desc: 'preferential treatment for payment attracts regulator and Commission attention' }
      ],
      discussionPrompts: [
        'Does food distribution belong on your critical-customer list, and at what level?',
        'How do you say no to the money and yes to the need in the same conversation?'
      ]
    },
    'terangi_board': {
      learningObjective: 'Give the Board real financial control without letting revenue set the restoration order.',
      bestPractice: 'A',
      teachingNote: 'The Board’s concern is legitimate: revenue has stopped and the repair bill is unbounded. The answer is a ' +
        'scoped emergency spending envelope with regulator and Government cost-recovery engagement, minuted - not a ' +
        'resolution that bars the spend keeping a hospital alive, not going around the Board, and certainly not restoring by ' +
        'who pays most while rest homes sit on batteries.',
      references: [
        { label: 'Governance in emergencies', desc: 'directors retain financial oversight; management retains operational priority' },
        { label: 'Cost recovery', desc: 'regulatory and Government mechanisms exist and should be engaged early, not after the spend' }
      ],
      discussionPrompts: [
        'What does a scoped emergency spending envelope actually look like on paper?',
        'How do you record this so it protects both the community and the directors?'
      ]
    },
    'terangi_diesel': {
      learningObjective: 'Spend to protect life-critical services, scoped and documented, with cost recovery engaged in parallel.',
      bestPractice: 'A',
      teachingNote: 'Seven days of transmission repair with no emergency generation means the hospital, water plant and ' +
        'welfare centre run out. Hiring generation for those critical loads - staged, documented, with the Board, regulator ' +
        'and Government engaged on recovery - is life safety over short-term finances, done responsibly. Refusing protects ' +
        'the balance sheet at the community’s expense; unscoped "whatever it takes" may bankrupt the company the recovery ' +
        'depends on; and waiting for perfect costings is too slow for loads failing now.',
      references: [
        { label: 'Emergency procurement', desc: 'scope, stage and document; do not choose between unbounded and nothing' },
        { label: 'Cost recovery', desc: 'engage the regulator and Government while spending, not afterwards' }
      ],
      discussionPrompts: [
        'Which loads are in the scope, and who signs off adding one?',
        'What is the company’s position if cost recovery is later refused?'
      ]
    },
    'terangi_crew_refusal': {
      learningObjective: 'Protect the stop-work right of the person standing at the hazard.',
      bestPractice: 'A',
      teachingNote: 'The crew leader is the only person who can see the conditions. Backing the stop, reassessing with them ' +
        'and H&S, and proceeding only if the hazard is genuinely controlled is what keeps the whole workforce willing to ' +
        'raise concerns. Directing them from the office, or swapping in a more compliant crew, does not just risk this job - ' +
        'it teaches every crew that the next refusal will cost them, and you will never know which job that was.',
      references: [
        { label: 'Stop-work authority', desc: 'the worker at the hazard may cease work and must be supported for doing so' },
        { label: 'Safety culture', desc: 'a punished refusal suppresses the reporting the whole system depends on' }
      ],
      discussionPrompts: [
        'What does "genuinely controlled" mean here, and who verifies it?',
        'How do you protect the crew leader from consequences after the event?'
      ]
    },
    'terangi_estimate': {
      learningObjective: 'Publish an honest range with a fixed update schedule rather than a date you cannot hold.',
      bestPractice: 'A',
      teachingNote: 'Five to twenty days is an uncomfortable answer and it is the true one. Published with the reasons, what ' +
        'would narrow it, and a fixed next-update time, people can plan around it. The optimistic end becomes a promise you ' +
        'break; silence gets filled with worse numbers than yours; and different dates for different audiences collide ' +
        'within a day and take your remaining credibility with them.',
      references: [
        { label: 'Communicating uncertainty', desc: 'ranges with reasons and update commitments outperform false precision' },
        { label: 'Single version of the truth', desc: 'one published position to all audiences, or none of them believe any of it' }
      ],
      discussionPrompts: [
        'What would actually narrow the range, and can you tell people that?',
        'How often do you update, and what do you say when nothing has changed?'
      ]
    },
    'terangi_fatigue': {
      learningObjective: 'Enforce rest and rotation after a near-miss - exhausted crews near live conductors are a fatality waiting to happen.',
      bestPractice: 'A',
      teachingNote: 'A near-electrocution at twenty hours is the warning, and Civil Defence pressing for faster restoration ' +
        'does not change the physiology. Mandatory rest and rotation costs restoration hours and prevents the contact that ' +
        'costs a life. Leaving rest to self-report fails the most committed crews, and keeping the most experienced crews ' +
        'working does not make a fatigued lineworker safe - it just selects who has the accident.',
      references: [
        { label: 'Fatigue management', desc: 'error and reaction time degrade sharply past sustained shift limits' },
        { label: 'Near-miss reporting', desc: 'a reported near-miss is a control that only works if it changes what happens next' }
      ],
      discussionPrompts: [
        'How do you rotate rest when every crew believes they are needed?',
        'What do you say to Civil Defence when you stand crews down?'
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
    },
    {
      tag: 'NOISE', title: 'A Farmer Wants to Cut Your Line',
      body: 'A farmer is on the phone saying a low conductor is blocking his stock race and he intends to cut it himself if ' +
        'nobody comes in the next hour.',
      source: 'Call Centre',
      prompt: 'How do you handle the call?',
      options: [
        { key: 'A', label: 'Treat it as an immediate public-safety job: tell him to stay well clear, treat it as live, and get a crew or a standby there', desc: 'A member of the public about to cut a conductor is a life-safety call that outranks the restoration queue.', effect: { score: 2 } },
        { key: 'B', label: 'Tell him it is in the queue like everything else', desc: 'The queue does not apply to someone about to be electrocuted by your asset in the next hour.', effect: { score: -3 } },
        { key: 'C', label: 'Tell him to cut it if he is sure it is dead', desc: 'You cannot confirm it is dead, and telling a farmer to make that call himself is how this becomes a fatality.', effect: { score: -3 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Contractor Offers Crews at Four Times the Rate',
      body: 'An out-of-region contractor offers six additional crews immediately, at roughly four times the normal rate, ' +
        'payable on a handshake with paperwork to follow.',
      source: 'Procurement',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Take the crews if you genuinely need them, but on a written scope and rate you can defend to the Board and the regulator afterwards', desc: 'Surge capacity is worth paying for; a handshake with no scope is what turns a defensible emergency spend into an audit finding.', effect: { score: 2 } },
        { key: 'B', label: 'Refuse - the rate is exploitative', desc: 'Turning down needed crews on principle costs restoration days you cannot buy back.', effect: { score: -2 } },
        { key: 'C', label: 'Accept immediately on the handshake', desc: 'An unbounded verbal commitment at four times the rate is the invoice that ends up in front of a select committee.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Crew Is Filming for Social Media',
      body: 'A crew is posting live video from a worksite showing damaged assets and joking about the state of the network. ' +
        'It is getting shared widely.',
      source: 'Media Monitoring',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Stop the live posting from worksites, explain why, and set up a proper channel for the imagery people actually want', desc: 'Uncontrolled worksite footage creates safety and legal exposure; a sanctioned channel meets the same public appetite safely.', effect: { score: 2 } },
        { key: 'B', label: 'Leave it - the public likes seeing the crews working', desc: 'Unvetted footage of damaged assets and unguarded commentary will be the clip played back at the inquiry.', effect: { score: -2 } },
        { key: 'C', label: 'Discipline the crew publicly', desc: 'A public reprimand of exhausted crews doing their best costs you far more goodwill than the clip ever would.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Councillor Wants a Site Visit',
      body: 'A councillor wants to be taken to an active worksite this afternoon "to see the work and reassure residents", ' +
        'and has already told a reporter she is going.',
      source: 'Council Liaison',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Decline access to live worksites, and offer a properly escorted visit to a safe location with a real briefing', desc: 'Keeps an unqualified visitor away from live conductors while still giving her the visibility she legitimately needs.', effect: { score: 2 } },
        { key: 'B', label: 'Take her to the worksite - the relationship matters', desc: 'An unqualified visitor at a live worksite is a hazard to herself and a distraction to the crew working the line.', effect: { score: -3 } },
        { key: 'C', label: 'Refuse and say nothing further', desc: 'Correct on the safety point, and it hands her a story about a company with something to hide.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Your Own House Is Still Dark',
      body: 'Your partner calls: your own street is one of the last on the rural feeder, and a neighbour has asked - only ' +
        'half joking - whether the Managing Director might move his own line up the list.',
      source: 'Family',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Leave your own feeder exactly where the priority list puts it, and say so openly if anyone asks', desc: 'The credibility of the whole restoration order depends on it applying to you too - and being seen to.', effect: { score: 2 } },
        { key: 'B', label: 'Quietly ask the depot to bring your street forward', desc: 'The single fastest way to destroy every argument you have made about a defensible priority list.', effect: { score: -3 } },
        { key: 'C', label: 'Snap at your partner and hang up', desc: 'Understandable at hour twenty, and it costs you the support at home you are going to need for a fortnight.', effect: { score: -1 } }
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
        { key: 'B', label: 'Push all crews to restore as fast as they possibly can, because thirty-eight thousand customers are off and the town needs power tonight', desc: 'Driving crews into uncontrolled live-line, rockfall and aftershock hazards is how a restoration becomes a fatality.', effect: { score: -5 } },
        { key: 'C', label: 'Stand every crew down completely until the whole network has been assessed, so that nobody is working near live conductors on guesswork', desc: 'A blanket stop protects crews but needlessly delays power to tens of thousands, including critical services, where safe work was possible.', effect: { score: -2 } },
        { key: 'D', label: 'Leave it to each crew to decide for themselves what is safe, since they are the ones standing in front of the hazard and you are not', desc: 'No coordinated risk picture means inconsistent calls and crews making safety decisions without the information you hold.', effect: { score: -2 } }
      ]
    },
    {
      time: 16, type: 'decision', tag: 'NETWORK',
      title: 'Switching Blind',
      body: 'SCADA visibility is degraded and fibre communications are partly lost. Your control room can see perhaps a third ' +
        'of the network. Operations wants to start switching to isolate faults and re-energise what it can, working from the ' +
        'last known state and phone calls to crews.',
      decisionId: 'terangi_scada',
      prompt: 'How do you operate without visibility?',
      options: [
        { key: 'A', label: 'Switch only on positive confirmation from a person on the ground, under a written safe-switching rule agreed before anyone touches a breaker', desc: 'Without telemetry, a human confirmation and a written rule are the only things standing between a switching operation and an electrocution.', effect: { score: 5 } },
        { key: 'B', label: 'Switch from the last known SCADA state and correct as you go, since the picture was accurate an hour ago and the crews are waiting on you', desc: 'Re-energising from stale telemetry onto a fault - or onto crews who are working the line - is how lineworkers are killed.', effect: { score: -5 } },
        { key: 'C', label: 'Freeze all switching until SCADA visibility is restored, so that nobody operates a breaker without knowing the true state of the network', desc: 'Safe, and it also stops restoration entirely for a comms fix that may take days. Confirmed manual switching was available.', effect: { score: -3 } },
        { key: 'D', label: 'Let each depot switch its own area independently, since local crews know their own feeders better than anyone reading a screen in the control room', desc: 'Three depots switching a shared network without a common picture will eventually energise each other’s crews.', effect: { score: -4 } }
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
        { key: 'B', label: 'Restore the hospital first, since it is the most visible life-safety site in the district and the one everybody will ask about by morning', desc: 'Defaults to profile over runway; the hospital still had six hours while the water plant fails in two, risking the town’s drinking water.', effect: { score: -3 } },
        { key: 'C', label: 'Restore the wastewater pumps first to stop sewage backing up into the streets, because that becomes a public health emergency within hours', desc: 'An environmental problem is real but ranks below safe drinking water and the hospital for immediate life safety.', effect: { score: -4 } },
        { key: 'D', label: 'Wait until you have the crews and switching to restore both together, rather than commit to one and leave the other waiting on a promise', desc: 'Holding the one substation for a both-at-once solution lets the water plant fail while you wait.', effect: { score: -3 } }
      ]
    },
    {
      time: 34, type: 'decision', tag: 'OWNER',
      title: 'The EOC Wants Exclusive Priority',
      body: 'The Emergency Operations Centre requests exclusive priority restoration for its own facility, and asks you to ' +
        'commit your portable generation to it. The EOC is genuinely important. So are the hospital, the water treatment ' +
        'plant and three rest homes.',
      decisionId: 'terangi_eoc_priority',
      prompt: 'How do you answer the EOC?',
      options: [
        { key: 'A', label: 'Restore the EOC as one critical load among several on a published priority list you can defend, and offer interim generation sized to its actual need', desc: 'The EOC earns a high place on the list, not the whole list. A published basis is what lets you say no to the next exclusive request.', effect: { score: 5 } },
        { key: 'B', label: 'Give the EOC exclusive priority and commit your portable generation to it, since every other decision in the district is being made from that room', desc: 'Ties up the generation that the hospital, water plant and rest homes need, on the say-so of whoever asked first and loudest.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse the request - the EOC has its own generator and its own fuel, and can run on them like every other critical site in the district', desc: 'The coordination centre for the whole district is a genuine critical load; treating it as ordinary is its own failure.', effect: { score: -3 } },
        { key: 'D', label: 'Agree verbally to keep the Controller off your back, then quietly work to your own priority list, since arguing costs time you do not have', desc: 'Buys peace for an hour and destroys the working relationship you will depend on for the next fortnight.', effect: { score: -5 } }
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
        { key: 'B', label: 'Do what the Board Chair is asking and protect the major industrial customers, because they are the revenue that keeps the company solvent', desc: 'Lets commercial power jump the queue ahead of life safety and critical services. Indefensible when the public sees it.', effect: { score: -5 } },
        { key: 'C', label: 'Do what the Mayor is asking and restore the town centre first, since that is where the shops, the fuel and the visible signs of recovery are', desc: 'Political profile, not need, drives the order; the hospital, water and vulnerable wait behind the visible town centre.', effect: { score: -4 } },
        { key: 'D', label: 'Try to give every caller something so that nobody comes away empty-handed, and the pressure from all three directions eases off at once', desc: 'Fragmenting scarce crews to placate everyone restores nothing critical fully and satisfies no one.', effect: { score: -2 } }
      ]
    },
    {
      time: 46, type: 'decision', tag: 'ETHICAL',
      title: 'Rest Homes on Failing Concentrators',
      body: 'A rest home reports its oxygen concentrators are running on a backup that will not last the night, and two other ' +
        'homes are in the same position. None of them are on your published critical-customer list. All of them have ' +
        'residents who will not survive losing oxygen.',
      decisionId: 'terangi_rest_home',
      prompt: 'How do you respond to the rest homes?',
      options: [
        { key: 'A', label: 'Treat oxygen-dependent residents as a critical life-safety load: get interim generation to all three tonight, and add them to the critical-customer list permanently', desc: 'The list was wrong, and the fix is both immediate generation and a corrected list - so the next event does not repeat this.', effect: { score: 5 },
          locked: function (log) {
            return log['terangi_eoc_priority'] === 'B' ? 'Your portable generation is committed to the EOC under the exclusive-priority agreement' : false;
          } },
        { key: 'B', label: 'Tell them to call an ambulance if any resident deteriorates, since acute clinical need is a health system problem rather than a lines company one', desc: 'Pushes a foreseeable, preventable failure onto an ambulance service that cannot reach them on closed roads.', effect: { score: -6 } },
        { key: 'C', label: 'Add all three homes to the critical-customer list but do nothing further tonight, so the record is right and the work is scheduled properly', desc: 'Fixes the paperwork for next time and leaves oxygen-dependent residents to get through this night on a dying battery.', effect: { score: -4 } },
        { key: 'D', label: 'Send your one available generator to whichever home is worst off and leave the other two, so at least some of the residents are covered', desc: 'Three homes have the same need; picking one without a stated basis is an arbitrary decision you cannot defend.', effect: { score: -3 } }
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
        { key: 'B', label: 'Restore the six hundred rural customers first because they are older, more isolated, and have no realistic way of getting themselves to town', desc: 'Compassionate, but leaving 9,000 (including their own critical services) off for a much smaller group is hard to defend without an interim option.', effect: { score: -2 } },
        { key: 'C', label: 'Refuse to choose between them and split the crew across both jobs, so that neither community is told it came second to the other', desc: 'Splitting the repair crew likely restores neither group promptly and wastes scarce capacity.', effect: { score: -4 } },
        { key: 'D', label: 'Make the call quietly and avoid explaining the basis to anyone, since publishing a priority order simply invites everybody to argue with it', desc: 'Whatever you choose, doing it opaquely invites the "abandoned the rural communities" narrative and erodes trust.', effect: { score: -2 } }
      ]
    },
    {
      time: 58, type: 'decision', tag: 'NETWORK',
      title: 'Someone Has Back-Fed the Network',
      body: 'A crew reports a live low-voltage line in an area you believe is de-energised. A resident has wired a portable ' +
        'generator directly into their house switchboard, and it is back-feeding through the local transformer onto lines ' +
        'your people are working on.',
      decisionId: 'terangi_backfeed',
      prompt: 'How do you handle the back-feed?',
      options: [
        { key: 'A', label: 'Stop all work on that feeder immediately, treat every conductor in the area as live, locate and isolate the source, and get a public safety message out about generator back-feed', desc: 'One back-feed means there are others. Stop work, re-treat the area as live, and warn the public - the message is as urgent as the isolation.', effect: { score: 5 } },
        { key: 'B', label: 'Isolate that one transformer and carry on working elsewhere on the feeder, so the hazard is contained without stopping the whole restoration', desc: 'Fixes the one you found and leaves your crews working a network where any house could be doing the same thing.', effect: { score: -4 } },
        { key: 'C', label: 'Have the crew disconnect the resident’s generator and carry on with the work, since removing the source deals with the problem at its root', desc: 'Deals with the hazard in front of them but skips the warning that stops the next three residents doing it tonight.', effect: { score: -3 } },
        { key: 'D', label: 'Note it in the log and keep working, since every crew tests before touching and back-feed from a domestic generator is a known hazard', desc: 'Relies on perfect individual practice to survive a systemic hazard. This is precisely how lineworkers are electrocuted.', effect: { score: -6 } }
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
        { key: 'B', label: 'Restore the dairy first to save the milk in the vats and protect one of the largest customers on the network from a very public loss', desc: 'Puts a commercial loss ahead of residential life safety and critical services. The wrong order, and a damaging look.', effect: { score: -5 } },
        { key: 'C', label: 'Refuse the dairy any priority at all and tell them to wait their turn, because commercial loss does not outrank anything on a life-safety list', desc: 'The economic damage to a major employer is real; a flat "wait indefinitely" with no schedule is neither fair nor necessary.', effect: { score: -2 } },
        { key: 'D', label: 'Promise the dairy a restoration slot you already know you cannot honour, so the calls stop and you can get on with the work that matters', desc: 'A false commitment to placate a big customer destroys trust the moment it is missed.', effect: { score: -2 } }
      ]
    },
    {
      time: 70, type: 'decision', tag: 'NETWORK',
      title: 'The Transmission Corridor Is Worse Than Assumed',
      body: 'A crew reaching the main transmission corridor reports damage far beyond the initial assessment: multiple towers ' +
        'down, foundations undermined, and access only by helicopter. This is weeks of work, not days. Nobody outside that ' +
        'crew knows yet.',
      decisionId: 'terangi_transmission',
      prompt: 'What do you do with the finding?',
      options: [
        { key: 'A', label: 'Escalate immediately to the Board, National Grid, Civil Defence and Government, and re-plan the whole restoration around long-term islanded supply', desc: 'A weeks-long transmission outage changes every other plan in the district. The value of the finding is entirely in how fast it travels.', effect: { score: 5 } },
        { key: 'B', label: 'Hold the finding until you have a verified repair estimate, so that nobody is given a timeframe that has to be corrected in forty-eight hours', desc: 'Everyone else is planning against days, not weeks. Every hour you hold it is an hour of plans built on a number you know is wrong.', effect: { score: -4 } },
        { key: 'C', label: 'Tell Civil Defence but keep it from the Board and Government for now, so the operational response can be planned before the politics arrive', desc: 'Selective disclosure of material information to some stakeholders and not the Board is a governance failure as well as a practical one.', effect: { score: -5 } },
        { key: 'D', label: 'Keep pushing the existing restoration plan and hope the corridor proves repairable sooner than the first assessment suggests it will be', desc: 'Spends your crews on a plan you now know cannot work, and delays the islanded-supply strategy that could.', effect: { score: -5 } }
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
        { key: 'B', label: 'Press on with the restoration and let the crew sit tight until it is convenient to reach them, since they are uninjured and have shelter', desc: 'Treating a trapped crew as a lower priority than feeders tells every lineworker their safety is negotiable.', effect: { score: -5 } },
        { key: 'C', label: 'Send another crew in immediately by the same route, because your own people are cut off and nobody else is going to go and get them', desc: 'Rushing a second crew into the same active rockfall risks turning one trapped crew into two.', effect: { score: -3 } },
        { key: 'D', label: 'Wait for the crew to find their own way out, since they are experienced field staff who know that country better than any rescue team would', desc: 'Leaves your people to self-rescue from an active hazard with no coordinated support - an abdication of duty of care.', effect: { score: -3 } }
      ]
    },
    {
      time: 82, type: 'decision', tag: 'NETWORK',
      title: 'Fuel for Trucks or Fuel for Generators',
      body: 'The fuel terminal is offline and your reserve is finite. The same diesel runs your crew fleet and the portable ' +
        'generators keeping the water treatment plant and the rest homes alive. At the current burn rate you cannot supply ' +
        'both.',
      decisionId: 'terangi_fuel_logistics',
      prompt: 'How do you allocate the fuel?',
      options: [
        { key: 'A', label: 'Ration to a stated split - enough fleet fuel to keep crews productive, the balance reserved for life-safety generation - and review it every shift', desc: 'A stated, reviewed split keeps both restoration and life support running, and makes the trade-off visible instead of accidental.', effect: { score: 5 } },
        { key: 'B', label: 'Put the fuel into the crew fleet, because finishing the restoration is what ends the generator problem permanently rather than deferring it', desc: 'Restoration is days away; the water plant and the rest homes need power tonight. This bets lives on an optimistic schedule.', effect: { score: -5 } },
        { key: 'C', label: 'Put everything into the critical-load generators and stand the crews down, so that hospitals and water treatment are guaranteed through the night', desc: 'Keeps life support alive tonight by guaranteeing there is no restoration to end the problem - the generators then run dry anyway.', effect: { score: -4 } },
        { key: 'D', label: 'Let the depots draw fuel as they need it until it runs out, since the people closest to the work know best what their day requires', desc: 'Whoever draws first gets the fuel, and the last critical load to ask is the one that goes without.', effect: { score: -5 } }
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
        { key: 'A', label: 'Rescue the trapped workers first, because a life-safety mission for your own people outranks both inspection and restoration however urgent they are', desc: 'With your own people in danger, the single flight goes to getting them out. Worker life safety first, every time.', effect: { score: 5 } },
        { key: 'B', label: 'Deliver crews to the remote fault to speed up restoration, since the aircraft is the only way of reaching it and every hour counts', desc: 'Valuable for restoration, but choosing feeders over your trapped people when both are on the list is the wrong order.', effect: { score: -2 },
          locked: function (log) {
            return log['terangi_fuel_logistics'] === 'B' ? 'No aviation fuel was reserved - the airframe has one short mission in it, not a crew shuttle' : false;
          } },
        { key: 'C', label: 'Fly a generator out to the hospital to protect its power supply, so the most critical site in the district is covered before anything else', desc: 'A genuine life-safety mission - but the hospital still has backup, while the trapped crew’s safety is immediate.', effect: { score: 1 } },
        { key: 'D', label: 'Use the aircraft to inspect the transmission towers, because until you know the state of that corridor every plan you make is guesswork', desc: 'Situational awareness matters, but it does not save a life today the way the rescue does.', effect: { score: -1 },
          locked: function (log) {
            return log['terangi_fuel_logistics'] === 'B' ? 'No aviation fuel was reserved - a long inspection sortie is out of range' : false;
          } }
      ]
    },
    {
      time: 94, type: 'decision', tag: 'ETHICAL',
      title: 'A Supermarket Offers to Pay',
      body: 'A major supermarket chain offers to privately fund immediate repairs to its own feeder, in cash, today. It would ' +
        'genuinely help - the town has no other food distribution - and it would also put a paying customer ahead of ' +
        'everyone else waiting.',
      decisionId: 'terangi_supermarket',
      prompt: 'How do you handle the offer?',
      options: [
        { key: 'A', label: 'Decline the private queue-jump, but assess the supermarket on its merits as the town’s food distribution and place it on the published priority list where that justifies', desc: 'The supermarket may well deserve priority - as a food-distribution load, on a published basis, not because it offered money.', effect: { score: 5 } },
        { key: 'B', label: 'Accept the funding and restore their feeder today, since the money would pay for crew hours you cannot otherwise afford to put on', desc: 'The day your restoration order can be bought is the day every other customer stops believing the list means anything.', effect: { score: -5 } },
        { key: 'C', label: 'Refuse the offer outright and decline to discuss it any further, so there is no possibility of the conversation being misread later', desc: 'Right instinct on the money, but it also refuses to consider a genuine community food-distribution need on its merits.', effect: { score: -2 } },
        { key: 'D', label: 'Accept the money and quietly put them in the normal queue anyway, so the company is better off and the priority order stays untouched', desc: 'Taking payment for something you are not providing, and concealing it, is worse than either honest answer.', effect: { score: -6 } }
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
        { key: 'B', label: 'Override the Health and Safety advice and send the crews in, because this feeder carries the hospital and the restoration cannot wait for geology', desc: 'Sending crews under unstable rock faces over an explicit safety objection is how lineworkers are killed, and it is on you.', effect: { score: -6 } },
        { key: 'C', label: 'Let the supervisor and the crew make the call on the spot, since they can see the rock face and the H&S adviser is working from photographs', desc: 'Pushes an unacceptable, contested hazard decision down onto the people most exposed to it.', effect: { score: -3 } },
        { key: 'D', label: 'Delay any decision and leave the fault unaddressed for now, rather than either override a safety stop or formally abandon the repair', desc: 'Avoids the unsafe work but also abandons the restoration entirely, when a safer method or sequence was the answer.', effect: { score: -2 } }
      ]
    },
    {
      time: 106, type: 'inject', tag: 'CRITICAL',
      title: 'Hospital Backup Fails Two Hours Early',
      body: 'The hospital reports its backup generators have failed two hours earlier than the modelled runtime - fuel quality ' +
        'and a damaged transfer switch are both suspected. Theatres are running on the emergency circuit only, and the ' +
        'hospital is asking how long until its feeder is live.',
      source: 'Health Authority'
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
        { key: 'B', label: 'Restore the five thousand urban homes first, because the numbers are unambiguous and the greatest good is served by the largest restoration', desc: 'A raw customer-count rule abandons 350 vulnerable evacuees in the cold; numbers alone are not the priority basis.', effect: { score: -4 } },
        { key: 'C', label: 'Decide quietly in favour of the urban homes and avoid explaining the basis, since any published reasoning will be picked apart either way', desc: 'Even if the call were defensible, doing it opaquely guarantees the "rural communities abandoned" story.', effect: { score: -3 } },
        { key: 'D', label: 'Defer the decision to Civil Defence entirely and restore whatever they nominate, so the prioritisation sits with the agency coordinating welfare', desc: 'The feeder allocation is yours to make with Civil Defence’s welfare input - handing it off wholesale just stalls help.', effect: { score: -2 } }
      ]
    },
    {
      time: 128, type: 'decision', tag: 'OWNER',
      title: 'The Board Wants the Balance Sheet Protected',
      body: 'The Board Chair convenes an emergency meeting. Revenue has stopped, the repair bill is unbounded, and the Chair ' +
        'wants a resolution restricting unbudgeted emergency spending and prioritising the industrial customers who pay the ' +
        'most.',
      decisionId: 'terangi_board',
      prompt: 'What position do you take to the Board?',
      options: [
        { key: 'A', label: 'Argue for life-safety and community-function priority, propose a scoped emergency spending envelope with regulator and Government cost-recovery engagement, and get it in the minutes', desc: 'Gives the Board the financial control it is entitled to without letting revenue set the restoration order - and records the basis.', effect: { score: 5 } },
        { key: 'B', label: 'Accept the Board resolution restricting emergency spending, since the directors carry the financial duty and it is not your money to commit', desc: 'Hands the restoration order to the balance sheet at the exact moment the community needs it set by life safety.', effect: { score: -5 } },
        { key: 'C', label: 'Ignore the Board resolution and spend whatever the response requires, on the basis that life safety cannot wait for a governance process', desc: 'The Board’s financial oversight is legitimate; going around it loses you the authority you will need for the recovery.', effect: { score: -4 } },
        { key: 'D', label: 'Agree to prioritise industrial customers by revenue, so the company protects the income it will need to fund the whole recovery afterwards', desc: 'Restoring by who pays most, while a hospital and three rest homes wait, is the decision that ends careers and licences.', effect: { score: -6 } }
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
        { key: 'B', label: 'Give a confident, optimistic restoration timeline to reassure a frightened public, because uncertainty from the network operator reads as chaos', desc: 'A reassuring date you cannot meet destroys trust in every message that follows when the lights stay off.', effect: { score: -5 } },
        { key: 'C', label: 'Refuse to give any information at all until you know more, so that nothing said tonight has to be walked back in front of the country', desc: 'A vacuum at a national briefing fills with rumour; you can be honest about uncertainty without going silent.', effect: { score: -3 } },
        { key: 'D', label: 'Downplay the extent of the damage to avoid alarming people further, since there is nothing the public can do about a transmission corridor', desc: 'Minimising a seven-day transmission problem buys calm now and costs all credibility when the scale emerges.', effect: { score: -3 } }
      ]
    },
    {
      time: 142, type: 'cascade', tag: 'CASCADE',
      title: 'Snow Closes the Tops',
      body: 'Snow arrives across the ranges. The helicopter is grounded indefinitely, the mountain transmission towers cannot ' +
        'be reached on foot, and crews working at altitude are being pulled back down. Rural customers now face a second ' +
        'night below zero with no heating.',
      source: 'MetService / Field Operations'
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
        { key: 'A', label: 'Hire emergency generation for the critical loads (hospital, water, welfare), staged and documented, and engage the Board, regulator and Government on cost recovery', desc: 'Spends to keep life-critical services running, but scoped to what matters and with cost-recovery in train - life safety over short-term finances, responsibly.', effect: { score: 5 },
          locked: function (log) {
            return log['terangi_board'] === 'B' ? 'The Board resolution you accepted this afternoon bars unbudgeted emergency hire' : false;
          } },
        { key: 'B', label: 'Refuse the expense to protect the company’s finances, since nobody has yet confirmed who is paying and the Board has restricted your spending', desc: 'Saving money while critical services lose power for seven days trades community lives and function for the balance sheet.', effect: { score: -5 } },
        { key: 'C', label: 'Hire generation for everything regardless of cost on a whatever-it-takes basis, and argue about who pays for it once the lights are back on', desc: 'Unscoped, open-ended hire may bankrupt the company the community needs for its long recovery; "whatever it takes" still needs targeting.', effect: { score: -2 } },
        { key: 'D', label: 'Defer the decision until you have full costings and a funding commitment, so that nothing is committed without knowing where the money comes from', desc: 'Critical loads are failing now; waiting for perfect costings before protecting the hospital and water is too slow.', effect: { score: -3 } }
      ]
    },
    {
      time: 156, type: 'inject', tag: 'SITUATION',
      title: 'The Depots Are Running Dry',
      body: 'Two of your three depots report fleet diesel below a day. The terminal is still offline and the road south is ' +
        'closed. Crews are idling vehicles to charge tools and keep warm, which is burning the reserve faster than the ' +
        'model assumed.',
      source: 'Logistics'
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
        { key: 'B', label: 'Direct them to do the task as instructed, since the operations manager has assessed the risk as acceptable and somebody has to make the call', desc: 'Overriding a frontline safety refusal from the office is how you get someone hurt and destroy stop-work culture.', effect: { score: -5 } },
        { key: 'C', label: 'Replace them with a crew that will get on with it, because you cannot run a restoration where every task is open to negotiation', desc: 'Punishing a safety refusal by swapping in a more compliant crew is both dangerous and a signal no lineworker forgets.', effect: { score: -4 } },
        { key: 'D', label: 'Leave the operations manager and the crew leader to fight it out between them, since they are both experienced and closer to it than you are', desc: 'Ducking the call leaves a safety dispute unresolved at an active worksite, with no one backing the person at the hazard.', effect: { score: -3 } }
      ]
    },
    {
      time: 170, type: 'decision', tag: 'OWNER',
      title: 'The Town Wants a Date',
      body: 'Every channel is asking the same question: when will the power be back? Your honest answer is a range of five to ' +
        'twenty days depending on the transmission corridor, and the range is wider than anyone wants to hear.',
      decisionId: 'terangi_estimate',
      prompt: 'What do you publish?',
      options: [
        { key: 'A', label: 'Publish the honest range with the reasons, what would narrow it, and a fixed next-update time - and hold to that update schedule', desc: 'People can plan around an honest range with a known update time. They cannot plan around a confident date that moves every day.', effect: { score: 5 } },
        { key: 'B', label: 'Publish the optimistic end of the range, because a district that has been dark for two days needs something to hold on to tonight', desc: 'Five days becomes the promise, and every day past it is a broken one. Optimism published as fact is the fastest way to lose the town.', effect: { score: -5 } },
        { key: 'C', label: 'Publish nothing at all until the range narrows, so that the first number the public hears from you is one you can actually stand behind', desc: 'The silence gets filled with worse numbers than yours, and people make decisions on rumour instead of a range.', effect: { score: -3 } },
        { key: 'D', label: 'Publish a different date to each audience according to what they most need to hear, so every group gets an answer suited to their situation', desc: 'They talk to each other. The moment the versions collide you have no credibility left with any of them.', effect: { score: -6 } }
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
        { key: 'B', label: 'Push the crews on through another shift, because Civil Defence is asking for faster restoration and every hour off is an hour the town stays dark', desc: 'After a near-electrocution, driving exhausted crews on around live conductors gambles a lineworker’s life for hours of restoration.', effect: { score: -5 } },
        { key: 'C', label: 'Let crews rest only if they ask for it themselves, so that nobody is stood down while they still have something left in the tank', desc: 'The most committed crews never ask; leaving rest to self-report fails exactly the people most at risk of the next near-miss.', effect: { score: -1 } },
        { key: 'D', label: 'Keep the most experienced crews working and rest the others, since the difficult switching needs the people who have done it before', desc: 'Experience does not make a fatigued lineworker safe near live lines; it just changes who has the accident.', effect: { score: -3 } }
      ]
    },
    {
      time: 184, type: 'inject', tag: 'MEDIA',
      title: 'The Story Turns',
      body: 'A widely shared post claims Alpine Utilities has restored power to businesses while leaving families in the dark, ' +
        'with a photograph of a lit supermarket carpark as proof. The carpark is running on the supermarket’s own generator. ' +
        'The story is running anyway.',
      source: 'Media / Social Media'
    },
    {
      time: 188, type: 'info', tag: 'NIGHT',
      title: 'The Second Night',
      body: 'The second night without power begins across the rural network. Welfare centres are full, the marae is sheltering ' +
        '350, and the temperature is dropping below zero again. Your crews stand down in rotation for the first proper rest ' +
        'since the shaking stopped.',
      source: 'Civil Defence / Operations'
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
