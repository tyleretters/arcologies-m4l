/*
 * arcologies src
 * ============================================================================
 *
 * By:        Tyler Etters
 * Date:      June, 2020
 * Docs:      https://tyleretters.github.io/arcologies
 * Site:      https://nor.the-rn.info
 * License:   Attribution 4.0 International (CC BY 4.0)
 *
 * File Organization:
 *  - Events
 *  - Midi
 *  - Signals
 *  - Draws
 *  - Max I/O
 *  - Initialize Functions
 *  - Setters
 *  - Higher Level Getters
 *  - Lower Level Getters
 *  - Polyfills
 *
 */

/*
 * Events
 * ==============================================================================
 */

function advance() {

  var birthedSignals;
  var existingSignals;
  var propagatedSignals;
  var survivingSignals;
  var finalSignals;
  var existingCells;

  // the hives give birth...
  birthedSignals = birthSignals();

  // & everything moves...
  existingSignals = getSignals();

  // ...unless there's nothing to move...
  if (existingSignals === undefined) return; 
  
  // & some signals die but some shrines also sing...
  propagatedSignals = propagateSignals(existingSignals);

  // & some more signals die...
  survivingSignals = cancelOutOfBoundsSignals(propagatedSignals);
  survivingSignals = cancelCollidingSignals(birthedSignals, survivingSignals);

  // & everything is at rest
  setSignals(survivingSignals);

  // & if the weather is just so, we get to see it all from above
  if (!getSelectedCellId() && !isQuickMenuActive()) {
    // only redraw when a cell isn't selected, the quick menu isn't active
    returnToField();
  }

}

// paritally tested
function fieldEvent(x, y) {

  var fieldId = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);
  var cellId = getSelectedCellId();

  if (cellId && isAdjacentPort(getCell(cellId), x, y)) {
    // we have a cell selected, we're pressing a port
    togglePort(cellId, x, y);
    clearField();
    drawLeylines(cellId);
    drawPorts(cellId);
    dumpSignalsAndCells();

  } else if (cellId && !ids.contains(fieldId)) {
    // we have a cell selected, we're pressing an empty cell, so deselect the cell
    deselectCell();
    returnToField();

  } else if (cellId === false && !ids.contains(fieldId)) {
    // no cell is selected and this cell doesn't exist so create it
    initCell(fieldId);
    setCell(fieldId, { 'isExists': true});
    selectCell(fieldId, true);
    clearField();
    drawPorts(fieldId);
    drawLeylines(fieldId);
    dumpSignalsAndCells();

  } else if (cellId == fieldId) {
    // we're pressing the already selected cell
    clearField();
    drawPorts(x, y);
    drawLeylines(fieldId);
    dumpSignalsAndCells();

  } else if (cellId !== fieldId && ids.contains(fieldId)) {
    // we've pressed a different existing cell and want to select it
    selectCell(fieldId, true);
    clearField();
    drawLeylines(fieldId);
    drawPorts(fieldId);
    dumpSignalsAndCells();
  }  

}

// untestable
function returnToField() {
  clearField();
  dumpSignalsAndCells();
}

// untestable
function dumpSignalsAndCells() {
    dumpSignals();
    drawSignals();
    dumpExistingCells();
    drawCells();    
}

// untestable
function inspectorPaletteEvent(y, z) {
  if (z == 0) {
    returnToField();
    if(getSelectedCellId()) {
      selectCell(getSelectedCellId(), true);
    }
  }
  if (z == 1) {
    clearField();
    noBlinkSelectedCell();    
    if (y == 2) drawCells('shrines');
    if (y == 3) drawCells('gates');
    if (y == 4) drawCells('hives');
  }
  
}

// tested
function midiPaletteEvent(x, y) {
  
  // defensive
  if (x < 1 && x > 7 && y < 0 && y > 8) return;

  // if we have a cell selected, set its midi note,
  // otherwise set the global midi note
  var note = getMidiNote(x, y);
  var id = getSelectedCellId();
  if (id) {
    setCell(id, { 'note' : note});  
  } else {
    setGlobalMidiNote(note);
  }

}

// tested
function metabolismPaletteEvent(y) {

  // defensive
  if (y < -1 && y > 5) return;

  var metabolism = translateMetabolism(y);
  var id = getSelectedCellId();
  if (id) {
    setCell(id, { 'metabolism' : metabolism});
  } else {
    setGlobalMetabolism(metabolism);
  }
 
}

// tested
function structurePaletteEvent(y) {

  // defensive
  if (y < 2 && y > 4) return;

  var structureName = '';
  if (y == 2) structureName = 'shrine';
  if (y == 3) structureName = 'gate';
  if (y == 4) structureName = 'hive';

  var id = getSelectedCellId();
  if (getSelectedCellId()) {
    setCell(id, { 'structure' : structureName});    
  } else {
    setGlobalStructure(structureName);
  }
}

/*
 * Midi
 * ==============================================================================
 */

// tested
function playMidi(id) {

  var cellNote = ['playMidi', getCell(id).note];
  
  if (isOutletsOn()) {
    out(cellNote);
  } else {
    return cellNote;
  }

}

/*
 * Signals
 * ==============================================================================
 */

// tested
function collide(signals) {

  var collisionResults = signals;
  var cells = getExistingCells();
  var hives = getCellsByStructure('hive');
  var gates = getCellsByStructure('gate');
  var shrines = getCellsByStructure('shrine');
  var gatesAndNomads = Object.assign(gates, shrines);

  Object.keys(signals).forEach(function(signalKey) {
    var thisSignal = signals[signalKey];
    Object.keys(hives).forEach(function(hiveKey) {
     var thisHive = hives[hiveKey];
     if (thisHive.id == thisSignal.id) {
       delete collisionResults[thisSignal.id];
     }
    });
  });

  var newSignals = {};
  Object.keys(signals).forEach(function(signalKey) {
    var thisSignal = signals[signalKey];
    Object.keys(gatesAndNomads).forEach(function(gatesAndNomadsKey) {
     var thisCell = gatesAndNomads[gatesAndNomadsKey];
     var idMatch = (thisCell.id == thisSignal.id);
     var isPortMatch = portMatch(thisCell.ports, thisSignal.direction);

    // the cell and signal occupy the same spot, but the port/direction is not compatible
    if (idMatch && !isPortMatch) {
      delete collisionResults[thisSignal.id];
    }

    // this is a valid interaction
    if (idMatch && isPortMatch) {
      delete collisionResults[thisSignal.id];
      newSignals = Object.assign(routeSignals(thisCell, thisSignal), newSignals);
      if (thisCell.structure == 'shrine') {
        playMidi(thisCell.id);
      }
    }

    });
  });
  collisionResults = Object.assign(collisionResults, newSignals);
  return collisionResults;
}

// tested (via testCollide)
function routeSignals(cell, signal) {
  var newSignals = {};
  var originSignal = signal;
  if (cell.id != originSignal.id) return; // defensive coding, should never happen

  // a northbound signal will emerge next generation if the signal
  // did not enter from the northern port (it was going south)
  if ((cell.ports.contains('n') && (originSignal.direction != 'n'))) {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 'n'));
  }

  // an eastbound signal will emerge next generation if the signal
  // did not enter from the eastern port (it was going west)
  if ((cell.ports.contains('e') && (originSignal.direction != 'e'))) {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 'e'));
  }

  // a southbound signal will emerge next generation if the signal
  // did not enter from the sourthern port (it was going north)
  if ((cell.ports.contains('s') && (originSignal.direction != 's'))) {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 's'));
  }

  // a westbound signal will emerge next generation if the signal
  // did not enter from the western port (it was going east)
  if ((cell.ports.contains('w') && (originSignal.direction != 'w'))) {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 'w'));
  }

  return newSignals;
}

// tested (via testCollide)
function cellRouteSignal(cell, originSignal, direction) {
  var cellRouteSignalResults = {};
  var portsLength = cell.ports.length;

  for (i = 0; i < portsLength; i++) {

    if (cell.ports[i] == 'n' && originSignal.direction != 's') {      
      var northernSignal = makeSignal(
          originSignal.x,
          originSignal.y - 1,
          'n',
          getGeneration() + 1,
          true
        );
      cellRouteSignalResults[northernSignal.id] = northernSignal;
    }

    if (cell.ports[i] == 'e' && originSignal.direction != 'w') {      
      var easternSignal = makeSignal(
        originSignal.x + 1,
        originSignal.y,
        'e',
        getGeneration() + 1,
        true
      );
      cellRouteSignalResults[easternSignal.id] = easternSignal;
    }

    if (cell.ports[i] == 's' && originSignal.direction != 'n') {      
      var southernSignal = makeSignal(
        originSignal.x,
        originSignal.y + 1,
        's',
        getGeneration() + 1,
        true
      );
      cellRouteSignalResults[southernSignal.id] = southernSignal;
    }

    if (cell.ports[i] == 'w' && originSignal.direction != 'e') {      
      var westernSignal = makeSignal(
        originSignal.x - 1,
        originSignal.y,
        'w',
        getGeneration() + 1,
        true
      );
      cellRouteSignalResults[westernSignal.id] = westernSignal;
    }

  }

  return cellRouteSignalResults;

}

// tested
// north direction matches south port
// south direction matches north port
// east direction matches west port
// west direction matches east port
function portMatch(ports, direction) {
  if (direction === 'n') return ports.contains('s');
  if (direction === 'e') return ports.contains('w');
  if (direction === 's') return ports.contains('n');
  if (direction === 'w') return ports.contains('e');
  return false;
}

// tested
function propagateSignals(signals) {

  var propagatedSignals = {};
  var collisions = {};

  Object.keys(signals).forEach(function(key) {
    var thisSignal = signals[key];

    // don't propagate signals that were just born
    if (thisSignal.isJustBorn === true) {
      propagatedSignals[thisSignal.id].isJustBorn = false;
      return;
    }

    if (thisSignal.direction === 'n') {
      var xN = thisSignal.x;
      var yN = thisSignal.y - 1;
      var idN = makeId(xN, yN);
      var directionN = 'n';
      if (getCellByCoords(xN, yN).isExists) {
        collisions[idN] = makeSignal(xN, yN, directionN);
      } else {
        propagatedSignals[idN] = makeSignal(xN, yN, directionN);
      }
    }

    if (thisSignal.direction === 's') {
      var xS = thisSignal.x;
      var yS = thisSignal.y + 1;
      var idS = makeId(xS, yS);
      var directionS = 's';
      if (getCellByCoords(xS, yS).isExists) {
        collisions[idS] = makeSignal(xS, yS, directionS);
      } else {
        propagatedSignals[idS] = makeSignal(xS, yS, directionS);
      }
    }

    if (thisSignal.direction === 'e') {
      var xE = thisSignal.x + 1;
      var yE = thisSignal.y;
      var idE = makeId(xE, yE);
      var directionE = 'e';
      if (getCellByCoords(xE, yE).isExists) {
        collisions[idE] = makeSignal(xE, yE, directionE);
      } else {
        propagatedSignals[idE] = makeSignal(xE, yE, directionE);
      }
    }

    if (thisSignal.direction === 'w') {
      var xW = thisSignal.x - 1;
      var yW = thisSignal.y;
      var idW = makeId(xW, yW);
      var directionW = 'w';
      if (getCellByCoords(xW, yW).isExists) {
        collisions[idW] = makeSignal(xW, yW, directionW);
      } else {
        propagatedSignals[idW] = makeSignal(xW, yW, directionW);
      }
    }

  });

  var collisionResults = collide(collisions);

  return Object.assign(propagatedSignals, collisionResults);
}

// tested
function cancelOutOfBoundsSignals(survivingSignals) {
  var inBoundsSignals = {};
  Object.keys(survivingSignals).forEach(function(key) {
    if (isInFieldBounds(survivingSignals[key].x, survivingSignals[key].y)) {
      var id = survivingSignals[key].id;
      inBoundsSignals[id] = survivingSignals[key];
    }
  });
  return inBoundsSignals;
} 

// tested
function birthSignals() {

  var birthedSignals = {};
  var newSignals = [];
  var hives = getCellsByStructure('hive');

  var hivesLength = hives.length;

  for(var i = 0; i < hivesLength; i++) {
    var thisHive = hives[i];

    if (!isHiveBirthing(thisHive.metabolism)) continue;

    if (thisHive.ports.contains('n')) {
      // one cell north means subtract one from the hive
      // check y against zero
      var y1 = thisHive.y - 1;
      if (y1 >= 0) {
        newSignals.push(makeSignal( thisHive.x, y1, 'n', getGeneration(), true));
      }
    }

    if (thisHive.ports.contains('e')) {
      // one cell east means add one to the hive
      // check x against grid width less one for zero index
      var x1 = thisHive.x + 1;
      if (x1 <= getWidth() - 1) {
        newSignals.push(makeSignal( x1, thisHive.y, 'e', getGeneration(), true));
      }
    }

    if (thisHive.ports.contains('s')) {
      // one cell south means add one to the hive
      // check y against grid height less one for zero index
      var y2 = thisHive.y + 1;
      if (y2 <= getHeight() - 1) {
        newSignals.push(makeSignal( thisHive.x, y2, 's', getGeneration(), true));
      }
    }

    if (thisHive.ports.contains('w')) {
      // one cell west means subtract one from the hive
      // check x against 1
      var x2 = thisHive.x - 1;
      if (x2 >= 1 ) {
        newSignals.push(makeSignal( x2, thisHive.y, 'w', getGeneration(), true));
      }
    }
  }

  var newSignalsLength = newSignals.length;
  for (i = 0; i < newSignalsLength; i++) {
    var thisSignal = newSignals[i];
    birthedSignals[thisSignal.id] = thisSignal;
  }

  return birthedSignals;

}

// tested
function cancelCollidingSignals(birthedSignals, existingSignals) {
  return Object.assign(birthedSignals, existingSignals);
}

// tested
function findColumnNeighbor(currentCell, existingCells, direction) {
  
  // northern boundary is row 0
  // southern boundary is grid height - 1

  var ys = [];

  // find all cells in this column and get the y values
  Object.keys(existingCells).forEach(function(key) {
    if (existingCells[key].x == currentCell.x && existingCells[key].id != currentCell.id) {
      ys.push(existingCells[key].y);
    }
  });

  // filter out the cells to the south or north
  ys = ys.filter(function(val) {
    if (direction == 'north') {
      return val < currentCell.y;
    }
    if (direction == 'south') {
      return val > currentCell.y;
    }
  });

  var neighbor;
  if (ys.length > 0) {
    // find nearest cell of those in this column
    var goal = currentCell.y;
    neighbor = ys.reduce(function(prev, curr) {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
  } else {
    // we're going all the way to the edge of the field
    if (direction == 'north') {
       neighbor = 0;
    }
    if (direction == 'south') {
      neighbor = getHeight() - 1; // account for zero index on grid
    }
  }

  var neighborId = 'x' + currentCell.x + 'y' + neighbor;
  return { 'id': neighborId, 'x' : currentCell.x, 'y' : neighbor };
}

// tested
function findRowNeighbor(currentCell, existingCells, direction) {
  
  // western boundary is row 1
  // eastern boundary is grid width - 1

  var xs = [];

  // find all cells in this row and get the x values
  Object.keys(existingCells).forEach(function(key) {
    if (existingCells[key].y == currentCell.y && existingCells[key].id != currentCell.id) {
      xs.push(existingCells[key].x);
    }
  });

  // filter out the cells to the east or west
  xs.sort();
  xs = xs.filter(function(val) {
    if (direction == 'east') {
      return val > currentCell.x;
    }
    if (direction == 'west') {
      return val < currentCell.x;
    }
  });

  var neighbor;
  if (xs.length > 0) {
    // find nearest cell of those in this column
    var goal = currentCell.x;
    neighbor = xs.reduce(function(prev, curr) {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
  } else {
    // we're going all the way to the edge of the field which is 1
    if (direction == 'west') {
       neighbor = 1;
    }
    if (direction == 'east') {
      neighbor = getWidth() - 1; // account for zero index on grid
    }
  }

  var neighborId = 'x' + neighbor + 'y' + currentCell.y;
  return { 'id': neighborId, 'x' : neighbor, 'y' : currentCell.y };
}

// tested
function prepareCellLeylines(cellId) {

  var currentCell = getCell(cellId);
  var existingCells = getExistingCells();
  var filteredTermini = [];

  if (currentCell.ports.contains('n')) {
    filteredTermini.push(findColumnNeighbor(currentCell, existingCells, 'north'));
  }
  if (currentCell.ports.contains('e')) {
    filteredTermini.push(findRowNeighbor(currentCell, existingCells, 'east'));
  }
  if (currentCell.ports.contains('s')) {
    filteredTermini.push(findColumnNeighbor(currentCell, existingCells, 'south'));
  }
  if (currentCell.ports.contains('w')) {
    filteredTermini.push(findRowNeighbor(currentCell, existingCells, 'west'));
  }
  var cellLeylines = [];
  for (var i = 0; i < filteredTermini.length; i++) {
    cellLeylines.push(['drawLeyline', currentCell.x, currentCell.y, filteredTermini[i].x, filteredTermini[i].y]);
  }
  return cellLeylines;
}

/*
 * Draws
 * ==============================================================================
 */

// tested
function clearField() {
  var msg = 'clearField';
  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
}


// tested by proxy
function drawPorts(id) {
  var cell = getCell(id);
  if (!cell) return;
  var output = [];
  output.push(drawPort(cell, 'n', cell.ports.contains('n')));
  output.push(drawPort(cell, 'e', cell.ports.contains('e')));
  output.push(drawPort(cell, 's', cell.ports.contains('s')));
  output.push(drawPort(cell, 'w', cell.ports.contains('w')));
  output.forEach( function(arr) {
    out(arr);
  });
}

// tested
function drawPort(cell, port, bool) {
  var portX = 0;
  var portY = 0;
  if (port == 'n') {
    portX = cell.x;
    portY = cell.y - 1;    
  }
  if (port == 'e') {
    portX = cell.x + 1;
    portY = cell.y;
  }
  if (port == 's') {
    portX = cell.x;
    portY = cell.y + 1;
  }
  if (port == 'w') {
    portX = cell.x - 1;
    portY = cell.y;
  }
  var onOff = (bool) ? 'open' : 'closed';
  return ['drawPort', portX, portY, onOff];
}

// tested
function drawSignals() {

  var drawArray = [];
  var existingSignals = getSignals();
  if (existingSignals === undefined) return;

  Object.keys(existingSignals).forEach(function(key) {
    if(existingSignals[key].generation <= getGeneration()) {
      drawArray.push(['drawSignals', existingSignals[key].id]);
    }
  });

  for (var i = 0; i < drawArray.length; i++) {
    if (isOutletsOn()) {
      out(drawArray[i]);
    } else {
      return drawArray;
    }
  }

}

// tested
function drawLeylines(id) {

  var cell = getCell(id);
  
  if (cell.ports.length == 0) return;

  var leylines = [];
  leylines = leylines.concat(prepareCellLeylines(cell.id));
  
  if (isOutletsOn()) {
    leylines.forEach(function(leyline){
      out(leyline);
    });
  } else {
      return leylines;
  }

} 

// tested
function drawCells(structure) {
  var structure = structure || false;
  var arr = ['drawCells'];
  if (structure) {
    arr.push(structure);
  } else {
    arr.push('all');    
  }

  if (isOutletsOn()) {
    out(arr);
  } else {
    return arr;
  }
}

// tested
function drawLeyline(arr) {
  arr.unshift('drawLeyline');
  return arr;
}

// tested
function noBlinkSelectedCell() {
  var msg = 'noBlinkSelectedCell';
  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
}

// tested
function drawStructure() {
  var msg = ['drawStructureFromJs'];
  if (getSelectedCellId()) {
    msg.push(getCell(getSelectedCellId()).structure);
  } else {
    msg.push(getGlobalStructure());
  }

  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
}

// teseted
function drawMetabolism() {
  var msg = ['drawMetabolismFromJs'];
  if (getSelectedCellId()) {
    msg.push(getCell(getSelectedCellId()).metabolism);
  } else {
    msg.push(getGlobalMetabolism());
  }
  // post(msg);

  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
}

/*
 * Max I/O
 * ==============================================================================
 */

var inlets = 1;
var outlets = 1;

// untested
function dumpGlobalState() {
  if (typeof Dict == "undefined") return;
  var d = new Dict('globalState');
  d.quiet = false;
  d.clear();
  var json = JSON.stringify(ARCOLOGIES_GLOBAL_STATE);
  d.parse(json);
  out('dumpGlobalState');  
}

// untested
function dumpExistingCells() {
  if (typeof Dict == "undefined") return;  
  var d = new Dict('existingCells');
  d.quiet = false;
  d.clear();
  d.parse(JSON.stringify(getExistingCells()));
  out('dumpExistingCells');
}

// untested
function dumpSignals() {
  if (typeof Dict == "undefined") return;  
  var d = new Dict('signals');
  d.quiet = false;
  d.clear();
  d.parse(JSON.stringify(getSignals()));
  out('dumpSignals');
}

// tested
function out(val) {
  if (isOutletsOn()) {
    outlet(0, val);
  } else {
    return val;
  }
}

// tested
function openQuickMenu() {
  setQuickMenu(true);
}

// tested
function closeQuickMenu() {
  setQuickMenu(false);
}

// tested
function openInspectorPalette() {
  setInspectorPalette(true);
}

// tested
function closeInspectorPalette() {
  setInspectorPalette(false);
}

// tested
function openMidiPalette() {
  setMidiPalette(true);
}

// tested
function closeMidiPalette() {
  setMidiPalette(false);
}

// tested
function openStructurePalette() {
  setStructurePalette(true);
}

// tested
function closeStructurePalette() {
  setStructurePalette(false);
}

// tested
function openMetabolismPalette() {
  setMetabolismPalette(true);
}

// tested
function closeMetabolismPalette() {
  setMetabolismPalette(false);
}

// tested
function selectCell(val, display) {
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = val;
  if (display) {
    out(['selectCell', val]);
  }
}

// tested
function deselectCell() {
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = false;
  out('deselectCell');
}

/*
 * Initialize Functions
 * ==============================================================================
 */

var ARCOLOGIES_GLOBAL_STATE = {};
var ARCOLOGIES_GLOBAL_MENU = {};
var ARCOLOGIES_GLOBAL_CELLS = {};
var ARCOLOGIES_GLOBAL_SIGNALS = {};

// tested by proxy
function init() {
  ARCOLOGIES_GLOBAL_STATE = null;
  ARCOLOGIES_GLOBAL_STATE = {};
  ARCOLOGIES_GLOBAL_STATE.outletsOn = false;
  ARCOLOGIES_GLOBAL_STATE.generation = 0;
  ARCOLOGIES_GLOBAL_STATE.width = 0;
  ARCOLOGIES_GLOBAL_STATE.height = 0;
  ARCOLOGIES_GLOBAL_STATE.globalMidiNote = 60;
  ARCOLOGIES_GLOBAL_STATE.globalStructure = 'hive';
  ARCOLOGIES_GLOBAL_STATE.structures = ['hive', 'gate', 'shrine'];
  ARCOLOGIES_GLOBAL_STATE.globalMetabolism = 4;
  ARCOLOGIES_GLOBAL_STATE.ports = [ 'n', 'e', 's', 'w'];
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = false;
  ARCOLOGIES_GLOBAL_STATE.isInspectorPaletteActive = false;
  ARCOLOGIES_GLOBAL_STATE.isStructurePaletteActive = false;
  ARCOLOGIES_GLOBAL_STATE.isMetabolismPaletteActive = false;  
  ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive = false;
}

// tested by proxy
function initSignals() {
  ARCOLOGIES_GLOBAL_SIGNALS = null;
  ARCOLOGIES_GLOBAL_SIGNALS = {};
}

// tested
function initCells() {
  ARCOLOGIES_GLOBAL_CELLS = null;
  ARCOLOGIES_GLOBAL_CELLS = {};
  var x = getWidth();
  var y = getHeight();
  for (var iy = y - 1; iy >= 0; iy--) {
    for (var ix = x - 1; ix >= 1; ix--) {
      var cellId = 'x' + ix + 'y' + iy;
      var cell = initCell(ix, iy);
      setCell(cellId, cell);
    }
  }
}

// tested
function initCell(x, y) {
  return {
    id: makeId(x, y),
    isExists: false,
    x: x,
    y: y,
    ports: [],
    structure: getGlobalStructure(),
    note: getGlobalMidiNote(),
    metabolism: getGlobalMetabolism(),
    generation: 0
  };
}

// tested
function initCellById(id) {
  var splitX = id.split('x');
  var arr = splitX[1].split('y');
  return initCell(arr[0], arr[1]);
}

/*
 * Setters
 * ==============================================================================
 */

// tested
function setOutlets(val) {
  ARCOLOGIES_GLOBAL_STATE.outletsOn = (val) ? true : false;
}

// tested
function setCell(id, obj) {
  if (!ARCOLOGIES_GLOBAL_CELLS.hasOwnProperty(id)){
    ARCOLOGIES_GLOBAL_CELLS[id] = {};
  }
  Object.keys(obj).forEach(function(key) {
    ARCOLOGIES_GLOBAL_CELLS[id][key] = obj[key];
  });
}

// tested
function setInspectorPalette(val) {
  ARCOLOGIES_GLOBAL_STATE.isInspectorPaletteActive = val;
}

// tested
function setMidiPalette(val) {
  ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive = val;
}

// teseted
function setStructurePalette(val) {
  ARCOLOGIES_GLOBAL_STATE.isStructurePaletteActive = val;
}

// teseted
function setMetabolismPalette(val) {
  ARCOLOGIES_GLOBAL_STATE.isMetabolismPaletteActive = val;
}

// tested
function setGlobalMidiNote(val) {
  ARCOLOGIES_GLOBAL_STATE.globalMidiNote = val;
}

// tested
function setGlobalMetabolism(val) {
  ARCOLOGIES_GLOBAL_STATE.globalMetabolism = val;
}

// tested
function setGlobalStructure(val) {
  ARCOLOGIES_GLOBAL_STATE.globalStructure = val;
}

// tested
function setGeneration(val) {
  ARCOLOGIES_GLOBAL_STATE.generation = val;
}

// tested
function setWidth(val) {
  ARCOLOGIES_GLOBAL_STATE.width = val;
}

// tested
function setHeight(val) {
  ARCOLOGIES_GLOBAL_STATE.height = val;
}

// tested
function setSignal(id, obj) {
  if (!ARCOLOGIES_GLOBAL_SIGNALS.hasOwnProperty(id)){
    ARCOLOGIES_GLOBAL_SIGNALS[id] = {};
  }
 Object.keys(obj).forEach(function(key) {
    ARCOLOGIES_GLOBAL_SIGNALS[id][key] = obj[key];
  });
}

// tested
function setSignals(newSignals) {
  ARCOLOGIES_GLOBAL_SIGNALS = null;
  ARCOLOGIES_GLOBAL_SIGNALS = newSignals;
}


// tested
// wip - hold cell + single on field maybe?
function moveCell(originId, destinationId) {

  // write the destination then erase the origin
  var destination = {
    'isExists' : true,
    'ports' : getCell(originId).ports,
    'structure' : getCell(originId).structure,
    'note' : getCell(originId).note
  };
  setCell(destinationId, destination);

  setCell(originId, initCellById(originId));

}

// tested
function deleteCell(id) {
  deselectCell();
  setCell(id, initCellById(id));
}

// tested
function deleteSignal(id) {
  delete ARCOLOGIES_GLOBAL_SIGNALS.id;
}

// tested
function makeId(x, y) {
  return 'x' + x + 'y' + y;
}

// tested
function makeSignal(x, y, direction, generation, isJustBorn) {
  var id = makeId(x, y);
  var newSignal = {};
  newSignal = {
    'id' : id,
    'x' : x,
    'y' : y,
    'direction' : direction,
    'generation' : generation || getGeneration(),
    'isJustBorn' : false
  };
  return newSignal;
}

// tested
function togglePort(cellId, x, y) {
  var cell = getCell(cellId);
  var port = isAdjacentPort(cell, x, y);

  if (!port) return;
  
  if (cell.ports.contains(port)) {
    cell.ports.remove(port);
  } else {
    cell.ports.push(port);
  }
}

/*
 * Higher Level Getters
 * ==============================================================================
 */

// tested
function getCellByCoords(x, y) {
  var id = makeId(x, y);
  return getCell(id);
}

// tested
function getCellsByStructure(structure) {
  var existingCells = getExistingCells();
  var cells = [];
  Object.keys(existingCells).forEach(function(key) {
    if (existingCells[key].structure == structure) {
      cells.push(existingCells[key]);
    }
  });
  return cells;
}

// tested
function getExistingCells() {
  var c = ARCOLOGIES_GLOBAL_CELLS;
  var obj = {};
  for (var key in c) {
    if (c.hasOwnProperty(key)) {
        var cell = c[key];
        if (cell.isExists === false) continue;
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
      var cell = obj[key];
      arr.push(cell.id);
    }
  }
  return arr;
}

// tested
function getSignal(x, y) {
  var id = makeId(x, y);
  return (ARCOLOGIES_GLOBAL_SIGNALS.hasOwnProperty(id)) ? ARCOLOGIES_GLOBAL_SIGNALS[id] : false;
}

// tested
function rollRandomPort() {
  var ports = ['n', 'e', 's', 'w'];
  return ports[ Math.floor(Math.random() * ports.length)];
}

// tested
function getMidiNote(x, y) {
  var noteKey = noteArrayKey(x, y);
  // 7x8 = 56 = 4.6 octaves = C1 - F#5
  var chromaticMidiScale = [90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 
  80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 
  64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 
  48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35];
  return chromaticMidiScale[noteKey];
}

// tested
function noteArrayKey(x, y) {
  // row 0
  if (x == 1 && y == 0) return 0;
  if (x == 2 && y == 0) return 1;
  if (x == 3 && y == 0) return 2;
  if (x == 4 && y == 0) return 3;
  if (x == 5 && y == 0) return 4;
  if (x == 6 && y == 0) return 5;
  if (x == 7 && y == 0) return 6;
  // row 1
  if (x == 1 && y == 1) return 7;
  if (x == 2 && y == 1) return 8;
  if (x == 3 && y == 1) return 9;
  if (x == 4 && y == 1) return 10;
  if (x == 5 && y == 1) return 11;
  if (x == 6 && y == 1) return 12;
  if (x == 7 && y == 1) return 13;
  // row 2
  if (x == 1 && y == 2) return 14;
  if (x == 2 && y == 2) return 15;
  if (x == 3 && y == 2) return 16;
  if (x == 4 && y == 2) return 17;
  if (x == 5 && y == 2) return 18;
  if (x == 6 && y == 2) return 19;
  if (x == 7 && y == 2) return 20;
  // row 3
  if (x == 1 && y == 3) return 21;
  if (x == 2 && y == 3) return 22;
  if (x == 3 && y == 3) return 23;
  if (x == 4 && y == 3) return 24;
  if (x == 5 && y == 3) return 25;
  if (x == 6 && y == 3) return 26;
  if (x == 7 && y == 3) return 27;
  // row 4
  if (x == 1 && y == 4) return 28;
  if (x == 2 && y == 4) return 29;
  if (x == 3 && y == 4) return 30;
  if (x == 4 && y == 4) return 31;
  if (x == 5 && y == 4) return 32;
  if (x == 6 && y == 4) return 33;
  if (x == 7 && y == 4) return 34;
  // row 5
  if (x == 1 && y == 5) return 35;
  if (x == 2 && y == 5) return 36;
  if (x == 3 && y == 5) return 37;
  if (x == 4 && y == 5) return 38;
  if (x == 5 && y == 5) return 39;
  if (x == 6 && y == 5) return 40;
  if (x == 7 && y == 5) return 41;  
  // row 6
  if (x == 1 && y == 6) return 42;
  if (x == 2 && y == 6) return 43;
  if (x == 3 && y == 6) return 44;
  if (x == 4 && y == 6) return 45;
  if (x == 5 && y == 6) return 46;
  if (x == 6 && y == 6) return 47;
  if (x == 7 && y == 6) return 48;
  // row 7
  if (x == 1 && y == 7) return 49;
  if (x == 2 && y == 7) return 50;
  if (x == 3 && y == 7) return 51;
  if (x == 4 && y == 7) return 52;
  if (x == 5 && y == 7) return 53;
  if (x == 6 && y == 7) return 54;
  if (x == 7 && y == 7) return 55;
}

// tested
function translateMetabolism(y) {
  if (y == 0) return 6;
  if (y == 1) return 5;
  if (y == 2) return 4;
  if (y == 3) return 3;
  if (y == 4) return 2;
  if (y == 5) return 1;
  return 1;
}

// tested
function isInFieldBounds(x, y) {
  var okWest = (x >= 1);
  var okEast = (x < getWidth());
  var okNorth = (y >= 0);
  var okSouth = (y < getHeight());
  return (okWest && okEast && okNorth && okSouth);
}

// tested
function isAdjacentPort(cell, x, y) {
  // north
  if (cell.x == x && (cell.y - 1 == y)) { return 'n'; }
  // east
  else if ((cell.x + 1) == x && cell.y == y) { return 'e'; }
  // south
  else if (cell.x == x &&  (cell.y + 1 == y)) { return 's'; }
  // west
  else if ((cell.x - 1) == x &&  cell.y == y) { return 'w'; }
  else { return false }
}

/*
 * Lower Level Getters
 * ==============================================================================
 */

// tested
function getCell(id) {
  return (ARCOLOGIES_GLOBAL_CELLS.hasOwnProperty(id)) ? ARCOLOGIES_GLOBAL_CELLS[id] : false;
}

// tested
function getWidth() {
  return ARCOLOGIES_GLOBAL_STATE.width;
}

// tested
function getHeight() {
  return ARCOLOGIES_GLOBAL_STATE.height;
}

// tested
function getGeneration() {
  return ARCOLOGIES_GLOBAL_STATE.generation;
}

// tested
function getSignals() {
  return ARCOLOGIES_GLOBAL_SIGNALS;
}

// tested
function getSelectedCellId() {
  return ARCOLOGIES_GLOBAL_STATE.selectedCellId;
}

// tested
function isQuickMenuActive() {
  return (
    isInspectorPaletteActive() &&
    isStructurePaletteActive() &&
    isMetabolismPaletteActive () &&
    isMidiPaletteActive()
  );
}

// tested
function isInspectorPaletteActive() {
  return ARCOLOGIES_GLOBAL_STATE.isInspectorPaletteActive;
}

// tested
function isMidiPaletteActive() {
  return ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive;
}

// tested
function isStructurePaletteActive() {
  return ARCOLOGIES_GLOBAL_STATE.isStructurePaletteActive;
}

// tested
function isMetabolismPaletteActive() {
  return ARCOLOGIES_GLOBAL_STATE.isMetabolismPaletteActive;
}

// tested
function getGlobalMidiNote() {
  return ARCOLOGIES_GLOBAL_STATE.globalMidiNote;
}

// tested
function getGlobalMetabolism() {
  return ARCOLOGIES_GLOBAL_STATE.globalMetabolism;
}

// tested
function getGlobalStructure() {
  return ARCOLOGIES_GLOBAL_STATE.globalStructure;
}

// tested
function isHiveBirthing(hiveMetabolism) {
  return (getGeneration() % hiveMetabolism === 0) ? true : false;
}

// tested
function isOutletsOn() {
  return ARCOLOGIES_GLOBAL_STATE.outletsOn;
}

/*
 * Polyfills
 * ==============================================================================
 */

// tested
Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

// tested
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] == obj) {
      return true;
    }
  }
  return false;
};

// tested
Array.prototype.forEach = function forEach(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  var array = this;
  var arrayLength = array.length;
  thisArg = thisArg || this;
  for (var i = 0, l = arrayLength; i !== l; ++i) {
    callback.call(thisArg, array[i], i, array);
  }
};

// tested
if (!Object.prototype.size) {
  Object.defineProperty(Object.prototype, 'size', {
    value: function (obj) {
      if (this == null) {
        throw new TypeError('Not an object');
      }
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    }
  });
}

// tested by proxy
Object.defineProperty(Object, "assign", {
  value: function assign(target, varArgs) { // .length of function is 2
    'use strict';
    if (target === null || target === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource !== null && nextSource !== undefined) { 
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  },
  writable: true,
  configurable: true
});
