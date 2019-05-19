import {DESTROY_SPEED, DROP_SPEED, SWAP_SPEED, SHADOW_OFFSET, ITEM_SCALE} from './Constants.js';

export default class Animations {
  constructor(state) {
    this.state = state;
    this.particles = state.add.emitter(0, 0, 100);
    this.particles.makeParticles(['particles1', 'particles2', 'particles3']);
    this.particles.gravity = 500;
    this.particles.setScale(ITEM_SCALE);
  }

  destroy(item) {
    return new Promise((resolve) => {
      this.state.add.tween(item.shadow).to({
        alpha: 0,
      }, DESTROY_SPEED, Phaser.Easing.Linear.Out, true);      
      this.particles.x = item.sprite.world.x;
      this.particles.y = item.sprite.world.y;
      this.particles.start(true, 500, null, 15);
      this.state.add.tween(item.sprite).to({
        alpha: 0,
      }, DESTROY_SPEED, Phaser.Easing.Linear.Out, true)
      .onComplete.add(() => {
          resolve();
      });
    });
  }

  drop(item, posY) {
    return new Promise((resolve) => {
      item.shadow.scale.setTo(ITEM_SCALE - 0.05);
      this.state.add.tween(item.shadow).to({
        y: posY + SHADOW_OFFSET,
      }, DROP_SPEED, Phaser.Easing.Sinusoidal.In, true);
      item.sprite.scale.setTo(ITEM_SCALE + 0.05);
      this.state.add.tween(item.sprite).to({
        y: posY,
      }, DROP_SPEED, Phaser.Easing.Sinusoidal.In, true)
      .onComplete.add(() => {
        item.shadow.scale.setTo(ITEM_SCALE);
        item.sprite.scale.setTo(ITEM_SCALE);
        resolve();
      });
    });
  }

  swap(item, pos) {
    this.state.add.tween(item.shadow).to({
      x: pos.x + SHADOW_OFFSET,
      y: pos.y + SHADOW_OFFSET,
    }, SWAP_SPEED, Phaser.Easing.Sinusoidal.InOut, true);

    return this.state.add.tween(item.sprite).to({
      x: pos.x,
      y: pos.y,
    }, SWAP_SPEED, Phaser.Easing.Sinusoidal.InOut, true);
  }
}