
/*
 * SUPPLY CHAIN Tests
 * ====================================================================================
 *
 * By:      Tyler Etters
 * Date:    May, 2020
 * Site:    https://nor.the-rn.info
 * License: Attribution 4.0 International (CC BY 4.0)
 *
 * File Organization:
 *  - Tests
 *  - Test Framework
 *  - Test Runner
 *
 */

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

/*
 * Test Runner
 * ====================================================================================
 */

runTestSuite();