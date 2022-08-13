/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
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
  }

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  // HS: set the htmlBoard variable to the HTML board DOM node
  const htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // HS: A - find the number of existing rows in each column (6) (6) (6)
  // HS: B - find the number of occupied rows in the column (0) (1) (2)
  // HS: C - find the index of the next available row in the column (0,5) (0,4) (0,3)
  // HS: Solve for C: C = (A - 1) - B
  const numRows = 6;
  let fullRows = 0;

  // this might create problems if the number of row changes. Refactor to use 'y' instead of integers
  let rowArray = [`${5}-${x}`,`${4}-${x}`,`${3}-${x}`,`${2}-${x}`,`${1}-${x}`,`${0}-${x}`,]
  for (let row of rowArray) {
    let subRow = document.getElementById(row).hasChildNodes();
    if (subRow === true) fullRows ++;
  };

  let nextRow = (numRows - 1) - fullRows;
  
  if (nextRow >= 0) {
  return nextRow;
  } else {
    return null;
  }

  // HS: Alternative solution:
  // let counter = 5;
  // let lowCell = document.getElementById(`${counter}-${x}`);
  // while (lowCell.innerHTML != ''){
  //   counter--; 
  //   lowCell = document.getElementById(`${counter}-${x}`);
  // }
  // return counter;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // HS: create a new variable and assign it to whichever cell is clicked
    let cell = document.getElementById(`${y}-${x}`);
      // HS: create a new div and add the piece class and a new class for the current player
      // HS: append the new div to the cell that was clicked
    const newDiv = document.createElement("div");
    newDiv.classList.add("piece");
    newDiv.classList.add('p' + currPlayer);
    cell.append(newDiv);

    // HS: update in-memory board 
    board[y][x] = currPlayer;
}

/** endGame: announce game end */



/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  

  // check for win

  if (checkForWin()) {
    return endGame(`Player ${currPlayer} wins!`);
  } 

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // HS: call the checkForTie function to determine whether the board is full 
  if (checkForTie()) {
    return endGame(`This game is a tie!`);
  } 
  
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  // HS: switch currPlayer between 1 and 2 every time a click event happens
  currPlayer = (currPlayer == 1) ? 2 : 1; 

  // HS: toggle the inner text in the h3 element to show which player's turn it is
  document.querySelector('#turn').innerText = "Player " + currPlayer + "'s Turn"
}



// HS: create a function to check if the board is full (resulting in a tie)
// HS: create a new set to use for verifying whether cells are full or empty (null)
// HS: use a nested for loop to iterate through each cell on the board
// HS: if the cell is null, add null to the set, otherwise add the cell coordinates to the set
// HS: if the set includes null, return false (quick fail), otherwise alert that the board is full
function checkForTie() {
  let fullCells = new Set();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x] == null) {
        fullCells.add(null);
      } else {
        fullCells.add([y,x]);
      }
    }
  }
  if (fullCells.has(null)) {
    return false;
  } else {
    return true;
  }
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

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // HS: this was the original code written.
      // if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
      //   return true;
      // }

      // HS: rewriting this part to implement the change color function 
      let fourInARow = [horiz, vert, diagDR, diagDL];
      for (let item of fourInARow) {
        if (_win(item)) {
          changeColor(item);
          document.querySelector('#turn').innerText = "Player " + currPlayer + " Won!"
          return true;
        }
      }
    }
  }
}

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(function() {alert(msg)},500);
}

// HS: add a function to highlight whichever cells are four in a row when a player wins
function changeColor(input) {
  for (let inny of input) {
    let cell = document.getElementById(`${inny[0]}-${inny[1]}`);
    cell.classList.add("win");
  }
}

// HS: add a button to clear the board and restart the game
function startOver () {
  window.location.reload();
}

makeBoard();
makeHtmlBoard();


