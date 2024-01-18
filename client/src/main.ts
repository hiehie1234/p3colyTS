import Phaser from 'phaser'


import Bootstrap from './scenes/Bootstrap'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
  physics: { default: "arcade" },
  pixelArt: true,
	scene: [Bootstrap],
}

export default new Phaser.Game(config)