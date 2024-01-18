export default class Game extends Phaser.Scene{
  constructor(){
    super('game');
  }

  init() {
  }

  async create(data: any){
    console.log(data);
    const { server } = data;
    if(!server){
      throw new Error('server instance missing')
    }

    await server.join();
  }
}