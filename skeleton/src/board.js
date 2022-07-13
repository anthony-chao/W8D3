// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let arr = Array.from(Array(8), () => new Array(8));
  return arr;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
  this.grid[3][3] = new Piece("white");
  this.grid[3][4] = new Piece("black");
  this.grid[4][3] = new Piece("black");
  this.grid[4][4] = new Piece("white");
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if (pos[0] < 0 || pos[1] < 0 || pos[0] > 7 || pos[1] > 7) {
    return false;
  }
  return true;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!(this.isValidPos(pos))) {
    throw new Error('Not valid pos!');
  }
return this.grid[pos[0]][pos[1]];
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos);
  if (!piece) {
    return piece;
  }
  return color === piece.color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let piece = this.getPiece(pos);
  return (piece ? true : false);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip = []){
  // Checks for valid postion
  let next_pos = [pos[0] + dir[0], pos[1] + dir[1]];
  if (!this.isValidPos(next_pos)) {
    return [];
  }

  // Checks for if the piece is occupied
  if (!this.isOccupied(next_pos)) {
    return [];
  }
  if (this.getPiece(next_pos).color === color) {
    return piecesToFlip;
  }
  piecesToFlip.push(next_pos);

  return this._positionsToFlip(next_pos, color, dir, piecesToFlip);
  
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }

  let arr = [-1,0,1];
  let dirs = [];
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      if (!(i === 1 && j === 1 )) {
        dirs.push([arr[i],arr[j]])
      }
    }
  }

  for(let i = 0; i < dirs.length; i++) {
    if (this._positionsToFlip(pos, color, dirs[i]).length > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  // if (this.isOccupied(pos)) {
  //   throw new Error('Invalid move!');
  // }

  if (!this.validMove(pos,color)) {
    throw new Error('Invalid move!');
  }
  this.grid[pos[0]][pos[1]] = new Piece(color);
  let arr = [-1,0,1]; // [[0,1],
  let dirs = [];
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      if (!(i === 1 && j === 1 )) {
        dirs.push([arr[i],arr[j]])
      }
    }
  }
  let piecesToFlip = [];
  console.log(`${dirs.length}`)
  for(let i = 0; i < dirs.length; i++) {
    piecesToFlip = piecesToFlip.concat(this._positionsToFlip(pos,color,dirs[i]));
    // console.log(`${this._positionsToFlip(pos,color,dirs[i]).length}`)
  }
  console.log(piecesToFlip)
  for(let i =0; i < piecesToFlip.length; i++) {
    let loc = piecesToFlip[i];
    //debugger
    console.log(`LOC: ${loc}`)
    this.grid[loc[0]][loc[1]].flip();
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let v_moves = [];
  for(let i=0; i< 8; i++){
    for(let j=0; j< 8; j++) {
      if (this.validMove([i,j], color)) {
        v_moves.push([i,j]);
      }
    }
  }

  return v_moves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return (this.validMoves(color).length > 0);
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!this.hasMove("white") && !this.hasMove("black"));
  return false;
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {

  for (let i = 0; i < this.grid.length; i++) {

    let row = [];
    for(j = 0; j < 8; j++) {
      if (this.grid[i][j]) {
        row.push(this.grid[i][j]);
      } else{
        row.push(" ")
      }
    }
    console.log(row.join(" | "))
    console.log("-------------------------------")
  }

};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE


// b = new Board;
// b.placePiece([3,5],"white")