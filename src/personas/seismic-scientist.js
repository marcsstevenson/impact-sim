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
    statusBar: [
      { id: 'aftershock', label: 'Aftershock Risk:', value: 'High', cls: 'critical' },
      { id: 'landslide', label: 'Landslide Dams:', value: '3 suspected', cls: 'warning' },
      { id: 'teams', label: 'Geotech Teams:', value: '2 avail', cls: 'warning' },
      { id: 'confidence', label: 'Advice Confidence:', value: 'Low-Mod', cls: 'warning' },
      { id: 'isolated', label: 'Communities Isolated:', value: '12', cls: 'critical' }
    ],
    panels: {
      groupsTitle: 'Hazard Assessment',
      groups: [
        { label: 'Aftershocks', value: 'High', cls: 'failed' },
        { label: 'Landslide / Rockfall', value: 'High', cls: 'failed' },
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
        { label: 'Weather Model', value: 'Deteriorating', cls: 'degraded' },
        { label: 'Peer Review', value: 'Not Possible', cls: 'failed' }
      ],
      transportTitle: 'Exposed Sites',
      transport: [
        { label: 'Township Slope', value: 'High Risk', cls: 'failed' },
        { label: 'School Below Slope', value: 'High Risk', cls: 'failed' },
        { label: 'Hospital Access Rd', value: 'Damaged', cls: 'degraded' },
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
        { icon: '🏔️', name: 'Slope Failure', level: 'High', cls: 'high' },
        { icon: '🌧️', name: 'Severe Weather', level: 'Moderate', cls: 'moderate' }
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
    'sci_mana_whenua': { 'A': { geotech: -5, fieldData: 5 } }
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
    'sci_equity': { 'A': { communityTrust: 2, lifeSafety: 1, decisive: 1 }, 'B': { communityTrust: -2, centralized: 1 }, 'C': { decisive: -1 }, 'D': { decisive: -2, centralized: -2 } }
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
        { key: 'B', label: 'Blanket "no entry" to all damaged buildings and landslide zones until full assessment', desc: 'Safe for responders but over-cautious — full assessment is hours or days away, and people who are still alive may not have that long.', effect: { score: -2 } },
        { key: 'C', label: 'Decline to advise — responder access is an operational call, not a science one', desc: 'Abdication. The Controllers need your hazard read to make that call safely; "not my job" leaves them blind.', effect: { score: -4 } },
        { key: 'D', label: 'Advise it is broadly safe to continue so rescues are not delayed', desc: 'False reassurance during an active aftershock sequence in landslide terrain. If the ground moves again, your advice killed responders.', effect: { score: -6 } }
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
        { key: 'B', label: 'Give the full technical probability discussion with all the caveats', desc: 'Accurate but not decision-ready — a frightened public hears noise, and the key message ("here is what to do") gets lost.', effect: { score: 0 } },
        { key: 'C', label: 'Reassure them a bigger quake is very unlikely, to keep everyone calm', desc: 'Buys calm by overstating certainty. When the next strong aftershock hits, the reassurance becomes the story and trust collapses.', effect: { score: -5 } },
        { key: 'D', label: 'Decline to answer until the science is clearer', desc: 'The vacuum fills with worse information. Saying nothing during live fear is itself a message — and not a good one.', effect: { score: -3 } }
      ]
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
        { key: 'B', label: 'Send both to the alpine pass and hospital access road to restore access fastest', desc: 'Prioritises economic and logistical access over life exposure — the slopes sitting above a township and a school go unassessed.', effect: { score: -3 } },
        { key: 'C', label: 'Split the two teams thinly across all five sites for partial coverage', desc: 'Spreads them so thin that no site gets a proper assessment — the appearance of coverage without the substance.', effect: { score: -2 } },
        { key: 'D', label: 'Hold both until you can fully scope all five demands', desc: 'Delay while unstable slopes sit above people. Perfect scoping is the enemy of timely life-safety advice here.', effect: { score: -4 } }
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
        { key: 'B', label: 'Wait for aerial confirmation before recommending any evacuation', desc: 'A landslide dam can fail without warning. Waiting for certainty may mean the warning arrives after the flood does.', effect: { score: -3 } },
        { key: 'C', label: 'Say nothing until the footage is verified — it is unconfirmed', desc: 'Sitting on a plausible, lethal, time-critical hazard. If the dam breaks out, withholding the signal will be indefensible.', effect: { score: -5 } },
        { key: 'D', label: 'Recommend evacuating the entire township immediately to be safe', desc: 'Over-broad — displaces hundreds who are not in the flood path, overwhelms welfare, and erodes trust for the next warning.', effect: { score: -1 } }
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
        { key: 'B', label: 'Advise the road stays fully closed until rockfall risk is low', desc: 'Defensible on pure hazard grounds but ignores the tolerable-risk framing — isolated communities pay the price while you wait for "low".', effect: { score: -2 } },
        { key: 'C', label: 'Advise it is safe enough to reopen so supplies can flow', desc: 'False certainty on a high-rockfall corridor during an aftershock sequence. "Safe enough" is the phrase that gets a convoy buried.', effect: { score: -6 } },
        { key: 'D', label: 'Tell officials it is their decision and decline to give a risk view', desc: 'Abdication when they specifically need your hazard read. Declining to advise is itself a failure of the advisory role.', effect: { score: -4 } }
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
        { key: 'B', label: 'Accept the edit to keep the relationship with the Minister', desc: 'Lets science advice be politically filtered before it reaches the public. If the slope fails, the edit becomes the scandal.', effect: { score: -6 } },
        { key: 'C', label: 'Refuse flatly and publish your original wording yourself', desc: 'Protects the science but burns the channel and the process — and freelancing public statements creates its own problems.', effect: { score: -1 } },
        { key: 'D', label: 'Escalate formally through the science advisory chain, documenting the original advice', desc: 'Defends integrity through process and leaves a clear record, at some cost to the immediate relationship. A solid fallback to A.', effect: { score: 3 } }
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
        { key: 'B', label: 'Present both views and let officials choose between them', desc: 'Passes the scientific uncertainty downstream to people less equipped to resolve it. Not decision-ready.', effect: { score: -3 } },
        { key: 'C', label: 'Force a single confident recommendation and omit the disagreement', desc: 'Buries a legitimate dissenting signal and overstates certainty. If the minority view is right, the omission is the failure.', effect: { score: -4 } },
        { key: 'D', label: 'Delay advice until the two experts reconcile their models', desc: 'Scientific reconciliation takes time the slope above the town may not give you.', effect: { score: -3 } }
      ]
    },
    {
      time: 130, type: 'decision', tag: 'ETHICAL',
      title: 'Certainty vs Usefulness — "Give Us a Percentage"',
      body: 'Decision-makers want a single percentage risk number they can act on. You only have rough confidence levels. A ' +
        'number looks decisive but may be falsely precise; "it depends" sounds vague and unhelpful.',
      decisionId: 'sci_certainty',
      prompt: 'How do you express the risk to decision-makers?',
      options: [
        { key: 'A', label: 'Use confidence bands — low / moderate / high — each tied to a clear decision implication and trigger point', desc: 'Honest about precision and still decision-ready. Officials get something to act on without mistaking a guess for a measurement.', effect: { score: 5 } },
        { key: 'B', label: 'Give them a single percentage so they have something firm', desc: 'A falsely precise number gets over-trusted and quoted as fact. The decimal point implies a confidence you do not have.', effect: { score: -4 } },
        { key: 'C', label: 'Tell them the science cannot give a number and leave it there', desc: 'Technically true and operationally useless — it reads as the expert refusing to help.', effect: { score: -3 } },
        { key: 'D', label: 'Give a wide percentage range with heavy caveats', desc: 'Better than a point estimate, but a bare range without decision implications still leaves officials guessing what to do.', effect: { score: 1 } }
      ]
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
        { key: 'B', label: 'Wait until the model has been peer reviewed before sharing anything', desc: 'Peer review is the right standard in normal times; here it can mean people stay in the flood path until it is too late.', effect: { score: -4 } },
        { key: 'C', label: 'Share it as a firm finding to make sure people act', desc: 'Overstates certainty on an unreviewed model. If it is wrong, you have spent credibility you will need for the next warning.', effect: { score: -5 } },
        { key: 'D', label: 'Quietly brief officials only, not the public', desc: 'Leaves the exposed public uninformed about a hazard above their homes. Provisional is fine; secret is not.', effect: { score: -2 } }
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
        { key: 'A', label: 'Release simplified, plain-language risk areas with clear "what to do" guidance, holding back only raw detail that misleads', desc: 'Informs the exposed public in a form they can act on, without dumping confusing technical detail. Informed people act more safely.', effect: { score: 5 } },
        { key: 'B', label: 'Withhold the maps to avoid causing panic', desc: 'Withholding hazard information from the people it affects rarely prevents harm and devastates trust when the hazard materialises.', effect: { score: -5 } },
        { key: 'C', label: 'Publish the full raw technical maps unedited', desc: 'Accurate but easily misread — uncaveated technical maps can cause the very panic and confusion that was feared.', effect: { score: -1 } },
        { key: 'D', label: 'Release the maps to officials only, not the public', desc: 'The people standing below the dams are the ones who most need to know, and they are exactly who this leaves out.', effect: { score: -3 } }
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
        { key: 'B', label: 'Wait for technical confirmation before adjusting any advice', desc: 'Dismisses a credible local signal because it has not yet been validated by instruments — risking both lives and trust.', effect: { score: -4 } },
        { key: 'C', label: 'Note the concern but proceed with the access route as planned', desc: 'Ignores a real hazard signal and a relationship that matters. If the valley fails, this is the indefensible choice.', effect: { score: -5 } },
        { key: 'D', label: 'Restrict access permanently with no plan to verify', desc: 'Precautionary but not decision-ready — no follow-up, no reassessment, and no path back to a normal access decision.', effect: { score: -1 } }
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
        { key: 'B', label: 'Deny the map is real to limit the damage', desc: 'A denial that is quickly disproven destroys trust in everything you say next. Never deny a real document.', effect: { score: -6 } },
        { key: 'C', label: 'Say nothing and hope it blows over', desc: 'The vacuum fills with the most alarming possible reading of your own draft. Silence cedes the narrative.', effect: { score: -4 } },
        { key: 'D', label: 'Confirm it is a draft and ask media to take it down, without releasing an official version', desc: 'Better than denial, but leaves the public with a stripped-down draft and no authoritative replacement to anchor to.', effect: { score: -1 } }
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
        { key: 'A', label: 'Prioritise by hazard exposure and vulnerability, not economic profile — and explicitly include the remote and isolated communities', desc: 'Allocates scarce expertise to where people are most at risk, and says so openly. Equitable and defensible.', effect: { score: 5 } },
        { key: 'B', label: 'Follow the national economic priorities — highways and tourist centres first', desc: 'Lets economic and political profile, not exposure, decide who gets life-safety advice. The vulnerable wait longest exactly when it matters most.', effect: { score: -4 } },
        { key: 'C', label: 'First-come, first-served as requests arrive', desc: 'Neutral on its face, but defaults to whoever is best-connected and loudest — usually not the most exposed.', effect: { score: -2 } },
        { key: 'D', label: 'Defer the allocation entirely to officials', desc: 'Allocating scarce science capacity is exactly the call you should be advising on, not handing back unadvised.', effect: { score: -3 } }
      ]
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
