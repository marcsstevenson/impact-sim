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
    card: {
      title: 'Business Owner',
      sub: 'A damaged hardware store and a town at the door',
      image: 'img/06-sarahchen-store.jpg'
    },
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
    // No status bar: every item restated a panel row, and the strip is never
    // re-rendered, so it went stale as soon as a consequence moved the panel.
    statusBar: [],
    panels: {
      groupsTitle: 'Business Status',
      groups: [
        { label: 'Building', value: 'Damaged', cls: 'failed' },
        { label: 'Stock On Hand', value: '~$450k', cls: 'degraded' },
        { label: 'Uninsured Stock', value: '~$180k', cls: 'failed' },
        { label: 'Cash Runway', value: '~4 weeks', cls: 'degraded' },
        { label: 'Staff On Site', value: '7 / 12', cls: 'good' },
        { label: 'Power', value: 'Out', cls: 'failed' },
        { label: 'EFTPOS', value: 'Down', cls: 'failed' }
      ],
      agenciesTitle: 'Calls & Contacts',
      agencies: [
        { label: 'Bank', value: 'Unreachable', cls: 'failed' },
        { label: 'Insurer', value: 'Unreachable', cls: 'failed' },
        { label: 'Civil Defence', value: 'Activating', cls: 'degraded' },
        { label: 'Medical Centre', value: 'Requesting', cls: 'degraded' },
        { label: 'Media', value: 'Calling', cls: 'degraded' }
      ],
      transportTitle: 'Site Hazards',
      transport: [
        { label: 'Front Windows', value: 'Shattered', cls: 'failed' },
        { label: 'Shelving', value: 'Collapsed', cls: 'failed' },
        { label: 'Gas Cylinders', value: 'Scattered', cls: 'failed' },
        { label: 'Roads', value: 'Blocked', cls: 'failed' }
      ],
      cascadeTitle: 'Cascading Hazards',
      cascades: [
        { icon: '🔁', name: 'Aftershocks', level: 'High', cls: 'high' },
        { icon: '⛽', name: 'Gas Leak', level: 'High', cls: 'high' },
        { icon: '🔓', name: 'Looting / Security', level: 'Moderate', cls: 'moderate' },
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
    'sarah_security': { 'A': { security: 10 }, 'C': { security: -15 } },
    'sarah_gas': { 'A': { building: 10, stock: -5 }, 'B': { building: -15 }, 'C': { building: -10 }, 'D': { building: -20 } },
    'sarah_eftpos': { 'A': { stock: -10, cash: -5 }, 'B': { stock: -2 }, 'C': { stock: -25, cash: -20 }, 'D': { cash: -10 } },
    'sarah_migrant_staff': { 'A': { staffing: 10, cash: -5 }, 'B': { staffing: -10 }, 'C': { staffing: -15 }, 'D': { staffing: -5, building: -5 } },
    'sarah_pooling': { 'A': { stock: -15 }, 'B': { stock: -5 }, 'C': { stock: -20 }, 'D': { stock: -10 } },
    'sarah_customer_injury': { 'A': { building: 10, stock: -5 }, 'B': { building: -10 }, 'D': { stock: -5 } },
    'sarah_bank': { 'A': { cash: 15 }, 'B': { cash: 10 }, 'C': { cash: -15 }, 'D': { cash: -25 } },
    'sarah_reopen': { 'A': { building: 10, stock: -5 }, 'B': { building: -20 }, 'C': { cash: -10 }, 'D': { building: -15 } },
    'sarah_staff_pay': { 'A': { cash: -25, staffing: 10 }, 'B': { cash: -25 }, 'C': { staffing: -25 }, 'D': { cash: -10, staffing: -30 } },
    'sarah_civil_defence': { 'A': { stock: -25 }, 'B': { stock: -45 }, 'D': { stock: -20 } }
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
    'sarah_security': { 'A': { family: 6, finances: 4, community: 3 }, 'B': { family: -5, safety: -3 }, 'C': { finances: -5 }, 'D': { family: -8, safety: -4 } },
    'sarah_gas': { 'A': { safety: 10, community: 4, finances: -3 }, 'B': { safety: -14, staff: -6 }, 'C': { safety: -10, staff: -4 }, 'D': { safety: -14, reputation: -5 } },
    'sarah_eftpos': { 'A': { community: 8, finances: 5, reputation: 4 }, 'B': { community: -8, reputation: -4 }, 'C': { finances: -10, community: 4 }, 'D': { reputation: -8, finances: -4 } },
    'sarah_migrant_staff': { 'A': { staff: 10, reputation: 5, community: 4 }, 'B': { staff: -6 }, 'C': { staff: -9, reputation: -4 }, 'D': { safety: -8, staff: -5 } },
    'sarah_pooling': { 'A': { community: 9, reputation: 5, finances: 2 }, 'B': { community: -5, reputation: -3 }, 'C': { finances: -6, reputation: -3 }, 'D': { reputation: -10, community: -6 } },
    'sarah_customer_injury': { 'A': { safety: 9, reputation: 5, finances: -2 }, 'B': { safety: -9, reputation: -4 }, 'C': { reputation: -12, community: -7 }, 'D': { community: -3, finances: -3 } },
    'sarah_bank': { 'A': { finances: 9, reputation: 4 }, 'B': { finances: -10, reputation: -7 }, 'C': { finances: -7 }, 'D': { finances: -6, staff: -4 } },
    'sarah_reopen': { 'A': { safety: 9, community: 4, finances: 3 }, 'B': { safety: -12, staff: -5 }, 'C': { community: -4, finances: -4 }, 'D': { safety: -10, staff: -8 } },
    'sarah_staff_pay': { 'A': { staff: 10, reputation: 5, finances: -4 }, 'B': { staff: -4, reputation: -3 }, 'C': { staff: -12, reputation: -6 }, 'D': { staff: -9, community: -4 } },
    'sarah_civil_defence': { 'A': { community: 8, reputation: 5, finances: 2 }, 'B': { community: -4, finances: -6 }, 'C': { community: -6, reputation: -4 }, 'D': { reputation: -10, community: -5 } }
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
    'sarah_security': { 'A': { decisive: 1, centralized: 1, communityTrust: 1 }, 'B': { centralized: 2, communityTrust: -1 }, 'C': { decisive: -1 }, 'D': { lifeSafety: -2 } },
    'sarah_gas': { 'A': { decisive: 2, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: 1, lifeSafety: -2 }, 'D': { decisive: -2, lifeSafety: -2 } },
    'sarah_eftpos': { 'A': { decisive: 1, communityTrust: 2, centralized: 1 }, 'B': { decisive: 1, centralized: 2, communityTrust: -2 }, 'C': { decisive: 1, communityTrust: 2, centralized: -2 }, 'D': { decisive: -1, centralized: -1 } },
    'sarah_migrant_staff': { 'A': { decisive: 1, lifeSafety: 1, communityTrust: 2 }, 'B': { decisive: 1, communityTrust: -1 }, 'C': { decisive: -2, communityTrust: -2 }, 'D': { decisive: 1, lifeSafety: -2 } },
    'sarah_pooling': { 'A': { decisive: 1, centralized: 1, communityTrust: 2 }, 'B': { decisive: 1, centralized: -1, communityTrust: -1 }, 'C': { decisive: 1, communityTrust: 1, centralized: -2 }, 'D': { decisive: -1, communityTrust: -2 } },
    'sarah_customer_injury': { 'A': { decisive: 2, lifeSafety: 2, communityTrust: 1 }, 'B': { decisive: 1, lifeSafety: -2 }, 'C': { decisive: 1, communityTrust: -2, lifeSafety: -1 }, 'D': { decisive: 1, lifeSafety: 1, communityTrust: -1 } },
    'sarah_bank': { 'A': { decisive: 2, centralized: 1, communityTrust: 1 }, 'B': { decisive: 1, communityTrust: -2 }, 'C': { decisive: -2 }, 'D': { decisive: -1, centralized: 1 } },
    'sarah_reopen': { 'A': { decisive: 1, lifeSafety: 2, centralized: 1 }, 'B': { decisive: 2, lifeSafety: -2 }, 'C': { decisive: -2, lifeSafety: 1 }, 'D': { decisive: 1, lifeSafety: -2 } },
    'sarah_staff_pay': { 'A': { decisive: 1, communityTrust: 2, centralized: 1 }, 'B': { decisive: 1, centralized: 1, communityTrust: -1 }, 'C': { decisive: -1, communityTrust: -2 }, 'D': { decisive: 2, communityTrust: -2 } },
    'sarah_civil_defence': { 'A': { decisive: 1, centralized: 1, communityTrust: 2 }, 'B': { decisive: 1, centralized: 2, communityTrust: -1 }, 'C': { decisive: 1, centralized: -2 }, 'D': { decisive: -1, communityTrust: -2 } }
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
        },
        stateChange: function () {
          updatePanelItem('transport-section', 'Front Windows', 'Collapsed', 'failed');
          updateCascadeItem('cascade-tracker', 'Structural', 'Extreme', 'extreme');
          updateCascadeItem('cascade-tracker', 'Gas Leak', 'Extreme', 'extreme');
          updateUtilityDirect('building', 5);
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
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', '"Profiteer"', 'failed');
          updatePanelItem('agency-status', 'Civil Defence', '"Reviewing you"', 'degraded');
        }
      }
    },
    'sarah_employee_theft': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Team Watches How You Handle It',
          body: 'Making a public example of a staff member who took supplies home to a damaged house did not deter anyone - ' +
            'it told the rest of the team what happens if they are struggling and say nothing. Two have since stopped ' +
            'mentioning problems at all, and you will find out about the next one late.',
          source: 'Staff',
          scorePenalty: -4
        },
        stateChange: function () {
          updateUtilityDirect('staffing', 30);
          updatePanelItem('cdem-groups', 'Staff On Site', '6 / 12', 'degraded');
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
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Media', '"Sold to a tourist"', 'failed');
          updateUtilityDirect('power', 0);
        }
      }
    },
    'sarah_gas': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'A Flash Fire at the Back Wall',
          body: 'Moving damaged cylinders yourself in a confined, unventilated space, a spark from the fallen shelving found ' +
            'the leak. You have burns to both hands and forearms, the rear of the shop is alight, and the Fire Service is ' +
            'already committed to a collapse rescue on the other side of town.',
          source: 'Fire and Emergency',
          scorePenalty: -7
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Gas Leak', 'Extreme', 'extreme');
          updatePanelItem('cdem-groups', 'Building', 'Fire Damage', 'failed');
          updateUtilityDirect('building', 0);
        }
      },
      'C': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'Gas Does Not Respect a Partition',
          body: 'LPG is heavier than air and it moved along the floor under the partition into the front of the shop. Two ' +
            'customers and a staff member are unwell, everyone has been evacuated by Fire and Emergency, and the whole ' +
            'building is now cordoned rather than the rear alone.',
          source: 'Fire and Emergency',
          scorePenalty: -5
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Gas Leak', 'Extreme', 'extreme');
          updatePanelItem('cdem-groups', 'Building', 'Cordoned', 'failed');
        }
      }
    },
    'sarah_eftpos': {
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Nothing on Paper, Nothing to Claim',
          body: 'Four hundred thousand dollars of stock left the shop today and there is no record of any of it. The insurer ' +
            'will not accept an unevidenced business-interruption claim, the bank cannot see revenue that was never ' +
            'recorded, and the generosity that felt right this morning has removed your ability to reopen at all.',
          source: 'Accountant',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Cash Runway', '~1 week', 'failed');
          updatePanelItem('cdem-groups', 'Stock On Hand', 'Depleted', 'failed');
          updateUtilityDirect('cash', 8);
        }
      }
    },
    'sarah_migrant_staff': {
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'They Slept in the Car',
          body: 'Your two migrant staff spent the night in a car outside the red-stickered flat, because nobody told them the ' +
            'welfare centre existed or how to get there. They were both back at work at seven. One of them mentioned it to ' +
            'a customer, and the street heard about it before you did.',
          source: 'Staff / Main Street',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Staff On Site', '5 / 12', 'failed');
          updateUtilityDirect('staffing', 25);
        }
      }
    },
    'sarah_pooling': {
      'D': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Caught Holding Back',
          body: 'The supermarket manager came to collect the pooled stock and found the good gear stacked in your rear ' +
            'storeroom. It is around the street within the hour. The pooling arrangement has collapsed, the other three ' +
            'businesses have pulled out, and everyone is back to four queues for the same scarce goods.',
          source: 'Main Street Businesses',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Civil Defence', '"Not working with you"', 'failed');
          updatePanelItem('agency-status', 'Media', '"Held stock back"', 'failed');
        }
      }
    },
    'sarah_customer_injury': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Second Bay Comes Down',
          body: 'You patched her up and kept the queue moving past the remaining leaning bays. The next aftershock brought ' +
            'another one down across two customers. This time there is a head injury, there is now clear evidence you knew ' +
            'the hazard existed, and the shop is closed by the council within the hour.',
          source: 'WorkSafe / Council',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('transport-section', 'Shelving', 'Collapsed Again', 'failed');
          updatePanelItem('cdem-groups', 'Building', 'Closed by Council', 'failed');
          updateUtilityDirect('building', 0);
        }
      },
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'It Was Filmed',
          body: 'Two people in the queue were already filming when you asked the injured woman not to make a claim. The clip ' +
            'is on every local page by evening. The insurer has seen it, her family has a lawyer, and fifteen years of ' +
            'community standing has gone in a ninety-second video.',
          source: 'Social Media / Insurer',
          scorePenalty: -7
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Insurer', '"Reviewing conduct"', 'failed');
          updatePanelItem('agency-status', 'Media', '"The video"', 'failed');
        }
      }
    },
    'sarah_bank': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Numbers Arrive',
          body: 'The bank reconciled your account against the position you described and found the gap in a fortnight. The ' +
            'facility is frozen pending review, and the personal guarantee against your house is now the live conversation ' +
            'instead of the working-capital one you needed.',
          source: 'Bank',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('agency-status', 'Bank', '"Facility frozen"', 'failed');
          updatePanelItem('cdem-groups', 'Cash Runway', 'At Risk', 'failed');
          updateUtilityDirect('cash', 10);
        }
      }
    },
    'sarah_reopen': {
      'B': {
        inject: {
          type: 'cascade', tag: 'CONSEQUENCE',
          title: 'The Rear Wall Moves',
          body: 'You reopened the section the engineer specifically excluded. An aftershock during the morning rush moved the ' +
            'rear wall and brought down the ceiling grid across the back aisle. Nobody was killed, which was luck rather ' +
            'than judgement, and the written clearance now records that you traded outside it.',
          source: 'Building Engineer / Council',
          scorePenalty: -7
        },
        stateChange: function () {
          updateCascadeItem('cascade-tracker', 'Structural', 'Extreme', 'extreme');
          updatePanelItem('cdem-groups', 'Building', 'Closed by Council', 'failed');
          updateUtilityDirect('building', 0);
        }
      }
    },
    'sarah_staff_pay': {
      'C': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'Four Staff Do Not Come Back',
          body: 'Deferring wages was not something you were entitled to ask, and four staff with damaged homes and no other ' +
            'income did not return on Monday. Two have taken work in Christchurch. You now cannot open the hours the town ' +
            'needs, and the employment claim is in the post.',
          source: 'Staff / Employment Advocate',
          scorePenalty: -6
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Staff On Site', '3 / 12', 'failed');
          updateUtilityDirect('staffing', 15);
        }
      }
    },
    'sarah_civil_defence': {
      'B': {
        inject: {
          type: 'inject', tag: 'CONSEQUENCE',
          title: 'The Queue Goes Home Empty',
          body: 'Everything went to the welfare centre, and the forty people who had queued on your footpath since morning ' +
            'were sent away with nothing as the snow started. There is no record of what you handed over, no agreed terms, ' +
            'and nothing on the shelves to sell tomorrow.',
          source: 'Main Street / Civil Defence',
          scorePenalty: -5
        },
        stateChange: function () {
          updatePanelItem('cdem-groups', 'Stock On Hand', 'Empty', 'failed');
          updateUtilityDirect('stock', 0);
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
    },
    'sarah_family': {
      learningObjective: 'Establish that your own family are safe before trying to lead anything else, without abandoning the site.',
      bestPractice: 'A',
      teachingNote: 'You cannot make good decisions for twelve staff and a shop full of customers while you do not know ' +
        'whether your children are alive. Getting confirmation through someone else - a neighbour, the school, your ' +
        'firefighter husband’s station - resolves the thing that would otherwise degrade every subsequent decision, without ' +
        'walking away from a damaged building full of people.',
      references: [
        { label: 'Responder family readiness', desc: 'a pre-agreed check-in plan is what makes delegation possible on the day' },
        { label: 'Decision quality', desc: 'unresolved personal fear reliably degrades judgement under load' }
      ],
      discussionPrompts: [
        'Who could confirm your family are safe without you leaving?',
        'What would you have needed to arrange before the earthquake for that to work?'
      ]
    },
    'sarah_gas': {
      learningObjective: 'Recognise an uncontrolled LPG hazard as the one thing that outranks every commercial consideration.',
      bestPractice: 'A',
      teachingNote: 'Twenty displaced cylinders, a damaged valve and a smell in a confined space with aftershocks continuing ' +
        'is a mass-casualty hazard sitting in a shop full of customers. Clear and keep clear, ventilate from a distance, ' +
        'isolate, and hand it to Fire and Emergency. Moving damaged cylinders yourself, partitioning the area, or waiting to ' +
        'see whether the smell strengthens are all ways of staying inside the hazard.',
      references: [
        { label: 'LPG hazards', desc: 'heavier than air, pools at floor level and migrates under partitions' },
        { label: 'Evacuate and isolate', desc: 'the correct first action for an uncontrolled gas release is distance, not management' }
      ],
      discussionPrompts: [
        'How do you clear a shop full of people who came in for water, and keep them out?',
        'What can you do from outside the building while you wait for Fire and Emergency?'
      ]
    },
    'sarah_eftpos': {
      learningObjective: 'Keep goods moving to people who need them while keeping the business recoverable - a written ledger does both.',
      bestPractice: 'A',
      teachingNote: 'With no EFTPOS and nobody carrying cash, insisting on cash means the stock sits on the shelf while the ' +
        'town goes without. Handing everything out unrecorded is generous and closes the shop the community will need in a ' +
        'month, because an unevidenced business-interruption claim is not payable. A signed paper ledger - name, contact, ' +
        'items, value - serves both. Handwritten card numbers are a data-security exposure with no upside.',
      references: [
        { label: 'Manual trading', desc: 'a paper ledger is the standard fallback when payment systems fail' },
        { label: 'Business interruption claims', desc: 'insurers require evidence of stock movement and revenue foregone' }
      ],
      discussionPrompts: [
        'What is the minimum a ledger entry needs to be worth something to your insurer?',
        'How do you keep a ledger moving with forty people in the queue?'
      ]
    },
    'sarah_staff': {
      learningObjective: 'Release staff to their own families and homes while keeping the site safe and covered.',
      bestPractice: 'A',
      teachingNote: 'Staff with children at school, elderly relatives and partners in emergency services cannot be usefully ' +
        'held at work by instruction. Releasing those who need to go, keeping a safe minimum by agreement, and being clear ' +
        'that jobs are not at risk gets you a team that comes back tomorrow. Requiring everyone to stay produces neither ' +
        'safety nor productivity, and it is remembered.',
      references: [
        { label: 'Duty of care', desc: 'an employer cannot require staff to remain while their own families are unaccounted for' },
        { label: 'Workforce continuity', desc: 'how staff are treated on day one determines who returns on day three' }
      ],
      discussionPrompts: [
        'What is the safe minimum crew for the site, and who decides who stays?',
        'How do you say "your job is safe" credibly when you do not know if the business is?'
      ]
    },
    'sarah_migrant_staff': {
      learningObjective: 'Identify staff with no local support network and act before they ask, because they will not ask.',
      bestPractice: 'A',
      teachingNote: 'Two employees with a red-stickered flat, no car, no local network and limited English have quietly kept ' +
        'working all afternoon. The people with the least security are the least likely to raise a problem. Sorting their ' +
        'accommodation and food tonight, connecting them to welfare and to someone who speaks their language, and saying ' +
        'plainly that their job is safe addresses the fear they are not voicing. Letting them sleep in a damaged shop ' +
        'solves your problem, not theirs.',
      references: [
        { label: 'Vulnerable workers', desc: 'migrant and seasonal staff often have no local support and no confidence to ask' },
        { label: 'Welfare referral', desc: 'a warm handover to Civil Defence welfare, not a direction to it' }
      ],
      discussionPrompts: [
        'Who on your team has no one else, and would you know?',
        'What does a warm handover to a welfare centre actually involve?'
      ]
    },
    'sarah_pooling': {
      learningObjective: 'Cooperate with other businesses on scarce supply, with a record and an agreed allocation rule.',
      bestPractice: 'A',
      teachingNote: 'Pooling genuinely serves a town that cannot travel between four separate queues for the same goods. The ' +
        'written record of contributions and an allocation rule agreed with Civil Defence are what stop it becoming a ' +
        'month of disputes during recovery. Refusing keeps four queues running; joining on a handshake creates the dispute; ' +
        'and being caught holding stock back destroys the trust the whole arrangement runs on.',
      references: [
        { label: 'Business cooperation', desc: 'informal mutual aid works when contributions and rules are written down' },
        { label: 'Allocation transparency', desc: 'an agreed public rule protects every participant from the "why them" question' }
      ],
      discussionPrompts: [
        'What does the allocation rule say, and who signs it off?',
        'How do you record contributions when four businesses are all trading from the footpath?'
      ]
    },
    'sarah_customer_injury': {
      learningObjective: 'Care for the casualty, remove the hazard that is still standing, and record it honestly.',
      bestPractice: 'A',
      teachingNote: 'Three actions, in order: treat and transport her, then clear and secure every other leaning bay - because ' +
        'the hazard that caused this is still there and the aftershocks have not stopped - then write down what happened ' +
        'while it is fresh and notify the insurer. Patching her up and carrying on guarantees the next casualty. Pressuring ' +
        'an injured customer out of a claim is the single most damaging thing available, legally and reputationally, and it ' +
        'will have been filmed.',
      references: [
        { label: 'Hazard elimination', desc: 'after an incident, the identical hazards still present are the priority' },
        { label: 'Incident recording', desc: 'a contemporaneous record protects the injured party as well as the business' }
      ],
      discussionPrompts: [
        'What do you do about the other shelving bays in the next ten minutes?',
        'What does an honest incident record look like when you are the one being recorded?'
      ]
    },
    'sarah_credit': {
      learningObjective: 'Extend credit on a record, to people you can identify, without either denying essentials or giving the business away.',
      bestPractice: 'A',
      teachingNote: 'Cash-only denies essentials to neighbours who genuinely cannot access money today, in a community you ' +
        'will depend on for years. Giving everything away leaves no recoverable value and threatens the shop the town needs ' +
        'tomorrow. Credit for tourists and cash for locals is exactly backwards - you will never see the tourists again, ' +
        'while the locals are the ones you can safely extend to.',
      references: [
        { label: 'Emergency credit', desc: 'recorded credit to identifiable customers is recoverable; unrecorded giving is not' },
        { label: 'Community relationships', desc: 'the customers you extend to today are the customers you have in a year' }
      ],
      discussionPrompts: [
        'Who can you safely extend credit to, and how do you decide in a thirty-second transaction?',
        'What do you do about the tourist who genuinely cannot pay?'
      ]
    },
    'sarah_medical_centre': {
      learningObjective: 'Prioritise a life-safety request from a clinical service above ordinary retail demand.',
      bestPractice: 'A',
      teachingNote: 'A medical centre treating mass casualties is not another customer in the queue. Supplying what it ' +
        'critically needs, on a record and at fair terms, is both the right call and a defensible one - and it does not ' +
        'require emptying the shop, because the clinic needs specific items rather than everything. Refusing, or treating ' +
        'it as ordinary demand, misreads what the request is.',
      references: [
        { label: 'Life-safety priority', desc: 'clinical demand outranks general retail demand for the same goods' },
        { label: 'Recorded supply', desc: 'a record at fair terms protects both parties and supports later recovery' }
      ],
      discussionPrompts: [
        'What does the medical centre actually need, as opposed to what it asked for?',
        'How do you explain to the queue why the clinic went first?'
      ]
    },
    'sarah_bank': {
      learningObjective: 'Give a lender an honest position with a specific ask, especially when the loan is personally guaranteed.',
      bestPractice: 'A',
      teachingNote: 'The bank is deciding today whether to extend or freeze, and it will decide on whatever information it ' +
        'has. An honest position with the numbers you actually have, a clear statement of what you need and by when, and a ' +
        'request for a written short-term arrangement is what gets funded. Overstating is found within a fortnight and puts ' +
        'the guarantee against your house into play; declining to talk means the decision is made without you.',
      references: [
        { label: 'Lender relationships', desc: 'banks fund businesses whose position they can see clearly' },
        { label: 'Personal guarantees', desc: 'misrepresentation is the fastest route to a guarantee being called' }
      ],
      discussionPrompts: [
        'What are the three numbers you actually have right now?',
        'What is the specific ask, and what happens if they say no?'
      ]
    },
    'sarah_reopen': {
      learningObjective: 'Operate strictly within a partial engineering clearance, and make the limit physical rather than notional.',
      bestPractice: 'A',
      teachingNote: 'A partial clearance is a precise instruction, not a starting position for negotiation. Trading from the ' +
        'cleared front only, with the rear physically barriered and staff briefed on where the line is, is what stops the ' +
        'limit eroding by mid-morning. Reopening the excluded section substitutes your judgement for the engineer’s; ' +
        'sending staff into the rear for stock is worse, because it puts your own employees in the space you kept customers ' +
        'out of; staying wholly closed forgoes a compliant option the town needs.',
      references: [
        { label: 'Building clearances', desc: 'partial clearances specify the usable area and the excluded area precisely' },
        { label: 'Barrier controls', desc: 'a physical barrier holds a limit that a verbal instruction will not' }
      ],
      discussionPrompts: [
        'How do you physically mark the line, and who checks it during the day?',
        'What do you do when a staff member says the stock they need is just inside the rear?'
      ]
    },
    'sarah_social_media': {
      learningObjective: 'Correct a damaging false claim quickly, factually and without escalating it.',
      bestPractice: 'A',
      teachingNote: 'A profiteering accusation spreads faster than any correction and does lasting damage to a business that ' +
        'depends on community standing. A prompt, factual, unemotional response with what you are actually doing - and ' +
        'evidence where you have it - closes it down. Silence lets it set as fact; an angry public reply makes the argument ' +
        'the story rather than the facts.',
      references: [
        { label: 'Rumour correction', desc: 'speed and calm factual specificity outperform volume and outrage' },
        { label: 'Community standing', desc: 'reputation is the asset a small-town business recovers on' }
      ],
      discussionPrompts: [
        'What evidence could you point to that would settle this in one post?',
        'When is not responding the right call?'
      ]
    },
    'sarah_staff_pay': {
      learningObjective: 'Meet payroll obligations and be honest about the runway, rather than choosing between them.',
      bestPractice: 'A',
      teachingNote: 'Deferring wages is not something an employer is entitled to ask of staff with damaged homes and no other ' +
        'income, and it is not lawful. Paying on time buys the loyalty required to reopen; telling the team honestly what ' +
        'the runway is means nobody discovers in week three that it was never viable. Getting advice on wage subsidy and ' +
        'hardship support the same day is the step most owners skip. Laying off half the team before asking about support ' +
        'cuts the people you need to reopen.',
      references: [
        { label: 'Employment obligations', desc: 'wages are not deferrable at the employer’s discretion' },
        { label: 'Disaster business support', desc: 'wage subsidy and hardship mechanisms exist and are time-limited' }
      ],
      discussionPrompts: [
        'What support exists, and who would you call to find out today?',
        'How do you tell twelve people the runway is four weeks without losing all of them?'
      ]
    },
    'sarah_donate': {
      learningObjective: 'Contribute meaningfully to the official response without destroying the business the recovery depends on.',
      bestPractice: 'A',
      teachingNote: 'A proportionate, recorded contribution supports the response and keeps the shop viable. Donating ' +
        'everything empties the public supply at once and may sink the business the community will need for months; ' +
        'refusing outright abandons the official response and the standing you will need afterwards; and quietly favouring ' +
        'whoever can help you later is self-dealing in the middle of a disaster.',
      references: [
        { label: 'Proportionate contribution', desc: 'sustainable giving beats a single gesture that ends the business' },
        { label: 'Transparent allocation', desc: 'a recorded basis is what makes the contribution defensible later' }
      ],
      discussionPrompts: [
        'What proportion can you actually sustain, and for how many days?',
        'How do you decide between Civil Defence, the clinic and the queue outside?'
      ]
    },
    'sarah_security': {
      learningObjective: 'Secure the site against loss without putting yourself or staff in the path of harm.',
      bestPractice: 'A',
      teachingNote: 'With alarms down, windows out and stock visible from the street, some security response is needed. ' +
        'Practical measures - boarding, moving stock out of sight, lighting, and coordinating with Police and neighbouring ' +
        'businesses - reduce the risk without anyone standing guard. Sleeping in a damaged building with a gas hazard, or ' +
        'confronting anyone who turns up overnight, trades a stock loss for a serious-harm risk.',
      references: [
        { label: 'Site security', desc: 'physical measures and coordination beat personal presence as a control' },
        { label: 'Confrontation risk', desc: 'property is insurable; the owner standing in the doorway is not' }
      ],
      discussionPrompts: [
        'What can you do in an hour that reduces the risk most?',
        'What is your instruction to staff if someone is inside when they arrive tomorrow?'
      ]
    },
    'sarah_civil_defence': {
      learningObjective: 'Split scarce stock between an official welfare channel and the public queue, on documented terms.',
      bestPractice: 'A',
      teachingNote: 'Both channels reach people who genuinely need the stock: the welfare centre shelters those least able to ' +
        'queue, and the queue has been waiting since morning. A documented split at agreed terms, with the allocation basis ' +
        'in writing from Civil Defence, serves both and protects you when someone later asks why they missed out. Handing ' +
        'over everything closes the street’s only supply point; refusing abandons the people who cannot come; and agreeing ' +
        'while holding stock back destroys the relationship you need for the whole recovery.',
      references: [
        { label: 'Requisition and agreement', desc: 'documented terms protect the business and the agency both' },
        { label: 'Dual-channel distribution', desc: 'welfare centres and retail counters reach different populations' }
      ],
      discussionPrompts: [
        'What terms would you want in writing before agreeing to a split?',
        'How do you explain the split to the forty people on your footpath?'
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
        { key: 'B', label: 'Agree to it - closing together protects both businesses from being cleaned out at prices neither of you can replace stock at', desc: 'Coordinating to restrict supply and prop up prices during a disaster is both unethical and a legal risk.', effect: { score: -3 } },
        { key: 'C', label: 'Stay non-committal with him and quietly keep trading your own way, so there is no argument and no arrangement either', desc: 'Avoids the deal, but a flat ethical "no" would have been clearer and more defensible.', effect: { score: 0 } }
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
        { key: 'B', label: 'Sell him the lot - cash is cash, and he is the only one in the shop actually able to pay for anything', desc: 'Lets one reseller corner a life-essential item and onsell it at a markup to desperate people. Bad for the town and your name.', effect: { score: -3 } },
        { key: 'C', label: 'Sell him half of what he is asking for, so he gets something and there is still stock left on the shelf', desc: 'Better than the lot, but still hands a reseller a big share of a scarce essential.', effect: { score: 0 } }
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
        { key: 'B', label: 'Drop everything and attend the meeting in person, since recovery decisions made without a retailer in the room will not go your way', desc: 'Leaves a hazardous, busy shop unmanaged for a meeting that can wait an hour.', effect: { score: -1 } },
        { key: 'C', label: 'Refuse any involvement in recovery coordination at all, because you have a damaged building and a queue that has not moved in an hour', desc: 'Cuts you out of decisions that will shape the town’s - and your business’s - recovery.', effect: { score: -1 } }
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
        { key: 'B', label: 'Stop what you are doing and process the full refund on the spot, because a customer is entitled to it whatever else is going on', desc: 'Holds up a queue of people who need emergency essentials for a non-urgent refund.', effect: { score: -1 } },
        { key: 'C', label: 'Tell them flatly to come back another day, since there are forty people behind them who need water and torches rather than a refund', desc: 'A curt brush-off needlessly burns a long-term customer in front of a watching queue.', effect: { score: 0 } }
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
        { key: 'B', label: 'Refuse to comment and hang up, because nothing you say to that question is going to come out the way you meant it', desc: 'A flat "no comment" reads as something to hide and lets others define your story.', effect: { score: -1 } },
        { key: 'C', label: 'Vent your frustration about the question on the record, so that somebody finally says what every business owner in this town is thinking', desc: 'Hands the reporter the emotional, defensive soundbite they were hoping for.', effect: { score: -2 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Regular Wants the Whole Pallet',
      body: 'A farmer you have dealt with for a decade wants to buy every bottle of water and every gas canister you have ' +
        'left, to take out to families on his valley road who cannot get in.',
      source: 'Counter',
      prompt: 'How do you handle the request?',
      options: [
        { key: 'A', label: 'Sell him a proportionate share on the ledger, get the names of the households he is supplying, and coordinate the rest with Civil Defence', desc: 'The need is real and so is everyone else’s. A recorded, proportionate share reaches the valley without emptying the shelf.', effect: { score: 2 } },
        { key: 'B', label: 'Let him take the whole pallet - he is getting it out to households who physically cannot get into town to collect anything themselves', desc: 'One customer clears the shelf and forty people in the queue outside get nothing, on his word alone.', effect: { score: -2 } },
        { key: 'C', label: 'Limit him to the same two items as every other customer, so the rule is identical for everyone regardless of who they are buying for', desc: 'Fair on the face of it, and it ignores that he is supplying a dozen cut-off households rather than himself.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Volunteer Starts Directing Your Queue',
      body: 'A well-meaning local has appointed himself queue marshal and is telling people what they may and may not buy, ' +
        'in your name.',
      source: 'Footpath',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Thank him, take back the rules yourself, state them out loud to the queue, and give him a real job', desc: 'The queue needs rules and they need to be yours. Keeping a willing helper busy costs nothing.', effect: { score: 2 } },
        { key: 'B', label: 'Leave him to it - the queue is orderly, people are being served, and you have more pressing things than who is directing traffic', desc: 'Someone with no authority is making allocation decisions in your name, and you will own every one of them.', effect: { score: -2 } },
        { key: 'C', label: 'Tell him publicly to clear off, so that everyone in the queue understands exactly who is running this shop and its rules', desc: 'Right call on the authority, wrong delivery in front of a queue of your customers.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'Your Children Want to Come to the Shop',
      body: 'Your children, safe with a neighbour, are asking to come down to the shop to be with you. It is a fifteen-minute ' +
        'drive on a road with reported slips.',
      source: 'Family',
      prompt: 'What do you tell them?',
      options: [
        { key: 'A', label: 'Keep them where they are safe, speak to them properly for two minutes, and set a time you will be home', desc: 'A damaged shop with a gas hazard is no place for them, and a concrete time is what actually settles a frightened child.', effect: { score: 2 } },
        { key: 'B', label: 'Have the neighbour drive them down to the shop, so that you can see them yourself and stop worrying about where they are', desc: 'Puts your children on a slip-affected road and then inside the least safe building on the street.', effect: { score: -3 } },
        { key: 'C', label: 'Tell them you are too busy to talk right now and that you will see them at home later on tonight', desc: 'Thirty seconds now saves you a much longer conversation tonight, and they will remember which one they got.', effect: { score: -1 } }
      ]
    },
    {
      tag: 'NOISE', title: 'An Out-of-Town Trader Sets Up Outside',
      body: 'Someone has parked a van on the footpath outside your shop selling water and torches at four times your price, ' +
        'to your queue.',
      source: 'Main Street',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'Report it to Civil Defence and the council, tell your queue plainly what your own prices are, and leave the comparison to speak for itself', desc: 'Uses the right channel and turns his pricing into an advertisement for yours, without a scene on the footpath.', effect: { score: 2 } },
        { key: 'B', label: 'Confront him on the street in front of your own customers, so that everyone can see exactly what he is charging them for exactly the same goods', desc: 'A public argument outside your own shop becomes the story, and your customers are the audience.', effect: { score: -2 } },
        { key: 'C', label: 'Raise your own prices to match his, since he has set the market and you are the one carrying uninsured losses', desc: 'Hands the town the profiteering story about you rather than him, and forfeits the one advantage you had.', effect: { score: -3 } }
      ]
    },
    {
      tag: 'NOISE', title: 'A Staff Member Wants to Go Home',
      body: 'One of your staff has just heard her elderly father’s street has been evacuated. She has not said anything, but ' +
        'she has checked her phone eleven times in the last ten minutes.',
      source: 'Shop Floor',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Notice it, ask her directly, and get her out the door with your blessing and a way to get there', desc: 'She was never going to ask. Naming it yourself and removing the obstacle is the whole of the job here.', effect: { score: 2 } },
        { key: 'B', label: 'Wait for her to ask if she needs to go, so that nobody is pushed out the door who would rather be here working', desc: 'The staff member most worried about her job security is the one least likely to ask for anything.', effect: { score: -2 } },
        { key: 'C', label: 'Tell her to focus on the job - the queue is out the door and there is nobody else who can serve it if she leaves', desc: 'A distracted, frightened employee is neither safe nor useful, and she will remember this longer than the earthquake.', effect: { score: -3 } }
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
        { key: 'B', label: 'Stay at the shop and push the worry down for now, on the basis that twelve staff and a town full of people are relying on you being here', desc: 'A leader sick with worry about her own children makes poor calls, and they are your children. Suppressing it is not the same as resolving it.', effect: { score: -3 } },
        { key: 'C', label: 'Leave entirely and do not come back to the shop today, because nothing in that building matters more than knowing your own children are safe', desc: 'Abandons 12 staff and the town’s emergency supply with no leader at the moment both need direction most.', effect: { score: -4 } },
        { key: 'D', label: 'Send one of your junior staff to check on your family while you stay and hold the shop together, since they can move faster than you can right now', desc: 'Offloads your most personal duty onto staff who have their own frightened families to worry about.', effect: { score: -2 } }
      ]
    },
    {
      time: 14, type: 'decision', tag: 'OWNER',
      title: 'The Gas Cylinders',
      body: 'Twenty LPG cylinders came off their rack and are scattered across the rear of the shop, at least one with a ' +
        'damaged valve. There is a smell near the back wall. Customers are already coming through the shattered front ' +
        'windows looking for water and torches.',
      decisionId: 'sarah_gas',
      prompt: 'What do you do first?',
      options: [
        { key: 'A', label: 'Clear everyone out and keep them out, ventilate from a distance, isolate the area, and get Fire and Emergency to it before anyone goes back in', desc: 'A suspected LPG leak in a damaged building with aftershocks continuing is the one hazard that can kill everyone in the shop at once.', effect: { score: 5 } },
        { key: 'B', label: 'Move the cylinders outside yourself so the shop can keep serving, since you know exactly where they are and how the valves work on them', desc: 'Handling damaged LPG cylinders yourself, in a confined damaged space, with a possible leak already present.', effect: { score: -6 } },
        { key: 'C', label: 'Keep the back of the shop closed off and serve customers from the front, so trading continues while the leak stays contained behind a door', desc: 'A partition does not contain LPG, and you are keeping people inside a building with an uncontrolled gas hazard.', effect: { score: -5 } },
        { key: 'D', label: 'Wait and see whether the smell gets any stronger before acting, rather than close a shop the whole township is queueing outside over a faint whiff', desc: 'By the time the smell is unmistakable in a confined space, the decision has already been taken out of your hands.', effect: { score: -6 } }
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
        { key: 'B', label: 'Keep trading inside the building - the community needs these supplies today, and the structure has stood through everything the day has thrown at it', desc: 'Someone has already been hurt; a gas leak plus aftershocks makes the next injury potentially fatal. No sale is worth it.', effect: { score: -6 } },
        { key: 'C', label: 'Allow controlled access with only a few customers inside at a time, so people can still get what they need without crowding a damaged building', desc: 'Fewer people, but still inside an unsafe, possibly gas-leaking building. The hazard does not care how many are in the room.', effect: { score: -3 } },
        { key: 'D', label: 'Lock the building up entirely and turn everyone away, on the basis that no sale is worth having somebody hurt inside premises you own', desc: 'Safe, but abandons a community that genuinely needs the gear you could have passed out from the front.', effect: { score: -2 } }
      ]
    },
    {
      time: 26, type: 'decision', tag: 'OWNER',
      title: 'No EFTPOS, No Internet',
      body: 'Power, EFTPOS and internet are all down and the cell network is intermittent. Almost nobody in the queue is ' +
        'carrying cash, the nearest working ATM is in a town they cannot reach, and the stock they need is sitting behind ' +
        'you.',
      decisionId: 'sarah_eftpos',
      prompt: 'How do you handle payment?',
      options: [
        { key: 'A', label: 'Trade on a written ledger - name, contact, items and value, signed - and tell people plainly you will invoice when systems return', desc: 'A simple written record keeps goods moving to people who need them and keeps the business recoverable. Both matter.', effect: { score: 5 } },
        { key: 'B', label: 'Cash only with no exceptions, so that every transaction is settled on the spot and the business is not left carrying debts it cannot chase', desc: 'Nobody has cash, so the stock stays on the shelf while the town goes without - and you make no money either.', effect: { score: -4 } },
        { key: 'C', label: 'Hand out what people need with no record at all, on the basis that this is an emergency and sorting out the paperwork can wait for weeks', desc: 'Generous and unrecoverable. With four weeks of runway, this is the decision that closes the shop the town needs in a month.', effect: { score: -3 } },
        { key: 'D', label: 'Take card numbers written down on paper and process them once the systems come back, so nobody goes without and the business still gets paid', desc: 'Handwritten card details in a damaged shop is a data-security and fraud exposure you cannot defend to anyone.', effect: { score: -5 } }
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
        { key: 'B', label: 'Require all staff to stay on shift, because there is no business without them and the queue outside is not getting any shorter', desc: 'Traps frightened people away from their own families and at risk in a damaged building. Unsafe and corrosive to trust.', effect: { score: -5 } },
        { key: 'C', label: 'Let everyone go home to their families and close the shop completely, so that nobody has to choose between their job and their own people', desc: 'Defensible and safe, but gives up the community-supply role that willing volunteers might have kept running.', effect: { score: -1 } },
        { key: 'D', label: 'Press staff to stay by reminding them how much the community is depending on this shop today, and how few other options anyone has', desc: 'Guilt-tripping frightened staff is manipulation; it damages morale and the loyalty you will need for the recovery.', effect: { score: -3 } }
      ]
    },
    {
      time: 38, type: 'decision', tag: 'OWNER',
      title: 'Two Staff With Nowhere to Go',
      body: 'Two of your staff are migrant workers with no family in New Zealand. Their flat is red-stickered, they have no ' +
        'car, no local network and limited English, and they have quietly kept working all afternoon without mentioning any ' +
        'of it.',
      decisionId: 'sarah_migrant_staff',
      prompt: 'How do you support them?',
      options: [
        { key: 'A', label: 'Sort their accommodation and food tonight yourself, connect them to Civil Defence welfare and someone who speaks their language, and make sure they know their job is safe', desc: 'They have no other network, and you are it. Practical shelter plus a clear word on their job removes the fear they are not voicing.', effect: { score: 5 } },
        { key: 'B', label: 'Point them toward the welfare centre and get back to the shop, since Civil Defence is set up for exactly this and you are not', desc: 'A direction is not support for two people with no transport, no local knowledge and limited English.', effect: { score: -3 } },
        { key: 'C', label: 'Say nothing and let them come to you if they need something, since they have not asked for help and you do not want to embarrass anyone by asking about it in front of the others', desc: 'Staff with the least security and the most to lose are precisely the ones who will not ask.', effect: { score: -4 } },
        { key: 'D', label: 'Let them sleep in the shop overnight, so they have a roof and somewhere warm without you having to sort anything more formal tonight', desc: 'Puts two employees inside a damaged building with a gas hazard, to solve a problem the welfare system exists for.', effect: { score: -5 } }
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
        { key: 'B', label: 'Sell normally on a first-come first-served basis until the stock runs out, so that nobody can accuse you of deciding who deserves what', desc: 'The early and well-off empty the shelves; the vulnerable and those still digging out their homes miss out entirely.', effect: { score: -3 } },
        { key: 'C', label: 'Reserve the entire stock for emergency services and sell nothing over the counter, so the people running the response are not left short', desc: 'Responders matter, but the public also genuinely needs water, light and warmth tonight.', effect: { score: -2 } },
        { key: 'D', label: 'Give it all away free to whoever asks, because charging people for water and torches on a day like this is not something you want to be', desc: 'Generous, but empties your stock within the hour and leaves nothing for later or for the business the town needs to survive.', effect: { score: -3 } }
      ]
    },
    {
      time: 50, type: 'decision', tag: 'ETHICAL',
      title: 'The Supermarket Proposes Pooling',
      body: 'The supermarket manager proposes pooling emergency supplies across the four businesses still trading - one shared ' +
        'stock list, one distribution point, one set of prices. It would stop people running between shops, and it would ' +
        'also put your stock under someone else’s control.',
      decisionId: 'sarah_pooling',
      prompt: 'How do you respond to the proposal?',
      options: [
        { key: 'A', label: 'Join it, but insist on a written record of what each business contributes and a shared allocation rule agreed with Civil Defence', desc: 'Pooling genuinely serves the town; the written record and an agreed rule are what stop it becoming a dispute in a fortnight.', effect: { score: 5 },
          locked: function (log) {
            return log['sarah_supplies'] === 'D' ? 'You gave your emergency stock away free this morning - there is nothing left to pool' : false;
          } },
        { key: 'B', label: 'Refuse to join the pool - this stock is the only thing standing between your business and closing, and no other owner is carrying your debt', desc: 'Defensible commercially, and it keeps four separate queues running for the same scarce goods in a town that cannot travel.', effect: { score: -3 } },
        { key: 'C', label: 'Join the pool on a handshake with no written record, since everyone in the room has known each other for years and paperwork slows it down', desc: 'Four businesses, no record, and a month of arguments about who put in what while everyone is trying to recover.', effect: { score: -3 } },
        { key: 'D', label: 'Agree publicly to the pool and quietly hold your best stock back, so you look like a good neighbour without gutting your own shelves', desc: 'The pooling only works on trust, and being caught holding back destroys yours for the whole recovery.', effect: { score: -5 } }
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
        { key: 'A', label: 'Hold prices at exactly their normal levels and be seen to be doing it, because the trust of a town you will trade in for another eighteen years is worth more than the margin', desc: 'Avoids any whiff of profiteering and protects the community relationship the business depends on for its own recovery.', effect: { score: 5 } },
        { key: 'B', label: 'Raise prices sharply to reflect what replacement will actually cost you and how scarce these goods have suddenly become across the district since this morning’s earthquake', desc: 'Price-gouging emergency goods in a disaster torches 18 years of trust and invites reputational and legal damage.', effect: { score: -6 } },
        { key: 'C', label: 'Raise prices modestly and explain openly that it covers the genuine cost of replacing stock you may not be able to reorder for weeks', desc: 'Defensible if it is truly cost-recovery and openly explained, but the optics of any rise in this moment are dangerous.', effect: { score: 1 } },
        { key: 'D', label: 'Stop selling the scarce items altogether rather than have to set a price on them, so nobody can accuse you of profiting from the situation', desc: 'Denies the community supplies it needs just to avoid making the pricing call.', effect: { score: -2 } }
      ]
    },
    {
      time: 62, type: 'decision', tag: 'OWNER',
      title: 'A Customer Is Injured by Falling Stock',
      body: 'An aftershock brings a leaning shelving bay down across a customer in the aisle. She has a deep laceration to her ' +
        'arm and is shaken but conscious. Half the queue saw it happen, and two people are already filming.',
      decisionId: 'sarah_customer_injury',
      prompt: 'How do you handle it?',
      options: [
        { key: 'A', label: 'First aid and get her to the medical centre, clear and secure every remaining shelving bay, write down what happened while it is fresh, and notify your insurer as soon as you can reach them', desc: 'Care first, then remove the hazard that is still standing, then the record - which protects her claim as much as your business.', effect: { score: 5 } },
        { key: 'B', label: 'Patch her up, apologise properly, and keep the queue moving, because there are forty people waiting and only one of you to serve them before the light goes', desc: 'Leaves every other leaning bay exactly as it was, so the next aftershock produces the next casualty.', effect: { score: -5 } },
        { key: 'C', label: 'Ask her not to make a formal claim given everything you are already dealing with, and offer to pay for whatever treatment she needs directly instead rather than have it dragged through the insurer', desc: 'Pressuring an injured customer out of a claim is the single worst thing you could do here, legally and to your reputation.', effect: { score: -6 } },
        { key: 'D', label: 'Close the shop completely for the rest of the day, so that nobody else can be hurt by shelving that has already come down on one customer once', desc: 'Overcorrects: securing the shelving and trading from the front was available, and the town still needs supplies tonight.', effect: { score: -2 } }
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
        { key: 'B', label: 'Cash only, with no payment meaning no goods, so that the cash flow keeping twelve people employed does not disappear in a single afternoon', desc: 'Denies essentials to neighbours who simply cannot access money today, in a community you will rely on for years.', effect: { score: -3 } },
        { key: 'C', label: 'Give everything away to anyone who asks for it, on the basis that a town in this state should not be turned away over money', desc: 'No record and no recoverable value; generous to a fault, and it threatens the business the community will need tomorrow.', effect: { score: -3 } },
        { key: 'D', label: 'Offer credit to the stranded tourists and take cash from locals, since visitors have no way to get money and locals can settle up later', desc: 'Backwards: you will never see the tourists again, while the locals you know are the ones you can safely extend credit to.', effect: { score: -2 } }
      ]
    },
    {
      time: 74, type: 'inject', tag: 'SITUATION',
      title: 'The Queue Down the Street',
      body: 'Word has gone round that you still have water, torches, batteries and gas. The queue now runs past three ' +
        'shopfronts and includes stranded tourists, farmers who have driven in on back roads, and neighbours you have known ' +
        'for fifteen years. There are more people outside than there is stock inside.',
      source: 'Main Street'
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
        { key: 'B', label: 'Serve the paying public at the counter first in the order they arrived, since they have been queueing since morning and the centre can wait', desc: 'Puts counter cash ahead of a medical centre treating casualties. Life safety has to come first here.', effect: { score: -5 } },
        { key: 'C', label: 'Give the medical centre absolutely everything it asks for and leave nothing on the shelves, because medical need outranks every other claim', desc: 'The medical priority is right, but the public also has real basic needs for the cold night ahead.', effect: { score: -2 } },
        { key: 'D', label: 'Make the medical centre wait while you work out a proper allocation, rather than commit stock you may need more urgently in an hour', desc: 'A medical centre treating casualties cannot wait while you deliberate.', effect: { score: -3 } }
      ]
    },
    {
      time: 92, type: 'decision', tag: 'OWNER',
      title: 'The Bank Finally Calls Back',
      body: 'A bank representative returns your call. The business loan is personally guaranteed against your house. He wants ' +
        'to know your trading position, your stock losses and whether you intend to keep operating - and he is deciding ' +
        'today whether to extend or freeze your facility.',
      decisionId: 'sarah_bank',
      prompt: 'What do you tell the bank?',
      options: [
        { key: 'A', label: 'Give an honest position with the numbers you actually have, state clearly what you need and by when, and ask for a written short-term arrangement', desc: 'Banks fund businesses they can see clearly. An honest position with a specific ask survives scrutiny; an optimistic one does not.', effect: { score: 5 } },
        { key: 'B', label: 'Overstate your position to protect the overdraft facility, since a bank that senses trouble will pull the line exactly when you most need it', desc: 'When the real numbers arrive, and they will, you have handed the bank grounds to call the guarantee against your house.', effect: { score: -6 } },
        { key: 'C', label: 'Tell him you cannot talk about it today and will come back to him, because you have a damaged building and a queue and no time for this', desc: 'He is deciding today either way, and he will decide on no information rather than yours.', effect: { score: -4 } },
        { key: 'D', label: 'Ask him to freeze everything until the insurance is settled, so that nothing has to be decided until you know what you are actually working with', desc: 'Insurance settlement is months away, and a frozen facility means no payroll and no restock next week.', effect: { score: -3 } }
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
        { key: 'A', label: 'Sell it to the farmer at a fair and entirely normal price, because insulin that has to stay cold for a diabetic child outranks a tourist waving five thousand dollars', desc: 'Need over the highest bidder. Keeping medicine cold is a life-safety use, and the choice protects your standing in the town.', effect: { score: 5 } },
        { key: 'B', label: 'Take the tourist’s five thousand dollars, since the business badly needs the cash and he is offering many times what the generator is worth to anybody else in this town', desc: 'Selling a life-critical item to the highest bidder over a medical need is the definition of disaster profiteering.', effect: { score: -6 } },
        { key: 'C', label: 'Auction it openly to whoever pays the most, so the market decides rather than you having to judge whose need is the more deserving', desc: 'Need-blind by design, and the most exposed way to profiteer on a life-essential item.', effect: { score: -5 } },
        { key: 'D', label: 'Refuse to sell it to either of them and keep it running the shop, since the chiller stock and the till are what keep everyone supplied', desc: 'Hoards a critical asset the community urgently needs while people go without.', effect: { score: -3 } }
      ]
    },
    {
      time: 104, type: 'cascade', tag: 'CASCADE',
      title: 'Fuel Shortage Bites',
      body: 'The service station has run dry and there are no deliveries while the roads are closed. Your van cannot restock ' +
        'from the depot, the generator you are running has perhaps two days of fuel, and customers are now asking whether ' +
        'you have petrol as well as everything else.',
      source: 'Main Street / Fuel Supplier'
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
        { key: 'B', label: 'Follow the insurer’s instruction to the letter and leave everything exactly where it fell, so that no part of the claim can later be disputed', desc: 'Leaves scattered gas cylinders as a live public hazard purely to protect a claim. Safety has to come first.', effect: { score: -5 } },
        { key: 'C', label: 'Clear and dispose of everything quickly to get the site usable again, because a shop full of wreckage cannot trade and trading is what pays wages and keeps twelve people employed', desc: 'Over-clears - destroying evidence and possibly insured stock - without the documentation that would protect you.', effect: { score: -3 } },
        { key: 'D', label: 'Do nothing at all until you have written clarification from the insurer, so that you are never the one who broke the terms of the policy', desc: 'Leaves a dangerous hazard in a public street while you wait for paperwork that may take hours.', effect: { score: -3 } }
      ]
    },
    {
      time: 116, type: 'decision', tag: 'OWNER',
      title: 'The Engineer Clears the Front Only',
      body: 'A building engineer inspects and gives you a partial clearance: the front third of the shop is usable with the ' +
        'shelving removed, the rear is not to be occupied at all. He will put it in writing, but not until tomorrow. The ' +
        'queue outside has not shortened.',
      decisionId: 'sarah_reopen',
      prompt: 'How do you trade tomorrow?',
      options: [
        { key: 'A', label: 'Trade from the cleared front section only, exactly within the engineer’s limits, with the rear physically barriered and staff briefed on where the line is', desc: 'Takes the clearance for exactly what it says. The barrier and the briefing are what stop the limit quietly eroding by mid-morning.', effect: { score: 5 },
          locked: function (log) {
            return log['sarah_building'] === 'B' ? 'The council closed your building after you kept trading through the warning' : false;
          } },
        { key: 'B', label: 'Reopen the whole shop - the engineer is being cautious, the building has stood through every aftershock so far, and people need the stock', desc: 'Substituting your judgement for the engineer’s on a rear section he specifically excluded, with staff and customers inside.', effect: { score: -6 } },
        { key: 'C', label: 'Stay closed until the written clearance actually arrives, however long that takes, so that nothing rests on a verbal opinion given in a hurry', desc: 'Cautious, and it leaves the town without supplies for a day when a compliant front-of-shop operation was expressly available.', effect: { score: -2 } },
        { key: 'D', label: 'Serve customers from the cleared front but send staff into the rear for stock as needed, since the public never has to go past the barrier', desc: 'Keeps customers out of the excluded area and sends your own employees into it instead, which is worse.', effect: { score: -6 } }
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
        { key: 'B', label: 'Dismiss them on the spot for theft, so that the rest of the team can see exactly where the line is before anybody else decides to cross it', desc: 'Harsh given a family with nothing, and it shatters the trust and morale of the team you still need.', effect: { score: -4 } },
        { key: 'C', label: 'Ignore it and let staff take what they need, since they are working unpaid hours in a damaged building and their families are short too', desc: 'No record, unfair to everyone else, and the stock the community needs quietly walks out the door.', effect: { score: -3 } },
        { key: 'D', label: 'Make a public example of them in front of the rest of the team, so the message lands once and you never have to have this conversation again', desc: 'Public humiliation of a desperate employee poisons the whole team’s trust in you as a leader.', effect: { score: -4 } }
      ]
    },
    {
      time: 128, type: 'inject', tag: 'SITUATION',
      title: 'The Other Store Closes',
      body: 'The only other general store in town has locked its doors and put up a handwritten sign. Its owners have gone to ' +
        'family in Christchurch. Whatever demand they were absorbing is now yours, and everyone on the street knows it.',
      source: 'Main Street'
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
        { key: 'B', label: 'Get into the comments and argue it out with your accusers, because the claim is untrue and letting it stand unchallenged is how it becomes fact', desc: 'Feeds the pile-on, keeps the story alive, and drains time and composure you need elsewhere.', effect: { score: -3 } },
        { key: 'C', label: 'Ignore it entirely and carry on serving people, on the basis that anyone who has actually been in the shop today knows what you have been charging', desc: 'An unanswered accusation hardens into "the truth", and the cancellations keep coming.', effect: { score: -2 } },
        { key: 'D', label: 'Publicly threaten legal action against whoever posted it, so that it comes down quickly and nobody else in town tries the same thing', desc: 'Looks defensive and aggressive, and amplifies a story you wanted to shrink.', effect: { score: -3 } }
      ]
    },
    {
      time: 140, type: 'decision', tag: 'OWNER',
      title: 'Friday Is Payday',
      body: 'Twelve staff are due to be paid on Friday. Revenue has effectively stopped, the cash reserve covers roughly four ' +
        'weeks of wages and nothing else, and you have no idea when the insurer will pay or whether the bank facility ' +
        'holds. Two of your staff have already asked, carefully, whether their jobs are safe.',
      decisionId: 'sarah_staff_pay',
      prompt: 'How do you handle payroll?',
      options: [
        { key: 'A', label: 'Pay them on Friday, tell the whole team honestly what the runway is and what you are doing about it, and get advice on wage subsidy and hardship support the same day', desc: 'Paying on time buys the loyalty you will need, and honesty about the runway means nobody finds out in week three that it was never viable.', effect: { score: 5 },
          locked: function (log) {
            return log['sarah_credit'] === 'C' ? 'The cash went out this morning as unrecorded giveaways - there is no payroll left to run' : false;
          } },
        { key: 'B', label: 'Pay them on Friday as normal and say nothing about the runway, because frightening your staff about their jobs helps nobody this week', desc: 'They will plan their own lives around a security you know may not last a month, and they will not forgive learning it late.', effect: { score: -3 } },
        { key: 'C', label: 'Defer wages until the insurance pays out, and explain that everyone will be made whole the moment the money actually lands in the account, which the broker says will not be long', desc: 'Staff with damaged homes and no other income cannot lend you their wages, and legally you cannot ask them to.', effect: { score: -6 } },
        { key: 'D', label: 'Lay off half the staff immediately to protect the cash runway, so that the business survives long enough to re-employ them later on', desc: 'Cuts the people you need to reopen, in a town with nowhere else to work, before you have even asked about support.', effect: { score: -4 } }
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
        { key: 'B', label: 'Donate everything the response asks for without argument, because a business that holds back supplies in a disaster does not get forgiven for it', desc: 'Generous, but may sink the business the community will depend on for recovery, and empties the public supply at once.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse to give anything at all, on the basis that you are already carrying uninsured losses and nobody is offering to underwrite your generosity', desc: 'Protects the business but abandons the official response and badly damages the reputation you will need afterwards.', effect: { score: -4 } },
        { key: 'D', label: 'Quietly favour whichever agencies and people can do the most for you later, since goodwill is the only currency that survives a recovery', desc: 'Self-dealing - the opposite of the transparent, defensible decision-making the moment demands.', effect: { score: -5 } }
      ]
    },
    {
      time: 152, type: 'inject', tag: 'WELFARE',
      title: 'Stranded Tourists on the Footpath',
      body: 'Around forty tourists have nowhere to go. The motels are damaged, the welfare centre is full, and the roads are ' +
        'closed in both directions. Several are standing outside your shop because it is the only lit building on the ' +
        'street, and snow is forecast before midnight.',
      source: 'Civil Defence / Main Street'
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
        { key: 'B', label: 'Stand guard at the shop alone all night against the looting risk, since there is nobody else to do it and the front windows are gone', desc: 'Exhausting and dangerous, leaves your family alone, and one person cannot really secure a broken-open shop anyway.', effect: { score: -3 } },
        { key: 'C', label: 'Leave the shop open and go home without securing anything, on the basis that people who need supplies overnight should be able to get them', desc: 'Invites the loss of the very stock the community will need from you tomorrow.', effect: { score: -2 } },
        { key: 'D', label: 'Bring your children down to the shop so they can help you guard it overnight, keeping the family together and the premises watched', desc: 'Puts your kids in a damaged, dark, unsafe building through a freezing night. The wrong place for them.', effect: { score: -4 } }
      ]
    },
    {
      time: 172, type: 'decision', tag: 'ETHICAL',
      title: 'Civil Defence Wants Exclusive Access',
      body: 'Civil Defence requests exclusive access to your entire remaining emergency stock for the welfare centre, to be ' +
        'distributed under their control. It would go to people who genuinely need it. It would also close your shop to the ' +
        'queue outside, who also genuinely need it, and who have been waiting since this morning.',
      decisionId: 'sarah_civil_defence',
      prompt: 'How do you answer Civil Defence?',
      options: [
        { key: 'A', label: 'Agree a documented split - a defined quantity to the welfare centre at agreed terms, the balance for the counter - and get the allocation basis in writing from them', desc: 'Both channels reach people who need the stock. The document is what protects you when someone later asks why they missed out.', effect: { score: 5 },
          locked: function (log) {
            return log['sarah_donate'] === 'B' ? 'You donated the entire emergency stock earlier today - there is nothing left to allocate' : false;
          } },
        { key: 'B', label: 'Hand the entire stock over to Civil Defence, since they are running the official response and are better placed than you to decide who needs it most across the whole township', desc: 'Closes the only supply point the street has, sends the queue away empty, and leaves you with no record and no recoverable value.', effect: { score: -4 } },
        { key: 'C', label: 'Refuse the request outright - your customers have been queueing since this morning and several of them have nowhere else to go for supplies', desc: 'The welfare centre is sheltering the people least able to queue at all, and a split was available to serve both.', effect: { score: -4 } },
        { key: 'D', label: 'Agree to the request and quietly keep the best stock back for the counter, so the welfare centre is served without emptying your shelves', desc: 'Undermines the official response and destroys the relationship you will need through the entire recovery.', effect: { score: -5 } }
      ]
    },
    {
      time: 176, type: 'info', tag: 'NIGHT',
      title: 'The First Night Closes In',
      body: 'The snow arrives after dark. The generator is running the chiller and one string of lights, the ledger runs to ' +
        'four pages, the shelving is stacked outside, and the queue has finally thinned. Your staff have gone home to ' +
        'damaged houses, and tomorrow starts again at first light.',
      source: 'Main Street'
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
