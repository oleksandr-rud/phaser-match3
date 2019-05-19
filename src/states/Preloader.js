/* eslint-disable linebreak-style */
/* eslint-disable max-len */
export default class Preloader extends Phaser.State {
  preload() {
    this.game.load.image('bg-image', 'assets/images/backgrounds/background.jpg');
    this.game.load.image('score-bg', 'assets/images/bg-score.png');
    this.game.load.image('timeup', 'assets/images/text-timeup.png');

    this.game.load.image('item1', 'assets/images/game/gem-01.png');
    this.game.load.image('item2', 'assets/images/game/gem-02.png');
    this.game.load.image('item3', 'assets/images/game/gem-03.png');
    this.game.load.image('item4', 'assets/images/game/gem-04.png');
    this.game.load.image('item5', 'assets/images/game/gem-05.png');
    this.game.load.image('item6', 'assets/images/game/gem-06.png');

    this.game.load.image('item-shadow', 'assets/images/game/shadow.png');

    this.game.load.image('hand', 'assets/images/game/hand.png');

    this.game.load.image('particle1', 'assets/images/particles/particle-1.png');
    this.game.load.image('particle2', 'assets/images/particles/particle-2.png');
    this.game.load.image('particle3', 'assets/images/particles/particle-3.png');
    this.game.load.image('particle4', 'assets/images/particles/particle-4.png');
    this.game.load.image('particle5', 'assets/images/particles/particle-5.png');

    this.game.load.image('particles1', 'assets/images/particles/particle_ex1.png')
    this.game.load.image('particles2', 'assets/images/particles/particle_ex2.png')
    this.game.load.image('particles3', 'assets/images/particles/particle_ex3.png');

    this.game.load.audio('bg-music', 'assets/audio/background.mp3');
    this.game.load.audio('kill', 'assets/audio/kill.mp3');
    this.game.load.audio('select1', 'assets/audio/select-1.mp3');
    this.game.load.audio('select2', 'assets/audio/select-2.mp3');
    this.game.load.audio('select3', 'assets/audio/select-3.mp3');
    this.game.load.audio('select4', 'assets/audio/select-4.mp3');
    this.game.load.audio('select5', 'assets/audio/select-5.mp3');
    this.game.load.audio('select6', 'assets/audio/select-6.mp3');
  }

  create() {
    this.game.state.start('Menu');
  }
}
