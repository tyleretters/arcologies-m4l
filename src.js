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
 */

/*
 * Event Handlers
 * ====================================================================================
 */

function gridEvent(press, x, y) {
  if (x > state.x) return;
  if (y > state.y) return;
  if (state.menuActive) {
    // menu things
  } else {
    switch(press) {
      case 'single':
        singleFieldEvent(x, y, 'drawCell');
        break;
      case 'double':
        doubleFieldEvent(x, y);
        break;
      case 'long':
        out('long event detected');
        longFieldEvent(x, y);
        break;
      default:
        return;
    }
  }
}

function singleFieldEvent(x, y, callback) {
  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);
  if (state.selectedCell === false) {
    // this is a fresh press
    state.selectedCell = id;
    cycleThroughRoutes(x, y, callback);
  } else if (state.selectedCell == id) {
    // we're cycling through the selected cell
    cycleThroughRoutes(x, y, callback);
  } else if (ids.contains(id)) {
    // we've pressed an existing cell and want to cycle it
    state.selectedCell = id;
    clearField();
    drawHomes().forEach(function(el) {
      out(el);
    });
    cycleThroughRoutes(x, y, callback);
  } else {
    // we've pressed an empty cell and are ready to do something else
    state.selectedCell = false;
    clearField();
    drawHomes().forEach(function(el) {
      out(el);
    });
  }
}

function cycleThroughRoutes(x, y, callback) {
  
  var cell = getCell(x, y);
  var id = makeId(x, y);

  if (!cell.isExists) {
      cell.structure = 'mine';
      cell.routeType = 'all';
      cell.isExists = true;
  } else {
    var rt = cell.routeType;
    if  (rt === 'all')   { cell.routeType = 'random'; }
      else if  (rt === 'random')  { cell.routeType = 'walls'; }
      else if  (rt === 'walls') { cell.routeType = 'ne'; }
      else if  (rt === 'ne')    { cell.routeType = 'se'; }
      else if  (rt === 'se')    { cell.routeType = 'sw'; }
      else if  (rt === 'sw')    { cell.routeType = 'nw'; }
      else if  (rt === 'nw')    { cell.routeType = 'ns'; }
      else if  (rt === 'ns')    { cell.routeType = 'ew'; }
      else if  (rt === 'ew')    { cell.routeType = 'nes'; }
      else if  (rt === 'nes')   { cell.routeType = 'esw'; }
      else if  (rt === 'esw')   { cell.routeType = 'swn'; }
      else if  (rt === 'swn')   { cell.routeType = 'wne'; }
      else if  (rt === 'wne')   { cell.routeType = 'nn'; }
      else if  (rt === 'nn')    { cell.routeType = 'ee'; }
      else if  (rt === 'ee')    { cell.routeType = 'ss'; }
      else if  (rt === 'ss')    { cell.routeType = 'ww'; }
      else if  (rt === 'ww')    { cell.routeType = 'all'; }
      else                      { cell.routeType = 'all'; }
    }
  
  field[id] = cell;

  if (callback === 'drawCell') {
    out(drawRoute(id));
  }
}

function doubleFieldEvent(x, y) {
  out('double' + x + y);
}

function longFieldEvent(x, y) {
  var id = makeId(x, y);
  var existingCells = getExistingCells();
  var ids = getIds(existingCells);
  if (ids.contains(id)) {
    // activate menu for this cell
    state.selectedCell = id;
    state.menuActive = true;
    openGridMenu();
  } else {
    // a long press on an empty cell does nothing
  }
}

/*
 * Draw
 * ====================================================================================
 */

function clearField() {
  out('clearField');
}

// tested
function drawHomes() {
  var out = [];
  var cells = getExistingCells();
  for (var key in cells) {
      if (!cells.hasOwnProperty(key)) continue;
      var obj = cells[key];
      out.push(['drawRoute', 'home', obj.x, obj.y]);
  }
  return out;
}


// tested
function drawRoute(id) {
  var cell = field[id];
  return ['drawRoute', cell.routeType, cell.x, cell.y];
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
      var cell = {
        id: makeId(ix, iy),
        isExists: false,
        x: ix,
        y: iy,
        routeType: 'off',
        structure: 'none',
        note: 60,
      };
      out[cellId] = cell;
    }
  }
  return out;
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

/*
 * Initialize
 * ====================================================================================
 */

var state = field = {};

// tested by proxy
function init() {
  state.outletsOn = false;
  state.lifespan = 0;
  state.time = 0;
  state.width = 0;
  state.height = 0;
  state.menuActive = 0;
  state.routes = ['all', 'random', 'walls', 'ne', 'se', 'sw', 'nw', 'ns', 'ew', 'nes', 'esw', 'swn', 'wne', 'nn', 'ee', 'ss', 'ww', 'home', 'off'];
  state.structures = ['mine', 'waystation', 'spaceport'];
  state.selectedCell = false;
}

// tested by proxy
function initField() {
  field = makeField();
}

/*
 * I/O
 * ====================================================================================
 */

var inlets = 1;
var outlets = 1;

// tested
function openGridMenu() {
  var msg = 'openGridMenu';
  if (state.outletsOn) {
    out(msg);
  } else {
    return msg;
  }
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
function addStructure(key, val) {
  state.structures[key] = val;
}

// tested
function addRoute(key, val) {
  state.routes[key] = val;
}

// tested
function setMenu(val) {
  state.menuActive = val;
  if (val === 1) {

  } else {
    drawHomes().forEach(function(el) {
      out(el);
    }); 
  }
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

// to test
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function dumpState() {
  out(JSON.stringify(state))
};

function dumpField() {
  out(JSON.stringify(field))
};

function test() {
  out('test function');
}