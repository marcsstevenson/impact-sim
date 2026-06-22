
// ============ GAME ENGINE ============
var GameState = {
  scenario: 'af8',
  time: 0,
  phase: 'immediate',
  score: 72,
  decisions: [],
  eventIndex: 0,
  classification: 'R3',
  escalating: true,
  metrics: {},
  cascades: {},
  activeEvents: [],
  choiceLog: {},
  facilitatorMode: false
};

var SCENARIO_CONFIGS = {
  af8: {
    label: 'AF8 SIMULATOR',
    classification: 'R3',
    classCSS: 'r3',
    classText: 'R3 \u25B2',
    startScore: 50,
    metrics: {
      livesAtRisk: 45000, commsStatus: 'degraded', powerPercent: 15,
      roadsWest: 'severed', eccsActive: 4, isolatedCommunities: 28,
      casualties: { minor: 3200, serious: 450, fatal: 180, trapped: 85 },
      displaced: 35000, helicoptersAvail: 12, fuelDays: 2.5
    },
    statusBar: [
      { id: 'lives', label: 'Lives at Risk:', value: '~45,000', cls: 'warning' },
      { id: 'comms', label: 'Comms:', value: 'Degraded', cls: 'warning' },
      { id: 'power', label: 'Power:', value: '15% SI', cls: 'critical' },
      { id: 'roads', label: 'Roads:', value: 'Severed W', cls: 'critical' },
      { id: 'eoc', label: 'ECCs Active:', value: '4/6', cls: 'good' }
    ]
  },
  local: {
    label: 'AF8 \u2014 CANTERBURY LOCAL',
    classification: 'R3',
    classCSS: 'r3',
    classText: 'R3 \u25B2',
    startScore: 50,
    metrics: {
      livesAtRisk: 2500, commsStatus: 'congested', powerPercent: 65,
      roadsLocal: 'partially_damaged', eocActive: 1, isolatedCommunities: 3,
      casualties: { minor: 1800, serious: 85, fatal: 12, trapped: 8 },
      displaced: 4500, helicoptersAvail: 14, fuelDays: 5,
      homesDamaged: 25000, homesUninhabitable: 3500,
      waterSystem: 'partially_depressurised', wastewater: 'compromised_east',
      airportStatus: 'assessing', portStatus: 'operational'
    },
    statusBar: [
      { id: 'lives', label: 'Local Impact:', value: 'Moderate', cls: 'warning' },
      { id: 'comms', label: 'Comms:', value: 'Congested', cls: 'warning' },
      { id: 'power', label: 'Power:', value: '65% City', cls: 'warning' },
      { id: 'roads', label: 'Airport:', value: 'Assessing', cls: 'warning' },
      { id: 'eoc', label: 'Support Role:', value: 'Activating', cls: 'critical' }
    ]
  }
};


// ============ CANTERBURY LOCAL EVENT SEQUENCE (AF8 SCENARIO 2) ============
// Canterbury as dual-role: moderate local damage + logistics hub for South Island response
var LOCAL_EVENTS = [
  {
    time: 0, type: 'inject', tag: 'MAINSHOCK',
    title: 'Alpine Fault Rupture \u2014 M8.0 (Canterbury Perspective)',
    body: 'GeoNet confirms a magnitude 8.0 earthquake on the Alpine Fault. In Christchurch, shaking lasted over two minutes at MMI VII-VIII. Canterbury basin sedimentary soils amplifying ground motion. Immediate reports of non-structural damage across the city \u2014 fallen shelves, broken glass, cracked plaster. Some older URM buildings in CBD showing facade damage. Eastern suburbs reporting localised liquefaction. No building collapses confirmed yet. Power has tripped across approximately 35% of the city.',
    source: 'GNS Science / GeoNet \u2014 Automatic Detection',
    aftershock: true
  },
  {
    time: 5, type: 'info', tag: 'CIMS',
    title: 'SAFER Framework Activation \u2014 Canterbury CDEM Group',
    body: 'Per SAFER Framework Section 1.5 Activation Trigger 1 ("strongly felt earthquake with shaking continuing for longer than two minutes"), Canterbury CDEM Group is activating the ECC at JESP. Per Christchurch City Earthquake Response Plan Part A, this is a Scenario 2 event \u2014 Alpine Fault earthquake with moderate local impacts but a major support role obligation. Canterbury will serve as the primary logistics, evacuation reception, and international assistance hub for the South Island.',
    source: 'Canterbury CDEM Group Controller'
  },
  {
    time: 15, type: 'inject', tag: 'IMPACT',
    title: 'Canterbury Local Damage Assessment Beginning',
    body: 'CCC Duty Officer reports: local damage is moderate but widespread. Several CBD heritage URM buildings have partial facade collapses. Eastern suburbs (Avondale, Bexley) reporting localised liquefaction \u2014 less severe than CES but present. Port Hills reporting minor rockfall on Summit Road. Christchurch Hospital is operational with a surge of walking wounded. Christchurch Airport has closed for runway inspection. Lyttelton Port reports no structural damage to wharves \u2014 bulk fuel terminals appear operational.',
    source: 'CCC CDEM Duty Officer / CIAL / LPC'
  },
  {
    time: 30, type: 'decision', tag: 'CONTROLLER',
    title: 'EOC Activation Level \u2014 Dual Role',
    body: 'Per Part B, the CCC EOC needs to activate. But this is not a Scenario 1 (CES-type) event \u2014 Canterbury has moderate local damage AND a massive support role obligation under SAFER pairing (Canterbury paired with West Coast). The Group Controller at JESP is standing up the regional ECC. The question is how CCC positions itself: focused locally, focused on the support role, or attempting both.',
    decisionId: 'eoc_level',
    prompt: 'How do you configure the CCC response posture?',
    options: [
      { key: 'A', label: 'Full Activation Level 4 \u2014 Hereford Street EOC for CCC, leave JESP to Group', desc: 'Separates CCC local response from Group-level AF8 coordination. Clear lanes. But CCC is isolated from the wider picture and may duplicate effort.', effect: { score: -2 } },
      { key: 'B', label: 'Activate at JESP alongside Group ECC \u2014 integrated response with dual focus', desc: 'Co-location enables real-time coordination between local response and support role. But CCC priorities may be overshadowed by the massive AF8 regional demands.', effect: { score: 3 } },
      { key: 'C', label: 'Split team: skeleton crew on local damage at Hereford St, main effort at JESP supporting the AF8 response', desc: 'Acknowledges that local damage is moderate and the support role is the main game. But risks under-resourcing local community needs.', effect: { score: 1 } },
      { key: 'D', label: 'Delay activation 2 hours \u2014 complete full building damage assessment before committing to an EOC location', desc: 'Methodical but dangerously slow. Two hours without an activated EOC in a SAFER Framework event means two hours of uncoordinated response. The SAFER Framework assumes activation within minutes, not hours.', effect: { score: -6 } }
    ]
  },
  {
    time: 50, type: 'inject', tag: 'IMPACT',
    title: 'West Coast \u2014 Your Paired Region is in Trouble',
    body: 'Fragmentary satellite phone contact with West Coast CDEM Group ECC in Greymouth. They report severe damage across the region. Franz Josef may need evacuation due to a landslide dam threat. All road access severed. Canterbury is paired with West Coast under SAFER Section 3.3.1 for Grey and Westland Districts. They are asking Canterbury to begin organising logistics support \u2014 now. Meanwhile, your own eastern suburbs residents are reporting silt in their streets and want to know what to do.',
    source: 'West Coast CDEM Group ECC / Canterbury Residents'
  },
  {
    time: 70, type: 'decision', tag: 'CONTROLLER',
    title: 'Airport Priority \u2014 Reopen vs Staging Area',
    body: 'Christchurch Airport has completed initial runway inspection. Minor surface cracking but engineers believe it is operationally safe for heavy aircraft. The airport is designated as South Island strategic lifeline infrastructure under the CDEM Act. NCMC is requesting it reopen immediately as the primary hub for incoming national and international assistance. But the terminal has non-structural damage and some navigation aids are offline. Normal commercial operations would overwhelm a partially operational facility.',
    decisionId: 'airport_priority',
    prompt: 'How do you recommend the airport be used?',
    options: [
      { key: 'A', label: 'Reopen for emergency operations only \u2014 military and CDEM flights, no commercial', desc: 'Prioritises the AF8 support role. Keeps the airport focused on response logistics. But strands commercial passengers and prevents insurance assessors, media, and other stakeholders from arriving.', effect: { score: 4 } },
      { key: 'B', label: 'Full reopening \u2014 resume all operations to project normalcy and economic stability', desc: 'Signals recovery and allows Canterbury to function. But mixes response flights with commercial traffic when ATC is operating with reduced capability.', effect: { score: -6 } },
      { key: 'C', label: 'Phased reopening \u2014 emergency ops now, limited commercial within 24 hours', desc: 'Balanced approach. Gets response logistics flowing immediately while planning for commercial return. Requires clear airspace management protocols.', effect: { score: 2 } },
      { key: 'D', label: 'Requisition the airport under CDEM Act S90 \u2014 full Controller authority, no CIAL consultation', desc: 'Legally available under the declaration but politically explosive. CIAL is cooperating voluntarily. Requisitioning an airport that is already cooperating damages the relationship and may trigger legal challenges that consume Controller bandwidth for weeks.', effect: { score: -5 } }
    ]
  },
  {
    time: 95, type: 'cascade', tag: 'CASCADE',
    title: 'Eastern Suburbs Liquefaction \u2014 Moderate but Disruptive',
    body: 'CCC Infrastructure Team confirms moderate liquefaction across Avondale, Bexley, and parts of Dallington. Less severe than CES events but sufficient to damage water mains and displace some residents. Approximately 3,500 homes are uninhabitable due to foundation damage and silt intrusion. Eastern roads are partially blocked. The community is anxious \u2014 this feels like 2011 again. Community Emergency Hubs are self-activating in Linwood and New Brighton despite the relatively moderate damage level.',
    source: 'CCC Infrastructure Team / Community Resilience Coordinators'
  },
  {
    time: 110, type: 'inject', tag: 'AFTERSHOCK',
    title: 'M6.4 Aftershock \u2014 Arthurs Pass',
    body: 'A magnitude 6.4 aftershock near Arthurs Pass. Christchurch experiences renewed MMI V-VI shaking. Additional minor liquefaction in eastern suburbs. Some buildings in CBD that showed facade cracking earlier now shedding bricks. JESP ECC remains operational. Public anxiety is very high \u2014 CES trauma is being reactivated across the community. PIM function receiving urgent requests for public information about "what to do." 111 system is overloaded.',
    source: 'GeoNet / NZ Police',
    aftershock: true
  },
  {
    time: 130, type: 'decision', tag: 'CONTROLLER',
    title: 'Local Welfare vs Support Role Resource Split',
    body: 'The tension is becoming acute. Your eastern suburbs have 3,500+ displaced residents who remember 2011 and are frightened. Marae and Community Emergency Hubs are self-activating. You have requests to open CDCs. Simultaneously, the Group Controller is asking Canterbury to begin staging logistics for the West Coast \u2014 Lyttelton Port fuel distribution, helicopter staging at the airport, and welfare supply assembly at the Christchurch distribution centre. Your staff cannot do both at full capacity.',
    decisionId: 'welfare_split',
    prompt: 'How do you allocate CCC resources between local welfare and support logistics?',
    options: [
      { key: 'A', label: '70% support role, 30% local \u2014 the West Coast is catastrophic, our damage is manageable', desc: 'Prioritises the SAFER obligation. Canterbury\u2019s local damage is moderate; West Coast\u2019s is severe. But local residents will feel abandoned, especially given CES history.', effect: { score: 1 } },
      { key: 'B', label: '50/50 split \u2014 parallel operations for local welfare and support logistics', desc: 'Attempts both missions. Neither gets full attention. Staff will be stretched thin but both communities see action.', effect: { score: 0 } },
      { key: 'C', label: 'Support marae and Community Hubs for local welfare, focus CCC staff on support logistics', desc: 'Leverages community resilience for local needs while focusing institutional capacity on the support role. Consistent with iwi partnership and community-led response principles from Part B.', effect: { score: 4 } },
      { key: 'D', label: 'Request NCMC reassign Canterbury\u2019s SAFER pairing \u2014 let another Group support West Coast so Canterbury focuses on its own residents', desc: 'Abdicates the SAFER pairing obligation. Canterbury was paired with West Coast because of geographic proximity and capability. No other Group can substitute. This would be seen as Canterbury abandoning its national responsibility during a national emergency.', effect: { score: -8 } }
    ]
  },
  {
    time: 160, type: 'info', tag: 'CIMS',
    title: 'Lyttelton Port \u2014 Operational and Critical',
    body: 'Lyttelton Port Company confirms all wharves are structurally sound. Bulk fuel terminals (BP, Mobil, Z Energy) are operational and ready for distribution. Port access road through the tunnel is clear. This makes Lyttelton the only operational deep-water port on the South Island \u2014 Greymouth and Timaru ports have damage. All fuel, heavy equipment, and bulk supplies for the South Island response will flow through here. The port is requesting a formal CDEM coordination liaison immediately.',
    source: 'Lyttelton Port Company / Fuel Companies'
  },
  {
    time: 185, type: 'inject', tag: 'WELFARE',
    title: 'Evacuee Reception \u2014 First Wave Arriving',
    body: 'The first helicopter evacuees from Franz Josef and the upper West Coast are arriving at Christchurch Airport. Approximately 180 people so far \u2014 mostly tourists, some elderly residents, several with injuries. They have no accommodation, no belongings, and many are international visitors with limited English. MFAT is being notified. Your city has no formal evacuee reception centre established yet. Hotels are being contacted but many are damaged or at capacity with displaced Christchurch residents.',
    source: 'CIAL / Canterbury DHB / MFAT'
  },
  {
    time: 210, type: 'decision', tag: 'CONTROLLER',
    title: 'Evacuee Reception Centre',
    body: 'Evacuees from the West Coast, and potentially Queenstown, will continue arriving for days. International tourists are the largest group \u2014 predominantly German, Chinese, and Australian visitors who were in tourist areas. MFAT has activated consular coordination. Domestic evacuees need accommodation, welfare registration, and support services. Canterbury residents also need CDCs. You need facilities that can handle both populations \u2014 or separate facilities for each.',
    decisionId: 'evacuee_reception',
    prompt: 'How do you establish evacuee reception?',
    options: [
      { key: 'A', label: 'Horncastle Arena as dual-purpose CDC and Evacuee Reception Centre', desc: 'Single large facility handles both local displaced and incoming evacuees. Efficient use of building assessment and staffing. But mixing traumatised local residents with incoming evacuees may create tensions.', effect: { score: 1 } },
      { key: 'B', label: 'Separate facilities \u2014 Cowles Stadium for local CDC, Airport conference facilities for evacuee reception', desc: 'Tailored service for each population. Airport location makes sense for incoming evacuees. But splits welfare staff across two sites and requires two building assessments.', effect: { score: 3 } },
      { key: 'C', label: 'Partner with Red Cross and MFAT \u2014 they lead evacuee reception, CCC focuses on local CDCs', desc: 'Delegates the international evacuee complexity to agencies with mandate and expertise. CCC focuses on its core responsibility. But Red Cross may take 24+ hours to fully mobilise.', effect: { score: 2 } }
    ]
  },
  {
    time: 240, type: 'cascade', tag: 'CASCADE',
    title: 'Fuel Distribution Crisis \u2014 South Island Demand Surge',
    body: 'Lyttelton Port fuel terminals are now the only bulk supply point for the entire South Island. Normal daily fuel demand was approximately 4 million litres. Response operations, generator power for hospitals and telecoms, and community heating are pushing demand to 8+ million litres per day. The pipeline from Lyttelton to inland terminals is intact but at capacity. Tanker trucks are being requisitioned from across Canterbury. Fuel rationing is being considered for civilian use.',
    source: 'Z Energy / BP / Mobil / Group Controller'
  },
  {
    time: 270, type: 'decision', tag: 'CONTROLLER',
    title: 'Fuel Distribution Priority',
    body: 'As the host city for the only operational fuel port, Canterbury has a unique role in fuel allocation. The National Controller is asking for your input on distribution priorities. Your local generators need fuel (hospitals, pumping stations, telecoms), but so does every other community across the South Island. Helicopter operations consume vast quantities. A fuel tanker convoy to Queenstown via SH1/SH8 has been proposed but would consume fuel to deliver fuel.',
    decisionId: 'fuel_priority',
    prompt: 'How do you recommend fuel distribution priorities?',
    options: [
      { key: 'A', label: 'Canterbury local critical facilities first, then South Island response operations', desc: 'Secures your own oxygen mask before helping others. Hospitals, water pumps, telecoms. But the West Coast and Queenstown are in worse shape.', effect: { score: -2 } },
      { key: 'B', label: 'National Controller decides allocation \u2014 Canterbury facilitates distribution, does not prioritise itself', desc: 'Cedes control to the appropriate authority. Canterbury is a distribution node, not a decision-maker on inter-regional allocation. Consistent with CDEM Act hierarchy.', effect: { score: 4 } },
      { key: 'C', label: 'Establish a joint fuel coordination cell at Lyttelton with industry partners and Group ECC', desc: 'Operational solution. Gets fuel companies, military, and CDEM planners in the same room. But takes time to stand up while fuel is burning.', effect: { score: 2 } },
      { key: 'D', label: 'Implement immediate civilian fuel rationing \u2014 emergency-only fuel sales across Canterbury', desc: 'Politically courageous but operationally premature. Canterbury\u2019s fuel supply is disrupted but not exhausted. Rationing signals crisis to a population with moderate damage and may trigger panic buying before the rationing takes effect. Consider as a Day 3-5 option if supply chains remain disrupted.', effect: { score: -3 } }
    ]
  },
  {
    time: 310, type: 'inject', tag: 'IMPACT',
    title: 'CES Trauma Reactivation \u2014 Community Mental Health Crisis',
    body: 'Canterbury DHB Mental Health Services reports a surge in presentations at emergency departments related to acute anxiety and trauma reactivation. The 2011 Canterbury Earthquake Sequence left lasting PTSD across the community. Ongoing aftershocks are triggering severe distress responses. Several community leaders are reporting that residents in eastern suburbs are refusing to return to homes even where buildings are assessed as safe. The psychosocial dimension of this event in Canterbury is disproportionate to the physical damage.',
    source: 'Canterbury DHB / Community Resilience Coordinators'
  },
  {
    time: 340, type: 'decision', tag: 'CONTROLLER',
    title: 'Community Psychosocial Response',
    body: 'The physical damage in Canterbury is moderate. But the psychosocial impact is severe \u2014 the community has been re-traumatised. PIM messaging needs to address not just physical safety but emotional wellbeing. Community Emergency Hubs are becoming de facto social support centres as much as logistics points. Welfare function staff are reporting that residents need reassurance and information more than physical supplies.',
    decisionId: 'psychosocial',
    prompt: 'How do you integrate psychosocial response?',
    options: [
      { key: 'A', label: 'Activate Canterbury DHB psychosocial response plan \u2014 deploy mental health teams to Community Hubs and CDCs', desc: 'Direct clinical intervention. Gets professionals where people are gathering. But mental health staff are also dealing with hospital surge.', effect: { score: 2 } },
      { key: 'B', label: 'PIM pivot \u2014 shift messaging from physical safety to community reassurance, normalise anxiety, compare to CES damage levels', desc: 'Population-level intervention. Helps the whole community understand this is not 2011. Explicit messaging that damage is moderate and recovery will be faster. Cost-effective but may feel dismissive to those genuinely affected.', effect: { score: 1 } },
      { key: 'C', label: 'Combined: deploy mental health teams to Hubs AND PIM reassurance campaign AND peer support through community networks', desc: 'Multi-layered approach. Clinical support for those in acute distress, population messaging for general anxiety, community networks for peer support. Resource-intensive but addresses the full spectrum.', effect: { score: 4 } },
      { key: 'D', label: 'Stand down all non-critical response operations for 60 minutes \u2014 mandatory rest and wellbeing check for all staff and responders', desc: 'Radical approach borrowed from military doctrine. Acknowledges that fatigued responders make dangerous decisions. But 60 minutes of total stand-down during active operations means 60 minutes where no one is coordinating evacuations, welfare, or logistics. The crisis does not pause because you do.', effect: { score: -5 } }
    ]
  },
  {
    time: 380, type: 'inject', tag: 'AFTERSHOCK',
    title: 'M5.8 Aftershock \u2014 Canterbury Basin',
    body: 'A magnitude 5.8 aftershock beneath the Canterbury Plains at 15km depth. MMI VI across Christchurch. Additional minor liquefaction in eastern suburbs. One older CBD building partially collapses \u2014 area was already cordoned. No casualties. But the aftershock causes panic at Community Hubs and the evacuee reception centre. Several West Coast evacuees with existing injuries are re-triaged. JESP ECC loses network connectivity for 8 minutes before backup systems engage.',
    source: 'GeoNet / FENZ / JESP IT',
    aftershock: true
  },
  {
    time: 410, type: 'inject', tag: 'WELFARE',
    title: 'Water System \u2014 Eastern Suburbs Boil Water Notice',
    body: 'CCC 3 Waters confirms water mains damage in eastern suburbs has caused depressurisation and potential contamination. Medical Officer of Health is recommending a boil water notice for suburbs east of Fitzgerald Avenue \u2014 approximately 45,000 residents affected. Six water tankers are available but are being requested for both local distribution and West Coast supply staging. The aquifer itself is unaffected \u2014 this is a reticulation issue, not a source contamination.',
    source: 'CCC 3 Waters / Canterbury PHU'
  },
  {
    time: 440, type: 'decision', tag: 'CONTROLLER',
    title: 'Water Response \u2014 Local vs Logistics',
    body: 'The boil water notice affects 45,000 residents. You have 6 water tankers. The Group Controller has also requested 4 of those tankers be loaded at Lyttelton for helicopter sling-load delivery to isolated West Coast communities who have zero water supply. Your residents have contaminated mains but can boil tap water. West Coast residents have no water at all.',
    decisionId: 'water_response',
    prompt: 'How do you allocate water tankers?',
    options: [
      { key: 'A', label: '4 tankers to local distribution, 2 to West Coast staging', desc: 'Prioritises local residents. Boil water compliance is poor \u2014 people drink tap water. But West Coast communities are in genuine crisis with no alternatives.', effect: { score: -2 } },
      { key: 'B', label: '2 tankers to local distribution at Community Hubs, 4 to West Coast staging', desc: 'Prioritises the greater need. Hub-based distribution means each tanker serves more people. PIM campaign on boiling water reduces local risk. West Coast gets critical supply.', effect: { score: 3 } },
      { key: 'C', label: 'Request Waimakariri and Selwyn Districts send their tankers for local use, free all 6 CCC tankers for West Coast', desc: 'Regional mutual aid for local needs. Canterbury\u2019s neighbouring districts have minimal damage and available tankers. Maximises support to West Coast. But takes 4-6 hours for district tankers to mobilise.', effect: { score: 4 } },
      { key: 'D', label: 'Issue a \u201cdo not use tap water\u201d order \u2014 total prohibition, stronger than boil water', desc: 'Overcorrects the risk. A total prohibition when the issue is localised depressurisation and potential contamination wastes compliance capital. Residents who cannot boil water are now told not to use water at all \u2014 where do they get water? The 6 tankers cannot serve 180,000 people. The boil water notice is the correct public health instrument.', effect: { score: -5 } }
    ]
  },
  {
    time: 480, type: 'decision', tag: 'CONTROLLER',
    title: 'NZDF Staging \u2014 Burnham Camp Integration',
    body: 'NZDF Southern Region at Burnham Camp (30km south of Christchurch) is mobilising as the military staging base for the AF8 response. They are requesting formal CDEM coordination for: 1) heavy vehicle movement through Christchurch to Lyttelton Port, 2) helicopter staging at Christchurch Airport alongside civilian operations, 3) military accommodation overflow into civilian facilities. This will significantly impact Christchurch traffic and logistics for days to weeks.',
    decisionId: 'nzdf_staging',
    prompt: 'How do you coordinate NZDF integration?',
    options: [
      { key: 'A', label: 'Dedicated NZDF liaison officer embedded in JESP ECC \u2014 all military movements coordinated through Group ECC', desc: 'Clean command structure. Military operates within CDEM framework. But adds another coordination layer when ECC is already stretched.', effect: { score: 3 } },
      { key: 'B', label: 'Let NZDF self-coordinate from Burnham \u2014 they have their own logistics capability', desc: 'Simplifies CCC workload. Military is efficient at self-organisation. But risks uncoordinated heavy vehicle movements, airspace conflicts, and community disruption.', effect: { score: -3 } },
      { key: 'C', label: 'Joint civil-military operations centre at Burnham Camp \u2014 CCC, Group ECC, and NZDF co-locate logistics planning', desc: 'Strongest coordination but requires CCC staff at a third location. May enable the most efficient use of Canterbury as a staging platform.', effect: { score: 1 } },
      { key: 'D', label: 'Request NZDF take operational control of all logistics \u2014 military has better capability than civilian CDEM', desc: 'Surrenders civilian authority to the military during a civil emergency. NZDF supports CDEM, not the other way around. The CDEM Act is explicit: Controllers direct the response. Military logistics capability is excellent but military priorities and civilian community needs do not always align.', effect: { score: -7 } }
    ]
  },
  {
    time: 520, type: 'info', tag: 'CIMS',
    title: 'State of National Emergency Declared',
    body: 'A state of national emergency has been declared for all South Island CDEM Group areas. National Controller directs the overall response. Canterbury CDEM Group now operates within National Controller priorities. For Canterbury specifically: local response continues under Group Controller, but the support role for the South Island is now formally directed by NCMC. International assistance is being mobilised \u2014 Australian USAR teams and military assets will stage through Christchurch within 48 hours.',
    source: 'NCMC \u2014 National Controller'
  },
  {
    time: 560, type: 'inject', tag: 'WELFARE',
    title: 'Mass Evacuation Reception \u2014 Scale Escalating',
    body: 'Evacuee numbers at Christchurch Airport are accelerating. 850+ people have now arrived from the West Coast and Queenstown. International tourists are the largest group \u2014 predominantly German, Chinese, and Australian visitors who were in tourist areas. MFAT has activated consular coordination. Accommodation is critical \u2014 hotels are at capacity. The University of Canterbury has offered student halls of residence (currently between terms). Canterbury A&P Showgrounds is being assessed as an overflow facility.',
    source: 'MFAT / Canterbury CDEM Group / University of Canterbury'
  },
  {
    time: 600, type: 'decision', tag: 'CONTROLLER',
    title: 'Mass Accommodation Strategy',
    body: 'Evacuee numbers could reach 5,000+ over the coming week as the West Coast, Queenstown, and potentially other areas are evacuated. Canterbury\u2019s own displaced residents (approximately 3,500) also need housing. Normal accommodation capacity is fully utilised. You need to plan for sustained mass accommodation \u2014 this is not a one-night solution.',
    decisionId: 'accommodation',
    prompt: 'How do you solve the accommodation crisis?',
    options: [
      { key: 'A', label: 'UC Halls of Residence for domestic evacuees + hotels requisitioned for international visitors', desc: 'Separates populations appropriately. UC halls are purpose-built for communal living. Hotels provide individual rooms for tourists who will be repatriated. But requisitioning hotels has economic and political implications.', effect: { score: 2 } },
      { key: 'B', label: 'A&P Showgrounds as mass accommodation \u2014 single site, military logistics support from Burnham', desc: 'Scalable. Military can provide field facilities rapidly. Single site simplifies management. But "showgrounds shelter" optics are poor and conditions may be inadequate for extended stays.', effect: { score: -2 } },
      { key: 'C', label: 'Distributed model \u2014 UC halls, motels, hosted accommodation, marae \u2014 coordinated through Welfare function', desc: 'Uses all available capacity. Avoids concentrating people in institutional settings. Consistent with community-led response. Complex to coordinate but D4H welfare registration enables tracking.', effect: { score: 4 } }
    ]
  },
  {
    time: 650, type: 'cascade', tag: 'CASCADE',
    title: 'Supply Chain Bottleneck \u2014 Canterbury as Chokepoint',
    body: 'Canterbury is now the bottleneck for the entire South Island response. Everything flows through here: fuel from Lyttelton, USAR teams through the airport, supplies from the Christchurch distribution centre, helicopter operations from the airport and Burnham. Local road infrastructure is handling response traffic plus normal civilian use plus military movements. Key intersections near the airport and port are congesting. Some response convoys are being delayed 2-3 hours by traffic.',
    source: 'NZTA / CCC Transport / Group Logistics'
  },
  {
    time: 690, type: 'decision', tag: 'CONTROLLER',
    title: 'Traffic and Movement Control',
    body: 'Per CDEM Act emergency powers, movement control is available. But restricting civilian movement in Canterbury \u2014 where damage is moderate \u2014 will be seen as disproportionate by residents. The alternative is that response convoys continue to be delayed by civilian traffic. NZTA is proposing dedicated response corridors on key routes (SH1, SH73 to Arthurs Pass staging, Tunnel Road to Lyttelton).',
    decisionId: 'movement_control',
    prompt: 'How do you manage the movement control tension?',
    options: [
      { key: 'A', label: 'Implement dedicated response corridors on key routes \u2014 civilian traffic diverted to alternates', desc: 'Pragmatic. Keeps response logistics flowing without a full lockdown. Residents inconvenienced but not confined. Requires Police and NZTA coordination.', effect: { score: 3 } },
      { key: 'B', label: 'Full movement control within 5km of airport and port \u2014 response traffic only', desc: 'Maximum efficiency for logistics. But affects thousands of residents and businesses near the airport and port who have only moderate damage. Political backlash likely.', effect: { score: -2 }, locked: function(log) { return log.airport_priority === 'B' ? 'Airport is closed due to your earlier airspace incident \u2014 movement control around it is pointless' : false; } },
      { key: 'C', label: 'No formal movement control \u2014 use PIM to request voluntary compliance and off-peak travel', desc: 'Lightest touch. Respects that Canterbury is not the disaster zone. But response delays will continue and worsen as more military and USAR assets arrive.', effect: { score: 0 } },
      { key: 'D', label: 'Implement a citywide curfew \u2014 8pm to 6am, no civilian movement', desc: 'Massively disproportionate. Canterbury has moderate damage \u2014 a curfew signals a city under siege. Enforcement requires Police resources that are needed elsewhere. Legal challenge under NZBORA is virtually guaranteed. The political and community backlash would dominate the response narrative for weeks.', effect: { score: -8 } }
    ]
  },
  {
    time: 740, type: 'inject', tag: 'IMPACT',
    title: 'International Media Surge \u2014 Christchurch as the Story',
    body: 'International media crews are arriving in Christchurch in large numbers. The airport is their only entry point to the South Island. They are requesting helicopter access to the West Coast for footage, competing with response flights for airspace and fuel. Several crews have attempted to charter private helicopters, creating safety conflicts in already congested airspace. Local media are reporting that Canterbury residents feel "forgotten" while national attention focuses on the West Coast. Political pressure is building.',
    source: 'PIM Function / Airways NZ / Local Media'
  },
  {
    time: 780, type: 'decision', tag: 'CONTROLLER',
    title: 'Media Management and PIM Strategy',
    body: 'The PIM function is overwhelmed. International media want access to devastation for their stories. Local media want to tell Canterbury\u2019s story. Canterbury residents want to know their community is not forgotten. And NCMC is requesting coordinated national messaging. Every helicopter carrying a camera crew is a helicopter not carrying supplies.',
    decisionId: 'media_management',
    prompt: 'How do you manage the media situation?',
    options: [
      { key: 'A', label: 'Embedded media pool \u2014 one coordinated flight per day with pooled footage shared to all outlets', desc: 'Controls access while meeting media needs. Minimises helicopter diversion. But media organisations may resist pooling arrangements and claim censorship.', effect: { score: 3 } },
      { key: 'B', label: 'Ban all non-essential helicopter flights \u2014 media can cover from Christchurch ground level only', desc: 'Preserves all helicopter capacity for response. But generates hostile coverage about government secrecy and suppression.', effect: { score: 0 }, locked: function(log) { return log.airport_priority === 'B' ? 'Airport is already closed from your earlier airspace incident \u2014 all non-essential flights are already grounded by default' : false; } },
      { key: 'C', label: 'Dedicated PIM media centre at airport \u2014 regular briefings, curated imagery, facilitated ground access to local damage', desc: 'Proactive PIM. Feeds the media beast without diverting response resources. Shows Canterbury damage alongside West Coast coverage. But requires PIM staff to run it.', effect: { score: 2 } }
    ]
  },
  {
    time: 830, type: 'inject', tag: 'AFTERSHOCK',
    title: 'M5.4 Aftershock \u2014 Offshore Canterbury',
    body: 'A magnitude 5.4 aftershock offshore Canterbury at 20km depth. Light shaking only (MMI IV) but GeoNet issues a brief tsunami advisory for Banks Peninsula coastline \u2014 subsequently cancelled within 15 minutes. However, the advisory triggers self-evacuation from Sumner, Lyttelton, and Akaroa. Roads out of Lyttelton are congested with evacuating residents. Port operations pause for 30 minutes during the advisory. Community anxiety spikes again.',
    source: 'GeoNet / NEMA',
    aftershock: true
  },
  {
    time: 870, type: 'decision', tag: 'CONTROLLER',
    title: 'Lyttelton Port Resilience',
    body: 'The brief tsunami advisory exposed a vulnerability: Lyttelton Port is the single point of failure for the entire South Island fuel supply. A real tsunami, even a small one, would shut operations for days. The port has no formal CDEM continuity plan. Meanwhile, Timaru Port has been partially assessed \u2014 minor damage, potentially usable as a secondary fuel import point if dredging is confirmed safe.',
    decisionId: 'port_resilience',
    prompt: 'How do you address the single-point-of-failure risk?',
    options: [
      { key: 'A', label: 'Request NCMC activate Timaru Port as secondary fuel import \u2014 diversify the supply chain', desc: 'Reduces dependency on Lyttelton. But Timaru assessment will take 24-48 hours and fuel companies have no infrastructure there. Long-term solution.', effect: { score: 3 } },
      { key: 'B', label: 'Accelerate fuel stockpiling at inland depots from Lyttelton \u2014 build buffer stock before the next disruption', desc: 'Pragmatic. Uses current capacity while it is available. Creates a buffer against future port disruption. But accelerated distribution increases road congestion.', effect: { score: 2 }, locked: function(log) { return log.nzdf_staging === 'B' ? 'Lyttelton Tunnel is still blocked from the uncoordinated NZDF convoy \u2014 accelerated distribution is impossible' : false; } },
      { key: 'C', label: 'Accept the risk \u2014 Lyttelton is what we have, focus resources on keeping it running', desc: 'Realistic. Diversification takes time and resources Canterbury does not have right now. But leaves the entire response vulnerable to a single event.', effect: { score: -2 } }
    ]
  },
  {
    time: 920, type: 'info', tag: 'CIMS',
    title: 'Recovery Manager Activated',
    body: 'Per CIMS 3rd Edition, the CCC Recovery Manager has been activated and embedded within the EOC. For Canterbury, recovery planning needs to address: local building damage repair and insurance, the ongoing support role (which could last months), community psychosocial recovery, economic impact of hosting the response, and the political dynamics of a city that was damaged but not devastated asking for recognition alongside catastrophically affected regions.',
    source: 'CCC Recovery Manager'
  },
  {
    time: 960, type: 'decision', tag: 'CONTROLLER',
    title: 'Canterbury\u2019s Own Declaration',
    body: 'The national emergency declaration covers all South Island CDEM Groups. But Canterbury has not made its own local declaration. Your damage is moderate. A local declaration would activate additional emergency powers (S86-S90) specific to Christchurch \u2014 useful for requisitioning accommodation and controlling movement. But it also signals to the community that the situation in Canterbury is worse than it appears, and may trigger insurance and legal complications. The Mayor is asking for your recommendation.',
    decisionId: 'declaration',
    prompt: 'Do you recommend a local declaration for Christchurch City?',
    options: [
      { key: 'A', label: 'Yes \u2014 declare a state of local emergency for Christchurch City', desc: 'Activates full emergency powers. Enables accommodation requisition, movement control, property access. But may trigger panic and insurance complications in a moderately damaged city.', effect: { score: 1 } },
      { key: 'B', label: 'No \u2014 operate under the national declaration, which already provides sufficient powers', desc: 'The national declaration covers Canterbury. Additional local declaration is legally redundant and may confuse the public. But leaves some local-specific powers unavailable.', effect: { score: 2 } },
      { key: 'C', label: 'Recommend a targeted declaration \u2014 limited to eastern suburbs and CBD cordon areas only', desc: 'Proportionate to actual damage. Activates powers where needed without applying them city-wide. Novel approach but legally untested for geographic specificity.', effect: { score: 0 } }
    ]
  },
  {
    time: 1010, type: 'inject', tag: 'WELFARE',
    title: 'Australian USAR Team Arrival \u2014 International Assistance Begins',
    body: 'The first Australian USAR task force (72 personnel, 4 search dogs, heavy rescue equipment) has landed at Christchurch Airport on a C-17 Globemaster. They need staging, accommodation, briefing, and transport to the West Coast or Queenstown. Two more international teams (Singapore and Japan) are en route. MFAT is coordinating arrivals. The airport is now processing a continuous flow of military, USAR, and humanitarian flights alongside limited civilian operations.',
    source: 'MFAT / NCMC International Assistance Function'
  },
  {
    time: 1050, type: 'info', tag: 'SUCCESS',
    title: 'Canterbury \u2014 South Island Response Hub Fully Operational',
    body: 'Canterbury has successfully established itself as the primary logistics hub for the AF8 response. Christchurch Airport is operational for emergency and limited civilian flights. Lyttelton Port is distributing fuel across the South Island. NZDF Burnham Camp is fully operational as the military staging base. International assistance teams are arriving and being deployed. Evacuee reception is managing 1,200+ people through distributed accommodation. Local damage response continues through community-led initiatives supported by CCC welfare staff. The Recovery Manager is planning for the transition from response to recovery \u2014 which for Canterbury may look very different from the regions that suffered catastrophic damage.',
    source: 'Canterbury CDEM Group Controller / CCC Local Controller'
  }
];



// ============ AF8 SCENARIO EVENT SEQUENCE ============
var AF8_EVENTS = [
  { time: 0, type: 'inject', tag: 'MAINSHOCK', title: 'Alpine Fault Rupture \u2014 M8.0', body: 'GeoNet confirms a magnitude 8.0 earthquake has ruptured approximately 400km of the Alpine Fault from Fiordland to Kelly Range. Shaking duration exceeded 2 minutes. Epicentre near Milford Sound. Rupture propagation south to north. All SAFER Framework activation triggers have been met. This is the earthquake New Zealand has been planning for.', source: 'GNS Science / GeoNet \u2014 Automatic Detection', aftershock: true },
  { time: 8, type: 'info', tag: 'CIMS', title: 'SAFER Framework Activated', body: 'Per SAFER Framework Section 1.5 Activation Trigger 1: "A strongly felt earthquake with shaking continuing for longer than two minutes." All South Island CDEM Groups are activating ECCs and initiating telecommunications checks. Canterbury CDEM Group ECC at JESP is activating. The CDEM Group pairing system is now in effect \u2014 Canterbury supports West Coast, Southland supports Queenstown Lakes, Nelson-Tasman supports Buller/Marlborough.', source: 'Canterbury CDEM Group Controller' },
  { time: 20, type: 'inject', tag: 'IMPACT', title: 'Initial Impact Picture Forming', body: 'Satellite comms from West Coast ECC confirm severe damage across Greymouth, Hokitika, and Franz Josef. No contact established with communities south of Haast. Queenstown Lakes reporting widespread structural damage and road severance on all access routes. Modified Mercalli Intensity IX-X along fault trace, VII-VIII in Canterbury basin. An estimated 100,000+ people are in areas with significant damage. Communication blackout across 60% of the South Island.', source: 'Intelligence Function \u2014 Satellite Data' },
  { time: 40, type: 'decision', tag: 'CONTROLLER', title: 'Declaration Decision Required', body: 'The Group Controller is requesting your assessment on declaration. Per CDEM Act Section 68, a state of local emergency can be declared. Given the scale of impacts across multiple CDEM Group boundaries, NCMC is also considering a state of national emergency declaration. Wellington has experienced MMI V-VI shaking but infrastructure is largely intact.',
    decisionId: 'af8_declaration',
    prompt: 'What do you recommend to the Group Controller?',
    options: [
      { key: 'A', label: 'Recommend immediate local declaration for Canterbury', desc: 'Activates emergency powers for Canterbury. Demonstrates decisive leadership. But a local declaration alone does not address the multi-regional scale of this event.', effect: { score: 1 } },
      { key: 'B', label: 'Wait for national declaration \u2014 coordinate with NCMC first', desc: 'Avoids fragmented declarations but risks delay. NCMC may take hours to process. Meanwhile, communities are dying and you have no emergency powers.', effect: { score: -8 } },
      { key: 'C', label: 'Declare locally AND advocate for immediate national declaration', desc: 'Belt and suspenders. Local declaration provides immediate powers while national declaration is processed. Consistent with SAFER Framework assumption that Canterbury acts first and coordinates later.', effect: { score: 4 } },
      { key: 'D', label: 'Declare but delay public announcement by 2 hours to prevent panic while emergency powers are quietly activated', desc: 'Ethically indefensible. Emergency declarations are public acts. Exercising emergency powers secretly undermines democratic accountability and public trust. If residents discover the declaration was hidden, the trust damage is permanent. Transparency is non-negotiable.', effect: { score: -7 } }
    ]
  },
  { time: 65, type: 'cascade', tag: 'CASCADE', title: 'Landslide Dam Forming \u2014 Waiho River', body: 'GNS Science aerial reconnaissance reports massive co-seismic landslide blocking the Waiho River gorge upstream of Franz Josef township. Dam is approximately 40m high and impounding water rapidly. Estimated 6-18 hours before overtopping risk. Franz Josef township population approximately 400 residents plus unknown number of tourists \u2014 potentially 1,500+ people. This is a time-critical cascading hazard.', source: 'GNS Science Field Team \u2014 Satellite Phone' },
  { time: 85, type: 'decision', tag: 'CONTROLLER', title: 'Franz Josef Evacuation Decision', body: 'The Waiho River landslide dam represents an immediate threat to Franz Josef township. West Coast CDEM Group is isolated with degraded comms. As supporting CDEM Group under SAFER Framework Section 3.3.1, Canterbury has been paired with West Coast (Grey and Westland Districts). You have 12 helicopters available. Fuel reserves are limited.',
    decisionId: 'af8_franz_josef',
    prompt: 'How do you prioritise the Franz Josef situation?',
    options: [
      { key: 'A', label: 'Immediate helicopter evacuation \u2014 pull all available rotary assets', desc: 'Fastest evacuation but commits all 12 helicopters to one town of 1,500 people. Leaves zero capacity for USAR in Queenstown, medical evacuations, or reconnaissance elsewhere. Fuel burn is massive.', effect: { score: 0, helicopters: -4 } },
      { key: 'B', label: 'Direct community self-evacuation to high ground via PIM broadcast', desc: 'Preserves helicopter assets but relies on degraded comms reaching the community. If the PIM broadcast fails to reach Franz Josef, 1,500 people are in the path of a dam break with no warning.', effect: { score: -7 } },
      { key: 'C', label: 'Combined \u2014 PIM broadcast for immediate self-evacuation + targeted helicopter extraction for vulnerable populations', desc: 'Uses limited helicopters for elderly, injured, and mobility-impaired while the rest of the population moves to pre-identified high ground. Balanced approach consistent with SAFER welfare priorities.', effect: { score: 3, helicopters: -2 } },
      { key: 'D', label: 'Advise NCMC that Franz Josef is a West Coast CDEM Group responsibility \u2014 Canterbury will support when West Coast requests it', desc: 'Technically correct but morally bankrupt. West Coast ECC has sporadic satellite phone contact. They cannot manage a time-critical dam evacuation with degraded comms. The SAFER Framework pairing exists precisely because Canterbury has the capability that West Coast lacks. Waiting for a formal request while a dam overtops is not "following process" \u2014 it is negligence.', effect: { score: -8 } }
    ]
  },
  { time: 115, type: 'inject', tag: 'AFTERSHOCK', title: 'M6.4 Aftershock \u2014 Central Alpine Fault', body: 'A magnitude 6.4 aftershock has struck near Arthurs Pass. Reports of additional rockfall on already damaged roads. SH73 now confirmed fully impassable. Christchurch felt strong shaking \u2014 MMI V. JESP ECC reports minor non-structural damage but remains operational. The aftershock has triggered additional landslide activity across the Southern Alps.', source: 'GeoNet \u2014 Rapid Assessment', aftershock: true },
  { time: 140, type: 'info', tag: 'CIMS', title: 'NCMC Operational \u2014 Wellington', body: 'NCMC confirms operational status from primary Wellington location. National Controller appointed. State of national emergency being considered for all South Island CDEM Group areas. NCMC requesting situation reports from all South Island CDEM Group ECCs by H+03:00.', source: 'NCMC \u2014 National Controller' },
  { time: 170, type: 'decision', tag: 'CONTROLLER', title: 'Telecommunications Priority', body: 'Per SAFER Framework Section 3.6.1, the South Island-wide telecommunications plan must be implemented within 6 hours. You have limited satellite bandwidth. West Coast ECC has only sporadic satellite voice. Queenstown is on emergency HF radio only. Canterbury has satellite data and voice operational. Without comms, you cannot coordinate the paired support role.',
    decisionId: 'af8_telecoms',
    prompt: 'How do you allocate telecommunications priorities?',
    options: [
      { key: 'A', label: 'Prioritise Canterbury-to-NCMC link for national coordination', desc: 'Ensures national resources are being mobilised. But leaves West Coast and Otago in a communications blackout \u2014 you cannot support your paired region if you cannot talk to them.', effect: { score: -3 } },
      { key: 'B', label: 'Prioritise Canterbury-to-West Coast link as paired support Group', desc: 'Fulfils SAFER pairing obligation. West Coast has the most severe impacts and least connectivity. Enables you to coordinate logistics support.', effect: { score: 1 } },
      { key: 'C', label: 'Request NZDF deploy HF relay aircraft to bridge all gaps simultaneously', desc: 'Best technical solution but NZDF assets are still mobilising from the North Island. May take 12-24 hours. Meanwhile, the comms gap persists and coordination suffers.', effect: { score: -2 } }
    ]
  },
  { time: 210, type: 'inject', tag: 'WELFARE', title: 'Queenstown Isolation \u2014 35,000+ Stranded', body: 'Otago CDEM Group reports via HF radio that Queenstown Lakes district has approximately 35,000 residents and visitors with no road access. Airport runway has visible cracking and is being assessed. Supermarket stocks estimated at 2-3 days. Water supply intact but wastewater system compromised. An estimated 8,000 people have no shelter. Temperatures expected to drop to 2\u00B0C overnight.', source: 'Otago CDEM Group ECC \u2014 HF Radio' },
  { time: 250, type: 'decision', tag: 'CONTROLLER', title: 'Queenstown Supply Strategy', body: 'Per SAFER Framework Section 3.3.1, Otago is paired with Southland for Queenstown Lakes. However, the scale exceeds Southland\'s capacity. The "no regrets" rapid relief approach (SAFER 3.4.2b) suggests pushing supplies based on estimated need rather than waiting for confirmed assessments. 8,000 people are without shelter and temperatures are dropping.',
    decisionId: 'af8_queenstown',
    prompt: 'How do you coordinate the Queenstown response?',
    options: [
      { key: 'A', label: 'Push emergency supplies via helicopter from Christchurch staging area', desc: '"No regrets" approach. Gets supplies moving immediately. Heavy fuel cost and commits helicopters. But people are cold now and this is consistent with SAFER rapid relief philosophy.', effect: { score: 4, helicopters: -3 } },
      { key: 'B', label: 'Coordinate with Southland to push ground supplies via Kingston road', desc: 'Preserves air assets but road damage south of Kingston is unknown. Ground convoy may take 18+ hours or fail entirely. Meanwhile, 8,000 people spend the night without shelter at 2 degrees.', effect: { score: 0 } },
      { key: 'C', label: 'Wait for Queenstown Airport assessment \u2014 if clear, fixed-wing airlift', desc: 'Most efficient if airport is usable. But assessment may take 12+ hours and airport may be unusable. Waiting while people freeze is not "no regrets."', effect: { score: -7 } },
      { key: 'D', label: 'Request Australia provide military airlift \u2014 RAAF C-130s have the range and capacity to supply Queenstown directly', desc: 'Creative thinking but wrong timeline. International military assistance requires diplomatic activation through MFAT, a formal government-to-government request, and RAAF mobilisation \u2014 minimum 48-72 hours. People are cold tonight. This is a valid Day 3 option, not a Day 1 answer.', effect: { score: -3 } }
    ]
  },
  { time: 300, type: 'cascade', tag: 'CASCADE', title: 'South Island Power Grid \u2014 Cascade Failure', body: 'Transpower confirms the HVDC link to the North Island has tripped. Major hydro generation on the Waitaki scheme has shut down automatically. Benmore and Tiwai substations reporting damage. Estimated 85% of South Island without power. Restoration timeline unknown \u2014 weeks to months for some areas. Generator fuel is now the critical limiting factor for all response operations, hospital services, and telecommunications.', source: 'Transpower NCC / Orion Energy' },
  { time: 340, type: 'decision', tag: 'CONTROLLER', title: 'Critical Fuel Allocation', body: 'Fuel is now the single most critical resource across the South Island. Lyttelton Port bulk terminals (BP, Mobil, Z Energy) are operational. Christchurch fuel distribution network is intact. But fuel must now serve: hospital generators, telecommunications nodes, helicopter operations, ground transport, water pumping stations, and community heating. Demand vastly exceeds supply.',
    decisionId: 'af8_fuel',
    prompt: 'How do you recommend the National Controller prioritise fuel allocation?',
    options: [
      { key: 'A', label: 'Hospitals and health facilities first, then telecoms, then response operations', desc: 'Life-safety priority. Consistent with SAFER response objectives. But may ground helicopters needed for ongoing evacuations and reconnaissance. Communities with no access remain cut off.', effect: { score: 2 } },
      { key: 'B', label: 'Helicopter operations first \u2014 only access to isolated communities', desc: 'Keeps the response mobile and maintains access to isolated populations. But risks hospital generator failures. Canterbury DHB reports 48 hours of generator fuel remaining. If hospitals lose power, patients die.', effect: { score: -3 } },
      { key: 'C', label: 'Request NCMC activate international fuel supply via Lyttelton Port immediately', desc: 'Long-term solution that triggers international assistance mechanisms. But first shipment is 5-7 days away. Does not solve the immediate gap and the crisis is now.', effect: { score: 1 } },
      { key: 'D', label: 'Implement South Island-wide civilian fuel rationing \u2014 emergency-only sales at all fuel stations', desc: 'Has merit as a Day 3 option but premature on Day 1. Enforcement across the South Island requires coordination with 6 CDEM Groups and every fuel retailer. Rationing announcements trigger panic buying. The immediate priority is directing existing supply to response operations, not managing civilian consumption.', effect: { score: -2 } }
    ]
  },
  { time: 390, type: 'inject', tag: 'AFTERSHOCK', title: 'M5.9 Aftershock \u2014 Southern Lakes', body: 'A magnitude 5.9 aftershock near Queenstown. Further structural damage reported in an already compromised district. Queenstown Hospital reports the main building is now unsafe \u2014 patients being moved to temporary triage in the car park. Access road to Glenorchy has been severed by a new landslide. An additional 800 people are now isolated.', source: 'GeoNet / Otago CDEM Group', aftershock: true },
  { time: 420, type: 'info', tag: 'CIMS', title: 'State of National Emergency Declared', body: 'The Minister of Civil Defence has declared a state of national emergency for all South Island CDEM Group areas effective immediately. National Controller now directs the overall response. CDEM Group Controllers retain their powers and responsibilities within the priorities and direction set by the National Controller. NCMC International Assistance Function has been activated. Australia, Singapore, and Japan have offered USAR teams.', source: 'NCMC \u2014 Official Declaration' },
  { time: 460, type: 'inject', tag: 'IMPACT', title: 'West Coast Communities \u2014 First Contact', body: 'NZDF P-3 Orion reconnaissance overflight of the West Coast confirms: Greymouth CBD has significant structural damage. Hokitika airport unusable. Franz Josef community status depends on your earlier decision. Haast is isolated with approximately 200 people. Multiple communities between Greymouth and Hokitika have no contact. Estimated 33,000 people across the West Coast need support.', source: 'NZDF \u2014 Aerial Reconnaissance' },
  { time: 500, type: 'decision', tag: 'CONTROLLER', title: 'Reconnaissance Coordination', body: 'Per SAFER Framework Section 3.6.2, full initial regional-scale reconnaissance must be completed within 48 hours. You are at H+8:20. Ground reconnaissance is impossible due to road damage. Air reconnaissance is limited by helicopter availability, fuel, and approaching darkness. NZDF has offered a second P-3 Orion sortie at first light.',
    decisionId: 'af8_recon',
    prompt: 'How do you coordinate the reconnaissance effort?',
    options: [
      { key: 'A', label: 'Focus remaining daylight on communities with zero contact', desc: 'Prioritises life safety for the most vulnerable. Consistent with SAFER recon priorities. But burns helicopter fuel and leaves infrastructure assessment for tomorrow.', effect: { score: 3, helicopters: -2 } },
      { key: 'B', label: 'Prioritise infrastructure reconnaissance \u2014 roads, bridges, airports', desc: 'Enables planning for ground access restoration. Critical for sustained response logistics. But communities without contact remain in the dark for another 12+ hours.', effect: { score: -2 } },
      { key: 'C', label: 'Split assets \u2014 half on community contact, half on infrastructure', desc: 'Balanced but spreads thin resources thinner. May not achieve either objective adequately before dark.', effect: { score: 0, helicopters: -1 } }
    ]
  },
  { time: 550, type: 'cascade', tag: 'CASCADE', title: 'West Coast Hospital Crisis', body: 'Grey Base Hospital in Greymouth reports generator fuel will be exhausted within 12 hours. The hospital has 34 critical patients including 8 on ventilators. Road access from Christchurch is severed. The only resupply option is helicopter fuel delivery \u2014 but each fuel sling-load uses helicopter fuel to deliver helicopter fuel. Medical staff are requesting permission to begin triage protocols for ventilator patients in case of power failure.', source: 'West Coast DHB / Grey Base Hospital' },
  { time: 590, type: 'decision', tag: 'CONTROLLER', title: 'Grey Base Hospital \u2014 Immediate Response', body: 'Grey Base Hospital has 8 ventilator-dependent patients and 12 hours of generator fuel. A helicopter fuel delivery requires a minimum 2-hour round trip from Christchurch and uses significant fuel itself. Medical evacuation of 8 ventilator patients by helicopter would require 4 dedicated flights with medical crews. Or you can attempt both \u2014 fuel delivery AND patient preparation for evacuation if power fails.',
    decisionId: 'af8_hospital',
    prompt: 'How do you address the Grey Base Hospital crisis?',
    options: [
      { key: 'A', label: 'Emergency fuel delivery by helicopter \u2014 keep the hospital running', desc: 'Maintains hospital operations but uses precious helicopter capacity and fuel to deliver fuel. If the delivery is delayed by weather or mechanical issues, the window closes.', effect: { score: 2, helicopters: -1 } },
      { key: 'B', label: 'Medical evacuation \u2014 move ventilator patients to Christchurch Hospital', desc: 'Removes patients from risk but 4 helicopter flights for 8 ventilator patients is a massive resource commitment. Transport of ventilator patients is high-risk. Christchurch Hospital is already at surge capacity.', effect: { score: 1, helicopters: -2 }, locked: function(log) { return log.af8_franz_josef === 'A' ? 'Insufficient helicopter capacity \u2014 fleet exhausted from the Franz Josef full evacuation' : false; } },
      { key: 'C', label: 'Both \u2014 immediate fuel delivery to buy time, prepare evacuation as contingency', desc: 'Belt and suspenders. Fuel delivery keeps the lights on while evacuation is prepared as backup. Resource-intensive but protects against single-point failure.', effect: { score: 4, helicopters: -2 } },
      { key: 'D', label: 'Request Medical Officer of Health invoke compulsory triage \u2014 disconnect non-survivable ventilator patients to preserve power for those with better prognosis', desc: 'An ethical abyss. Compulsory triage of ventilator patients is a last resort that requires clinical assessment by senior medical staff, not a Controller directive. Making this call from an EOC 300km away without clinical information is both ethically wrong and legally indefensible. The Controller\u2019s job is to solve the fuel problem, not to decide who lives.', effect: { score: -8 } }
    ]
  },
  { time: 640, type: 'inject', tag: 'WELFARE', title: 'Evacuee Numbers Escalating', body: 'Helicopter evacuations from Franz Josef, Haast, and the upper West Coast have brought 400+ people to Christchurch. Queenstown is requesting air evacuation for 2,000+ tourists who cannot be accommodated. International visitors are the largest group. MFAT is overwhelmed with consular requests. Christchurch accommodation is filling rapidly. The scale of mass evacuation is exceeding all planning assumptions.', source: 'MFAT / Canterbury CDEM Group' },
  { time: 680, type: 'decision', tag: 'CONTROLLER', title: 'Mass Evacuation Management', body: 'The evacuation flow is accelerating beyond capacity. Christchurch is receiving hundreds of evacuees daily with no end in sight. Queenstown alone could generate 10,000+ evacuees if air evacuation begins. Your airport, accommodation, welfare registration, and consular support systems are all at or beyond capacity.',
    decisionId: 'af8_evacuation',
    prompt: 'How do you manage the mass evacuation?',
    options: [
      { key: 'A', label: 'Throttle evacuations to match reception capacity \u2014 prioritise medical and vulnerable only', desc: 'Controls the flow. Ensures quality of care for those who arrive. But leaves thousands of people stranded in damaged communities waiting for their turn.', effect: { score: 2 } },
      { key: 'B', label: 'Open the floodgates \u2014 evacuate everyone as fast as possible, sort it out when they arrive', desc: 'Maximises speed of extraction from danger. But overwhelms Christchurch reception systems and creates a secondary crisis at the destination.', effect: { score: -3 } },
      { key: 'C', label: 'Staged approach \u2014 medical/vulnerable by helicopter now, mass evacuation by road/sea once routes reopen', desc: 'Uses the right transport mode for each population. Helicopters for urgent cases, ground/sea for mass movement once routes are assessed. But road reopening timeline is uncertain.', effect: { score: 3 } }
    ]
  },
  { time: 730, type: 'inject', tag: 'IMPACT', title: 'International Assistance Arriving', body: 'First Australian USAR task force (72 personnel) has landed at Christchurch Airport on a C-17 Globemaster. Japanese USAR team en route, ETA 18 hours. Singapore medical team confirmed. MCDEM International Assistance function is coordinating arrivals. All teams need briefing, staging, equipment checks, and transport to deployment areas. The airport is becoming a military staging base alongside ongoing civilian and evacuation operations.', source: 'MFAT / NCMC International Assistance' },
  { time: 780, type: 'decision', tag: 'CONTROLLER', title: 'International USAR Deployment', body: 'You have international USAR teams arriving with world-class capability. They need to be deployed where they can save lives. Greymouth has confirmed structural collapses with trapped persons. Queenstown has a collapsed hotel with an unknown number of guests. Franz Josef status depends on your earlier decisions. Each team needs a CDEM liaison, local intelligence briefing, and helicopter transport to the deployment site.',
    decisionId: 'af8_usar_deploy',
    prompt: 'Where do you deploy the first international USAR team?',
    options: [
      { key: 'A', label: 'Greymouth \u2014 confirmed collapses, largest affected population on the West Coast', desc: 'Highest confirmed need. Greymouth has 13,000 residents and confirmed trapped persons. But helicopter transport is a 3-hour round trip and conditions are unknown.', effect: { score: 3, helicopters: -1 } },
      { key: 'B', label: 'Queenstown \u2014 collapsed hotel, potentially dozens trapped, better infrastructure for operations', desc: 'Queenstown has better surviving infrastructure to support USAR operations. Hotel collapse has high potential casualty count. But Queenstown is further from Christchurch staging.', effect: { score: 1, helicopters: -2 } },
      { key: 'C', label: 'Hold at Christchurch for 12 hours \u2014 wait for complete reconnaissance before committing', desc: 'Ensures deployment to the highest-need site. But 12 hours of waiting is 12 hours of people trapped under rubble. Survivability curves are steep \u2014 every hour matters.', effect: { score: -5 } },
      { key: 'D', label: 'Split the Australian team \u2014 36 to Greymouth, 36 to Queenstown', desc: 'Dilutes a 72-person USAR task force designed to operate as a unit. USAR teams have integrated capabilities \u2014 heavy rescue, technical search, medical \u2014 that require full team strength. Two half-teams are less than half as effective as one full team. The Australian commander will refuse this configuration.', effect: { score: -5 } }
    ]
  },
  { time: 840, type: 'cascade', tag: 'CASCADE', title: 'Weather Deterioration \u2014 Front Approaching', body: 'MetService has issued a severe weather warning for the West Coast and Southern Alps. A cold front bringing heavy rain and snow above 800m is expected within 24 hours. This will ground all helicopter operations for 12-18 hours, trigger flooding in landslide-dammed valleys, create hypothermia risk for unsheltered populations, and make road recovery work impossible. The window for helicopter operations is closing.', source: 'MetService \u2014 Severe Weather Warning' },
  { time: 880, type: 'decision', tag: 'CONTROLLER', title: 'Pre-Weather Window \u2014 Final Helicopter Priorities', body: 'You have approximately 18 hours of flyable weather remaining. After that, all helicopter operations cease for 12-18 hours. Every helicopter sortie in the next 18 hours must count. Competing priorities: USAR deployment, fuel deliveries, medical evacuations, reconnaissance of uncontacted communities, and evacuee extraction.',
    decisionId: 'af8_weather_window',
    prompt: 'How do you prioritise the remaining helicopter window?',
    options: [
      { key: 'A', label: 'All helicopters on evacuation \u2014 get people out before the weather hits', desc: 'Maximises extraction of vulnerable populations before they are stranded in worsening conditions. But halts all other helicopter operations including fuel delivery and USAR deployment.', effect: { score: 1, helicopters: -3 }, locked: function(log) { return log.af8_fuel === 'B' ? 'Christchurch Hospital is in crisis from your fuel decision \u2014 you cannot redirect all helicopters away from emergency fuel delivery' : false; } },
      { key: 'B', label: 'Priority split: 50% evacuation, 30% fuel/supply delivery, 20% USAR transport', desc: 'Balanced approach that maintains all critical operations at reduced capacity. No single priority is fully served but nothing is abandoned entirely.', effect: { score: 3, helicopters: -2 } },
      { key: 'C', label: 'Focus on pre-positioning \u2014 push fuel, supplies, and medical teams to forward bases before weather closes in', desc: 'Strategic thinking. Positions resources where they will be needed during the weather window. Communities can shelter in place if they have supplies. But no new evacuations during the push.', effect: { score: 4, helicopters: -1 } },
      { key: 'D', label: 'Ignore the weather warning and continue helicopter operations \u2014 MetService forecasts are not always accurate', desc: 'Reckless disregard for aviation safety. MetService severe weather warnings are issued on high-confidence forecasts. Helicopter operations in severe turbulence, heavy rain, and low visibility kill pilots and passengers. If you fly and lose a helicopter with a USAR team aboard, you have compounded the disaster. Aviation weather minimums are non-negotiable.', effect: { score: -8 } }
    ]
  },
  { time: 940, type: 'info', tag: 'CIMS', title: 'Recovery Manager Activated', body: 'Per CIMS 3rd Edition, the Recovery Manager has been activated at national level and embedded within NCMC. Initial recovery assessment is beginning alongside the ongoing response. The scale of recovery required is unprecedented in New Zealand history \u2014 estimated $20-40 billion in damages, 5-10 year recovery timeline for the most affected regions. Canterbury\u2019s recovery role as logistics hub may continue for years.', source: 'NCMC Recovery Manager' },
  { time: 990, type: 'decision', tag: 'CONTROLLER', title: 'Day 2 Transition Planning', body: 'You are approaching the end of the first operational period. Staff have been working for 16+ hours. The National Controller is requesting a formal handover plan for the Day 2 operational period. Your intelligence picture is incomplete \u2014 at least 15 communities have still had no contact. Weather is deteriorating. International assistance is scaling up. The response needs to transition from crisis mode to sustained operations.',
    decisionId: 'af8_transition',
    prompt: 'How do you structure the Day 2 transition?',
    options: [
      { key: 'A', label: 'Full staff rotation \u2014 brief incoming team, release Day 1 staff for rest', desc: 'Protects staff welfare and prevents fatigue-driven errors. But incoming team has no operational context and will take hours to reach situational awareness. Decision quality may drop during transition.', effect: { score: 2 } },
      { key: 'B', label: 'Key personnel remain \u2014 Controller, Intelligence, and Logistics stay, rotate everyone else', desc: 'Maintains continuity in critical functions. Key staff are exhausted but their institutional knowledge is irreplaceable on Day 2. Risk of burnout and error for the individuals who stay.', effect: { score: 1 } },
      { key: 'C', label: 'Overlapping shift \u2014 4-hour overlap where Day 1 and Day 2 teams operate together before full handover', desc: 'Best practice for continuity. Day 2 team builds situational awareness while Day 1 team is still present. Resource-intensive (double staffing for 4 hours) but minimises knowledge loss.', effect: { score: 4 } },
      { key: 'D', label: 'Cancel transition \u2014 Day 1 team continues with DHB-provided stimulant support and mandatory 2-hour nap rotations', desc: 'Medically irresponsible and operationally dangerous. Stimulant-sustained decision-making in a crisis environment produces increasingly poor judgment masked by artificial alertness. The evidence from military operations is clear: forced continuation beyond 18-20 hours degrades performance to dangerous levels regardless of chemical intervention.', effect: { score: -7 } }
    ]
  },
  { time: 1050, type: 'info', tag: 'SUCCESS', title: 'End of First Operational Period', body: 'The first operational period of the AF8 response is concluding. Canterbury CDEM Group has coordinated the initial South Island response from JESP. Six CDEM Groups are operating under a state of national emergency. International assistance is arriving and being deployed. Lyttelton Port is the lifeline for the South Island. The decisions made in these first hours will shape the trajectory of what becomes New Zealand\u2019s largest ever emergency response.', source: 'Canterbury CDEM Group Controller' }
];



// ============ GAME FUNCTIONS ============
var eventTimer = null;
var gameInterval = null;
var currentDecision = null;

function getActiveEvents() {
  return GameState.scenario === 'local' ? LOCAL_EVENTS : AF8_EVENTS;
}

function startGame(scenario) {
  GameState.scenario = scenario;
  GameState.eventIndex = 0;
  GameState.decisions = [];
  GameState.choiceLog = {};
  var facToggle = document.getElementById('facilitator-toggle');
  GameState.facilitatorMode = facToggle ? facToggle.checked : false;
  GameState.time = 0;
  currentDecision = null;

  var config = SCENARIO_CONFIGS[scenario];
  GameState.score = config.startScore;
  GameState.classification = config.classification;
  GameState.metrics = JSON.parse(JSON.stringify(config.metrics));

  // Update UI
  document.getElementById('game-logo').textContent = config.label;
  document.getElementById('classification-badge').textContent = config.classText;
  document.getElementById('classification-badge').className = 'classification-badge ' + config.classCSS;

  // Update status bar
  var statusBar = document.getElementById('status-bar-items');
  var statusHTML = '';
  for (var i = 0; i < config.statusBar.length; i++) {
    var s = config.statusBar[i];
    statusHTML += '<div class="status-item"><span class="label">' + s.label + '</span> <span class="value ' + s.cls + '" id="val-' + s.id + '">' + s.value + '</span></div>';
  }
  statusHTML += '<div class="status-item"><span class="label">Effectiveness:</span> <span class="value" id="val-score" style="color:var(--accent-cyan)">' + GameState.score + '%</span></div>';
  statusBar.innerHTML = statusHTML;

  // Initialize utility tracker first (panels will use it)
  initUtilities();

  // Initialize soft metrics
  initSoftMetrics();

  // Configure panels
  if (scenario === 'local') { configureLocalPanels(); } else { configureAF8Panels(); }

  // Render utility meters into resource section
  renderUtilityPanel();

  // Initialize noise pool
  initNoisePool();

  // Facilitator badge
  var facBadge = document.getElementById('facilitator-badge');
  if (facBadge) facBadge.style.display = GameState.facilitatorMode ? 'inline-block' : 'none';

  // Clear feed and decision panel
  document.getElementById('event-feed').innerHTML = '';
  document.getElementById('decision-panel').style.display = 'none';

  // Switch screens
  document.getElementById('title-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');

  processNextEvent();
  gameInterval = setInterval(updateGameClock, 1000);
}

var STATUS_INDICATORS = { good: '\u25CF ', degraded: '\u25B2 ', failed: '\u2716 ', unknown: '\u25CB ' };

function buildSitItems(items) {
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var indicator = STATUS_INDICATORS[items[i].cls] || '';
    html += '<div class="sit-item"><span class="sit-label">' + items[i].label + '</span><span class="sit-value ' + items[i].cls + '">' + indicator + items[i].value + '</span></div>';
  }
  return html;
}

var CASCADE_INDICATORS = { low: '\u2013 ', moderate: '\u25B3 ', high: '\u25B2 ', extreme: '\u26A0 ' };

function buildCascadeItems(items) {
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var c = items[i];
    var indicator = CASCADE_INDICATORS[c.cls] || '';
    html += '<div class="cascade-item"><span class="cascade-icon">' + c.icon + '</span><span class="cascade-name">' + c.name + '</span><span class="cascade-level ' + c.cls + '">' + indicator + c.level + '</span></div>';
  }
  return html;
}

function buildMeterItems(items) {
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var r = items[i];
    html += '<div class="sit-item"><span class="sit-label">' + r.label + '</span><div style="display:flex;align-items:center;gap:6px;"><div class="meter-bar"><div class="meter-fill ' + r.cls + '" style="width:' + r.pct + '%"></div></div><span style="font-size:10px;color:var(--text-muted);font-family:var(--font-body);min-width:28px;">' + r.pct + '%</span></div></div>';
  }
  return html;
}

function configureLocalPanels() {
  document.getElementById('cdem-groups-title').textContent = 'Canterbury Hub Status';
  document.getElementById('cdem-groups').innerHTML = buildSitItems([
    { label: 'JESP Group ECC', value: 'Active', cls: 'good' },
    { label: 'Christchurch AP', value: 'Assessing', cls: 'degraded' },
    { label: 'Lyttelton Port', value: 'Operational', cls: 'good' },
    { label: 'NZDF Burnham', value: 'Mobilising', cls: 'degraded' },
    { label: 'Waimakariri CDEM', value: 'Monitoring', cls: 'good' },
    { label: 'Selwyn CDEM', value: 'Monitoring', cls: 'good' }
  ]);
  document.getElementById('agency-status').innerHTML = buildSitItems([
    { label: 'NZ Police', value: 'Active', cls: 'good' },
    { label: 'FENZ / USAR', value: 'Staging', cls: 'degraded' },
    { label: 'St John', value: 'Active', cls: 'good' },
    { label: 'Canterbury DHB', value: 'Surge Mode', cls: 'degraded' },
    { label: 'MFAT (Consular)', value: 'Activating', cls: 'degraded' },
    { label: 'NCMC', value: 'Directing', cls: 'good' }
  ]);
  document.getElementById('lifelines-section').innerHTML = buildSitItems([
    { label: 'Electricity (Orion)', value: '65% City', cls: 'degraded' },
    { label: 'Telecoms', value: 'Congested', cls: 'degraded' },
    { label: 'Water Supply', value: 'Partial Depress.', cls: 'degraded' },
    { label: 'Wastewater', value: 'Compromised (E)', cls: 'degraded' },
    { label: 'Fuel (Lyttelton)', value: 'SI Hub', cls: 'good' },
    { label: 'FMCG', value: 'Available', cls: 'good' }
  ]);
  document.getElementById('transport-section').innerHTML = buildSitItems([
    { label: 'Christchurch AP', value: 'Assessing', cls: 'degraded' },
    { label: 'Lyttelton Port', value: 'Operational', cls: 'good' },
    { label: 'SH1 North', value: 'Open', cls: 'good' },
    { label: 'SH1 South', value: 'Open', cls: 'good' },
    { label: 'SH73 (West)', value: 'Blocked', cls: 'failed' },
    { label: 'Eastern Roads', value: 'Liq. Damage', cls: 'degraded' },
    { label: 'CBD Access', value: 'Restricted', cls: 'degraded' },
    { label: 'Bus Network', value: 'Disrupted', cls: 'degraded' },
    { label: 'Rail', value: 'Suspended', cls: 'failed' }
  ]);
  document.getElementById('cascade-tracker').innerHTML = buildCascadeItems([
    { icon: '\uD83D\uDD01', name: 'Aftershocks', level: 'High', cls: 'high' },
    { icon: '\uD83D\uDCA7', name: 'Liquefaction (East)', level: 'Moderate', cls: 'moderate' },
    { icon: '\u26F0\uFE0F', name: 'Rockfall (minor)', level: 'Low', cls: 'low' },
    { icon: '\uD83D\uDE93', name: 'Traffic Congestion', level: 'High', cls: 'high' },
    { icon: '\uD83E\uDDE0', name: 'CES Trauma Reactivation', level: 'High', cls: 'high' },
    { icon: '\u26FD', name: 'Fuel Demand Surge', level: 'Extreme', cls: 'extreme' },
    { icon: '\uD83C\uDFE8', name: 'Accommodation Crisis', level: 'High', cls: 'high' }
  ]);
  // Resources section is populated by renderUtilityPanel()
}

function configureAF8Panels() {
  document.getElementById('cdem-groups-title').textContent = 'CDEM Group Status';
  document.getElementById('cdem-groups').innerHTML = buildSitItems([
    { label: 'Canterbury', value: 'ECC Active', cls: 'good' },
    { label: 'West Coast', value: 'Isolated', cls: 'failed' },
    { label: 'Otago', value: 'Partial', cls: 'degraded' },
    { label: 'Southland', value: 'ECC Active', cls: 'good' },
    { label: 'Nelson-Tasman', value: 'Partial', cls: 'degraded' },
    { label: 'Marlborough', value: 'ECC Active', cls: 'good' }
  ]);
  document.getElementById('agency-status').innerHTML = buildSitItems([
    { label: 'NZ Police', value: 'Active', cls: 'good' },
    { label: 'FENZ / USAR', value: 'Deploying', cls: 'degraded' },
    { label: 'NZDF', value: 'Mobilising', cls: 'degraded' },
    { label: 'St John', value: 'Active', cls: 'good' },
    { label: 'DHBs', value: 'Stressed', cls: 'degraded' },
    { label: 'NCMC', value: 'Confirming', cls: 'unknown' }
  ]);
  document.getElementById('lifelines-section').innerHTML = buildSitItems([
    { label: 'Electricity', value: 'SI Blackout', cls: 'failed' },
    { label: 'Telecoms', value: 'Severely Degraded', cls: 'failed' },
    { label: 'Water', value: 'Compromised', cls: 'degraded' },
    { label: 'Wastewater', value: 'Failed (WC)', cls: 'failed' },
    { label: 'Fuel', value: 'Limited', cls: 'degraded' },
    { label: 'FMCG', value: 'Disrupted', cls: 'degraded' }
  ]);
  document.getElementById('transport-section').innerHTML = buildSitItems([
    { label: 'Alpine Passes', value: 'Impassable', cls: 'failed' },
    { label: 'SH6 South', value: 'Blocked', cls: 'failed' },
    { label: 'SH1 East Coast', value: 'Disrupted', cls: 'degraded' },
    { label: 'Rail (WC)', value: 'Destroyed', cls: 'failed' },
    { label: 'Christchurch AP', value: 'Assessing', cls: 'degraded' },
    { label: 'Queenstown AP', value: 'Assessing', cls: 'degraded' },
    { label: 'Hokitika AP', value: 'Damaged', cls: 'failed' },
    { label: 'Lyttelton Port', value: 'Operational', cls: 'good' },
    { label: 'Greymouth Port', value: 'Destroyed', cls: 'failed' }
  ]);
  document.getElementById('cascade-tracker').innerHTML = buildCascadeItems([
    { icon: '\uD83D\uDD01', name: 'Aftershocks', level: 'Extreme', cls: 'extreme' },
    { icon: '\u26F0\uFE0F', name: 'Landslide Dams', level: 'High', cls: 'high' },
    { icon: '\uD83C\uDF0A', name: 'Lake Tsunami', level: 'Moderate', cls: 'moderate' },
    { icon: '\uD83D\uDCA7', name: 'Liquefaction', level: 'High', cls: 'high' },
    { icon: '\uD83C\uDF27\uFE0F', name: 'Weather Risk', level: 'Moderate', cls: 'moderate' },
    { icon: '\uD83C\uDFD7\uFE0F', name: 'Structural Collapse', level: 'High', cls: 'high' }
  ]);
  // Resources section is populated by renderUtilityPanel()
}

function updateGameClock() {
  GameState.time += 0.5;
  var hours = Math.floor(GameState.time / 60);
  var mins = Math.floor(GameState.time % 60);
  document.getElementById('game-time').textContent =
    'H+' + String(hours).padStart(2,'0') + ':' + String(mins).padStart(2,'0');
  if (GameState.time < 90) {
    document.getElementById('game-phase').textContent = 'IMMEDIATE RESPONSE';
  } else if (GameState.time < 360) {
    document.getElementById('game-phase').textContent = 'DAY 1 OPERATIONS';
  } else {
    document.getElementById('game-phase').textContent = 'SUSTAINED RESPONSE';
  }
}

function processNextEvent() {
  var events = getActiveEvents();
  if (GameState.eventIndex >= events.length) { showDebrief(); return; }

  var event = events[GameState.eventIndex];
  var prevTime = GameState.eventIndex > 0 ? events[GameState.eventIndex - 1].time : 0;
  var delay = GameState.eventIndex === 0 ? 1000 : Math.max(2000, (event.time - prevTime) * 200);

  eventTimer = setTimeout(function() {
    GameState.time = event.time;
    updateGameClock();
    if (event.aftershock) triggerAftershock();
    addEventToFeed(event);
    if (event.type === 'decision') {
      showDecision(event);
    } else {
      GameState.eventIndex++;
      // Check for noise inject
      if (shouldInjectNoise()) {
        var noise = getNextNoise();
        if (noise && noise.options) {
          eventTimer = setTimeout(function() {
            // Show noise as a decision event
            noise.time = GameState.time;
            noise.type = 'decision';
            noise.isNoise = true;
            addEventToFeed({
              time: noise.time,
              type: 'inject',
              tag: noise.tag || 'NOISE',
              title: noise.title,
              body: noise.body,
              source: noise.source
            });
            showDecision(noise);
          }, 1500);
          return;
        }
      }
      processNextEvent();
    }
  }, delay);
}

function addEventToFeed(event) {
  var feed = document.getElementById('event-feed');
  var hours = Math.floor(event.time / 60);
  var mins = event.time % 60;
  var entry = document.createElement('div');
  entry.className = 'event-entry';
  var tagClass = event.type;
  if (event.type === 'info' && event.tag === 'SUCCESS') tagClass = 'success';
  if (event.tag === 'NOISE') tagClass = 'noise';
  if (event.tag === 'PIM') tagClass = 'info';
  entry.innerHTML =
    '<div class="event-timestamp">H+' + String(hours).padStart(2,'0') + ':' + String(mins).padStart(2,'0') + ' \u2014 ' + getPhaseLabel(event.time) + '</div>' +
    '<div class="event-card ' + event.type + '">' +
      '<span class="event-tag ' + tagClass + '">' + event.tag + '</span>' +
      '<div class="event-title">' + event.title + '</div>' +
      '<div class="event-body">' + event.body + '</div>' +
      (event.source ? '<div class="event-source">Source: ' + event.source + '</div>' : '') +
    '</div>';
  feed.appendChild(entry);
  feed.scrollTop = feed.scrollHeight;
}

function getPhaseLabel(time) {
  if (time < 30) return 'Immediate Response';
  if (time < 120) return 'First Operational Period';
  if (time < 360) return 'Day 1';
  return 'Day 2+';
}

function showDecision(event) {
  currentDecision = event;
  var panel = document.getElementById('decision-panel');
  var prompt = document.getElementById('decision-prompt');
  var options = document.getElementById('decision-options');
  panel.style.display = 'block';
  prompt.textContent = '\u26A1 ' + event.prompt;
  var html = '';
  for (var i = 0; i < event.options.length; i++) {
    var opt = event.options[i];
    var locked = opt.locked && opt.locked(GameState.choiceLog);
    if (locked) {
      html += '<button class="decision-btn" disabled style="opacity:0.4;cursor:not-allowed;border-color:var(--accent-red);">' +
        '<span class="opt-key" style="background:rgba(240,98,146,0.15);color:var(--accent-red);">' + opt.key + '</span>' +
        '<div class="opt-text"><div class="opt-label" style="text-decoration:line-through;color:var(--text-muted);">' + opt.label + '</div>' +
        '<div style="font-size:11px;color:var(--accent-red);margin-top:4px;">' + (typeof locked === 'string' ? locked : 'Unavailable due to prior decisions') + '</div>' +
        '</div></button>';
    } else {
      html += '<button class="decision-btn" onclick="makeDecision(\'' + opt.key + '\')">' +
        '<span class="opt-key">' + opt.key + '</span>' +
        '<div class="opt-text"><div class="opt-label">' + opt.label + '</div>' +
        '</div></button>';
    }
  }

  // Facilitator notes
  if (GameState.facilitatorMode) {
    var decId = event.decisionId || '';
    var notes = FACILITATOR_NOTES[decId];
    if (notes) {
      html += '<div style="margin-top:12px;border-top:1px solid var(--border);padding-top:12px;">' +
        '<button onclick="toggleFacNotes()" style="background:none;border:1px solid var(--accent-blue);color:var(--accent-blue);padding:4px 12px;border-radius:4px;font-size:11px;cursor:pointer;font-family:var(--font-body);">\uD83D\uDCCB Facilitator Notes</button>' +
        '<div id="fac-notes-panel" style="display:none;margin-top:10px;background:rgba(68,138,255,0.05);border:1px solid rgba(68,138,255,0.15);border-radius:6px;padding:12px;font-size:11px;line-height:1.6;">';

      // Learning objective
      html += '<div style="margin-bottom:10px;"><span style="color:var(--accent-blue);font-weight:600;">Learning Objective:</span> <span style="color:var(--text-primary);">' + notes.learningObjective + '</span></div>';

      // Teaching note and best practice revealed in debrief only

      // References
      html += '<div style="margin-bottom:10px;"><span style="color:var(--accent-blue);font-weight:600;">References:</span><div style="margin-top:4px;">';
      for (var r = 0; r < notes.references.length; r++) {
        var ref = notes.references[r];
        html += '<div style="padding:3px 0;color:var(--text-muted);"><span style="color:var(--accent-purple);">\u2022</span> <span style="color:var(--text-secondary);">' + ref.label + '</span> \u2014 ' + ref.desc + '</div>';
      }
      html += '</div></div>';

      // Discussion prompts
      html += '<div><span style="color:var(--accent-blue);font-weight:600;">Discussion Prompts:</span><div style="margin-top:4px;">';
      for (var dp = 0; dp < notes.discussionPrompts.length; dp++) {
        html += '<div style="padding:3px 0;color:var(--text-secondary);"><span style="color:var(--accent-amber);">' + (dp + 1) + '.</span> ' + notes.discussionPrompts[dp] + '</div>';
      }
      html += '</div></div>';

      html += '</div></div>';
    }
  }

  options.innerHTML = html;
}

function toggleFacNotes() {
  var panel = document.getElementById('fac-notes-panel');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function makeDecision(key) {
  if (!currentDecision) return;
  var option = null;
  for (var i = 0; i < currentDecision.options.length; i++) {
    if (currentDecision.options[i].key === key) { option = currentDecision.options[i]; break; }
  }
  if (!option) return;

  // Store choice in log
  var decId = currentDecision.decisionId || currentDecision.title;
  GameState.choiceLog[decId] = key;

  if (option.effect) {
    if (option.effect.score) {
      GameState.score = Math.max(0, Math.min(100, GameState.score + option.effect.score));
      var scoreEl = document.getElementById('val-score');
      if (scoreEl) scoreEl.textContent = GameState.score + '%';
    }
    if (option.effect.helicopters) {
      GameState.metrics.helicoptersAvail = Math.max(0, (GameState.metrics.helicoptersAvail || 0) + option.effect.helicopters);
    }
    if (option.effect.fuel) {
      GameState.metrics.fuelDays = Math.max(0, (GameState.metrics.fuelDays || 0) + option.effect.fuel);
    }
  }

  GameState.decisions.push({ time: currentDecision.time, key: key, label: option.label, desc: option.desc || '', title: currentDecision.title, score: option.effect ? (option.effect.score || 0) : 0, isNoise: currentDecision.isNoise || false });

  var feed = document.getElementById('event-feed');
  var resultEntry = document.createElement('div');
  resultEntry.className = 'event-entry';
  resultEntry.innerHTML =
    '<div class="event-timestamp">DECISION MADE</div>' +
    '<div class="event-card success"><span class="event-tag success">DECISION</span>' +
    '<div class="event-title">Controller Decision: Option ' + key + '</div>' +
    '<div class="event-body">' + option.label + '</div></div>';
  feed.appendChild(resultEntry);
  feed.scrollTop = feed.scrollHeight;

  document.getElementById('decision-panel').style.display = 'none';
  var wasNoise = currentDecision.isNoise;
  currentDecision = null;

  if (wasNoise) {
    // Noise decisions cause small utility shifts based on quality
    var noiseScore = option.effect ? (option.effect.score || 0) : 0;
    if (noiseScore !== 0) {
      var utilKeys = Object.keys(GameState.utilities);
      var randomUtil = utilKeys[Math.floor(Math.random() * utilKeys.length)];
      var noiseDelta = noiseScore > 0 ? Math.floor(Math.random() * 3) + 2 : -(Math.floor(Math.random() * 4) + 3);
      var fakeEffects = {};
      fakeEffects[randomUtil] = noiseDelta;
      UTILITY_EFFECTS['_noise_' + Date.now()] = {};
      UTILITY_EFFECTS['_noise_' + Date.now()][key] = fakeEffects;
      // Apply directly
      GameState.utilities[randomUtil].value = Math.max(0, Math.min(100, GameState.utilities[randomUtil].value + noiseDelta));
      var panel = document.getElementById('resources-section');
      if (panel) {
        var item = panel.querySelector('[data-util="' + randomUtil + '"]');
        if (item) {
          var fill = item.querySelector('.meter-fill');
          var pctSpan = item.querySelector('span[style*="min-width"]');
          var nv = GameState.utilities[randomUtil].value;
          var nc = nv > 60 ? 'green' : (nv > 30 ? 'amber' : 'red');
          var npc = nv > 60 ? 'var(--accent-green)' : (nv > 30 ? 'var(--accent-amber)' : 'var(--accent-red)');
          if (fill) { fill.style.width = nv + '%'; fill.className = 'meter-fill ' + nc; }
          if (pctSpan) { pctSpan.textContent = nv + '%'; pctSpan.style.color = npc; }
          triggerDashAnimation(item, noiseDelta < 0 ? 'down' : 'up');
        }
      }
      // Also shift a random soft metric
      var softKeys = Object.keys(GameState.softMetrics);
      var randomSoft = softKeys[Math.floor(Math.random() * softKeys.length)];
      var softDelta = noiseScore > 0 ? Math.floor(Math.random() * 3) + 2 : -(Math.floor(Math.random() * 4) + 3);
      var oldSoft = GameState.softMetrics[randomSoft].value;
      GameState.softMetrics[randomSoft].value = Math.max(0, Math.min(100, oldSoft + softDelta));
      var softPanel = document.getElementById('soft-metrics');
      if (softPanel) {
        var softItem = softPanel.querySelector('[data-soft="' + randomSoft + '"]');
        if (softItem) {
          var sf = softItem.querySelector('.meter-fill');
          var sp = softItem.querySelector('span[style*="min-width"]');
          var sv = GameState.softMetrics[randomSoft].value;
          var sc = sv > 60 ? 'green' : (sv > 35 ? 'amber' : 'red');
          var spc = sv > 60 ? 'var(--accent-green)' : (sv > 35 ? 'var(--accent-amber)' : 'var(--accent-red)');
          if (sf) { sf.style.width = sv + '%'; sf.className = 'meter-fill ' + sc; }
          if (sp) { sp.textContent = sv; sp.style.color = spc; }
          triggerDashAnimation(softItem, softDelta < 0 ? 'down' : 'up');
        }
      }
    }
    processNextEvent();
  } else {
    // Apply consequences — reactive injects and state changes
    applyConsequences(decId, key);
  }
}

function applyConsequences(decId, key) {
  // Apply utility effects for every decision
  applyUtilityEffects(decId, key);

  // Apply soft metric effects for every decision
  applySoftMetricEffects(decId, key);

  var consequence = CONSEQUENCE_MAP[decId] && CONSEQUENCE_MAP[decId][key];
  if (!consequence) {
    // No consequence, continue normally
    GameState.eventIndex++;
    processNextEvent();
    return;
  }

  // Apply state changes immediately
  if (consequence.stateChange) {
    consequence.stateChange();
  }

  // If there is a reactive inject, show it after a delay then continue
  if (consequence.inject) {
    var inj = consequence.inject;
    eventTimer = setTimeout(function() {
      GameState.time += 5;
      updateGameClock();
      if (inj.aftershock) triggerAftershock();
      addEventToFeed({
        time: GameState.time,
        type: inj.type || 'inject',
        tag: inj.tag || 'CONSEQUENCE',
        title: inj.title,
        body: inj.body,
        source: inj.source
      });
      // Score penalty from the inject itself
      if (inj.scorePenalty) {
        GameState.score = Math.max(0, GameState.score + inj.scorePenalty);
        var scoreEl = document.getElementById('val-score');
        if (scoreEl) scoreEl.textContent = GameState.score + '%';
      }
      GameState.eventIndex++;
      processNextEvent();
    }, 3000);
  } else {
    GameState.eventIndex++;
    processNextEvent();
  }
}

// ============ CONSEQUENCE MAP ============
var CONSEQUENCE_MAP = {
  'airport_priority': {
    'B': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Airspace Near-Miss \u2014 C-17 vs Domestic Flight',
        body: 'Airways NZ reports a serious airspace incident: an incoming RNZAF C-17 Globemaster carrying USAR equipment was forced into an emergency go-around after an Air New Zealand domestic A320 entered the approach path on a conflicting clearance. No collision but separation was well below minimums. Airways is demanding immediate airspace restrictions. The airport is now CLOSED while procedures are revised. Your full-reopening decision has cost you at least 4 hours of critical response logistics capacity.',
        source: 'Airways NZ / CAA \u2014 Mandatory Incident Report',
        scorePenalty: -5
      },
      stateChange: function() {
        updatePanelItem('transport-section', 'Christchurch AP', 'CLOSED', 'failed');
        updateUtilityDirect('transport', 10);
        GameState.metrics.airportClosed = true;
      }
    },
    'A': {
      stateChange: function() {
        updatePanelItem('transport-section', 'Christchurch AP', 'Emergency Ops', 'good');
        updateUtilityDirect('transport', 70);
      }
    },
    'C': {
      stateChange: function() {
        updatePanelItem('transport-section', 'Christchurch AP', 'Phased Open', 'degraded');
      }
    }
  },
  'fuel_priority': {
    'A': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'West Coast Fuel Crisis \u2014 Hospitals on Reserve',
        body: 'Grey Base Hospital reports generator fuel will be exhausted within 6 hours. Your decision to prioritise Canterbury local fuel has delayed tanker staging for the West Coast. The Group Controller is furious \u2014 Canterbury has power to 65% of the city and functioning fuel stations. Grey Base has 34 critical patients on life support. NCMC is being asked to override your allocation decision.',
        source: 'West Coast CDEM Group / NCMC',
        scorePenalty: -5
      },
      stateChange: function() {
      }
    },
    'B': {
      stateChange: function() {
      }
    }
  },
  'nzdf_staging': {
    'B': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Military Convoy Blocks Lyttelton Tunnel \u2014 4 Hour Delay',
        body: 'An uncoordinated NZDF heavy vehicle convoy (8 trucks, 2 fuel tankers, recovery vehicle) has entered the Lyttelton Tunnel from the city side at the same time as a civilian fuel tanker was exiting. The tunnel is now completely blocked. Recovery operations will take an estimated 4 hours. All fuel distribution from Lyttelton Port is suspended. Your decision to let NZDF self-coordinate has directly caused this \u2014 a CDEM liaison at JESP would have deconflicted the movement.',
        source: 'NZTA / Lyttelton Port Company',
        scorePenalty: -6
      },
      stateChange: function() {
        updatePanelItem('transport-section', 'Lyttelton Port', 'Tunnel Blocked', 'failed');
        updateCascadeItem('cascade-tracker', 'Traffic Congestion', 'Extreme', 'extreme');
        updateUtilityDirect('fuel', 15);
        updateUtilityDirect('transport', 15);
        GameState.metrics.tunnelBlocked = true;
      }
    },
    'A': {
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'Traffic Congestion', 'Moderate', 'moderate');
        updateUtilityDirect('transport', 60);
      }
    }
  },
  'welfare_split': {
    'A': {
      inject: {
        type: 'inject', tag: 'CONSEQUENCE',
        title: 'Eastern Suburbs Community Anger \u2014 "Abandoned Again"',
        body: 'Community leaders in Aranui and Bexley have gone to local media claiming CCC has "abandoned the eastern suburbs again, just like after the earthquakes." Social media is erupting. Nga Hau e Wha Marae reports they are overwhelmed without CCC welfare support. A spontaneous protest is forming at the Hereford Street CCC building. The Mayor\u2019s office is calling the EOC demanding an explanation for why local residents are being deprioritised.',
        source: 'Local Media / Community Leaders / Mayor\u2019s Office',
        scorePenalty: -4
      },
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'CES Trauma Reactivation', 'Extreme', 'extreme');
      }
    },
    'C': {
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'CES Trauma Reactivation', 'Moderate', 'moderate');
      }
    }
  },
  'movement_control': {
    'B': {
      inject: {
        type: 'inject', tag: 'CONSEQUENCE',
        title: 'Community Backlash \u2014 Residents Blockade Checkpoint',
        body: 'Residents near Christchurch Airport have blockaded a Police movement control checkpoint on Memorial Avenue. Approximately 200 people are refusing to disperse, arguing that their homes have minor damage and movement control is disproportionate. A local business owner has called a TV crew. NZ Police are requesting guidance \u2014 they do not want to use force on earthquake-affected residents for a traffic management issue. The checkpoint is blocking response vehicle access to the airport.',
        source: 'NZ Police Canterbury / Local Media',
        scorePenalty: -4
      },
      stateChange: function() {
      }
    },
    'C': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Response Convoy Gridlock \u2014 USAR Team Delayed 5 Hours',
        body: 'The Australian USAR task force convoy from the airport to Burnham Camp staging area has been stuck in traffic for 5 hours. 72 highly trained rescuers and their equipment are sitting on the Northern Motorway while West Coast communities wait. The USAR team leader has contacted NCMC directly to complain. Voluntary compliance with PIM messaging has failed \u2014 normal commuter traffic is treating the roads as usual.',
        source: 'Australian USAR TF1 / NCMC',
        scorePenalty: -3
      },
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'Traffic Congestion', 'Extreme', 'extreme');
      }
    },
    'A': {
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'Traffic Congestion', 'Low', 'low');
      }
    }
  },
  'accommodation': {
    'B': {
      inject: {
        type: 'inject', tag: 'CONSEQUENCE',
        title: 'Showgrounds Conditions \u2014 Health Concerns',
        body: 'After 18 hours of operation, conditions at the A&P Showgrounds mass accommodation are deteriorating. Inadequate sanitation, no hot water, and insufficient bedding. Canterbury PHU is reporting concerns about communicable disease risk. International evacuees are posting images on social media comparing it to a refugee camp. The German consulate has formally complained to MFAT. Two elderly evacuees have been hospitalised with hypothermia overnight.',
        source: 'Canterbury PHU / MFAT / German Consulate',
        scorePenalty: -5
      },
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'Accommodation Crisis', 'Extreme', 'extreme');
      }
    },
    'C': {
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'Accommodation Crisis', 'Moderate', 'moderate');
      }
    }
  },
  'water_response': {
    'A': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'West Coast Water Emergency \u2014 Gastroenteritis Outbreak',
        body: 'Isolated West Coast communities that received only 2 of the 6 available tankers have exhausted their potable water. Reports of residents drinking from contaminated streams. Canterbury PHU is now receiving reports of gastroenteritis in Hokitika. The Medical Officer of Health is blaming the slow water logistics response. Your decision to retain 4 tankers locally \u2014 where residents can boil tap water \u2014 has contributed to a preventable public health crisis.',
        source: 'Canterbury PHU / West Coast DHB',
        scorePenalty: -5
      },
      stateChange: function() {
      }
    }
  },
  'psychosocial': {
    'B': {
      inject: {
        type: 'inject', tag: 'CONSEQUENCE',
        title: 'PIM Messaging Backlash \u2014 "Don\u2019t Tell Us How to Feel"',
        body: 'The PIM campaign comparing Canterbury\u2019s moderate damage to CES levels has backfired. Community leaders are accusing CCC of minimising their experience. A viral social media post reads: "CCC says this isn\u2019t 2011. Tell that to the 80-year-old in Bexley crying in her silt-filled kitchen." The messaging has been perceived as dismissive rather than reassuring. Mental health presentations have increased, not decreased.',
        source: 'Social Media / Community Leaders / Canterbury DHB',
        scorePenalty: -3
      },
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'CES Trauma Reactivation', 'Extreme', 'extreme');
      }
    }
  },
  // ============ AF8 REGIONAL CONSEQUENCES ============
  'af8_declaration': {
    'B': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Response Paralysis \u2014 No Emergency Powers',
        body: 'While you waited for the national declaration, critical hours have passed without emergency powers. A fuel station owner in Ashburton is refusing to release diesel reserves for response vehicles without a formal requisition order. A property owner is blocking access to a staging area near the airport. NZ Police report they cannot establish cordons or movement control without a declaration in effect. The Group Controller is asking why Canterbury is the only South Island CDEM Group that has not declared.',
        source: 'NZ Police / Group Controller / NCMC',
        scorePenalty: -5
      },
      stateChange: function() {
        updatePanelItem('agency-status', 'NZ Police', 'Limited Powers', 'degraded');
      }
    }
  },
  'af8_franz_josef': {
    'A': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Helicopter Fleet Exhaustion \u2014 No Capacity Remaining',
        body: 'You committed all available helicopters to Franz Josef evacuation. The operation was successful \u2014 1,400 people extracted. But your helicopter fleet is now grounded for maintenance and refuelling. Queenstown Hospital has just reported a critical patient needing air evacuation. A landslide has trapped a DoC work crew in Arthurs Pass. GNS Science needs an urgent overflight of a new landslide dam forming on the Buller River. You have zero rotary capacity to respond to any of these.',
        source: 'Helicopter Operations / Multiple Agencies',
        scorePenalty: -4
      },
      stateChange: function() {
        updateUtilityDirect('fuel', 10);
        updateUtilityDirect('transport', 15);
      }
    },
    'B': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Franz Josef \u2014 PIM Broadcast Failed to Reach Community',
        body: 'Your PIM broadcast directing Franz Josef to self-evacuate to high ground was transmitted via satellite to the West Coast emergency frequency. However, power is out in Franz Josef and most residents had no access to radio. Only 200 of 1,500 people received the message. The remainder are still in the township. The Waiho River landslide dam is now visibly overtopping. GNS Science estimates dam break within 2-4 hours. You need to mount an emergency helicopter evacuation anyway \u2014 but you have lost critical time.',
        source: 'GNS Science / West Coast CDEM',
        scorePenalty: -7
      },
      stateChange: function() {
        updateCascadeItem('cascade-tracker', 'Landslide Dams', 'CRITICAL', 'extreme');
        updateUtilityDirect('shelter', 10);
      }
    }
  },
  'af8_telecoms': {
    'A': {
      inject: {
        type: 'inject', tag: 'CONSEQUENCE',
        title: 'West Coast Coordination Collapse',
        body: 'Your Canterbury-to-NCMC satellite link is solid. Wellington knows exactly what Canterbury knows. But West Coast CDEM Group has had no meaningful contact with their paired support region for 6 hours. Without coordination, Canterbury logistics staff have staged supplies at Christchurch Airport with no plan for where they go next. West Coast ECC has independently requested assistance from Nelson-Tasman, who are already overstretched supporting Buller. The response is fragmenting because you prioritised talking to Wellington over talking to the people you are supposed to be helping.',
        source: 'West Coast CDEM / Nelson-Tasman CDEM',
        scorePenalty: -4
      },
      stateChange: function() {
        updatePanelItem('cdem-groups', 'West Coast', 'No Comms', 'failed');
      }
    }
  },
  'af8_queenstown': {
    'C': {
      inject: {
        type: 'inject', tag: 'CONSEQUENCE',
        title: 'Queenstown \u2014 Hypothermia Deaths Overnight',
        body: 'Your decision to wait for the airport assessment has had fatal consequences. Queenstown Airport assessment found the runway unusable \u2014 lateral spreading damage requires heavy equipment repair. Meanwhile, overnight temperatures dropped to -1\u00B0C. Canterbury DHB is now receiving reports via HF radio that 3 elderly tourists have died of hypothermia in a damaged hotel with no heating. 14 others are hospitalised with severe hypothermia. The "no regrets" rapid relief approach exists precisely to prevent this outcome.',
        source: 'Otago CDEM / Canterbury DHB / Coronial Services',
        scorePenalty: -8
      },
      stateChange: function() {
        updatePanelItem('cdem-groups', 'Otago', 'Crisis', 'failed');
        updateCascadeItem('cascade-tracker', 'Weather Risk', 'Extreme', 'extreme');
        updateUtilityDirect('shelter', 5);
      }
    }
  },
  'af8_fuel': {
    'B': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Canterbury Hospital Generator Failure',
        body: 'Christchurch Hospital\u2019s emergency generator has run out of fuel. The hospital is on battery backup for critical systems only \u2014 estimated 45 minutes of power. 12 patients on ventilators are at immediate risk. Your decision to prioritise helicopter fuel over hospital generators has created a life-threatening situation in your own city. Canterbury DHB is activating mass casualty protocols. St John is preparing for emergency patient transfers to Burwood Hospital, which still has generator fuel \u2014 for now.',
        source: 'Canterbury DHB / Christchurch Hospital',
        scorePenalty: -7
      },
      stateChange: function() {
        updatePanelItem('agency-status', 'DHBs', 'CRITICAL', 'failed');
        updateUtilityDirect('power', 5);
        updateUtilityDirect('fuel', 10);
      }
    }
  },
  'af8_usar_deploy': {
    'C': {
      inject: {
        type: 'inject', tag: 'CONSEQUENCE',
        title: 'USAR Team Frustrated \u2014 "We Came Here to Save Lives"',
        body: 'The Australian USAR task force commander has formally complained to NCMC. His team of 72 specialist rescuers has been sitting at Christchurch Airport for 12 hours while confirmed trapped persons wait under rubble in Greymouth and Queenstown. "Every hour we sit here, the survival probability drops," he told a press conference he called without PIM authorisation. International media are running the story. The delay is being compared unfavourably to the 2011 Christchurch response where international teams were deployed within hours of arrival.',
        source: 'Australian USAR TF1 / International Media',
        scorePenalty: -5
      },
      stateChange: function() {
      }
    }
  },
  'af8_evacuation': {
    'B': {
      inject: {
        type: 'cascade', tag: 'CONSEQUENCE',
        title: 'Christchurch Reception Systems Overwhelmed',
        body: 'Your "open floodgates" evacuation approach has overwhelmed Christchurch. 800 evacuees arrived in 6 hours with no coordination. The airport terminal is being used as a de facto shelter. Welfare registration has collapsed \u2014 MFAT cannot track which international visitors have arrived and which are still in affected areas. Families overseas are calling the consulates desperately. Two unaccompanied children have been separated from their parents and nobody has a record of where they are.',
        source: 'MFAT / NZ Police / Welfare Function',
        scorePenalty: -5
      },
      stateChange: function() {
      }
    }
  }
};

// ============ LOCKED OPTIONS FOR AF8 ============
// These are applied via the locked functions on specific options

// ============ PANEL UPDATE HELPERS ============
function triggerDashAnimation(el, direction) {
  // Remove any existing animation class
  el.classList.remove('dash-changed', 'dash-changed-down', 'dash-changed-up');
  // Force reflow to restart animation
  void el.offsetWidth;
  var cls = direction === 'down' ? 'dash-changed-down' : (direction === 'up' ? 'dash-changed-up' : 'dash-changed');
  el.classList.add(cls);
  setTimeout(function() { el.classList.remove(cls); el.style.borderLeftColor = 'transparent'; }, 3000);
}

function updatePanelItem(panelId, label, newValue, newCls) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  var items = panel.querySelectorAll('.sit-item');
  for (var i = 0; i < items.length; i++) {
    var lbl = items[i].querySelector('.sit-label');
    if (lbl && lbl.textContent === label) {
      var val = items[i].querySelector('.sit-value');
      if (val) {
        // Determine direction
        var oldCls = val.className;
        var direction = (newCls === 'failed') ? 'down' : (newCls === 'good' ? 'up' : 'down');
        if (oldCls.indexOf('failed') > -1 && newCls !== 'failed') direction = 'up';

        var indicator = STATUS_INDICATORS[newCls] || '';
        val.textContent = indicator + newValue;
        val.className = 'sit-value ' + newCls + ' value-flash';
        setTimeout(function(v) { return function() { v.classList.remove('value-flash'); }; }(val), 500);

        triggerDashAnimation(items[i], direction);
      }
      break;
    }
  }
}

function updateMeterItem(panelId, label, newPct, newCls) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  var items = panel.querySelectorAll('.sit-item');
  for (var i = 0; i < items.length; i++) {
    var lbl = items[i].querySelector('.sit-label');
    if (lbl && lbl.textContent === label) {
      var fill = items[i].querySelector('.meter-fill');
      if (fill) {
        var oldWidth = parseFloat(fill.style.width) || 50;
        var direction = newPct < oldWidth ? 'down' : 'up';

        fill.style.width = newPct + '%';
        fill.className = 'meter-fill ' + newCls;

        // Update the percentage text if present
        var pctText = items[i].querySelector('span[style*="min-width"]');
        if (pctText) {
          pctText.textContent = newPct + '%';
          pctText.style.color = newCls === 'red' ? 'var(--accent-red)' : (newCls === 'amber' ? 'var(--accent-amber)' : 'var(--accent-green)');
        }

        triggerDashAnimation(items[i], direction);
      }
      break;
    }
  }
}

function updateCascadeItem(trackerId, name, newLevel, newCls) {
  var tracker = document.getElementById(trackerId);
  if (!tracker) return;
  var items = tracker.querySelectorAll('.cascade-item');
  for (var i = 0; i < items.length; i++) {
    var nameEl = items[i].querySelector('.cascade-name');
    if (nameEl && nameEl.textContent === name) {
      var lvl = items[i].querySelector('.cascade-level');
      if (lvl) {
        var indicator = CASCADE_INDICATORS[newCls] || '';
        lvl.textContent = indicator + newLevel;
        lvl.className = 'cascade-level ' + newCls;

        // Cascade-specific pulse
        items[i].classList.remove('cascade-changed');
        void items[i].offsetWidth;
        items[i].classList.add('cascade-changed');
        items[i].style.borderColor = (newCls === 'extreme') ? 'var(--accent-red)' : 'var(--accent-amber)';
        setTimeout(function(el) { return function() {
          el.classList.remove('cascade-changed');
          el.style.borderColor = '';
        }; }(items[i]), 2500);
      }
      break;
    }
  }
}

function triggerAftershock() {
  var flash = document.createElement('div');
  flash.className = 'aftershock-flash';
  document.body.appendChild(flash);
  setTimeout(function() { flash.remove(); }, 1500);
  document.getElementById('game-screen').classList.add('shake');
  setTimeout(function() { document.getElementById('game-screen').classList.remove('shake'); }, 600);
}

function triggerSBT() {
  document.getElementById('sbt-overlay').style.display = 'flex';
  clearTimeout(eventTimer);
  clearInterval(gameInterval);
}

function closeSBT() {
  document.getElementById('sbt-overlay').style.display = 'none';
  gameInterval = setInterval(updateGameClock, 1000);
  if (GameState.eventIndex < getActiveEvents().length && !currentDecision) {
    processNextEvent();
  }
}

function showDebrief() {
  clearInterval(gameInterval);
  clearTimeout(eventTimer);

  var scenarioName = GameState.scenario === 'local' ? 'AF8 \u2014 Canterbury Local Response' : 'AF8 \u2014 South Island Regional Response';
  var totalDecisions = GameState.decisions.length;
  var goodDecisions = 0;
  var poorDecisions = 0;
  for (var i = 0; i < GameState.decisions.length; i++) {
    if (GameState.decisions[i].score > 4) goodDecisions++;
    if (GameState.decisions[i].score < 0) poorDecisions++;
  }

  var grade = 'F';
  if (GameState.score >= 35) grade = 'D';
  if (GameState.score >= 85) grade = 'A';
  else if (GameState.score >= 75) grade = 'B+';
  else if (GameState.score >= 65) grade = 'B';
  else if (GameState.score >= 55) grade = 'C+';
  else if (GameState.score >= 45) grade = 'C';

  // Decision log
  var decisionLog = '';
  for (var j = 0; j < GameState.decisions.length; j++) {
    var d = GameState.decisions[j];
    var hours = Math.floor(d.time / 60);
    var mins = d.time % 60;
    var indicator = d.score > 4 ? '\u2705' : (d.score < 0 ? '\u274C' : '\u2796');
    var noiseLabel = d.isNoise ? '<span style="font-size:9px;padding:1px 6px;border-radius:3px;background:rgba(148,163,184,0.15);color:#94a3b8;margin-left:6px;">NOISE</span>' : '';
    decisionLog += '<div style="padding:10px 0;border-bottom:1px solid var(--border);font-size:12px;' + (d.isNoise ? 'opacity:0.85;' : '') + '">' +
      '<span style="color:var(--text-muted);">H+' + String(hours).padStart(2,'0') + ':' + String(mins).padStart(2,'0') + '</span> ' +
      indicator + ' <strong>' + d.title + '</strong>' + noiseLabel + '<br>' +
      '<span style="color:var(--text-primary);margin-left:52px;display:inline-block;margin-top:2px;">' + d.label + '</span>' +
      (d.desc ? '<br><span style="color:var(--text-muted);margin-left:52px;display:inline-block;margin-top:4px;font-size:11px;line-height:1.5;font-style:italic;">' + d.desc + '</span>' : '') +
      '</div>';
  }

  // Consequence chain
  var chains = buildConsequenceChain();
  var consequenceHTML = '';
  if (chains.length === 0) {
    consequenceHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:12px;">No negative consequences triggered. Clean run.</div>';
  } else {
    for (var c = 0; c < chains.length; c++) {
      var ch = chains[c];
      var chHours = Math.floor(ch.sourceTime / 60);
      var chMins = ch.sourceTime % 60;
      consequenceHTML += '<div style="padding:12px 0;border-bottom:1px solid var(--border);font-size:12px;">' +
        '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;">' +
          '<span style="color:var(--accent-amber);font-size:14px;flex-shrink:0;">\u26A1</span>' +
          '<div>' +
            '<div style="color:var(--text-muted);font-size:10px;">H+' + String(chHours).padStart(2,'0') + ':' + String(chMins).padStart(2,'0') + ' \u2014 You chose:</div>' +
            '<div style="color:var(--text-primary);margin-top:2px;">' + ch.sourceLabel + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:flex-start;gap:8px;margin-left:22px;">' +
          '<span style="color:var(--accent-red);font-size:14px;flex-shrink:0;">\u2192</span>' +
          '<div>' +
            '<div style="color:var(--accent-red);font-weight:600;">' + ch.consequenceTitle + '</div>' +
            '<div style="color:var(--text-muted);font-size:11px;margin-top:4px;line-height:1.5;">' + ch.consequenceBody.substring(0, 200) + (ch.consequenceBody.length > 200 ? '...' : '') + '</div>' +
            '<div style="color:var(--accent-red);font-size:10px;margin-top:4px;">Score impact: ' + ch.scorePenalty + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  }

  // Style profile
  var profile = generateStyleProfile();
  var styleHTML = '';
  var styleAxes = ['decisive', 'lifeSafety', 'centralized', 'communityTrust'];
  var axisLabels = { decisive: 'Decision Speed', lifeSafety: 'Life Safety Focus', centralized: 'Control Style', communityTrust: 'Community Orientation' };
  for (var s = 0; s < styleAxes.length; s++) {
    var axis = styleAxes[s];
    var p = profile[axis];
    if (!p) continue;
    var barPct = Math.min(100, Math.max(0, (p.avg + 2) * 25));
    var barColor = barPct > 60 ? 'var(--accent-green)' : (barPct < 40 ? 'var(--accent-amber)' : 'var(--accent-cyan)');
    styleHTML += '<div style="padding:12px 0;border-bottom:1px solid var(--border);">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
        '<span style="font-weight:600;font-size:12px;color:var(--text-primary);">' + (axisLabels[axis] || axis) + '</span>' +
        '<span style="font-size:11px;color:var(--accent-cyan);font-family:var(--font-body);">' + p.title + '</span>' +
      '</div>' +
      '<div style="height:4px;background:var(--bg-primary);border-radius:2px;margin-bottom:6px;overflow:hidden;">' +
        '<div style="height:100%;width:' + barPct + '%;background:' + barColor + ';border-radius:2px;transition:width 0.5s;"></div>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--text-muted);line-height:1.5;">' + p.desc + '</div>' +
    '</div>';
  }

  // Utility final state
  var utilHTML = '';
  if (GameState.utilities) {
    for (var uk in GameState.utilities) {
      var u = GameState.utilities[uk];
      var uCls = u.value > 60 ? 'good' : (u.value > 30 ? 'degraded' : 'failed');
      var uColor = u.value > 60 ? 'var(--accent-green)' : (u.value > 30 ? 'var(--accent-amber)' : 'var(--accent-red)');
      var uInd = STATUS_INDICATORS[uCls] || '';
      utilHTML += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;">' +
        '<span style="color:var(--text-secondary);">' + u.label + '</span>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div style="width:60px;height:5px;background:var(--bg-primary);border-radius:3px;overflow:hidden;">' +
            '<div style="height:100%;width:' + u.value + '%;background:' + uColor + ';border-radius:3px;"></div>' +
          '</div>' +
          '<span style="color:' + uColor + ';font-family:var(--font-body);min-width:35px;text-align:right;">' + uInd + u.value + u.unit + '</span>' +
        '</div>' +
      '</div>';
    }
  }

  // Soft metrics final state
  if (GameState.softMetrics) {
    utilHTML += '<div style="font-size:12px;font-weight:600;color:var(--text-primary);padding:12px 0 6px;border-top:1px solid var(--border);margin-top:8px;">Response Metrics</div>';
    for (var sk in GameState.softMetrics) {
      var sm = GameState.softMetrics[sk];
      var smColor = sm.value > 60 ? 'var(--accent-green)' : (sm.value > 35 ? 'var(--accent-amber)' : 'var(--accent-red)');
      utilHTML += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;">' +
        '<span style="color:var(--text-secondary);">' + sm.icon + ' ' + sm.label + '</span>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div style="width:60px;height:5px;background:var(--bg-primary);border-radius:3px;overflow:hidden;">' +
            '<div style="height:100%;width:' + sm.value + '%;background:' + smColor + ';border-radius:3px;"></div>' +
          '</div>' +
          '<span style="color:' + smColor + ';font-family:var(--font-body);min-width:35px;text-align:right;">' + sm.value + '</span>' +
        '</div>' +
      '</div>';
    }
  }

  // Facilitator guide content
  var facGuideHTML = '';
  if (GameState.facilitatorMode) {
    facGuideHTML += '<div style="padding:12px 0;border-bottom:1px solid var(--border);">' +
      '<div style="font-size:13px;font-weight:600;color:var(--accent-blue);margin-bottom:8px;">Scenario Learning Objectives</div>' +
      '<div style="font-size:11px;color:var(--text-secondary);line-height:1.6;">This scenario tests the player\u2019s ability to manage ' +
      (GameState.scenario === 'local' ? 'a dual-role response where Canterbury is both moderately damaged and the primary logistics hub for the South Island. Key themes: proportionate resource allocation, community-led response, civil-military coordination, and psychosocial awareness.' :
      'a multi-regional catastrophic earthquake response under the SAFER Framework. Key themes: "no regrets" rapid relief, CDEM Group pairing obligations, cascading hazard management, and resource discipline under scarcity.') +
      '</div></div>';

    for (var fg = 0; fg < GameState.decisions.length; fg++) {
      var fd = GameState.decisions[fg];
      var fDecId = null;
      for (var fid in GameState.choiceLog) {
        if (GameState.choiceLog[fid] === fd.key) { fDecId = fid; break; }
      }
      var fn = fDecId ? FACILITATOR_NOTES[fDecId] : null;
      if (!fn) continue;
      var fHours = Math.floor(fd.time / 60);
      var fMins = fd.time % 60;
      var wasCorrect = fd.key === fn.bestPractice;
      var fIcon = wasCorrect ? '\u2705' : '\u26A0\uFE0F';

      facGuideHTML += '<div style="padding:12px 0;border-bottom:1px solid var(--border);">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">' +
          '<div><span style="color:var(--text-muted);font-size:10px;">H+' + String(fHours).padStart(2,'0') + ':' + String(fMins).padStart(2,'0') + '</span> ' +
          fIcon + ' <strong style="font-size:12px;">' + fd.title + '</strong></div>' +
          '<span style="font-size:10px;padding:2px 8px;border-radius:3px;' +
          (wasCorrect ? 'background:rgba(79,195,247,0.1);color:var(--accent-green);' : 'background:rgba(255,183,77,0.1);color:var(--accent-amber);') +
          '">Chose ' + fd.key + ' / Best: ' + fn.bestPractice + '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--text-primary);margin-bottom:4px;">Chose: ' + fd.label + '</div>' +
        '<div style="font-size:11px;color:var(--accent-blue);margin-bottom:6px;font-weight:500;">\uD83C\uDFAF ' + fn.learningObjective + '</div>' +
        '<div style="font-size:11px;color:var(--text-muted);line-height:1.5;margin-bottom:8px;">' + fn.teachingNote + '</div>' +
        '<div style="font-size:10px;color:var(--text-muted);">';
      for (var fr = 0; fr < fn.references.length; fr++) {
        facGuideHTML += '<span style="color:var(--accent-purple);">\u2022</span> ' + fn.references[fr].label + ' \u2014 ' + fn.references[fr].desc + '<br>';
      }
      facGuideHTML += '</div>' +
        '<div style="margin-top:8px;font-size:11px;"><span style="color:var(--accent-amber);font-weight:500;">Discussion:</span></div>';
      for (var fdp = 0; fdp < fn.discussionPrompts.length; fdp++) {
        facGuideHTML += '<div style="font-size:11px;color:var(--text-secondary);padding:2px 0 2px 12px;">' + (fdp+1) + '. ' + fn.discussionPrompts[fdp] + '</div>';
      }
      facGuideHTML += '</div>';
    }
  }

  // Build tabbed debrief
  var overlay = document.createElement('div');
  overlay.className = 'sbt-overlay';
  overlay.innerHTML =
    '<div class="sbt-card" style="max-width:700px;text-align:left;max-height:90vh;overflow-y:auto;padding:24px;">' +
      '<h2 style="text-align:center;margin-bottom:0.25rem;">Scenario Debrief</h2>' +
      '<p style="text-align:center;color:var(--text-muted);font-size:12px;margin-bottom:1.5rem;">' + scenarioName + '</p>' +

      // Score cards
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:1.5rem;">' +
        '<div style="background:var(--bg-primary);padding:16px;border-radius:8px;text-align:center;">' +
          '<div style="font-size:2rem;font-family:var(--font-display);font-weight:700;color:var(--accent-cyan);">' + grade + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Overall Grade</div></div>' +
        '<div style="background:var(--bg-primary);padding:16px;border-radius:8px;text-align:center;">' +
          '<div style="font-size:2rem;font-family:var(--font-display);font-weight:700;">' + GameState.score + '%</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Effectiveness</div></div>' +
        '<div style="background:var(--bg-primary);padding:16px;border-radius:8px;text-align:center;">' +
          '<div style="font-size:2rem;font-family:var(--font-display);font-weight:700;">' + chains.length + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Consequences</div></div>' +
      '</div>' +

      '<div style="display:flex;gap:8px;margin-bottom:1.5rem;">' +
        '<div style="flex:1;padding:8px 12px;background:rgba(79,195,247,0.1);border-radius:6px;font-size:12px;color:var(--accent-green);">\u2705 Strong: ' + goodDecisions + '</div>' +
        '<div style="flex:1;padding:8px 12px;background:rgba(240,98,146,0.1);border-radius:6px;font-size:12px;color:var(--accent-red);">\u274C Weak: ' + poorDecisions + '</div>' +
      '</div>' +

      // Tab buttons
      '<div id="debrief-tabs" style="display:flex;gap:4px;margin-bottom:16px;flex-wrap:wrap;">' +
        '<button class="btn btn-secondary debrief-tab active" onclick="showDebriefTab(\'decisions\')" style="font-size:11px;padding:6px 12px;">Decisions</button>' +
        '<button class="btn btn-secondary debrief-tab" onclick="showDebriefTab(\'consequences\')" style="font-size:11px;padding:6px 12px;">Consequences (' + chains.length + ')</button>' +
        '<button class="btn btn-secondary debrief-tab" onclick="showDebriefTab(\'style\')" style="font-size:11px;padding:6px 12px;">Decision Style</button>' +
        '<button class="btn btn-secondary debrief-tab" onclick="showDebriefTab(\'utilities\')" style="font-size:11px;padding:6px 12px;">Utility Status</button>' +
        (GameState.facilitatorMode ? '<button class="btn btn-secondary debrief-tab" onclick="showDebriefTab(\'facilitator\')" style="font-size:11px;padding:6px 12px;border-color:var(--accent-blue);color:var(--accent-blue);">\uD83D\uDCCB Facilitator Guide</button>' : '') +
      '</div>' +

      // Tab content
      '<div id="tab-decisions" class="debrief-tab-content">' + decisionLog + '</div>' +
      '<div id="tab-consequences" class="debrief-tab-content" style="display:none;">' + consequenceHTML + '</div>' +
      '<div id="tab-style" class="debrief-tab-content" style="display:none;">' + styleHTML + '</div>' +
      '<div id="tab-utilities" class="debrief-tab-content" style="display:none;">' + utilHTML + '</div>' +
      (GameState.facilitatorMode ? '<div id="tab-facilitator" class="debrief-tab-content" style="display:none;">' + facGuideHTML + '</div>' : '') +

      '<div style="text-align:center;margin-top:1.5rem;">' +
        '<button class="btn btn-primary" onclick="location.reload()">Return to Menu</button>' +
        '<div style="margin-top:12px;font-size:10px;color:var(--text-muted);">AF8 Cascading Impact Simulator \u00B7 Designed by Victoria Kluge \u00B7 <a href="https://vakconsultingllc.com" target="_blank" style="color:var(--accent-cyan);text-decoration:none;">VAK Consulting LLC</a></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
}

function showDebriefTab(tab) {
  var tabs = document.querySelectorAll('.debrief-tab-content');
  for (var i = 0; i < tabs.length; i++) { tabs[i].style.display = 'none'; }
  var buttons = document.querySelectorAll('.debrief-tab');
  for (var j = 0; j < buttons.length; j++) { buttons[j].classList.remove('active'); }
  document.getElementById('tab-' + tab).style.display = 'block';
  event.target.classList.add('active');
}

// ============ UTILITY TRACKER ============
var UTILITY_DEFAULTS = {
  local: {
    power: { label: 'Power (Orion)', value: 65, unit: '%' },
    water: { label: 'Water Supply', value: 55, unit: '%' },
    telecoms: { label: 'Telecoms', value: 40, unit: '%' },
    wastewater: { label: 'Wastewater', value: 30, unit: '%' },
    fuel: { label: 'Fuel Distribution', value: 70, unit: '%' },
    transport: { label: 'Transport Network', value: 45, unit: '%' }
  },
  af8: {
    power: { label: 'Power (SI Grid)', value: 15, unit: '%' },
    water: { label: 'Water (Regional)', value: 35, unit: '%' },
    telecoms: { label: 'Telecoms', value: 20, unit: '%' },
    fuel: { label: 'Fuel Reserves', value: 40, unit: '%' },
    transport: { label: 'Transport Access', value: 10, unit: '%' },
    shelter: { label: 'Shelter Capacity', value: 25, unit: '%' }
  }
};

// Utility effects per decision (decisionId -> key -> utility changes)
var UTILITY_EFFECTS = {
  // Canterbury Local
  'airport_priority': {
    'A': { transport: 15 },
    'B': { transport: -20 },
    'C': { transport: 10 }
  },
  'welfare_split': {
    'A': { shelter: -10 },
    'B': {},
    'C': { shelter: 5 }
  },
  'fuel_priority': {
    'A': { fuel: 10 },
    'B': { fuel: -5 },
    'C': { fuel: 5 }
  },
  'water_response': {
    'A': { water: 10 },
    'B': { water: 5 },
    'C': { water: 15 }
  },
  'nzdf_staging': {
    'A': { transport: 10 },
    'B': { transport: -15, fuel: -10 },
    'C': { transport: 5 }
  },
  'movement_control': {
    'A': { transport: 15 },
    'B': { transport: -10 },
    'C': { transport: -5 }
  },
  'psychosocial': {
    'C': { shelter: 5 }
  },
  'accommodation': {
    'B': { shelter: -15 },
    'C': { shelter: 10 }
  },
  // AF8 Regional
  'af8_declaration': {
    'B': { telecoms: -5 },
    'C': { telecoms: 5 }
  },
  'af8_franz_josef': {
    'A': { fuel: -15, transport: 5 },
    'B': { fuel: 0 },
    'C': { fuel: -5, transport: 5 }
  },
  'af8_telecoms': {
    'A': { telecoms: 5 },
    'B': { telecoms: 10 },
    'C': { telecoms: -5 }
  },
  'af8_queenstown': {
    'A': { fuel: -15, shelter: 15 },
    'B': { fuel: -5, shelter: 5 },
    'C': { shelter: -20 }
  },
  'af8_fuel': {
    'A': { fuel: -5, power: 10 },
    'B': { fuel: 5, power: -20 },
    'C': { fuel: -5 }
  },
  'af8_hospital': {
    'A': { fuel: -5 },
    'B': { fuel: -10, shelter: -5 },
    'C': { fuel: -10 }
  },
  'af8_weather_window': {
    'A': { shelter: 10, fuel: -10 },
    'B': { fuel: -5, shelter: 5 },
    'C': { fuel: -5, shelter: -5, transport: 5 }
  },
  // Previously missing decisions
  'eoc_level': {
    'A': { telecoms: 5 },
    'B': { telecoms: 10, transport: 5 },
    'C': { telecoms: 8 }
  },
  'evacuee_reception': {
    'A': { shelter: 10 },
    'B': { shelter: 15, transport: -5 },
    'C': { shelter: 5 }
  },
  'media_management': {
    'A': { telecoms: 5 },
    'B': { telecoms: -5 },
    'C': { telecoms: 8 }
  },
  'port_resilience': {
    'A': { fuel: 10, transport: 10 },
    'B': { fuel: 8 },
    'C': { fuel: -5 }
  },
  'declaration': {
    'A': { transport: 5, shelter: 5 },
    'B': {},
    'C': { transport: 3 }
  },
  'af8_recon': {
    'A': { telecoms: 10, shelter: 5 },
    'B': { transport: 10 },
    'C': { telecoms: 5, transport: 5 }
  },
  'af8_usar_deploy': {
    'A': { shelter: 10 },
    'B': { shelter: 8, fuel: -5 },
    'C': { shelter: -10 }
  },
  'af8_evacuation': {
    'A': { shelter: 5, transport: 5 },
    'B': { shelter: -15 },
    'C': { shelter: 10, transport: 5 }
  },
  'af8_transition': {
    'A': { telecoms: 5 },
    'B': { telecoms: -5 },
    'C': { telecoms: 10, shelter: 5 }
  }
};

function initUtilities() {
  var defaults = UTILITY_DEFAULTS[GameState.scenario] || UTILITY_DEFAULTS.af8;
  GameState.utilities = {};
  for (var key in defaults) {
    GameState.utilities[key] = { label: defaults[key].label, value: defaults[key].value, unit: defaults[key].unit };
  }
  GameState.utilityHistory = [];
}

function applyUtilityEffects(decId, key) {
  var effects = UTILITY_EFFECTS[decId] && UTILITY_EFFECTS[decId][key];
  if (!effects) return;

  var changed = [];
  for (var util in effects) {
    if (GameState.utilities[util]) {
      var oldVal = GameState.utilities[util].value;
      GameState.utilities[util].value = Math.max(0, Math.min(100, oldVal + effects[util]));
      changed.push({ key: util, oldVal: oldVal, newVal: GameState.utilities[util].value, delta: effects[util] });
    }
  }

  // Snapshot for history
  var snapshot = {};
  for (var u in GameState.utilities) {
    snapshot[u] = GameState.utilities[u].value;
  }
  GameState.utilityHistory.push({ decId: decId, key: key, snapshot: snapshot });

  // Animate each changed meter individually
  var panel = document.getElementById('resources-section');
  if (!panel) { renderUtilityPanel(); return; }

  for (var c = 0; c < changed.length; c++) {
    var ch = changed[c];
    var item = panel.querySelector('[data-util="' + ch.key + '"]');
    if (!item) { renderUtilityPanel(); return; }

    var fill = item.querySelector('.meter-fill');
    var pctSpan = item.querySelector('span[style*="min-width"]');
    var newCls = ch.newVal > 60 ? 'green' : (ch.newVal > 30 ? 'amber' : 'red');
    var pctColor = ch.newVal > 60 ? 'var(--accent-green)' : (ch.newVal > 30 ? 'var(--accent-amber)' : 'var(--accent-red)');
    var direction = ch.delta < 0 ? 'down' : 'up';

    if (fill) {
      fill.style.width = ch.newVal + '%';
      fill.className = 'meter-fill ' + newCls;
    }
    if (pctSpan) {
      pctSpan.textContent = ch.newVal + '%';
      pctSpan.style.color = pctColor;
    }
    triggerDashAnimation(item, direction);
  }
}

function renderUtilityPanel() {
  var panel = document.getElementById('resources-section');
  if (!panel) return;
  var html = '';
  for (var key in GameState.utilities) {
    var u = GameState.utilities[key];
    var cls = u.value > 60 ? 'green' : (u.value > 30 ? 'amber' : 'red');
    var pctColor = u.value > 60 ? 'var(--accent-green)' : (u.value > 30 ? 'var(--accent-amber)' : 'var(--accent-red)');
    html += '<div class="sit-item" data-util="' + key + '"><span class="sit-label">' + u.label + '</span>' +
      '<div style="display:flex;align-items:center;gap:6px;">' +
      '<div class="meter-bar" style="width:50px;"><div class="meter-fill ' + cls + '" style="width:' + u.value + '%"></div></div>' +
      '<span style="font-size:10px;color:' + pctColor + ';font-family:var(--font-body);min-width:28px;">' + u.value + u.unit + '</span>' +
      '</div></div>';
  }
  panel.innerHTML = html;
}

function updateUtilityDirect(utilKey, newValue) {
  if (!GameState.utilities[utilKey]) return;
  var oldVal = GameState.utilities[utilKey].value;
  GameState.utilities[utilKey].value = Math.max(0, Math.min(100, newValue));
  var panel = document.getElementById('resources-section');
  if (!panel) return;
  var item = panel.querySelector('[data-util="' + utilKey + '"]');
  if (!item) return;
  var nv = GameState.utilities[utilKey].value;
  var fill = item.querySelector('.meter-fill');
  var pctSpan = item.querySelector('span[style*="min-width"]');
  var nc = nv > 60 ? 'green' : (nv > 30 ? 'amber' : 'red');
  var npc = nv > 60 ? 'var(--accent-green)' : (nv > 30 ? 'var(--accent-amber)' : 'var(--accent-red)');
  if (fill) { fill.style.width = nv + '%'; fill.className = 'meter-fill ' + nc; }
  if (pctSpan) { pctSpan.textContent = nv + '%'; pctSpan.style.color = npc; }
  triggerDashAnimation(item, nv < oldVal ? 'down' : 'up');
}

// ============ DECISION STYLE ANALYSIS ============
// Each option tagged with style dimensions (scores from -2 to +2)
var STYLE_TAGS = {
  // Canterbury Local
  'eoc_level': {
    'A': { decisive: 1, centralized: 2, lifeSafety: 0 },
    'B': { decisive: 1, centralized: 0, communityTrust: 0 },
    'C': { decisive: 0, centralized: 1, communityTrust: 0 }
  },
  'airport_priority': {
    'A': { decisive: 2, lifeSafety: 1, centralized: 1 },
    'B': { decisive: -1, lifeSafety: -2, centralized: -1 },
    'C': { decisive: 1, lifeSafety: 0, centralized: 0 }
  },
  'welfare_split': {
    'A': { decisive: 2, lifeSafety: -1, centralized: 1, communityTrust: -2 },
    'B': { decisive: 0, lifeSafety: 0, centralized: 0, communityTrust: 0 },
    'C': { decisive: 1, lifeSafety: 0, centralized: -1, communityTrust: 2 }
  },
  'evacuee_reception': {
    'A': { decisive: 1, centralized: 1, communityTrust: 0 },
    'B': { decisive: 1, centralized: 0, communityTrust: 0 },
    'C': { decisive: 0, centralized: -1, communityTrust: 1 }
  },
  'fuel_priority': {
    'A': { decisive: 1, lifeSafety: 0, centralized: 1 },
    'B': { decisive: 0, lifeSafety: 1, centralized: -1 },
    'C': { decisive: 1, lifeSafety: 0, centralized: 0 }
  },
  'psychosocial': {
    'A': { decisive: 1, lifeSafety: 1, centralized: 1 },
    'B': { decisive: 0, lifeSafety: -1, communityTrust: -1 },
    'C': { decisive: 2, lifeSafety: 1, communityTrust: 1 }
  },
  'water_response': {
    'A': { decisive: 1, lifeSafety: -1, centralized: 1, communityTrust: -1 },
    'B': { decisive: 1, lifeSafety: 1, centralized: 0, communityTrust: 0 },
    'C': { decisive: 2, lifeSafety: 1, centralized: -1, communityTrust: 1 }
  },
  'nzdf_staging': {
    'A': { decisive: 1, centralized: 1, lifeSafety: 0 },
    'B': { decisive: -2, centralized: -2, lifeSafety: -1 },
    'C': { decisive: 1, centralized: 1, lifeSafety: 0 }
  },
  'accommodation': {
    'A': { decisive: 1, centralized: 1, communityTrust: -1 },
    'B': { decisive: 1, centralized: 2, communityTrust: -2 },
    'C': { decisive: 1, centralized: -1, communityTrust: 2 }
  },
  'movement_control': {
    'A': { decisive: 1, centralized: 1, communityTrust: 0 },
    'B': { decisive: 2, centralized: 2, communityTrust: -2 },
    'C': { decisive: -1, centralized: -2, communityTrust: 1 }
  },
  'media_management': {
    'A': { decisive: 1, centralized: 1, communityTrust: 0 },
    'B': { decisive: 2, centralized: 2, communityTrust: -1 },
    'C': { decisive: 1, centralized: 0, communityTrust: 1 }
  },
  'port_resilience': {
    'A': { decisive: 2, lifeSafety: 1, centralized: 0 },
    'B': { decisive: 1, lifeSafety: 0, centralized: 0 },
    'C': { decisive: -1, lifeSafety: -1, centralized: 0 }
  },
  'declaration': {
    'A': { decisive: 2, centralized: 1, lifeSafety: 0 },
    'B': { decisive: 0, centralized: -1, lifeSafety: 0 },
    'C': { decisive: 1, centralized: 0, lifeSafety: 0 }
  },
  // AF8 Regional
  'af8_declaration': {
    'A': { decisive: 1, centralized: 1 },
    'B': { decisive: -2, centralized: -1 },
    'C': { decisive: 2, centralized: 1 }
  },
  'af8_franz_josef': {
    'A': { decisive: 2, lifeSafety: 1, centralized: 1 },
    'B': { decisive: -1, lifeSafety: -2, communityTrust: 1 },
    'C': { decisive: 1, lifeSafety: 1, communityTrust: 1 }
  },
  'af8_telecoms': {
    'A': { decisive: 0, centralized: 1, communityTrust: -1 },
    'B': { decisive: 1, centralized: 0, communityTrust: 1 },
    'C': { decisive: 0, centralized: 0 }
  },
  'af8_queenstown': {
    'A': { decisive: 2, lifeSafety: 2, centralized: 0 },
    'B': { decisive: 0, lifeSafety: 0, communityTrust: 1 },
    'C': { decisive: -2, lifeSafety: -2 }
  },
  'af8_fuel': {
    'A': { decisive: 1, lifeSafety: 2, centralized: 1 },
    'B': { decisive: 1, lifeSafety: -1, centralized: 0 },
    'C': { decisive: 0, lifeSafety: 0, centralized: -1 }
  },
  'af8_recon': {
    'A': { decisive: 2, lifeSafety: 2, centralized: 0 },
    'B': { decisive: 1, lifeSafety: -1, centralized: 0 },
    'C': { decisive: 0, lifeSafety: 0 }
  },
  'af8_hospital': {
    'A': { decisive: 1, lifeSafety: 1 },
    'B': { decisive: 1, lifeSafety: 1 },
    'C': { decisive: 2, lifeSafety: 2 }
  },
  'af8_evacuation': {
    'A': { decisive: 1, lifeSafety: 1, centralized: 1 },
    'B': { decisive: 2, lifeSafety: -1, centralized: -1 },
    'C': { decisive: 1, lifeSafety: 1, centralized: 0 }
  },
  'af8_usar_deploy': {
    'A': { decisive: 2, lifeSafety: 2 },
    'B': { decisive: 1, lifeSafety: 1 },
    'C': { decisive: -2, lifeSafety: -2 }
  },
  'af8_weather_window': {
    'A': { decisive: 1, lifeSafety: 2, centralized: 1 },
    'B': { decisive: 1, lifeSafety: 1, centralized: 0 },
    'C': { decisive: 2, lifeSafety: 0, centralized: 0 }
  },
  'af8_transition': {
    'A': { decisive: 0, lifeSafety: 1, communityTrust: 0 },
    'B': { decisive: 1, lifeSafety: 0, centralized: 1 },
    'C': { decisive: 1, lifeSafety: 1, centralized: 0 }
  }
};

var STYLE_PROFILES = {
  decisive: {
    high: { title: 'Decisive Operator', desc: 'You act fast and commit fully. In a crisis, speed saves lives \u2014 but watch for tunnel vision when the situation evolves.' },
    low: { title: 'Measured Analyst', desc: 'You prefer to gather information before committing. Thoughtful \u2014 but in a fast-moving disaster, the window for action can close while you are still assessing.' },
    neutral: { title: 'Balanced Decision-Maker', desc: 'You weigh speed against information. Neither reckless nor paralysed.' }
  },
  lifeSafety: {
    high: { title: 'Life Safety First', desc: 'Every decision filters through "who dies if I get this wrong." That instinct is the foundation of emergency management.' },
    low: { title: 'Systems Thinker', desc: 'You prioritise infrastructure and logistics, trusting that systemic fixes save more lives long-term. Valid \u2014 but people notice when the Controller is managing spreadsheets while they are trapped.' },
    neutral: { title: 'Balanced Priorities', desc: 'You shift between life safety and logistics based on context.' }
  },
  centralized: {
    high: { title: 'Command & Control', desc: 'You want everything flowing through the ECC. Clear authority, clear accountability. But centralisation creates bottlenecks when the situation is too big for one node.' },
    low: { title: 'Distributed Leadership', desc: 'You push authority to the edges and trust local teams. Scales well \u2014 but can fragment the response if coordination breaks down.' },
    neutral: { title: 'Adaptive Structure', desc: 'You centralise when needed and distribute when appropriate.' }
  },
  communityTrust: {
    high: { title: 'Community-Led Responder', desc: 'You trust marae, Community Hubs, and local networks to handle their own. Consistent with iwi partnership principles and CIMS community focus. But self-organising communities still need institutional support.' },
    low: { title: 'Institutional Controller', desc: 'You prefer formal channels and institutional capacity over community self-organisation. Reliable \u2014 but can alienate communities who are already helping themselves.' },
    neutral: { title: 'Partnership Builder', desc: 'You work alongside community networks without trying to direct them.' }
  }
};

function generateStyleProfile() {
  var totals = { decisive: 0, lifeSafety: 0, centralized: 0, communityTrust: 0 };
  var counts = { decisive: 0, lifeSafety: 0, centralized: 0, communityTrust: 0 };

  for (var i = 0; i < GameState.decisions.length; i++) {
    var d = GameState.decisions[i];
    var decId = null;
    // Find decisionId from choiceLog keys
    for (var id in GameState.choiceLog) {
      if (GameState.choiceLog[id] === d.key) {
        // Match by checking if this decision title corresponds
        var tags = STYLE_TAGS[id] && STYLE_TAGS[id][d.key];
        if (tags) {
          for (var axis in tags) {
            totals[axis] = (totals[axis] || 0) + tags[axis];
            counts[axis] = (counts[axis] || 0) + 1;
          }
        }
      }
    }
  }

  var profile = {};
  for (var axis in totals) {
    var avg = counts[axis] > 0 ? totals[axis] / counts[axis] : 0;
    var level = avg > 0.5 ? 'high' : (avg < -0.5 ? 'low' : 'neutral');
    profile[axis] = STYLE_PROFILES[axis][level];
    profile[axis].score = totals[axis];
    profile[axis].avg = avg;
  }
  return profile;
}

// ============ CONSEQUENCE TRACKER ============
function buildConsequenceChain() {
  var chains = [];
  for (var i = 0; i < GameState.decisions.length; i++) {
    var d = GameState.decisions[i];
    var decId = null;
    // Find the decisionId that matches this decision
    for (var id in GameState.choiceLog) {
      if (GameState.choiceLog[id] === d.key) {
        decId = id;
        break;
      }
    }
    if (!decId) continue;

    var consequence = CONSEQUENCE_MAP[decId] && CONSEQUENCE_MAP[decId][d.key];
    if (consequence && consequence.inject) {
      chains.push({
        sourceDecision: d.title,
        sourceTime: d.time,
        sourceKey: d.key,
        sourceLabel: d.label,
        consequenceTitle: consequence.inject.title,
        consequenceBody: consequence.inject.body,
        scorePenalty: consequence.inject.scorePenalty || 0
      });
    }
  }
  return chains;
}


// ============ FACILITATOR NOTES ============
var FACILITATOR_NOTES = {
  // ---- CANTERBURY LOCAL ----
  'eoc_level': {
    learningObjective: 'Understanding EOC activation levels and the tension between co-location and independence in a dual-role scenario.',
    references: [
      { label: 'CIMS 3rd Ed, Section 4.3', desc: 'EOC/ECC establishment and activation levels' },
      { label: 'CCC EQ Plan Part B, Section 3.1', desc: 'EOC operational modes: JESP vs Hereford Street' },
      { label: 'SAFER Framework, Section 3.3.1', desc: 'CDEM Group pairing and support obligations' }
    ],
    teachingNote: 'This decision tests whether players understand the Scenario 2 context from the CCC Earthquake Plan. The key insight is that JESP co-location is strongly preferred when the primary challenge is coordination with the Group ECC, not independent city-level response. Option C (start at JESP, assess Hereford St) mirrors the pragmatic approach recommended in the plan.',
    discussionPrompts: [
      'What are the risks of CCC priorities being diluted in a multi-agency ECC environment?',
      'When would Hereford Street activation (Level 4) be the right call instead?',
      'How does the SAFER pairing obligation affect this decision?'
    ],
    bestPractice: 'C'
  },
  'airport_priority': {
    learningObjective: 'Balancing lifeline infrastructure protection with operational need and political pressure.',
    references: [
      { label: 'CDEM Act 2002, Section 60', desc: 'Lifeline utilities and strategic infrastructure obligations' },
      { label: 'SAFER Framework, Section 3.6.3', desc: 'Air transport priorities and staging requirements' },
      { label: 'CIMS 3rd Ed, Section 5.2', desc: 'Logistics function: transport and staging management' }
    ],
    teachingNote: 'Christchurch Airport is designated strategic lifeline infrastructure. Full commercial reopening (Option B) creates an airspace management crisis that is entirely predictable and avoidable. The key teaching point is that "projecting normalcy" is not a valid emergency management objective when it conflicts with response operations. Emergency-only operations (Option A) is doctrinally correct but Option C (phased) is the most operationally realistic.',
    discussionPrompts: [
      'Who has the authority to restrict airport operations during a national emergency?',
      'What pressures would a Controller face to reopen commercially?',
      'How would you communicate the restriction to stranded passengers?'
    ],
    bestPractice: 'A'
  },
  'welfare_split': {
    learningObjective: 'Resource allocation between competing obligations when neither can be fully met.',
    references: [
      { label: 'SAFER Framework, Section 3.4.2b', desc: '"No regrets" rapid relief approach' },
      { label: 'CCC EQ Plan Part B, Section 5.3', desc: 'Community Emergency Hubs and self-activation' },
      { label: 'CIMS 3rd Ed, Section 6.1', desc: 'Welfare function: community-led response integration' }
    ],
    teachingNote: 'This is the central tension of the Canterbury Scenario 2. The "right" answer (Option C) requires trusting community self-organisation, which runs against the instinct to control everything from the EOC. Players who choose 70/30 support role (Option A) are technically correct about the greater need but will face political backlash. The discussion should focus on how institutional support enables rather than replaces community-led response.',
    discussionPrompts: [
      'How do you support Community Hubs without directing them?',
      'What happens when the Mayor calls asking why locals are being deprioritised?',
      'Is there a point where community resilience reaches its limits?'
    ],
    bestPractice: 'C'
  },
  'evacuee_reception': {
    learningObjective: 'Mass evacuation reception planning and multi-agency welfare coordination.',
    references: [
      { label: 'CIMS 3rd Ed, Section 6.2', desc: 'Welfare function: registration and needs assessment' },
      { label: 'CDEM Act 2002, Section 85', desc: 'Welfare in emergencies provisions' },
      { label: 'MFAT Consular Response Framework', desc: 'International visitor welfare obligations' }
    ],
    teachingNote: 'Separating local CDC and evacuee reception (Option B) is operationally cleaner but resource-intensive. The key teaching point is that international evacuees have fundamentally different needs (consular access, language support, repatriation) than local displaced residents (housing, insurance, community reconnection). Mixing them creates service delivery problems.',
    discussionPrompts: [
      'Who leads evacuee reception: CCC, CDEM Group, or MFAT?',
      'How do you manage welfare registration when arrivals exceed capacity?',
      'What role should Red Cross play vs government agencies?'
    ],
    bestPractice: 'B'
  },
  'fuel_priority': {
    learningObjective: 'Understanding the CDEM Act hierarchy and appropriate escalation of resource allocation decisions.',
    references: [
      { label: 'CDEM Act 2002, Section 28', desc: 'National Controller powers and direction-setting' },
      { label: 'SAFER Framework, Section 3.6.4', desc: 'Fuel and energy coordination' },
      { label: 'CIMS 3rd Ed, Section 5.3', desc: 'Logistics function: supply chain management' }
    ],
    teachingNote: 'This decision tests whether players understand the limits of their authority. Canterbury is a distribution node, not the decision-maker on inter-regional fuel allocation. Option B (National Controller decides) is correct because it reflects the CDEM Act hierarchy. Players who self-prioritise (Option A) are overstepping their role in a national emergency.',
    discussionPrompts: [
      'At what point does a local Controller cede resource allocation to the National Controller?',
      'Is there a legitimate case for Canterbury prioritising its own fuel supply?',
      'How does the "no regrets" principle apply to fuel distribution?'
    ],
    bestPractice: 'B'
  },
  'psychosocial': {
    learningObjective: 'Integrating psychosocial response into a primarily physical-damage response framework.',
    references: [
      { label: 'CIMS 3rd Ed, Section 6.3', desc: 'Welfare function: psychosocial support' },
      { label: 'CCC EQ Plan Part B, Section 5.5', desc: 'Community wellbeing and psychosocial recovery' },
      { label: 'Canterbury DHB Psychosocial Plan', desc: 'Mental health surge response protocols' }
    ],
    teachingNote: 'Canterbury\u2019s psychosocial impact is disproportionate to physical damage because of CES trauma reactivation. This tests whether players can recognise when the dominant response need is psychological rather than physical. Option B (PIM only) backfires because messaging that says "this isn\u2019t 2011" feels dismissive to people reliving 2011. The multi-layered approach (Option C) is resource-intensive but addresses the full spectrum.',
    discussionPrompts: [
      'How do you message reassurance without minimising people\u2019s lived experience?',
      'Should psychosocial response be led by DHB or by community networks?',
      'At what point does psychosocial need override physical response priorities?'
    ],
    bestPractice: 'C'
  },
  'water_response': {
    learningObjective: 'Applying WASH standards and regional mutual aid to a split-demand resource problem.',
    references: [
      { label: 'SPHERE Standards, Section 3', desc: 'WASH minimum standards in emergency response' },
      { label: 'Health Act 1956, Section 69J', desc: 'Drinking water standards and boil water notices' },
      { label: 'CDEM Act 2002, Section 17', desc: 'Mutual assistance arrangements between CDEM Groups' }
    ],
    teachingNote: 'The key tension: Canterbury residents can boil tap water. West Coast residents have no water at all. Option C (regional mutual aid) is the best answer because it solves the local need through district-level cooperation while freeing CCC tankers for the greater need. This tests understanding of mutual aid provisions and proportionate resource allocation.',
    discussionPrompts: [
      'How quickly can neighbouring districts actually mobilise water tankers?',
      'What\u2019s the public health risk of relying on boil water compliance?',
      'Who makes the call to divert tankers from local to regional use?'
    ],
    bestPractice: 'C'
  },
  'nzdf_staging': {
    learningObjective: 'Civil-military coordination within the CDEM framework.',
    references: [
      { label: 'CIMS 3rd Ed, Section 3.5', desc: 'Military integration in civil emergencies' },
      { label: 'NZDF DACC Protocols', desc: 'Defence Assistance to the Civil Community framework' },
      { label: 'SAFER Framework, Section 3.6.5', desc: 'Military asset coordination requirements' }
    ],
    teachingNote: 'NZDF operates within CDEM framework during emergencies, not independently. Option B (self-coordinate) is a predictable failure because military logistics planning without CDEM coordination creates conflicts at chokepoints like the Lyttelton Tunnel. The liaison officer (Option A) is correct because it maintains the CDEM coordination function without overcomplicating the structure.',
    discussionPrompts: [
      'What is the legal relationship between NZDF and CDEM during a national emergency?',
      'Who has authority over military movements within a CDEM Group area?',
      'How would you handle a disagreement between the NZDF commander and the Group Controller?'
    ],
    bestPractice: 'A'
  },
  'accommodation': {
    learningObjective: 'Mass accommodation planning using distributed community capacity.',
    references: [
      { label: 'CIMS 3rd Ed, Section 6.4', desc: 'Welfare function: shelter and accommodation' },
      { label: 'CCC EQ Plan Part B, Section 5.4', desc: 'Civil Defence Centres and welfare registration' },
      { label: 'SPHERE Standards, Section 4', desc: 'Shelter and settlement minimum standards' }
    ],
    teachingNote: 'The A&P Showgrounds option (B) is the institutional default but creates a "refugee camp" dynamic that is both inadequate for extended stays and politically damaging. The distributed model (Option C) is harder to manage but uses all available capacity and keeps people in more dignified settings. D4H welfare registration is the enabler that makes distributed accommodation trackable.',
    discussionPrompts: [
      'What are the minimum standards for emergency accommodation beyond 48 hours?',
      'How do you track people across a distributed accommodation model?',
      'What role should marae play in accommodation provision?'
    ],
    bestPractice: 'C'
  },
  'movement_control': {
    learningObjective: 'Proportionate use of emergency powers in a moderately affected area.',
    references: [
      { label: 'CDEM Act 2002, Section 86-88', desc: 'Emergency powers: evacuation, entry, movement control' },
      { label: 'NZBORA 1990, Section 18', desc: 'Freedom of movement provisions' },
      { label: 'CIMS 3rd Ed, Section 4.6', desc: 'Operations function: movement management' }
    ],
    teachingNote: 'Canterbury is not the disaster zone \u2014 it\u2019s the logistics hub. Full movement control (Option B) is disproportionate and will generate backlash. No control (Option C) allows response convoys to be delayed by civilian traffic. Dedicated response corridors (Option A) is the proportionate middle ground that keeps logistics flowing without restricting civilian movement unnecessarily.',
    discussionPrompts: [
      'When is movement control justified in a support area vs a damage area?',
      'How would you defend response corridors legally under NZBORA?',
      'What happens when the emergency powers feel disproportionate to local residents?'
    ],
    bestPractice: 'A'
  },
  'media_management': {
    learningObjective: 'PIM function management under competing stakeholder pressures.',
    references: [
      { label: 'CIMS 3rd Ed, Section 7', desc: 'Public Information Management function' },
      { label: 'SAFER Framework, Section 3.6.1', desc: 'Communications and public information priorities' },
      { label: 'MCDEM PIM Guide', desc: 'Media management in civil defence emergencies' }
    ],
    teachingNote: 'Media access is a legitimate need \u2014 public information serves accountability and community resilience. But uncontrolled media helicopter flights conflict with response operations. The embedded pool (Option A) is standard practice in military and civil defence contexts. The PIM media centre (Option C) is proactive and feeds the media without diverting response resources.',
    discussionPrompts: [
      'Is it ever appropriate to ban media access entirely during an emergency?',
      'How do you manage the narrative when local residents feel overlooked?',
      'What role does social media play in undermining or supporting PIM?'
    ],
    bestPractice: 'A'
  },
  'port_resilience': {
    learningObjective: 'Supply chain resilience and single-point-of-failure risk management.',
    references: [
      { label: 'CDEM Act 2002, Section 60', desc: 'Lifeline utility obligations and resilience' },
      { label: 'SAFER Framework, Section 3.6.4', desc: 'Fuel and logistics supply chain' },
      { label: 'NZ National CDEM Plan, Section 24', desc: 'Lifeline utility coordination' }
    ],
    teachingNote: 'Lyttelton Port is the South Island\u2019s single point of failure for fuel. This decision tests strategic thinking beyond the immediate crisis. Option A (Timaru diversification) is the strongest answer because it addresses systemic vulnerability. Players who accept the risk (Option C) are being operationally lazy.',
    discussionPrompts: [
      'How far ahead should a Controller be thinking during the first operational period?',
      'What other single points of failure exist in the Canterbury logistics hub?',
      'Who is responsible for lifeline utility resilience \u2014 the utility or CDEM?'
    ],
    bestPractice: 'A'
  },
  'declaration': {
    learningObjective: 'Understanding the legal framework for emergency declarations and proportionality.',
    references: [
      { label: 'CDEM Act 2002, Section 68-69', desc: 'Declaration of state of local emergency' },
      { label: 'CDEM Act 2002, Section 66', desc: 'National vs local declaration relationships' },
      { label: 'CIMS 3rd Ed, Section 2.4', desc: 'Declaration decision-making framework' }
    ],
    teachingNote: 'This is a nuanced legal question. The national declaration already covers Canterbury. A separate local declaration is legally valid but may be unnecessary. Option B (operate under national) is arguably the most legally sound. Option A gives additional local powers but risks community alarm. The discussion should focus on proportionality and whether additional powers are actually needed.',
    discussionPrompts: [
      'What additional powers does a local declaration provide beyond a national declaration?',
      'How do you explain the declaration to a public that sees moderate damage?',
      'Could a targeted geographic declaration (Option C) actually be implemented?'
    ],
    bestPractice: 'B'
  },
  // ---- AF8 REGIONAL ----
  'af8_declaration': {
    learningObjective: 'Timely use of emergency powers and the relationship between local and national declarations.',
    references: [
      { label: 'CDEM Act 2002, Section 68', desc: 'Declaration of state of local emergency' },
      { label: 'SAFER Framework, Section 1.5', desc: 'Activation triggers and immediate actions' },
      { label: 'CIMS 3rd Ed, Section 2.4', desc: 'Declaration authority and process' }
    ],
    teachingNote: 'Waiting for national declaration (Option B) is the classic failure of an AF8 response. The SAFER Framework assumes local declarations happen immediately. NCMC may take hours to process a national declaration. Every hour without emergency powers is an hour without the legal authority to requisition resources, control movement, or compel evacuations.',
    discussionPrompts: [
      'What does a Controller lose by declaring too early? What do they lose by waiting?',
      'Can a local declaration be rescinded if it turns out to be unnecessary?',
      'How does the SAFER Framework address the multi-Group declaration challenge?'
    ],
    bestPractice: 'C'
  },
  'af8_franz_josef': {
    learningObjective: 'Cascading hazard response and proportionate resource commitment to a single threat.',
    references: [
      { label: 'SAFER Framework, Section 3.4.1', desc: 'Cascading hazard identification and response' },
      { label: 'SAFER Framework, Section 3.3.1', desc: 'CDEM Group pairing: Canterbury supports West Coast' },
      { label: 'CIMS 3rd Ed, Section 4.5', desc: 'Operations function: resource allocation under scarcity' }
    ],
    teachingNote: 'This tests resource discipline. Option A (all helicopters) saves Franz Josef but leaves zero capacity for everything else. Option B (PIM only) is reckless because degraded comms make broadcast unreliable. Option C (combined) is the balanced approach that uses limited helicopters for vulnerable populations while leveraging community self-evacuation for the able-bodied. The consequence for Option A is brutal but realistic \u2014 fleet exhaustion from a single commitment.',
    discussionPrompts: [
      'How do you calculate the acceptable resource commitment to a single location?',
      'What information would you need before committing all helicopters?',
      'How does the dam break timeline affect your decision urgency?'
    ],
    bestPractice: 'C'
  },
  'af8_telecoms': {
    learningObjective: 'SAFER pairing obligations and the communication hierarchy in a multi-Group response.',
    references: [
      { label: 'SAFER Framework, Section 3.6.1', desc: 'Telecommunications plan implementation within 6 hours' },
      { label: 'SAFER Framework, Section 3.3.1', desc: 'Canterbury-West Coast pairing obligations' },
      { label: 'CIMS 3rd Ed, Section 8', desc: 'Intelligence function: information flow management' }
    ],
    teachingNote: 'Canterbury\u2019s primary obligation under SAFER is to its paired region (West Coast), not to NCMC. Option A (Canterbury-to-NCMC) is the institutional default but wrong \u2014 you cannot support the West Coast if you cannot talk to them. Wellington can wait; Greymouth cannot. This tests understanding of the SAFER pairing model versus the hierarchical instinct to report upward.',
    discussionPrompts: [
      'Does the pairing obligation override the reporting obligation to NCMC?',
      'What alternative means could maintain NCMC contact while prioritising West Coast?',
      'How does the 6-hour telecommunications plan timeline affect this decision?'
    ],
    bestPractice: 'B'
  },
  'af8_queenstown': {
    learningObjective: 'Application of the "no regrets" rapid relief philosophy under uncertainty.',
    references: [
      { label: 'SAFER Framework, Section 3.4.2b', desc: '"No regrets" rapid relief: push supplies based on estimated need' },
      { label: 'SAFER Framework, Section 3.3.1', desc: 'Queenstown Lakes: Otago-Southland pairing, Canterbury support' },
      { label: 'CIMS 3rd Ed, Section 5.2', desc: 'Logistics function: supply chain under degraded conditions' }
    ],
    teachingNote: 'This is the defining SAFER Framework decision. "No regrets" means pushing supplies before you have confirmed assessments. Option C (wait for airport) is exactly the kind of cautious, assessment-driven approach that the SAFER Framework was designed to overcome. The fatal consequence for Option C is intentionally severe because it demonstrates why "no regrets" exists \u2014 people die while you are optimising logistics.',
    discussionPrompts: [
      'What does "no regrets" mean operationally? Is there a cost threshold?',
      'How do you justify pushing supplies that might not be needed?',
      'If the Queenstown Airport had been usable, would Option C have been right?'
    ],
    bestPractice: 'A'
  },
  'af8_fuel': {
    learningObjective: 'Critical resource triage when all options have life-safety consequences.',
    references: [
      { label: 'SAFER Framework, Section 3.6.4', desc: 'Fuel and energy prioritisation' },
      { label: 'CDEM Act 2002, Section 60', desc: 'Lifeline utility responsibilities' },
      { label: 'NZ Health and Disability Standards', desc: 'Hospital generator fuel requirements' }
    ],
    teachingNote: 'There is no good answer here. Every option has a life-safety downside. Option A (hospitals first) is the least bad because it protects the greatest number of critical patients. Option B (helicopters first) is tempting for responders but hospital generator failure kills more people faster than grounded helicopters. This should generate the most heated discussion in any debrief.',
    discussionPrompts: [
      'How do you triage when all options have fatal consequences?',
      'Should fuel allocation decisions be made locally or nationally?',
      'What would you do if Canterbury DHB reported 24 hours of fuel instead of 48?'
    ],
    bestPractice: 'A'
  },
  'af8_recon': {
    learningObjective: 'Reconnaissance prioritisation under resource and time constraints.',
    references: [
      { label: 'SAFER Framework, Section 3.6.2', desc: 'Regional reconnaissance within 48 hours' },
      { label: 'SAFER Framework, Priority 9.a', desc: 'SAR priorities for reconnaissance' },
      { label: 'CIMS 3rd Ed, Section 8.3', desc: 'Intelligence function: reconnaissance coordination' }
    ],
    teachingNote: 'Zero-contact communities are the highest reconnaissance priority because you cannot assess their needs without reaching them. Infrastructure reconnaissance (Option B) enables planning but does not save lives today. Option A is correct because the SAFER Framework explicitly prioritises community contact over infrastructure assessment in the first 48 hours.',
    discussionPrompts: [
      'At what point does infrastructure reconnaissance become more important than community contact?',
      'How do you plan for Day 2 if you spend all remaining daylight on community contact?',
      'What can satellite imagery or NZDF overflights contribute without helicopter deployment?'
    ],
    bestPractice: 'A'
  },
  'af8_hospital': {
    learningObjective: 'Managing cascading health system failures with limited transport resources.',
    references: [
      { label: 'NZ Mass Casualty Plan', desc: 'Patient evacuation and triage protocols' },
      { label: 'Canterbury DHB Surge Capacity Plan', desc: 'Hospital system mutual support arrangements' },
      { label: 'CIMS 3rd Ed, Section 6.5', desc: 'Health emergency coordination' }
    ],
    teachingNote: 'The belt-and-suspenders approach (Option C) is correct because it protects against single-point failure. Fuel delivery alone (Option A) leaves you with no backup if delivery fails. Evacuation alone (Option B) is high-risk for ventilator patients in helicopter transport. The combined approach costs more resources but ensures patient survival under multiple failure scenarios.',
    discussionPrompts: [
      'What is the mortality risk of helicopter transport for ventilator patients?',
      'How do you communicate to Grey Base staff that evacuation is only a contingency?',
      'What triggers the transition from "fuel delivery" to "evacuate now"?'
    ],
    bestPractice: 'C'
  },
  'af8_evacuation': {
    learningObjective: 'Mass evacuation flow management and welfare registration under surge conditions.',
    references: [
      { label: 'CIMS 3rd Ed, Section 6.2', desc: 'Welfare function: registration and tracking' },
      { label: 'CDEM Act 2002, Section 86', desc: 'Evacuation powers and responsibilities' },
      { label: 'MFAT Consular Framework', desc: 'International visitor welfare during emergencies' }
    ],
    teachingNote: 'Option B (open floodgates) is a predictable failure because uncontrolled arrival overwhelms reception systems. The consequence of lost unaccompanied children is extreme but realistic \u2014 welfare registration exists to prevent exactly this. Option C (staged) is the strongest because it matches transport mode to population urgency and preserves reception system capacity.',
    discussionPrompts: [
      'How do you balance speed of evacuation against quality of reception?',
      'What is the Controller\u2019s obligation when welfare registration collapses?',
      'How would you handle a situation where 2,000 tourists demand immediate evacuation?'
    ],
    bestPractice: 'C'
  },
  'af8_usar_deploy': {
    learningObjective: 'International USAR deployment decision-making under imperfect information.',
    references: [
      { label: 'INSARAG Guidelines', desc: 'International USAR coordination and deployment' },
      { label: 'MCDEM International Assistance Framework', desc: 'Receiving and deploying international teams' },
      { label: 'CIMS 3rd Ed, Section 4.5', desc: 'Operations: specialist resource deployment' }
    ],
    teachingNote: 'Holding USAR at the airport (Option C) is the worst answer because survivability curves for trapped persons are steep \u2014 every hour of delay reduces survival probability. Greymouth (Option A) is the strongest choice because it has the largest affected population and confirmed collapses. The frustrated USAR commander consequence for Option C is based on real incidents where deployment delays generated international diplomatic friction.',
    discussionPrompts: [
      'What information is "good enough" to deploy a USAR team?',
      'How do you manage the political dynamics of international assistance?',
      'Should the USAR team commander have input on deployment location?'
    ],
    bestPractice: 'A'
  },
  'af8_weather_window': {
    learningObjective: 'Strategic pre-positioning under time pressure and deteriorating conditions.',
    references: [
      { label: 'SAFER Framework, Section 3.4.3', desc: 'Weather contingency planning' },
      { label: 'MetService Severe Weather Protocols', desc: 'Aviation weather advisory and grounding procedures' },
      { label: 'CIMS 3rd Ed, Section 5.4', desc: 'Logistics: pre-positioning and forward staging' }
    ],
    teachingNote: 'Option C (pre-positioning) is the most strategic choice because it positions resources where they will be needed during the weather window. Communities with supplies can shelter in place during bad weather. Option A (all evacuation) is tempting but leaves nothing in position for the 12-18 hours when helicopters are grounded. This tests whether players can think beyond the immediate and plan for the next operational period.',
    discussionPrompts: [
      'How do you explain to communities that evacuation has paused in favour of pre-positioning?',
      'What supplies are essential for a forward base that will operate without helicopter support for 18 hours?',
      'How does the weather window affect Day 2 transition planning?'
    ],
    bestPractice: 'C'
  },
  'af8_transition': {
    learningObjective: 'Operational continuity and staff welfare during sustained emergency response.',
    references: [
      { label: 'CIMS 3rd Ed, Section 3.8', desc: 'Shift management and operational periods' },
      { label: 'CDEM Staff Welfare Guidelines', desc: 'Fatigue management and duty hour limits' },
      { label: 'SAFER Framework, Section 3.5', desc: 'Sustained operations planning' }
    ],
    teachingNote: 'Option C (overlapping shift) is best practice because it preserves institutional knowledge during handover. Full rotation (Option A) loses critical context. Retaining key personnel (Option B) burns out your most important people. The 4-hour overlap costs double staffing but prevents the situational awareness gap that causes errors in the second operational period. This is a well-documented failure mode in prolonged emergencies.',
    discussionPrompts: [
      'What is the maximum effective duty period for an EOC Controller?',
      'How do you capture situational awareness for an incoming team?',
      'What tools or systems enable effective handover? Is a briefing sufficient?'
    ],
    bestPractice: 'C'
  }
};



// ============ NOISE INJECT SYSTEM ============
var NOISE_POOL = {
  local: [
    { tag: 'NOISE', title: 'Mayor Wants EOC Tour Before Media Interviews',
      body: 'The Mayor\u2019s Executive Assistant is calling the EOC asking when the Mayor can come through for a "quick familiarisation visit." The Mayor is doing media interviews in 90 minutes and wants to be seen at the EOC first. EA is insistent this is urgent.',
      source: 'Mayor\u2019s Office',
      prompt: 'How do you handle the Mayor?',
      options: [
        { key: 'A', label: 'Invite the Mayor in \u2014 give them a 10-minute walkthrough and a talking-points briefing', desc: 'Maintains political relationship. Mayor gets their photo op and accurate information for media. But 10 minutes of Controller time is 10 minutes not spent on the response.', effect: { score: 0 } },
        { key: 'B', label: 'PIM liaison briefs the Mayor offsite \u2014 Controller stays focused', desc: 'Delegates appropriately. Mayor gets the information without disrupting EOC operations. The right call for a Controller who understands their role is not tour guide.', effect: { score: 2 } },
        { key: 'C', label: 'Tell the Mayor the EOC is too busy and to call back later', desc: 'Protects EOC time but burns a political relationship you may need later when the Mayor controls council resources.', effect: { score: -1 } }
      ]
    },
    { tag: 'NOISE', title: 'Spontaneous Volunteers \u2014 80 People in the Lobby',
      body: '80 unregistered volunteers have arrived at Hereford Street offering to help. No ID, no training. Several are posting selfies from inside the building.',
      source: 'CCC Reception / Security',
      prompt: 'What do you do with 80 spontaneous volunteers?',
      options: [
        { key: 'A', label: 'Send them to Community Emergency Hubs where they can actually help', desc: 'Redirects energy to where it is useful. Hubs need hands. Keeps untrained volunteers out of the EOC. Quick registration at the door captures contact details.', effect: { score: 2 } },
        { key: 'B', label: 'Set up a volunteer registration desk and find tasks for them here', desc: 'Uses the energy but creates a management burden inside the EOC. Untrained volunteers in an operational facility create security and safety issues.', effect: { score: -1 } },
        { key: 'C', label: 'Thank them and send them home \u2014 we don\u2019t need unregistered help', desc: 'Clean but wasteful. 80 willing people turned away during a crisis looks terrible and undermines community goodwill.', effect: { score: 0 } }
      ]
    },
    { tag: 'PIM', title: 'Fake Tsunami Warning Going Viral on Facebook',
      body: 'A Facebook post claiming a tsunami warning has been issued for Christchurch has 4,000 shares in 20 minutes. There is no tsunami warning. 111 is receiving calls from panicking coastal residents.',
      source: 'PIM Function / NZ Police 111',
      prompt: 'How do you handle the misinformation?',
      options: [
        { key: 'A', label: 'Immediate PIM correction across all channels \u2014 radio, social media, website', desc: 'Fast and comprehensive. Gets the truth out before the misinformation causes physical harm. This is exactly what PIM exists for.', effect: { score: 2 } },
        { key: 'B', label: 'Ask NZ Police to contact Facebook to remove the post', desc: 'Addresses the source but takes hours. Meanwhile the misinformation spreads and people are self-evacuating onto damaged roads.', effect: { score: -2 } },
        { key: 'C', label: 'Ignore it \u2014 it will self-correct when no official warning appears', desc: 'It will not self-correct. Social media misinformation accelerates. People are already evacuating.', effect: { score: -3 } }
      ]
    },
    { tag: 'NOISE', title: 'MP Demanding Helicopter for Electorate Visit',
      body: 'The local MP\u2019s office is calling demanding a helicopter to fly the MP to the eastern suburbs "to show solidarity." The staffer says this is "the Minister\u2019s request" but cannot confirm which Minister.',
      source: 'Parliamentary Services',
      prompt: 'How do you respond?',
      options: [
        { key: 'A', label: 'Decline \u2014 all helicopter capacity is committed to response operations', desc: 'Correct. Helicopters are life-safety assets, not political transport. If the MP wants to visit, they can drive. Vague ministerial authority claims do not override operational priorities.', effect: { score: 2 } },
        { key: 'B', label: 'Offer a ground escort to the eastern suburbs instead', desc: 'Compromise that respects the political relationship without diverting response assets. MP gets their visit, you keep your helicopters.', effect: { score: 1 } },
        { key: 'C', label: 'Provide the helicopter \u2014 political support is important for the response', desc: 'Every helicopter diverted to political transport is a helicopter not delivering fuel, evacuating patients, or supporting USAR. This is a Controller being captured by political pressure.', effect: { score: -2 } }
      ]
    },
    { tag: 'NOISE', title: 'Staff Haven\u2019t Eaten in 9 Hours',
      body: 'The Safety Officer reports the Controller and three section leads have not eaten or taken a break since activation. One staff member\u2019s hands are shaking. No relief staff are available.',
      source: 'Safety Officer',
      prompt: 'How do you handle staff welfare?',
      options: [
        { key: 'A', label: 'Mandatory 15-minute breaks in rotation \u2014 someone covers while you eat', desc: 'The Safety Officer is right. Fatigued staff make bad decisions. Rotating breaks maintain operational capacity. A Controller who ignores their own Safety Officer is undermining the CIMS structure.', effect: { score: 2 } },
        { key: 'B', label: 'Get food delivered to the EOC \u2014 eat at your stations', desc: 'Keeps people working but does not address the fatigue. Eating while making decisions is not a break. The staff member showing stress symptoms needs to step away, not have a sandwich at their desk.', effect: { score: 0 } },
        { key: 'C', label: 'Push through \u2014 we\u2019ll rest when the situation stabilises', desc: 'The situation will not stabilise for days. This is the fast track to decision fatigue, errors, and staff burnout. The Safety Officer exists to prevent exactly this.', effect: { score: -2 } }
      ]
    },
    { tag: 'NOISE', title: 'Insurance Assessors Requesting Building Data',
      body: 'Three insurance companies have sent assessors to the EOC requesting access to building damage assessment data. They say they need it "urgently" to begin processing claims.',
      source: 'Insurance Council NZ',
      prompt: 'Do you share preliminary assessment data?',
      options: [
        { key: 'A', label: 'No \u2014 preliminary assessments are operational tools, not insurance documents. Formal data release through proper channels later.', desc: 'Correct. Preliminary rapid assessments are for life-safety decisions, not insurance claims. Sharing them creates legal liability and may be inaccurate. Formal building assessments come later.', effect: { score: 2 } },
        { key: 'B', label: 'Share it \u2014 faster claims processing helps residents recover sooner', desc: 'Well-intentioned but premature data release creates legal problems. Preliminary assessments change as buildings are re-inspected. Insurance decisions based on Day 1 data will be wrong.', effect: { score: -1 } },
        { key: 'C', label: 'Refer them to MBIE \u2014 building assessment data is their responsibility', desc: 'Appropriate referral but MBIE is not yet deployed. The assessors will come back tomorrow asking the same question.', effect: { score: 1 } }
      ]
    },
    { tag: 'NOISE', title: 'CNN Crew Breached the CBD Cordon',
      body: 'A CNN camera crew followed an ambulance through a checkpoint and is filming inside the restricted zone near a collapse site. USAR operations have paused. The crew is refusing to leave.',
      source: 'NZ Police / USAR TF2',
      prompt: 'How do you handle the media incursion?',
      options: [
        { key: 'A', label: 'Police remove them immediately \u2014 this is a safety zone, not a film set', desc: 'Non-negotiable. Unauthorised personnel in a USAR worksite are both at risk and disrupting life-saving operations. Cordon integrity is a safety function, not censorship.', effect: { score: 2 } },
        { key: 'B', label: 'Let them film for 5 minutes under escort, then escort them out', desc: 'Compromise that gets coverage while limiting exposure. But every minute USAR is paused is a minute of survivability lost for anyone trapped.', effect: { score: -1 } },
        { key: 'C', label: 'Assign a PIM escort and use this as an opportunity for controlled media access', desc: 'Forward-thinking but the wrong moment. USAR has paused operations. Get the crew out first, then establish a controlled access protocol for next time.', effect: { score: 0 } }
      ]
    },
    { tag: 'NOISE', title: 'D4H System Outage \u2014 Welfare Registration Down',
      body: 'D4H has gone offline due to high latency from simultaneous access across all South Island CDEM Groups. Welfare registration, task tracking, and situation reporting are all down.',
      source: 'EOC IT / D4H Support',
      prompt: 'How do you handle the system outage?',
      options: [
        { key: 'A', label: 'Revert to paper-based systems immediately \u2014 don\u2019t wait for restoration', desc: 'Correct. Paper backup exists for exactly this reason. Waiting for IT restoration while welfare registration stalls means displaced people are untracked. Paper can be entered digitally later.', effect: { score: 2 } },
        { key: 'B', label: 'IT prioritises D4H restoration \u2014 we need the digital system', desc: 'IT cannot fix a cloud server latency issue from the EOC. This is a provider-side problem. Waiting loses registration data for every evacuee arriving during the outage.', effect: { score: -1 } },
        { key: 'C', label: 'Use spreadsheets on local laptops as a workaround', desc: 'Better than nothing but creates data silos. When D4H comes back, someone has to reconcile multiple spreadsheets. Paper forms are the planned fallback for a reason.', effect: { score: 0 } }
      ]
    },
    { tag: 'NOISE', title: 'Talkback Radio Caller Says EOC Is "Doing Nothing"',
      body: 'NewstalkZB is running a talkback segment where callers are criticising the response. A "former emergency manager" is telling listeners the EOC is paralysed. The host wants a PIM spokesperson on air live.',
      source: 'NewstalkZB / PIM Function',
      prompt: 'Do you send someone on talkback radio?',
      options: [
        { key: 'A', label: 'PIM spokesperson goes on air with key messages and factual updates', desc: 'Proactive PIM. Controls the narrative with facts. Talkback radio reaches the demographics most likely to be anxious and least likely to use social media. This is where your audience is.', effect: { score: 2 } },
        { key: 'B', label: 'Decline \u2014 we don\u2019t respond to talkback radio criticism', desc: 'The narrative fills itself if you leave a vacuum. The "former emergency manager" becomes the expert voice. By tonight, "EOC doing nothing" is the story.', effect: { score: -2 } },
        { key: 'C', label: 'Issue a written press release instead of going on air', desc: 'Safer but wrong medium. Talkback listeners are listening, not reading. A press release does not counter a live radio narrative.', effect: { score: 0 } }
      ]
    },
    { tag: 'NOISE', title: 'Lost Child at Community Hub \u2014 No Interpreter Available',
      body: 'A 6-year-old has been found unaccompanied and crying at Linwood Hub. Limited English \u2014 appears to be from a refugee background. Hub volunteers have no child protection training. Oranga Tamariki has a 4-hour wait.',
      source: 'Linwood Hub Coordinator',
      prompt: 'How do you manage this?',
      options: [
        { key: 'A', label: 'NZ Police welfare check \u2014 child protection is a Police function when Oranga Tamariki is unavailable', desc: 'Correct escalation. Police have child protection responsibilities and interpreter access through Language Line. This is not a volunteer-level task.', effect: { score: 2 } },
        { key: 'B', label: 'Keep the child at the Hub with volunteers until Oranga Tamariki responds', desc: 'Four hours is too long to leave a distressed child with untrained volunteers who have no legal authority. If something goes wrong, the liability sits with the Controller who made this decision.', effect: { score: -1 } },
        { key: 'C', label: 'Contact Red Cross \u2014 they have family tracing capability', desc: 'Red Cross Restoring Family Links is the right tool for family reunification. But the immediate safety issue needs Police, not a tracing service. Both should be activated.', effect: { score: 1 } }
      ]
    },
    { tag: 'NOISE', title: 'CCC Staff Member\u2019s House Damaged \u2014 Asking to Leave',
      body: 'A Logistics staff member has just learned their Avondale home has liquefaction damage. They\u2019re asking to leave. Two others are quietly checking phones about their own homes.',
      source: 'Safety Officer',
      prompt: 'How do you handle this?',
      options: [
        { key: 'A', label: 'Let them go \u2014 arrange a welfare check on other staff homes proactively', desc: 'Correct. You cannot order people to ignore their own family safety. Proactive welfare checks for all EOC staff prevent this from becoming a cascade of departures. The ones who stay will stay because they know their families are accounted for.', effect: { score: 2 } },
        { key: 'B', label: 'Ask them to stay until shift change \u2014 their home isn\u2019t going anywhere', desc: 'Technically true but deeply callous. Staff who feel trapped in the EOC while worrying about their families make poor decisions and harbour resentment.', effect: { score: -1 } },
        { key: 'C', label: 'Release them but note this as an HR issue for later', desc: 'Framing a staff member\u2019s concern for their damaged home as an HR issue is exactly the kind of institutional response that destroys morale and retention.', effect: { score: -2 } }
      ]
    },
    { tag: 'NOISE', title: 'Helicopter Company Refusing to Fly Until Invoice Confirmed',
      body: 'A private helicopter operator is refusing further flights until payment terms are confirmed in writing. Their two helicopters are 15% of your rotary capacity. Finance has no delegated authority above $50K.',
      source: 'Logistics / Finance',
      prompt: 'How do you resolve the helicopter payment dispute?',
      options: [
        { key: 'A', label: 'Controller authorises under emergency procurement provisions \u2014 deal with paperwork later', desc: 'Emergency procurement provisions exist for exactly this. The CDEM Act gives Controllers authority to requisition resources. A verbal commitment backed by the declaration is legally sufficient.', effect: { score: 2 } },
        { key: 'B', label: 'Escalate to Group Controller for financial authority', desc: 'Appropriate chain of command but adds delay. Those two helicopters are grounded while the request moves up the hierarchy.', effect: { score: 0 } },
        { key: 'C', label: 'Find alternative helicopter providers', desc: 'In a national emergency, every helicopter in the South Island is already committed. There are no alternatives. This problem needs to be solved, not routed around.', effect: { score: -1 } }
      ]
    },
    { tag: 'NOISE', title: 'Unsolicited Donations Blocking the Loading Dock',
      body: '6 vehicles of unpackaged clothing and canned food have arrived claiming they were "sent by the Red Cross." Red Cross denies involvement. The goods are blocking the logistics loading dock where response supplies are staged.',
      source: 'CCC Reception / Logistics',
      prompt: 'What do you do with the unsolicited donations?',
      options: [
        { key: 'A', label: 'Thank them, redirect to a Salvation Army collection point, clear the loading dock immediately', desc: 'Preserves goodwill while protecting operational logistics. Salvation Army has the infrastructure to sort and distribute donations. The loading dock is a response asset, not a drop-off point.', effect: { score: 2 } },
        { key: 'B', label: 'Accept the goods and find somewhere to store them', desc: 'Now you have unsorted used clothing taking up space that should hold emergency supplies. Someone has to sort it. That someone is a response worker diverted from actual work.', effect: { score: -1 } },
        { key: 'C', label: 'Turn them away \u2014 we did not request donations', desc: 'Correct operationally but the optics of refusing donated goods during an emergency are terrible. These people will go to the media.', effect: { score: 0 } }
      ]
    },
    { tag: 'NOISE', title: 'EOC Air Conditioning Has Failed',
      body: 'HVAC has failed. Temperature is 28\u00B0C and rising with 45 people in a sealed building. Facilities says the repair tech is "unavailable due to the emergency." Tempers are shortening.',
      source: 'JESP Facilities / Safety Officer',
      prompt: 'How do you handle the environment?',
      options: [
        { key: 'A', label: 'Rotate non-essential staff outside in 30-minute shifts, get portable fans from the nearest hardware store', desc: 'Practical. Addresses the immediate problem without shutting down operations. Heat degrades cognitive function \u2014 this is a safety issue, not a comfort issue.', effect: { score: 2 } },
        { key: 'B', label: 'Relocate the EOC to Hereford Street', desc: 'A full EOC relocation during active operations is a 2-4 hour disruption. You lose continuity, comms infrastructure, and co-location with the Group ECC. Disproportionate response to a temperature problem.', effect: { score: -2 } },
        { key: 'C', label: 'Push through \u2014 it\u2019s uncomfortable but not dangerous', desc: '28\u00B0C and rising in a sealed room with 45 stressed people is a health risk, not just discomfort. The Safety Officer has flagged it for a reason.', effect: { score: -1 } }
      ]
    }
  ],
  af8: [
    { tag: 'NOISE', title: 'NCMC Changed the SitRep Template Mid-Response',
      body: 'NCMC has emailed a new situation report template. They want the reformatted SitRep within 45 minutes. Intelligence says reformatting will take 2 hours. NCMC says the Minister needs it for a press conference.',
      source: 'NCMC / Intelligence Function',
      prompt: 'How do you handle the template change?',
      options: [
        { key: 'A', label: 'Send the existing SitRep in the current format with a note that reformatting will follow', desc: 'Correct. The information matters more than the format. The Minister needs content, not a template. Reformatting can happen when Intelligence has capacity.', effect: { score: 2 } },
        { key: 'B', label: 'Divert Intelligence staff to reformatting \u2014 NCMC outranks us', desc: 'NCMC sets priorities but formatting compliance is not an operational priority. Every hour Intelligence spends on reformatting is an hour not spent on actual situational awareness.', effect: { score: -1 } },
        { key: 'C', label: 'Call NCMC and push back \u2014 the template change is unreasonable during active operations', desc: 'Reasonable pushback but the tone matters. A collaborative call explaining the constraint is fine. An adversarial refusal damages the relationship when you need NCMC support.', effect: { score: 1 } }
      ]
    },
    { tag: 'NOISE', title: 'Satellite Phone Batteries Dying \u2014 No Compatible Cables',
      body: 'Three of five satellite phones are low on battery. The only link to Haast (200 isolated residents) has 8% remaining. Nobody can find compatible charging cables.',
      source: 'EOC IT / Telecommunications',
      prompt: 'How do you manage the satellite phone crisis?',
      options: [
        { key: 'A', label: 'Ration remaining battery \u2014 scheduled 5-minute check-ins only, no extended calls', desc: 'Maximises remaining battery life. Structured check-ins ensure critical information flows while preserving the link. Send someone to find cables from emergency supply stores or NZDF Burnham.', effect: { score: 2 } },
        { key: 'B', label: 'Use the remaining battery to get a full situation update from Haast before it dies', desc: 'Gets information now but burns the only link. Once the phone dies, Haast has zero contact until cables are found. Trading sustained connectivity for a single data dump.', effect: { score: 0 } },
        { key: 'C', label: 'Request NZDF Burnham supply compatible chargers immediately', desc: 'Good idea but "immediately" from Burnham is still 30-60 minutes. The phone may be dead by then. This should happen AND you need to ration the battery now.', effect: { score: 1 } }
      ]
    },
    { tag: 'NOISE', title: 'PM\u2019s Office Requesting Helicopter Tour of West Coast',
      body: 'The PM\u2019s Office wants a helicopter for the PM tomorrow morning to tour West Coast damage. They want the Group Controller to accompany. PM\u2019s security needs a 2-hour pre-flight route assessment today.',
      source: 'DPMC / PM\u2019s Office',
      prompt: 'How do you respond to the PM\u2019s request?',
      options: [
        { key: 'A', label: 'Decline the helicopter \u2014 offer a fixed-wing overflight from Christchurch Airport instead', desc: 'Protects helicopter capacity while meeting the PM\u2019s need for a visual. Fixed-wing overflight uses a different asset class. PM sees the damage without diverting response resources.', effect: { score: 2 } },
        { key: 'B', label: 'Provide the helicopter and accompany the PM \u2014 political support enables resource allocation', desc: 'The PM seeing damage firsthand can unlock funding and political will. But the Controller\u2019s absence from the EOC during a critical period is a significant operational cost. And the security pre-flight ties up another helicopter today.', effect: { score: -1 } },
        { key: 'C', label: 'Agree to the tour but send the Deputy Controller \u2014 Controller stays at EOC', desc: 'Good compromise. PM gets the tour, Controller stays operational, Deputy gets political exposure. But still costs a helicopter and the security pre-flight assessment.', effect: { score: 1 } }
      ]
    },
    { tag: 'NOISE', title: 'Australian USAR Team \u2014 Halal Meals and Fresh Coffee',
      body: 'The Australian USAR logistics liaison is requesting halal and gluten-free meal options. Three team members have severe allergies. They are also requesting fresh coffee, not instant. The team will not eat until this is confirmed.',
      source: 'Australian USAR TF1 Logistics',
      prompt: 'How do you handle the catering request?',
      options: [
        { key: 'A', label: 'Source halal and allergen-safe meals from local suppliers \u2014 this is a legitimate welfare requirement', desc: 'Correct. Dietary requirements for deployed international teams are not optional. Halal is a religious obligation, allergies are a medical one. A team that cannot eat cannot work. The coffee is a bonus but a functional workforce is the goal.', effect: { score: 2 } },
        { key: 'B', label: 'Tell them to eat what\u2019s available \u2014 this is an emergency, not a restaurant', desc: 'Fails basic host nation obligations under INSARAG guidelines. International teams deploy under agreements that include welfare provisions. Alienating a 72-person USAR team over catering is a spectacular own goal.', effect: { score: -2 } },
        { key: 'C', label: 'Escalate to MFAT \u2014 international team welfare is their responsibility', desc: 'Technically correct but adds delay. MFAT can coordinate but someone local needs to actually source the food. The liaison is asking the EOC because the EOC has local knowledge.', effect: { score: 0 } }
      ]
    },
    { tag: 'NOISE', title: 'Day 2 Staff Refusing Handover \u2014 "No Confidence"',
      body: 'Three incoming Day 2 staff members are refusing to take over, claiming Day 1 colleagues "made bad decisions." Two have declared "no confidence" in the current strategy. The shift handover is stalling.',
      source: 'EOC HR / Safety Officer',
      prompt: 'How do you handle the insubordination?',
      options: [
        { key: 'A', label: 'Direct conversation: acknowledge concerns, but handover proceeds as planned \u2014 strategy review happens after', desc: 'Correct. Operational disagreements are valid but do not override handover protocols. Staff can raise concerns through proper channels after they are on shift. A Controller who lets individual staff veto handover has lost control of the EOC.', effect: { score: 2 } },
        { key: 'B', label: 'Replace the three dissenting staff with alternates', desc: 'Solves the immediate problem but signals that disagreement gets you removed. The dissenters may have valid concerns that get lost. Also assumes you have 3 qualified alternates available.', effect: { score: 0 } },
        { key: 'C', label: 'Pause the handover and conduct a full strategy review with both shifts', desc: 'A strategy review during shift handover is a 2-hour operational pause. The response does not stop because staff disagree. This is exactly how handover failures cascade into response failures.', effect: { score: -2 } }
      ]
    },
    { tag: 'PIM', title: 'Fake Rescue Photo Going Viral \u2014 Nepal 2015 Image',
      body: 'A manipulated photo showing a "baby pulled from rubble in Greymouth" has 12,000 shares. It is actually from the 2015 Nepal earthquake. International media are picking it up. Contradicting it will look callous.',
      source: 'PIM Function / Social Media Monitoring',
      prompt: 'How do you handle the fake image?',
      options: [
        { key: 'A', label: 'PIM issues a factual correction with the real image source \u2014 calm, professional, no accusation', desc: 'Correct. State the facts without attacking the people who shared it. "This image is from Nepal 2015 and does not show the current event. Current verified images are available at [link]." Protects credibility without looking callous.', effect: { score: 2 } },
        { key: 'B', label: 'Ignore it \u2014 correcting it draws more attention to it', desc: 'The Streisand Effect argument. But this image is already being used by international media as fact. Silence is complicity in misinformation. When the truth emerges, your credibility suffers for not correcting it.', effect: { score: -1 } },
        { key: 'C', label: 'Contact the social media platforms to remove the post', desc: 'Takes days. The image has already been downloaded and re-shared thousands of times. Platform takedown is not a real-time misinformation tool.', effect: { score: 0 } }
      ]
    },
    { tag: 'NOISE', title: 'Lyttelton Tunnel Engineer Demanding Structural Inspection',
      body: 'An LPC engineer is demanding an immediate tunnel inspection citing "unusual cracking patterns." Closing the tunnel halts all fuel distribution for 6-8 hours. NZTA says it passed the rapid post-quake assessment.',
      source: 'LPC Engineering / NZTA',
      prompt: 'Do you close the tunnel for inspection?',
      options: [
        { key: 'A', label: 'NZTA rapid assessment stands \u2014 schedule a full inspection during a planned maintenance window overnight', desc: 'Balances safety with operational need. The rapid assessment was conducted by qualified engineers. A full inspection is warranted but can be timed to minimise fuel disruption.', effect: { score: 2 } },
        { key: 'B', label: 'Close the tunnel immediately for the full 6-8 hour inspection', desc: 'Six hours without fuel distribution when hospitals are running on generators. The engineer has a legitimate concern but the rapid assessment process exists to enable continued operations while monitoring.', effect: { score: -2 } },
        { key: 'C', label: 'Reduce traffic to single-lane alternating while engineers do a visual inspection', desc: 'Compromise. Maintains flow at reduced capacity while addressing the concern. But slows fuel throughput by 50% during a supply crisis.', effect: { score: 1 } }
      ]
    },
    { tag: 'NOISE', title: 'Fuel Tanker Driver Exceeding Legal Driving Hours',
      body: 'NZTA has flagged a fuel tanker driver who has exceeded legal hours by 3 hours. The driver says "people need fuel." NZTA says they must stop immediately. This driver handles 30% of today\u2019s fuel throughput.',
      source: 'NZTA Road Safety',
      prompt: 'What do you direct?',
      options: [
        { key: 'A', label: 'Driver stops \u2014 find a replacement immediately from the fuel company or NZDF', desc: 'Fatigue management regulations exist because tired drivers kill people. A fatigued tanker driver on damaged roads carrying thousands of litres of fuel is an unacceptable risk. Replacement now, not later.', effect: { score: 2 } },
        { key: 'B', label: 'One more run, then mandatory rest \u2014 we need the throughput', desc: 'One more run with a driver who is 3 hours past their limit. If they crash a fuel tanker, you lose 30% of throughput permanently, damage the road, and potentially kill someone. The risk calculus is clear.', effect: { score: -1 } },
        { key: 'C', label: 'Request NZTA issue an emergency exemption for the driver', desc: 'NZTA will not exempt a driver who is already past the limit. The regulation exists because fatigued driving causes crashes. Emergency exemptions are for extending limits, not ignoring them after the fact.', effect: { score: -1 } }
      ]
    },
    { tag: 'NOISE', title: 'Amateur Radio Report \u2014 "40 Trapped in Fox Glacier"',
      body: 'An amateur radio operator is reporting 40 people trapped in a collapsed hotel in Fox Glacier. NZDF aerial recon showed the township largely intact. The report is being relayed across the AREC network to multiple agencies.',
      source: 'AREC Network / Intelligence',
      prompt: 'How do you handle the conflicting report?',
      options: [
        { key: 'A', label: 'Log it as unverified, request NZDF confirm with a second pass, do not commit resources until verified', desc: 'Correct. Unverified reports from a single source do not override aerial reconnaissance. But you cannot ignore it either. A second NZDF pass or helicopter recon confirms or denies without committing ground resources.', effect: { score: 2 } },
        { key: 'B', label: 'Deploy a USAR team to Fox Glacier immediately \u2014 40 trapped people cannot wait for verification', desc: 'Emotional response. If NZDF recon showed the township intact, deploying USAR based on a single unverified radio report diverts resources from confirmed collapse sites. If the report is wrong, you have wasted hours.', effect: { score: -2 } },
        { key: 'C', label: 'Dismiss it \u2014 NZDF recon is more reliable than amateur radio', desc: 'Probably correct but dismissing without verification is dangerous. NZDF overflew at altitude; the operator may be on the ground. What if NZDF missed a collapse that happened after the overflight?', effect: { score: 0 } }
      ]
    },
    { tag: 'NOISE', title: 'Someone Erased the Main Situation Whiteboard',
      body: 'The main situation awareness whiteboard \u2014 operational priorities, key contacts, helicopter tasking \u2014 has been accidentally wiped while cleaning. Nobody took a photo. Reconstruction from memory will take 30 minutes and may contain errors.',
      source: 'Intelligence Function',
      prompt: 'How do you recover?',
      options: [
        { key: 'A', label: 'Intelligence reconstructs from the last SitRep plus section leads confirm their areas \u2014 implement a photo-before-cleaning rule going forward', desc: 'Pragmatic recovery. The SitRep should contain most of the information. Section leads fill gaps. The real fix is procedural \u2014 never erase the board without photographing it first.', effect: { score: 2 } },
        { key: 'B', label: 'Treat this as a full situational awareness reset \u2014 call all sections in for a 30-minute stand-up', desc: 'Overkill. A 30-minute all-hands stand-up during active operations because someone wiped a whiteboard is a disproportionate response. Section leads can confirm their data without stopping everything.', effect: { score: 0 } },
        { key: 'C', label: 'Switch to a digital situation board \u2014 prevent this from happening again', desc: 'A system migration during active operations is a guaranteed way to lose more data than the whiteboard contained. Fix the process, not the technology. Digital migration happens between operational periods.', effect: { score: -1 } }
      ]
    },
    { tag: 'NOISE', title: 'GIS Mapping System Crashed \u2014 Licence Issue',
      body: 'ArcGIS has crashed due to too many concurrent users across South Island CDEM Groups. All digital mapping is offline. Damage overlays, road status, helicopter tracking \u2014 gone. Paper maps are being pulled from storage.',
      source: 'Intelligence / ESRI NZ',
      prompt: 'How do you handle the mapping outage?',
      options: [
        { key: 'A', label: 'Paper maps with acetate overlays \u2014 Intelligence marks up the wall map from the last known state', desc: 'The old way works. Paper maps with grease pencil overlays served EOCs for decades. Intelligence can reconstruct the current picture from the last SitRep. GIS comes back when it comes back.', effect: { score: 2 } },
        { key: 'B', label: 'Contact ESRI NZ for emergency licence expansion', desc: 'Worth trying but this is a provider-side issue during a national emergency affecting all CDEM Groups. Resolution is hours away at best. You need mapping now.', effect: { score: 0 } },
        { key: 'C', label: 'Use Google Maps on personal phones as a workaround', desc: 'Google Maps does not show damage overlays, road closures, or helicopter tracks. It is a navigation tool, not an operational mapping system. Using it as a substitute degrades situational awareness.', effect: { score: -1 } }
      ]
    },
    { tag: 'NOISE', title: 'NZDF Requesting EOC Wi-Fi Password',
      body: 'NZDF signals staff at Burnham need the JESP Wi-Fi password to access the shared situation platform. IT security policy prohibits sharing. NZDF\u2019s own satellite link cannot access the platform due to firewall settings. Planning meeting starts in 20 minutes.',
      source: 'NZDF Signals / EOC IT',
      prompt: 'Wi-Fi access for NZDF?',
      options: [
        { key: 'A', label: 'Controller overrides IT policy \u2014 create a guest network or temporary access for NZDF liaison devices only', desc: 'Correct. IT security policy was written for normal operations. A national emergency with NZDF as a key response partner requires flexible access. A guest network with limited access is the compromise.', effect: { score: 2 } },
        { key: 'B', label: 'IT policy stands \u2014 NZDF needs to fix their own connectivity', desc: 'Technically correct, operationally stupid. The planning meeting starts in 20 minutes. If NZDF cannot access the situation platform, the planning meeting produces plans based on incomplete information.', effect: { score: -2 } },
        { key: 'C', label: 'Print the situation data and physically deliver it to Burnham', desc: 'Workaround that costs a courier trip to Burnham (30 min each way) and delivers a static snapshot instead of live data. By the time it arrives, it is already outdated.', effect: { score: -1 } }
      ]
    }
  ]
};

// Noise injection configuration
var NOISE_CONFIG = {
  minGap: 3,
  maxGap: 5,
  startAfterEvent: 3
};

var noiseState = {
  nextNoiseIn: 0,
  pool: [],
  poolIndex: 0
};

function initNoisePool() {
  var pool = NOISE_POOL[GameState.scenario] || [];
  noiseState.pool = pool.slice();
  for (var i = noiseState.pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = noiseState.pool[i];
    noiseState.pool[i] = noiseState.pool[j];
    noiseState.pool[j] = temp;
  }
  noiseState.poolIndex = 0;
  noiseState.nextNoiseIn = NOISE_CONFIG.startAfterEvent + Math.floor(Math.random() * 3);
}

function shouldInjectNoise() {
  if (GameState.eventIndex < NOISE_CONFIG.startAfterEvent) return false;
  if (noiseState.poolIndex >= noiseState.pool.length) return false;
  noiseState.nextNoiseIn--;
  if (noiseState.nextNoiseIn <= 0) {
    noiseState.nextNoiseIn = NOISE_CONFIG.minGap + Math.floor(Math.random() * (NOISE_CONFIG.maxGap - NOISE_CONFIG.minGap + 1));
    return true;
  }
  return false;
}

function getNextNoise() {
  if (noiseState.poolIndex >= noiseState.pool.length) return null;
  var noise = noiseState.pool[noiseState.poolIndex];
  noiseState.poolIndex++;
  return noise;
}


// ============ RESPONSE METRICS (SOFT METRICS) ============
var SOFT_METRIC_DEFAULTS = {
  political: { label: 'Political Capital', value: 60, icon: '\uD83C\uDFDB' },
  publicTrust: { label: 'Public Trust', value: 55, icon: '\uD83E\uDD1D' },
  staffCapacity: { label: 'Staff Capacity', value: 70, icon: '\u26A1' },
  legalStanding: { label: 'Legal Standing', value: 65, icon: '\u2696\uFE0F' },
  mediaPosition: { label: 'Media Position', value: 50, icon: '\uD83D\uDCF0' },
  interagency: { label: 'Interagency', value: 55, icon: '\uD83D\uDD17' },
  communityRes: { label: 'Community', value: 50, icon: '\uD83C\uDFE0' }
};

var SOFT_METRIC_EFFECTS = {
  // Canterbury Local
  'eoc_level': { 'A': { interagency: -5 }, 'B': { interagency: 8, political: 3 }, 'C': { interagency: 5 }, 'D': { staffCapacity: -10, publicTrust: -5 } },
  'airport_priority': { 'A': { political: -5, interagency: 5 }, 'B': { legalStanding: -8, publicTrust: -5, mediaPosition: -10 }, 'C': { political: 3 }, 'D': { political: -10, legalStanding: -5 } },
  'welfare_split': { 'A': { publicTrust: -10, communityRes: -8, political: -5 }, 'B': { staffCapacity: -5 }, 'C': { communityRes: 10, publicTrust: 5 }, 'D': { interagency: -15, political: -10 } },
  'evacuee_reception': { 'A': { staffCapacity: -3 }, 'B': { interagency: 5, staffCapacity: -5 }, 'C': { interagency: 3 } },
  'fuel_priority': { 'A': { political: 5, interagency: -8 }, 'B': { interagency: 8, legalStanding: 5 }, 'C': { interagency: 3 }, 'D': { political: -8, publicTrust: -5 } },
  'psychosocial': { 'A': { publicTrust: 5, staffCapacity: -3 }, 'B': { publicTrust: -10, mediaPosition: -5 }, 'C': { publicTrust: 8, communityRes: 5, staffCapacity: -5 }, 'D': { staffCapacity: 5, interagency: -10, publicTrust: -5 } },
  'water_response': { 'A': { publicTrust: -3 }, 'B': { interagency: 8, publicTrust: 5 }, 'C': { interagency: 10, communityRes: 5 }, 'D': { publicTrust: -8, legalStanding: -3 } },
  'nzdf_staging': { 'A': { interagency: 8 }, 'B': { interagency: -12, political: -5 }, 'C': { interagency: 5, staffCapacity: -5 }, 'D': { legalStanding: -10, interagency: -8 } },
  'accommodation': { 'A': { political: -5, legalStanding: -3 }, 'B': { publicTrust: -10, mediaPosition: -8 }, 'C': { communityRes: 8, publicTrust: 5 } },
  'movement_control': { 'A': { political: -3, interagency: 5 }, 'B': { political: -12, publicTrust: -10, legalStanding: -5 }, 'C': { mediaPosition: -5 }, 'D': { political: -15, publicTrust: -15, legalStanding: -10 } },
  'media_management': { 'A': { mediaPosition: 8, political: 3 }, 'B': { mediaPosition: -10, publicTrust: -5 }, 'C': { mediaPosition: 10, staffCapacity: -3 } },
  'port_resilience': { 'A': { interagency: 5 }, 'B': { interagency: 3 }, 'C': { interagency: -3 } },
  'declaration': { 'A': { political: 5, legalStanding: 5, publicTrust: -5 }, 'B': { legalStanding: 3 }, 'C': { legalStanding: -3 } },
  // AF8 Regional
  'af8_declaration': { 'A': { legalStanding: 5, political: 3 }, 'B': { legalStanding: -10, political: -5, interagency: -5 }, 'C': { legalStanding: 8, political: 5, interagency: 5 }, 'D': { legalStanding: -15, publicTrust: -12 } },
  'af8_franz_josef': { 'A': { publicTrust: 5, interagency: -5, staffCapacity: -5 }, 'B': { publicTrust: -10, communityRes: -5 }, 'C': { publicTrust: 5, communityRes: 5 }, 'D': { interagency: -15, publicTrust: -12, political: -10 } },
  'af8_telecoms': { 'A': { interagency: -8, political: 3 }, 'B': { interagency: 8 }, 'C': { interagency: -3 } },
  'af8_queenstown': { 'A': { publicTrust: 8, staffCapacity: -5 }, 'B': { interagency: 5 }, 'C': { publicTrust: -15, mediaPosition: -10, political: -8 }, 'D': { interagency: -5 } },
  'af8_fuel': { 'A': { legalStanding: 5, staffCapacity: -3 }, 'B': { publicTrust: -10, legalStanding: -5 }, 'C': { interagency: 3 }, 'D': { political: -8, publicTrust: -5 } },
  'af8_recon': { 'A': { publicTrust: 5, communityRes: 3 }, 'B': { interagency: 3 }, 'C': { staffCapacity: -3 } },
  'af8_hospital': { 'A': { interagency: 3 }, 'B': { staffCapacity: -5 }, 'C': { interagency: 5, legalStanding: 3 }, 'D': { legalStanding: -15, publicTrust: -10, mediaPosition: -10 } },
  'af8_evacuation': { 'A': { interagency: 5 }, 'B': { publicTrust: -8, mediaPosition: -8, legalStanding: -5 }, 'C': { interagency: 5, publicTrust: 5 } },
  'af8_usar_deploy': { 'A': { interagency: 8, mediaPosition: 5 }, 'B': { interagency: 5 }, 'C': { interagency: -10, mediaPosition: -8, political: -5 }, 'D': { interagency: -8 } },
  'af8_weather_window': { 'A': { staffCapacity: -5 }, 'B': { staffCapacity: -3 }, 'C': { interagency: 5 }, 'D': { legalStanding: -12, staffCapacity: -8, publicTrust: -5 } },
  'af8_transition': { 'A': { staffCapacity: 8 }, 'B': { staffCapacity: -8 }, 'C': { staffCapacity: 10, interagency: 3 }, 'D': { staffCapacity: -15, legalStanding: -8 } }
};

function initSoftMetrics() {
  GameState.softMetrics = {};
  for (var key in SOFT_METRIC_DEFAULTS) {
    var d = SOFT_METRIC_DEFAULTS[key];
    GameState.softMetrics[key] = { label: d.label, value: d.value, icon: d.icon };
  }
  renderSoftMetrics();
}

function renderSoftMetrics() {
  var panel = document.getElementById('soft-metrics');
  if (!panel) return;
  var html = '';
  for (var key in GameState.softMetrics) {
    var m = GameState.softMetrics[key];
    var cls = m.value > 60 ? 'green' : (m.value > 35 ? 'amber' : 'red');
    var pctColor = m.value > 60 ? 'var(--accent-green)' : (m.value > 35 ? 'var(--accent-amber)' : 'var(--accent-red)');
    html += '<div class="sit-item" data-soft="' + key + '">' +
      '<span class="sit-label">' + m.icon + ' ' + m.label + '</span>' +
      '<div style="display:flex;align-items:center;gap:6px;">' +
      '<div class="meter-bar" style="width:45px;"><div class="meter-fill ' + cls + '" style="width:' + m.value + '%"></div></div>' +
      '<span style="font-size:10px;color:' + pctColor + ';font-family:var(--font-body);min-width:24px;">' + m.value + '</span>' +
      '</div></div>';
  }
  panel.innerHTML = html;
}

function applySoftMetricEffects(decId, key) {
  var effects = SOFT_METRIC_EFFECTS[decId] && SOFT_METRIC_EFFECTS[decId][key];
  if (!effects) return;

  var panel = document.getElementById('soft-metrics');
  for (var metric in effects) {
    if (!GameState.softMetrics[metric]) continue;
    var oldVal = GameState.softMetrics[metric].value;
    GameState.softMetrics[metric].value = Math.max(0, Math.min(100, oldVal + effects[metric]));
    var nv = GameState.softMetrics[metric].value;

    if (panel) {
      var item = panel.querySelector('[data-soft="' + metric + '"]');
      if (item) {
        var fill = item.querySelector('.meter-fill');
        var pctSpan = item.querySelector('span[style*="min-width"]');
        var nc = nv > 60 ? 'green' : (nv > 35 ? 'amber' : 'red');
        var npc = nv > 60 ? 'var(--accent-green)' : (nv > 35 ? 'var(--accent-amber)' : 'var(--accent-red)');
        if (fill) { fill.style.width = nv + '%'; fill.className = 'meter-fill ' + nc; }
        if (pctSpan) { pctSpan.textContent = nv; pctSpan.style.color = npc; }
        triggerDashAnimation(item, effects[metric] < 0 ? 'down' : 'up');
      }
    }
  }
}

