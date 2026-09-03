// ============================================================================
// PERSONA: SEISMIC SCIENCE ADVISOR  -  Dr Maia Ellison
// Senior Seismic Hazard Scientist advising officials during a major Alpine
// Fault earthquake. The player gives fast, honest science advice under
// political pressure when the evidence is incomplete.
// Source brief: "Dr Maia Ellison" persona spec.
//
// Loaded AFTER nz-cascading-impact-simulator.js; registers itself by extending
// the engine's shared registries (purely additive).
// ============================================================================
(function () {
  'use strict';

  // ---- Config: header, status bar, classification, dashboards ---------------
  SCENARIO_CONFIGS.seismic = {
    label: 'SCIENCE ADVISOR',
    actorTitle: 'Science Advisor',
    classification: 'R3',
    classCSS: 'r3',
    classText: 'SCIENCE ADVISORY',
    debriefName: 'Alpine Fault — Science Advisory Cell',
    facObjective: 'fast, honest scientific advice when the evidence is incomplete, the consequences are severe, ' +
      'and decision-makers want certainty that science cannot yet provide. Key themes: separating fact from ' +
      'judgement, communicating calibrated uncertainty, protecting scientific integrity under political pressure, ' +
      'equitable allocation of scarce expert resources, and translating hazard into decision-ready consequences.',
    startScore: 50,
    metrics: {
      aftershockRisk: 'high', landslideDams: 3, geotechTeams: 2,
      adviceConfidence: 'low-moderate', isolatedCommunities: 12
    },
    // No status bar: every item restated a panel row, and the strip is never
    // re-rendered, so it went stale as soon as a consequence moved the panel.
    statusBar: [],
    panels: {
      groupsTitle: 'Hazard Assessment',
      groups: [
        { label: 'Landslide-Dam / Flood', value: 'Suspected', cls: 'degraded' },
        { label: 'Ground Deformation', value: 'Assessing', cls: 'unknown' },
        { label: 'Road Corridors', value: 'Unstable', cls: 'failed' },
        { label: 'Building / Structures', value: 'Damaged', cls: 'degraded' }
      ],
      agenciesTitle: 'Advice Recipients',
      agencies: [
        { label: 'Minister / NCMC', value: 'Pressuring', cls: 'degraded' },
        { label: 'CDEM Controllers', value: 'Awaiting', cls: 'degraded' },
        { label: 'Mayors', value: 'Anxious', cls: 'degraded' },
        { label: 'Infrastructure CEs', value: 'Lobbying', cls: 'degraded' },
        { label: 'Media', value: 'Demanding', cls: 'failed' },
        { label: 'Mana Whenua', value: 'Engaged', cls: 'good' }
      ],
      lifelinesTitle: 'Evidence Base',
      lifelines: [
        { label: 'GeoNet Feeds', value: 'Online', cls: 'good' },
        { label: 'Aerial Imagery', value: 'Partial', cls: 'degraded' },
        { label: 'Ground Inspection', value: 'None Yet', cls: 'failed' },
        { label: 'Drone Footage', value: 'Unverified', cls: 'degraded' },
        { label: 'Peer Review', value: 'Not Possible', cls: 'failed' }
      ],
      transportTitle: 'Exposed Sites',
      transport: [
        { label: 'Township Slope', value: 'High Risk', cls: 'failed' },
        { label: 'School Below Slope', value: 'High Risk', cls: 'failed' },
        { label: 'Alpine Pass', value: 'Rockfall', cls: 'failed' },
        { label: 'Hydro Dam', value: 'Uninspected', cls: 'unknown' },
        { label: 'Tourist Centres', value: 'Cut Off', cls: 'degraded' }
      ],
      cascadeTitle: 'Cascading Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '⛰️', name: 'Landslide Dams', level: 'High', cls: 'high' },
        { icon: '🌊', name: 'Breakout Floods', level: 'Moderate', cls: 'moderate' },
        { icon: '🪨', name: 'Rockfall', level: 'High', cls: 'high' },
        { icon: '🏔️', name: 'Slope Failure', level: 'High', cls: 'high' }
      ],
      resourcesTitle: 'Science Capacity'
    }
  };

  // ---- Science capacity (the resource meters) -------------------------------
  UTILITY_DEFAULTS.seismic = {
    geotech: { label: 'Geotech Teams', value: 25, unit: '%' },
    aerial: { label: 'Aerial Recon', value: 30, unit: '%' },
    modelling: { label: 'Modelling Capacity', value: 50, unit: '%' },
    fieldData: { label: 'Field Data', value: 20, unit: '%' },
    comms: { label: 'Briefing Bandwidth', value: 40, unit: '%' },
    peerReview: { label: 'Peer Review', value: 35, unit: '%' }
  };

  // ---- Response metrics (credibility / integrity dimensions) ----------------
  SOFT_METRIC_DEFAULTS.seismic = {
    sciCredibility: { label: 'Scientific Credibility', value: 65, icon: '🔬' },
    publicTrust: { label: 'Public Trust', value: 55, icon: '🤝' },
    officialConfidence: { label: 'Official Confidence', value: 60, icon: '🏛️' },
    integrity: { label: 'Scientific Integrity', value: 70, icon: '⚖️' },
    clarity: { label: 'Advice Clarity', value: 55, icon: '🗣️' },
    equity: { label: 'Equity of Advice', value: 50, icon: '🌐' }
  };

  // ---- Decision -> capacity-meter effects -----------------------------------
  Object.assign(UTILITY_EFFECTS, {
    'sci_landslide_dam': { 'A': { aerial: -5 }, 'B': { aerial: -5 } },
    'sci_road': { 'A': { geotech: -5 } },
    'sci_deploy': { 'A': { geotech: -15, fieldData: 10 }, 'B': { geotech: -15, fieldData: 5 }, 'C': { geotech: -15 } },
    'sci_peer_review': { 'A': { peerReview: -5, modelling: -5 }, 'B': { peerReview: 5 } },
    'sci_mana_whenua': { 'A': { geotech: -5, fieldData: 5 } },
    'sci_forecast_numbers': { 'A': { comms: -5 }, 'D': { comms: -15 } },
    'sci_drone': { 'A': { aerial: -5, fieldData: 5 }, 'B': { fieldData: -10 } },
    'sci_dam_evacuate': { 'A': { geotech: -10, comms: -10 } },
    'sci_school': { 'A': { geotech: -10 }, 'D': { comms: -10 } },
    'sci_hydro': { 'A': { geotech: -5, comms: -5 }, 'C': { comms: -15 } },
    'sci_reversal': { 'A': { comms: -10, modelling: 5 }, 'D': { comms: -5 } },
    'sci_tourists': { 'A': { comms: -15 }, 'D': { comms: -10 } },
    'sci_colleague': { 'A': { comms: -10, peerReview: 10 }, 'B': { peerReview: -15 }, 'D': { peerReview: -20 } },
    'sci_team_fatigue': { 'A': { modelling: -10, peerReview: 15 }, 'B': { modelling: -20 }, 'C': { modelling: -15 }, 'D': { modelling: -25 } }
  });

  // ---- Decision -> response-metric effects ----------------------------------
  Object.assign(SOFT_METRIC_EFFECTS, {
    'sci_aftershock': {
      'A': { sciCredibility: 6, integrity: 5, clarity: 5 },
      'B': { officialConfidence: -3, clarity: 2, integrity: 3 },
      'C': { officialConfidence: -8, clarity: -5 },
      'D': { integrity: -10, sciCredibility: -8, publicTrust: -5 }
    },
    'sci_messaging': {
      'A': { publicTrust: 8, clarity: 6, sciCredibility: 4 },
      'B': { clarity: -5, publicTrust: -2 },
      'C': { integrity: -8, publicTrust: 5, sciCredibility: -6 },
      'D': { publicTrust: -5, clarity: -3 }
    },
    'sci_deploy': {
      'A': { sciCredibility: 5, equity: 6, clarity: 4 },
      'B': { equity: -6, sciCredibility: -2 },
      'C': { clarity: -3 },
      'D': { officialConfidence: -5 }
    },
    'sci_landslide_dam': {
      'A': { sciCredibility: 5, clarity: 5, integrity: 4 },
      'B': { officialConfidence: -3 },
      'C': { integrity: -8, publicTrust: -6, sciCredibility: -6 },
      'D': { officialConfidence: -3, publicTrust: -3, clarity: -2 }
    },
    'sci_road': {
      'A': { sciCredibility: 6, clarity: 6, integrity: 4, officialConfidence: 3 },
      'B': { officialConfidence: -3 },
      'C': { integrity: -10, sciCredibility: -8 },
      'D': { officialConfidence: -6, clarity: -4 }
    },
    'sci_minister': {
      'A': { integrity: 8, sciCredibility: 5, clarity: 4 },
      'B': { integrity: -12, sciCredibility: -8, publicTrust: -5 },
      'C': { integrity: 6, officialConfidence: -6 },
      'D': { integrity: 7, officialConfidence: -2 }
    },
    'sci_conflicting': {
      'A': { clarity: 7, sciCredibility: 6, integrity: 5 },
      'B': { officialConfidence: -5, clarity: -3 },
      'C': { integrity: -6, sciCredibility: -4 },
      'D': { officialConfidence: -5 }
    },
    'sci_certainty': {
      'A': { clarity: 8, sciCredibility: 6, officialConfidence: 5, integrity: 4 },
      'B': { integrity: -6, sciCredibility: -5, officialConfidence: 3 },
      'C': { officialConfidence: -6, clarity: -4 },
      'D': { clarity: 2 }
    },
    'sci_peer_review': {
      'A': { integrity: 6, clarity: 5, sciCredibility: 4, publicTrust: 3 },
      'B': { publicTrust: -4 },
      'C': { integrity: -8, sciCredibility: -6 },
      'D': { publicTrust: -4, equity: -3 }
    },
    'sci_maps': {
      'A': { publicTrust: 8, clarity: 6, equity: 4, integrity: 4 },
      'B': { publicTrust: -8, integrity: -6 },
      'C': { clarity: -4, publicTrust: -2 },
      'D': { publicTrust: -5, equity: -4 }
    },
    'sci_mana_whenua': {
      'A': { equity: 8, publicTrust: 6, integrity: 5, clarity: 3 },
      'B': { equity: -6, publicTrust: -4 },
      'C': { equity: -8, publicTrust: -6, integrity: -3 },
      'D': { clarity: -3 }
    },
    'sci_leak': {
      'A': { publicTrust: 8, clarity: 6, sciCredibility: 5, integrity: 4 },
      'B': { integrity: -12, publicTrust: -8, sciCredibility: -6 },
      'C': { publicTrust: -5 },
      'D': { clarity: -2, publicTrust: -2 }
    },
    'sci_equity': {
      'A': { equity: 10, publicTrust: 6, integrity: 4 },
      'B': { equity: -10, publicTrust: -5 },
      'C': { equity: -3 },
      'D': { officialConfidence: -4, equity: -2 }
    },
    'sci_forecast_numbers': {
      'A': { clarity: 10, publicTrust: 6, sciCredibility: 4 },
      'B': { clarity: -8, publicTrust: -4 },
      'C': { clarity: -5, sciCredibility: -4 },
      'D': { integrity: -10, publicTrust: -7 }
    },
    'sci_drone': {
      'A': { sciCredibility: 8, publicTrust: 5, integrity: 4 },
      'B': { sciCredibility: -10, integrity: -6 },
      'C': { sciCredibility: -6, publicTrust: -4 },
      'D': { publicTrust: -5, clarity: -3 }
    },
    'sci_dam_evacuate': {
      'A': { officialConfidence: 9, integrity: 6, clarity: 5 },
      'B': { officialConfidence: -9, publicTrust: -6 },
      'C': { officialConfidence: -10, clarity: -6 },
      'D': { integrity: -9, sciCredibility: -5 }
    },
    'sci_school': {
      'A': { integrity: 9, clarity: 6, officialConfidence: 4 },
      'B': { integrity: -12, sciCredibility: -7 },
      'C': { officialConfidence: -8, clarity: -5 },
      'D': { sciCredibility: -6, officialConfidence: -4 }
    },
    'sci_hydro': {
      'A': { integrity: 9, sciCredibility: 6, officialConfidence: 3 },
      'B': { integrity: -10, sciCredibility: -6 },
      'C': { publicTrust: -8, officialConfidence: -6 },
      'D': { integrity: -7, officialConfidence: -4 }
    },
    'sci_reversal': {
      'A': { integrity: 11, sciCredibility: 7, publicTrust: 5 },
      'B': { integrity: -11, publicTrust: -7 },
      'C': { integrity: -10, sciCredibility: -6 },
      'D': { integrity: -4, publicTrust: -3 }
    },
    'sci_tourists': {
      'A': { equity: 10, clarity: 7, publicTrust: 4 },
      'B': { clarity: -7, equity: -4 },
      'C': { equity: -11, publicTrust: -5 },
      'D': { equity: -8, clarity: -8 }
    },
    'sci_colleague': {
      'A': { sciCredibility: 10, integrity: 7, publicTrust: 4 },
      'B': { sciCredibility: -11, integrity: -7 },
      'C': { publicTrust: -6, officialConfidence: -4 },
      'D': { integrity: -12, sciCredibility: -8 }
    },
    'sci_team_fatigue': {
      'A': { sciCredibility: 8, integrity: 5, clarity: -2 },
      'B': { sciCredibility: -10, integrity: -5 },
      'C': { clarity: -5, sciCredibility: -3 },
      'D': { officialConfidence: -8, clarity: -5 }
    }
  });

  // ---- Decision -> leadership-style axes -------------------------------------
  // decisive = act on incomplete evidence vs wait; lifeSafety = precaution;
  // centralized = single firm directive vs presenting options/uncertainty;
  // communityTrust = transparency / vulnerable-community orientation.
  Object.assign(STYLE_TAGS, {
    'sci_aftershock': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'C': { decisive: -2, centralized: -2 }, 'D': { decisive: 2, lifeSafety: -2 } },
    'sci_messaging': { 'A': { decisive: 1, communityTrust: 1, centralized: 1 }, 'B': { decisive: -1, centralized: -1 }, 'C': { decisive: 1, communityTrust: -1 }, 'D': { decisive: -2 } },
    'sci_deploy': { 'A': { decisive: 1, lifeSafety: 2, communityTrust: 1 }, 'B': { decisive: 1, lifeSafety: -1, centralized: 1 }, 'C': { decisive: -1 }, 'D': { decisive: -2, lifeSafety: -1 } },
    'sci_landslide_dam': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { decisive: -2, lifeSafety: -1 }, 'C': { decisive: -2, lifeSafety: -2 }, 'D': { decisive: 2, lifeSafety: 2, centralized: 1 } },
    'sci_road': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, lifeSafety: 2 }, 'C': { decisive: 2, lifeSafety: -2 }, 'D': { decisive: -2, centralized: -2 } },
    'sci_minister': { 'A': { decisive: 1, centralized: 1 }, 'B': { decisive: 1, communityTrust: -1, lifeSafety: -1 }, 'C': { decisive: 2, centralized: 1 }, 'D': { decisive: 0, centralized: -1 } },
    'sci_conflicting': { 'A': { decisive: 1, centralized: 1, lifeSafety: 1 }, 'B': { decisive: -1, centralized: -2 }, 'C': { decisive: 2, centralized: 2 }, 'D': { decisive: -2 } },
    'sci_certainty': { 'A': { decisive: 1, centralized: 1 }, 'B': { decisive: 2, centralized: 1 }, 'C': { decisive: -2, centralized: -1 }, 'D': { decisive: 0 } },
    'sci_peer_review': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 1 }, 'B': { decisive: -2, lifeSafety: -1 }, 'C': { decisive: 2, lifeSafety: 1, centralized: 1 }, 'D': { centralized: 1, communityTrust: -1 } },
    'sci_maps': { 'A': { decisive: 1, communityTrust: 2 }, 'B': { decisive: -1, communityTrust: -2, centralized: 1 }, 'C': { decisive: 1, communityTrust: 1 }, 'D': { centralized: 1, communityTrust: -1 } },
    'sci_mana_whenua': { 'A': { communityTrust: 2, lifeSafety: 1, decisive: 1 }, 'B': { communityTrust: -2, decisive: -1 }, 'C': { communityTrust: -2, decisive: 1, lifeSafety: -1 }, 'D': { lifeSafety: 1, decisive: 1 } },
    'sci_leak': { 'A': { decisive: 1, communityTrust: 1, centralized: 1 }, 'B': { decisive: 1, communityTrust: -2 }, 'C': { decisive: -2 }, 'D': { decisive: 0, centralized: 1 } },
    'sci_equity': { 'A': { communityTrust: 2, lifeSafety: 1, decisive: 1 }, 'B': { communityTrust: -2, centralized: 1 }, 'C': { decisive: -1 }, 'D': { decisive: -2, centralized: -2 } },
    'sci_forecast_numbers': { 'A': { decisive: 1, communityTrust: 2, centralized: 1 }, 'B': { decisive: -1, communityTrust: -1 }, 'C': { decisive: 1, centralized: 1 }, 'D': { decisive: 1, communityTrust: -2, centralized: 1 } },
    'sci_drone': { 'A': { decisive: 1, communityTrust: 2, centralized: 1 }, 'B': { decisive: 2, centralized: -1 }, 'C': { decisive: 1, communityTrust: -2 }, 'D': { decisive: -2, communityTrust: -1 } },
    'sci_dam_evacuate': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -2, lifeSafety: -2 }, 'C': { decisive: -2, centralized: -2 }, 'D': { decisive: 2, lifeSafety: 1, communityTrust: -2 } },
    'sci_school': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -2, centralized: -2 }, 'D': { decisive: 1, lifeSafety: 1, communityTrust: -1 } },
    'sci_hydro': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: -1, lifeSafety: -2 }, 'C': { decisive: 2, communityTrust: -2 }, 'D': { decisive: -2, centralized: -1 } },
    'sci_reversal': { 'A': { decisive: 2, communityTrust: 2, centralized: 1 }, 'B': { decisive: 1, communityTrust: -2 }, 'C': { decisive: -1, communityTrust: -2 }, 'D': { decisive: 1, communityTrust: -1 } },
    'sci_tourists': { 'A': { decisive: 1, lifeSafety: 2, communityTrust: 2 }, 'B': { decisive: 1, centralized: 1, communityTrust: -1 }, 'C': { decisive: -1, communityTrust: -2 }, 'D': { decisive: 2, lifeSafety: -2 } },
    'sci_colleague': { 'A': { decisive: 1, communityTrust: 2, centralized: -1 }, 'B': { decisive: 2, communityTrust: -2 }, 'C': { decisive: -2 }, 'D': { decisive: 1, centralized: 2, communityTrust: -2 } },
    'sci_team_fatigue': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -1, centralized: 1 }, 'D': { decisive: 1, lifeSafety: -1 } }
  });

  // ---- Consequence chains (reactive injects from poor choices) --------------
  Object.assign(CONSEQUENCE_MAP, {
    'sci_aftershock': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Responder Caught in Secondary Slope Failure',
          body: 'Acting on your advice that it was broadly safe to continue, crews pressed on in an active landslide zone. ' +
            'A further aftershock triggered a secondary slope failure across a worksite. Responders are now injured and ' +
            'a rescue has become a rescue-of-the-rescuers. Your advice will be scrutinised line by line.',
          source: 'USAR / Incident Safety',
          scorePenalty: -5
        }
      }
    },
    'sci_road': {
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Rockfall Strikes a Convoy on the Reopened Road',
          body: 'The road reopened on your "safe enough" advice. An aftershock-triggered rockfall came down onto a supply ' +
            'convoy on the corridor, with casualties and the route now closed again indefinitely. The framing "is it safe?" ' +
            'was the wrong question, and answering "yes" has cost lives and the access you were trying to restore.',
          source: 'NZ Police / Roading',
          scorePenalty: -5
        }
      }
    },
    'sci_minister': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Softened Advice Overtaken by Events',
          body: 'The slope failed two days after your advice was softened to "no immediate evidence of further failure." ' +
            'The original wording — "a credible risk of further slope failure" — is now public alongside the edited line. ' +
            'The story has shifted from the hazard to whether science advice was politically filtered, and your ' +
            'credibility is the casualty.',
          source: 'Media / Science Advisory Panel',
          scorePenalty: -4
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', 'Filtered Advice?', 'failed');
          updateCascadeItem('cascade-tracker', 'Slope Failure', 'Extreme', 'extreme');
        }
      }
    },
    'sci_forecast_numbers': {
      'D': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Two Versions, Side by Side',
          body: 'A controller forwarded the official briefing to a community meeting and someone put it next to the public '
            + 'bulletin. The numbers do not match. Nobody now believes either version, and the question being asked is not '
            + 'about aftershocks - it is about what else you have given two answers on.',
          source: 'Media / CDEM Controllers',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', 'Two Versions', 'failed');
          updatePanelItem('agency-status', 'CDEM Controllers', 'Losing Faith', 'failed');
        }
      }
    },
    'sci_drone': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Feature Was a Farm Track',
          body: 'Ground inspection reached the slope and the long tension crack on your published hazard map is a stock '
            + 'track. It has been in every product, briefing and news bulletin for six hours, and two agencies have made '
            + 'resourcing decisions on it. The real crack, when found, is somewhere else.',
          source: 'Geotech Team / Field',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Drone Footage', 'Discredited', 'failed');
          updatePanelItem('cdem-groups', 'Ground Deformation', 'Map Withdrawn', 'failed');
          updateUtilityDirect('fieldData', 5);
        }
      }
    },
    'sci_dam_evacuate': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Dam Overtops at 03:40',
          body: 'The breakout came at the early end of your range, before the ground data you were waiting for and before '
            + 'the weather cleared. Three hundred and forty people were downstream. Most got out on the siren; the ones who '
            + 'did not were the ones who had never been told to expect it.',
          source: 'CDEM Controller / GeoNet',
          scorePenalty: -9
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Breakout Floods', 'Extreme', 'extreme');
          updateCascadeItem('cascade-tracker', 'Landslide Dams', 'Extreme', 'extreme');
          updatePanelItem('cdem-groups', 'Landslide-Dam / Flood', 'Breached', 'failed');
        }
      }
    },
    'sci_school': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Debris Across the Playground',
          body: 'The school reopened on your clearance. A M5.2 aftershock on the Tuesday brought material down the slope '
            + 'and across the top playground, twenty minutes before morning break. Nobody was outside. The review will ask '
            + 'what assessment the clearance was based on, and the answer is none.',
          source: 'School Board / Ministry',
          scorePenalty: -9
        },
        stateChange: function () {
          updatePanelItem('transport-section', 'School Below Slope', 'Debris On Site', 'failed');
          updateCascadeItem('cascade-tracker', 'Slope Failure', 'Extreme', 'extreme');
        }
      }
    },
    'sci_hydro': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Operator Finds Damage It Missed',
          body: 'Nine days later the operator’s own follow-up inspection finds abutment damage its initial assessment did '
            + 'not pick up. Your advice adopted their conclusion without independent data, so the record shows the science '
            + 'advisor endorsed it. Two settlements sat below that structure for nine days on your endorsement.',
          source: 'Hydro Operator / Regulator',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('transport-section', 'Hydro Dam', 'Damage Found', 'failed');
          updatePanelItem('agency-status', 'Infrastructure CEs', 'Revising', 'failed');
        }
      }
    },
    'sci_reversal': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Somebody Kept the Old Map',
          body: 'A journalist had downloaded the earlier version and noticed the silent edit. The story is now that the '
            + 'hazard map was quietly changed without explanation. An open correction would have been a paragraph about '
            + 'evidence; the silent one is a story about concealment.',
          source: 'Media',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', 'Silent Edit', 'failed');
          updatePanelItem('lifelines-section', 'Peer Review', 'Under Scrutiny', 'failed');
        }
      }
    },
    'sci_tourists': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Nine Hundred People on the Rockfall Road',
          body: 'Told to evacuate with no destination, three lodges emptied onto the only road out - the alpine pass you '
            + 'had flagged as an active rockfall corridor. Two vehicles were struck. The instruction was followed exactly '
            + 'as given, which is the problem.',
          source: 'NZ Police / Tourist Centres',
          scorePenalty: -8
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Rockfall', 'Extreme', 'extreme');
          updatePanelItem('transport-section', 'Alpine Pass', 'Casualties', 'failed');
          updatePanelItem('transport-section', 'Tourist Centres', 'Self-Evacuated', 'failed');
        }
      }
    },
    'sci_colleague': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'You Made It About Her',
          body: 'The attack on her credibility is now the story, and it has done what her original post could not: convinced '
            + 'a large audience that the official advice cannot withstand scrutiny. Compliance with the evacuation has '
            + 'dropped noticeably since this morning.',
          source: 'Media / Science Advisory Panel',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', 'Running the Feud', 'failed');
          updatePanelItem('lifelines-section', 'Peer Review', 'Fractured', 'failed');
          updateUtilityDirect('peerReview', 5);
        }
      }
    },
    'sci_team_fatigue': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Error That Was Not Caught',
          body: 'The 22:00 forecast went out with a transposed magnitude threshold. Two controllers stood down cordons on '
            + 'the strength of it before the correction reached them at midnight. Nobody was hurt, and the reason nobody '
            + 'was hurt has nothing to do with any decision you made.',
          source: 'CDEM Controllers / Internal Review',
          scorePenalty: -8
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'CDEM Controllers', 'Stood Down Cordons', 'failed');
          updatePanelItem('lifelines-section', 'Peer Review', 'Failed', 'failed');
          updateUtilityDirect('modelling', 10);
        }
      }
    },
    'sci_certainty': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Certainty You Did Not Have',
          body: 'The firm figure you gave to end the pressure held for eleven hours. When the sequence departed from it, '
            + 'every recipient concluded not that the science had updated but that you had been guessing all along - and '
            + 'the honest ranges you publish from here are read the same way.',
          source: 'CDEM Controllers / Media',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'CDEM Controllers', 'Discounting You', 'failed');
          updatePanelItem('agency-status', 'Mayors', 'Sceptical', 'failed');
        }
      }
    },
    'sci_leak': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Draft Is Public and Uncontextualised',
          body: 'The leaked draft is circulating without its caveats, its confidence bands or the paragraph explaining what '
            + 'it does not cover. It is being read as a suppressed true version of the advice, and the actual published '
            + 'advice now looks like the sanitised one.',
          source: 'Media',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', 'Running the Draft', 'failed');
          updatePanelItem('agency-status', 'Minister / NCMC', 'Demanding Answers', 'failed');
        }
      }
    },
    'sci_deploy': {
      'D': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Both Teams Still in the Carpark',
          body: 'While you scoped all five demands properly, both geotech teams sat idle and the weather closed. Twelve '
            + 'hours into the response you have no ground data from anywhere, every piece of advice you have given rests '
            + 'on imagery alone, and the slope above the township is still unassessed.',
          source: 'Geotech Teams / Field',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('lifelines-section', 'Ground Inspection', 'None At All', 'failed');
          updatePanelItem('cdem-groups', 'Ground Deformation', 'No Data', 'failed');
          updateUtilityDirect('fieldData', 5);
        }
      }
    }
  });

  // ---- Facilitator notes -----------------------------------------------------
  Object.assign(FACILITATOR_NOTES, {
    'sci_road': {
      learningObjective: 'Reframe "is it safe?" into tolerable-risk terms and give decision-ready conditions.',
      bestPractice: 'A',
      teachingNote: 'No road is safe after a major earthquake; the honest answer states the risk level and the conditions ' +
        'under which the risk is tolerable. Escorted, essential-only convoys with rockfall watch and timing windows give ' +
        'officials a usable option without a false "yes" or an unhelpful flat "no".',
      references: [
        { label: 'Risk-based advice', desc: 'express residual risk and tolerability, not binary safe/unsafe' },
        { label: 'GeoNet aftershock forecasts', desc: 'aftershock-triggered rockfall remains elevated for weeks' }
      ],
      discussionPrompts: [
        'What conditions would change your advice from "controlled access" to "closed"?',
        'Who owns the residual-risk decision once you have stated the risk clearly?'
      ]
    },
    'sci_minister': {
      learningObjective: 'Protect the meaning of science advice under political pressure; improve clarity, not certainty.',
      bestPractice: 'A',
      teachingNote: 'Plain language and diluted risk are not the same thing. Keep the credible-risk message and make it ' +
        'clearer and more usable; if asked to change the meaning, document the original advice and escalate through the ' +
        'science advisory chain. Softened advice that is later overtaken by events destroys trust in all future advice.',
      references: [
        { label: 'Principles of science advice', desc: 'advice should be free of, and seen to be free of, political filtering' }
      ],
      discussionPrompts: [
        'Where is the line between "clearer plain English" and "changed meaning"?',
        'What is your record-keeping so the original advice survives any later dispute?'
      ]
    },
    'sci_certainty': {
      learningObjective: 'Communicate calibrated uncertainty that is decision-ready, not falsely precise.',
      bestPractice: 'A',
      teachingNote: 'A single percentage looks decisive but invites over-trust of incomplete evidence. Confidence bands ' +
        '(low / moderate / high) tied to explicit decision implications and trigger points give decision-makers something ' +
        'they can act on while honestly conveying what is and is not known.',
      references: [
        { label: 'Calibrated uncertainty language', desc: 'IPCC-style confidence framing for decision-makers' }
      ],
      discussionPrompts: [
        'What decision does each confidence band imply for the official in front of you?',
        'What new evidence would move your confidence up or down a band?'
      ]
    },
    'sci_maps': {
      learningObjective: 'Default to transparency; withholding hazard information rarely prevents harm and erodes trust.',
      bestPractice: 'A',
      teachingNote: 'People living below a landslide dam have a right to know. Release simplified, plain-language risk ' +
        'areas with clear "what to do" guidance, holding back only raw technical detail that would mislead. Withholding to ' +
        'avoid panic backfires badly if the hazard later materialises.',
      references: [
        { label: 'Risk communication', desc: 'informed publics act more safely than uninformed ones' }
      ],
      discussionPrompts: [
        'What is the smallest, clearest version of this map that still serves the exposed public?',
        'What is your plan if the map is wrong in either direction?'
      ]
    },
    'sci_mana_whenua': {
      learningObjective: 'Treat mātauranga and local knowledge as a credible hazard signal, integrated with technical advice.',
      bestPractice: 'A',
      teachingNote: 'Long observation of the land is evidence, not noise. Integrate mātauranga as corroborating information, ' +
        'act precautionarily on a plausible signal, and prioritise technical confirmation — rather than dismissing a real ' +
        'warning because it has not yet been validated by instruments.',
      references: [
        { label: 'Mātauranga Māori in hazard advice', desc: 'local and indigenous knowledge as a complementary evidence base' }
      ],
      discussionPrompts: [
        'How do you weight a strong local signal against the absence of technical confirmation?',
        'What does precautionary action look like while you seek that confirmation?'
      ]
    },
    'sci_landslide_dam': {
      learningObjective: 'Give provisional, clearly-labelled advice in time to act, then reassess at trigger points.',
      bestPractice: 'A',
      teachingNote: 'Waiting for certainty can mean waiting until it is too late. Recommend precautionary evacuation of the ' +
        'clearly exposed flood path now, label it provisional with its assumptions and confidence, and set the trigger ' +
        '(aerial confirmation / daylight) for reassessment — rather than over-evacuating or saying nothing.',
      references: [
        { label: 'Landslide-dam / breakout flood', desc: 'dams can fail rapidly and without warning; exposure is downstream' }
      ],
      discussionPrompts: [
        'What is the smallest area you can evacuate that still covers the credible flood path?',
        'What is the explicit trigger that would cancel or extend the evacuation?'
      ]
    },
    'sci_aftershock': {
      learningObjective: 'Communicate aftershock likelihood as a decision-ready statement rather than a raw probability or a reassurance.',
      bestPractice: 'A',
      teachingNote: 'Aftershock forecasts are probabilistic and the audience is operational. The skill is stating what the '
        + 'sequence is likely to do, what that means for the decisions in front of controllers right now, and what would '
        + 'change the picture. Both failure modes - burying it in technical caveats and flattening it into reassurance - '
        + 'leave the recipient to invent their own interpretation.',
      references: [
        { label: 'Aftershock forecasting', desc: 'sequences decay predictably in aggregate and not at all individually' },
        { label: 'Decision-ready advice', desc: 'state the implication for the decision, not only the parameter' }
      ],
      discussionPrompts: [
        'What decision is the controller actually making with this forecast?',
        'How do you convey that a decaying sequence still includes large events?'
      ]
    },
    'sci_forecast_numbers': {
      learningObjective: 'Publish a probability with the decision frame that stops people converting it into a yes or a no.',
      bestPractice: 'A',
      teachingNote: 'Sixty-three per cent is read as "an earthquake is coming" by half the audience and "probably fine" by '
        + 'the other half. The number needs a plain-English translation: what to expect, what it does not predict, and what '
        + 'would change it. Dropping the figure removes the precision that lets a controller compare this week with next '
        + 'and invites the accusation of concealment; publishing different versions to different audiences collides within '
        + 'a day.',
      references: [
        { label: 'Probabilistic communication', desc: 'a probability without a decision frame is completed by the reader' },
        { label: 'One version', desc: 'the same figure to every audience, or none of them trust any of it' }
      ],
      discussionPrompts: [
        'Write the one sentence that translates 63 per cent into an action.',
        'What would you say to a school board asking whether that means it is safe to reopen?'
      ]
    },
    'sci_messaging': {
      learningObjective: 'Write hazard messaging for the people who have to act on it, not for the people who wrote it.',
      bestPractice: 'A',
      teachingNote: 'Technically precise language that nobody acts on has failed, and simplified language that overstates '
        + 'certainty has failed differently. The target is plain, concrete wording that preserves the actual meaning and '
        + 'the actual uncertainty - and that a lodge manager, a mayor and a parent all take the same thing from.',
      references: [
        { label: 'Plain language', desc: 'preserve meaning and uncertainty while removing jargon' },
        { label: 'Actionability', desc: 'messaging that does not change a behaviour has not communicated a hazard' }
      ],
      discussionPrompts: [
        'Who is the least technical person who must act on this message?',
        'What behaviour are you actually trying to change?'
      ]
    },
    'sci_deploy': {
      learningObjective: 'Allocate scarce expert teams by life exposure and consequence, accepting incomplete coverage.',
      bestPractice: 'A',
      teachingNote: 'Two teams and five sites means somewhere goes unassessed. Triage by who is underneath the hazard - the '
        + 'township slope above homes and the school below it - and cover the rest by imagery and remote methods. '
        + 'Prioritising access restoration puts economics above life exposure; splitting thinly means no site gets a usable '
        + 'assessment; and holding both while you scope perfectly leaves unstable slopes above people with no data at all.',
      references: [
        { label: 'Expert triage', desc: 'allocate scarce specialist capacity by exposure and consequence' },
        { label: 'Partial coverage', desc: 'a proper assessment of two sites beats a token look at five' }
      ],
      discussionPrompts: [
        'Which site are you accepting you will not assess today, and how do you say so?',
        'What can imagery and remote methods genuinely cover in the meantime?'
      ]
    },
    'sci_drone': {
      learningObjective: 'Treat unverified public imagery as a tasking lead, never as evidence in an authoritative product.',
      bestPractice: 'A',
      teachingNote: 'Crowd-sourced imagery is genuinely useful and it is not verified data. Task verification against it and '
        + 'say publicly that you are checking it and what you can and cannot yet confirm. Putting an unverified feature on '
        + 'a hazard map means every downstream product carries an error you cannot trace; dismissing it publicly risks '
        + 'being wrong about something significant; ignoring it entirely leaves it shaping behaviour without you.',
      references: [
        { label: 'Crowd-sourced data', desc: 'valuable as a lead, unusable as evidence until independently verified' },
        { label: 'Provenance', desc: 'an unverified feature in an authoritative product contaminates everything built on it' }
      ],
      discussionPrompts: [
        'What would it take to verify this, and how long?',
        'What do you say publicly while verification is still running?'
      ]
    },
    'sci_dam_evacuate': {
      learningObjective: 'Give a clear precautionary recommendation under wide uncertainty, with the uncertainty stated and a review point set.',
      bestPractice: 'A',
      teachingNote: 'A plausible breakout within 12 to 48 hours, 340 people downstream, a closing weather window and no '
        + 'ground data is exactly the situation the precautionary principle exists for. Recommend evacuation, say plainly '
        + 'how wide the uncertainty is and why, and commit to a review point. Waiting for data you cannot get is a decision '
        + 'to do nothing; handing it back as "an operational matter" withholds the judgement the Controller came for; and '
        + 'overstating certainty to force the right action spends credibility every later warning needs.',
      references: [
        { label: 'Precautionary principle', desc: 'wide uncertainty plus catastrophic downside favours the protective action' },
        { label: 'Review points', desc: 'a stated trigger for revisiting the advice is what makes precaution proportionate' }
      ],
      discussionPrompts: [
        'How do you recommend evacuation while being honest that you might be wrong?',
        'What is the review point, and who owns cancelling the evacuation?'
      ]
    },
    'sci_school': {
      learningObjective: 'Distinguish "no evidence of instability" from "assessed and cleared" when children are the exposed population.',
      bestPractice: 'A',
      teachingNote: 'You cannot clear a slope you have not assessed, and the absence of evidence from work you have not done '
        + 'is not evidence of absence. The useful answer names the specific assessment required and how long it would take, '
        + 'so the board can plan an alternative rather than simply hearing no. Declining to advise leaves a school board '
        + 'guessing about a slope; recommending permanent closure goes far beyond the evidence.',
      references: [
        { label: 'Absence of evidence', desc: 'an unassessed slope is unknown, not safe' },
        { label: 'Actionable refusal', desc: 'name the work required and the timeframe so the recipient can plan' }
      ],
      discussionPrompts: [
        'What specific assessment would let you clear this slope, and how long does it take?',
        'What do you offer the board instead of Monday?'
      ]
    },
    'sci_hydro': {
      learningObjective: 'Avoid adopting the conclusion of the party with the largest interest, without alarming the public.',
      bestPractice: 'A',
      teachingNote: 'The operator may well be right, and you have no independent data on a structure above two settlements '
        + 'that experienced design-exceeding shaking. Stating that you cannot corroborate their assessment, recommending '
        + 'independent inspection and recording that formally is the whole of your role. Adopting their conclusion makes it '
        + 'yours; questioning the dam publicly alarms two settlements on no evidence; and calling it a regulatory matter '
        + 'ignores that it is a hazard above people.',
      references: [
        { label: 'Independent verification', desc: 'the asset owner is not a neutral source on its own asset' },
        { label: 'Formal record', desc: 'advice that is not recorded did not happen, from a review point of view' }
      ],
      discussionPrompts: [
        'What is the difference between "I cannot corroborate this" and "I think it is unsafe"?',
        'Who do you record the recommendation with, and what happens if it is declined?'
      ]
    },
    'sci_conflicting': {
      learningObjective: 'Resolve genuine scientific disagreement into a single usable position without hiding the disagreement.',
      bestPractice: 'A',
      teachingNote: 'Controllers cannot act on two competing expert views, and pretending consensus exists where it does not '
        + 'is dishonest. The workable answer states the shared position, names where experts genuinely differ and what '
        + 'would resolve it, and gives one recommendation to act on. Presenting the disagreement raw paralyses the '
        + 'recipient; suppressing the dissenting view destroys the process that produced it.',
      references: [
        { label: 'Expert elicitation', desc: 'structured methods exist for producing one position from divergent expert views' },
        { label: 'Honest consensus', desc: 'state the agreed core, the genuine divergence, and the single recommendation' }
      ],
      discussionPrompts: [
        'What do the disagreeing experts actually agree on?',
        'What evidence would settle the difference, and can you get it?'
      ]
    },
    'sci_peer_review': {
      learningObjective: 'Preserve as much scientific quality control as the timeframe allows, and be explicit about what was skipped.',
      bestPractice: 'A',
      teachingNote: 'Full peer review is not available at response tempo and abandoning review altogether is how errors reach '
        + 'controllers. A rapid internal check, a named second reviewer and an explicit statement of what has and has not '
        + 'been reviewed keeps the advice usable and honest about its own status.',
      references: [
        { label: 'Rapid review', desc: 'a proportionate check beats both full review and none' },
        { label: 'Declaring review status', desc: 'recipients weigh advice differently when they know how it was checked' }
      ],
      discussionPrompts: [
        'What is the minimum review that still catches the errors that matter?',
        'How do you label the review status of a product on its face?'
      ]
    },
    'sci_reversal': {
      learningObjective: 'Correct published error openly and quickly - a visible correction is a demonstration of method, not a failure.',
      bestPractice: 'A',
      teachingNote: 'The risk conclusion is unchanged and the specifics you published are wrong, and people navigated by the '
        + 'specifics. Saying what changed, why, and what it does and does not change about the risk demonstrates that your '
        + 'advice tracks evidence rather than reputation. A silent map edit will be noticed and reads as concealment; '
        + 'leaving a known error in a published hazard product is indefensible; burying the correction in an annex gets '
        + 'none of the credibility benefit.',
      references: [
        { label: 'Open correction', desc: 'visible correction strengthens credibility; silent revision destroys it' },
        { label: 'Version control', desc: 'assume every published product has been downloaded and will be compared' }
      ],
      discussionPrompts: [
        'How do you frame a correction so it reads as method rather than incompetence?',
        'Who needs to hear it directly before it is published?'
      ]
    },
    'sci_tourists': {
      learningObjective: 'Write advice that survives being relayed by non-experts to people with no local knowledge.',
      bestPractice: 'A',
      teachingNote: 'Nine hundred visitors, limited English, no local knowledge, and your advice reaching them through a '
        + 'satellite phone and a lodge manager. The instruction has to be short, concrete and translatable - what to do, '
        + 'where to go, what signal to act on - and confirmed by having it repeated back. A technical bulletin will not '
        + 'survive the relay; treating the centres as outside your priority set abandons people inside the hazard zone; '
        + 'and "evacuate immediately" with no destination sends them onto rockfall corridors.',
      references: [
        { label: 'Relayed messaging', desc: 'advice that passes through intermediaries must be testable by repeat-back' },
        { label: 'Destination, not just direction', desc: 'an evacuation instruction without a destination creates new exposure' }
      ],
      discussionPrompts: [
        'Write the instruction in under forty words.',
        'How do you confirm the lodge manager understood it correctly?'
      ]
    },
    'sci_colleague': {
      learningObjective: 'Handle public scientific disagreement on the substance, in the open, without attacking the person.',
      bestPractice: 'A',
      teachingNote: 'A qualified colleague working from public data only has reached a different conclusion, and she is being '
        + 'amplified by people who want the evacuation reversed. Responding on the substance - the field data she does not '
        + 'have, where you genuinely agree, and an offer of the dataset - strengthens the advice and models how science '
        + 'works. Attacking her credibility becomes the story and convinces observers you could not answer; silence lets '
        + 'the counter-narrative erode compliance with a live evacuation; asking her institution to silence her is a far '
        + 'bigger story than the disagreement.',
      references: [
        { label: 'Scientific disagreement in public', desc: 'engage the evidence; the personal frame always loses' },
        { label: 'Data sharing', desc: 'offering the dataset is the fastest route from disagreement to agreement' }
      ],
      discussionPrompts: [
        'What does she not have, and can you give it to her today?',
        'Where is she actually right, and can you say so publicly?'
      ]
    },
    'sci_leak': {
      learningObjective: 'Respond to a leaked draft by publishing the full context fast, rather than confirming, denying or attacking.',
      bestPractice: 'A',
      teachingNote: 'A draft circulating without its caveats and confidence bands is being read as the suppressed true '
        + 'version. The recovery is to put the complete picture out quickly - what the draft was, what changed and why, and '
        + 'what the current advice is - so the full context outruns the fragment. Ignoring it leaves the fragment as the '
        + 'authoritative version, and hunting the leaker makes the leak the story.',
      references: [
        { label: 'Leaked drafts', desc: 'context published fast beats denial, confirmation or silence' },
        { label: 'Draft discipline', desc: 'assume any draft that exists may become public without its caveats' }
      ],
      discussionPrompts: [
        'What is the fastest complete statement you can publish in the next twenty minutes?',
        'How does the way you draft change once you assume drafts leak?'
      ]
    },
    'sci_team_fatigue': {
      learningObjective: 'Protect the accuracy of hazard products by reducing scope and rotating people, not by adding review to exhausted staff.',
      bestPractice: 'A',
      teachingNote: 'Two errors caught by chance in an hour means there are uncaught ones, and a wrong hazard product '
        + 'propagates into every decision built on it. Rotate people off, cut back to the products that genuinely drive '
        + 'decisions, and put a second pair of eyes on anything published. Pushing through produces the error that reaches '
        + 'a controller; adding review steps loads more work onto the people the fatigue is affecting; standing the team '
        + 'down entirely leaves a live evacuation with no hazard view.',
      references: [
        { label: 'Fatigue and analytical error', desc: 'error rates rise sharply and self-detection falls at the same time' },
        { label: 'Scope reduction', desc: 'fewer products, checked, beats more products with untraced errors' }
      ],
      discussionPrompts: [
        'Which products actually drive decisions tonight, and which are habit?',
        'Who checks the checker at hour twenty-two?'
      ]
    },
    'sci_equity': {
      learningObjective: 'Allocate scarce scientific attention by hazard exposure and vulnerability, not by who is loudest or wealthiest.',
      bestPractice: 'A',
      teachingNote: 'Infrastructure chief executives, mayors and the Minister all have channels to you; isolated and remote '
        + 'communities generally do not. Prioritising by exposure and vulnerability, and explicitly naming the remote '
        + 'communities in the allocation, is what stops scientific attention flowing to the loudest voice. The pattern is '
        + 'easy to see afterwards and almost invisible while it is happening.',
      references: [
        { label: 'Equity in advice', desc: 'access to the advisor is itself unequally distributed' },
        { label: 'Explicit inclusion', desc: 'naming under-represented communities in the allocation is what makes it happen' }
      ],
      discussionPrompts: [
        'Who has not asked you for anything today, and why not?',
        'How would you know if your attention had been following the loudest voices?'
      ]
    }
  });

  // ---- Ambient distractions (noise) -----------------------------------------
  NOISE_POOL.seismic = [
    {
      tag: 'NOISE', title: 'Junior Scientist Wants to Post a Personal Take',
      body: 'A capable junior in your team wants to post their own interpretation of the aftershock data to social media ' +
        '"to counter the misinformation." It is plausible but unreviewed and would carry your institute’s implied authority.',
      source: 'Science Team',
      prompt: 'How do you handle the junior’s post?',
      options: [
        { key: 'A', label: 'Channel their energy into the official briefing line instead of a personal post', desc: 'Keeps a single authoritative voice and protects them from carrying institutional risk on a personal account. The instinct is good; the channel is wrong.', effect: { score: 2 } },
        { key: 'B', label: 'Let them post — more voices counter misinformation', desc: 'An unreviewed personal take with implied institutional authority is exactly how the next "scientists disagree" story is born.', effect: { score: -2 } },
        { key: 'C', label: 'Tell them to stay off social media entirely and drop it', desc: 'Shuts down a motivated team member without redirecting the energy. The misinformation still needs an answer.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Vendor Pushing an AI Landslide Predictor',
      body: 'A vendor is urgently offering an "AI landslide prediction" tool, claiming it can forecast failures hours ahead. ' +
        'It is unvalidated for this terrain and they want you to cite it in advice today.',
      source: 'Vendor / Procurement',
      prompt: 'How do you respond to the vendor?',
      options: [
        { key: 'A', label: 'Decline to rely on it now; offer to evaluate it properly after the response', desc: 'An unvalidated tool cited in life-safety advice is a liability, however good the demo. Evaluation belongs after the crisis, not in it.', effect: { score: 2 } },
        { key: 'B', label: 'Use it — any extra signal helps right now', desc: 'Citing an unvalidated black box as a basis for evacuation advice stakes lives and your credibility on a sales claim.', effect: { score: -2 } },
        { key: 'C', label: 'Forward it to officials and let them decide', desc: 'Passes a procurement distraction into the decision chain mid-crisis instead of simply parking it.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'International Network Wants a Live Cross',
      body: 'A major international news network wants you live on air in 10 minutes, mid-analysis, for a global audience. It ' +
        'would raise the profile of the response but pull you off the briefing you are preparing for Controllers.',
      source: 'Media Liaison',
      prompt: 'How do you handle the live-cross request?',
      options: [
        { key: 'A', label: 'Decline now; have the media liaison schedule it after the Controller briefing', desc: 'Your first duty is decision-ready advice to the people running the response. Global TV can wait 30 minutes.', effect: { score: 2 } },
        { key: 'B', label: 'Do the live cross now — the profile is valuable', desc: 'Trading the Controllers’ briefing for a TV hit puts your visibility ahead of the decisions that actually save lives.', effect: { score: -2 } },
        { key: 'C', label: 'Send the junior scientist to do it instead', desc: 'Hands a high-stakes global interview to your least experienced person under time pressure. Risky.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Politician Misquotes Your Advice',
      body: 'In a press conference a politician has just said "the scientists have confirmed the area is now stable" — which ' +
        'is not what you advised. It is already being clipped and shared.',
      source: 'Media Monitoring',
      prompt: 'How do you respond to the misquote?',
      options: [
        { key: 'A', label: 'Issue a prompt, factual correction of the specific claim without attacking the politician', desc: 'A misstatement about stability is a life-safety problem, not just a PR one. Correct the claim fast and plainly before people act on "stable".', effect: { score: 2 } },
        { key: 'B', label: 'Let it go to avoid a public clash', desc: 'Leaving "the area is now stable" uncorrected may send people back into a hazard zone on your implied authority.', effect: { score: -3 } },
        { key: 'C', label: 'Call the politician privately and ask them to fix it', desc: 'Right instinct, but the clip is already spreading; a private call alone will not catch up with it.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Another Coordination Meeting Requested',
      body: 'A fourth agency wants you personally in a standing coordination meeting that overlaps the window you had set aside ' +
        'to analyse the new aerial imagery. They say it is "important for alignment."',
      source: 'Coordination Cell',
      prompt: 'How do you handle the meeting request?',
      options: [
        { key: 'A', label: 'Send a delegate with your current advice and protect the analysis window', desc: 'Your scarcest contribution is the analysis only you can do. Represented, not absent — and the imagery gets reviewed.', effect: { score: 2 } },
        { key: 'B', label: 'Attend personally to keep everyone aligned', desc: 'Being in every meeting is how the expert stops doing the expert work. The imagery sits unreviewed while you align.', effect: { score: -1 } },
        { key: 'C', label: 'Skip it and send nothing', desc: 'Protects your time but leaves a coordination gap and a frustrated partner agency. A delegate was the better answer.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'An Overseas Researcher Wants Your Raw Data',
      body: 'A well-known overseas research group asks for your raw field data immediately, offering rapid analysis in '
        + 'return and mentioning a paper.',
      source: 'International Colleagues',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Share what is already public now, agree data-sharing terms for the rest through the proper channel, and keep your team focused on the response', desc: 'Real analytical help is worth having, and it cannot come at the cost of response bandwidth or unagreed data terms.', effect: { score: 2 } },
        { key: 'B', label: 'Send everything immediately - more eyes is better', desc: 'Unagreed release of field data mid-response creates competing public analyses of your own hazard picture.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore the request', desc: 'A two-line reply keeps a useful relationship alive at no cost to the response.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Documentary Crew Wants to Film You Working',
      body: 'A documentary crew has arrived at the operations room and wants to film the science team at work "for the '
        + 'historical record".',
      source: 'Media',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Decline access to the operations room, and offer a short structured interview at a set time instead', desc: 'A camera in the room changes how people speak about uncertainty, which is the one thing you cannot afford right now.', effect: { score: 2 } },
        { key: 'B', label: 'Let them film - transparency is good', desc: 'Analysts hedging their language because a camera is present is a subtle and serious degradation of the work.', effect: { score: -2 } },
        { key: 'C', label: 'Have them removed from the building', desc: 'Declining is right; making it a confrontation gives them a better story than the filming would have.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Mayor Asks You to Say His Town Is Safe',
      body: 'A mayor asks you to make a public statement that his township is safe, so that residents will return and '
        + 'businesses can reopen. Your assessment does not support the word "safe".',
      source: 'Mayors',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Offer to state precisely what you can support - which areas, on what evidence, with what caveats - and explain why you cannot use the word he wants', desc: 'Gives him something real and usable, and holds the line on a word your evidence does not support.', effect: { score: 2 } },
        { key: 'B', label: 'Say it - the risk in most of the town genuinely is low', desc: '"Safe" is heard as an all-clear across the whole township, including the parts your assessment excludes.', effect: { score: -3 } },
        { key: 'C', label: 'Refuse and end the conversation', desc: 'The refusal is right and leaves a mayor with nothing to tell his residents, which he will fill himself.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'An Analyst Disagrees With You in Front of the Room',
      body: 'One of your junior analysts challenges your slope interpretation in the middle of a briefing, in front of the '
        + 'controllers.',
      source: 'Science Team',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Take the challenge seriously on the spot, say what would settle it, and thank them for raising it', desc: 'The junior analyst may be right, and how you respond determines whether anyone challenges you again tonight.', effect: { score: 2 } },
        { key: 'B', label: 'Shut it down and discuss it privately afterwards', desc: 'Controllers saw the disagreement and now have no idea how it resolved, and your team learned not to speak up.', effect: { score: -2 } },
        { key: 'C', label: 'Concede the point immediately to avoid a scene', desc: 'Conceding on the spot without testing it is as bad as dismissing it, and it confuses the controllers who need a position.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Rumour That the Alpine Fault Is Next',
      body: 'A widely shared post claims this earthquake has "loaded" the Alpine Fault and that a M8 is imminent. It cites '
        + 'a real paper, badly.',
      source: 'Social Media',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Correct it directly and plainly: what stress transfer does and does not mean, what the actual change in probability is, and what people should do about it', desc: 'A specific, numerate correction that respects the underlying science displaces the rumour better than a denial does.', effect: { score: 2 } },
        { key: 'B', label: 'Dismiss it as scaremongering and move on', desc: 'It cites a real paper, so a flat dismissal reads as the establishment brushing off inconvenient science.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore it - you have real hazards to advise on', desc: 'People are making evacuation and travel decisions on it, which makes it one of your real hazards.', effect: { score: -2 } }
      ]
    }
  ];

  // ---- Event sequence -------------------------------------------------------
  // Times are minutes since the mainshock; the engine paces the gaps.
  PERSONA_EVENTS.seismic = [
    {
      time: 0, type: 'inject', tag: 'MAINSHOCK',
      title: 'Alpine Fault Rupture — M8 on the South Island',
      body: 'GeoNet confirms a major Alpine Fault earthquake. Shaking was severe and prolonged across the South Island. ' +
        'As the duty senior seismic hazard scientist, you are now standing up the science advisory cell. Within minutes, ' +
        'Ministers, Controllers, Mayors and infrastructure chief executives will want answers you cannot yet fully give: ' +
        'how big the aftershocks will be, where the slopes will fail, which rivers are dammed, and whether it is safe to ' +
        'move. The evidence is thin, the consequences are lethal, and everyone wants certainty.',
      source: 'GNS Science / GeoNet — Automatic Detection',
      aftershock: true
    },
    {
      time: 5, type: 'info', tag: 'ROLE',
      title: 'Science Advisory Cell Activated — Your Job',
      body: 'You are the science advisor, not the decision-maker. Your job is to make sure Controllers and officials ' +
        'understand what is known, what is uncertain, what could happen next, what the consequences are, and which ' +
        'decisions cannot safely wait. Separate facts from assumptions and judgements, state your confidence plainly, and ' +
        'give decision-ready advice rather than an academic explanation. The pressure to overstate certainty starts now.',
      source: 'National Science Advisory Group'
    },
    {
      time: 8, type: 'inject', tag: 'HAZARD PICTURE',
      title: 'Initial Hazard Picture — Cascading Risks Emerging',
      body: 'Fragmentary reports are arriving: widespread landslides across the ranges, damaged alpine roads and bridges, ' +
        'suspected river blockages with landslide-dam potential, and at least a dozen isolated communities. Aftershock ' +
        'probability is high, severe weather is approaching, and glacier, lake and slope hazards are all plausible. You ' +
        'have GeoNet feeds and partial aerial imagery, but no ground inspection and no time for peer review.',
      source: 'GeoNet / Aerial Recon / Field Reports'
    },
    {
      time: 14, type: 'decision', tag: 'ADVISORY',
      title: 'Aftershock Advice — Responder Exclusion Zones',
      body: 'A strong aftershock has just struck while USAR teams are inside a damaged building, and other crews are working ' +
        'in active landslide zones. Officials need your advice on whether to keep responders out of unstable buildings and ' +
        'slopes. Trapped people may still be alive — but your own people are in harm’s way and the ground is not done moving.',
      decisionId: 'sci_aftershock',
      prompt: 'What do you advise on responder access to unstable areas?',
      options: [
        { key: 'A', label: 'Risk-tier the zones: no-entry where collapse or slope failure is credible, controlled access elsewhere with stand-off triggers and a spotter', desc: 'Decision-ready and proportionate. Protects responders where the hazard is real without freezing every rescue. States the trigger that would change the advice.', effect: { score: 5 } },
        { key: 'B', label: 'Apply a blanket no-entry rule to every damaged building and landslide zone until each has been fully assessed, and hold that line without exception', desc: 'Safe for responders but over-cautious — full assessment is hours or days away, and people who are still alive may not have that long.', effect: { score: -2 } },
        { key: 'C', label: 'Decline to advise on access, on the basis that where responders go is an operational command decision and not something science should be directing', desc: 'Abdication. The Controllers need your hazard read to make that call safely; "not my job" leaves them blind.', effect: { score: -4 } },
        { key: 'D', label: 'Advise that conditions are broadly safe to continue working, so that rescue teams are not held back from people who may still be alive under rubble', desc: 'False reassurance during an active aftershock sequence in landslide terrain. If the ground moves again, your advice killed responders.', effect: { score: -6 } }
      ]
    },
    {
      time: 20, type: 'decision', tag: 'ADVISORY',
      title: 'The Number Everyone Will Misread',
      body: 'Your aftershock forecast gives a 63 per cent chance of one or more M6.0+ events in the next seven days. Every '
        + 'recipient of that number - controllers, mayors, the public, a school board deciding whether to reopen - will '
        + 'convert it into a yes or a no, and most will convert it wrongly.',
      decisionId: 'sci_forecast_numbers',
      prompt: 'How do you publish the forecast?',
      options: [
        { key: 'A', label: 'Publish the probability with a plain-English translation of what it means for a decision - what to expect, what it does not predict, and what would change it', desc: 'A probability without a decision frame is a number people fill in themselves. Say what it means for the choices they are actually making.', effect: { score: 5 } },
        { key: 'B', label: 'Publish the probability exactly as calculated and let people interpret it themselves, since altering or explaining it risks putting your thumb on the scale', desc: 'Sixty-three per cent will be read as "an earthquake is coming" by half your audience and "probably fine" by the other half.', effect: { score: -4 } },
        { key: 'C', label: 'Round it to a plain phrase such as high likelihood and drop the number altogether, so nobody mistakes a modelled figure for a precise prediction', desc: 'Removes the precision that lets a controller compare this week against next, and invites the accusation that you are hiding the figure.', effect: { score: -3 } },
        { key: 'D', label: 'Give the full figure to officials and a simplified version to the public, so each audience gets the detail that is actually useful to them', desc: 'Two versions of the same forecast collide within a day, and the public one is always the one that looks like a lie.', effect: { score: -5 } }
      ]
    },
    {
      time: 28, type: 'decision', tag: 'ADVISORY',
      title: 'Public Messaging — "Could There Be a Bigger Earthquake?"',
      body: 'Live media is asking whether an even larger earthquake could follow. The public is frightened and wants a simple ' +
        'answer. A precise scientific answer is complex and easily misread; a simplified answer is clearer but could ' +
        'mislead. How much uncertainty do you disclose to a frightened public?',
      decisionId: 'sci_messaging',
      prompt: 'How do you answer the "bigger earthquake?" question?',
      options: [
        { key: 'A', label: 'Plain language, honest and bounded: a larger event is possible but cannot be predicted; aftershocks are expected; here is what to do now', desc: 'Discloses the uncertainty without hiding behind it, and turns it into action. Honest, clear, and decision-ready for the public.', effect: { score: 5 } },
        { key: 'B', label: 'Give the full technical probability discussion with every caveat intact, so that nothing is lost in translation and the record is defensible', desc: 'Accurate but not decision-ready — a frightened public hears noise, and the key message ("here is what to do") gets lost.', effect: { score: 0 } },
        { key: 'C', label: 'Reassure them that a larger quake is very unlikely, on the basis that a frightened population makes worse decisions than a calm one', desc: 'Buys calm by overstating certainty. When the next strong aftershock hits, the reassurance becomes the story and trust collapses.', effect: { score: -5 } },
        { key: 'D', label: 'Decline to answer until the science is clearer, rather than put a number into public circulation that you may have to withdraw within days', desc: 'The vacuum fills with worse information. Saying nothing during live fear is itself a message — and not a good one.', effect: { score: -3 } }
      ]
    },
    {
      time: 36, type: 'inject', tag: 'DATA',
      title: 'A Two-Hour Aerial Window',
      body: 'Cloud lifts enough for a single fixed-wing run over the valley. The imagery is oblique, low resolution in ' +
        'places, and it is the only synoptic view you will get before the weather closes again tonight. Everything you ' +
        'advise for the next twelve hours will rest largely on these frames.',
      source: 'Aerial Recon / GNS'
    },
    {
      time: 42, type: 'decision', tag: 'ADVISORY',
      title: 'Expert Deployment — Two Geotech Teams',
      body: 'Only two geotechnical teams are available against five urgent demands: a damaged hospital access road, a ' +
        'landslide above a township, the alpine pass needed as a supply route, a hydropower dam needing inspection, and a ' +
        'school sitting below an unstable slope. Everyone insists they are first priority.',
      decisionId: 'sci_deploy',
      prompt: 'How do you prioritise the two geotechnical teams?',
      options: [
        { key: 'A', label: 'Triage by life exposure and consequence: township slope above homes and the school below the slope first; cover dam, hospital road and pass with remote/rapid methods', desc: 'Puts scarce expert effort where people are most exposed, and uses remote assessment to keep eyes on the rest. Defensible and transparent.', effect: { score: 5 } },
        { key: 'B', label: 'Send both teams to the alpine pass and the hospital access road, on the basis that restoring access unlocks every other response that is waiting', desc: 'Prioritises economic and logistical access over life exposure — the slopes sitting above a township and a school go unassessed.', effect: { score: -3 } },
        { key: 'C', label: 'Split the two teams thinly across all five sites so that every location gets some coverage and nobody can say they were left out entirely', desc: 'Spreads them so thin that no site gets a proper assessment — the appearance of coverage without the substance.', effect: { score: -2 } },
        { key: 'D', label: 'Hold both teams until you can properly scope all five demands, rather than commit your only field capability before you understand the problem', desc: 'Delay while unstable slopes sit above people. Perfect scoping is the enemy of timely life-safety advice here.', effect: { score: -4 } }
      ]
    },
    {
      time: 50, type: 'decision', tag: 'ADVISORY',
      title: 'Unverified Drone Footage',
      body: 'A resident’s drone footage is circulating widely. It appears to show a long tension crack across the slope '
        + 'above the township - which would be significant if real. You cannot verify the location, the timing, or whether '
        + 'what you are looking at is a fissure or a farm track. It is already on the news.',
      decisionId: 'sci_drone',
      prompt: 'How do you use the footage?',
      options: [
        { key: 'A', label: 'Treat it as a lead rather than evidence: task verification against it, say publicly that you are checking it and what you can and cannot yet confirm', desc: 'Unverified imagery is a tasking prompt, not a finding. Saying you are checking it beats both endorsement and silence.', effect: { score: 5 } },
        { key: 'B', label: 'Incorporate the footage into the published hazard map now, on the basis that a landslide dam of that size is far too significant to leave off it', desc: 'Putting an unverified feature on an authoritative map means every subsequent product carries an error you cannot trace.', effect: { score: -5 } },
        { key: 'C', label: 'Dismiss it publicly as unverified footage and say nothing further, so that unchecked material from a hobbyist does not start driving decisions', desc: 'It may well be real, and a flat dismissal that later proves wrong costs you more than the footage ever could.', effect: { score: -4 } },
        { key: 'D', label: 'Ignore it entirely - your job is the official instrument and imagery data, and chasing social media footage is not what the advisory role is for', desc: 'It is on the news and shaping public behaviour whether you engage with it or not.', effect: { score: -3 } }
      ]
    },
    {
      time: 58, type: 'cascade', tag: 'AFTERSHOCK',
      title: 'M6.3 Aftershock — Slopes Reactivated',
      body: 'A significant aftershock reactivates slopes across the affected ranges. Fresh landslides are reported, dust is ' +
        'obscuring aerial imagery, and any exclusion zones you advised are now being tested in real time. Officials who ' +
        'wanted reassurance an hour ago are now asking how much worse it could get — and your answer has to hold the line ' +
        'between honest uncertainty and useful guidance.',
      source: 'GeoNet / Aerial Recon',
      aftershock: true
    },
    {
      time: 66, type: 'decision', tag: 'ADVISORY',
      title: 'Landslide-Dam Warning — Evacuate or Confirm?',
      body: 'Unverified drone footage appears to show a landslide dam forming on a river upstream of a township. Data is ' +
        'limited — no ground inspection, weather closing in, light fading. Early evacuation may save lives; a false alarm ' +
        'displaces hundreds and strains welfare. Is it acceptable to displace people on uncertain but plausible catastrophic risk?',
      decisionId: 'sci_landslide_dam',
      prompt: 'What do you recommend on the suspected landslide dam?',
      options: [
        { key: 'A', label: 'Recommend precautionary evacuation of the clearly exposed flood path now, labelled provisional, and reassess at first aerial/daylight confirmation', desc: 'Acts in time on a plausible catastrophic risk, scoped to the people actually exposed, and sets an explicit trigger to revise. Provisional but decision-ready.', effect: { score: 5 } },
        { key: 'B', label: 'Wait for aerial confirmation before recommending any evacuation, so that nobody is moved out of their home on the strength of unverified footage', desc: 'A landslide dam can fail without warning. Waiting for certainty may mean the warning arrives after the flood does.', effect: { score: -3 } },
        { key: 'C', label: 'Say nothing at all until the footage is verified, because an unconfirmed dam that turns out not to exist will cost you every future warning', desc: 'Sitting on a plausible, lethal, time-critical hazard. If the dam breaks out, withholding the signal will be indefensible.', effect: { score: -5 } },
        { key: 'D', label: 'Recommend evacuating the entire township immediately, on the basis that the cost of moving people is trivial against the cost of being wrong', desc: 'Over-broad — displaces hundreds who are not in the flood path, overwhelms welfare, and erodes trust for the next warning.', effect: { score: -1 } }
      ]
    },
    {
      time: 74, type: 'decision', tag: 'ETHICAL',
      title: 'Evacuate Below the Dam?',
      body: 'The landslide dam is impounding water and the CDEM Controller needs a recommendation now: evacuate the 340 '
        + 'people downstream, or not. Your honest position is that a breakout is plausible within 12 to 48 hours, that you '
        + 'cannot bound it better without ground data, and that the weather is closing.',
      decisionId: 'sci_dam_evacuate',
      prompt: 'What do you recommend to the Controller?',
      options: [
        { key: 'A', label: 'Recommend precautionary evacuation now, state plainly that the uncertainty is wide and why, and commit to a review point once ground data or the next imagery arrives', desc: 'Under wide uncertainty with a catastrophic downside and a closing weather window, the precautionary call with a stated review point is the defensible one.', effect: { score: 5 },
          locked: function (log) {
            return log['sci_deploy'] === 'D' ? 'No team has reached the dam - you held both while you scoped, and you have no ground truth to recommend on' : false;
          } },
        { key: 'B', label: 'Advise waiting until you can bound the timing properly, so that the Controller is given a window to act on rather than an open-ended warning', desc: 'The data that would bound it needs a team on the ground and a weather window you do not have, and the dam does not wait for either.', effect: { score: -5 } },
        { key: 'C', label: 'Tell the Controller that evacuating a township is an operational decision rather than a science one, and give him the data to make it himself', desc: 'The Controller needs your hazard judgement to make that decision. Handing it back without a position is not neutrality, it is abdication.', effect: { score: -5 } },
        { key: 'D', label: 'Recommend evacuation and present it as a certainty rather than a probability, because hedged advice is exactly what gets ignored under pressure', desc: 'Overstating certainty to force the right action works once, and destroys the credibility every later warning depends on.', effect: { score: -4 } }
      ]
    },
    {
      time: 84, type: 'decision', tag: 'ADVISORY',
      title: 'Road Reopening — "Is It Safe?"',
      body: 'Roading officials are lobbying hard to reopen a key alpine route within six hours for fuel, food and medical ' +
        'access; downstream communities are isolated. Rockfall risk on the corridor remains high after the aftershock. ' +
        'Officials keep asking the wrong question: "Is it safe?"',
      decisionId: 'sci_road',
      prompt: 'How do you advise on reopening the alpine road?',
      options: [
        { key: 'A', label: 'Reframe it — no road is safe; give the risk level and conditions, and recommend escorted, essential-only convoys with rockfall watch and timing windows', desc: 'Answers the real question (is the risk tolerable, and how do we manage it?) and hands officials a usable, conditional option instead of a false yes or an absolute no.', effect: { score: 5 } },
        { key: 'B', label: 'Advise that the road stays fully closed until the rockfall risk drops to low, and hold that position regardless of what is waiting to get through', desc: 'Defensible on pure hazard grounds but ignores the tolerable-risk framing — isolated communities pay the price while you wait for "low".', effect: { score: -2 } },
        { key: 'C', label: 'Advise that it is safe enough to reopen so that supplies and fuel can start flowing to communities that have now been cut off for two days', desc: 'False certainty on a high-rockfall corridor during an aftershock sequence. "Safe enough" is the phrase that gets a convoy buried.', effect: { score: -6 } },
        { key: 'D', label: 'Tell officials that reopening is their decision and decline to offer a risk view, so that science is not blamed for an operational judgement', desc: 'Abdication when they specifically need your hazard read. Declining to advise is itself a failure of the advisory role.', effect: { score: -4 } }
      ]
    },
    {
      time: 92, type: 'decision', tag: 'ETHICAL',
      title: 'The School Below the Slope',
      body: 'The school sits directly below the slope you have flagged as high risk. The board wants to reopen on Monday '
        + 'because 400 families have nowhere else for their children to go. Your assessment is incomplete, and the only '
        + 'honest thing you can say about the slope is that you do not yet know.',
      decisionId: 'sci_school',
      prompt: 'What do you advise the school board?',
      options: [
        { key: 'A', label: 'Advise against reoccupation until the slope is assessed, say exactly what assessment is needed and how long it would take, and help them frame the alternative', desc: 'You cannot clear a slope you have not assessed. Naming the specific work and the timeframe turns "no" into something the board can act on.', effect: { score: 5 } },
        { key: 'B', label: 'Clear the site for reoccupation, on the basis that there is no positive evidence of instability and four hundred children need somewhere to be', desc: 'Absence of evidence from an assessment you have not done is not evidence of absence, and 400 children would be under it.', effect: { score: -6 } },
        { key: 'C', label: 'Tell them that reopening the school is their decision and decline to advise either way, since the consequences of being wrong are theirs to carry', desc: 'A school board cannot assess a slope. Withholding the judgement they came for leaves them guessing about children.', effect: { score: -5 } },
        { key: 'D', label: 'Advise permanent closure of the site and relocation of the school, so that nobody has to revisit this question every time the slope moves again', desc: 'Goes far beyond what your evidence supports, and a recommendation you cannot substantiate will not survive the first challenge.', effect: { score: -4 } }
      ]
    },
    {
      time: 100, type: 'decision', tag: 'ETHICAL',
      title: 'Ministerial Pressure — Softening the Language',
      body: 'The Minister’s office wants your advisory line changed from "there is a credible risk of further slope failure" ' +
        'to "there is no immediate evidence of further failure." They argue it protects public confidence. The second ' +
        'statement is not what the science says.',
      decisionId: 'sci_minister',
      prompt: 'How do you respond to the request to soften the language?',
      options: [
        { key: 'A', label: 'Hold the meaning, sharpen the plain English — keep the credible-risk message but make it clearer and more usable', desc: 'Plain language is a legitimate ask; diluting the risk is not. Keeps integrity and usability without picking an unnecessary fight.', effect: { score: 5 } },
        { key: 'B', label: 'Accept the edit and let it go out, on the basis that the working relationship with the Minister is worth more than one contested adjective', desc: 'Lets science advice be politically filtered before it reaches the public. If the slope fails, the edit becomes the scandal.', effect: { score: -6 } },
        { key: 'C', label: 'Refuse the edit flatly and publish your original wording yourself, so that the scientific advice reaches the public exactly as it was written', desc: 'Protects the science but burns the channel and the process — and freelancing public statements creates its own problems.', effect: { score: -1 } },
        { key: 'D', label: 'Escalate formally through the science advisory chain, documenting the original advice and the edit that was requested, and let it be resolved above you', desc: 'Defends integrity through process and leaves a clear record, at some cost to the immediate relationship. A solid fallback to A.', effect: { score: 3 } }
      ]
    },
    {
      time: 108, type: 'decision', tag: 'ADVISORY',
      title: 'The Hydro Dam Nobody Has Inspected',
      body: 'The hydro operator states its dam performed within design and needs no external assessment. You have no '
        + 'independent data, the structure sits above two settlements, and the shaking exceeded what the original design '
        + 'case assumed. The operator is a credible organisation and it is also the party with the most to lose.',
      decisionId: 'sci_hydro',
      prompt: 'How do you handle the hydro dam?',
      options: [
        { key: 'A', label: 'State plainly that you cannot corroborate the operator’s assessment, recommend independent inspection, and record that advice formally', desc: 'The operator may well be right. Saying you cannot corroborate it, and putting the recommendation on the record, is the whole of your job here.', effect: { score: 5 } },
        { key: 'B', label: 'Accept the operator’s assessment and move on, since they know their own asset far better than you do and have their own engineers on site', desc: 'Adopting the assessment of the party with the largest interest, with no independent data, is how you end up owning their conclusion.', effect: { score: -5 } },
        { key: 'C', label: 'Publicly question the dam’s safety to force an independent inspection, on the basis that pressure is the only thing that will move the operator', desc: 'Alarming two settlements about a structure you have no evidence against, to win a procedural argument.', effect: { score: -5 } },
        { key: 'D', label: 'Leave it alone - dam safety sits with the regulator and the operator, and stepping into it puts you well outside your own advisory mandate', desc: 'It is a hazard above two settlements after design-exceeding shaking. That makes it yours to raise, whoever regulates it.', effect: { score: -4 } }
      ]
    },
    {
      time: 116, type: 'decision', tag: 'ADVISORY',
      title: 'Conflicting Expert Views — A Slope Above Town',
      body: 'Two of your scientists genuinely disagree on whether a slope above the town is likely to fail. Officials need ' +
        'something to act on. Presenting raw disagreement may paralyse them; forcing a single confident line may bury a ' +
        'legitimate signal.',
      decisionId: 'sci_conflicting',
      prompt: 'How do you handle the disagreement in your advice?',
      options: [
        { key: 'A', label: 'Give one decision-ready recommendation that states the disagreement, your assessed confidence, and the precautionary action while it is resolved', desc: 'Honest about the split, clear on your overall judgement, and actionable now. This is what "decision-ready under uncertainty" looks like.', effect: { score: 5 } },
        { key: 'B', label: 'Present both expert views side by side and let officials choose between them, so the disagreement is visible and nothing is hidden from them', desc: 'Passes the scientific uncertainty downstream to people less equipped to resolve it. Not decision-ready.', effect: { score: -3 } },
        { key: 'C', label: 'Force a single confident recommendation and leave the disagreement out of it, because a Controller under pressure cannot act on a split opinion', desc: 'Buries a legitimate dissenting signal and overstates certainty. If the minority view is right, the omission is the failure.', effect: { score: -4 } },
        { key: 'D', label: 'Delay the advice until the two experts have reconciled their models, so that what you eventually publish carries the whole field behind it', desc: 'Scientific reconciliation takes time the slope above the town may not give you.', effect: { score: -3 } }
      ]
    },
    {
      time: 124, type: 'inject', tag: 'PRESSURE',
      title: 'Everyone Wants a Different Answer',
      body: 'Within twenty minutes: a mayor asks you to confirm his township is safe, an infrastructure chief executive asks '
        + 'you to clear the pass for freight, a talkback host is reading your forecast aloud and laughing at it, and the '
        + 'Minister’s office wants to know why the advice keeps changing. None of them are asking for the same thing.',
      source: 'Advice Recipients'
    },
    {
      time: 130, type: 'decision', tag: 'ETHICAL',
      title: 'Certainty vs Usefulness — "Give Us a Percentage"',
      body: 'Decision-makers want a single percentage risk number they can act on. You only have rough confidence levels. A ' +
        'number looks decisive but may be falsely precise; "it depends" sounds vague and unhelpful.',
      decisionId: 'sci_certainty',
      prompt: 'How do you express the risk to decision-makers?',
      options: [
        { key: 'A', label: 'Use confidence bands — low / moderate / high — each tied to a clear decision implication and trigger point', desc: 'Honest about precision and still decision-ready. Officials get something to act on without mistaking a guess for a measurement.', effect: { score: 5 },
          locked: function (log) {
            return log['sci_minister'] === 'B' ? 'You accepted the softened wording this morning - the certainty you gave is already public' : false;
          } },
        { key: 'B', label: 'Give them a single percentage so they have something firm to plan against, even though the underlying uncertainty is considerably wider than that', desc: 'A falsely precise number gets over-trusted and quoted as fact. The decimal point implies a confidence you do not have.', effect: { score: -4 } },
        { key: 'C', label: 'Tell them the science cannot give a meaningful number here and leave it at that, rather than invent a figure the data does not actually support', desc: 'Technically true and operationally useless — it reads as the expert refusing to help.', effect: { score: -3 } },
        { key: 'D', label: 'Give a wide percentage range with heavy caveats attached, so the full spread of the uncertainty is on the record and nothing is overstated', desc: 'Better than a point estimate, but a bare range without decision implications still leaves officials guessing what to do.', effect: { score: 1 } }
      ]
    },
    {
      time: 138, type: 'inject', tag: 'DATA',
      title: 'First Ground Truth',
      body: 'The first geotech team reports back from the township slope. There is a genuine tension crack, it is shorter '
        + 'than the drone footage suggested and in a different place, and the material below it is more mobile than the '
        + 'imagery implied. Some of what you have already published is wrong in detail, and the overall risk is unchanged.',
      source: 'Geotech Team / Field'
    },
    {
      time: 144, type: 'cascade', tag: 'WEATHER',
      title: 'Severe Weather Closing In — Risk Profile Rising',
      body: 'The forecast front has arrived early: heavy rain and falling snow over saturated, freshly fractured slopes. ' +
        'Rain loads landslide dams and raises breakout-flood and slope-failure risk; cloud grounds the aerial recon you ' +
        'were relying on for confirmation. Your evidence base is shrinking exactly as the hazards are growing.',
      source: 'MetService / Aerial Recon'
    },
    {
      time: 152, type: 'decision', tag: 'ETHICAL',
      title: 'Peer Review vs Urgency — Provisional Flood Model',
      body: 'A preliminary model suggests a high breakout-flood risk below one of the landslide dams. It has not been peer ' +
        'reviewed and could be wrong. Sharing early risks being wrong in public; waiting risks people staying in the flood path.',
      decisionId: 'sci_peer_review',
      prompt: 'What do you do with the un-reviewed flood model?',
      options: [
        { key: 'A', label: 'Share it now as provisional advice, clearly labelled with its assumptions, confidence and the trigger for revision', desc: 'Gets a time-critical signal to the people exposed while being honest that it is provisional. Transparency about limits, not silence.', effect: { score: 5 } },
        { key: 'B', label: 'Wait until the model has been through peer review before sharing anything, so that what you put in front of decision makers has been properly checked', desc: 'Peer review is the right standard in normal times; here it can mean people stay in the flood path until it is too late.', effect: { score: -4 } },
        { key: 'C', label: 'Share it as a firm finding rather than a provisional one, on the basis that hedged advice is routinely discounted and people need to move now', desc: 'Overstates certainty on an unreviewed model. If it is wrong, you have spent credibility you will need for the next warning.', effect: { score: -5 } },
        { key: 'D', label: 'Quietly brief officials only and keep it away from the public, so that an unreviewed model does not end up driving behaviour you cannot predict', desc: 'Leaves the exposed public uninformed about a hazard above their homes. Provisional is fine; secret is not.', effect: { score: -2 } }
      ]
    },
    {
      time: 160, type: 'decision', tag: 'ETHICAL',
      title: 'Your Earlier Advice Was Wrong in Detail',
      body: 'Ground truth has shown that the crack you described this morning is in a different location and shorter than '
        + 'you said. The risk conclusion has not changed, but the specifics you published have. Nobody outside your team '
        + 'has noticed yet.',
      decisionId: 'sci_reversal',
      prompt: 'How do you handle the error?',
      options: [
        { key: 'A', label: 'Correct it openly and quickly: say what changed, why, what it does and does not change about the risk, and that this is what updating on evidence looks like', desc: 'A visible, explained correction is the strongest possible demonstration that your advice tracks evidence rather than reputation.', effect: { score: 5 } },
        { key: 'B', label: 'Quietly update the map and say nothing about the change, so that public confidence in the rest of the hazard picture is not shaken by one error', desc: 'Someone will notice the change, and a silent edit reads as concealment in a way an open correction never would.', effect: { score: -5 } },
        { key: 'C', label: 'Leave the map as it is - the overall risk conclusion has not changed, and correcting a detail nobody acted on only draws attention to the mistake', desc: 'The detail is what people navigated by. Leaving a known error in a published hazard product is not a rounding decision.', effect: { score: -5 } },
        { key: 'D', label: 'Correct it properly but place the correction in a technical annex, so the record is accurate without turning one error into the day’s headline', desc: 'Technically published, practically hidden, and it costs you the credibility that an open correction would have bought.', effect: { score: -3 } }
      ]
    },
    {
      time: 168, type: 'decision', tag: 'ETHICAL',
      title: 'Transparency vs Panic — Landslide-Dam Maps',
      body: 'Officials are worried that publishing your landslide-dam hazard maps will cause panic. But the people living ' +
        'below those dams have a right to know, and withholding could cost lives and destroy trust if a dam later breaks out.',
      decisionId: 'sci_maps',
      prompt: 'What do you do with the landslide-dam hazard maps?',
      options: [
        { key: 'A', label: 'Release simplified, plain-language risk areas with clear "what to do" guidance, holding back only raw detail that misleads', desc: 'Informs the exposed public in a form they can act on, without dumping confusing technical detail. Informed people act more safely.', effect: { score: 5 },
          locked: function (log) {
            return log['sci_drone'] === 'B' ? 'Your published hazard map already carries an unverified drone feature' : false;
          } },
        { key: 'B', label: 'Withhold the maps entirely to avoid causing panic, on the basis that raw hazard zones shown to a frightened public will be read at their worst', desc: 'Withholding hazard information from the people it affects rarely prevents harm and devastates trust when the hazard materialises.', effect: { score: -5 } },
        { key: 'C', label: 'Publish the full raw technical maps unedited, so that nobody can accuse the agency of holding back or of deciding what the public may see', desc: 'Accurate but easily misread — uncaveated technical maps can cause the very panic and confusion that was feared.', effect: { score: -1 } },
        { key: 'D', label: 'Release the maps to officials only and not the public, so the people making decisions have everything while the detail cannot be misread', desc: 'The people standing below the dams are the ones who most need to know, and they are exactly who this leaves out.', effect: { score: -3 } }
      ]
    },
    {
      time: 176, type: 'decision', tag: 'ETHICAL',
      title: 'Advice That Has to Travel Without You',
      body: 'Three cut-off tourist centres hold roughly 900 visitors, many with limited English, no local knowledge and no '
        + 'idea what a landslide dam is. Your hazard advice has to reach them through a satellite phone, a lodge manager '
        + 'and whatever gets translated on the way.',
      decisionId: 'sci_tourists',
      prompt: 'How do you get the advice to them?',
      options: [
        { key: 'A', label: 'Write a short, concrete, translatable instruction - what to do, where to go, what signal to act on - and confirm the lodge managers can repeat it back correctly', desc: 'Advice that must pass through intermediaries has to survive being repeated. Confirming it comes back correctly is the only test that matters.', effect: { score: 5 } },
        { key: 'B', label: 'Send the tourist centres the same technical bulletin the controllers receive, so that everyone is working from one consistent source of information', desc: 'A bulletin written for CDEM controllers will not survive translation by a lodge manager to 300 frightened visitors.', effect: { score: -4 } },
        { key: 'C', label: 'Leave the tourist centres to Civil Defence, since they sit outside your assessed priority set and you have communities of your own still cut off', desc: 'Nine hundred people in the hazard zone are not outside anyone’s priority set, and nobody else can write the hazard instruction.', effect: { score: -5 } },
        { key: 'D', label: 'Tell them to evacuate immediately and let the lodge managers work out where to, because any delay in getting people moving costs more than clarity', desc: 'An instruction to move with no destination sends 900 people onto roads you have flagged as rockfall corridors.', effect: { score: -6 } }
      ]
    },
    {
      time: 184, type: 'decision', tag: 'ETHICAL',
      title: 'Mana Whenua Concern — An Unstable Valley',
      body: 'Mana whenua advise that a culturally significant valley is unstable and access should be restricted, drawing on ' +
        'long observation of the land. You have no technical confirmation yet, and the valley sits on a proposed access route.',
      decisionId: 'sci_mana_whenua',
      prompt: 'How do you treat the mana whenua advice?',
      options: [
        { key: 'A', label: 'Integrate mātauranga as corroborating evidence, recommend precautionary access restriction now, and prioritise technical confirmation of the valley', desc: 'Treats long observation of the land as the credible signal it is, acts precautionarily, and seeks confirmation — rather than waiting for instruments to "allow" the concern.', effect: { score: 5 } },
        { key: 'B', label: 'Wait for technical confirmation before adjusting any published advice, so that what goes out rests entirely on evidence you can defend later', desc: 'Dismisses a credible local signal because it has not yet been validated by instruments — risking both lives and trust.', effect: { score: -4 } },
        { key: 'C', label: 'Note the concern respectfully and proceed with the access route as planned, since the technical assessment does not currently show a problem there', desc: 'Ignores a real hazard signal and a relationship that matters. If the valley fails, this is the indefensible choice.', effect: { score: -5 } },
        { key: 'D', label: 'Restrict access to the valley permanently with no plan to verify, so the question is settled and nobody is sent up there to check it', desc: 'Precautionary but not decision-ready — no follow-up, no reassessment, and no path back to a normal access decision.', effect: { score: -1 } }
      ]
    },
    {
      time: 192, type: 'decision', tag: 'ETHICAL',
      title: 'A Colleague Contradicts You Publicly',
      body: 'A respected academic seismologist has posted publicly that the official aftershock advice is overstated and '
        + 'that the evacuation was unnecessary. She is well qualified, she is working from the public data only, and she is '
        + 'being widely shared by people who want the evacuation reversed.',
      decisionId: 'sci_colleague',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Respond on the substance, publicly and without rancour: set out the field data she does not have, name where you genuinely agree, and offer her the dataset', desc: 'Scientific disagreement handled in the open, on evidence, strengthens the advice. Offering her the data is what separates confidence from defensiveness.', effect: { score: 5 } },
        { key: 'B', label: 'Attack her credibility publicly and set out why her published record does not qualify her to comment on a rupture she has not been anywhere near', desc: 'Turns a disagreement about evidence into a fight about people, and every observer concludes you could not answer the substance.', effect: { score: -6 } },
        { key: 'C', label: 'Say nothing at all and let it pass, on the basis that a public argument between two scientists helps nobody and the story will move on by tomorrow', desc: 'An unanswered expert contradiction becomes the counter-narrative that undermines compliance with an evacuation still in force.', effect: { score: -4 } },
        { key: 'D', label: 'Ask her institution to have a quiet word and get her to stop, so the disagreement is handled between organisations rather than played out in public', desc: 'Suppressing a qualified colleague’s scientific disagreement is the story, and it will be a bigger one than the disagreement.', effect: { score: -6 } }
      ]
    },
    {
      time: 200, type: 'decision', tag: 'ADVISORY',
      title: 'Media Leak — Draft Risk Map Online',
      body: 'A draft technical risk map has leaked online and is spreading, stripped of its caveats and confidence labels. ' +
        'People are drawing alarming conclusions from what was only a working document.',
      decisionId: 'sci_leak',
      prompt: 'How do you respond to the leaked draft map?',
      options: [
        { key: 'A', label: 'Publish an official, plain-language version promptly with the caveats and "what to do", and explain what the draft was', desc: 'Gets ahead of the leak with an authoritative, usable version. Correcting the record beats denying or ignoring it every time.', effect: { score: 5 } },
        { key: 'B', label: 'Deny that the map is genuine in order to limit the damage, so that an unfinished draft does not end up being treated as official published advice', desc: 'A denial that is quickly disproven destroys trust in everything you say next. Never deny a real document.', effect: { score: -6 } },
        { key: 'C', label: 'Say nothing and let it blow over, on the basis that engaging with a leaked draft gives it a status and an audience it would not otherwise have', desc: 'The vacuum fills with the most alarming possible reading of your own draft. Silence cedes the narrative.', effect: { score: -4 } },
        { key: 'D', label: 'Confirm it is a draft and ask media to take it down, without putting out an official version to replace it', desc: 'Better than denial, but leaves the public with a stripped-down draft and no authoritative replacement to anchor to.', effect: { score: -1 } }
      ]
    },
    {
      time: 208, type: 'decision', tag: 'ADVISORY',
      title: 'Your Own Team at Hour Twenty',
      body: 'Two modelling errors have been caught internally in the last hour, both by chance. Your analysts have been on '
        + 'since the mainshock, the next forecast update is due in ninety minutes, and there is no relief roster because '
        + 'nobody planned for a response this long.',
      decisionId: 'sci_team_fatigue',
      prompt: 'How do you handle your team?',
      options: [
        { key: 'A', label: 'Rotate people off, reduce to the products that genuinely drive decisions, and put a second pair of eyes on anything published from here', desc: 'Fewer products, checked, beats more products with fatigue errors in them - and an error in a hazard product propagates into every decision built on it.', effect: { score: 5 } },
        { key: 'B', label: 'Push through the next twelve hours - the decisions being made right now need the full product set, and there is nobody else who can produce it', desc: 'Two caught errors mean there are uncaught ones, and a wrong hazard product does more damage than a late one.', effect: { score: -5 } },
        { key: 'C', label: 'Keep everyone on shift but add further review steps to each product, so that fatigue is caught by the checking rather than by standing people down', desc: 'Adds work to exhausted people to catch the errors exhaustion is causing, and slows the products without fixing the cause.', effect: { score: -3 } },
        { key: 'D', label: 'Stand the whole team down until morning, on the basis that exhausted analysts produce advice that is worse than no advice at all', desc: 'An evacuation is in force and the weather is closing; there are decisions tonight that need a hazard view.', effect: { score: -4 } }
      ]
    },
    {
      time: 216, type: 'decision', tag: 'ETHICAL',
      title: 'Equity of Advice — Who Gets Assessed First?',
      body: 'Tourist centres and major highways are getting rapid technical assessment because of their economic and ' +
        'political profile. Remote Māori, farming and isolated communities — some with real exposure — are waiting much ' +
        'longer for any science advice.',
      decisionId: 'sci_equity',
      prompt: 'How do you allocate scarce science assessment?',
      options: [
        { key: 'A', label: 'Prioritise by hazard exposure and vulnerability, not economic profile — and explicitly include the remote and isolated communities', desc: 'Allocates scarce expertise to where people are most at risk, and says so openly. Equitable and defensible.', effect: { score: 5 },
          locked: function (log) {
            return log['sci_tourists'] === 'C' ? 'You already told the cut-off centres they were outside your priority set' : false;
          } },
        { key: 'B', label: 'Follow the national economic priorities and assess the highways and tourist centres first, since that is where the recovery money and the pressure sit', desc: 'Lets economic and political profile, not exposure, decide who gets life-safety advice. The vulnerable wait longest exactly when it matters most.', effect: { score: -4 } },
        { key: 'C', label: 'Work through the assessment requests first-come first-served as they arrive, so that the allocation is transparent and nobody can claim favouritism', desc: 'Neutral on its face, but defaults to whoever is best-connected and loudest — usually not the most exposed.', effect: { score: -2 } },
        { key: 'D', label: 'Defer the allocation entirely to officials and assess wherever you are sent, so that a scientist is not the one deciding which communities wait', desc: 'Allocating scarce science capacity is exactly the call you should be advising on, not handing back unadvised.', effect: { score: -3 } }
      ]
    },
    {
      time: 224, type: 'info', tag: 'NIGHT',
      title: 'Twenty-Four Hours',
      body: 'A day after the mainshock the aftershock sequence is decaying roughly as forecast, the dam is holding, the '
        + 'township below it is empty, and nobody has died in a place you flagged. None of that proves you were right. It '
        + 'means the decisions taken on your advice have not yet been tested by the thing you were warning about.',
      source: 'GNS Science'
    },
    {
      time: 232, type: 'info', tag: 'HANDOVER',
      title: 'Sustained Advisory — The Hardest Lesson',
      body: 'The acute phase passes into sustained monitoring. Confidence bands are published, exposed communities have been ' +
        'warned, scarce teams are tasked by exposure, and your advice has held its meaning under pressure. The hardest ' +
        'lesson stands: the science expert does not make the emergency decision. Your job was to make sure decision-makers ' +
        'understood what was known, what was uncertain, what could happen next, what the consequences were, and which ' +
        'decisions could not safely wait — and to protect the integrity of that advice when it was most inconvenient.',
      source: 'National Science Advisory Group'
    }
  ];

})();
