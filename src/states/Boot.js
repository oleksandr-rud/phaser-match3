/* eslint-disable linebreak-style */
export default class Boot extends Phaser.State {
  init() {
    // this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    // if (!isMobile) this.scale.setResizeCallback(this.scaleGame);
    // this.scaleGame();
    //this.scale.setMinMax(480, 260, 1024, 768);
    // this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.refresh();
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // this.scale.setShowAll(); 
    this.scale.refresh();
    // this.scale.setScreenSize(true);
    // this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;
    //this.scale.forcePortrait = true;
    // this.scale.forceLandscape = true;
  }

  preload() {
    this.game.stage.backgroundColor = '#ffe680';
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.state.start('Preloader');
  }
}
