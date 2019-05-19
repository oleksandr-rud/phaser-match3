import {SHADOW_ALPHA, SHADOW_OFFSET, ITEM_SCALE} from './Constants.js';

export default class Item {
  constructor(state, pos, type) {
    this.items = state.items;
    this.animations = state.animations;
    this.selectSound = state.add.audio('select' + type);
    this.killSound = state.killSound;

    this.row = pos.row;
    this.column = pos.column;

    this.shadow = this.items.group.create(pos.x + SHADOW_OFFSET, pos.y + SHADOW_OFFSET, 'item-shadow');
    this.shadow.alpha = SHADOW_ALPHA;
    this.shadow.scale.setTo(ITEM_SCALE);
    this.shadow.anchor.setTo(0.5);

    this.sprite = this.items.group.create(pos.x, pos.y, 'item' + type);
    this.sprite.scale.setTo(ITEM_SCALE);
    this.sprite.anchor.setTo(0.5);
  }

  select() {
    this.selectSound.play();
    this.shadow.scale.setTo(ITEM_SCALE - 0.05);
    this.sprite.scale.setTo(ITEM_SCALE+ 0.1);
    this.items.selected = this;
  }

  deselect() {
    this.shadow.scale.setTo(ITEM_SCALE);
    this.sprite.scale.setTo(ITEM_SCALE);
    this.items.selected = null;
  }

  reset(pos, type) {
    this.row = pos.row;
    this.column = pos.column;
    this.shadow.reset(pos.x + SHADOW_OFFSET, pos.y + SHADOW_OFFSET, 'item-shadow');
    this.sprite.reset(pos.x, pos.y, 'item' + type);
  }

  kill() {
    this.row = null;
    this.column = null;
    this.killSound.play();
    this.animations.destroy({
      shadow: this.shadow,
      sprite: this.sprite,
    }).then(() => {
      this.shadow.destroy();
      this.sprite.destroy();
    });
  }
}
