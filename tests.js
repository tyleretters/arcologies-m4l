
/*
 * Tests
 * ====================================================================================
 *
 * By:      Tyler Etters
 * Date:    May, 2020
 * Site:    https://nor.the-rn.info
 * License: Attribution 4.0 International (CC BY 4.0)
 *
 * File Organization:
 *  - Tests
 *  - Orchestration
 *  - Test Framework
 *  - Test Runner
 *
 */

function testInitCell() {
  var name = 'testInitCell';
  var cell = initCell(6, 14);
  var result1 = (cell.id == 'x6y14') ? true : false;
  var result2 = (cell.isExists == false) ? true : false;
  var result3 = (cell.x == 6) ? true : false;
  var result4 = (cell.y == 14) ? true : false;
  var result5 = (cell.routeType == 'off') ? true : false;
  var result6 = (cell.structure == 'none') ? true : false;
  var result7 = (cell.note == 60) ? true : false;
  var result8 = (cell.speed == 1) ? true : false;
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testInitCellById() {
  var name = 'testInitCellById';
  var id = 'x3y8';
  var cell = initCellById(id);
  var result1 = (cell.id == 'x3y8') ? true : false;
  var result2 = (cell.isExists == false) ? true : false;
  var result3 = (cell.x == 3) ? true : false;
  var result4 = (cell.y == 8) ? true : false;
  var result5 = (cell.routeType == 'off') ? true : false;
  var result6 = (cell.structure == 'none') ? true : false;
  var result7 = (cell.note == 60) ? true : false;
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;

}

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

function testObjectSize() {
  var name = 'testObjectSize';
  var bucket = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}};
  var result = (Object.size(bucket) === 5) ? 'pass' : 'fail';
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

function testSetMenu() {
  var name = 'testSetMenu';
  setMenu(true);
  var result1 = (state.isMenuActive == true) ? true : false;
  setMenu(false);
  var result2 = (state.isMenuActive == false) ? true : false;
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

function testOpenGridMenu() {
  var name = 'testOpenGridMenu';
  var result1 = (openMenu() == 'openMenu') ? true : false;
  var result2 = (state.isMenuActive === true) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDeselectCell() {
  var name = 'testDeselectCell';
  state.selectedCell = 'x0y0';
  deselectCell();
  var result = (state.selectedCell === false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSelectCell() {
  var name = 'testSelectCell';
  selectCell('x6y3');
  var result = (state.selectedCell === 'x6y3') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseGridMenu() {
  var name = 'testCloseGridMenu';
  var result1 = (closeMenu() == 'closeMenu') ? true : false;
  var result2 = (state.isMenuActive === false) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOutletsOnOff() {
  var name = 'testOutletsOnOff';
  outletsOn();
  var result1 = (state.outletsOn == true) ? 'pass' : 'fail';
  outletsOff();
  var result2 = (state.outletsOn == false) ? 'pass' : 'fail';
  var result = (result1 && result2);
  testOutput(name, result);
  return result;
}

function testClearField() {
  var name = 'testClearField';
  var result = (clearField() === 'clearField') ? 'pass' : 'fail';
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
  var result4 = (cell.routeType == 'random') ? true : false;
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

function testDrawMenuRoute() {
  var name = 'testDrawMenuRoute';
  field.x4y3.routeType = 'random';
  var d = drawMenuRoute('x4y3');
  var result1 = (d[0] === 'drawRoute') ? true : false;
  var result2 = (d[1] === 'random') ? true : false;
  var result3 = (d[2] === 2) ? true : false;
  var result4 = (d[3] === 2) ? true : false;
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuStructure() {
  var name = 'testDrawMenuStructure';
  field.x4y3.structure = 'spaceport';
  var d = drawMenuStructure('x4y3');
  var result1 = (d[0] === 'drawStructure') ? true : false;
  var result2 = (d[1] === 'spaceport') ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuSpeed() {
  var name = 'testDrawMenuSpeed';
  var d = drawMenuSpeed(5);
  var result1 = (d[0] === 'drawMenuSpeed') ? true : false;
  var result2 = (d[1] === 5) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawHomes() {
  var name = 'testDrawHomes';
  field.x0y0.isExists = true;
  field.x0y2.isExists = true;
  field.x0y3.isExists = true;
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
  var result1 = (h.length === 4) ? true : false;
  var result2 = (h[0] === 'drawHomes') ? true : false;
  var result5 = (h[1] === 'x0y3') ? true : false;
  var result4 = (h[2] === 'x0y2') ? true : false;
  var result3 = (h[3] === 'x0y0') ? true : false;  
  var result = (result1 && result2 && result3 && result4 && result5) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawHome() {
  var name = 'testDrawHome';
  field.x0y3.isExists = true;
  field.x0y3.routeType = 'nse';
  field.x0y3.x = 0;
  field.x0y3.y = 3;
  field.x0y3.structure = 'mine';
  var h = drawHome('x0y3');
  var result1 = (h.length == 2) ? true : false;
  var result2 = (h[0] === 'drawHomes') ? true : false;
  var result3 = (h[1] === 'x0y3') ? true : false;
  var result = (result1 && result2 && result3) ? 'pass' : 'fail';
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

function testDumpRoutes() {
  var name = 'testDumpRoutes';
  var arr = dumpRoutes();
  var result1 = (arr[0] === 'routesList') ? true : false;
  var result2 = (arr.includes('nes')) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDumpStructures() {
  var name = 'testDumpStructures';
  var arr = dumpStructures();
  var result1 = (arr[0] === 'structuresList') ? true : false;
  var result2 = (arr.includes('waystation')) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMoveCell() {
  var name = 'testMoveCell';
  field.x0y0.isExists = true;
  field.x6y6.isExists = true;
  field.x0y0.routeType = 'random';
  field.x6y6.routeType = 'all';
  field.x0y0.x = 0;
  field.x6y6.x = 6;
  field.x0y0.y = 0;
  field.x6y6.y = 6;
  field.x0y0.structure = 'spaceport';
  field.x6y6.structure = 'waystation';
  field.x0y0.note = 51;
  field.x6y6.note = 56;
  moveCell('x0y0', 'x6y6');
  var result1 = (field.x0y0.isExists === false) ? true : false;
  var result2 = (field.x6y6.routeType === 'random' ) ? true : false;
  var result3 = (field.x6y6.structure === 'spaceport') ? true : false;
  var result4 = (field.x0y0.id === 'x0y0') ? true : false;
  var result5 = (field.x6y6.id === 'x6y6') ? true : false;
  var result6 = (field.x6y6.note === 51) ? true : false;
  var result = (result1 && result2 && result3 && result4 && result5 && result6) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testCycleRouteTypes() {
  var name = 'testCycleRouteTypes';
  var result = (cycleRouteTypes('walls') === 'ne') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testDeleteCell() {
  var name = 'testDeleteCell';
  state.selectedCell = 'x0y1';
  field['x0y1'].isExists = true;
  deleteCell('x0y1');
  var result1 = (state.selectedCell === false) ? true : false;
  var result2 = (field.x0y1.isExists === false) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

/*
 * Orchestration
 * ====================================================================================
 */

function resetTestSuite() {
  init();
  setWidth(16);
  setHeight(8);
  initField();
  outletsOff();
}

function testSuite() {

  var results = [];

  resetTestSuite();
  results.push(testInitCell());
  results.push(testInitCellById());
  results.push(testMakeIdReturnsId());
  results.push(testGetCellReturnsObject());
  results.push(testGetCellStructureIsInitializedToNone());
  results.push(testArrayContains());
  results.push(testObjectSize());
  results.push(testMakeFieldIsStructuredToSpec());
  results.push(testSetMenu());
  results.push(testSetTime());
  results.push(testSetWidth());
  results.push(testSetHeight());
  results.push(testOpenGridMenu());
  results.push(testDeselectCell());
  results.push(testSelectCell());
  results.push(testCloseGridMenu());
  results.push(testOutletsOnOff());
  results.push(testClearField());

  resetTestSuite();
  results.push(testOut());

  resetTestSuite();
  results.push(testSingleFieldEventOnEmptyCell());

  resetTestSuite()
  results.push(testGetExistingCells());

  resetTestSuite();
  results.push(testDrawRoute());

  resetTestSuite();
  results.push(testDrawMenuRoute());
  results.push(testDrawMenuStructure());
  results.push(testDrawMenuSpeed());

  resetTestSuite();
  results.push(testDrawHomes());

  resetTestSuite();
  results.push(testDrawHome());
  
  resetTestSuite();
  results.push(testGetIds());

  resetTestSuite();
  results.push(testDumpRoutes());
  results.push(testDumpStructures());

  resetTestSuite();
  results.push(testMoveCell());

  resetTestSuite();
  results.push(testCycleRouteTypes());

  resetTestSuite();
  results.push(testDeleteCell());

  return results;
}

/*
 * Test Framework
 * ====================================================================================
 * This is a simple functional test framework made from scratch.
 * Jasmine, Cucumber, Tape, Mocha... none of them could 1.) easily
 * support simple functional tests, 2.) be compatible with the JS
 * that Max understands (I think), 3.) not require dozens of dependencies.
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
  if (result != 'pass') {
    console.log('Result:\t!! ---- ' + result);
  } else {
    console.log('Result:\t\t' + result);
  }
  console.log('\n');
}

function runTestSuite() {
  console.log('\n');
  console.log('\n             Test Suite');
  drawBorder();
  console.log('\n');
  results = testSuite();
  var counts = {};
  results.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  console.log('Final Results:');
  console.log(counts);
  drawBorder();
  console.log('\n');
}

/*
 * Test Runner
 * ====================================================================================
 */

runTestSuite();
