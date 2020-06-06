/*
 * arcologies src
 * ============================================================================
 *
 * By:        Tyler Etters
 * Date:      May, 2020
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
 *  - Utility & Helpers
 *
 * Notes:
 *  - Function "//tested" and "//untested" comments refers to test coverage in tests.js.
 */

/*
 * Events
 * ==============================================================================
 */

// untestable...
function advance() {

  var birthedSignals;
  var existingSignals;
  var propagatedSignals;
  var survivingSignals;
  var finalSignals;
  var existingCells;

  // the hives sing...
  hivesSing();

  // their glorious birth...
  birthedSignals = birthSignals();

  // & everything moves...
  existingSignals = getSignals();

  // ...unless there's nothing to move...
  if (existingSignals === undefined) return; 
  
  // & some things die but some things also sing...
  propagatedSignals = propagateSignals(existingSignals);

  // & some more things die...
  survivingSignals = cancelOutOfBoundsSignals(propagatedSignals);
  survivingSignals = cancelCollidingSignals(birthedSignals, survivingSignals);

  // & things are at rest
  setSignals(survivingSignals);

  // & if the weather is just so, we get to see it all from above
  if (!getSelectedCellId() && !isQuickMenuActive() && !isMidiPaletteActive()) {
    // only redraw when a cell isn't selected, the cell menu  isn't active, or the palette isn't active
    returnToField();
  }

}

// tested
function fieldEvent(x, y) {

  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);

  if (isQuickMenuKeyPressed(4) && isMidiPaletteActive()) {
    
    // if we have a cell selected, set its midi note,
    // otherwise set the global midi note
    if (getSelectedCellId()) {
      midiPaletteEvent(x,y);
    } else {
      setGlobalMidiNote(getMidiNote(x, y));
    }

  } else if (isQuickMenuKeyPressed(7) && ids.contains(id)) {
    
    // single cell delete
    deleteCell(id);
    returnToField();

  } else if (getSelectedCellId() === id && !ids.contains(id)) {
    
    // we're pressing an empty cell, so deslect the cell
    deselectCell();
    returnToField();

  } else if (getSelectedCellId() === false && !ids.contains(id)) {
    // no cell is selected and this cell doesn't exist so create it (via cycle...)
    selectCell(id, true);
    clearField();
    cycleThroughFieldRoutes(x, y);    
    drawCells();
    drawSignals();
  } else if (getSelectedCellId() == id) {
    // we're pressing the already selected cell, so cycle through the routes
    clearField();
    cycleThroughFieldRoutes(x, y);
    drawCells();
    drawSignals();
  } else if (getSelectedCellId() !== id && ids.contains(id)) {
    // we've pressed a different existing cell and want to select it
    selectCell(id, true);
    clearField();
    drawLeylines(id);
    out(drawRoute(id));
    drawCells();
    drawSignals();
  } else {
    // this shouldn't happen but fallback to resting state
    deselectCell();
    clearField();
    drawCells();
    drawSignals();
  }
}

// untested
function returnToField() {
  clearField();
  drawCells();
  drawSignals();
}

function returnToQuickMenu() {
  clearQuickMenu();
}

// wip
function quickMenuEvent(y, z) {

  // both quickMenu and subMenu events come in here
  // we keep track of the key state no matter what
  setQuickMenuKeyState(y, z);

 // midi palette
  if (y == 4) {
    if (z == 1) {
      clearField();
      noBlinkSelectedCell();
      openMidiPalette();
    } else {
      closeMidiPalette();
      deselectCell();
      returnToField();
      returnToQuickMenu();
    }
  }
    
  // structure palette
  if (y == 5) {
    if (z == 1) {
      openStructurePalette();
      drawStructure();
    } else {
      closeStructurePalette();
      returnToQuickMenu();
    }
  }

  // metabolism palette
  if (y == 6) {
    if (z == 1) {
      openMetabolismPalette();
      drawMetabolism();
    } else {
      closeMetabolismPalette();
      returnToQuickMenu();
    }
  }



  // // inspector
  // } else if (isQuickMenuKeyPressed(0) && z == 1) {
  //     if (isQuickMenuKeyPressed(1)) inspect('signals');
  //     if (isQuickMenuKeyPressed(2)) inspect('hives');
  //     if (isQuickMenuKeyPressed(3)) inspect('gates');
  //     if (isQuickMenuKeyPressed(4)) inspect('shrines');
  //     if (isQuickMenuKeyPressed(5)) inspect('leylines');

  // // disable inspector
  // } else if (y == 0 && z == 0) {
  //   returnToField();

  // // manual advance
  // } else if (y == 1 && z == 1) {
  //   deselectCell();
  //   returnToField();
  //   advance();

  // // empty
  // } else if (y == 2 && z == 1) {
     
  // // empty
  // } else if (y == 3 && z == 1) {
 

  // // set structure
  // } else if (isQuickMenuKeyPressed(5) && z == 1) {
  //   if (!getSelectedCellId()) {
  //     if (y == 2) setGlobalStructure('hive');
  //     if (y == 3) setGlobalStructure('gate');
  //     if (y == 4) setGlobalStructure('shrine');
  //   } else {
  //     var id = getSelectedCellId();
  //     if (y == 2) setCell(id, { 'structure' : 'hive' });
  //     if (y == 3) setCell(id, { 'structure' : 'gate' });
  //     if (y == 4) setCell(id, { 'structure' : 'shrine' });
  //   } 

}


// wip
function subMenuEvent(y, z) {
  if (isMetabolismPaletteActive() && z == 1) {
      metabolismPaletteEvent(y);
  }
    if (isStructurePaletteActive() && z == 1) {
      structurePaletteEvent(y);
  }
}

// wip
function inspect(val) {
  clearField();
  noBlinkSelectedCell();
  if (val == 'signals'); // draw signals
  if (val == 'hives') drawCells('hives');
  if (val == 'gates') drawCells('gates');
  if (val == 'shrines') drawCells('shrines');
  if (val == 'leylines'); // draw leylines
}

// tested
function midiPaletteEvent(x, y) {
  
  // defensive
  if (x < 0 && x > 8 && y < 0 && y > 8) return;

  // all midi palette events do the same thing - set the note
  var note = getMidiNote(x, y);
  var id = getSelectedCellId();
  setCell(id, { 'note' : note});
  var arr = ['animateMidiNotePress', x, y];
  if (isOutletsOn()) {
    out(arr);
  } else {
    return arr;
  }
}

// tested
function metabolismPaletteEvent(y) {

  // defensive
  if (y < -1 && y > 5) return;

  var metabolism = getMetabolism(y);
  var id = getSelectedCellId();
  if (getSelectedCellId()) {
    setCell(id, { 'metabolism' : metabolism});
  } else {
    setGlobalMetabolism(metabolism);
  }

  clearQuickMenu();
  drawMetabolism();
}

// tested
function structurePaletteEvent(y) {

  // defensive
  if (y < 2 && y > 4) return;

  var structureName = getStructureName(y);
  var id = getSelectedCellId();
  if (getSelectedCellId()) {
    setCell(id, { 'structure' : structureName});
  } else {
    setGlobalStructure(structureName);
  }

  clearQuickMenu();
  drawStructure();
}

/*
 * Midi
 * ==============================================================================
 */

// untested
function hivesSing() {

  var hiveChorus = ['playMidi'];
  var hives = getCellsByStructure('hive');

  Object.keys(hives).forEach(function(key) {
    var thisHive = hives[key];
    var note = isHiveBirthing(thisHive.metabolism) ? thisHive.note : false;
    if (note) {
      hiveChorus.push(note);
    }
  });

  if (hiveChorus.length > 1) {
    out(hiveChorus);
  }

}

// untested
function cellSing(id) {

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
  var cells = enrichWithRouteDirections(getExistingCells());
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
     var isRouteMatch = routeMatch(thisCell.routeDirections, thisSignal.direction);

    // the cell and signal occupy the same spot, but the route/direction is not compatible
    if (idMatch && !isRouteMatch) {
      delete collisionResults[thisSignal.id];
    }

    // this is a valid interaction
    if (idMatch && isRouteMatch) {
      delete collisionResults[thisSignal.id];
      cellSing(thisCell.id);
      newSignals = Object.assign(routeSignals(thisCell, thisSignal), newSignals);
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

  // a northbound will emerge next generation if the signal
  // did not enter from the south of the cell
  // unless it is it "nn" (u-turn) cell
  if ((cell.routeDirections.contains('n') && (originSignal.direction != 's')) || cell.route == 'nn') {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 'n'));
  }

  // an eastbound signal will emerge next generation if the signal
  // did not enter from the west of the cell
  // OR it ee "u-turn"
  if ((cell.routeDirections.contains('e') && (originSignal.direction != 'w')) || cell.route == 'ee') {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 'e'));
  }

  // a southbound signal will emerge next generation if the signal
  // did not enter from the south of the cell
  // OR it ss "u-turn"
  if ((cell.routeDirections.contains('s') && (originSignal.direction != 'n')) || cell.route == 'ss') {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 's'));
  }

  // a westbound signal will emerge next generation if the signal
  // did not enter from the east of the cell
  // OR it ww "u-turn"
  if ((cell.routeDirections.contains('w') && (originSignal.direction != 'e')) || cell.route == 'ww') {
    newSignals = Object.assign(newSignals, cellRouteSignal(cell, originSignal, 'w'));
  }

  return newSignals;
}

// untested
function cellRouteSignal(cell, originSignal, direction) {
  var cellRouteSignalResults = {};
  var routeDirectionsLength = cell.routeDirections.length;

  for (i = 0; i < routeDirectionsLength; i++) {

    if (cell.routeDirections[i] == direction) {
      var uTurnSignal;
      if (direction == 'n') uTurnSignal = makeSignal( originSignal.x, originSignal.y - 1, 'n' );
      if (direction == 'e') uTurnSignal = makeSignal( originSignal.x + 1, originSignal.y, 'e' );
      if (direction == 's') uTurnSignal = makeSignal( originSignal.x, originSignal.y + 1, 's' );
      if (direction == 'w') uTurnSignal = makeSignal( originSignal.x - 1, originSignal.y, 'w' );
      uTurnSignal.generation = getGeneration() + 1;
      cellRouteSignalResults[uTurnSignal.id] = uTurnSignal;
      continue;
    }

    if (cell.routeDirections[i] == 's' && originSignal.direction != 'n') {      
      var northernSignal = makeSignal(
          originSignal.x,
          originSignal.y - 1,
          'n',
          getGeneration() + 1,
          true
        );
      cellRouteSignalResults[northernSignal.id] = northernSignal;
    }

    if (cell.routeDirections[i] == 'w' && originSignal.direction != 'e') {      
      var easternSignal = makeSignal(
        originSignal.x + 1,
        originSignal.y,
        'e',
        getGeneration() + 1,
        true
      );
      cellRouteSignalResults[easternSignal.id] = easternSignal;
    }

    if (cell.routeDirections[i] == 'n' && originSignal.direction != 's') {      
      var southernSignal = makeSignal(
        originSignal.x,
        originSignal.y + 1,
        's',
        getGeneration() + 1,
        true
      );
      cellRouteSignalResults[southernSignal.id] = southernSignal;
    }

    if (cell.routeDirections[i] == 'e' && originSignal.direction != 'w') {      
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
// north direction matches south route
// south direction matches north route
// east direction matches west route
// west direction matches east route
function routeMatch(routes, direction) {
  if (direction === 'n') return routes.contains('s');
  if (direction === 'e') return routes.contains('w');
  if (direction === 's') return routes.contains('n');
  if (direction === 'w') return routes.contains('e');
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
  hives = enrichWithRouteDirections(hives);

  var hivesLength = hives.length;

  for(var i = 0; i < hivesLength; i++) {
    var thisHive = hives[i];

    if (!isHiveBirthing(thisHive.metabolism)) continue;

    if (thisHive.routeDirections.contains('n')) {
      // one cell north means subtract one from the hive
      // check y against zero
      var y1 = thisHive.y - 1;
      if (y1 >= 0) {
        newSignals.push(makeSignal( thisHive.x, y1, 'n', getGeneration(), true));
      }
    }

    if (thisHive.routeDirections.contains('e')) {
      // one cell east means add one to the hive
      // check x against grid width less one for zero index
      var x1 = thisHive.x + 1;
      if (x1 <= getWidth() - 1) {
        newSignals.push(makeSignal( x1, thisHive.y, 'e', getGeneration(), true));
      }
    }

    if (thisHive.routeDirections.contains('s')) {
      // one cell south means add one to the hive
      // check y against grid height less one for zero index
      var y2 = thisHive.y + 1;
      if (y2 <= getHeight() - 1) {
        newSignals.push(makeSignal( thisHive.x, y2, 's', getGeneration(), true));
      }
    }

    if (thisHive.routeDirections.contains('w')) {
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
  var currentCellRouteDirections = getRouteDirections(currentCell.route); // eg, ['n', 's']
  var existingCells = getExistingCells();
  var filteredTermini = [];

  if (currentCellRouteDirections.contains('n')) {
    filteredTermini.push(findColumnNeighbor(currentCell, existingCells, 'north'));
  }
  if (currentCellRouteDirections.contains('e')) {
    filteredTermini.push(findRowNeighbor(currentCell, existingCells, 'east'));
  }
  if (currentCellRouteDirections.contains('s')) {
    filteredTermini.push(findColumnNeighbor(currentCell, existingCells, 'south'));
  }
  if (currentCellRouteDirections.contains('w')) {
    filteredTermini.push(findRowNeighbor(currentCell, existingCells, 'west'));
  }

  var cellLeylines = [];
  for (var i = 0; i < filteredTermini.length; i++) {
    cellLeylines.push(['drawLeyline', currentCell.x, currentCell.y, filteredTermini[i].x, filteredTermini[i].y]);
  }
  return cellLeylines;
}


// untested
function cycleThroughFieldRoutes(x, y) {
  
  var cell = getCellByCoords(x, y);
  var id = makeId(x, y);

  if (!cell.isExists) {
    setCell(id,
      { 
        'structure' : getGlobalStructure(), 
        'metabolism' : getGlobalMetabolism(), 
        'route' : 'all', 
        'isExists' : true 
      } 
    );
  } else {
    setCell(id, { 'route' : cycleRoutes(cell.route) });
  }

  drawLeylines(id); // eh?
  out(drawRoute(id));

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

// tested
function clearQuickMenu() {
  var msg = 'clearQuickMenu';
  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
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
  
  if (cell.route == 'off') return;
  if (cell.route == 'shell') return;

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
function drawCells(type) {
  var arr = ['drawCells'];
  var cells = {};

  if (type == 'hives') {
    cells = getCellsByStructure('hive');
  } else if (type == 'gates') {
    cells = getCellsByStructure('gate');
  } else if (type == 'shrines') {
    cells = getCellsByStructure('shrine');
  } else {
    cells = getExistingCells();
  }

  if (cells === undefined) return;

  if (Object.size(cells) > 0) {
    for (var key in cells) {
        if (!cells.hasOwnProperty(key)) continue;
        arr.push(cells[key].id);
    }
    if (isOutletsOn()) {
      out(arr);
    } else {
      return arr;
    }
  }
}

// tested
function drawLeyline(arr) {
  arr.unshift('drawLeyline');
  return arr;
}

// tested
function drawRoute(id) {
  var cell = getCell(id);
  return ['drawRoute', cell.route, cell.x, cell.y];
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
  var msg = ['drawStructure'];
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
  var msg = ['drawMetabolism'];
  if (getSelectedCellId()) {
    msg.push(getCell(getSelectedCellId()).metabolism);
  } else {
    msg.push(getGlobalMetabolism());
  }

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
function openMidiPalette() {
  setMidiPalette(true);
  var msg = 'drawMidiPalette';
  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
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
function closeMidiPalette() {
  setMidiPalette(false);
}

// tested
function deselectCell() {
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = false;
  out('deselectCell');
}

// tested
function selectCell(val, display) {
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = val;
  if (display) {
    out(['selectCell', val]);
  }
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
  ARCOLOGIES_GLOBAL_STATE.isMidiPaletteActive = false;
  ARCOLOGIES_GLOBAL_STATE.globalMidiNote = 60;
  ARCOLOGIES_GLOBAL_STATE.isStructurePaletteActive = false;
  ARCOLOGIES_GLOBAL_STATE.globalStructure = 'hive';
  ARCOLOGIES_GLOBAL_STATE.structures = ['hive', 'gate', 'shrine'];
  ARCOLOGIES_GLOBAL_STATE.isMetabolismPaletteActive = false;  
  ARCOLOGIES_GLOBAL_STATE.globalMetabolism = 4;
  ARCOLOGIES_GLOBAL_STATE.routes = [
    'all', 'ne', 'se', 'sw', 'nw', 'ns', 'ew', 'nes', 'esw', 'swn',
    'wne', 'nn', 'ee', 'ss', 'ww', 'home', 'random', 'shell', 'off'
  ];
  ARCOLOGIES_GLOBAL_STATE.selectedCellId = false;
  ARCOLOGIES_GLOBAL_STATE.signalSpeed = 1;
  ARCOLOGIES_GLOBAL_STATE.isQuickMenuActive = false;
  ARCOLOGIES_GLOBAL_STATE.quickMenuFirstIn = false;
  ARCOLOGIES_GLOBAL_STATE.is0Pressed = false;
  ARCOLOGIES_GLOBAL_STATE.is1Pressed = false;
  ARCOLOGIES_GLOBAL_STATE.is2Pressed = false;
  ARCOLOGIES_GLOBAL_STATE.is3Pressed = false;
  ARCOLOGIES_GLOBAL_STATE.is4Pressed = false;
  ARCOLOGIES_GLOBAL_STATE.is5Pressed = false;
  ARCOLOGIES_GLOBAL_STATE.is6Pressed = false;
  ARCOLOGIES_GLOBAL_STATE.is7Pressed = false;
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
    route: 'off',
    structure: 'none',
    note: 60,
    metabolism: 4,
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
function setQuickMenu(val) {
  ARCOLOGIES_GLOBAL_STATE.isQuickMenuActive = val;
}

// tested
function setQuickMenuFirstIn(y) {
  ARCOLOGIES_GLOBAL_STATE.quickMenuFirstIn = y;
}

// tested
function clearQuickMenuFirstIn() {
  ARCOLOGIES_GLOBAL_STATE.quickMenuFirstIn = false;
}

// tested
function setQuickMenuKeyState(y, z) {
  var key = 'is' + y + 'Pressed';
  ARCOLOGIES_GLOBAL_STATE[key] = (z === 1) ? true : false;
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
function setLifespan(val) {
  ARCOLOGIES_GLOBAL_STATE.lifespan = val;
}

// tested
function setWidth(val) {
  ARCOLOGIES_GLOBAL_STATE.width = val;
}

// tested
function setGeneration(val) {
  ARCOLOGIES_GLOBAL_STATE.generation = val;
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
function moveCell(originId, destinationId) {

  // write the destination then erase the origin
  var destination = {
    'isExists' : true,
    'route' : getCell(originId).route,
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
function rollRandomRoute() {
  var routes = ['all', 'ne', 'se', 'sw', 'nw', 'ns', 'ew', 'nes', 'esw', 'swn', 'wne', 'nn', 'ee', 'ss', 'ww', 'shell'];
  return getRouteDirections(routes[ Math.floor(Math.random() * routes.length)]);
}

// tested
function cycleRoutes(route) {
  // this pattern is hardcoded for the user's benefit
  // (i don't want errant array sorting changing it)
  if  (route === 'all')    return 'ne';
  if  (route === 'ne')     return 'se';
  if  (route === 'se')     return 'sw';
  if  (route === 'sw')     return 'nw';
  if  (route === 'nw')     return 'ns';
  if  (route === 'ns')     return 'ew';
  if  (route === 'ew')     return 'nes';
  if  (route === 'nes')    return 'esw';
  if  (route === 'esw')    return 'swn';
  if  (route === 'swn')    return 'wne';
  if  (route === 'wne')    return 'nn';
  if  (route === 'nn')     return 'ee';
  if  (route === 'ee')     return 'ss';
  if  (route === 'ss')     return 'ww';
  if  (route === 'ww')     return 'random';
  if  (route === 'random') return 'shell';
  if  (route === 'shell')  return 'all';
  return 'all';
}

// tested
function getRouteDirections(route) {
  if  (route == 'all')    return ['n', 'e', 's', 'w'];
  if  (route == 'ne')     return ['n', 'e'];
  if  (route == 'se')     return ['s', 'e'];
  if  (route == 'sw')     return ['s', 'w'];
  if  (route == 'nw')     return ['n', 'w'];
  if  (route == 'ns')     return ['n', 's'];
  if  (route == 'ew')     return ['e', 'w'];
  if  (route == 'nes')    return ['n', 'e', 's'];
  if  (route == 'esw')    return ['e', 's', 'w'];
  if  (route == 'swn')    return ['s', 'w', 'n'];
  if  (route == 'wne')    return ['w', 'n', 'e'];
  if  (route == 'nn')     return ['n'];
  if  (route == 'ee')     return ['e'];
  if  (route == 'ss')     return ['s'];
  if  (route == 'ww')     return ['w'];
  if  (route == 'random') return ['n', 'e', 's', 'w'];
  if  (route == 'shell')  return [];
  if  (route == 'off')    return [];
  return  [];
}

// tested
function enrichWithRouteDirections(cells) {
  Object.keys(cells).forEach(function(key) {
    var cell = cells[key];
    var routeDirections = (cell.route === 'random') ? rollRandomRoute() : getRouteDirections(cell.route);
    cells[key].routeDirections = routeDirections;
  });
  return cells;
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
function getMetabolism(y) {
  if (y == 0) return 6;
  if (y == 1) return 5;
  if (y == 2) return 4;
  if (y == 3) return 3;
  if (y == 4) return 2;
  if (y == 5) return 1;
  return 1;
}

// tested
function getStructureName(val) {
  if (val == 4) return 'hive';
  if (val == 3) return 'gate';
  if (val == 2) return 'shrine';
  return 'hive';
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
function isInQuickMenuBounds(x, y) {
  var okWestEast = (x == 0);
  var okNorth = (y >= 0);
  var okSouth = (y < getHeight());
  return (okWestEast && okNorth && okSouth);
}

// tested
function isQuickMenuKeyPressed(val) {
  var query = 'is' + val + 'Pressed';
  return (ARCOLOGIES_GLOBAL_STATE.hasOwnProperty(query)) ? ARCOLOGIES_GLOBAL_STATE[query] : false;
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
function getSignalSpeed() {
  return ARCOLOGIES_GLOBAL_STATE.signalSpeed;
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
  return ARCOLOGIES_GLOBAL_STATE.isQuickMenuActive;
}

// tested
function getQuickMenuFirstIn() {
  return ARCOLOGIES_GLOBAL_STATE.quickMenuFirstIn;
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
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
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
}

/*
 * Utility & Helpers
 * ==============================================================================
 */

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

 function dumpState() {
  out(JSON.stringify(ARCOLOGIES_GLOBAL_STATE));
}

// untested
function dumpCells() {
  out(JSON.stringify(ARCOLOGIES_GLOBAL_CELLS));
}

// tested
function dumpStructures() {
  var arr = ARCOLOGIES_GLOBAL_STATE.structures;
  arr.unshift('structuresList');
  if (isOutletsOn()) {
    out(arr);
  } else {
    return arr;
  }
}

// tested
function dumpRoutes() {
  var arr = ARCOLOGIES_GLOBAL_STATE.routes;
  arr.unshift('routesList');
  if (isOutletsOn()) {
    out(arr);
  } else {
    return arr;
  }
}

// untested
function dumpExistingCells() {
  var obj = getExistingCells();
  if (isOutletsOn()) {
    out(JSON.stringify(obj));
  } else {
    return obj;
  }
}

// untested
function dumpExistingSignals() {
  var obj = getSignals();
  if (isOutletsOn()) {
    out(JSON.stringify(obj));
  } else {
    return obj;
  }
}

// untested...
function test() {
  out('test function');
}
