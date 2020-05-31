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
 *
 */

function testInitCell() {
  var name = 'testInitCell';
  var cell = initCell(6, 14);
  var result1 = (cell.id == 'x6y14');
  var result2 = (cell.isExists == false);
  var result3 = (cell.x == 6);
  var result4 = (cell.y == 14);
  var result5 = (cell.route == 'off');
  var result6 = (cell.structure == 'none');
  var result7 = (cell.note == 60);
  var result8 = (cell.interval == 4);
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testInitCellById() {
  var name = 'testInitCellById';
  var id = 'x3y8';
  var cell = initCellById(id);
  var result1 = (cell.id == 'x3y8');
  var result2 = (cell.isExists == false);
  var result3 = (cell.x == 3);
  var result4 = (cell.y == 8);
  var result5 = (cell.route == 'off');
  var result6 = (cell.structure == 'none');
  var result7 = (cell.note == 60);
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

function testGetCellByCoords() {
  var name = 'testGetCellByCoords';
  var cell = getCellByCoords(5, 4);
  var result = (typeof cell === 'object' && cell !== null) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignal() {
  var name = 'testGetSignal';
  ECOLOGIES_GLOBAL_SIGNALS.x3y3 = makeSignal(3, 3, 'n');
  var signal = getSignal(3, 3);
  var result1 = (typeof signal === 'object' && signal !== null);
  var result2 = (signal.x === 3);
  var result3 = (signal.direction === 'n');
  var result = (result1 && result2 && result3)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMakeSignal() {
  var name = 'testMakeSignal';
  setGeneration(28);
  var signal = makeSignal(4, 5, 'e');
  var result1 = (signal.id === 'x4y5');
  var result2 = (signal.x === 4);
  var result3 = (signal.y === 5);
  var result4 = (signal.direction === 'e');
  var result5 = (signal.generation === 28);
  var result = (result1 && result2 && result3 && result4 && result5)  ? 'pass' : 'fail';
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

function testGetCellStructure() {
  var name = 'testGetCellStructure';
  var cell = getCellByCoords(0, 0);
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

function testInitCells() {
  var name = 'testInitCells';
  initCells();
  var cell = getCell('x10y4'); // arbitrary id
  var isExists = (cell.isExists === false);
  var x = (cell.x == 10);
  var y = (cell.y == 4);
  var route = (cell.route == 'off');
  var structure = (cell.structure == 'none');
  var note = (cell.note == 60);
  var result = (isExists && x && y && route && structure && note) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetMenu() {
  var name = 'testSetMenu';
  setMenu(true);
  var result1 = (ECOLOGIES_GLOBAL_STATE.isMenuActive == true);
  setMenu(false);
  var result2 = (ECOLOGIES_GLOBAL_STATE.isMenuActive == false);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetMidiPalette() {
  var name = 'testSetMidiPalette';
  setMidiPalette(true);
  var result1 = (ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive == true);
  setMidiPalette(false);
  var result2 = (ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive == false);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetWidth() {
  var name = 'testSetWidth';
  setWidth(7);
  var result = (ECOLOGIES_GLOBAL_STATE.width == 7) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetHeight() {
  var name = 'testSetHeight';
  setHeight(48);
  var result = (ECOLOGIES_GLOBAL_STATE.height == 48) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetGeneration() {
  var name = 'testSetGeneration';
  setGeneration(51);
  var result = (ECOLOGIES_GLOBAL_STATE.generation == 51) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenMenu() {
  var name = 'testOpenMenu';
  var result1 = (openMenu() == 'openMenu');
  var result2 = (ECOLOGIES_GLOBAL_STATE.isMenuActive === true);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenMidiPalette() {
  var name = 'testOpenMidiPalette';
  var msg = openMidiPalette();
  var result1 = (ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive);
  var result2 = (msg == 'drawMidiPalette');
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSingleMidiPaletteEvent() {
  var name = 'testSingleMidiPaletteEvent';
  ECOLOGIES_GLOBAL_STATE.selectedCellId = 'x0y0';
  ECOLOGIES_GLOBAL_CELLS.x0y0.note = 60;
  var msg = singleMidiPaletteEvent(2, 2);
  var result1 = (ECOLOGIES_GLOBAL_CELLS.x0y0.note == 55);
  var result2 = (msg[0] == 'animateMidiNotePress');
  var result3 = (msg[1] == 2);
  var result4 = (msg[2] == 2);
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetNote() {
  var name = 'testGetNote';
  var result1 = (getNote(2, 2) == 55);
  var result2 = (getNote(5, 3) == 64);
  var result3 = (getNote(5, 4) == 70);
  var result4 = (getNote(6, 6) == 83);
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
  var result1 = ( test1[0] == 'n' && test1[1] ==  'e' && test1[2] == 's');
  var result2 = ( test2[0] == 'n' && test2[1] ==  'e' && test2[2] == 's' && test2[3] == 'w');
  var result3 = ( test3[0] == 'e');
  var result4 = ( test4.length == 0);
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDeselectCell() {
  var name = 'testDeselectCell';
  ECOLOGIES_GLOBAL_STATE.selectedCellId = 'x0y0';
  deselectCell();
  var result = (ECOLOGIES_GLOBAL_STATE.selectedCellId === false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSelectCell() {
  var name = 'testSelectCell';
  selectCell('x6y3');
  var result = (ECOLOGIES_GLOBAL_STATE.selectedCellId === 'x6y3') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseMenu() {
  var name = 'testCloseMenu';
  var result1 = (closeMenu() == 'closeMenu');
  var result2 = (ECOLOGIES_GLOBAL_STATE.isMenuActive === false);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseMidiPalette() {
  var name = 'testCloseMidiPalette';
  closeMidiPalette();
  var result = (!ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOutletsOnOff() {
  var name = 'testOutletsOnOff';
  setOutlets(1);
  var result1 = (isOutletsOn() == true) ? 'pass' : 'fail'; 
  setOutlets(0);
  var result2 = (isOutletsOn() == false) ? 'pass' : 'fail';
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
  var cell = getCellByCoords(2, 2);
  var result1 = (cell.isExists);
  var result2 = (cell.structure == 'hive');
  var result3 = (cell.route == 'all');
  gridEvent('single', 2, 2);
  cell = getCellByCoords(2, 2);
  var result4 = (cell.route == 'ne');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetExistingCells() {
  var name = 'testGetExistingCells';
  ECOLOGIES_GLOBAL_CELLS.x0y0.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x1y0.isExists = true;
  var cells = getExistingCells();
  var result = (Object.size(cells) === 2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawRoute() {
  var name = 'testDrawRoute';
  singleFieldEvent(5, 6, 'none');
  var d = drawRoute('x5y6');
  var result1 = (d[0] === 'drawRoute');
  var result2 = (d[1] === 'all');
  var result3 = (d[2] === 5);
  var result4 = (d[3] === 6);
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuRoute() {
  var name = 'testDrawMenuRoute';
  ECOLOGIES_GLOBAL_CELLS.x4y3.route = 'random';
  var d = drawMenuRoute('x4y3');
  var result1 = (d[0] === 'drawRoute');
  var result2 = (d[1] === 'random');
  var result3 = (d[2] === 2);
  var result4 = (d[3] === 2);
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuStructure() {
  var name = 'testDrawMenuStructure';
  ECOLOGIES_GLOBAL_CELLS.x4y3.structure = 'nomad';
  var d = drawMenuStructure('x4y3');
  var result1 = (d[0] === 'drawStructure');
  var result2 = (d[1] === 'nomad');
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuInterval() {
  var name = 'testDrawMenuInterval';
  var d = drawMenuInterval(5);
  var result1 = (d[0] === 'drawMenuInterval');
  var result2 = (d[1] === 5);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testdrawCells() {
  var name = 'testDrawCells';
  ECOLOGIES_GLOBAL_CELLS.x0y0.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y2.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y3.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y0.route = 'all';
  ECOLOGIES_GLOBAL_CELLS.x0y2.route = 'stop';
  ECOLOGIES_GLOBAL_CELLS.x0y3.route = 'nse';
  ECOLOGIES_GLOBAL_CELLS.x0y0.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y2.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y3.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y0.y = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y2.y = 2;
  ECOLOGIES_GLOBAL_CELLS.x0y3.y = 3;
  ECOLOGIES_GLOBAL_CELLS.x0y0.structure = 'hive';
  ECOLOGIES_GLOBAL_CELLS.x0y2.structure = 'nomad';
  ECOLOGIES_GLOBAL_CELLS.x0y3.structure = 'hive';
  var h = drawCells();
  var result1 = (h.length === 4);
  var result2 = (h[0] === 'drawCells');
  var result5 = (h[1] === 'x0y3');
  var result4 = (h[2] === 'x0y2');
  var result3 = (h[3] === 'x0y0');  
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
  var result1 = (arr[0] === 'routesList');
  var result2 = (arr.includes('nes'));
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDumpStructures() {
  var name = 'testDumpStructures';
  var arr = dumpStructures();
  var result1 = (arr[0] === 'structuresList');
  var result2 = (arr.includes('hive'));
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMoveCell() {
  var name = 'testMoveCell';
  ECOLOGIES_GLOBAL_CELLS.x0y0.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x6y6.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y0.route = 'random';
  ECOLOGIES_GLOBAL_CELLS.x6y6.route = 'all';
  ECOLOGIES_GLOBAL_CELLS.x0y0.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x6y6.x = 6;
  ECOLOGIES_GLOBAL_CELLS.x0y0.y = 0;
  ECOLOGIES_GLOBAL_CELLS.x6y6.y = 6;
  ECOLOGIES_GLOBAL_CELLS.x0y0.structure = 'nomad';
  ECOLOGIES_GLOBAL_CELLS.x6y6.structure = 'hive';
  ECOLOGIES_GLOBAL_CELLS.x0y0.note = 51;
  ECOLOGIES_GLOBAL_CELLS.x6y6.note = 56;
  moveCell('x0y0', 'x6y6');
  var result1 = (ECOLOGIES_GLOBAL_CELLS.x0y0.isExists === false);
  var result2 = (ECOLOGIES_GLOBAL_CELLS.x6y6.route === 'random' );
  var result3 = (ECOLOGIES_GLOBAL_CELLS.x6y6.structure === 'nomad');
  var result4 = (ECOLOGIES_GLOBAL_CELLS.x0y0.id === 'x0y0');
  var result5 = (ECOLOGIES_GLOBAL_CELLS.x6y6.id === 'x6y6');
  var result6 = (ECOLOGIES_GLOBAL_CELLS.x6y6.note === 51);
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
  ECOLOGIES_GLOBAL_STATE.selectedCellId = 'x0y1';
  ECOLOGIES_GLOBAL_CELLS.x0y1.isExists = true;
  deleteCell('x0y1');
  var result1 = (ECOLOGIES_GLOBAL_STATE.selectedCellId === false);
  var result2 = (ECOLOGIES_GLOBAL_CELLS.x0y1.isExists === false);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawChannel() {
  var name = 'testDrawChannel';
  var arr = [0, 4, 0, 7];
  var d = drawChannel(arr);
  var result1 = (d[0] === 'drawChannel');
  var result2 = (d[1] === 0);
  var result3 = (d[2] === 4);
  var result4 = (d[3] === 0);
  var result5 = (d[4] === 7);
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
  var result1 = (neighbor.y === 5);
  var result2 = (neighbor.x === 4);
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
  var result1 = (neighbor.y === 5);
  var result2 = (neighbor.x === 4);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoColumnNeighborSouth() {
  var name = 'testFindNoColumnNeighborSouth';
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
  var result1 = (neighbor.y === 7);
  var result2 = (neighbor.x === 4);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoColumnNeighborNorth() {
  var name = 'testFindNoColumnNeighborNorth';
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
  var result1 = (neighbor.y === 0);
  var result2 = (neighbor.x === 4);
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
  var result1 = (neighbor.y === 7);
  var result2 = (neighbor.x === 2);
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
  var result1 = (neighbor.y === 7);
  var result2 = (neighbor.x === 14);
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
  var result1 = (neighbor.y === 7);
  var result2 = (neighbor.x === 15);
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
  var result1 = (neighbor.y === 7);
  var result2 = (neighbor.x === 0);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testPrepareCellChannels() {
  var name = 'testPrepareCellChannels';
  ECOLOGIES_GLOBAL_CELLS = { 
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
  var result1 = (channels1[0][1] === 11);
  var result2 = (channels1[0][2] === 4);
  var result3 = (channels1[0][3] === 11);
  var result4 = (channels1[0][4] === 2);
  var result5 = (channels1[1][3] === 15);
  var result6 = (channels1[1][4] === 4);
  var result7 = (channels1[3][3] === 7);
  var result8 = (channels1[3][4] === 4);  
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testDrawChannels() {
  var name = 'testDrawChannels';
  ECOLOGIES_GLOBAL_CELLS = { 
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
  var result1 = (channels[0][0] == 'drawChannel');
  var result2 = (channels[0][3] == 6);
  var result3 = (channels[0][4] == 1);
  var result4 = (channels[1][3] == 11);
  var result5 = (channels[1][4] == 3);
  var result6 = (channels[2][3] == 6);
  var result7 = (channels[2][4] == 6);  
  var result8 = (channels[3][3] == 1);
  var result9 = (channels[3][4] == 3);  
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8 && result9) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSelectedCellId() {
  var name = 'testGetSelectedCellId';
  ECOLOGIES_GLOBAL_STATE.selectedCellId = 'kfajslkdfj';
  var result1 = getSelectedCellId();
  var result = (result1 == 'kfajslkdfj') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIsMenuActive() {
  var name = 'testGetIsMenuActive';
  var result1 = getIsMenuActive();
  ECOLOGIES_GLOBAL_STATE.isMenuActive = true;
  var result2 = getIsMenuActive();
  var result = (!result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIsMidiPaletteActive() {
  var name = 'testGetisMidiPaletteActive';
  var result1 = getIsMidiPaletteActive();
  ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive = true;
  var result2 = getIsMidiPaletteActive();
  var result = (!result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testRollRandomRoute() {
  var name = 'testRollRandomRoute';
  var random = rollRandomRoute();
  var result = (Array.isArray(random)) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetCellsByStructure() {
  var name = 'testGetCellsByStructure';
  ECOLOGIES_GLOBAL_CELLS.x0y0.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y2.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y3.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y0.route = 'all';
  ECOLOGIES_GLOBAL_CELLS.x0y2.route = 'stop';
  ECOLOGIES_GLOBAL_CELLS.x0y3.route = 'nse';
  ECOLOGIES_GLOBAL_CELLS.x0y0.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y2.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y3.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y0.y = 0;
  ECOLOGIES_GLOBAL_CELLS.x0y2.y = 2;
  ECOLOGIES_GLOBAL_CELLS.x0y3.y = 3;
  ECOLOGIES_GLOBAL_CELLS.x0y0.structure = 'hive';
  ECOLOGIES_GLOBAL_CELLS.x0y2.structure = 'nomad';
  ECOLOGIES_GLOBAL_CELLS.x0y3.structure = 'hive';
  var hives = getCellsByStructure('hive');
  var result1 = (hives[0].id === 'x0y3');
  var result2 = (hives[0].structure === 'hive');
  var result3 = (hives.length == 2);
  var result = (result1 && result2 && result3) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testBirthSignals() {
  var name = 'testBirthSignals';
  ECOLOGIES_GLOBAL_CELLS.x0y0.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x2y7.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x11y5.isExists = true;
  ECOLOGIES_GLOBAL_CELLS.x0y0.route = 'all';
  ECOLOGIES_GLOBAL_CELLS.x2y7.route = 'all';
  ECOLOGIES_GLOBAL_CELLS.x11y5.route = 'all';
  ECOLOGIES_GLOBAL_CELLS.x0y0.x = 0;
  ECOLOGIES_GLOBAL_CELLS.x2y7.x = 2;
  ECOLOGIES_GLOBAL_CELLS.x11y5.x = 11;
  ECOLOGIES_GLOBAL_CELLS.x0y0.y = 0;
  ECOLOGIES_GLOBAL_CELLS.x2y7.y = 7;
  ECOLOGIES_GLOBAL_CELLS.x11y5.y = 5;
  ECOLOGIES_GLOBAL_CELLS.x0y0.structure = 'hive';
  ECOLOGIES_GLOBAL_CELLS.x2y7.structure = 'hive';
  ECOLOGIES_GLOBAL_CELLS.x11y5.structure = 'hive';
  var signals = birthSignals();
  // this is a very important test...
  // THINK OF THE CHILDREN
  var result = (
    (signals[0].id === 'x2y6') &&
    (signals[0].x === 2) &&
    (signals[0].y === 6) &&
    (signals[0].direction === 'n') &&
    (signals[1].id === 'x3y7') &&
    (signals[1].x === 3) &&
    (signals[1].y === 7) &&
    (signals[1].direction === 'e') &&
    (signals[2].id === 'x1y7') &&
    (signals[2].x === 1) &&
    (signals[2].y === 7) &&
    (signals[2].direction === 'w') &&
    (signals[3].id === 'x11y4') &&
    (signals[3].x === 11) &&
    (signals[3].y === 4) &&
    (signals[3].direction === 'n') &&
    (signals[4].id === 'x12y5') &&
    (signals[4].x === 12) &&
    (signals[4].y === 5) &&
    (signals[4].direction === 'e') &&
    (signals[5].id === 'x11y6') &&
    (signals[5].x === 11) &&
    (signals[5].y === 6) &&
    (signals[5].direction === 's') &&
    (signals[6].id === 'x10y5') &&
    (signals[6].x === 10) &&
    (signals[6].y === 5) &&
    (signals[6].direction === 'w') &&
    (signals[7].id === 'x1y0') &&
    (signals[7].x === 1) &&
    (signals[7].y === 0) &&
    (signals[7].direction === 'e') &&
    (signals[8].id === 'x0y1') &&
    (signals[8].x === 0) &&
    (signals[8].y === 1) &&
    (signals[8].direction === 's')
  ) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testEnrichHiveWithRouteDirections() {
  var name = 'testEnrichHiveWithRouteDirections';
  var hives = [{ 'route' : 'nes' }, { 'route' : 'ww' }];
  var enriched =  enrichWithHiveRouteDirections(hives);
  var result1 = (enriched[0].hiveRouteDirections[0] === 'n');
  var result2 = (enriched[0].hiveRouteDirections[1] === 'e');
  var result3 = (enriched[0].hiveRouteDirections[2] === 's');
  var result4 = (enriched[1].hiveRouteDirections[0] === 'w');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCancelCollidingSignals() {
  var name = 'testCancelCollidingSignals';
  var s1 = makeSignal(0, 0, 's');
  var s2 = makeSignal(3, 3, 'n');
  var s3 = makeSignal(6, 4, 'w');
  ECOLOGIES_GLOBAL_SIGNALS[s1.id] = s1;
  ECOLOGIES_GLOBAL_SIGNALS[s2.id] = s2;
  ECOLOGIES_GLOBAL_SIGNALS[s3.id] = s3;
  var existingSignals = getSignals();
  var b1 = makeSignal(0, 0, 'n');
  var b2 = makeSignal(3, 3, 'e');
  var b3 = makeSignal(6, 3, 'w');
  var birthedSignals = {'x0y0' : b1, 'x3y3' : b2, 'x6y3' : b3};
  var survivingSignals = cancelCollidingSignals(birthedSignals, existingSignals);
  var result1 = (survivingSignals.x6y4.direction === 'w');
  var result2 = (survivingSignals.x6y3.direction === 'w');
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetWidth() {
  var name = 'testGetWidth';
  var result = (getWidth() === 16) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetHeight() {
  var name = 'testGetWidth';
  var result = (getHeight() === 8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCollideSignalsWithCells() {
  var name = 'testCollideSignalsWithCells';
  var result = (false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testIsHiveBirthing() {
  var name = 'testIsHiveBirthing';
  setGeneration(1);
  var result1 = (isHiveBirthing(1));
  var result2 = (!isHiveBirthing(2));
  var result3 = (!isHiveBirthing(3));
  var result4 = (!isHiveBirthing(4));
  var result5 = (!isHiveBirthing(5));
  var result6 = (!isHiveBirthing(6));
  var generationOneResult = (result1 && result2 && result3 && result4 && result5 && result6);

  setGeneration(2);
  result1 = (isHiveBirthing(1));
  result2 = (isHiveBirthing(2));
  result3 = (!isHiveBirthing(3));
  result4 = (!isHiveBirthing(4));
  result5 = (!isHiveBirthing(5));
  result6 = (!isHiveBirthing(6));
  var generationTwoResult = (result1 && result2 && result3 && result4 && result5 && result6);

  setGeneration(36);
  result1 = (isHiveBirthing(1));
  result2 = (isHiveBirthing(2));
  result3 = (isHiveBirthing(3));
  result4 = (isHiveBirthing(4));
  result5 = (!isHiveBirthing(5));
  result6 = (isHiveBirthing(6));
  var generationThreeResult = (result1 && result2 && result3 && result4 && result5 && result6);

  setGeneration(105);
  result1 = (isHiveBirthing(1));
  result2 = (!isHiveBirthing(2));
  result3 = (isHiveBirthing(3));
  result4 = (!isHiveBirthing(4));
  result5 = (isHiveBirthing(5));
  result6 = (!isHiveBirthing(6));
  var generationFourResult = (result1 && result2 && result3 && result4 && result5 && result6);

  var result = (generationOneResult && generationTwoResult && generationThreeResult && generationFourResult ) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testIsInBounds() {
  var name = 'testIsInBounds';
  var result1 = isInBounds('x0y0');
  var result2 = !isInBounds('x6y39');
  var result3 = !isInBounds('x-1y9');
  var result4 = isInBounds('x4y4');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCancelOutOfBoundsSignals() {
  var name = 'testCancelOutOfBoundsSignals';
  var testSignals = [
    {'id': 'x0y0'},
    {'id': 'x26y39'},
    {'id': 'x1y9'},
    {'id': 'x4y5'}
  ];
  testSignals = cancelOutOfBoundsSignals(testSignals);
  var result = (testSignals[0].id == 'x0y0' && testSignals[1].id == 'x4y5') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetGeneration() {
  var name = 'testGetGeneration';
  setGeneration(45);
  var result = (getGeneration() == 45) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignals() {
  var name = 'testGetSignals';
  ECOLOGIES_GLOBAL_SIGNALS = { 'id' : 'anything' };
  var result = (getSignals().id == 'anything') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testPropagateSignals() {
  var name = 'testPropagateSignals';
  setGeneration(21);
  var testSignals = [
    {'id': 'x4y2', 'x': 4, 'y': 2, 'direction': 's', 'generation': 21},
    {'id': 'x0y0', 'x': 0, 'y': 0, 'direction': 's', 'generation': 20},
    {'id': 'x6y3', 'x': 6, 'y': 3, 'direction': 'e', 'generation': 20},
    {'id': 'x1y3', 'x': 1, 'y': 3, 'direction': 'w', 'generation': 20},
    {'id': 'x4y5', 'x': 4, 'y': 5, 'direction': 'n', 'generation': 20}
  ];

  setSignals(propagateSignals(testSignals));
  var checkSignals = getSignals();
  var result1 = (checkSignals[0].id == 'x0y1');
  var result2 = (checkSignals[1].id == 'x7y3');
  var result3 = (checkSignals[2].id == 'x0y3');
  var result4 = (checkSignals[3].id == 'x4y4');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetSignal() {
  var name = 'testSetSignal';
  setSignal('x0y1', {'id': 'x0y1', 'x': 0, 'y': 1, 'direction': 'random', 'generation' : 15});
  var result = (ECOLOGIES_GLOBAL_SIGNALS.x0y1.id == 'x0y1' && ECOLOGIES_GLOBAL_SIGNALS.x0y1.generation == 15) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawSignals() {
  var name = 'testDrawSignals';
  setSignal('x0y0', {'id': 'x0y0', 'x': 0, 'y': 0, 'direction': 's', 'generation' : 0});
  var drawArray = drawSignals();
  var result = (drawArray[0] == 'drawSignals' && drawArray[1] == 'x0y0') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetSignals() {
  var name = 'testSetSignals';
  setSignals('blhablahblabhl');
  var result1 = (getSignals() === 'blhablahblabhl');
  var newSignal = {'x1y0': { 'x': 13 }};
  setSignals(newSignal);
  var result2 = (getSignals().x1y0.x === 13);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCollideSignalsAndCells() {
  var name = 'testCollideSignalsAndCells';

  var result = false;
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
  initCells();
  initSignals();
  setOutlets(0);
}

function testSuite() {

  var results = [];

  resetTestSuite();
  results.push(testGetWidth());
  results.push(testGetHeight());
  results.push(testInitCell());
  results.push(testInitCellById());
  results.push(testMakeId());
  results.push(testGetCellByCoords());
  results.push(testMakeSignal());
  results.push(testGetSignal());
  results.push(testGetSignalSpeed());
  results.push(testDeleteSignal());
  results.push(testRollRandomRoute());
  results.push(testGetCellStructure());
  results.push(testArrayContains());
  results.push(testObjectSize());
  results.push(testInitCells());
  results.push(testSetMenu());
  results.push(testSetMidiPalette());
  results.push(testSetWidth());
  results.push(testSetHeight());
  results.push(testSetGeneration());
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

  resetTestSuite();
  results.push(testGetCellsByStructure());

  resetTestSuite();
  results.push(testBirthSignals());
  results.push(testEnrichHiveWithRouteDirections());

  resetTestSuite();
  results.push(testCancelCollidingSignals());

  resetTestSuite();
  results.push(testIsHiveBirthing());
  results.push(testIsInBounds());
  results.push(testCancelOutOfBoundsSignals());
  results.push(testGetGeneration());
  results.push(testGetSignals());

  resetTestSuite();
  results.push(testPropagateSignals());

  resetTestSuite();
  results.push(testDrawSignals());

  resetTestSuite();
  results.push(testSetSignals());

  resetTestSuite();
  results.push(testSetSignal());

  resetTestSuite();
  results.push(testCollideSignalsAndCells());

  return results;
}

/*
 * Test Framework
 * ============================================================================
 */

function drawBorder() {
  console.log('+==================================+');
}

function testOutput(name, result) {
  var testResult = (result != 'pass') ? '\x1b[7m' : '';
  testResult += result + '\t' + name;
  testResult += (result != 'pass') ? '\x1b[0m' : '';
  console.log(testResult);
}

function runTestSuite() {
  drawBorder();
  var results = testSuite();
  var counts = {};
  results.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  drawBorder();
  console.log('Final Results:');
  console.log(counts);
  drawBorder();
}

runTestSuite();