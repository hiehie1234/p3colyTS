import Server from "../server/Server";
import { IGameSceneData } from '../../../type/scenes'

export default class Game extends Phaser.Scene{
  private server: Server;
  // we will assign each player visual representation here
  // by their `sessionId`
  playerEntities: {[sessionId: string]: any} = {};
  constructor() {
    super('game');
  }

  init() {
  }
  
  preload() {
    this.load.image('ship_0001', 'images/ship_0001.png')
  }

  async create(data: IGameSceneData) {
    console.log(data);
    const { server } = data;
    this.server = server;
    if(!server){
      throw new Error('server instance missing')
    }

    await server.join();

    this.server.onPlayerAdd(this.handlePlayerAdd, this)
    this.server.onPlayerLeave(this.handlePlayerLeave, this)
  }
  handlePlayerLeave(player: any, sessionId: string) {
    const entity = this.playerEntities[sessionId];
    if(entity){
      // destroy entity
      entity.destroy();

      // clear local reference
      delete this.playerEntities[sessionId];
    }
  }
  handlePlayerAdd(player: any, sessionId: string) {
    const entity = this.physics.add.image(player.x, player.y, 'ship_0001');

    // keep a reference of it on `playerEntities`
    this.playerEntities[sessionId] = entity;     
  }
}