import {BOARD_ROWS, BOARD_COLUMNS, DROP_SPEED, ITEM_SIZE, SUGGESTION_SPEED, ITEM_SCALE, HAND_OFFSET, BOARD_CELL_SIZE} from './Constants.js';
import Item from './Item.js';

export default class Items {
  constructor(state) {
    this.state = state;
    this.game = state.game;

    this.animations = state.animations;
    this.board = state.board;
    this.matches = state.matches;

    this.group = state.game.add.group();
    this.itemsArray = [];

    this.selected = null;
  }

  init() {
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        const type = this.board.getType(i, j);
        const pos = this.board.getPos(i, j);

        pos.row = i;
        pos.column = j;

        this.add(pos, type);
      }
    }

    this.game.world.bringToTop(this.group);
  }

  add(pos, type) {
    if (pos.x == 0 && pos.y == 0) {

      const itemPos = this.board.getPos(pos.row, pos.column);

      pos.x = itemPos.x;
      pos.y = itemPos.y;
    }

    if (!type) {
      type = this.board.getType(pos.row, pos.column);
    }

    const item = new Item(this.state, pos, type);

    this.itemsArray.push(item);

    return item;
  }

  getItem(row, column) {
    let result;

    this.itemsArray.forEach((item) => {
      if (item.row === row && item.column === column) {
        result = item;
      }
    });

    return result;
  }

  swap(source, target) {
    const sourcePos = this.board.getPos(source.row, source.column);
    const targetPos = this.board.getPos(target.row, target.column);
    const sourceTween = this.animations.swap(source, targetPos);

    this.state.isBoardBlocked = true;
    sourceTween.onComplete.add(() => {
      this.board.swap(source, target);
      if (!this.isReversingSwap) {
        if (this.matches.check()) {
          this.update();
        } else {
          this.isReversingSwap = true;
          this.swap(source, target);
        }
      } else {
        this.isReversingSwap = false;
        this.deselect();
      }
    });
    this.animations.swap(target, sourcePos);
  }

  drop(sourceRow, targetRow, column) {
    const item = this.getItem(sourceRow, column);
    const targetPosY = this.board.getPos(targetRow, column).y;

    item.row = targetRow;
    
    this.animations.drop(item, targetPosY);
  }

  dropReserved(sourceRow, targetRow, column) {
    const targetPos = this.board.getPos(targetRow, column);
    const targetType = this.board.getType(targetRow, column);
    const sourcePosY = -(ITEM_SIZE * BOARD_ROWS) + sourceRow * ITEM_SIZE;

    const item = this.add({
      x: targetPos.x,
      y: sourcePosY,
      row: targetRow,
      column,
    }, targetType);

    this.animations.drop(item, targetPos.y);
  }

  suggestion() {
    let matchFound = false;

    this.hand = this.state.add.sprite(0, 0, 'hand');
    this.hand.scale.setTo(ITEM_SCALE);
    this.hand.anchor.setTo(0.5);
    this.hand.visible = false;

    for (let i = 0; i < BOARD_ROWS -1 ; i++) {
      for (let j = 0; j < BOARD_COLUMNS - 1; j++) {
        const sourcePos = {row: i, column: j};
        let targetPos = {row: i + 1, column: j};

        this.board.swap(sourcePos, targetPos);

        if (this.matches.checkAt(targetPos.row, targetPos.column)) {
          // let item = this.getItem(targetPos.row, targetPos.column);
          const pos = this.board.getPos(targetPos.row, targetPos.column);

          this.hand.visible = true;
          this.hand.x = pos.x + HAND_OFFSET.x;
          this.hand.y = pos.y + HAND_OFFSET.y;

          this.game.world.bringToTop(this.hand);

          this.handTween = this.game.add.tween(this.hand).to({
            y: this.hand.y + BOARD_CELL_SIZE,
          }, SUGGESTION_SPEED, Phaser.Easing.Linear.None, true, 0, -1, true);

          matchFound = true;
        }

        this.board.swap(sourcePos, targetPos);

        if (matchFound) {
          return;
        }

        targetPos = {row: i, column: j + 1};

        this.board.swap(sourcePos, targetPos);

        if (this.matches.checkAt(targetPos.row, targetPos.column)) {
          const pos = this.board.getPos(targetPos.row, targetPos.column);

          this.hand.visible = true;
          this.hand.x = pos.x + HAND_OFFSET.x;
          this.hand.y = pos.y + HAND_OFFSET.y;

          this.game.world.bringToTop(this.hand);

          this.handTween = this.game.add.tween(this.hand).to({
            x: this.hand.x + BOARD_CELL_SIZE,
          }, SUGGESTION_SPEED, Phaser.Easing.Linear.None, true, 0, -1, true);

          matchFound = true;
        }

        this.board.swap(sourcePos, targetPos);

        if (matchFound) {
          return;
        }
      }
    }
  }

  deselect() {
    this.state.isBoardBlocked = false;

    this.selected = null;

    this.group.setAll('scale.x', ITEM_SCALE);
    this.group.setAll('scale.y', ITEM_SCALE);
  }

  update() {
    this.state.isBoardBlocked = true;
    this.matches.destroy();
    this.board.update();

    this.game.time.events.add(DROP_SPEED, () => {
      if (this.matches.check()) {
        this.update();
      } else {
        this.deselect();
      }
    }, this);
  }

  remove(row, column) {
    this.getItem(row, column);
  }
}