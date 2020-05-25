/*
 * SUPPLY CHAIN
 * ====================================================================================
 *
 * By:      Tyler Etters
 * Date:    May, 2020
 * Site:    https://nor.the-rn.info
 * License: Attribution 4.0 International (CC BY 4.0)
 *
 * File Organization:
 *  - Event Handlers
 *  - Draw
 *  - Time & Place
 *  - Initialize Functions
 *  - Max I/O
 *  - Utility
 *  - Tests
 *  - Testing Framework
 *
 */

/*
 * Event Handlers
 * ====================================================================================
 */

function gridEvent(press, x, y) {
  if (x > state.x) return;
  if (y > state.y) return;
  if (state.menuActive) {
    // menu things
  } else {
    switch(press) {
      case 'single':
        singleFieldEvent(x, y, 'drawCell');
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

function singleFieldEvent(x, y, callback) {
  out('singleFieldEvent');
  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);
  if (state.selectedCell === false) {
    // this is a fresh press
    state.selectedCell = id;
    cycleThroughRoutes(x, y, callback);
  } else if (state.selectedCell == id) {
    // we're cycling through the selected cell
    cycleThroughRoutes(x, y, callback);
  } else if (ids.contains(id)) {
    // we've pressed an existing cell and want to cycle it
    state.selectedCell = id;
    clearField();
    drawHomes().forEach(function(el) {
      out(el);
    });
    cycleThroughRoutes(x, y, callback);
  } else {
    // we've pressed an empty cell and are ready to do something else
    state.selectedCell = false;
    clearField();
    drawHomes().forEach(function(el) {
      out(el);
    });
  }
}

function cycleThroughRoutes(x, y, callback) {
  
  var cell = getCell(x, y);
  var id = makeId(x, y);

  if (!cell.isExists) {
      cell.structure = 'mine';
      cell.routeType = 'all';
      cell.isExists = true;
  } else {
    var rt = cell.routeType;
    if  (rt === 'all')   { cell.routeType = 'stop'; }
      else if  (rt === 'stop')  { cell.routeType = 'walls'; }
      else if  (rt === 'walls') { cell.routeType = 'ne'; }
      else if  (rt === 'ne')    { cell.routeType = 'se'; }
      else if  (rt === 'se')    { cell.routeType = 'sw'; }
      else if  (rt === 'sw')    { cell.routeType = 'nw'; }
      else if  (rt === 'nw')    { cell.routeType = 'ns'; }
      else if  (rt === 'ns')    { cell.routeType = 'ew'; }
      else if  (rt === 'ew')    { cell.routeType = 'nes'; }
      else if  (rt === 'nes')   { cell.routeType = 'esw'; }
      else if  (rt === 'esw')   { cell.routeType = 'swn'; }
      else if  (rt === 'swn')   { cell.routeType = 'wne'; }
      else if  (rt === 'wne')   { cell.routeType = 'nn'; }
      else if  (rt === 'nn')    { cell.routeType = 'ee'; }
      else if  (rt === 'ee')    { cell.routeType = 'ss'; }
      else if  (rt === 'ss')    { cell.routeType = 'ww'; }
      else if  (rt === 'ww')    { cell.routeType = 'all'; }
      else                      { cell.routeType = 'all'; }
    }
  
  field[id] = cell;

  if (callback === 'drawCell') {
    out(drawRoute(id));
  }
}

function doubleFieldEvent(x, y) {
  out('double' + x + y);
}

function longFieldEvent(x, y) {
  out('long' + x + y);
}

/*
 * Draw
 * ====================================================================================
 */

function clearField() {
  out('clearField');
}

// tested
function drawHomes() {
  var out = [];
  var cells = getExistingCells();
  for (var key in cells) {
      if (!cells.hasOwnProperty(key)) continue;
      var obj = cells[key];
      out.push(['drawRoute', 'home', obj.x, obj.y]);
  }
  return out;
}


// tested
function drawRoute(id) {
  var cell = field[id];
  return ['drawRoute', cell.routeType, cell.x, cell.y];
}

/*
 * Time & Place
 * ====================================================================================
 */

// tested
function makeField() {
  x = state.width;
  y = state.height;
  var out = {};
  for (var iy = y - 1; iy >= 0; iy--) {
    for (var ix = x - 1; ix >= 0; ix--) {
      var cellId = 'x' + ix + 'y' + iy;
      var cell = {
        id: makeId(ix, iy),
        isExists: false,
        x: ix,
        y: iy,
        routeType: 'off',
        structure: 'none',
        note: 60,
      };
      out[cellId] = cell;
    }
  }
  return out;
}

// tested
function makeId(x, y) {
  return 'x' + x + 'y' + y;
}

// tested
function getCell(x, y) {
  var id = makeId(x, y);
  return field[id];
}

// tested
function getExistingCells() {
  var f = field;
  var obj = {};
  for (var key in f) {
    if (f.hasOwnProperty(key)) {
        cell = f[key];
        if (!cell['isExists'] === true) continue;
        obj[cell.id] = cell;
    }
  }
  return obj;
}

// tested
function getIds(obj) {
  var arr = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      cell = obj[key];
      arr.push(cell.id);
    }
  }
  return arr;
} 

/*
 * Initialize
 * ====================================================================================
 */

var state = field = {};

// tested by proxy
function init() {
  state.outletsOn = false;
  state.lifespan = 0;
  state.time = 0;
  state.width = 0;
  state.height = 0;
  state.menuActive = 0;
  state.routes = [];
  state.structures = [];
  state.selectedCell = false;
}

// tested by proxy
function initField() {
  field = makeField();
}

/*
 * I/O
 * ====================================================================================
 */

var inlets = 1;
var outlets = 1;

// tested
function outletsOn() {
  state.outletsOn = true;
}

// tested
function out(val) {
  if (state.outletsOn) {
    outlet(0, val);
  } else {
    return val;
  }
}

/*
 * Setters
 * ====================================================================================
 */
// tested
function addStructure(key, val) {
  state.structures[key] = val;
}

// tested
function addRoute(key, val) {
  state.routes[key] = val;
}

// tested
function setMenu(val) {
  state.menuActive = val;
  if (val === 1) {

  } else {
    drawHomes().forEach(function(el) {
      out(el);
    }); 
  }
}

// tested
function setLifespan(val) {
  state.lifespan = val;
}

// tested
function setTime(val) {
  state.time = val;
}

// tested
function setWidth(val) {
  state.width = val;
}

// tested
function setHeight(val) {
  state.height = val;
}

/*
 * Utility
 */

// tested
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] == obj) {
      return true;
    }
  }
  return false;
}

// to test
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function dumpState() {
  out(JSON.stringify(state))
};

function dumpField() {
  out(JSON.stringify(field))
};

function test() {
  out('test function');
}

/*
 * Tests
 * ====================================================================================
 * 1. Uncomment `runTestSuite();` directly below.
 * 2. Run `node supply-chain.js`.
 *
 */

runTestSuite();

function testMakeIdReturnsId() {
  var name = 'testMakeIdReturnsId';
  var id = makeId(6, 14);
  var result = (id == 'x6y14') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetCellReturnsObject() {
  var name = 'testGetCellReturnsObject';
  var cell = getCell(5, 4);
  var result = (typeof cell === 'object' && cell !== null) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetCellStructureIsInitializedToNone() {
  var name = 'testGetCellStructureIsInitializedToNone';
  var cell = getCell(0, 0);
  var result = (cell.structure === 'none') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testArrayContains() {
  var name = 'testArrayContains';
  var bucket = [1, 2, 3, 4, 5];
  var result = (bucket.contains(5)) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMakeFieldIsStructuredToSpec() {
  var name      = 'testMakeFieldIsStructuredToSpec';
  var field     = makeField();
  var cell      = field['x10y4']; // arbitrary id
  var isExists  = (cell.isExists === false) ? true : false;
  var x         = (cell.x == 10) ? true : false;
  var y         = (cell.y == 4) ? true : false;
  var routeType = (cell.routeType == 'off') ? true : false;
  var structure = (cell.structure == 'none') ? true : false;
  var note      = (cell.note == 60) ? true : false;
  var result    = (isExists && x && y && routeType && structure && note) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testAddStructure() {
  var name = 'testAddStructure';
  addStructure(14, 'pyramid');
  var result = (state.structures[14] == 'pyramid') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
  
}

function testAddRoute() {
  var name = 'testAddRoute';
  addRoute(56, 'lost highway');
  var result = (state.routes[56] == 'lost highway') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetMenu() {
  var name = 'testSetMenu';
  setMenu(1);
  var result1 = (state.menuActive == 1) ? true : false;
  setMenu(0);
  var result2 = (state.menuActive == 0) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetLifespan() {
  var name = 'testSetLifespan';
  setLifespan(999);
  var result = (state.lifespan == 999) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetTime() {
  var name = 'testSetTime';
  setTime(29837598);
  var result = (state.time == 29837598) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetWidth() {
  var name = 'testSetWidth';
  setWidth(7);
  var result = (state.width == 7) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetHeight() {
  var name = 'testSetHeight';
  setHeight(48);
  var result = (state.height == 48) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOutletsOn() {
  var name = 'testOutletsOn';
  outletsOn();
  var result = (state.outletsOn == true) ? 'pass' : 'fail';
  state.outletsOn = false;
  testOutput(name, result);
  return result;
}

function testOut() {
  var name = 'testOut';
  var test = out('internet');
  var result = (test == 'internet') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSingleFieldEventOnEmptyCell() {
  var name = 'testSingleFieldEventOnEmptyCell';
  gridEvent('single', 2, 2);
  cell = getCell(2, 2);
  var result1 = (cell.isExists) ? true : false;
  var result2 = (cell.structure == 'mine') ? true : false;
  var result3 = (cell.routeType == 'all') ? true : false;
  gridEvent('single', 2, 2);
  cell = getCell(2, 2);
  var result4 = (cell.routeType == 'stop') ? true : false;
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetExistingCells() {
  var name = 'testGetExistingCells';
  field.x0y0.isExists = true;
  field.x1y0.isExists = true;
  var cells = getExistingCells();
  var result = (Object.size(cells) === 2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawRoute() {
  var name = 'testDrawRoute';
  singleFieldEvent(5, 6, 'none');
  var d = drawRoute('x5y6');
  var result1 = (d[0] === 'drawRoute') ? true : false;
  var result2 = (d[1] === 'all') ? true : false;
  var result3 = (d[2] === 5) ? true : false;
  var result4 = (d[3] === 6) ? true : false;
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawHomes() {
  var name = 'testDrawHomes';
  field.x0y0.isExists = 1;
  field.x0y2.isExists = 1;
  field.x0y3.isExists = 1;
  field.x0y0.routeType = 'all';
  field.x0y2.routeType = 'stop';
  field.x0y3.routeType = 'nse';
  field.x0y0.x = 0;
  field.x0y2.x = 0;
  field.x0y3.x = 0;
  field.x0y0.y = 0;
  field.x0y2.y = 2;
  field.x0y3.y = 3;
  field.x0y0.structure = 'mine';
  field.x0y2.structure = 'spaceport';
  field.x0y3.structure = 'mine';
  var h = drawHomes();
  var result1 = (h.length === 3) ? true : false;
  var result2 = (h[2][0] === 'drawRoute') ? true : false;
  var result3 = (h[2][1] === 'home') ? true : false;
  var result4 = (h[2][2] === 0) ? true : false;
  var result5 = (h[2][3] === 0) ? true : false;
  var result = (result1 && result2 && result3 && result4 && result5) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIds() {
  var name = 'testGetIds';
  var obj = {'x0y0':{}, 'x1y2':{}, 'x4y8':{}};
  var ids = getIds(obj);
  var result = (ids.length === 3) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function resetTestSuite() {
  init();
  setWidth(16);
  setHeight(8);
  initField();
}

function testSuite() {

  var results = [];

  resetTestSuite();
  results.push(testMakeIdReturnsId());
  results.push(testGetCellReturnsObject());
  results.push(testGetCellStructureIsInitializedToNone());
  results.push(testArrayContains());
  results.push(testMakeFieldIsStructuredToSpec());
  results.push(testAddStructure());
  results.push(testSetMenu());
  results.push(testSetTime());
  results.push(testSetWidth());
  results.push(testSetHeight());
  results.push(testOutletsOn());

  resetTestSuite();
  results.push(testOut());

  resetTestSuite();
  results.push(testSingleFieldEventOnEmptyCell());

  resetTestSuite()
  results.push(testGetExistingCells());

  resetTestSuite();
  results.push(testDrawRoute());

  resetTestSuite();
  results.push(testDrawHomes());
  
  resetTestSuite();
  results.push(testGetIds());

  return results;
}

/*
 * Test Framework
 * ====================================================================================
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