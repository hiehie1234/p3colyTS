import Phaser from 'phaser'

export default class Bootstrap extends Phaser.Scene {
	constructor() {
		super('bootstrap')
	}

	preload() {
    console.log('preload')
	}

	create() {
	}
}