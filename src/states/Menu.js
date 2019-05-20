/* eslint-disable linebreak-style */
export default class Menu extends Phaser.State {
  preload() {
    this.game.load.image('btn-play', 'assets/images/btn-play.png');
    this.game.load.image('btn-sound', 'assets/images/btn-sfx.png');

    this.game.load.image('donuts-logo', 'assets/images/donuts_logo.png');
    this.game.load.image('big-donut', 'assets/images/donut.png');
    this.game.load.image('big-shadow', 'assets/images/big-shadow.png');
  }
  create() {
    this.game.backgroundMusic = this.game.add.audio('bg-music');
    this.game.backgroundMusic.loop = true;
    this.game.backgroundMusic.allowMultiple = false;
    this.game.backgroundMusic.play();

    const backgroundImage = this.add.sprite(0, 0, 'bg-image');

    const logo = this.add.sprite(0, 0, 'donuts-logo');
    logo.anchor.setTo(0.5);
    logo.scale.setTo(0.7);
    logo.alignIn(this.world.bounds, Phaser.CENTER, 0, -150);

    const playButton = this.add.button(0, 0, 'btn-play', this.startGame, this);
    playButton.anchor.setTo(0.5);
    playButton.scale.setTo(0.7);
    playButton.alignIn(this.world.bounds, Phaser.CENTER, 0, 150);

    const soundButton = this.add.button(0, 0, 'btn-sound', this.toggleSound, this);
    soundButton.anchor.setTo(0.5);
    soundButton.scale.setTo(0.5);
    soundButton.alignIn(this.world.bounds, Phaser.TOP_RIGHT, -20, -30);
  }

  startGame() {
    this.game.state.start('Play');
  }

  toggleSound() {
    if (this.game.sound.mute === true) {
      // this.backgroundMusic.play();
      this.game.sound.mute = false;
    } else {
      // this.backgroundMusic.pause();
      this.game.sound.mute = true;
    }
  }
}
