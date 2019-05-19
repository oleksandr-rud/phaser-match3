/* eslint-disable linebreak-style */
import BootState from './states/Boot.js';
import PreloadState from './states/Preloader.js';
import MenuState from './states/Menu.js';
import PlayState from './states/Play.js';

const Game = new Phaser.Game(480, 900, Phaser.AUTO, 'donuts-crash');

Game.state.add('Boot', BootState);
Game.state.add('Preloader', PreloadState);
Game.state.add('Menu', MenuState);
Game.state.add('Play', PlayState);

Game.state.start('Boot');