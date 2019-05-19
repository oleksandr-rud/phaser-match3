import {BOARD_ROWS, BOARD_COLUMNS, BOARD_CELL_SIZE, ITEM_TYPES, ITEM_SIZE} from './Constants.js';

export default class Board {
  constructor(state) {
    this.state = state;

    this.offset = {
      x: state.world.centerX - ((0.9 * ITEM_SIZE * BOARD_COLUMNS) / 2),
      y: state.world.centerY - (0.9 * (ITEM_SIZE * BOARD_ROWS) / 2),
    };

    this.grid = [];
    this.reserved = [];

    for (let i = 0; i < BOARD_ROWS; i++) {
      this.grid[i] = [];

      for (let j = 0; j < BOARD_COLUMNS; j++) {
        this.grid[i][j] = 0;
      }
    }

    for (let i = 0; i < BOARD_ROWS; i++) {
      this.reserved[i] = [];

      for (let j = 0; j < BOARD_COLUMNS; j++) {
        this.reserved[i][j] = 0;
      }
    }
  }

  init() {
    this.populate();
    this.populateReserved();
  }

  // re-populate grid with random values
  populate() {
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        this.grid[i][j] = this.randomType();

        do {
          this.grid[i][j] = this.randomType();
        } while (this.state.matches.checkAt(i, j));
      }
    }
  }

  // re-populate reserved with random values
  populateReserved() {
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        this.reserved[i][j] = this.randomType();
      }
    }
  }

  checkAdjacent(source, target) {
    const deltaRow = Math.abs(source.row - target.row);
    const deltaColumn = Math.abs(source.column - target.column);

    if (this.isValid(source.row, source.column) && this.isValid(target.row, target.column)) {

    }

    return (deltaRow == 1 && deltaColumn === 0) || (deltaRow == 0 && deltaColumn === 1);
  }

  swap(source, target) {
    const tempType = this.getType(target.row, target.column);
    const tempPos = {
      row: target.row,
      column: target.column,
    };

    this.grid[target.row][target.column] = this.getType(source.row, source.column);
    target.row = source.row;
    target.column = source.column;

    this.grid[source.row][source.column] = tempType;
    source.row = tempPos.row;
    source.column = tempPos.column;
  }

  tempSwap(source, target) {
      const tempType = this.getType(target.row, target.column);

      this.grid[target.row][target.column] = this.getType(source.row, source.column);
      this.grid[source.row][source.column] = tempType;
  }

  drop(sourceRow, targetRow, column) {
    this.grid[targetRow][column] = this.grid[sourceRow][column];
    this.grid[sourceRow][column] = 0;

    this.state.items.drop(sourceRow, targetRow, column);
  }

  dropReserved(sourceRow, targetRow, column) {
    this.grid[targetRow][column] = this.reserved[sourceRow][column];
    this.reserved[sourceRow][column] = 0;

    this.state.items.dropReserved(sourceRow, targetRow, column);
  }

  update() {
    let founded;

    // go through all the rows, from the bottom up
    for (let i = BOARD_ROWS - 1; i >= 0; i--) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {

        // if the block if zero, then get climb up to get a non-zero one
        if (this.grid[i][j] === 0) {
          founded = false;

          // climb up in the main grid
          for (let k = i - 1; k >= 0; k--) {
            if (this.grid[k][j] > 0) {
              this.drop(k, i, j);
              founded = true;
              break;
            }
          }

          if (!founded) {
            // climb up in the reserve grid
            for (let k = BOARD_ROWS - 1; k >= 0; k--) {
              if (this.reserved[k][j] > 0) {
                this.dropReserved(k, i, j);
                break;
              }
            }
          }
        }
      }
    }

    this.populateReserved();
  }

  getType(row, column) {
    if (!this.isValid(row, column)) {
      return false;
    }

    return this.grid[row][column];
  }

  setType(row, column, type) {
    if (!this.isValid(row, column)) {
      return false;
    }

    if (type < 0 || type > ITEM_TYPES) {
      return false;
    }

    this.grid[row][column] = type;
  }

  getGridPos(x, y) {
    return {
      row: Math.floor((y - this.offset.y + ITEM_SIZE / 2) / BOARD_CELL_SIZE),
      column: Math.floor((x - this.offset.x + ITEM_SIZE / 2) / BOARD_CELL_SIZE),
    };
  }

  getPos(row, column) {
    return {
      x: this.offset.x + BOARD_CELL_SIZE * column,
      y: this.offset.y + BOARD_CELL_SIZE * row,
    };
  }

  isValid(row, column) {
    return row >= 0 && row < BOARD_ROWS && column >= 0 && column < BOARD_COLUMNS && this.grid[row] != undefined && this.grid[row][column] != undefined;
  }

  randomType() {
    const result = Math.floor(Math.random() * ITEM_TYPES);

    return (result >= 0 && result < 1) ? 1 : result;
  }
}
