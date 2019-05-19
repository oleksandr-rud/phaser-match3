import {BOARD_ROWS, BOARD_COLUMNS, MIN_MATCHES} from './Constants.js';

export default class Matches {
  constructor(state) {
    this.state = state;
    this.board = state.board;
  }

  checkAt(row, column) {
    return this.checkHorizontal(row, column) || this.checkVertical(row, column);
  }

  checkHorizontal(row, column) {
    return this.board.getType(row, column) === this.board.getType(row, column - 1) && this.board.getType(row, column) === this.board.getType(row, column - 2) ||
            this.board.getType(row, column) === this.board.getType(row, column + 1) && this.board.getType(row, column) === this.board.getType(row, column + 2) ||
            this.board.getType(row, column) === this.board.getType(row, column - 1) && this.board.getType(row, column) === this.board.getType(row, column + 1);
  }

  checkVertical(row, column) {
    return this.board.getType(row, column) === this.board.getType(row - 1, column) && this.board.getType(row, column) === this.board.getType(row - 2, column) ||
            this.board.getType(row, column) === this.board.getType(row + 1, column) && this.board.getType(row, column) === this.board.getType(row + 2, column) ||
            this.board.getType(row, column) === this.board.getType(row - 1, column) && this.board.getType(row, column) === this.board.getType(row + 1, column);
  }

  check() {
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        if (this.checkAt(i, j)) {
          return true;
        }
      }
    }

    return false;
  }

  getAll() {
    const matches = [];

    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        if (this.checkAt(i, j)) {
          matches.push({
            row: i,
            column: j,
          });
        }
      }
    }

    return matches;
  }

  handleAll() {
    const list = this.getAll();
    const matches = [];

    let items = [];
    let type = 0;
    let streak = 0;

    list.forEach((pos, i) => {
      if (type == this.board.getType(pos.row, pos.column)) {
        streak++;
        items.push(pos);
      }

      if (type == 0) {
        type = this.board.getType(pos.row, pos.column);
        streak = 1;
        items.push(pos);
      }

      if (type > 0 && type != this.board.getType(pos.row, pos.column) && streak >= MIN_MATCHES) {
        matches.push({streak, items, type});
        items = [];
        streak = 1;
        type = this.board.getType(pos.row, pos.column);

        items.push(pos);
      }

      if (list.length - 1 == i && streak >= MIN_MATCHES) {
        matches.push({streak, items, type: this.board.getType(pos.row, pos.column)});
      }
    }, this);

    return matches;
  }
  destroy() {
    let matches = this.handleAll();
    let score = 0;
    let toRemove = [];
    let comboMultiplier = 1;

    matches.forEach((match, i) => {
      if (matches.length - 1 >= i) {
        comboMultiplier += 1;
      }
      i--;

      match.items.forEach((pos) => {
        if (match.streak > MIN_MATCHES) {
          comboMultiplier += 2;
        }
        score += 10*comboMultiplier;
        match.streak--;
        toRemove.push(pos);
      });
    });
    
    this.state.updateScore(score);
    
    toRemove.forEach((itemPos) => {
      const item = this.state.items.getItem(itemPos.row, itemPos.column);

      this.board.setType(itemPos.row, itemPos.column, 0);
      item.kill();
    });
  }
}
