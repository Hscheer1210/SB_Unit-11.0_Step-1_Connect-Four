/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

var WIDTH = 7;
var HEIGHT = 6;

var currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  // HS: Create an array for each row (6 total based on the value of the HEIGHT variable)
  let newRow = [];
  // HS: Use a for loop to iterate through the WIDTH variable and add an empty array to the newRow array with each increment of +1
  for (let i = 0; i < WIDTH; i++) {
    newRow.push(null);
  }
  // HS: Use a for loop to iterate through the HEIGHT variable and add a newRow array to the board array with each increment of +1
  for (let j = 0; j < HEIGHT; j++) {
     board.push([...newRow]);
     }
    // console.log(board);
    //  board[0][0][2] = 5;
    //  console.log(board);
  }

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  // HS: set the htmlBoard variable to the HTML board DOM node
  const htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// HS: A - find the number of existing rows in each column (6) (6) (6)
// HS: B - find the number of occupied rows in the column (0) (1) (2)
// HS: C - find the index of the next available row in the column (0,5) (0,4) (0,3)
// C = (A - 1) - B
// let counter = 5;
function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  const numRows = 6;
  let fullRows = 0;

  // let rowArray = [`${5}-${x}`,`${4}-${x}`,`${3}-${x}`,`${2}-${x}`,`${1}-${x}`,`${0}-${x}`,]

  var lowCell5 = document.getElementById(`${5}-${x}`).hasChildNodes();
  var lowCell4 = document.getElementById(`${4}-${x}`).hasChildNodes();
  var lowCell3 = document.getElementById(`${3}-${x}`).hasChildNodes();
  var lowCell2 = document.getElementById(`${2}-${x}`).hasChildNodes();
  var lowCell1 = document.getElementById(`${1}-${x}`).hasChildNodes();
  var lowCell0 = document.getElementById(`${0}-${x}`).hasChildNodes();

  if (lowCell0 === true) {fullRows ++;}
  if (lowCell1 === true) {fullRows ++;}
  if (lowCell2 === true) {fullRows ++;}
  if (lowCell3 === true) {fullRows ++;}
  if (lowCell4 === true) {fullRows ++;}
  if (lowCell5 === true) {fullRows ++;}

  let nextRow = (numRows - 1) - fullRows;

  return nextRow;
  // if (lowCell.hasChildNodes()) {
  //   //console.log("Hi");
  //   return counter;
  // } else {
  //   counter --;
  // }
  // //console.log(counter);
  // return counter;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // HS: create a new variable and assign it to whichever cell is clicked
  
  var cell = document.getElementById(`${y}-${x}`);
  // console.log(cell);
  // HS: create a new div and add the piece class and a new class for the current player
  // HS: append the new div to the cell that was clicked
  const newDiv = document.createElement("div");
  newDiv.classList.add("piece");
  newDiv.classList.add('p' + currPlayer);
  cell.append(newDiv);
  //console.log(x,y);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  //console.log(y);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // HS: switch currPlayer between 1 and 2 every time a click event happens
  currPlayer == 1 ? currPlayer = 2 : currPlayer = 1;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  // TODO: switch currPlayer 1 <-> 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
