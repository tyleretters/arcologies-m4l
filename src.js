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
 *  - Event Handlers
 *  - Draw
 *  - Time & Place
 *  - Initialize Functions
 *  - Max I/O
 *  - Utility
 *
 * Notes:
 *  - Function "//tested" and "//untested" comments refers to test coverage in tests.js.
 *
 */

/*
 * Event Handlers
 * ==============================================================================
 */

// wip
function advance() {
  clearField();
  drawSignals();
  drawCells();
}

// wip
function drawSignals() {
  // todo
}


// tested
function drawChannels(id) {

  cell = field[id];
  
  if (cell.route == 'off') return;
  if (cell.route == 'walls') return;

  var channels = [];
  channels = channels.concat(prepareCellChannels(cell.id));
  
  if (state.outletsOn) {
    channels.forEach(function(channel){
      out(channel);
    });
  } else {
      return channels;
  }

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
 // console.log(ys);

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
      neighbor = state.height - 1; // account for zero index on grid
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
      neighbor = state.width - 1; // account for zero index on grid
    }
  }

  var neighborId = 'x' + neighbor + 'y' + currentCell.y;
  return { 'id': neighborId, 'x' : neighbor, 'y' : currentCell.y };
}

// tested
function prepareCellChannels(cellId) {

  var currentCell = field[cellId];
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
function gridEvent(press, x, y) {
  if (x > state.x) return;
  if (y > state.y) return;
  if (state.isMenuActive) {
    menuEvent(press, x, y);
  } else {
    fieldEvent(press, x, y);
  }
}

// untested
function menuEvent(press, x, y) {
  if (!state.isMidiPaletteActive) {
    switch(press) {
      case 'single':
        // the menu is always [x1y1, x6y6] on any sized grid
        // and pressing anywhere outside this square closes it
        if (x > 0 && x < 7 && y > 0 && y < 7) {
          singleMenuEvent(x, y);
        } else {
          closeMenu();
          clearField();
          drawChannels(state.selectedCellId);
          out(drawRoute(state.selectedCellId));
          drawCells();
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
  if (state.isMidiPaletteActive) {
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
          drawMenu(state.selectedCellId);
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
}

// tested
function singleMidiPaletteEvent(x, y) {
  // all midi palette events do the same thing - set the note
  // 6x6 = 36 = 3 octaves = C3, C4, C5
  var note = getNote(x, y);
  var id = state.selectedCellId;
  field[id].note = note;
  var arr = ['animateMidiNotePress', x, y];
  if (state.outletsOn) {
    out(arr);
  } else {
    return arr;
  }
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

  if (!ids.contains(id)) {
    // this sell doesn't exist so create it
    selectCell(id);
    clearField();
    cycleThroughFieldRoutes(x, y);    
    drawCells();
  } else if (state.selectedCellId == id) {
    // we're pressing the already selected cell, so cycle through the routes
    clearField();
    cycleThroughFieldRoutes(x, y);
    drawCells();
  } else if (state.selectedCellId !== id && ids.contains(id)) {
    // we've pressed a different existing cell and want to select it
    selectCell(id);
    clearField();
    drawChannels(id);
    out(drawRoute(id));
    drawCells();
  } else {
    // we've pressed an empty cell and are ready to do something else
    deselectCell();
  }
}

// untested
function cycleThroughFieldRoutes(x, y) {
  
  var cell = getCell(x, y);
  var id = makeId(x, y);

  if (!cell.isExists) {
    // new cells start as a "giver" with "all" routes on
    cell.structure = 'giver';
    cell.route = 'all';
    cell.isExists = true;
  } else {
    cell.route = cycleRoutes(cell.route);
  }

  field[id] = cell;

  drawChannels(id); // eh?
  out(drawRoute(id));

}

// tested
function cycleRoutes(route) {
  // this pattern is hardcoded for the user's benefit
  // (i don't want errant array sorting changing it)
  if  (route === 'all')    return 'random';
  if  (route === 'random') return 'walls';
  if  (route === 'walls')  return 'ne';
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
  if  (route === 'ww')     return 'all';
  return 'all';
}

// untested
function doubleFieldEvent(x, y) {

  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);

  clearField();

  if (state.selectedCellId === false && ids.contains(id)) {
    // we are selecting an existing cell without cycling it
    selectCell(id);
  } else if (state.selectedCellId === false && !ids.contains(id)) {
    // we are double pressing an empty cell with nothing already selected
    // do nothing
  } else if (state.selectedCellId === id ) {
    // we're double pressing the current cell
    deselectCell();
  } else {
    // we are moving the cell and either placing it at an empty
    // cell or copying over an existing cell
    moveCell(state.selectedCellId, id);
    selectCell(id);
    out(drawRoute(id));
  }

  drawCells();

}

// untested
function longFieldEvent(x, y) {

  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);

  if (ids.contains(id)) {
    // activate menu for this cell
    selectCell(id);
    clearField();
    openMenu();
    drawMenu(id);
  } else {
    if (state.selectedCellId) {
      deselectCell();
      clearField();
      drawCells();
    } else {
      // reserved for global menu
    }
  }

}

// untested
function singleMenuEvent(x, y) {
  // note this x, y does not correspond to the field.xNyN values!
  // so we cannot use them to lookup the cells we have to state.selectedCellId[id]
  var id = state.selectedCellId;
  var cell = field[id];

  // the nw corner is the route symbole &
  // 2,2 lets you change the route:
  if (x === 2 && y === 2) {
    cell.route = cycleRoutes(cell.route);
    field[id] = cell;
    out(drawMenuRoute(id));
  }

  // the ne corner is divided into 3 1x3 row
  // with which you can set the structure:
  if (x === 4 || x === 5 || x === 6) {
    if (y === 1) {
      cell.structure = 'taker';
    }
    if (y === 2) {
      cell.structure = 'mover';
    }
    if (y === 3) {
      cell.structure = 'giver';
    }
    field[id] = cell;
    out(drawMenuStructure(id));
  }

  // row 4 toggles the midi palette
  if (y === 4) {
    out('animateMidiPalettePress');
    openMidiPalette();
  }

  // row 5 sets the speed
  if (y === 5) {
    // we know x can only be 1-6 due to previous validation
    field[id].speed = x;
    out(drawMenuSpeed(x));
  }

  // row 6 is delete:
   if (y === 6) {
      deleteCell(id);
      out('deleteCell');
      // closeMenu() is then called from Max once the animation is complete
  } 

}

/*
 * Draw
 * ==============================================================================
 */

// tested
function clearField() {

  var msg = 'clearField';

  if (state.outletsOn) {
    out(msg);
  } else {
    return msg;
  }

}

// tested
function drawCells() {
  
  var arr = ['drawCells'];
  var cells = getExistingCells();
  
  if (Object.size(cells) > 0) {
    for (var key in cells) {
        if (!cells.hasOwnProperty(key)) continue;
        arr.push(cells[key].id);
    }
    if (state.outletsOn) {
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
  var cell = field[id];
  return ['drawRoute', cell.route, cell.x, cell.y];
}

// untested
function drawMenu(id) {
  out(drawMenuRoute(id));
  out(drawMenuStructure(id));
  out(drawMenuSpeed(field[id].speed));
}

// tested
function drawMenuRoute(id) {
  var cell = field[id];
  return ['drawRoute', cell.route, 2, 2];
}

// tested
function drawMenuStructure(id) {
  var cell = field[id];
  return ['drawStructure', cell.structure];
}

// tested
function drawMenuSpeed(x) {
  return ['drawMenuSpeed', x];
}

/*
 * Time & Place
 * ==============================================================================
 */

// tested
function makeField() {
  x = state.width;
  y = state.height;
  var out = {};
  for (var iy = y - 1; iy >= 0; iy--) {
    for (var ix = x - 1; ix >= 0; ix--) {
      var cellId = 'x' + ix + 'y' + iy;
      var cell = initCell(ix, iy);
      out[cellId] = cell;
    }
  }
  return out;
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
    speed: 1
  };
}

// tested
function initCellById(id) {
  var splitX = id.split('x');
  var arr = splitX[1].split('y');
  return initCell(arr[0], arr[1]);
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
      cell = obj[key];
      arr.push(cell.id);
    }
  }
  return arr;
} 

// tested
function getRouteDirections(route) {
  if  (route == 'all')    return ['n', 'e', 's', 'w'];
  if  (route == 'random') return ['n', 'e', 's', 'w'];
  if  (route == 'walls')  return [];
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
  if  (route == 'off')     return [];
  return  [];
}

// tested
function moveCell(originId, destinationId) {

  // write the destination
  field[destinationId].isExists = true;
  field[destinationId].route = field[originId].route;
  field[destinationId].structure = field[originId].structure;
  field[destinationId].note = field[originId].note;

  // erase the origin
  field[originId].isExists = false;
  field[originId].route = 'off';
  field[originId].structure = 'none';
  field[originId].note = 60;

}

// tested
function deleteCell(id) {
  deselectCell();
  field[id] = initCellById(id);
}

/*
 * Initialize
 * ==============================================================================
 */

var state = {};
var field = {};

// tested by proxy
function init() {
  state = null;
  state = {};
  state.outletsOn = false;
  state.lifespan = 0;
  state.time = 0;
  state.width = 0;
  state.height = 0;
  state.isMenuActive = false;
  state.isMidiPaletteActive = false;
  state.routes = [
    'all', 'random', 'walls', 'ne', 'se', 'sw', 'nw', 'ns', 'ew', 
    'nes', 'esw', 'swn', 'wne', 'nn', 'ee', 'ss', 'ww', 'home', 'off'
  ];
  state.structures = ['giver', 'mover', 'taker'];
  state.selectedCellId = false;
}

// tested by proxy
function initField() {
  field = null;
  field = makeField();
}

/*
 * I/O
 * ==============================================================================
 */

var inlets = 1;
var outlets = 1;

// tested
function openMenu() {
  setMenu(true);
  var msg = 'openMenu';
  if (state.outletsOn) {
    out(msg);
  } else {
    return msg;
  }
}

// tested
function closeMenu() {
  setMenu(false);
  var msg = 'closeMenu';
  if (state.outletsOn) {
    out(msg);
  } else {
    return msg;
  }
}

// tested
function openMidiPalette() {
  setMidiPalette(true);
  msg = 'drawMidiPalette';
  if (state.outletsOn) {
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
function dumpStructures() {
  var arr = state.structures;
  arr.unshift('structuresList');
  if (state.outletsOn) {
    out(arr);
  } else {
    return arr;
  }
}

// tested
function dumpRoutes() {
  var arr = state.routes;
  arr.unshift('routesList');
  if (state.outletsOn) {
    out(arr);
  } else {
    return arr;
  }
}

// untested
function dumpExistingCells() {
  var obj = getExistingCells();
  if (state.outletsOn) {
    out(JSON.stringify(obj));
  } else {
    return obj;
  }
}

// tested
function outletsOn() {
  state.outletsOn = true;
}

// tested
function outletsOff() {
  state.outletsOn = false;
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
 * ==============================================================================
 */

// tested
function setMenu(val) {
  state.isMenuActive = val;
}

// tested
function setMidiPalette(val) {
  state.isMidiPaletteActive = val;
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

// tested
function deselectCell() {
  state.selectedCellId = false;
  out('deselectCell');
}

// tested
function selectCell(val) {
  state.selectedCellId = val;
  out(['selectCell', val]);
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

// untested
function dumpState() {
  out(JSON.stringify(state));
}

// untested
function dumpField() {
  out(JSON.stringify(field));
}

// untested...
function test() {
  out('test function');
}