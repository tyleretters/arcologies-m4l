/*
 * arcologies tests
 * ============================================================================
 *
 * By:        Tyler Etters
 * Date:      June, 2020
 * Docs:      https://tyleretters.github.io/arcologies 
 * Site:      https://nor.the-rn.info
 * License:   Attribution 4.0 International (CC BY 4.0)
 *
 * File Organization:
 *  - Tests
 *  - Orchestration
 *  - Test Framework
 *
 */

/*jshint esversion: 6 */
const core = require('@actions/core');
const github = require('@actions/github');

function testInitCell() {
  var name = 'testInitCell';
  var cell = initCell(6, 14);
  var result1 = (cell.id == 'x6y14');
  var result2 = (cell.isExists == false);
  var result3 = (cell.x == 6);
  var result4 = (cell.y == 14);
  var result5 = (cell.route == 'off');
  var result6 = (cell.structure == 'hive');
  var result7 = (cell.note == 60);
  var result8 = (cell.metabolism == 4);
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
  var result6 = (cell.structure == 'hive');
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

function testGetCell() {
  var name = 'testGetCell';
  initCellById('x5y4');
  var cell = getCell('x5y4');
  var result = (typeof cell === 'object' && cell !== null) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignal() {
  var name = 'testGetSignal';
  ARCOLOGIES_GLOBAL_SIGNALS.x3y3 = makeSignal(3, 3, 'n');
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
  var cell = getCellByCoords(1, 0);
  var result = (cell.structure === 'hive') ? 'pass' : 'fail';
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
  var cell = getCell('x10y4');
  var x = (cell.x == 10);
  var y = (cell.y == 4);
  var route = (cell.route == 'off');
  var structure = (cell.structure == 'hive');
  var note = (cell.note == 60);
  var result = (x && y && route && structure && note) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}


function testSetMidiPalette() {
  var name = 'testSetMidiPalette';
  setMidiPalette(true);
  var result1 = (ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive == true);
  setMidiPalette(false);
  var result2 = (ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive == false);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetWidth() {
  var name = 'testSetWidth';
  setWidth(7);
  var result = (ARCOLOGIES_GLOBAL_STATE.width == 7) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetHeight() {
  var name = 'testSetHeight';
  setHeight(48);
  var result = (ARCOLOGIES_GLOBAL_STATE.height == 48) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetGeneration() {
  var name = 'testSetGeneration';
  setGeneration(51);
  var result = (ARCOLOGIES_GLOBAL_STATE.generation == 51) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenQuickMenu() {
  var name = 'testOpenQuickMenu';
  openQuickMenu();
  var result = (ARCOLOGIES_GLOBAL_STATE.isQuickMenuActive === true) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenMidiPalette() {
  var name = 'testOpenMidiPalette';
  var msg = openMidiPalette();
  var result = (ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMidiPaletteEvent() {
  var name = 'testMidiPaletteEvent';
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = 'x4y4';
  ARCOLOGIES_GLOBAL_CELLS.x4y4.note = 60;
  var msg = midiPaletteEvent(1, 0);
  var result = (ARCOLOGIES_GLOBAL_CELLS.x4y4.note == 90) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetMidiNote() {
  var name = 'testGetMidiNote';
  var result1 = (getMidiNote(2, 2) == 75);
  var result2 = (getMidiNote(6, 7) == 36);
  var result3 = (getMidiNote(1, 0) == 90);
  var result = (result1 && result2 && result3) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testNoteArrayKey() {
  var name = 'testNoteArrayKey';
  var result1 = (noteArrayKey(1, 0) == 0);
  var result2 = (noteArrayKey(2, 0) == 1);
  var result3 = (noteArrayKey(3, 0) == 2);
  var result = (result1 && result2 && result3) ? 'pass' : 'fail';
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
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = 'x1y0';
  deselectCell();
  var result = (ARCOLOGIES_GLOBAL_STATE.selectedCellId === false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSelectCell() {
  var name = 'testSelectCell';
  selectCell('x6y3');
  var result = (ARCOLOGIES_GLOBAL_STATE.selectedCellId === 'x6y3') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseQuickMenu() {
  var name = 'testCloseQuickMenu';
  openQuickMenu();
  closeQuickMenu();
  var result = (ARCOLOGIES_GLOBAL_STATE.isQuickMenuActive === false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseMidiPalette() {
  var name = 'testCloseMidiPalette';
  closeMidiPalette();
  var result = (!ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive) ? 'pass' : 'fail';
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

function testfieldEventOnEmptyCell() {
  var name = 'testfieldEventOnEmptyCell';
  fieldEvent(2, 2);
  var cell = getCellByCoords(2, 2);
  var result1 = (cell.isExists);
  var result2 = (cell.structure == 'hive');
  var result3 = (cell.route == 'all');
  fieldEvent(2, 2);
  cell = getCellByCoords(2, 2);
  var result4 = (cell.route == 'ne');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetExistingCells() {
  var name = 'testGetExistingCells';
  ARCOLOGIES_GLOBAL_CELLS.x1y0.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x15y7.isExists = true;
  var cells = getExistingCells();
  var result = (Object.size(cells) === 2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawRoute() {
  var name = 'testDrawRoute';
  fieldEvent(5, 6);
  var d = drawRoute('x5y6');
  var result1 = (d[0] === 'drawRoute');
  var result2 = (d[1] === 'all');
  var result3 = (d[2] === 5);
  var result4 = (d[3] === 6);
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testdrawCells() {
  var name = 'testDrawCells';
  var result1 = (drawCells()[0] == 'drawCells');
  var result2 = (drawCells().length == 2);
  var result3 = (drawCells('hive')[1] == 'hive');
  var result4 = (drawCells('hive').length === 2);
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIds() {
  var name = 'testGetIds';
  var obj = {'x1y0':{}, 'x1y2':{}, 'x4y8':{}};
  var ids = getIds(obj);
  var result = (ids.length === 3) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}


function testMoveCell() {
  var name = 'testMoveCell';
  ARCOLOGIES_GLOBAL_CELLS.x1y0.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x6y6.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.route = 'random';
  ARCOLOGIES_GLOBAL_CELLS.x6y6.route = 'all';
  ARCOLOGIES_GLOBAL_CELLS.x1y0.x = 1;
  ARCOLOGIES_GLOBAL_CELLS.x6y6.x = 6;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.y = 0;
  ARCOLOGIES_GLOBAL_CELLS.x6y6.y = 6;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.structure = 'shrine';
  ARCOLOGIES_GLOBAL_CELLS.x6y6.structure = 'hive';
  ARCOLOGIES_GLOBAL_CELLS.x1y0.note = 51;
  ARCOLOGIES_GLOBAL_CELLS.x6y6.note = 56;
  moveCell('x1y0', 'x6y6');
  var result1 = (ARCOLOGIES_GLOBAL_CELLS.x1y0.isExists === false);
  var result2 = (ARCOLOGIES_GLOBAL_CELLS.x6y6.route === 'random' );
  var result3 = (ARCOLOGIES_GLOBAL_CELLS.x6y6.structure === 'shrine');
  var result4 = (ARCOLOGIES_GLOBAL_CELLS.x1y0.id === 'x1y0');
  var result5 = (ARCOLOGIES_GLOBAL_CELLS.x6y6.id === 'x6y6');
  var result6 = (ARCOLOGIES_GLOBAL_CELLS.x6y6.note === 51);
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
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = 'x1y1';
  ARCOLOGIES_GLOBAL_CELLS.x1y1.isExists = true;
  deleteCell('x1y1');
  var result1 = (ARCOLOGIES_GLOBAL_STATE.selectedCellId === false);
  var result2 = (ARCOLOGIES_GLOBAL_CELLS.x1y1.isExists === false);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawLeyline() {
  var name = 'testDrawLeyline';
  var arr = [0, 4, 0, 7];
  var d = drawLeyline(arr);
  var result1 = (d[0] === 'drawLeyline');
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
    'x1y7': { 'id' : 'x1y7', 'x': 1, 'y': 7}, 
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
    'x1y7': { 'id' : 'x1y7', 'x': 1, 'y': 7}, 
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
  var result2 = (neighbor.x === 1);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testPrepareCellLeylines() {
  var name = 'testPrepareCellLeylines';
  ARCOLOGIES_GLOBAL_CELLS = { 
    'x1y0': { 'id' : 'x1y0', 'x': 1, 'y': 0}, 
    'x1y1': { 'id' : 'x1y1', 'x': 1, 'y': 1, 'route': 'esw'}, 
    'x1y3': { 'id' : 'x1y3', 'x': 1, 'y': 3}, 
    'x1y6': { 'id' : 'x1y6', 'x': 1, 'y': 6}, 
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
  
  var leylines1 = prepareCellLeylines('x11y4');
  var result1 = (leylines1[0][1] === 11);
  var result2 = (leylines1[0][2] === 4);
  var result3 = (leylines1[0][3] === 11);
  var result4 = (leylines1[0][4] === 2);
  var result5 = (leylines1[1][3] === 15);
  var result6 = (leylines1[1][4] === 4);
  var result7 = (leylines1[3][3] === 7);
  var result8 = (leylines1[3][4] === 4);  
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testDrawLeylines() {
  var name = 'testDrawLeylines';
  ARCOLOGIES_GLOBAL_CELLS = { 
    'x6y3': { 'id' : 'x6y3', 'x': 6, 'y': 3, 'route': 'all'}, 
    'x1y3': { 'id' : 'x1y3', 'x': 1, 'y': 3, 'route': 'esw'}, 
    'x11y3': { 'id' : 'x11y3', 'x': 11, 'y': 3, 'route': 'nn'},  
    'x6y1': { 'id' : 'x6y1', 'x': 6, 'y': 1, 'route': 'all'}, 
    'x6y6': { 'id' : 'x6y6', 'x': 6, 'y': 6, 'route': 'shell'},
    'x6y0': { 'id' : 'x6y0', 'x': 6, 'y': 0, 'route': 'nn'}, 
    'x17y3': { 'id' : 'x17y3', 'x': 17, 'y': 3, 'route': 'ee'}, 
    'x6y7': { 'id' : 'x6y7', 'x': 6, 'y': 7, 'route': 'ss'}, 
    };
  var leylines = drawLeylines('x6y3');
  var result1 = (leylines[0][0] == 'drawLeyline');
  var result2 = (leylines[0][3] == 6);
  var result3 = (leylines[0][4] == 1);
  var result4 = (leylines[1][3] == 11);
  var result5 = (leylines[1][4] == 3);
  var result6 = (leylines[2][3] == 6);
  var result7 = (leylines[2][4] == 6);  
  var result8 = (leylines[3][3] == 1);
  var result9 = (leylines[3][4] == 3);  
  var result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8 && result9) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSelectedCellId() {
  var name = 'testGetSelectedCellId';
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = 'kfajslkdfj';
  var result1 = getSelectedCellId();
  var result = (result1 == 'kfajslkdfj') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}


function testIsMidiPaletteActive() {
  var name = 'testIsMidiPaletteActive';
  var result1 = isMidiPaletteActive();
  ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive = true;
  var result2 = isMidiPaletteActive();
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
  ARCOLOGIES_GLOBAL_CELLS.x1y0.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x1y2.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x1y3.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.route = 'all';
  ARCOLOGIES_GLOBAL_CELLS.x1y2.route = 'stop';
  ARCOLOGIES_GLOBAL_CELLS.x1y3.route = 'nse';
  ARCOLOGIES_GLOBAL_CELLS.x1y0.x = 1;
  ARCOLOGIES_GLOBAL_CELLS.x1y2.x = 1;
  ARCOLOGIES_GLOBAL_CELLS.x1y3.x = 1;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.y = 0;
  ARCOLOGIES_GLOBAL_CELLS.x1y2.y = 2;
  ARCOLOGIES_GLOBAL_CELLS.x1y3.y = 3;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.structure = 'hive';
  ARCOLOGIES_GLOBAL_CELLS.x1y2.structure = 'shrine';
  ARCOLOGIES_GLOBAL_CELLS.x1y3.structure = 'hive';
  var hives = getCellsByStructure('hive');
  var result1 = (hives[0].id === 'x1y3');
  var result2 = (hives[0].structure === 'hive');
  var result3 = (hives.length == 2);
  var result = (result1 && result2 && result3) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

// very brittle test - if you change the sorting
// of the array the test will break. this is intentional.
function testBirthSignals() {
  var name = 'testBirthSignals';
  setGeneration(0);
  ARCOLOGIES_GLOBAL_CELLS.x1y0.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x2y7.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x11y5.isExists = true;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.route = 'all';
  ARCOLOGIES_GLOBAL_CELLS.x2y7.route = 'all';
  ARCOLOGIES_GLOBAL_CELLS.x11y5.route = 'all';
  ARCOLOGIES_GLOBAL_CELLS.x1y0.x = 1;
  ARCOLOGIES_GLOBAL_CELLS.x2y7.x = 2;
  ARCOLOGIES_GLOBAL_CELLS.x11y5.x = 11;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.y = 0;
  ARCOLOGIES_GLOBAL_CELLS.x2y7.y = 7;
  ARCOLOGIES_GLOBAL_CELLS.x11y5.y = 5;
  ARCOLOGIES_GLOBAL_CELLS.x1y0.structure = 'hive';
  ARCOLOGIES_GLOBAL_CELLS.x2y7.structure = 'hive';
  ARCOLOGIES_GLOBAL_CELLS.x11y5.structure = 'hive';
  var signals = birthSignals();
  // this is a very imgateant test...
  // THINK OF THE CHILDREN
  var result = (
    (signals.x2y6.id === 'x2y6') &&
    (signals.x2y6.x === 2) &&
    (signals.x2y6.y === 6) &&
    (signals.x2y6.direction === 'n') &&
    (signals.x3y7.id === 'x3y7') &&
    (signals.x3y7.x === 3) &&
    (signals.x3y7.y === 7) &&
    (signals.x3y7.direction === 'e') &&
    (signals.x1y7.id === 'x1y7') &&
    (signals.x1y7.x === 1) &&
    (signals.x1y7.y === 7) &&
    (signals.x1y7.direction === 'w') &&
    (signals.x11y4.id === 'x11y4') &&
    (signals.x11y4.x === 11) &&
    (signals.x11y4.y === 4) &&
    (signals.x11y4.direction === 'n') &&
    (signals.x12y5.id === 'x12y5') &&
    (signals.x12y5.x === 12) &&
    (signals.x12y5.y === 5) &&
    (signals.x12y5.direction === 'e') &&
    (signals.x11y6.id === 'x11y6') &&
    (signals.x11y6.x === 11) &&
    (signals.x11y6.y === 6) &&
    (signals.x11y6.direction === 's') &&
    (signals.x10y5.id === 'x10y5') &&
    (signals.x10y5.x === 10) &&
    (signals.x10y5.y === 5) &&
    (signals.x10y5.direction === 'w') &&
    (signals.x2y0.id === 'x2y0') &&
    (signals.x2y0.x === 2) &&
    (signals.x2y0.y === 0) &&
    (signals.x2y0.direction === 'e') &&
    (signals.x1y1.id === 'x1y1') &&
    (signals.x1y1.x === 1) &&
    (signals.x1y1.y === 1) &&
    (signals.x1y1.direction === 's')
  ) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testEnrichWithRouteDirections() {
  var name = 'testEnrichWithRouteDirections';
  var hives = [{ 'route' : 'nes' }, { 'route' : 'ww' }];
  var enriched =  enrichWithRouteDirections(hives);
  var result1 = (enriched[0].routeDirections[0] === 'n');
  var result2 = (enriched[0].routeDirections[1] === 'e');
  var result3 = (enriched[0].routeDirections[2] === 's');
  var result4 = (enriched[1].routeDirections[0] === 'w');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCancelCollidingSignals() {
  var name = 'testCancelCollidingSignals';
  var s1 = makeSignal(0, 0, 's');
  var s2 = makeSignal(3, 3, 'n');
  var s3 = makeSignal(6, 4, 'w');
  ARCOLOGIES_GLOBAL_SIGNALS[s1.id] = s1;
  ARCOLOGIES_GLOBAL_SIGNALS[s2.id] = s2;
  ARCOLOGIES_GLOBAL_SIGNALS[s3.id] = s3;
  var existingSignals = getSignals();
  var b1 = makeSignal(0, 0, 'n');
  var b2 = makeSignal(3, 3, 'e');
  var b3 = makeSignal(6, 3, 'w');
  var birthedSignals = {'x1y0' : b1, 'x3y3' : b2, 'x6y3' : b3};
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

function testisInFieldBounds() {
  var name = 'testisInFieldBounds';
  var result1 = isInFieldBounds(1, 0);
  var result2 = !isInFieldBounds(6, 39);
  var result3 = !isInFieldBounds(-1, 9);
  var result4 = isInFieldBounds(4, 4);
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCancelOutOfBoundsSignals() {
  var name = 'testCancelOutOfBoundsSignals';
  var testSignals = [
    {'id': 'x1y0', 'x': 1, 'y': 0},
    {'id': 'x26y39', 'x': 26, 'y': 39},
    {'id': 'x1y9', 'x': 1, 'y': 9},
    {'id': 'x4y5', 'x': 4, 'y': 5}
  ];
  testSignals = cancelOutOfBoundsSignals(testSignals);
  var result = (testSignals.x1y0.id == 'x1y0' && testSignals.x4y5.id == 'x4y5') ? 'pass' : 'fail';
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
  ARCOLOGIES_GLOBAL_SIGNALS = { 'id' : 'anything' };
  var result = (getSignals().id == 'anything') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testPropagateSignals() {
  var name = 'testPropagateSignals';
  setGeneration(21);
  var testSignals = [
    {'id': 'x4y2', 'x': 4, 'y': 2, 'direction': 's', 'generation': 21},
    {'id': 'x1y0', 'x': 1, 'y': 0, 'direction': 's', 'generation': 20},
    {'id': 'x6y3', 'x': 6, 'y': 3, 'direction': 'e', 'generation': 20},
    {'id': 'x1y3', 'x': 1, 'y': 3, 'direction': 'w', 'generation': 20},
    {'id': 'x4y5', 'x': 4, 'y': 5, 'direction': 'n', 'generation': 20}
  ];
  setSignals(propagateSignals(testSignals));
  var checkSignals = getSignals();
  var result1 = (checkSignals.hasOwnProperty('x1y1'));
  var result2 = (checkSignals.hasOwnProperty('x7y3'));
  var result3 = (!checkSignals.hasOwnProperty('x1y3'));
  var result4 = (checkSignals.hasOwnProperty('x4y4'));
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetSignal() {
  var name = 'testSetSignal';
  setSignal('x1y1', {'id': 'x1y1', 'x': 1, 'y': 1, 'direction': 'random', 'generation' : 15});
  var result = (ARCOLOGIES_GLOBAL_SIGNALS.x1y1.id == 'x1y1' && ARCOLOGIES_GLOBAL_SIGNALS.x1y1.generation == 15) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawSignals() {
  var name = 'testDrawSignals';
  setGeneration(10);
  setSignal('x1y0', {'id': 'x1y0', 'x': 1, 'y': 0, 'direction': 's', 'generation' : 10});
  setSignal('x1y1', {'id': 'x1y1', 'x': 1, 'y': 1, 'direction': 's', 'generation' : 11});
  var drawArray = drawSignals();
  var result1 = (drawArray[0][0] == 'drawSignals' && drawArray[0][1] == 'x1y0');
  var result2 = (drawArray.length == 1);
  var result = (result1 && result2) ? 'pass' : 'fail';
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

function testSetCell() {
  var name = 'testSetCell';
  setCell('x1y1', {'id': 'x1y1', 'x': 1, 'y': 1, 'route': 'random'});
  var result = (ARCOLOGIES_GLOBAL_CELLS.x1y1.id == 'x1y1' && ARCOLOGIES_GLOBAL_CELLS.x1y1.route == 'random') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCollide() {
  var name = 'testCollide';
  
  setGeneration(10);

  // test collide with a hive and all gates open: destroy the signal
  var signal1 = makeSignal(1, 1, 'w');
  setCell('x1y1', {'id': 'x1y1', 'x': 1, 'y': 1, 'route': 'all', 'structure': 'hive', 'isExists': true});

  // test collide with a gate from a closed route: destroy the signal
  setCell('x5y5', {'id': 'x5y5', 'x': 5, 'y': 5, 'route': 'nn', 'structure': 'gate', 'isExists': true});
  var signal2 = makeSignal(5, 5, 'e');
  
  // test collide with a gate from an open route: reroute the signal
  var signal3 = makeSignal(6, 6, 's');
  setCell('x6y6', {'id': 'x6y6', 'x': 6, 'y': 6, 'route': 'nn', 'structure': 'gate', 'isExists': true});

  // test collide with a gate with multiple routes
  // should result in: x10y4 n, x9y5 w, x11y5 e
  var signal4 = makeSignal(10, 5, 'n'); // entering from the south
  setCell('x10y5', {'id': 'x10y5', 'x': 10, 'y': 5, 'route': 'all', 'structure': 'gate', 'isExists': true});

  var signals = { 'x1y1' : signal1, 'x5y5' : signal2, 'x6y6' : signal3, 'x10y5' : signal4 };
  var finalSurvivingSignals = collide(signals);

  var result1 = !getIds(finalSurvivingSignals).contains('x1y1');
  var result2 = !getIds(finalSurvivingSignals).contains('x5y5');
  var result3 = !getIds(finalSurvivingSignals).contains('x6y6');

  var result4a = getIds(finalSurvivingSignals).contains('x6y5');
  var result4b = (finalSurvivingSignals.x6y5.direction == 'n');
  var result4c = (finalSurvivingSignals.x6y5.generation == 11);

  var result5a = getIds(finalSurvivingSignals).contains('x10y4');
  var result5b = (finalSurvivingSignals.x10y4.direction == 'n');
  var result5c = (finalSurvivingSignals.x10y4.generation == 11);

  var result6a = getIds(finalSurvivingSignals).contains('x9y5');
  var result6b = (finalSurvivingSignals.x9y5.direction == 'w');
  var result6c = (finalSurvivingSignals.x9y5.generation == 11);

  var result7a = getIds(finalSurvivingSignals).contains('x11y5');
  var result7b = (finalSurvivingSignals.x11y5.direction == 'e');
  var result7c = (finalSurvivingSignals.x11y5.generation == 11);

  var result = (result1 && result2 && result3 && result4a && 
    result4b && result4c && result5a && result5b && result6c && 
    result6a && result6b && result6c && result7a && result7b &&
    result7c) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testEastToSouthRoute() {
  var name = 'testEastToSouthRoute';
  
  setGeneration(10);

  // test collide with a sw gate
  var signal = makeSignal(3, 0, 'e', 8, false);
  setCell('x4y0', {'id': 'x4y0', 'x': 4, 'y': 0, 'route': 'sw', 'structure': 'gate', 'isExists': true});

  var signals = { 'x4y0' : signal };
  setSignals(signals);

  advance();
  finalSurvivingSignals = getSignals();

  var result1 = getIds(finalSurvivingSignals).contains('x4y1');
  var result2 = (finalSurvivingSignals.x4y1.direction == 's');
  var result3 = (finalSurvivingSignals.x4y1.generation == 11);
  var result4 = !getIds(finalSurvivingSignals).contains('x4y0');
  var result5 = !getIds(finalSurvivingSignals).contains('x5y0');

  var result = (result1 && result2 && result3 && result4 && result5) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testNorthToNorthRoute() {
  var name = 'testNorthToNorthRoute';
  
  setGeneration(10);

  // test collide with a ws gate
  var signal = makeSignal(1, 0, 's');
  setCell('x1y1', {'id': 'x1y1', 'x': 1, 'y': 1, 'route': 'nn', 'structure': 'gate', 'isExists': true});

  var signals = { 'x1y1' : signal };
  setSignals(signals);

  advance();

  var finalSurvivingSignals = getSignals();

  var result1 = getIds(finalSurvivingSignals).contains('x1y0');
  var result2 = (finalSurvivingSignals.x1y0.direction == 'n');
  var result3 = (finalSurvivingSignals.x1y0.generation == 11);
  var result4 = !getIds(finalSurvivingSignals).contains('x1y1');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testRouteMatch() {
  var name = 'testTestRouteMatch';
  var result1 = !routeMatch(['n'], 'n');
  var result2 = routeMatch(['n', 's'], 'n');
  var result3 = routeMatch(['s'], 'n');
  var result4 = !routeMatch(['n', 's', 'e', 'w'], 'x');
  var result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSignalJSONIntegrity() {
  var name = 'testSignalJSONIntegrity';

  var signal = makeSignal(1, 1, 's', 5);
  setSignal(signal.id, signal);
  setGeneration(10);

  advance();

  var signals = getSignals();
  var result = (
    signals.hasOwnProperty('x1y2') &&
    signals.x1y2.id == 'x1y2' &&
    signals.x1y2.x == 1 &&
    signals.x1y2.y == 2 &&
    signals.x1y2.direction == 's' &&
    signals.x1y2.generation == 10
  ) ? 'pass' : 'fail';

  testOutput(name, result);
  return result;
}

function testSetQuickMenu() {
  var name = 'testSetQuickMenu';
  var result1 = isQuickMenuActive();
  setQuickMenu(true);
  var result2 = isQuickMenuActive();
  var result = (result1 == false && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testNoBlinkSelectedCell() {
  var name = 'testNoBlinkSelectedCell';
  var result = (noBlinkSelectedCell() == 'noBlinkSelectedCell') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetGetGlobalMidiNote() {
  var name = 'testSetGetGlobalMidiNote';
  setGlobalMidiNote(50);
  var result = (getGlobalMidiNote() == 50) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetGetGlobalStructure() {
  var name = 'testSetGetGlobalStructure';
  setGlobalStructure('pyramid');
  var result = (getGlobalStructure() == 'pyramid') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMetabolism() {
  var name = 'drawMetabolismFrom';
  msg1 = drawMetabolism();
  selectCell('x1y1');
  msg2 = drawMetabolism('x1y1');
  var result = (msg1[1] == 4 && msg2[0] == 'drawMetabolismFromJs' && msg2[1] == 4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenCloseMetabolismPalette() {
  var name = 'testOpenCloseMetabolismPalette';
  openMetabolismPalette();
  var result1 = isMetabolismPaletteActive();
  closeMetabolismPalette();
  var result2 = isMetabolismPaletteActive();
  var result = (result1 && !result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetMetabolismPalette() {
  var name = 'testSetMetabolismPalette';
  setMetabolismPalette(true);
  var result1 = isMetabolismPaletteActive();
  setGlobalMetabolism(true);
  var result2 = getGlobalMetabolism(true);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMetabolismPaletteEvent() {
  var name = 'testMetabolismPaletteEvent';
  selectCell('x1x3');
  metabolismPaletteEvent(5);
  var cell = getCell('x1x3');
  var result1 = (cell.metabolism == 1) ? true : false;
  deselectCell();
  metabolismPaletteEvent(4);
  var result2 = (getGlobalMetabolism() == 2);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testTranslateMetabolism() {
  var name = 'testTranslateMetabolism';
  var result = (translateMetabolism(0) == 6 && translateMetabolism(4) == 2 && translateMetabolism(7) == 1) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testStructurePaletteEvent() {
  var name = 'testStructurePaletteEvent';
  selectCell('x1x3');
  structurePaletteEvent(3);
  var cell = getCell('x1x3');
  var result1 = (cell.structure === 'gate') ? true : false;
  deselectCell();
  structurePaletteEvent(2);
  var result2 = (getGlobalStructure() == 'shrine');
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenCloseStructurePalette() {
  var name = 'testOpenCloseStructurePalette';
  openStructurePalette();
  var result1 = isStructurePaletteActive();
  closeStructurePalette();
  var result2 = isStructurePaletteActive();
  var result = (result1 && !result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetStructurePalette() {
  var name = 'testSetStructurePalette';
  setStructurePalette(true);
  var result1 = isStructurePaletteActive();
  setGlobalStructure(true);
  var result2 = getGlobalStructure(true);
  var result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawStructure() {
  var name = 'testDrawStructure';
  msg1 = drawStructure();
  selectCell('x1y1');
  msg2 = drawStructure('x1y1');
  var result = (msg1[1] == 'hive' && msg2[0] == 'drawStructureFromJs' && msg2[1] == 'hive') ? 'pass' : 'fail';
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
  results.push(testGetCell());
  results.push(testMakeSignal());
  results.push(testGetSignal());
  results.push(testGetSignalSpeed());
  results.push(testDeleteSignal());
  results.push(testRollRandomRoute());
  results.push(testGetCellStructure());
  results.push(testArrayContains());
  results.push(testObjectSize());
  results.push(testInitCells());
  results.push(testSetMidiPalette());
  results.push(testSetWidth());
  results.push(testSetHeight());
  results.push(testSetGeneration());
  results.push(testOpenQuickMenu());
  results.push(testOpenMidiPalette());
  results.push(testMidiPaletteEvent());
  results.push(testNoteArrayKey());
  results.push(testGetRouteDirections());
  results.push(testDeselectCell());
  results.push(testSelectCell());
  results.push(testCloseQuickMenu());
  results.push(testCloseMidiPalette());
  results.push(testOutletsOnOff());
  results.push(testClearField());

  resetTestSuite();
  results.push(testOut());

  resetTestSuite();
  results.push(testfieldEventOnEmptyCell());

  resetTestSuite();
  results.push(testGetExistingCells());

  resetTestSuite();
  results.push(testDrawRoute());

  resetTestSuite();
  results.push(testdrawCells());
  
  resetTestSuite();
  results.push(testGetIds());

  resetTestSuite();
  results.push(testMoveCell());

  resetTestSuite();
  results.push(testCycleRoutes());

  resetTestSuite();
  results.push(testDeleteCell());

  resetTestSuite();
  results.push(testDrawLeyline());

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
  results.push(testPrepareCellLeylines());

  resetTestSuite();
  results.push(testDrawLeylines());

  resetTestSuite();
  results.push(testGetSelectedCellId());
  results.push(testIsMidiPaletteActive());

  resetTestSuite();
  results.push(testGetCellsByStructure());

  resetTestSuite();
  results.push(testBirthSignals());
  results.push(testEnrichWithRouteDirections());

  resetTestSuite();
  results.push(testCancelCollidingSignals());

  resetTestSuite();
  results.push(testIsHiveBirthing());
  results.push(testisInFieldBounds());
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
  results.push(testSetCell());

  resetTestSuite();
  results.push(testCollide());

  resetTestSuite();
  results.push(testEastToSouthRoute());

  resetTestSuite();
  results.push(testNorthToNorthRoute());

  resetTestSuite();
  results.push(testRouteMatch());

  resetTestSuite();
  results.push(testSignalJSONIntegrity());

  resetTestSuite();
  results.push(testSetQuickMenu());

  resetTestSuite();
  results.push(testNoBlinkSelectedCell());

  resetTestSuite();
  results.push(testSetGetGlobalMidiNote());
  results.push(testSetGetGlobalStructure());

  resetTestSuite();
  results.push(testDrawMetabolism());
  results.push(testOpenCloseMetabolismPalette());
  results.push(testSetMetabolismPalette());
  results.push(testMetabolismPaletteEvent());
  results.push(testTranslateMetabolism());

  resetTestSuite();
  results.push(testStructurePaletteEvent());
  results.push(testOpenCloseStructurePalette());
  results.push(testSetStructurePalette());

  resetTestSuite();
  results.push(testDrawStructure());

  return results;
}

/*
 * Test "Framework"
 * ============================================================================
 */

function testOutput(name, result) {
  var testResult = (result != 'pass') ? '\x1b[7m' : '';
  testResult += result + '\t' + name;
  testResult += (result != 'pass') ? '\x1b[0m' : '';
  console.log(testResult);
}

function runTestSuite() {
  try {
    console.log('+==================================+');
    var results = testSuite();
    var counts = {};
    results.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    if (results.contains('fail')) throw false;
    console.log('+==================================+');
    console.log('Final Results:');
    console.log(counts);
    console.log('+==================================+');
  } catch(error) {
    core.setFailed(error.message);
  }
}

function runSingleTest() {
  try {
    resetTestSuite();
    console.log('+==================================+');
    var results = [];
    results.push(testfieldEventOnEmptyCell());
    var counts = {};
    results.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    if (results.contains('fail')) throw false;
    console.log('+==================================+');
    console.log('Single Results:');
    console.log(counts);
    console.log('+==================================+');
  } catch(error) {
    core.setFailed(error.message);
  }
}

runTestSuite();
// runSingleTest();