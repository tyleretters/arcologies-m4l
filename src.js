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
 *  - Core
 *  - Events
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
 *  - "midiPaletteEvent" "menuEvent" and "fieldEvent" are all types of "gridEvent".
 */

/*
 * Core
 * ==============================================================================
 */

// beta wip
function advance() {

  var birthedSignals;
  var existingSignals;
  var propagatedSignals;
  var survivingSignals;
  var finalSignals;
  var existingCells;

  // glorious birth...
  hivesSing();

  birthedSignals = birthSignals();

  // & everything moves...
  existingSignals = getSignals();

  if (existingSignals === undefined) return; // ...unless there's nothing to move...
  propagatedSignals = propagateSignals(existingSignals);

  // & some things die...
  survivingSignals = cancelOutOfBoundsSignals(propagatedSignals);
  survivingSignals = cancelCollidingSignals(birthedSignals, survivingSignals);

  // & some more things die but some things also sing...
  // moved to propagate
  // finalSignals = collide(survivingSignals);

  // & things are at rest
  setSignals(survivingSignals);

  if (!getSelectedCellId() && !getIsMenuActive() && !getIsMidiPaletteActive()) {
    // only redraw when a cell isn't selected, the menu isn't active, or the palette isn't active
    clearField();
    drawSignals();
    drawCells();
  }

}


// tested
function collide(signals) {

  var collisionResults = signals;
  var cells = enrichWithRouteDirections(getExistingCells());
  var hives = getCellsByStructure('hive');
  var ports = getCellsByStructure('port');
  var nomads = getCellsByStructure('nomad');
  var portsAndNomads = Object.assign(ports, nomads);

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
    Object.keys(portsAndNomads).forEach(function(portsAndNomadsKey) {
     var thisCell = portsAndNomads[portsAndNomadsKey];
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

// wip
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

// wip
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

// beta wip
function hivesSing() {

  var hiveChorus = ['playMidi'];
  var hives = getCellsByStructure('hive');

  Object.keys(hives).forEach(function(key) {
    var thisHive = hives[key];
    var note = isHiveBirthing(thisHive.interval) ? thisHive.note : false;
    if (note) {
      hiveChorus.push(note);
    }
  });

  if (hiveChorus.length > 1) {
    out(hiveChorus);
  }

}

// wip
function cellSing(id) {

  var cellNote = ['playMidi', getCell(id).note];
  
  if (isOutletsOn()) {
    out(cellNote);
  } else {
    return cellNote;
  }

}

// tested
function cancelOutOfBoundsSignals(survivingSignals) {
  var inBoundsSignals = {};
  Object.keys(survivingSignals).forEach(function(key) {
    if (isInBounds(survivingSignals[key].x, survivingSignals[key].y)) {
      var id = survivingSignals[key].id;
      inBoundsSignals[id] = survivingSignals[key];
    }
  });
  return inBoundsSignals;
} 

// tested
// very brittle test - if you change the sorting
// of the array the test will break
function birthSignals() {

  var birthedSignals = {};
  var newSignals = [];
  var hives = getCellsByStructure('hive');
  hives = enrichWithRouteDirections(hives);

  var hivesLength = hives.length;

  for(var i = 0; i < hivesLength; i++) {
    var thisHive = hives[i];

    if (!isHiveBirthing(thisHive.interval)) continue;

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
      // check x against 0
      var x2 = thisHive.x - 1;
      if (x2 >= 0 ) {
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
  
  // western boundary is row 0
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
    // we're going all the way to the edge of the field
    if (direction == 'west') {
       neighbor = 0;
    }
    if (direction == 'east') {
      neighbor = getWidth() - 1; // account for zero index on grid
    }
  }

  var neighborId = 'x' + neighbor + 'y' + currentCell.y;
  return { 'id': neighborId, 'x' : neighbor, 'y' : currentCell.y };
}

// tested
function prepareCellChannels(cellId) {

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

  var cellChannels = [];
  for (var i = 0; i < filteredTermini.length; i++) {
    cellChannels.push(['drawChannel', currentCell.x, currentCell.y, filteredTermini[i].x, filteredTermini[i].y]);
  }
  return cellChannels;
}


// untested
function cycleThroughFieldRoutes(x, y) {
  
  var cell = getCellByCoords(x, y);
  var id = makeId(x, y);

  if (!cell.isExists) {
    // new cells start as a "hive" with "all" routes on
    setCell(id, { 'structure' : 'hive', 'route' : 'all', 'isExists' : true } );
  } else {
    setCell(id, { 'route' : cycleRoutes(cell.route) });
  }

  drawChannels(id); // eh?
  out(drawRoute(id));

}

/*
 * Events
 * ==============================================================================
 */

// untested
function gridEvent(press, x, y) {
  if (x > getWidth() - 1) return;
  if (y > getHeight() - 1) return;

  if (getIsMidiPaletteActive()) {
    midiPaletteEvent(press, x, y);
  } else if (getIsMenuActive()) {
    menuEvent(press, x, y);
  } else {
    fieldEvent(press, x, y);
  }
}

// untested
function midiPaletteEvent(press, x, y) {
  switch(press) {
    case 'single':
      // the midi palette is always [x1y1, x6y6] on any sized grid
      // and pressing anywhere outside this square closes it
      if (x > 0 && x < 7 && y > 0 && y < 7) {
        singleMidiPaletteEvent(x, y);
      } else {
        closeMidiPalette();
        clearField();
        openMenu();
        drawMenu(getSelectedCellId());
      }
      break;
    case 'double':
      // no double press events exist in the midi palette
      break;
    case 'long':
      // no long press events exist in the midi palette
      break;
  }
} 

// tested
function singleMidiPaletteEvent(x, y) {
  // all midi palette events do the same thing - set the note
  // 6x6 = 36 = 3 octaves = C3, C4, C5
  var note = getNote(x, y);
  var id = getSelectedCellId();
  setCell(id, { 'note' : note});
  var arr = ['animateMidiNotePress', x, y];
  if (isOutletsOn()) {
    out(arr);
  } else {
    return arr;
  }
}

// untested
function menuEvent(press, x, y) {
  switch(press) {
    case 'single':
      // the menu is always [x1y1, x6y6] on any sized grid
      // and pressing anywhere outside this square closes it
      if (x > 0 && x < 7 && y > 0 && y < 7) {
        singleMenuEvent(x, y);
      } else {
        closeMenu();
        deselectCell();
        clearField();
        drawCells();
        drawSignals();
      }
      break;
    case 'double':
      // no double press events exist in the menu
      break;
    case 'long':
      // no long press events exist in the menu
      break;
  }
}

// untested
function singleMenuEvent(x, y) {
  // note this x, y does not correspond to the ECOLOGIES_GLOBAL_FIELD.xNyN values!
  // so we cannot use them to lookup the cells we have to getSelectedCellId()[id]
  var id = getSelectedCellId();
  var cell = getCell(id);

  // the nw corner is the route symbole &
  // 2,2 lets you change the route:
  if (x === 2 && y === 2) {
    cell.route = cycleRoutes(cell.route);
    setCell(id, cell);
    out(drawMenuRoute(id));
  }

  // the ne corner is divided into 3 1x3 row
  // with which you can set the structure:
  if (x === 4 || x === 5 || x === 6) {
    if (y === 1) {
      cell.structure = 'nomad';
    }
    if (y === 2) {
      cell.structure = 'port';
    }
    if (y === 3) {
      cell.structure = 'hive';
    }
    setCell(id, cell);
    out(drawMenuStructure(id));
  }

  // row 4 toggles the midi palette
  if (y === 4) {
    out('animateMidiPalettePress');
    openMidiPalette();
  }

  // row 5 sets the interval
  if (y === 5) {
    // we know x can only be 1-6 due to previous validation
    setCell(id, { 'interval' : x });
    out(drawMenuInterval(x));
  }

  // row 6 is delete:
   if (y === 6) {
      deleteCell(id);
      out('deleteCell');
      // closeMenu() is then called from Max once the animation is complete
  } 

}

// untested
function fieldEvent(press, x, y) {
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
  }
}

// untested
function singleFieldEvent(x, y) {

  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);

  if (getSelectedCellId() === id && !ids.contains(id)) {
    // we're pressing an empty cell, so deslect the cell
    deselectCell();
    clearField();
    drawCells();
    drawSignals();
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
    drawChannels(id);
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
function doubleFieldEvent(x, y) {

  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);

  clearField();

  if (ids.contains(id)) {
    // we are doulbe pressing any existing cell
    selectCell(id, false);
    clearField();
    openMenu();
    drawMenu(id);
  }

}

// untested
function longFieldEvent(x, y) {

  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);

  if (ids.contains(id)) {
    // removed long press field events for occupied cells v0.3-beta
  } else if (getSelectedCellId()) {
    // removed long press field events for un-occupied cells in v0.3-beta
  } else {
    // reserved for global menu
  }

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
function drawChannels(id) {

  var cell = getCell(id);
  
  if (cell.route == 'off') return;
  if (cell.route == 'shell') return;

  var channels = [];
  channels = channels.concat(prepareCellChannels(cell.id));
  
  if (isOutletsOn()) {
    channels.forEach(function(channel){
      out(channel);
    });
  } else {
      return channels;
  }

} 

// tested
function drawCells() {
  
  var arr = ['drawCells'];
  var cells = getExistingCells();
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
function drawChannel(arr) {
  arr.unshift('drawChannel');
  return arr;
}

// tested
function drawRoute(id) {
  var cell = getCell(id);
  return ['drawRoute', cell.route, cell.x, cell.y];
}

// untested
function drawMenu(id) {
  out(drawMenuRoute(id));
  out(drawMenuStructure(id));
  out(drawMenuInterval(getCell(id).interval));
}

// tested
function drawMenuRoute(id) {
  var cell = getCell(id);
  return ['drawRoute', cell.route, 2, 2];
}

// tested
function drawMenuStructure(id) {
  var cell = getCell(id);
  return ['drawStructure', cell.structure];
}

// tested
function drawMenuInterval(x) {
  return ['drawMenuInterval', x];
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
function openMenu() {
  setMenu(true);
  var msg = 'openMenu';
  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
}

// tested
function closeMenu() {
  setMenu(false);
  var msg = 'closeMenu';
  if (isOutletsOn()) {
    out(msg);
  } else {
    return msg;
  }
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
function closeMidiPalette() {
  setMidiPalette(false);
}

// tested
function deselectCell() {
  ECOLOGIES_GLOBAL_STATE.selectedCellId = false;
  out('deselectCell');
}

// tested
function selectCell(val, display) {
  ECOLOGIES_GLOBAL_STATE.selectedCellId = val;
  if (display) {
    out(['selectCell', val]);
  }
}

/*
 * Initialize Functions
 * ==============================================================================
 */

var ECOLOGIES_GLOBAL_STATE = {};
var ECOLOGIES_GLOBAL_CELLS = {};
var ECOLOGIES_GLOBAL_SIGNALS = {};

// tested by proxy
function init() {
  ECOLOGIES_GLOBAL_STATE = null;
  ECOLOGIES_GLOBAL_STATE = {};
  ECOLOGIES_GLOBAL_STATE.outletsOn = false;
  ECOLOGIES_GLOBAL_STATE.generation = 0;
  ECOLOGIES_GLOBAL_STATE.width = 0;
  ECOLOGIES_GLOBAL_STATE.height = 0;
  ECOLOGIES_GLOBAL_STATE.isMenuActive = false;
  ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive = false;
  ECOLOGIES_GLOBAL_STATE.routes = [
    'all', 'ne', 'se', 'sw', 'nw', 'ns', 'ew', 'nes', 'esw', 'swn',
    'wne', 'nn', 'ee', 'ss', 'ww', 'home', 'random', 'shell', 'off'
  ];
  ECOLOGIES_GLOBAL_STATE.structures = ['hive', 'port', 'nomad'];
  ECOLOGIES_GLOBAL_STATE.selectedCellId = false;
  ECOLOGIES_GLOBAL_STATE.signalSpeed = 1;
}

// tested by proxy
function initSignals() {
  ECOLOGIES_GLOBAL_SIGNALS = null;
  ECOLOGIES_GLOBAL_SIGNALS = {};
}

// tested
function initCells() {
  ECOLOGIES_GLOBAL_CELLS = null;
  ECOLOGIES_GLOBAL_CELLS = {};
  var x = getWidth();
  var y = getHeight();
  for (var iy = y - 1; iy >= 0; iy--) {
    for (var ix = x - 1; ix >= 0; ix--) {
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
    interval: 4,
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
  ECOLOGIES_GLOBAL_STATE.outletsOn = (val) ? true : false;
}

// tested
function setCell(id, obj) {
  if (!ECOLOGIES_GLOBAL_CELLS.hasOwnProperty(id)){
    ECOLOGIES_GLOBAL_CELLS[id] = {};
  }
 Object.keys(obj).forEach(function(key) {
    ECOLOGIES_GLOBAL_CELLS[id][key] = obj[key];
  });
}

// tested
function setMenu(val) {
  ECOLOGIES_GLOBAL_STATE.isMenuActive = val;
}

// tested
function setMidiPalette(val) {
  ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive = val;
}

// tested
function setLifespan(val) {
  ECOLOGIES_GLOBAL_STATE.lifespan = val;
}

// tested
function setWidth(val) {
  ECOLOGIES_GLOBAL_STATE.width = val;
}

// tested
function setGeneration(val) {
  ECOLOGIES_GLOBAL_STATE.generation = val;
}

// tested
function setHeight(val) {
  ECOLOGIES_GLOBAL_STATE.height = val;
}

// tested
function setSignal(id, obj) {
  if (!ECOLOGIES_GLOBAL_SIGNALS.hasOwnProperty(id)){
    ECOLOGIES_GLOBAL_SIGNALS[id] = {};
  }
 Object.keys(obj).forEach(function(key) {
    ECOLOGIES_GLOBAL_SIGNALS[id][key] = obj[key];
  });
}

// tested
function setSignals(newSignals) {
  ECOLOGIES_GLOBAL_SIGNALS = null;
  ECOLOGIES_GLOBAL_SIGNALS = newSignals;
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
  delete ECOLOGIES_GLOBAL_SIGNALS.id;
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
  var c = ECOLOGIES_GLOBAL_CELLS;
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
  return (ECOLOGIES_GLOBAL_SIGNALS.hasOwnProperty(id)) ? ECOLOGIES_GLOBAL_SIGNALS[id] : false;
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
  if  (route == 'off')     return [];
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
function getNote(x, y) {
  // row 1
  if (x == 1 && y == 1) return 48;
  if (x == 2 && y == 1) return 49;
  if (x == 3 && y == 1) return 50;
  if (x == 4 && y == 1) return 51;
  if (x == 5 && y == 1) return 52;
  if (x == 6 && y == 1) return 53;
  // row 2
  if (x == 1 && y == 2) return 54;
  if (x == 2 && y == 2) return 55;
  if (x == 3 && y == 2) return 56;
  if (x == 4 && y == 2) return 57;
  if (x == 5 && y == 2) return 58;
  if (x == 6 && y == 2) return 59;
  // row 3
  if (x == 1 && y == 3) return 60;
  if (x == 2 && y == 3) return 61;
  if (x == 3 && y == 3) return 62;
  if (x == 4 && y == 3) return 63;
  if (x == 5 && y == 3) return 64;
  if (x == 6 && y == 3) return 65;
  // row 4
  if (x == 1 && y == 4) return 66;
  if (x == 2 && y == 4) return 67;
  if (x == 3 && y == 4) return 68;
  if (x == 4 && y == 4) return 69;
  if (x == 5 && y == 4) return 70;
  if (x == 6 && y == 4) return 71;
  // row 5
  if (x == 1 && y == 5) return 72;
  if (x == 2 && y == 5) return 73;
  if (x == 3 && y == 5) return 74;
  if (x == 4 && y == 5) return 75;
  if (x == 5 && y == 5) return 76;
  if (x == 6 && y == 5) return 77;
  // row 6
  if (x == 1 && y == 6) return 78;
  if (x == 2 && y == 6) return 79;
  if (x == 3 && y == 6) return 80;
  if (x == 4 && y == 6) return 81;
  if (x == 5 && y == 6) return 82;
  if (x == 6 && y == 6) return 83;
}

// tested
function isInBounds(x, y) {
  var okWest = (x >= 0);
  var okEast = (x < getWidth());
  var okNorth = (y >= 0);
  var okSouth = (y < getHeight());
  return (okWest && okEast && okNorth && okSouth);
}

/*
 * Lower Level Getters
 * ==============================================================================
 */

// wip
function getCell(id) {
  return (ECOLOGIES_GLOBAL_CELLS.hasOwnProperty(id)) ? ECOLOGIES_GLOBAL_CELLS[id] : false;
}

// tested
function getWidth() {
  return ECOLOGIES_GLOBAL_STATE.width;
}

// tested
function getHeight() {
  return ECOLOGIES_GLOBAL_STATE.height;
}

// tested
function getSignalSpeed() {
  return ECOLOGIES_GLOBAL_STATE.signalSpeed;
}

// tested
function getGeneration() {
  return ECOLOGIES_GLOBAL_STATE.generation;
}

// tested
function getSignals() {
  return ECOLOGIES_GLOBAL_SIGNALS;
}

// tested
function getSelectedCellId() {
  return ECOLOGIES_GLOBAL_STATE.selectedCellId;
}

// tested
function getIsMenuActive() {
  return ECOLOGIES_GLOBAL_STATE.isMenuActive;
}

// tested
function getIsMidiPaletteActive() {
  return ECOLOGIES_GLOBAL_STATE.isMidiPaletteActive;
}

// tested
function isHiveBirthing(hiveInterval) {
  return (getGeneration() % hiveInterval === 0) ? true : false;
}

// tested
function isOutletsOn() {
  return ECOLOGIES_GLOBAL_STATE.outletsOn;
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
  out(JSON.stringify(ECOLOGIES_GLOBAL_STATE));
}

// untested
function dumpCells() {
  out(JSON.stringify(ECOLOGIES_GLOBAL_CELLS));
}

// tested
function dumpStructures() {
  var arr = ECOLOGIES_GLOBAL_STATE.structures;
  arr.unshift('structuresList');
  if (isOutletsOn()) {
    out(arr);
  } else {
    return arr;
  }
}

// tested
function dumpRoutes() {
  var arr = ECOLOGIES_GLOBAL_STATE.routes;
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