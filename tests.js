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
  name = 'testInitCell';
  cell = initCell(6, 14);
  result1 = (cell.id == 'x6y14');
  result2 = (cell.isExists == false);
  result3 = (cell.x == 6);
  result4 = (cell.y == 14);
  result5 = (cell.route == 'off');
  result6 = (cell.structure == 'none');
  result7 = (cell.note == 60);
  result8 = (cell.interval == 4);
  result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testInitCellById() {
  name = 'testInitCellById';
  id = 'x3y8';
  cell = initCellById(id);
  result1 = (cell.id == 'x3y8');
  result2 = (cell.isExists == false);
  result3 = (cell.x == 3);
  result4 = (cell.y == 8);
  result5 = (cell.route == 'off');
  result6 = (cell.structure == 'none');
  result7 = (cell.note == 60);
  result = (result1 && result2 && result3 && result4 && result5 && result6 && result7) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;

}

function testMakeId() {
  name = 'testMakeIdReturnsId';
  id = makeId(6, 14);
  result = (id == 'x6y14') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetCell() {
  name = 'testGetCellReturnsObject';
  cell = getCell(5, 4);
  result = (typeof cell === 'object' && cell !== null) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignal() {
  name = 'testGetSignal';
  signals.x3y3 = makeSignal(3, 3, 'n');
  signal = getSignal(3, 3);
  result1 = (typeof signal === 'object' && signal !== null);
  result2 = (signal.x === 3);
  result3 = (signal.direction === 'n');
  result = (result1 && result2 && result3)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMakeSignal() {
  name = 'testMakeSignal';
  signal = makeSignal(4, 5, 'e');
  result1 = (signal.id === 'x4y5');
  result2 = (signal.x === 4);
  result3 = (signal.y === 5);
  result4 = (signal.direction === 'e');
  result = (result1 && result2 && result3 && result4)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignalSpeed() {
  name = 'testGetSignalSpeed';
  result = (getSignalSpeed() === 1)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDeleteSignal() {
  name = 'testDeleteSignal';
  makeSignal(1, 1, 'w');
  deleteSignal('x1y1');
  result = (getSignal('x1y1') === false)  ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetCellStructure() {
  name = 'testGetCellStructure';
  cell = getCell(0, 0);
  result = (cell.structure === 'none') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testArrayContains() {
  name = 'testArrayContains';
  bucket = [1, 2, 3, 4, 5];
  result = (bucket.contains(5)) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testObjectSize() {
  name = 'testObjectSize';
  bucket = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}};
  result = (Object.size(bucket) === 5) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMakeField() {
  name      = 'testMakeField';
  field     = makeField();
  cell      = field.x10y4; // arbitrary id
  isExists  = (cell.isExists === false);
  x         = (cell.x == 10);
  y         = (cell.y == 4);
  route     = (cell.route == 'off');
  structure = (cell.structure == 'none');
  note      = (cell.note == 60);
  result    = (isExists && x && y && route && structure && note) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetMenu() {
  name = 'testSetMenu';
  setMenu(true);
  result1 = (state.isMenuActive == true);
  setMenu(false);
  result2 = (state.isMenuActive == false);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetMidiPalette() {
  name = 'testSetMidiPalette';
  setMidiPalette(true);
  result1 = (state.isMidiPaletteActive == true);
  setMidiPalette(false);
  result2 = (state.isMidiPaletteActive == false);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetLifespan() {
  name = 'testSetLifespan';
  setLifespan(999);
  result = (state.lifespan == 999) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetTime() {
  name = 'testSetTime';
  setTime(29837598);
  result = (state.time == 29837598) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetWidth() {
  name = 'testSetWidth';
  setWidth(7);
  result = (state.width == 7) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetHeight() {
  name = 'testSetHeight';
  setHeight(48);
  result = (state.height == 48) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSetGeneration() {
  name = 'testSetGeneration';
  setGeneration(51);
  result = (state.generation == 51) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenMenu() {
  name = 'testOpenMenu';
  result1 = (openMenu() == 'openMenu');
  result2 = (state.isMenuActive === true);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOpenMidiPalette() {
  name = 'testOpenMidiPalette';
  msg = openMidiPalette();
  result1 = (state.isMidiPaletteActive);
  result2 = (msg = 'drawMidiPalette');
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSingleMidiPaletteEvent() {
  name = 'testSingleMidiPaletteEvent';
  state.selectedCellId = 'x0y0';
  field.x0y0.note = 60;
  msg = singleMidiPaletteEvent(2, 2);
  result1 = (field.x0y0.note == 55);
  result2 = (msg[0] == 'animateMidiNotePress');
  result3 = (msg[1] == 2);
  result4 = (msg[2] == 2);
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetNote() {
  name = 'testGetNote';
  result1 = (getNote(2, 2) == 55);
  result2 = (getNote(5, 3) == 64);
  result3 = (getNote(5, 4) == 70);
  result4 = (getNote(6, 6) == 83);
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetRouteDirections() {
  name = 'testGetRouteDirections';
  test1 = getRouteDirections('nes');
  test2 = getRouteDirections('all');
  test3 = getRouteDirections('ee');
  test4 = getRouteDirections('garbage');
  result1 = ( test1[0] == 'n' && test1[1] ==  'e' && test1[2] == 's');
  result2 = ( test2[0] == 'n' && test2[1] ==  'e' && test2[2] == 's' && test2[3] == 'w');
  result3 = ( test3[0] == 'e');
  result4 = ( test4.length == 0);
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDeselectCell() {
  name = 'testDeselectCell';
  state.selectedCellId = 'x0y0';
  deselectCell();
  result = (state.selectedCellId === false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSelectCell() {
  name = 'testSelectCell';
  selectCell('x6y3');
  result = (state.selectedCellId === 'x6y3') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseMenu() {
  name = 'testCloseMenu';
  result1 = (closeMenu() == 'closeMenu');
  result2 = (state.isMenuActive === false);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCloseMidiPalette() {
  name = 'testCloseMidiPalette';
  closeMidiPalette();
  result = (!state.isMidiPaletteActive) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOutletsOnOff() {
  name = 'testOutletsOnOff';
  outletsOn();
  result1 = (state.outletsOn == true) ? 'pass' : 'fail';
  outletsOff();
  result2 = (state.outletsOn == false) ? 'pass' : 'fail';
  result = (result1 && result2);
  testOutput(name, result);
  return result;
}

function testClearField() {
  name = 'testClearField';
  result = (clearField() === 'clearField') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testOut() {
  name = 'testOut';
  test = out('internet');
  result = (test == 'internet') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testSingleFieldEventOnEmptyCell() {
  name = 'testSingleFieldEventOnEmptyCell';
  gridEvent('single', 2, 2);
  cell = getCell(2, 2);
  result1 = (cell.isExists);
  result2 = (cell.structure == 'hive');
  result3 = (cell.route == 'all');
  gridEvent('single', 2, 2);
  cell = getCell(2, 2);
  result4 = (cell.route == 'ne');
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetExistingCells() {
  name = 'testGetExistingCells';
  field.x0y0.isExists = true;
  field.x1y0.isExists = true;
  cells = getExistingCells();
  result = (Object.size(cells) === 2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawRoute() {
  name = 'testDrawRoute';
  singleFieldEvent(5, 6, 'none');
  d = drawRoute('x5y6');
  result1 = (d[0] === 'drawRoute');
  result2 = (d[1] === 'all');
  result3 = (d[2] === 5);
  result4 = (d[3] === 6);
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuRoute() {
  name = 'testDrawMenuRoute';
  field.x4y3.route = 'random';
  d = drawMenuRoute('x4y3');
  result1 = (d[0] === 'drawRoute');
  result2 = (d[1] === 'random');
  result3 = (d[2] === 2);
  result4 = (d[3] === 2);
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuStructure() {
  name = 'testDrawMenuStructure';
  field.x4y3.structure = 'nomad';
  d = drawMenuStructure('x4y3');
  result1 = (d[0] === 'drawStructure');
  result2 = (d[1] === 'nomad');
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawMenuInterval() {
  name = 'testDrawMenuInterval';
  d = drawMenuInterval(5);
  result1 = (d[0] === 'drawMenuInterval');
  result2 = (d[1] === 5);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testdrawCells() {
  name = 'testDrawCells';
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
  h = drawCells();
  result1 = (h.length === 4);
  result2 = (h[0] === 'drawCells');
  result5 = (h[1] === 'x0y3');
  result4 = (h[2] === 'x0y2');
  result3 = (h[3] === 'x0y0');  
  result = (result1 && result2 && result3 && result4 && result5) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIds() {
  name = 'testGetIds';
  obj = {'x0y0':{}, 'x1y2':{}, 'x4y8':{}};
  ids = getIds(obj);
  result = (ids.length === 3) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDumpRoutes() {
  name = 'testDumpRoutes';
  arr = dumpRoutes();
  result1 = (arr[0] === 'routesList');
  result2 = (arr.includes('nes'));
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDumpStructures() {
  name = 'testDumpStructures';
  arr = dumpStructures();
  result1 = (arr[0] === 'structuresList');
  result2 = (arr.includes('hive'));
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testMoveCell() {
  name = 'testMoveCell';
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
  result1 = (field.x0y0.isExists === false);
  result2 = (field.x6y6.route === 'random' );
  result3 = (field.x6y6.structure === 'nomad');
  result4 = (field.x0y0.id === 'x0y0');
  result5 = (field.x6y6.id === 'x6y6');
  result6 = (field.x6y6.note === 51);
  result = (result1 && result2 && result3 && result4 && result5 && result6) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testCycleRoutes() {
  name = 'testCycleRoutes';
  result = (cycleRoutes('shell') === 'all') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testDeleteCell() {
  name = 'testDeleteCell';
  state.selectedCellId = 'x0y1';
  field.x0y1.isExists = true;
  deleteCell('x0y1');
  result1 = (state.selectedCellId === false);
  result2 = (field.x0y1.isExists === false);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawChannel() {
  name = 'testDrawChannel';
  arr = [0, 4, 0, 7];
  d = drawChannel(arr);
  result1 = (d[0] === 'drawChannel');
  result2 = (d[1] === 0);
  result3 = (d[2] === 4);
  result4 = (d[3] === 0);
  result5 = (d[4] === 7);
  result = (result1 && result2 && result3 && result4 && result5) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindColumnNeighborNorth() {
  name = 'testFindColumnNeighborNorth';
  currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x4y3': { 'id' : 'x4y3', 'x': 4, 'y': 3}, 
    'x4y5': { 'id' : 'x4y5', 'x': 4, 'y': 5},
    'x5y5': { 'id' : 'x4y8', 'x': 4, 'y': 8}
  };
  neighbor = findColumnNeighbor(currentCell, existingCells, 'north');
  result1 = (neighbor.y === 5);
  result2 = (neighbor.x === 4);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindColumnNeighborSouth() {
  name = 'testFindColumnNeighborSouth';
  currentCell = {
    'id': 'x4y3', 'x': 4, 'y': 3
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x4y7': { 'id' : 'x4y3', 'x': 4, 'y': 7}, 
    'x4y5': { 'id' : 'x4y5', 'x': 4, 'y': 5},
    'x4y8': { 'id' : 'x4y8', 'x': 4, 'y': 8}
  };
  neighbor = findColumnNeighbor(currentCell, existingCells, 'south');
  result1 = (neighbor.y === 5);
  result2 = (neighbor.x === 4);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoColumnNeighborSouth() {
  name = 'testFindColumnNeighborSouth';
  currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x3y0': { 'id' : 'x3y0', 'x': 3, 'y': 0}, 
    'x1y3': { 'id' : 'x1y3', 'x': 1, 'y': 3}, 
    'x8y5': { 'id' : 'x8y5', 'x': 8, 'y': 5},
    'x10y8': { 'id' : 'x10y8', 'x': 10, 'y': 8}
  };
  neighbor = findColumnNeighbor(currentCell, existingCells, 'south');
  result1 = (neighbor.y === 7);
  result2 = (neighbor.x === 4);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoColumnNeighborNorth() {
  name = 'testFindColumnNeighborNorth';
  currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x3y0': { 'id' : 'x3y0', 'x': 3, 'y': 0}, 
    'x1y3': { 'id' : 'x1y3', 'x': 1, 'y': 3}, 
    'x8y5': { 'id' : 'x8y5', 'x': 8, 'y': 5},
    'x10y8': { 'id' : 'x10y8', 'x': 10, 'y': 8}
  };
  neighbor = findColumnNeighbor(currentCell, existingCells, 'north');
  result1 = (neighbor.y === 0);
  result2 = (neighbor.x === 4);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindRowNeighborWest() {
  name = 'testFindRowNeighborWest';
  currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x0y7': { 'id' : 'x0y7', 'x': 0, 'y': 7}, 
    'x1y7': { 'id' : 'x1y7', 'x': 1, 'y': 7},
    'x2y7': { 'id' : 'x2y7', 'x': 2, 'y': 7}
  };
  neighbor = findRowNeighbor(currentCell, existingCells, 'west');
  result1 = (neighbor.y === 7);
  result2 = (neighbor.x === 2);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindRowNeighborEast() {
  name = 'testFindRowNeighborWest';
  currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x0y7': { 'id' : 'x0y7', 'x': 0, 'y': 7}, 
    'x15y7': { 'id' : 'x15y7', 'x': 15, 'y': 7},
    'x14y7': { 'id' : 'x14y7', 'x': 14, 'y': 7}
  };
  neighbor = findRowNeighbor(currentCell, existingCells, 'east');
  result1 = (neighbor.y === 7);
  result2 = (neighbor.x === 14);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoRowNeighborEast() {
  name = 'testFindNoRowNeighborEast';
  currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x4y0': { 'id' : 'x4y0', 'x': 4, 'y': 0}, 
    'x0y7': { 'id' : 'x0y7', 'x': 0, 'y': 7}, 
  };
  neighbor = findRowNeighbor(currentCell, existingCells, 'east');
  result1 = (neighbor.y === 7);
  result2 = (neighbor.x === 15);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testFindNoRowNeighborWest() {
  name = 'testFindNoRowNeighborWest';
  currentCell = {
    'id': 'x4y7', 'x': 4, 'y': 7
  };
  existingCells = { 
    'x2y1': { 'id' : 'x2y1', 'x': 2, 'y': 1}, 
    'x15y7': { 'id' : 'x15y7', 'x': 15, 'y': 7},
    'x14y7': { 'id' : 'x14y7', 'x': 14, 'y': 7}
  };
  neighbor = findRowNeighbor(currentCell, existingCells, 'west');
  result1 = (neighbor.y === 7);
  result2 = (neighbor.x === 0);
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testPrepareCellChannels() {
  name = 'testPrepareCellChannels';
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
  
  channels1 = prepareCellChannels('x11y4');
  result1 = (channels1[0][1] === 11);
  result2 = (channels1[0][2] === 4);
  result3 = (channels1[0][3] === 11);
  result4 = (channels1[0][4] === 2);
  result5 = (channels1[1][3] === 15);
  result6 = (channels1[1][4] === 4);
  result7 = (channels1[3][3] === 7);
  result8 = (channels1[3][4] === 4);  
  result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;  
}

function testDrawChannels() {
  name = 'testDrawChannels';
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
  channels = drawChannels('x6y3');
  result1 = (channels[0][0] == 'drawChannel');
  result2 = (channels[0][3] == 6);
  result3 = (channels[0][4] == 1);
  result4 = (channels[1][3] == 11);
  result5 = (channels[1][4] == 3);
  result6 = (channels[2][3] == 6);
  result7 = (channels[2][4] == 6);  
  result8 = (channels[3][3] == 1);
  result9 = (channels[3][4] == 3);  
  result = (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8 && result9) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSelectedCellId() {
  name = 'testGetSelectedCellId';
  state.selectedCellId = 'kfajslkdfj';
  result1 = getSelectedCellId();
  result = (result1 == 'kfajslkdfj') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIsMenuActive() {
  name = 'testGetIsMenuActive';
  result1 = getIsMenuActive();
  state.isMenuActive = true;
  result2 = getIsMenuActive();
  result = (!result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetIsMidiPaletteActive() {
  name = 'testGetisMidiPaletteActive';
  result1 = getIsMidiPaletteActive();
  state.isMidiPaletteActive = true;
  result2 = getIsMidiPaletteActive();
  result = (!result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testRollRandomRoute() {
  name = 'testRollRandomRoute';
  random = rollRandomRoute();
  result = (Array.isArray(random)) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetCellsByStructure() {
  name = 'testGetCellsByStructure';
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
  hives = getCellsByStructure('hive');
  result1 = (hives[0].id === 'x0y3');
  result2 = (hives[0].structure === 'hive');
  result3 = (hives.length == 2);
  result = (result1 && result2 && result3) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testBirthSignals() {
  name = 'testBirthSignals';
  field.x0y0.isExists = true;
  field.x2y7.isExists = true;
  field.x11y5.isExists = true;
  field.x0y0.route = 'all';
  field.x2y7.route = 'all';
  field.x11y5.route = 'all';
  field.x0y0.x = 0;
  field.x2y7.x = 2;
  field.x11y5.x = 11;
  field.x0y0.y = 0;
  field.x2y7.y = 7;
  field.x11y5.y = 5;
  field.x0y0.structure = 'hive';
  field.x2y7.structure = 'hive';
  field.x11y5.structure = 'hive';
  signals = birthSignals();
  // this is a very important test...
  // THINK OF THE CHILDREN
  result = (
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
  name = 'testEnrichHiveWithRouteDirections';
  hives = [{ 'route' : 'nes' }, { 'route' : 'ww' }];
  enriched =  enrichWithHiveRouteDirections(hives);
  result1 = (enriched[0].hiveRouteDirections[0] === 'n');
  result2 = (enriched[0].hiveRouteDirections[1] === 'e');
  result3 = (enriched[0].hiveRouteDirections[2] === 's');
  result4 = (enriched[1].hiveRouteDirections[0] === 'w');
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCancelCollidingSignals() {
  name = 'testCancelCollidingSignals';
  s1 = makeSignal(0, 0, 's');
  s2 = makeSignal(3, 3, 'n');
  s3 = makeSignal(6, 4, 'w');
  signals[s1.id] = s1;
  signals[s2.id] = s2;
  signals[s3.id] = s3;
  existingSignals = getSignals();
  b1 = makeSignal(0, 0, 'n');
  b1id = b1.id;
  b2 = makeSignal(3, 3, 'e');
  b2id = b2.id;
  b3 = makeSignal(6, 3, 'w');
  b3id = b3.id;
  birthedSignals = {x0y0 : b1, x3y3 : b2, x6y3 : b3};
  survivingSignals = cancelCollidingSignals(birthedSignals, existingSignals);
  result1 = (survivingSignals.x6y4.direction === 'w');
  result2 = (survivingSignals.x6y3.direction === 'w');
  result = (result1 && result2) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetWidth() {
  name = 'testGetWidth';
  result = (getWidth() === 16) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetHeight() {
  name = 'testGetWidth';
  result = (getHeight() === 8) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCollideSignalsWithCells() {
  name = 'testCollideSignalsWithCells';
  result = (false) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testIsHiveBirthing() {
  name = 'testIsHiveBirthing';
  setGeneration(1);
  result1 = (isHiveBirthing(1));
  result2 = (!isHiveBirthing(2));
  result3 = (!isHiveBirthing(3));
  result4 = (!isHiveBirthing(4));
  result5 = (!isHiveBirthing(5));
  result6 = (!isHiveBirthing(6));
  generationOneResult = (result1 && result2 && result3 && result4 && result5 && result6);

  setGeneration(2);
  result1 = (isHiveBirthing(1));
  result2 = (isHiveBirthing(2));
  result3 = (!isHiveBirthing(3));
  result4 = (!isHiveBirthing(4));
  result5 = (!isHiveBirthing(5));
  result6 = (!isHiveBirthing(6));
  generationTwoResult = (result1 && result2 && result3 && result4 && result5 && result6);

  setGeneration(36);
  result1 = (isHiveBirthing(1));
  result2 = (isHiveBirthing(2));
  result3 = (isHiveBirthing(3));
  result4 = (isHiveBirthing(4));
  result5 = (!isHiveBirthing(5));
  result6 = (isHiveBirthing(6));
  generationThreeResult = (result1 && result2 && result3 && result4 && result5 && result6);

  setGeneration(105);
  result1 = (isHiveBirthing(1));
  result2 = (!isHiveBirthing(2));
  result3 = (isHiveBirthing(3));
  result4 = (!isHiveBirthing(4));
  result5 = (isHiveBirthing(5));
  result6 = (!isHiveBirthing(6));
  generationFourResult = (result1 && result2 && result3 && result4 && result5 && result6);

  result = (generationOneResult && generationTwoResult && generationThreeResult && generationFourResult ) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testIsInBounds() {
  name = 'testIsInBounds';
  result1 = isInBounds('x0y0');
  result2 = !isInBounds('x6y39');
  result3 = !isInBounds('x-1y9');
  result4 = isInBounds('x4y4');
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testCancelOutOfBoundsSignals() {
  name = 'testCancelOutOfBoundsSignals';
  testSignals = [
    {'id': 'x0y0'},
    {'id': 'x26y39'},
    {'id': 'x1y9'},
    {'id': 'x4y5'}
  ];
  testSignals = cancelOutOfBoundsSignals(testSignals);
  result = (testSignals[0].id == 'x0y0' && testSignals[1].id == 'x4y5') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetGeneration() {
  name = 'testGetGeneration';
  setGeneration(45);
  result = (getGeneration() == 45) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testGetSignals() {
  name = 'testGetSignals';
  signals = { 'id' : 'anything' };
  result = (getSignals().id == 'anything') ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testPropagateSignals() {
  name = 'testPropagateSignals';
  testSignals = [
    {'id': 'x0y0', 'x': 0, 'y': 0, 'direction': 's'},
    {'id': 'x6y3', 'x': 6, 'y': 3, 'direction': 'e'},
    {'id': 'x1y3', 'x': 1, 'y': 3, 'direction': 'w'},
    {'id': 'x4y5', 'x': 4, 'y': 5, 'direction': 'n'}
  ];

  propagateSignals(testSignals);
  checkSignals = getSignals();
  result1 = (checkSignals[0].id == 'x0y1');
  result2 = (checkSignals[1].id == 'x7y3');
  result3 = (checkSignals[2].id == 'x0y3');
  result4 = (checkSignals[3].id == 'x4y4');
  result = (result1 && result2 && result3 && result4) ? 'pass' : 'fail';
  testOutput(name, result);
  return result;
}

function testDrawSignals() {
  name = 'testDrawSignals';
  signals = [
    {'id': 'x0y0', 'x': 0, 'y': 0, 'direction': 's'},
  ];
  drawArray = drawSignals();
  result = (drawArray[0] == 'drawSignals' && drawArray[1] == 'x0y0') ? 'pass' : 'fail';
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

function testSuiteOne() {

  results = [];

  resetTestSuite();
  results.push(testGetWidth());
  results.push(testGetHeight());
  results.push(testInitCell());
  results.push(testInitCellById());
  results.push(testMakeId());
  results.push(testGetCell());
  results.push(testMakeSignal());
  results.push(testGetSignal());
  results.push(testGetSignalSpeed());
  results.push(testDeleteSignal());
  results.push(testRollRandomRoute());
  results.push(testGetCellStructure());
  results.push(testArrayContains());
  results.push(testObjectSize());
  results.push(testMakeField());
  results.push(testSetMenu());
  results.push(testSetMidiPalette());
  results.push(testSetTime());
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

  return results;
}

function testSuiteTwo() {

  results = [];

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

  //results.push(testCollideSignalsWithCells());


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
  testResult = (result != 'pass') ? '\x1b[7m' : '';
  testResult += result + '\t' + name;
  testResult += (result != 'pass') ? '\x1b[0m' : '';
  console.log(testResult);
}

function runTestSuite() {
  drawBorder();
  results = [];
  results = results.concat(testSuiteOne());
  results = results.concat(testSuiteTwo());
  counts = {};
  results.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  drawBorder();
  console.log('Final Results:');
  console.log(counts);
  drawBorder();
}

runTestSuite();