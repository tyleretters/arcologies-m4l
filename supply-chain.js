/*
 * Dev Tools
 */
function dumpState() { out(JSON.stringify(state)) };
function dumpField() { out(JSON.stringify(field)) };

function test() {
  out(JSON.stringify(makeField()));
}

/*
 * Event Handlers
 */

function gridEvent(press, x, y) {
  if (x > state.x) return;
  if (y > state.y) return;
  if (state.menuActive) {

  } else {
    switch(press) {
      case 'single':
        singleFieldEvent(x, y);
        break;
      case 'double':
        doubleFieldEvent(x, y);
        break;
      case 'long':
        longFieldEvent(x, y);
        break;
      default:
        return;
    }
  }
}

function singleFieldEvent(x, y) {
  var cell = getCell(x, y);
  out(JSON.stringify(cell));
}

function doubleFieldEvent(x, y) {
  out('double' + x + y);
}

function longFieldEvent(x, y) {
  out('long' + x + y);
}

/*
 * Time & Place
 */

function advance() {

  state.time++;

//  nextField = buildNextField();

//  toMax(nextField);
//  currentField = nextField;
}

function makeField() {
  x = state.x;
  y = state.y;
  var out = {};
  for (var iy = y - 1; iy >= 0; iy--) {
    for (var ix = x - 1; ix >= 0; ix--) {
      var cellId = 'x' + ix + 'y' + iy;
      var cell = {
        x: ix,
        y: iy,
        routeType: 'none',
        structure: 'none',
        note: 60,
      };
      out[cellId] = cell;
    }
  }
  return out;
}

function makeId(x, y) {
  return 'x' + x + 'y' + y;
}

function getCell(x, y) {
  var id = makeId(x, y);
  return field[id];
}

/*
 * Initialize.
 */

function init() {
  state.lifespan = 0
  state.time = 0;
  state.x = 0;
  state.y = 0;
  state.menuActive = 0;
  state.routes = [];
  state.structures = [];
}

function initField() {
  field = makeField();
}


/*
 * I/O
 */

var inlets = 1;
var outlets = 1;

function out(val) {
  outlet(0, val);
}

/*
 * globals
 */

var state = field = {};

/*
 * Init
 */

function addStructure(key, val) {
  state.structures[key] = val;
}

function addRoute(key, val) {
  state.routes[key] = val;
}

function setMenu(val) {
  state.menuActive = val;
}

function setLifespan(val) {
  state.lifespan = val;
}

function setGeneration(val) {
  state.generation = val;
}

function setWidth(val) {
  state.x = val;
}

function setHeight(val) {
  state.y = val;
}

/*
 * Utility
 */

Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] == obj) {
      return true;
    }
  }
  return false;
}

/*
 * Tests
 * 
 * 1. Uncomment `runTestSuite();` directly below.
 * 2. Run `node supply-chain.js`.
 *
 */

 runTestSuite();

function testMakeId() {
  var name = 'testMakeId';
  var id = makeId(6, 14);
  var result = (id == 'x6y14') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSuite() {
  var results = [];

  results.push(testMakeId());

  return results;
}

/*
 * Test Framework
 *
 * This is a simple functional test framework made from scratch.
 * Jasmine, Cucumber, Tape, Mocha... none of them could easily
 * support simple functional tests like this and would require
 *
 */

function drawLine() {
  console.log('+----------------------------------+');
}

function drawBorder() {
  console.log('+==================================+');
}

function testOutput(name, result) {
  console.log('Test:\t\t' + name);
  console.log('Result:\t\t' + result);
  console.log('\n');
}

function runTestSuite() {
  console.log('\n');
  drawBorder();
  console.log('\n     Supply Chain Test Suite\n');
  drawLine();
  console.log('\n');
  results = testSuite();
  drawBorder();
  var counts = {};
  results.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  console.log(counts);
  drawBorder();
  console.log('\n');
}

