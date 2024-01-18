import Phaser from 'phaser'


import Bootstrap from './scenes/Bootstrap'
import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
  backgroundColor: '#b6d53c',
  physics: { default: "arcade" },
  pixelArt: true,
	scene: [Bootstrap, Game],
}

export default new Phaser.Game(config)