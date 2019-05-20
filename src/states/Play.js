/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-invalid-this */

import {ITEM_SIZE} from '../prefabs/Constants.js';
import Animations from '../prefabs/Animations.js';
import Board from '../prefabs/Board.js';
import Matches from '../prefabs/Matches.js';
import Items from '../prefabs/Items.js';

export default class Play extends Phaser.State {
  init() {
    this.isPaused = false;
    this.timeLeft = 60000;
    this.score = 0;
  }

  create() {
    this.backgroundImage = this.add.sprite(0, 0, 'bg-image');
    
    // create background for counter scores
    const scoreBoard = this.add.sprite(0, 0, 'score-bg');
    scoreBoard.anchor.setTo(0.5);
    scoreBoard.scale.setTo(0.6);
    scoreBoard.alignIn(this.world.bounds, Phaser.TOP_CENTER, 0, -40);
    
    // create counter of scores
    this.scoreText = this.add.text(0, 0, this.score, {
      font: '60px Fredoka One',
      align: 'center',
    });
    this.scoreText.anchor.setTo(0.5);
    scoreBoard.addChild(this.scoreText);
    this.scoreText.y -= 15;
    
    // create timer
    this.timeText = this.add.text(0, 0, Math.floor(this.timeLeft / 1000) + 's', {font: '45px Fredoka One', align: 'center'});
    this.timeText.anchor.setTo(0.5);
    this.timeText.alignIn(this.world.bounds, Phaser.TOP_LEFT, -30, -50);
    
    // create a title that shows after the game is over
    this.overTitle = this.add.sprite(this.world.centerX, this.world.centerY * 0.5, 'timeup');
    this.overTitle.anchor.setTo(0.5);
    this.overTitle.scale.setTo(0.8);
    this.overTitle.visible = false;
    
    // create the restart button
    this.restartLabel = this.add.text(this.world.centerX, this.world.centerY * 0.8, 'Restart', {font: '40px Fredoka One', align: 'center'});
    this.restartLabel.anchor.setTo(0.5);
    this.restartLabel.visible = false;
    this.restartLabel.inputEnabled = true;
    this.restartLabel.events.onInputDown.add(this.restart, this);
    
    // create the exit button
    this.exitLabel = this.add.text(this.world.centerX, this.world.centerY * 1.2, 'Main Menu', {font: '40px Fredoka One', align: 'center'});
    this.exitLabel.anchor.setTo(0.5);
    this.exitLabel.visible = false;
    this.exitLabel.inputEnabled = true;
    this.exitLabel.events.onInputDown.add(this.exit, this);
    
    // add the sound effect for gems kill
    this.killSound = this.game.add.audio('kill');
    this.animations = new Animations(this);
    this.board = new Board(this);
    this.matches = new Matches(this);
    this.board.init();
    this.items = new Items(this);
    this.items.init();

    // setting up the game properties
    this.isBoardBlocked = false;

    // show suggestion to user
    this.items.suggestion();

    this.input.onDown.add(this.select, this);
    this.input.onUp.add(this.stopSwipe, this);
  }

  select(pointer) {
    if (this.items.hand.visible) {
      this.items.hand.visible = false;
      this.items.handTween.stop();
      this.items.hand.kill();
    }

    if (this.isBoardBlocked) {
      return;
    }

    const pos = this.board.getGridPos(pointer.position.x, pointer.position.y);

    if (this.board.isValid(pos.row, pos.column)) {
      let selected = this.items.selected;
      if (!this.items.selected) {
        selected = this.items.getItem(pos.row, pos.column);
        selected.select();
        this.input.addMoveCallback(this.swipe, this);
      } else {
        if (pos.row == selected.row && pos.column == selected.column) {
          selected.deselect();
        } else {
          if (this.board.checkAdjacent(pos, {row: selected.row, column: selected.column})) {
            const source = this.items.getItem(pos.row, pos.column);

            this.isBoardBlocked = true;
            selected.deselect();
            // swap from row, column to selected
            this.items.swap(source, selected);
          } else {
            selected.deselect();
            selected = this.items.getItem(pos.row, pos.column);
            selected.select();
            this.input.addMoveCallback(this.swipe, this);
          }
        }
      }
    }
  }

  swipe(pointer) {
    if (!this.isBoardBlocked && this.items.selected) {
      const selected = this.items.selected;

      const  distX = pointer.position.x - selected.sprite.centerX;
      const distY = pointer.position.y - selected.sprite.centerY;

      let deltaRow = 0;
      let deltaColumn = 0;

      if (Math.abs(distX) > ITEM_SIZE / 2 && Math.abs(distY) < ITEM_SIZE / 4) {
        if (distX > 0) {
          deltaColumn = 1;
        } else {
          deltaColumn = -1;
        }
      } else if (Math.abs(distY) > ITEM_SIZE / 2 && Math.abs(distX) < ITEM_SIZE / 4) {
        if (distY > 0) {
          deltaRow = 1;
        } else {
          deltaRow = -1;
        }
      }

      if (deltaRow + deltaColumn != 0) {
        const target = this.items.getItem(selected.row + deltaRow, selected.column + deltaColumn);
        if (target != -1) {
          selected.deselect();
          this.items.swap(selected, target);
          
          this.input.deleteMoveCallback(this.swipe, this);
        }
      }
    }
  }

  stopSwipe() {
    if (this.items.selected != null) {
      this.items.selected.deselect();
    }

    this.input.deleteMoveCallback(this.swipe, this);
  }

  update() {
    if (!this.isPaused) {
      this.updateTime(this.time.elapsed);
    }
  }

  updateScore(score) {
    if (this.isPaused) {
      score = 0;
    }
    this.score += score;
    this.scoreText.setText(this.score);
  }

  updateTime(delta) {
    this.timeLeft -= delta;
    this.timeText.setText(Math.floor(this.timeLeft / 1000) + 's');
    if (this.timeLeft <= 0) {
      this.end();
    }
  }

  end() {
    const donutShadow = this.add.sprite(this.world.centerX + 5, this.world.centerY + 15, 'big-shadow');
    donutShadow.anchor.setTo(0.5);
    donutShadow.scale.setTo(0.75);
    donutShadow.alpha = 0.8;

    const donutLogo = this.game.add.sprite(this.world.centerX, this.world.centerY, 'big-donut');
    donutLogo.scale.setTo(0.75);
    donutLogo.anchor.setTo(0.5, 0.5);

    this.isBoardBlocked = true;
    this.isPaused = true;
    this.timeText.visible = false;
    this.overTitle.bringToTop();
    this.restartLabel.bringToTop();
    this.exitLabel.bringToTop();

    this.overTitle.visible = true;
    this.restartLabel.visible = true;
    this.exitLabel.visible = true;
  }

  restart() {
    this.game.state.start('Play');
  }

  exit() {
    this.game.backgroundMusic.stop();
    this.game.state.start('Menu');
  }
}
