/*
 * ecologies
 * ============================================================================
 *
 * By:        Tyler Etters
 * Date:      May, 2020
 * Site:      https://nor.the-rn.info
 * License:   Attribution 4.0 International (CC BY 4.0)
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
  var result5 = (cell.route == 'off') ? true : false;
  var result6 = (cell.structure == 'none') ? true : false;
  var result7 = (cell.note == 60) ? true : false;
  var result8 = (cell.interval == 4) ? true : false;
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
  var result5 = (cell.route == 'off') ? true : false;
  var result6 = (cell.structure == 'none') ? true : false;
  var result7 = (cell.note == 60) ? true : false;
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;

}

function testMakeId() {
  var name = 'testMakeIdReturnsId';
  var id = makeId(6, 14);
  var result = (id == 'x6y14') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetCell() {
  var name = 'testGetCellReturnsObject';
  var cell = getCell(5, 4);
  var result = (typeof cell === 'object' && cell !== null) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignal() {
  var name = 'testGetSignal';
  makeSignal(3, 3, 'n');
  var signal = getSignal(3, 3);
  console.log(signal);
  var result1 = (typeof signal === 'object' && signal !== null) ? true : false;
  var result2 = (signal.x === 3) ? true : false;
  var result3 = (signal.direction === 'n') ? true : false;
  var result = (result1 && result2 && result3)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMakeSignal() {
  var name = 'testMakeSignal';
  makeSignal(4, 5, 'e');
  signal = signals.x4y5;
  var result1 = (signal.id === 'x4y5') ? true : false;
  var result2 = (signal.x === 4) ? true : false;
  var result3 = (signal.y === 5) ? true : false;
  var result4 = (signal.direction === 'e') ? true : false;
  var result = (result1 && result2 && result3 && result4)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignalSpeed() {
  var name = 'testGetSignalSpeed';
  var result = (getSignalSpeed() === 1)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDeleteSignal() {
  var name = 'testDeleteSignal';
  makeSignal(1, 1, 'w');
  deleteSignal('x1y1');
  var result = (getSignal('x1y1') === false)  ? 'pass' : 'fail';
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
  var cell      = field.x10y4; // arbitrary id
  var isExists  = (cell.isExists === false) ? true : false;
  var x         = (cell.x == 10) ? true : false;
  var y         = (cell.y == 4) ? true : false;
  var route = (cell.route == 'off') ? true : false;
  var structure = (cell.structure == 'none') ? true : false;
  var note      = (cell.note == 60) ? true : false;
  var result    = (isExists && x && y && route && structure && note) ? 'pass' : 'fail';
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

function testSetMidiPalette() {
  var name = 'testSetMidiPalette';
  setMidiPalette(true);
  var result1 = (state.isMidiPaletteActive == true) ? true : false;
  setMidiPalette(false);
  var result2 = (state.isMidiPaletteActive == false) ? true : false;
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

function testOpenMenu() {
  var name = 'testOpenMenu';
  var result1 = (openMenu() == 'openMenu') ? true : false;
  var result2 = (state.isMenuActive === true) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenMidiPalette() {
  var name = 'testOpenMidiPalette';
  var msg = openMidiPalette();
  var result1 = (state.isMidiPaletteActive) ? true : false;
  var result2 = (msg = 'drawMidiPalette') ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSingleMidiPaletteEvent() {
  var name = 'testSingleMidiPaletteEvent';
  state.selectedCellId = 'x0y0';
  field.x0y0.note = 60;
  var msg = singleMidiPaletteEvent(2, 2);
  var result1 = (field.x0y0.note == 55) ? true : false;
  var result2 = (msg[0] == 'animateMidiNotePress') ? true : false;
  var result3 = (msg[1] == 2) ? true : false;
  var result4 = (msg[2] == 2) ? true : false;
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetNote() {
  var name = 'testGetNote';
  var result1 = (getNote(2, 2) == 55) ? true : false;
  var result2 = (getNote(5, 3) == 64) ? true : false;
  var result3 = (getNote(5, 4) == 70) ? true : false;
  var result4 = (getNote(6, 6) == 83) ? true : false;
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetRouteDirections() {
  var name = 'testGetRouteDirections';
  var test1 = getRouteDirections('nes');
  var test2 = getRouteDirections('all');
  var test3 = getRouteDirections('ee');
  var test4 = getRouteDirections('garbage');
  var result1 = ( test1[0] == 'n' && test1[1] ==  'e' && test1[2] == 's') ? true : false;
  var result2 = ( test2[0] == 'n' && test2[1] ==  'e' && test2[2] == 's' && test2[3] == 'w') ? true : false;
  var result3 = ( test3[0] == 'e') ? true : false;
  var result4 = ( test4.length == 0) ? true : false;
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDeselectCell() {
  var name = 'testDeselectCell';
  state.selectedCellId = 'x0y0';
  deselectCell();
  var result = (state.selectedCellId === false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSelectCell() {
  var name = 'testSelectCell';
  selectCell('x6y3');
  var result = (state.selectedCellId === 'x6y3') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseMenu() {
  var name = 'testCloseMenu';
  var result1 = (closeMenu() == 'closeMenu') ? true : false;
  var result2 = (state.isMenuActive === false) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseMidiPalette() {
  var name = 'testCloseMidiPalette';
  closeMidiPalette();
  var result = (!state.isMidiPaletteActive) ? 'pass' : 'fail';
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
  var result2 = (cell.structure == 'hive') ? true : false;
  var result3 = (cell.route == 'all') ? true : false;
  gridEvent('single', 2, 2);
  cell = getCell(2, 2);
  var result4 = (cell.route == 'ne') ? true : false;
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
  field.x4y3.route = 'random';
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
  field.x4y3.structure = 'nomad';
  var d = drawMenuStructure('x4y3');
  var result1 = (d[0] === 'drawStructure') ? true : false;
  var result2 = (d[1] === 'nomad') ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuInterval() {
  var name = 'testDrawMenuInterval';
  var d = drawMenuInterval(5);
  var result1 = (d[0] === 'drawMenuInterval') ? true : false;
  var result2 = (d[1] === 5) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testdrawCells() {
  var name = 'testDrawCells';
  field.x0y0.isExists = true;
  field.x0y2.isExists = true;
  field.x0y3.isExists = true;
  field.x0y0.route = 'all';
  field.x0y2.route = 'stop';
  field.x0y3.route = 'nse';
  field.x0y0.x = 0;
  field.x0y2.x = 0;
  field.x0y3.x = 0;
  field.x0y0.y = 0;
  field.x0y2.y = 2;
  field.x0y3.y = 3;
  field.x0y0.structure = 'hive';
  field.x0y2.structure = 'nomad';
  field.x0y3.structure = 'hive';
  var h = drawCells();
  var result1 = (h.length === 4) ? true : false;
  var result2 = (h[0] === 'drawCells') ? true : false;
  var result5 = (h[1] === 'x0y3') ? true : false;
  var result4 = (h[2] === 'x0y2') ? true : false;
  var result3 = (h[3] === 'x0y0') ? true : false;  
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
  var result2 = (arr.includes('hive')) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMoveCell() {
  var name = 'testMoveCell';
  field.x0y0.isExists = true;
  field.x6y6.isExists = true;
  field.x0y0.route = 'random';
  field.x6y6.route = 'all';
  field.x0y0.x = 0;
  field.x6y6.x = 6;
  field.x0y0.y = 0;
  field.x6y6.y = 6;
  field.x0y0.structure = 'nomad';
  field.x6y6.structure = 'hive';
  field.x0y0.note = 51;
  field.x6y6.note = 56;
  moveCell('x0y0', 'x6y6');
  var result1 = (field.x0y0.isExists === false) ? true : false;
  var result2 = (field.x6y6.route === 'random' ) ? true : false;
  var result3 = (field.x6y6.structure === 'nomad') ? true : false;
  var result4 = (field.x0y0.id === 'x0y0') ? true : false;
  var result5 = (field.x6y6.id === 'x6y6') ? true : false;
  var result6 = (field.x6y6.note === 51) ? true : false;
  var result = (result1 && result2 && result3 && result4 && result5 && result6) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testCycleRoutes() {
  var name = 'testCycleRoutes';
  var result = (cycleRoutes('shell') === 'all') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testDeleteCell() {
  var name = 'testDeleteCell';
  state.selectedCellId = 'x0y1';
  field.x0y1.isExists = true;
  deleteCell('x0y1');
  var result1 = (state.selectedCellId === false) ? true : false;
  var result2 = (field.x0y1.isExists === false) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawChannel() {
  var name = 'testDrawChannel';
  var arr = [0, 4, 0, 7];
  var d = drawChannel(arr);
  var result1 = (d[0] === 'drawChannel') ? true : false;
  var result2 = (d[1] === 0) ? true : false;
  var result3 = (d[2] === 4) ? true : false;
  var result4 = (d[3] === 0) ? true : false;
  var result5 = (d[4] === 7) ? true : false;
  var result = (result1 && result2 && result3 && result4 && result5) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindColumnNeighborNorth() {
  var name = 'testFindColumnNeighborNorth';
  var currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x4y3': { 'id' : 'x4y3', 'x': 4, 'y': 3}, 
    'x4y5': { 'id' : 'x4y5', 'x': 4, 'y': 5},
    'x5y5': { 'id' : 'x4y8', 'x': 4, 'y': 8}
  };
  var neighbor = findColumnNeighbor(currentCell, existingCells, 'north');
  var result1 = (neighbor.y === 5) ? true : false;
  var result2 = (neighbor.x === 4) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindColumnNeighborSouth() {
  var name = 'testFindColumnNeighborSouth';
  var currentCell = {
    'id': 'x4y3', 'x': 4, 'y': 3
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x4y7': { 'id' : 'x4y3', 'x': 4, 'y': 7}, 
    'x4y5': { 'id' : 'x4y5', 'x': 4, 'y': 5},
    'x4y8': { 'id' : 'x4y8', 'x': 4, 'y': 8}
  };
  var neighbor = findColumnNeighbor(currentCell, existingCells, 'south');
  var result1 = (neighbor.y === 5) ? true : false;
  var result2 = (neighbor.x === 4) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoColumnNeighborSouth() {
  var name = 'testFindColumnNeighborSouth';
  var currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x3y0': { 'id' : 'x3y0', 'x': 3, 'y': 0}, 
    'x1y3': { 'id' : 'x1y3', 'x': 1, 'y': 3}, 
    'x8y5': { 'id' : 'x8y5', 'x': 8, 'y': 5},
    'x10y8': { 'id' : 'x10y8', 'x': 10, 'y': 8}
  };
  var neighbor = findColumnNeighbor(currentCell, existingCells, 'south');
  var result1 = (neighbor.y === 7) ? true : false;
  var result2 = (neighbor.x === 4) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoColumnNeighborNorth() {
  var name = 'testFindColumnNeighborNorth';
  var currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x3y0': { 'id' : 'x3y0', 'x': 3, 'y': 0}, 
    'x1y3': { 'id' : 'x1y3', 'x': 1, 'y': 3}, 
    'x8y5': { 'id' : 'x8y5', 'x': 8, 'y': 5},
    'x10y8': { 'id' : 'x10y8', 'x': 10, 'y': 8}
  };
  var neighbor = findColumnNeighbor(currentCell, existingCells, 'north');
  var result1 = (neighbor.y === 0) ? true : false;
  var result2 = (neighbor.x === 4) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindRowNeighborWest() {
  var name = 'testFindRowNeighborWest';
  var currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x0y7': { 'id' : 'x0y7', 'x': 0, 'y': 7}, 
    'x1y7': { 'id' : 'x1y7', 'x': 1, 'y': 7},
    'x2y7': { 'id' : 'x2y7', 'x': 2, 'y': 7}
  };
  var neighbor = findRowNeighbor(currentCell, existingCells, 'west');
  var result1 = (neighbor.y === 7) ? true : false;
  var result2 = (neighbor.x === 2) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindRowNeighborEast() {
  var name = 'testFindRowNeighborWest';
  var currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x0y7': { 'id' : 'x0y7', 'x': 0, 'y': 7}, 
    'x15y7': { 'id' : 'x15y7', 'x': 15, 'y': 7},
    'x14y7': { 'id' : 'x14y7', 'x': 14, 'y': 7}
  };
  var neighbor = findRowNeighbor(currentCell, existingCells, 'east');
  var result1 = (neighbor.y === 7) ? true : false;
  var result2 = (neighbor.x === 14) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoRowNeighborEast() {
  var name = 'testFindNoRowNeighborEast';
  var currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x0y7': { 'id' : 'x0y7', 'x': 0, 'y': 7}, 
  };
  var neighbor = findRowNeighbor(currentCell, existingCells, 'east');
  var result1 = (neighbor.y === 7) ? true : false;
  var result2 = (neighbor.x === 15) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoRowNeighborWest() {
  var name = 'testFindNoRowNeighborWest';
  var currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  var existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x15y7': { 'id' : 'x15y7', 'x': 15, 'y': 7},
    'x14y7': { 'id' : 'x14y7', 'x': 14, 'y': 7}
  };
  var neighbor = findRowNeighbor(currentCell, existingCells, 'west');
  var result1 = (neighbor.y === 7) ? true : false;
  var result2 = (neighbor.x === 0) ? true : false;
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testPrepareCellChannels() {
  var name = 'testPrepareCellChannels';
  field = { 
    'x0y0': { 'id' : 'x0y0', 'x': 0, 'y': 0}, 
    'x0y1': { 'id' : 'x0y1', 'x': 0, 'y': 1, 'route': 'esw'}, 
    'x0y3': { 'id' : 'x0y3', 'x': 0, 'y': 3}, 
    'x0y6': { 'id' : 'x0y6', 'x': 0, 'y': 6}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0, 'route': 'all'}, 
    'x4y1': { 'id' : 'x4y1', 'x': 4, 'y': 1}, 
    'x4y3': { 'id' : 'x4y3', 'x': 4, 'y': 3}, 
    'x4y6': { 'id' : 'x4y6', 'x': 4, 'y': 6}, 
    'x8y0': { 'id' : 'x8y0', 'x': 8, 'y': 0}, 
    'x3y1': { 'id' : 'x3y1', 'x': 3, 'y': 1}, 
    'x3y3': { 'id' : 'x3y3', 'x': 3, 'y': 3}, 
    'x7y6': { 'id' : 'x7y6', 'x': 7, 'y': 6}, 
    'x7y4': { 'id' : 'x7y4', 'x': 7, 'y': 4}, 
    'x11y2': { 'id' : 'x11y2', 'x': 11, 'y': 2}, 
    'x11y4': { 'id' : 'x11y4', 'x': 11, 'y': 4, 'route' : 'all'}, 
    'x11y7': { 'id' : 'x11y7', 'x': 11, 'y': 7}
    };
  
  var channels1 = prepareCellChannels('x11y4');
  var result1 = (channels1[0][1] === 11) ? true : false;
  var result2 = (channels1[0][2] === 4) ? true : false;
  var result3 = (channels1[0][3] === 11) ? true : false;
  var result4 = (channels1[0][4] === 2) ? true : false;
  var result5 = (channels1[1][3] === 15) ? true : false;
  var result6 = (channels1[1][4] === 4) ? true : false;
  var result7 = (channels1[3][3] === 7) ? true : false;
  var result8 = (channels1[3][4] === 4) ? true : false;  
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testDrawChannels() {
  var name = 'testDrawChannels';
  field = { 
    'x6y3': { 'id' : 'x6y3', 'x': 6, 'y': 3, 'route': 'all'}, 
    'x1y3': { 'id' : 'x1y3', 'x': 1, 'y': 3, 'route': 'esw'}, 
    'x11y3': { 'id' : 'x11y3', 'x': 11, 'y': 3, 'route': 'nn'},  
    'x6y1': { 'id' : 'x6y1', 'x': 6, 'y': 1, 'route': 'all'}, 
    'x6y6': { 'id' : 'x6y6', 'x': 6, 'y': 6, 'route': 'shell'},
    'x0y3': { 'id' : 'x0y3', 'x': 0, 'y': 3, 'route': 'all'}, 
    'x6y0': { 'id' : 'x6y0', 'x': 6, 'y': 0, 'route': 'nn'}, 
    'x17y3': { 'id' : 'x17y3', 'x': 17, 'y': 3, 'route': 'ee'}, 
    'x6y7': { 'id' : 'x6y7', 'x': 6, 'y': 7, 'route': 'ss'}, 
    };
  var channels = drawChannels('x6y3');
  var result1 = (channels[0][0] == 'drawChannel') ? true : false;
  var result2 = (channels[0][3] == 6) ? true : false;
  var result3 = (channels[0][4] == 1) ? true : false;
  var result4 = (channels[1][3] == 11) ? true : false;
  var result5 = (channels[1][4] == 3) ? true : false;
  var result6 = (channels[2][3] == 6) ? true : false;
  var result7 = (channels[2][4] == 6) ? true : false;  
  var result8 = (channels[3][3] == 1) ? true : false;
  var result9 = (channels[3][4] == 3) ? true : false;  
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8 && result9) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSelectedCellId() {
  var name = 'testGetSelectedCellId';
  state.selectedCellId = 'kfajslkdfj';
  var result1 = getSelectedCellId();
  var result = (result1 == 'kfajslkdfj') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIsMenuActive() {
  var name = 'testGetIsMenuActive';
  var result1 = getIsMenuActive();
  state.isMenuActive = true;
  var result2 = getIsMenuActive();
  var result = (!result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIsMidiPaletteActive() {
  var name = 'testGetisMidiPaletteActive';
  var result1 = getIsMidiPaletteActive();
  state.isMidiPaletteActive = true;
  var result2 = getIsMidiPaletteActive();
  var result = (!result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

/*
 * Orchestration
 * ============================================================================
 */

function resetTestSuite() {
  init();
  setWidth(16);
  setHeight(8);
  initField();
  initSignals();
  outletsOff();
}

function testSuite() {

  var results = [];

  resetTestSuite();
  results.push(testInitCell());
  results.push(testInitCellById());
  results.push(testMakeId());
  results.push(testGetCell());
  results.push(testMakeSignal());
  results.push(testGetSignal());
  results.push(testGetSignalSpeed());
  results.push(testDeleteSignal());
  results.push(testGetCellStructureIsInitializedToNone());
  results.push(testArrayContains());
  results.push(testObjectSize());
  results.push(testMakeFieldIsStructuredToSpec());
  results.push(testSetMenu());
  results.push(testSetMidiPalette());
  results.push(testSetTime());
  results.push(testSetWidth());
  results.push(testSetHeight());
  results.push(testOpenMenu());
  results.push(testOpenMidiPalette());
  results.push(testSingleMidiPaletteEvent());
  results.push(testGetNote());
  results.push(testGetRouteDirections());
  results.push(testDeselectCell());
  results.push(testSelectCell());
  results.push(testCloseMenu());
  results.push(testCloseMidiPalette());
  results.push(testOutletsOnOff());
  results.push(testClearField());

  resetTestSuite();
  results.push(testOut());

  resetTestSuite();
  results.push(testSingleFieldEventOnEmptyCell());

  resetTestSuite();
  results.push(testGetExistingCells());

  resetTestSuite();
  results.push(testDrawRoute());

  resetTestSuite();
  results.push(testDrawMenuRoute());
  results.push(testDrawMenuStructure());
  results.push(testDrawMenuInterval());

  resetTestSuite();
  results.push(testdrawCells());
  
  resetTestSuite();
  results.push(testGetIds());

  resetTestSuite();
  results.push(testDumpRoutes());
  results.push(testDumpStructures());

  resetTestSuite();
  results.push(testMoveCell());

  resetTestSuite();
  results.push(testCycleRoutes());

  resetTestSuite();
  results.push(testDeleteCell());

  resetTestSuite();
  results.push(testDrawChannel());

  resetTestSuite();
  results.push(testFindColumnNeighborNorth());
  results.push(testFindNoColumnNeighborNorth());
  results.push(testFindColumnNeighborSouth());
  results.push(testFindNoColumnNeighborSouth());
  results.push(testFindRowNeighborWest());
  results.push(testFindNoRowNeighborWest());
  results.push(testFindRowNeighborEast());
  results.push(testFindNoRowNeighborEast());

  resetTestSuite();
  results.push(testPrepareCellChannels());

  resetTestSuite();
  results.push(testDrawChannels());

  resetTestSuite();
  results.push(testGetSelectedCellId());
  results.push(testGetIsMenuActive());
  results.push(testGetIsMidiPaletteActive());


  return results;
}

/*
 * Test Framework
 * ============================================================================
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
 * ============================================================================
 */

runTestSuite();
