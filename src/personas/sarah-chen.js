// ============================================================================
// PERSONA: BUSINESS OWNER  -  Sarah Chen, Alpine Outdoor & Hardware
// A family-owned retail store (outdoor gear, hardware, gas, emergency supplies)
// in a small alpine township when a M7.9 Alpine Fault earthquake strikes at
// 10:47 a.m. Sarah must balance family, staff, community and financial survival
// when every decision helps one group while disadvantaging another.
// Source brief: "Persona Sarah Chen".
//
// Loaded AFTER nz-cascading-impact-simulator.js; registers itself by extending
// the engine's shared registries (purely additive).
// ============================================================================
(function () {
  'use strict';

  SCENARIO_CONFIGS.sarahchen = {
    label: 'BUSINESS OWNER',
    actorTitle: 'Owner',
    classification: 'L2',
    classCSS: 'l2',
    classText: 'BUSINESS CRISIS',
    debriefName: 'M7.9 Alpine Fault - Alpine Outdoor & Hardware',
    facObjective: 'a small-business owner balancing four competing responsibilities - family, staff, community and ' +
      'financial survival - when communications have failed and every decision helps one group while disadvantaging ' +
      'another. Key themes: life before assets, ethical and transparent allocation of scarce supplies, staff welfare, ' +
      'and defensible decisions under extreme financial uncertainty.',
    startScore: 50,
    metrics: { stockValue: 450000, uninsured: 180000, cashWeeks: 4, staff: 12 },
    statusBar: [
      { id: 'stock', label: 'Emergency Stock:', value: 'Limited', cls: 'warning' },
      { id: 'cash', label: 'Cash Runway:', value: '~4 wks', cls: 'warning' },
      { id: 'staff', label: 'Staff On Site:', value: '7/12', cls: 'good' },
      { id: 'building', label: 'Building:', value: 'Damaged', cls: 'critical' },
      { id: 'power', label: 'Power/EFTPOS:', value: 'Down', cls: 'critical' }
    ],
    panels: {
      groupsTitle: 'Business Status',
      groups: [
        { label: 'Building', value: 'Damaged', cls: 'failed' },
        { label: 'Stock On Hand', value: '~$450k', cls: 'degraded' },
        { label: 'Uninsured Stock', value: '~$180k', cls: 'failed' },
        { label: 'Cash Runway', value: '~4 weeks', cls: 'degraded' },
        { label: 'Staff On Site', value: '7 / 12', cls: 'good' },
        { label: 'Gas Cylinders', value: 'Scattered', cls: 'failed' }
      ],
      agenciesTitle: 'Calls & Contacts',
      agencies: [
        { label: 'Bank', value: 'Unreachable', cls: 'failed' },
        { label: 'Insurer', value: 'Unreachable', cls: 'failed' },
        { label: 'Accountant', value: 'Unreachable', cls: 'failed' },
        { label: 'Civil Defence', value: 'Activating', cls: 'degraded' },
        { label: 'Medical Centre', value: 'Requesting', cls: 'degraded' },
        { label: 'Media', value: 'Calling', cls: 'degraded' }
      ],
      lifelinesTitle: 'Shop & Utilities',
      lifelines: [
        { label: 'Power', value: 'Out', cls: 'failed' },
        { label: 'EFTPOS', value: 'Down', cls: 'failed' },
        { label: 'Internet', value: 'Down', cls: 'failed' },
        { label: 'Cell Network', value: 'Intermittent', cls: 'degraded' },
        { label: 'Water', value: 'Restrictions', cls: 'degraded' },
        { label: 'Security Alarms', value: 'Down', cls: 'failed' }
      ],
      transportTitle: 'Site Hazards',
      transport: [
        { label: 'Front Windows', value: 'Shattered', cls: 'failed' },
        { label: 'Shelving', value: 'Collapsed', cls: 'failed' },
        { label: 'Gas Cylinders', value: 'Scattered', cls: 'failed' },
        { label: 'Walls', value: 'Cracked', cls: 'degraded' },
        { label: 'Ceiling Tiles', value: 'Fallen', cls: 'degraded' },
        { label: 'Roads', value: 'Blocked', cls: 'failed' }
      ],
      cascadeTitle: 'Cascading Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '⛽', name: 'Gas Leak', level: 'High', cls: 'high' },
        { icon: '🔓', name: 'Looting / Security', level: 'Moderate', cls: 'moderate' },
        { icon: '🛢️', name: 'Fuel Shortage', level: 'Moderate', cls: 'moderate' },
        { icon: '❄️', name: 'Overnight Snow', level: 'High', cls: 'high' },
        { icon: '🏗️', name: 'Structural', level: 'Moderate', cls: 'moderate' }
      ],
      resourcesTitle: 'Resources'
    }
  };

  UTILITY_DEFAULTS.sarahchen = {
    stock: { label: 'Emergency Stock', value: 60, unit: '%' },
    cash: { label: 'Cash Reserves', value: 45, unit: '%' },
    staffing: { label: 'Staff Available', value: 55, unit: '%' },
    building: { label: 'Building Safety', value: 25, unit: '%' },
    power: { label: 'Power / Comms', value: 10, unit: '%' },
    security: { label: 'Security', value: 30, unit: '%' }
  };

  SOFT_METRIC_DEFAULTS.sarahchen = {
    safety: { label: 'Life Safety', value: 60, icon: '🛡️' },
    staff: { label: 'Staff Welfare', value: 60, icon: '👷' },
    community: { label: 'Community Trust', value: 55, icon: '🤝' },
    finances: { label: 'Financial Resilience', value: 55, icon: '💰' },
    reputation: { label: 'Reputation', value: 60, icon: '⭐' },
    family: { label: 'Family Wellbeing', value: 45, icon: '🏠' }
  };

  Object.assign(UTILITY_EFFECTS, {
    'sarah_building': { 'A': { building: 5, stock: -3 }, 'B': { building: -5 } },
    'sarah_supplies': { 'A': { stock: -10 }, 'B': { stock: -20 }, 'D': { stock: -30 } },
    'sarah_credit': { 'A': { cash: -5 }, 'C': { cash: -15 } },
    'sarah_medical_centre': { 'A': { stock: -10 } },
    'sarah_insurance': { 'A': { building: 5 } },
    'sarah_donate': { 'A': { stock: -10 }, 'B': { stock: -30 } },
    'sarah_security': { 'A': { security: 10 }, 'C': { security: -15 } }
  });

  Object.assign(SOFT_METRIC_EFFECTS, {
    'sarah_family': { 'A': { family: 8, staff: 4, community: 3 }, 'B': { family: -6, safety: -2 }, 'C': { staff: -6, community: -5 }, 'D': { family: -3, staff: -3 } },
    'sarah_building': { 'A': { safety: 8, community: 5, reputation: 4 }, 'B': { safety: -12, reputation: -4 }, 'C': { safety: -5 }, 'D': { community: -4, safety: 3 } },
    'sarah_staff': { 'A': { staff: 8, community: 3, reputation: 4 }, 'B': { staff: -10, reputation: -3 }, 'C': { community: -2, staff: 3 }, 'D': { staff: -6, reputation: -3 } },
    'sarah_supplies': { 'A': { community: 8, reputation: 6, finances: 2 }, 'B': { community: -4, reputation: -3 }, 'C': { community: -3 }, 'D': { community: 3, finances: -6 } },
    'sarah_price': { 'A': { reputation: 8, community: 6, finances: -2 }, 'B': { reputation: -12, community: -8, finances: 3 }, 'C': { finances: 2, reputation: -2 }, 'D': { community: -3 } },
    'sarah_credit': { 'A': { community: 8, reputation: 5, finances: -3 }, 'B': { community: -5, finances: 3 }, 'C': { finances: -6 }, 'D': { community: -3, finances: -2 } },
    'sarah_medical_centre': { 'A': { community: 8, safety: 6, reputation: 5 }, 'B': { safety: -8, reputation: -5 }, 'C': { community: -3, safety: 4 }, 'D': { safety: -5 } },
    'sarah_generator': { 'A': { community: 8, reputation: 7, safety: 4, finances: -2 }, 'B': { reputation: -12, community: -8, finances: 4 }, 'C': { reputation: -10, community: -6 }, 'D': { community: -4, reputation: -3 } },
    'sarah_insurance': { 'A': { safety: 8, reputation: 5, finances: 2 }, 'B': { safety: -8, community: -3 }, 'C': { finances: -5 }, 'D': { safety: -5 } },
    'sarah_employee_theft': { 'A': { staff: 8, reputation: 5, finances: -2 }, 'B': { staff: -8, reputation: -3 }, 'C': { finances: -5, staff: -2 }, 'D': { staff: -8, reputation: -4 } },
    'sarah_social_media': { 'A': { reputation: 8, community: 5, finances: 3 }, 'B': { reputation: -5, community: -3 }, 'C': { reputation: -4, finances: -3 }, 'D': { reputation: -4 } },
    'sarah_donate': { 'A': { community: 8, reputation: 6, finances: -3, staff: 2 }, 'B': { finances: -10, community: 4 }, 'C': { community: -8, reputation: -6 }, 'D': { reputation: -8, community: -4 } },
    'sarah_security': { 'A': { family: 6, finances: 4, community: 3 }, 'B': { family: -5, safety: -3 }, 'C': { finances: -5 }, 'D': { family: -8, safety: -4 } }
  });

  Object.assign(STYLE_TAGS, {
    'sarah_family': { 'A': { decisive: 1, lifeSafety: 1, centralized: 1 }, 'B': { lifeSafety: -1, centralized: 1 }, 'C': { centralized: -2 }, 'D': { decisive: -1, centralized: -1 } },
    'sarah_building': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { lifeSafety: -2, communityTrust: 1 }, 'C': { lifeSafety: -1 }, 'D': { centralized: 1, communityTrust: -1 } },
    'sarah_staff': { 'A': { decisive: 1, communityTrust: 1 }, 'B': { centralized: 2, communityTrust: -2 }, 'C': { centralized: -1 }, 'D': { centralized: 1, communityTrust: -1 } },
    'sarah_supplies': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, centralized: -1 }, 'C': { centralized: 2, communityTrust: -1 }, 'D': { communityTrust: 2, centralized: -2 } },
    'sarah_price': { 'A': { communityTrust: 2, decisive: 1 }, 'B': { centralized: 1, communityTrust: -2 }, 'C': { decisive: 1 }, 'D': { decisive: -1 } },
    'sarah_credit': { 'A': { communityTrust: 2, decisive: 1 }, 'B': { centralized: 1, communityTrust: -1 }, 'C': { communityTrust: 1, centralized: -2 }, 'D': { decisive: 1 } },
    'sarah_medical_centre': { 'A': { decisive: 1, lifeSafety: 2, communityTrust: 1 }, 'B': { lifeSafety: -2 }, 'C': { lifeSafety: 1, communityTrust: -1 }, 'D': { decisive: -2 } },
    'sarah_generator': { 'A': { communityTrust: 2, lifeSafety: 1, decisive: 1 }, 'B': { centralized: 1, communityTrust: -2 }, 'C': { communityTrust: -2 }, 'D': { centralized: 1, communityTrust: -1 } },
    'sarah_insurance': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { lifeSafety: -2, centralized: 1 }, 'C': { decisive: 2, lifeSafety: 1 }, 'D': { decisive: -2 } },
    'sarah_employee_theft': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { centralized: 2, communityTrust: -2 }, 'C': { centralized: -2 }, 'D': { centralized: 2, communityTrust: -2 } },
    'sarah_social_media': { 'A': { decisive: 1, communityTrust: 1, centralized: 1 }, 'B': { communityTrust: -1 }, 'C': { decisive: -2 }, 'D': { centralized: 1, communityTrust: -1 } },
    'sarah_donate': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { communityTrust: 2, centralized: -1 }, 'C': { centralized: 1, communityTrust: -2 }, 'D': { centralized: 1, communityTrust: -2 } },
    'sarah_security': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { centralized: 2, communityTrust: -1 }, 'C': { decisive: -1 }, 'D': { lifeSafety: -2 } }
  });

  Object.assign(CONSEQUENCE_MAP, {
    'sarah_building': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Aftershock Brings Down Part of the Shopfront',
          body: 'You kept trading inside, and an aftershock brought down a section of the damaged shopfront onto the trading ' +
            'floor where customers were queuing. There are fresh injuries, the gas hazard is now worse, and what was a ' +
            'business-continuity question has become a serious-harm one. Life had to come before the stock.',
          source: 'Shop Floor / Aftershock',
          scorePenalty: -5
        }
      }
    },
    'sarah_price': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Profiteering Backlash',
          body: 'Word of the sharp price rises spread within the hour. The town that called you "the only place with ' +
            'emergency supplies" now calls you a profiteer; a photo of your new prices is circulating, customers are ' +
            'cancelling orders, and a relationship built over 18 years is taking damage that will outlast the earthquake.',
          source: 'Main Street / Social Media',
          scorePenalty: -4
        }
      }
    },
    'sarah_generator': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Medicine Spoils',
          body: 'You took the tourist’s $5,000 for the last generator. Without it, the local farmer could not keep his ' +
            'refrigerated medicine supply cold, and it has spoiled - a real consequence for a real neighbour, and a story ' +
            'the town will remember about who you sold a life-critical item to in a disaster.',
          source: 'Community',
          scorePenalty: -4
        }
      }
    }
  });

  Object.assign(FACILITATOR_NOTES, {
    'sarah_building': {
      learningObjective: 'Put life safety before assets and community demand, while still meeting genuine need.',
      bestPractice: 'A',
      teachingNote: 'A building with cracked walls, a possible gas leak and aftershocks is not a place to send customers - ' +
        'an injury has already happened. Closing the building and serving essential emergency stock from a safe spot ' +
        'outside protects life and keeps supplying the community, without the false choice of "trade inside or abandon them".',
      references: [
        { label: 'Life before assets', desc: 'no stock or sale justifies sending people into an unsafe, gas-affected building' }
      ],
      discussionPrompts: [
        'What is the safe way to keep supplying the community without anyone entering the building?',
        'Who carries the liability if a customer is hurt inside a building you knew was unsafe?'
      ]
    },
    'sarah_supplies': {
      learningObjective: 'Allocate scarce emergency supplies fairly, proportionately and with a reserve for responders.',
      bestPractice: 'A',
      teachingNote: 'There is no perfectly fair answer, but rationing per person at fair prices, prioritising the vulnerable ' +
        'and essential needs, and holding a reserve for emergency services is defensible. Selling normally empties the ' +
        'shelves to the early and well-off; giving everything away leaves nothing for later or for the business to survive.',
      references: [
        { label: 'Equitable allocation', desc: 'ration by need, protect the vulnerable, reserve for the official response' }
      ],
      discussionPrompts: [
        'How do you decide what counts as an "essential" item to ration first?',
        'How do you communicate the rationing rule so it is seen as fair?'
      ]
    },
    'sarah_generator': {
      learningObjective: 'Let genuine need, not the highest bidder, decide the allocation of a life-critical item.',
      bestPractice: 'A',
      teachingNote: 'A tourist’s $5,000 versus a farmer keeping refrigerated medicine cold is the cleanest test of the whole ' +
        'scenario. Selling to the farmer at a normal price puts life-critical need ahead of cash and protects your standing; ' +
        'taking the highest bid is profiteering on a life-safety item.',
      references: [
        { label: 'Need over price', desc: 'allocate life-critical goods by consequence, not willingness to pay' }
      ],
      discussionPrompts: [
        'What makes an item "life-critical", and how does that change the allocation rule?',
        'How would each choice read on the front page a week later?'
      ]
    },
    'sarah_insurance': {
      learningObjective: 'Follow life-safety and lawful emergency direction over asset preservation - and document everything.',
      bestPractice: 'A',
      teachingNote: 'When the insurer says "touch nothing" but Civil Defence says "clear the dangerous debris now", safety and ' +
        'lawful emergency direction win. Make the gas cylinders and hazards safe, but photograph and note everything first ' +
        'so the insurance position is protected, and tell the insurer what safety actions you took and why.',
      references: [
        { label: 'Emergency direction vs insurance', desc: 'make-safe duties and lawful direction override "do not touch"; document to protect the claim' }
      ],
      discussionPrompts: [
        'How do you both comply with a safety direction and protect your insurance position?',
        'What records would you want if this decision were reviewed months later?'
      ]
    },
    'sarah_employee_theft': {
      learningObjective: 'Respond to a desperate staff member humanely, consistently and on the record.',
      bestPractice: 'A',
      teachingNote: 'An employee taking supplies for a family with nothing is a human problem, not just a theft. A calm, ' +
        'consistent rule - essentials now, recorded as staff credit or pay, the same for everyone - is more defensible and ' +
        'more humane than instant dismissal, public humiliation, or a free-for-all that empties the stock the community needs.',
      references: [
        { label: 'Fair, consistent process', desc: 'treat staff need humanely and identically; record decisions' }
      ],
      discussionPrompts: [
        'How do you address this without either condoning theft or destroying morale?',
        'What rule could you set so every staff member is treated the same?'
      ]
    },
    'sarah_price': {
      learningObjective: 'Avoid disaster profiteering; protect trust and reputation over short-term margin.',
      bestPractice: 'A',
      teachingNote: 'Replacement stock will cost more, but sharply raising prices on emergency goods in a disaster is the ' +
        'fastest way to destroy 18 years of community trust (and invite legal scrutiny). Holding prices, and being seen to, ' +
        'protects the relationship the business depends on for its own recovery.',
      references: [
        { label: 'Fair pricing in emergencies', desc: 'reputational and legal risk of price-gouging far outweighs the margin' }
      ],
      discussionPrompts: [
        'Where is the line between covering genuine replacement cost and profiteering?',
        'How does pricing today affect the business’s recovery six months from now?'
      ]
    }
  });

  NOISE_POOL.sarahchen = [
    {
      tag: 'NOISE', title: 'A Rival Owner Suggests You Both Close',
      body: 'The owner of a competing shop quietly suggests you both shut for the day so prices "hold up" once you reopen, ' +
        'rather than undercutting each other while stock is scarce.',
      source: 'Neighbouring Owner',
      prompt: 'How do you respond to the suggestion?',
      options: [
        { key: 'A', label: 'Decline - coordinating to restrict supply and hold prices in a disaster is wrong and unsafe for the town', desc: 'A clear no to anything that looks like price-fixing or withholding essentials when the community needs them.', effect: { score: 2 } },
        { key: 'B', label: 'Agree - it protects both businesses', desc: 'Coordinating to restrict supply and prop up prices during a disaster is both unethical and a legal risk.', effect: { score: -3 } },
        { key: 'C', label: 'Stay non-committal and keep trading your own way', desc: 'Avoids the deal, but a flat ethical "no" would have been clearer and more defensible.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Tourist Wants to Buy All the Gas Canisters',
      body: 'A tourist offers to buy your entire remaining stock of gas canisters in one go - cash - clearly intending to ' +
        'resell them to other stranded travellers.',
      source: 'Counter',
      prompt: 'How do you handle the bulk request?',
      options: [
        { key: 'A', label: 'Decline the bulk buy and ration canisters per customer so more people can get one', desc: 'Stops one buyer cornering a scarce essential to resell, and keeps gas available to the community.', effect: { score: 2 } },
        { key: 'B', label: 'Sell them the lot - cash is cash', desc: 'Lets one reseller corner a life-essential item and onsell it at a markup to desperate people. Bad for the town and your name.', effect: { score: -3 } },
        { key: 'C', label: 'Sell them half', desc: 'Better than the lot, but still hands a reseller a big share of a scarce essential.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Councillor Wants You at a Recovery Meeting Now',
      body: 'A local councillor wants you to come to a business-recovery coordination meeting immediately, while your shop is ' +
        'still full of customers, hazards and unsecured stock.',
      source: 'Local Councillor',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Send your offsider or join briefly by phone, and stay to manage the immediate hazards and customers', desc: 'Stays represented in the recovery conversation without abandoning the live safety and supply situation on your floor.', effect: { score: 2 } },
        { key: 'B', label: 'Drop everything and attend in person now', desc: 'Leaves a hazardous, busy shop unmanaged for a meeting that can wait an hour.', effect: { score: -1 } },
        { key: 'C', label: 'Refuse any involvement in recovery coordination', desc: 'Cuts you out of decisions that will shape the town’s - and your business’s - recovery.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Refund Demand Mid-Crisis',
      body: 'A customer is at the counter loudly demanding a refund for a cracked item they bought last week, while a queue of ' +
        'people waits for emergency supplies behind them.',
      source: 'Counter',
      prompt: 'How do you handle the refund demand?',
      options: [
        { key: 'A', label: 'Acknowledge it, note their details, and promise to sort it once the emergency response is handled', desc: 'Keeps the customer onside without letting a routine dispute block the emergency queue behind them.', effect: { score: 2 } },
        { key: 'B', label: 'Stop and process the full refund right now', desc: 'Holds up a queue of people who need emergency essentials for a non-urgent refund.', effect: { score: -1 } },
        { key: 'C', label: 'Tell them flatly to come back another day', desc: 'A curt brush-off needlessly burns a long-term customer in front of a watching queue.', effect: { score: 0 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Reporter Asks About "Businesses Exploiting the Disaster"',
      body: 'A reporter calls asking for a comment on "businesses exploiting the disaster", clearly fishing for a profiteering ' +
        'angle, and mentions your shop by name.',
      source: 'Media',
      prompt: 'How do you respond to the reporter?',
      options: [
        { key: 'A', label: 'Give one calm, factual line about what you are actually doing for the community, then get back to it', desc: 'Puts an accurate, steady message on the record and denies the profiteering angle oxygen.', effect: { score: 2 } },
        { key: 'B', label: 'Refuse to comment and hang up', desc: 'A flat "no comment" reads as something to hide and lets others define your story.', effect: { score: -1 } },
        { key: 'C', label: 'Vent your frustration about the question on the record', desc: 'Hands the reporter the emotional, defensive soundbite they were hoping for.', effect: { score: -2 } }
      ]
    }
  ];

  // ---- Event sequence -------------------------------------------------------
  PERSONA_EVENTS.sarahchen = [
    {
      time: 0, type: 'inject', tag: 'MAINSHOCK',
      title: 'M7.9 Alpine Fault - The Shop Comes Apart',
      body: 'At 10:47 a.m. a magnitude 7.9 Alpine Fault earthquake strikes the township. Alpine Outdoor & Hardware - your ' +
        'family business of 18 years - suffers structural damage: front windows shattered, shelving collapsed, gas cylinders ' +
        'scattered across the floor. Power, EFTPOS and internet are gone, the cell network is intermittent, and the roads ' +
        'are blocked. Tourists are stranded, your emergency stock has just become the most valuable thing in town, and ' +
        'hundreds of people are already heading for your door.',
      source: 'The Shop',
      aftershock: true
    },
    {
      time: 3, type: 'info', tag: 'SITUATION',
      title: 'Four Responsibilities, No Communications',
      body: 'You cannot reach your firefighter husband, your two children at school, or your elderly parents nearby - and you ' +
        'have no idea if they are safe. Inside, 7 of your 12 staff are on site, some already wanting to leave for their own ' +
        'families. Around $450,000 of stock is in the building, including $180,000 of emergency supplies delivered yesterday ' +
        'that is not yet on the insurance schedule. Cash reserves cover about four weeks of wages, and the bank, insurer and ' +
        'accountant are all unreachable.',
      source: 'Alpine Outdoor & Hardware'
    },
    {
      time: 8, type: 'decision', tag: 'OWNER',
      title: 'Family or the Business?',
      body: 'You have no contact with your husband, your two children at school, or your elderly parents. Every instinct says ' +
        'run to them - but 12 staff and a town that depends on your emergency supplies are looking to you right now.',
      decisionId: 'sarah_family',
      prompt: 'Do you go to your family or stay and lead?',
      options: [
        { key: 'A', label: 'Secure your family fast and focused - get word out, check the school and your parents - brief your team before you go, and return to lead', desc: 'You cannot lead well while frantic about your children. Make family safe, delegate clearly, and come back - humane and realistic.', effect: { score: 5 } },
        { key: 'B', label: 'Stay at the shop and push your worry down - the business needs you now', desc: 'A leader sick with worry about her own children makes poor calls, and they are your children. Suppressing it is not the same as resolving it.', effect: { score: -3 } },
        { key: 'C', label: 'Leave entirely and do not return to the shop today', desc: 'Abandons 12 staff and the town’s emergency supply with no leader at the moment both need direction most.', effect: { score: -4 } },
        { key: 'D', label: 'Send a junior staff member to check on your family while you stay', desc: 'Offloads your most personal duty onto staff who have their own frightened families to worry about.', effect: { score: -2 } }
      ]
    },
    {
      time: 20, type: 'decision', tag: 'OWNER',
      title: 'An Unsafe Building Full of Customers',
      body: 'The building has cracked walls, fallen ceiling tiles, broken glass, leaning shelving and a possible gas leak. ' +
        'Customers keep pushing in for emergency supplies, and one has just been hurt by falling stock.',
      decisionId: 'sarah_building',
      prompt: 'What do you do about the unsafe building?',
      options: [
        { key: 'A', label: 'Close the building to entry now, move essential emergency stock to a safe spot outside or at the door, and serve people from there', desc: 'Life before assets - and you still supply the community, just without sending anyone into a gas-affected, aftershock-prone building.', effect: { score: 5 } },
        { key: 'B', label: 'Keep trading inside - the community needs the supplies', desc: 'Someone has already been hurt; a gas leak plus aftershocks makes the next injury potentially fatal. No sale is worth it.', effect: { score: -6 } },
        { key: 'C', label: 'Allow controlled access, a few customers at a time', desc: 'Fewer people, but still inside an unsafe, possibly gas-leaking building. The hazard does not care how many are in the room.', effect: { score: -3 } },
        { key: 'D', label: 'Lock up entirely and turn everyone away with no supplies', desc: 'Safe, but abandons a community that genuinely needs the gear you could have passed out from the front.', effect: { score: -2 } }
      ]
    },
    {
      time: 32, type: 'decision', tag: 'OWNER',
      title: 'Staff Who Want to Leave',
      body: 'Several staff want to go to their own families - children at school, elderly relatives, partners in emergency ' +
        'services. Two migrant staff cannot contact overseas family, and one of them is visibly distraught.',
      decisionId: 'sarah_staff',
      prompt: 'How do you handle your staff?',
      options: [
        { key: 'A', label: 'Release anyone who needs to go to their families, keep willing volunteers, and support the distraught migrant staff member', desc: 'People and safety before trading. Those who stay will be volunteers, and you have not trapped frightened staff away from their families.', effect: { score: 5 } },
        { key: 'B', label: 'Require all staff to stay - there is no business without staff', desc: 'Traps frightened people away from their own families and at risk in a damaged building. Unsafe and corrosive to trust.', effect: { score: -5 } },
        { key: 'C', label: 'Let everyone go and close completely', desc: 'Defensible and safe, but gives up the community-supply role that willing volunteers might have kept running.', effect: { score: -1 } },
        { key: 'D', label: 'Pressure staff to stay by stressing how much the community needs them', desc: 'Guilt-tripping frightened staff is manipulation; it damages morale and the loyalty you will need for the recovery.', effect: { score: -3 } }
      ]
    },
    {
      time: 44, type: 'decision', tag: 'ETHICAL',
      title: 'Allocating Scarce Emergency Supplies',
      body: 'Demand explodes for water containers, batteries, torches, gas cookers, sleeping bags and first-aid kits. Stock ' +
        'is limited, everyone is anxious, and there is no obviously fair answer.',
      decisionId: 'sarah_supplies',
      prompt: 'How do you allocate the scarce emergency supplies?',
      options: [
        { key: 'A', label: 'Ration per person at fair prices, prioritise the vulnerable and essential needs, and hold a reserve for emergency services', desc: 'Fair, proportionate, and keeps something back for responders. Defensible even though no allocation pleases everyone.', effect: { score: 5 } },
        { key: 'B', label: 'Sell normally, first-come first-served, until it runs out', desc: 'The early and well-off empty the shelves; the vulnerable and those still digging out their homes miss out entirely.', effect: { score: -3 } },
        { key: 'C', label: 'Reserve everything for emergency services and sell nothing to the public', desc: 'Responders matter, but the public also genuinely needs water, light and warmth tonight.', effect: { score: -2 } },
        { key: 'D', label: 'Give it all away free to whoever asks', desc: 'Generous, but empties your stock within the hour and leaves nothing for later or for the business the town needs to survive.', effect: { score: -3 } }
      ]
    },
    {
      time: 56, type: 'decision', tag: 'ETHICAL',
      title: 'Price Increases',
      body: 'Replacement stock will likely cost far more than what is on your shelves. Some retailers are urging you to raise ' +
        'prices immediately; others say hold them. Your accountant is unreachable.',
      decisionId: 'sarah_price',
      prompt: 'What do you do about pricing?',
      options: [
        { key: 'A', label: 'Hold prices at normal levels and be seen to do so - trust now is worth more than margin', desc: 'Avoids any whiff of profiteering and protects the community relationship the business depends on for its own recovery.', effect: { score: 5 } },
        { key: 'B', label: 'Raise prices sharply to reflect replacement cost and scarcity', desc: 'Price-gouging emergency goods in a disaster torches 18 years of trust and invites reputational and legal damage.', effect: { score: -6 } },
        { key: 'C', label: 'Raise prices modestly and transparently to cover genuine replacement cost', desc: 'Defensible if it is truly cost-recovery and openly explained, but the optics of any rise in this moment are dangerous.', effect: { score: 1 } },
        { key: 'D', label: 'Stop selling the scarce items rather than decide on a price', desc: 'Denies the community supplies it needs just to avoid making the pricing call.', effect: { score: -2 } }
      ]
    },
    {
      time: 68, type: 'decision', tag: 'ETHICAL',
      title: 'Cash, Credit and No EFTPOS',
      body: 'With EFTPOS and banking down, many locals have no way to pay. Long-standing customers ask you to "put it on my ' +
        'account"; stranded tourists have no cash at all.',
      decisionId: 'sarah_credit',
      prompt: 'How do you handle payment?',
      options: [
        { key: 'A', label: 'Extend informal credit to known locals with a simple written record, and use judgement on essentials for others', desc: 'Keeps essentials flowing to neighbours who genuinely cannot pay today, while a written record protects your cash flow later.', effect: { score: 5 } },
        { key: 'B', label: 'Cash only - no payment, no goods - to preserve business cash flow', desc: 'Denies essentials to neighbours who simply cannot access money today, in a community you will rely on for years.', effect: { score: -3 } },
        { key: 'C', label: 'Give everything away to anyone who asks', desc: 'No record and no recoverable value; generous to a fault, and it threatens the business the community will need tomorrow.', effect: { score: -3 } },
        { key: 'D', label: 'Credit for tourists, cash for locals', desc: 'Backwards: you will never see the tourists again, while the locals you know are the ones you can safely extend credit to.', effect: { score: -2 } }
      ]
    },
    {
      time: 78, type: 'cascade', tag: 'AFTERSHOCK',
      title: 'Major Aftershock - More Damage',
      body: 'A major aftershock rolls through. More stock comes off the leaning shelves, a fresh crack opens in a wall, and a ' +
        'nearby building partially collapses. A builder taking shelter outside your shop tells you flatly that he would not ' +
        'set foot inside the building in its current state.',
      source: 'Main Street / GeoNet',
      aftershock: true
    },
    {
      time: 86, type: 'decision', tag: 'ETHICAL',
      title: 'The Medical Centre Needs Supplies',
      body: 'The local medical centre urgently requests torches, batteries and water containers to keep treating casualties - ' +
        'but you have only enough to meet half their request, and the public at your door is clamouring for the same items.',
      decisionId: 'sarah_medical_centre',
      prompt: 'How do you handle the medical centre’s request?',
      options: [
        { key: 'A', label: 'Prioritise the medical centre for the life-critical share, supply what you can, and ration the remainder to the public', desc: 'A medical centre treating the injured is a life-safety priority; you meet their critical need and still ration fairly to others.', effect: { score: 5 } },
        { key: 'B', label: 'Serve the paying public at the counter first', desc: 'Puts counter cash ahead of a medical centre treating casualties. Life safety has to come first here.', effect: { score: -5 } },
        { key: 'C', label: 'Give the medical centre absolutely everything and leave nothing for the public', desc: 'The medical priority is right, but the public also has real basic needs for the cold night ahead.', effect: { score: -2 } },
        { key: 'D', label: 'Make them wait while you work out what to do', desc: 'A medical centre treating casualties cannot wait while you deliberate.', effect: { score: -3 } }
      ]
    },
    {
      time: 98, type: 'decision', tag: 'ETHICAL',
      title: 'The Last Generator',
      body: 'A tourist offers you $5,000 cash on the spot for your last portable generator. Moments later a local farmer asks ' +
        'for that same generator to keep a refrigerated medicine supply running.',
      decisionId: 'sarah_generator',
      prompt: 'Who gets the last generator?',
      options: [
        { key: 'A', label: 'Sell it to the farmer at a fair, normal price - life-critical medicine outranks a tourist’s cash', desc: 'Need over the highest bidder. Keeping medicine cold is a life-safety use, and the choice protects your standing in the town.', effect: { score: 5 } },
        { key: 'B', label: 'Take the tourist’s $5,000 - the business badly needs the cash', desc: 'Selling a life-critical item to the highest bidder over a medical need is the definition of disaster profiteering.', effect: { score: -6 } },
        { key: 'C', label: 'Auction it to whoever pays the most', desc: 'Need-blind by design, and the most exposed way to profiteer on a life-essential item.', effect: { score: -5 } },
        { key: 'D', label: 'Refuse to sell it to either and keep it for the shop', desc: 'Hoards a critical asset the community urgently needs while people go without.', effect: { score: -3 } }
      ]
    },
    {
      time: 110, type: 'decision', tag: 'ETHICAL',
      title: 'Insurer vs Civil Defence',
      body: 'The insurer finally gets through with a clear instruction: "Do not remove or dispose of anything until it is ' +
        'assessed." Minutes later Civil Defence asks you to clear the dangerous debris - scattered gas cylinders and broken ' +
        'glass - immediately, for public safety.',
      decisionId: 'sarah_insurance',
      prompt: 'Whose instruction do you follow?',
      options: [
        { key: 'A', label: 'Make the dangerous hazards safe now (secure the gas cylinders, clear hazards), document everything with photos and notes first, and tell the insurer what you did and why', desc: 'Life-safety and lawful emergency direction override "touch nothing", and documenting first protects your insurance position.', effect: { score: 5 } },
        { key: 'B', label: 'Follow the insurer and leave everything exactly where it is', desc: 'Leaves scattered gas cylinders as a live public hazard purely to protect a claim. Safety has to come first.', effect: { score: -5 } },
        { key: 'C', label: 'Clear and dispose of everything fast to get the site sorted', desc: 'Over-clears - destroying evidence and possibly insured stock - without the documentation that would protect you.', effect: { score: -3 } },
        { key: 'D', label: 'Do nothing until you get written clarification from the insurer', desc: 'Leaves a dangerous hazard in a public street while you wait for paperwork that may take hours.', effect: { score: -3 } }
      ]
    },
    {
      time: 122, type: 'decision', tag: 'OWNER',
      title: 'An Employee Caught Taking Supplies',
      body: 'One of your employees is caught taking emergency supplies home without permission. They explain, quietly: "My ' +
        'family has nothing."',
      decisionId: 'sarah_employee_theft',
      prompt: 'How do you handle the employee?',
      options: [
        { key: 'A', label: 'Handle it calmly and consistently: let them take essentials now, recorded as staff credit or pay, and apply the same fair rule to every staff member', desc: 'Humane, consistent and documented - it meets a real need without either condoning theft or destroying morale.', effect: { score: 5 } },
        { key: 'B', label: 'Dismiss them on the spot for theft', desc: 'Harsh given a family with nothing, and it shatters the trust and morale of the team you still need.', effect: { score: -4 } },
        { key: 'C', label: 'Ignore it and let staff take what they want', desc: 'No record, unfair to everyone else, and the stock the community needs quietly walks out the door.', effect: { score: -3 } },
        { key: 'D', label: 'Make a public example of them in front of the others', desc: 'Public humiliation of a desperate employee poisons the whole team’s trust in you as a leader.', effect: { score: -4 } }
      ]
    },
    {
      time: 134, type: 'decision', tag: 'OWNER',
      title: 'A Profiteering Accusation Goes Viral',
      body: 'A false social-media post accuses you of profiteering off the disaster. It is untrue, but hundreds of negative ' +
        'comments are piling up and some customers are already cancelling future orders.',
      decisionId: 'sarah_social_media',
      prompt: 'How do you respond to the accusation?',
      options: [
        { key: 'A', label: 'Respond once, calmly and factually - state what you are actually charging and doing for the community - then get back to the emergency', desc: 'Corrects the record once with facts and denies the pile-on the fight it wants, without burning hours you do not have.', effect: { score: 5 } },
        { key: 'B', label: 'Get into the comments and argue with your accusers', desc: 'Feeds the pile-on, keeps the story alive, and drains time and composure you need elsewhere.', effect: { score: -3 } },
        { key: 'C', label: 'Ignore it entirely', desc: 'An unanswered accusation hardens into "the truth", and the cancellations keep coming.', effect: { score: -2 } },
        { key: 'D', label: 'Publicly threaten legal action against whoever posted it', desc: 'Looks defensive and aggressive, and amplifies a story you wanted to shrink.', effect: { score: -3 } }
      ]
    },
    {
      time: 146, type: 'decision', tag: 'ETHICAL',
      title: 'Donate Everything?',
      body: 'A volunteer emergency response group asks you to donate generators, chainsaws, fuel containers and batteries - ' +
        'worth over $40,000 - and Civil Defence is separately asking for exclusive access to your remaining emergency stock, ' +
        'which would leave nothing for the public. Donating it all may stop the business reopening; refusing may permanently ' +
        'damage your reputation.',
      decisionId: 'sarah_donate',
      prompt: 'How do you respond to the demands on your stock?',
      options: [
        { key: 'A', label: 'Contribute a fair, proportionate share to the official response, keep a reserve for the public and the business, and agree it openly with Civil Defence', desc: 'Proportionate and transparent - it supports the response and the community without sinking the business the town needs for recovery.', effect: { score: 5 } },
        { key: 'B', label: 'Donate everything they ask for', desc: 'Generous, but may sink the business the community will depend on for recovery, and empties the public supply at once.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse to give anything at all', desc: 'Protects the business but abandons the official response and badly damages the reputation you will need afterwards.', effect: { score: -4 } },
        { key: 'D', label: 'Quietly favour whoever can do the most for you later', desc: 'Self-dealing - the opposite of the transparent, defensible decision-making the moment demands.', effect: { score: -5 } }
      ]
    },
    {
      time: 160, type: 'cascade', tag: 'NIGHTFALL',
      title: 'Nightfall - Snow, Fuel Shortages, No Alarms',
      body: 'As darkness falls the temperature drops and snow is forecast. Fuel shortages are beginning, water restrictions ' +
        'are in, communications are deteriorating further, and with the power still out your security alarms are down and the ' +
        'windows are broken open. Police are overwhelmed across the district.',
      source: 'Township'
    },
    {
      time: 166, type: 'decision', tag: 'OWNER',
      title: 'Guard the Shop or Go Home?',
      body: 'With alarms down, windows broken and Police overwhelmed, your stock is exposed overnight. But your own family has ' +
        'been through the same earthquake and the same cold night is coming for them too.',
      decisionId: 'sarah_security',
      prompt: 'Do you guard the business overnight or go home?',
      options: [
        { key: 'A', label: 'Board up and secure what you can, set up a shared neighbourhood watch with nearby owners, and go home to your family for the night', desc: 'Proportionate security plus your family - you do not have to choose between the two by standing guard alone all night.', effect: { score: 5 } },
        { key: 'B', label: 'Stand guard at the shop alone all night against the looting risk', desc: 'Exhausting and dangerous, leaves your family alone, and one person cannot really secure a broken-open shop anyway.', effect: { score: -3 } },
        { key: 'C', label: 'Leave it wide open and go home, doing nothing to secure it', desc: 'Invites the loss of the very stock the community will need from you tomorrow.', effect: { score: -2 } },
        { key: 'D', label: 'Bring your children to the shop to help you guard it overnight', desc: 'Puts your kids in a damaged, dark, unsafe building through a freezing night. The wrong place for them.', effect: { score: -4 } }
      ]
    },
    {
      time: 180, type: 'info', tag: 'HANDOVER',
      title: 'Through the First Day - The Hardest Lesson',
      body: 'You have made it through the first day: your family is accounted for, your staff went home safe, the dangerous ' +
        'hazards are made safe, supplies reached the medical centre and the vulnerable, and the business - battered, but ' +
        'still standing - kept the community’s trust. The hardest lesson holds: you were never just trying to save a ' +
        'business. You were balancing family, employees, community and financial survival, where every major decision helped ' +
        'one group and disadvantaged another - and the goal was never the "right" answer, but choices that were ethical, ' +
        'transparent, proportionate and defensible under extreme uncertainty.',
      source: 'Alpine Outdoor & Hardware'
    }
  ];

})();
