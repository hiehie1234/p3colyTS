import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
  physics: { default: "arcade" },
  pixelArt: true,
	scene: [HelloWorldScene],
}

export default new Phaser.Game(config)