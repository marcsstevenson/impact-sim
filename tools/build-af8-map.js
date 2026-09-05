// Generate the AF8 locator SVG from real coordinates.
//
// Equirectangular with a cos(lat) correction at the island's mid-latitude, which
// is accurate enough at this scale and keeps the shape recognisable. Hand-placed
// coordinates would drift; this keeps the rupture trace honest against the coast.
'use strict';
var fs = require('fs');

var LON0 = 166.2, LAT0 = -40.3;
var MIDLAT = -43.6;
var K = 60;                                   // px per degree of latitude
var KX = Math.cos(MIDLAT * Math.PI / 180) * K; // px per degree of longitude

function P(lat, lon) {
  return [ +((lon - LON0) * KX).toFixed(1), +((LAT0 - lat) * K).toFixed(1) ];
}

// Simplified South Island coastline, clockwise from Cape Farewell.
var COAST = [
  [-40.51,172.68],[-40.55,173.02],[-40.80,172.86],[-40.78,172.98],[-41.05,173.07],
  [-41.27,173.28],[-41.08,173.66],[-40.98,174.33],[-41.09,174.35],[-41.32,174.13],
  [-41.72,174.27],[-41.98,174.02],[-42.43,173.71],[-42.62,173.47],[-43.05,173.05],
  [-43.20,172.75],[-43.50,172.73],[-43.60,172.80],[-43.75,173.10],[-43.88,172.96],
  [-43.82,172.70],[-43.90,172.40],[-43.90,172.20],[-44.05,171.80],[-44.40,171.25],
  [-45.10,170.97],[-45.47,170.82],[-45.90,170.72],[-46.05,170.20],[-46.45,169.82],
  [-46.58,168.80],[-46.60,168.34],[-46.42,168.20],[-46.35,168.02],[-46.20,167.55],
  [-46.16,166.60],[-45.75,166.55],[-45.30,166.90],[-44.60,167.85],[-44.25,168.05],
  [-44.27,168.15],[-44.01,168.37],[-43.97,168.62],[-43.88,169.04],[-43.75,169.32],
  [-43.60,169.60],[-43.45,169.85],[-43.23,170.17],[-42.95,170.65],[-42.72,170.97],
  [-42.45,171.21],[-41.75,171.47],[-41.25,172.11],[-40.78,172.22]
];

// The Alpine Fault. It runs along the western foot of the Southern Alps, so the
// trace must stay parallel to and consistently inland of the West Coast - every
// point below sits roughly 10-25 km east of the coastline at its own latitude.
// An earlier pass interpolated between endpoints and put the trace out to sea
// off Bruce Bay, which is the one thing a New Zealand audience would notice.
//
// The rupture is the Southern and Central sections, Milford Sound to the Kelly
// Range, which is what the scenario text describes.
var FAULT_RUPTURED = [
  [-44.60,167.92],[-44.35,168.25],[-44.05,168.55],[-43.92,169.00],
  [-43.82,169.30],[-43.68,169.60],[-43.55,169.85],[-43.45,170.05],
  [-43.36,170.22],[-43.25,170.42],[-43.13,170.62],[-42.95,170.87],
  [-42.83,171.05],[-42.72,171.32]
];
// The Northern section, unruptured in this scenario: on past Inangahua and out
// along the Wairau into Marlborough. Drawn faint so the ruptured length reads as
// a portion of the fault rather than the whole of it.
var FAULT_REST = [
  [-42.72,171.32],[-42.50,171.62],[-42.30,171.90],
  [-42.00,172.35],[-41.75,172.75],[-41.55,173.15]
];

// Places the AF8 content actually names, with how often it names them.
var PLACES = [
  { name: 'Milford Sound', lat:-44.67, lon:167.93, kind:'epicentre', dx:  8, dy:  4, anchor:'start' },
  { name: 'Kelly Range',   lat:-42.72, lon:171.32, kind:'rupture',   dx:  8, dy: 11, anchor:'start' },
  { name: 'Queenstown',    lat:-45.03, lon:168.66, kind:'town',      dx:  7, dy:  4, anchor:'start' },
  { name: 'Haast',         lat:-43.88, lon:169.04, kind:'town',      dx: -7, dy:  4, anchor:'end'   },
  { name: 'Franz Josef',   lat:-43.39, lon:170.18, kind:'town',      dx: -7, dy:  1, anchor:'end'   },
  { name: 'Hokitika',      lat:-42.72, lon:170.97, kind:'town',      dx: -7, dy:  4, anchor:'end'   },
  { name: 'Greymouth',     lat:-42.45, lon:171.21, kind:'town',      dx: -7, dy: -4, anchor:'end'   },
  { name: 'Westport',      lat:-41.75, lon:171.60, kind:'town',      dx: -7, dy:  0, anchor:'end'   },
  { name: 'Nelson',        lat:-41.27, lon:173.28, kind:'town',      dx:  7, dy: -5, anchor:'start' },
  { name: 'Christchurch',  lat:-43.53, lon:172.63, kind:'town',      dx:  7, dy: -3, anchor:'start' },
  { name: 'Lyttelton',     lat:-43.60, lon:172.72, kind:'port',      dx:  7, dy:  8, anchor:'start' }
];

function path(pts, close) {
  return pts.map(function (p, i) {
    var xy = P(p[0], p[1]);
    return (i ? 'L' : 'M') + xy[0] + ' ' + xy[1];
  }).join(' ') + (close ? ' Z' : '');
}

// Great-circle length of the ruptured segment, so the label is not a guess.
function km(a, b) {
  var R = 6371, toRad = Math.PI / 180;
  var dLat = (b[0]-a[0]) * toRad, dLon = (b[1]-a[1]) * toRad;
  var la1 = a[0]*toRad, la2 = b[0]*toRad;
  var h = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
var length = 0;
for (var i = 1; i < FAULT_RUPTURED.length; i++) length += km(FAULT_RUPTURED[i-1], FAULT_RUPTURED[i]);

// Verify the trace really is inland of the coast, rather than trusting that it
// looks right. Walks the west-coast run of COAST, interpolates the coastal
// longitude at each fault point's latitude, and reports the separation.
var WEST_FROM = 38, WEST_TO = 51;   // indices of the west-coast run, south -> north
var west = COAST.slice(WEST_FROM, WEST_TO + 1).slice().sort(function (a, b) { return a[0] - b[0]; });
function coastLonAt(lat) {
  if (lat <= west[0][0]) return west[0][1];
  for (var i = 1; i < west.length; i++) {
    if (lat <= west[i][0]) {
      var t = (lat - west[i-1][0]) / (west[i][0] - west[i-1][0]);
      return west[i-1][1] + t * (west[i][1] - west[i-1][1]);
    }
  }
  return west[west.length-1][1];
}
var offshore = [];
console.log('fault-to-coast separation (positive = inland):');
FAULT_RUPTURED.forEach(function (f) {
  var sep = (f[1] - coastLonAt(f[0])) * 111.32 * Math.cos(f[0] * Math.PI / 180);
  console.log('  lat ' + f[0].toFixed(2) + '  ' + (sep >= 0 ? '+' : '') + sep.toFixed(0) + ' km');
  if (sep < 0) offshore.push(f);
});
if (offshore.length) {
  console.error('\nFAIL: ' + offshore.length + ' fault point(s) sit offshore, west of the coastline.');
  process.exit(1);
}

var xs = [], ys = [];
COAST.concat(FAULT_REST).forEach(function (p) { var q = P(p[0],p[1]); xs.push(q[0]); ys.push(q[1]); });
var pad = 34;
var minX = Math.min.apply(null, xs) - pad, maxX = Math.max.apply(null, xs) + pad;
var minY = Math.min.apply(null, ys) - pad, maxY = Math.max.apply(null, ys) + pad;
var W = +(maxX - minX).toFixed(1), H = +(maxY - minY).toFixed(1);

var dots = PLACES.map(function (p) {
  var xy = P(p.lat, p.lon);
  var r = p.kind === 'epicentre' ? 0 : (p.kind === 'town' ? 2.6 : 2.6);
  var mark = p.kind === 'epicentre'
    ? '<g class="af8map-epi"><circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="9"/>' +
      '<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="5"/>' +
      '<circle cx="'+xy[0]+'" cy="'+xy[1]+'" r="2.4" class="af8map-epi-core"/></g>'
    : '<circle class="af8map-dot '+p.kind+'" cx="'+xy[0]+'" cy="'+xy[1]+'" r="'+r+'"/>';
  return '    ' + mark + '\n    <text class="af8map-label '+p.kind+'" x="'+(xy[0]+p.dx).toFixed(1)+
    '" y="'+(xy[1]+p.dy).toFixed(1)+'" text-anchor="'+p.anchor+'">'+p.name+'</text>';
}).join('\n');

var svg =
'<svg class="af8map" viewBox="'+minX.toFixed(1)+' '+minY.toFixed(1)+' '+W+' '+H+'" role="img" ' +
'aria-label="Map of the South Island of New Zealand showing about '+Math.round(length)+' kilometres of the Alpine Fault ruptured from Fiordland to the Kelly Range, with the epicentre near Milford Sound">\n' +
'  <path class="af8map-coast" d="'+path(COAST, true)+'"/>\n' +
'  <path class="af8map-fault-rest" d="'+path(FAULT_REST, false)+'"/>\n' +
'  <path class="af8map-fault" d="'+path(FAULT_RUPTURED, false)+'"/>\n' +
'  <g>\n'+dots+'\n  </g>\n' +
'  <g class="af8map-key" transform="translate('+(minX+16).toFixed(1)+','+(maxY-46).toFixed(1)+')">\n' +
'    <line class="af8map-fault" x1="0" y1="0" x2="24" y2="0"/>\n' +
'    <text class="af8map-keytext" x="32" y="3.5">Ruptured: Southern + Central</text>\n' +
'    <line class="af8map-fault-rest" x1="0" y1="17" x2="24" y2="17"/>\n' +
'    <text class="af8map-keytext" x="32" y="20.5">Northern section, not ruptured</text>\n' +
'    <g class="af8map-epi" transform="translate(12,34)"><circle r="6.5"/><circle r="2.2" class="af8map-epi-core"/></g>\n' +
'    <text class="af8map-keytext" x="32" y="37.5">Epicentre</text>\n' +
'  </g>\n' +
'</svg>';

fs.writeFileSync(process.env.OUT, svg);
console.log('ruptured length: ' + Math.round(length) + ' km (content says ~400)');
console.log('viewBox ' + minX.toFixed(1) + ' ' + minY.toFixed(1) + ' ' + W + ' ' + H);
console.log('bytes ' + svg.length);
