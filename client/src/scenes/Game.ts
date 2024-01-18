import Phaser from 'phaser'
import Server from '../server/Server'
import { IGameSceneData } from '../../../type/scenes'
import { IinputPayload } from '../../../type/message'

export default class Game extends Phaser.Scene{
  private server: Server
  // we will assign each player visual representation here
  // by their `sessionId`
  playerEntities: {[sessionId: string]: any} = {}
  inputPayload: IinputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    tick: 0,
  }
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super('game')
  }

  init() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }
  
  preload() {
    this.load.image('ship_0001', 'images/ship_0001.png')
  }

  async create(data: IGameSceneData) {
    console.log(data)
    const { server } = data
    this.server = server
    if(!server){
      throw new Error('server instance missing')
    }

    await server.join()

    this.server.onPlayerAdd(this.handlePlayerAdd, this)
    this.server.onPlayerLeave(this.handlePlayerLeave, this)
  }

  update(time: number, delta: number): void {
    // send input to the server
    this.inputPayload.left = this.cursorKeys.left.isDown
    this.inputPayload.right = this.cursorKeys.right.isDown
    this.inputPayload.up = this.cursorKeys.up.isDown
    this.inputPayload.down = this.cursorKeys.down.isDown
    this.server.movePlayer(this.inputPayload)
  }

  handlePlayerLeave(player: any, sessionId: string) {
    const entity = this.playerEntities[sessionId]
    if(entity){
      // destroy entity
      entity.destroy()

      // clear local reference
      delete this.playerEntities[sessionId]
    }
  }

  handlePlayerAdd(player: any, sessionId: string) {
    const entity = this.physics.add.image(player.x, player.y, 'ship_0001')

    // keep a reference of it on `playerEntities`
    this.playerEntities[sessionId] = entity   
    
    // listening for server updates
    player.onChange(() => {
      // update local position immediately
      entity.x = player.x;
      entity.y = player.y;
    })
  }
}