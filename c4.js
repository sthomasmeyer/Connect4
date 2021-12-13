/** connect4
 * p1 and p2 alternate turns -- each turn, a piece is dropped down a column...
 * until a player gets four-in-a-row (horiz, vert, or diag) or until...
 * the board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

// declare variable to track the active player: 1 or 2
let activePlayer = 1;
activePlayerDisplay = document.createElement('p')
activePlayerDisplay.innerText = `It is Player ${activePlayer}'s turn.`
document.querySelector('h1').appendChild(activePlayerDisplay);

let board = []; // array of rows, each row is array of cells (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells (board[y][x])
 */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++){
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // declare variable as HTML <table> w/ [id] of "board"
  const board = document.getElementById('board');
  // declare a variable [top] that creates a <tr> element...
  // give the created element an [id] of "column-top"...
  // add a click handler, so that users can click these [top] elements
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  // use a [for] loop to run the 7-unit width of the gameboard...
  for (let x = 0; x < WIDTH; x++) {
    // declare a [headCell] variable that creates a <td> element...
    // give the created element an [id] of "x"...
    // append this <td> element to the [top] <tr> element that we've already created
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  // append this [top] row -- which is a <tr> element w/ the [id] of "column-top"...
  // as well as the seven <td> elements w/ [id]s ranging from zero - six...
  // to the htmlBoard -- which is a <table> element that exists in our HTML doc
  board.append(top);

  // use a [for] loop to run the 6-unit height of the gameboard
  for (let y = 0; y < HEIGHT; y++) {
    // declare a [row] variable that creates a <tr> element
    const row = document.createElement('tr');
    // use a [for] loop to cycle through the 7-unit width of the gameboard...
    // this loop within a loop is clever + important because...
    // it can (and will) be used to create elements across the width of the gameboard...
    // each time the outer [for] loop cycles to a new HEIGHT position
    for (let x = 0; x < WIDTH; x++) {
      // declare a [cell] variable that creates a <td> element...
      // give this created element an [id] of [y], which will be zero - five...
      // and [x], which will be zero - six... 
      // append each [cell] <td> element to the [row] <tr> element... 
      // that we create each time we cycle through the outer [for] loop
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      cell.setAttribute('class', 'board-piece');
      row.append(cell);
    }
    // append each [row] <tr> element + its associated <td> elements...
    // to the htmlBoard -- which is a <table> element that exists in our HTML doc
    board.append(row);
  }
}

// create a [reset] button that will allow users to restart the game
let resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', function(e){
  location.reload();
});

// [findSpotForCol]: given column x, return top empty y (null if filled)
function findSpotForCol(x) {
  // use a [for] loop that cycles from the bottom to the top of each selected column
  for (let y = (HEIGHT - 1); y >= 0; y--){
    // if the [innerHTML] of the element at position (x, y) does NOT include 'class'...
    // then return the [y] value of that element...
    // this works because only filled (or taken) elements have been assigned a class
    if (document.getElementById(`${y}-${x}`).innerHTML.includes('class') === false){
      return y;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  let newDiv = document.createElement('div')
  newDiv.setAttribute('class', 'piece');
  newDiv.classList.add(`p${activePlayer}`);
  document.getElementById(`${y}-${x}`).append(newDiv);
}

// write an [endGame] function that alerts users when the game is over
function endGame(msg) {
  alert(msg);
}

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = activePlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    document.getElementById('column-top').setAttribute('class', 'disable-click');
    setTimeout(function(){
      endGame(`Player ${activePlayer} wins!`);
      document.querySelector('p').remove();
    }, 3);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))){
    document.getElementById('column-top').setAttribute('class', 'disable-click');
    setTimeout(function(){
      endGame(`TIE -- GAME OVER`);
      document.querySelector('p').remove();
    }, 3);
  }

  // switch players
  setTimeout(function(){
    activePlayer = activePlayer === 1 ? 2 : 1;
    activePlayerDisplay.innerText = `It is Player ${activePlayer}'s turn.`
  }, 4);
}

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match activePlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === activePlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();