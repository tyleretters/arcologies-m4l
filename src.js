/*
 * SUPPLY CHAIN
 * ====================================================================================
 *
 * By:      Tyler Etters
 * Date:    May, 2020
 * Site:    https://nor.the-rn.info
 * License: Attribution 4.0 International (CC BY 4.0)
 *
 * File Organization:
 *  - Event Handlers
 *  - Draw
 *  - Time & Place
 *  - Initialize Functions
 *  - Max I/O
 *  - Utility
 *
 * Note, I've labeled the functions "tested" or "untested." 
 * Most "untested" ones are difficult to test with my homegrown framework.
 *
 */

/*
 * Event Handlers
 * ====================================================================================
 */

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
          deselectCell();
          closeMenu();
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
          drawMenu(state.selectedCell);
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
  var id = state.selectedCell;
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

  clearField();

  if (state.selectedCell === false) {
    // there is no cell already selected, so this is a fresh press
    selectCell(id);
    cycleThroughFieldRoutes(x, y);
  } else if (state.selectedCell == id) {
    // we're pressing an already selected cell, so cycle through the routes
    cycleThroughFieldRoutes(x, y);
  } else if (state.selectedCell !== id && ids.contains(id)) {
    // we've pressed a different existing cell and want to cycle its routes
    selectCell(id);
    cycleThroughFieldRoutes(x, y);
  } else {
    // we've pressed an empty cell and are ready to do something else
    deselectCell();
  }

  drawHomes();

}

// untested
function cycleThroughFieldRoutes(x, y) {
  
  var cell = getCell(x, y);
  var id = makeId(x, y);

  if (!cell.isExists) {
    // new cells start as a "mine" with "all" routes on
    cell.structure = 'mine';
    cell.routeType = 'all';
    cell.isExists = true;
  } else {
    cell.routeType = cycleRouteTypes(cell.routeType);
  }

  field[id] = cell;

  out(drawRoute(id));

}

// tested
function cycleRouteTypes(routeType) {
  // this pattern is hardcoded for the user's benefit
  // (i don't want errant array sorting changing it)
  if  (routeType === 'all')    return 'random';
  if  (routeType === 'random') return 'walls';
  if  (routeType === 'walls')  return 'ne';
  if  (routeType === 'ne')     return 'se';
  if  (routeType === 'se')     return 'sw';
  if  (routeType === 'sw')     return 'nw';
  if  (routeType === 'nw')     return 'ns';
  if  (routeType === 'ns')     return 'ew';
  if  (routeType === 'ew')     return 'nes';
  if  (routeType === 'nes')    return 'esw';
  if  (routeType === 'esw')    return 'swn';
  if  (routeType === 'swn')    return 'wne';
  if  (routeType === 'wne')    return 'nn';
  if  (routeType === 'nn')     return 'ee';
  if  (routeType === 'ee')     return 'ss';
  if  (routeType === 'ss')     return 'ww';
  if  (routeType === 'ww')     return 'all';
  return 'all';
}

// untested
function doubleFieldEvent(x, y) {

  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);

  clearField();

  if (state.selectedCell === false && ids.contains(id)) {
    // we are selecting an existing cell without cycling it
    selectCell(id);
  } else if (state.selectedCell === false && !ids.contains(id)) {
    // we are double pressing an empty cell with nothing already selected
    // do nothing
  } else if (state.selectedCell === id ) {
    // we're double pressing the current cell
    deselectCell();
  } else {
    // we are moving the cell and either placing it at an empty
    // cell or copying over an existing cell
    moveCell(state.selectedCell, id);
    selectCell(id);
    out(drawRoute(id));
  }

  drawHomes();

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
    // a long press on an empty cell does nothing
  }

}

// untested
function singleMenuEvent(x, y) {
  // note this x, y does not correspond to the field.xNyN values!
  // so we cannot use them to lookup the cells we have to state.selectedCell[id]
  var id = state.selectedCell;
  var cell = field[id];

  // the nw corner is the route symbole &
  // 2,2 lets you change the route:
  if (x === 2 && y === 2) {
    cell.routeType = cycleRouteTypes(cell.routeType);
    field[id] = cell;
    out(drawMenuRoute(id));
  }

  // the ne corner is divided into 3 1x3 row
  // with which you can set the structure:
  if (x === 4 || x === 5 || x === 6) {
    if (y === 1) {
      cell.structure = 'spaceport';
    }
    if (y === 2) {
      cell.structure = 'waystation';
    }
    if (y === 3) {
      cell.structure = 'mine';
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
 * ====================================================================================
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
function drawHomes() {
  
  var arr = ['drawHomes'];
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
function drawHome(id) {
  return ['drawHomes', id]
}

// tested
function drawRoute(id) {
  var cell = field[id];
  return ['drawRoute', cell.routeType, cell.x, cell.y];
}

// untested
function drawMenu(id) {
  out('TESTTTTT');
  out(id);
  out(drawMenuRoute(id));
  out(drawMenuStructure(id));
  out(drawMenuSpeed(field[id].speed));
}

// tested
function drawMenuRoute(id) {
  var cell = field[id];
  return ['drawRoute', cell.routeType, 2, 2];
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
 * ====================================================================================
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
    routeType: 'off',
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
        if (!cell['isExists'] === true) continue;
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
function moveCell(originId, destinationId) {

  // write the destination
  field[destinationId].isExists = true;
  field[destinationId].routeType = field[originId].routeType;
  field[destinationId].structure = field[originId].structure;
  field[destinationId].note = field[originId].note;

  // erase the origin
  field[originId].isExists = false;
  field[originId].routeType = 'off';
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
 * ====================================================================================
 */

var state = field = {};

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
  state.routes = ['all', 'random', 'walls', 'ne', 'se', 'sw', 'nw', 'ns', 'ew', 'nes', 'esw', 'swn', 'wne', 'nn', 'ee', 'ss', 'ww', 'home', 'off'];
  state.structures = ['mine', 'waystation', 'spaceport'];
  state.selectedCell = false;
}

// tested by proxy
function initField() {
  field = null;
  field = makeField();
}

/*
 * I/O
 * ====================================================================================
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
    clearField();
    drawHomes();
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
 * ====================================================================================
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
  state.selectedCell = false;
  out(['selectCell', 0]);
}

// tested
function selectCell(val) {
  state.selectedCell = val;
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
}

// tested
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// untested
function dumpState() {
  out(JSON.stringify(state))
};

// untested
function dumpField() {
  out(JSON.stringify(field))
};

// untested...
function test() {
  out('test function');
}