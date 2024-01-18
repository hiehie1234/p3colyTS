import { Client, Room} from 'colyseus.js'

export default class Server{
  client = new Client('ws://localhost:2567')
  room: Room

  constructor(){
  }

  async join() {
    try{
     this.room = await this.client.joinOrCreate('my_room`')
     console.log('joined successfully')
    } catch(e) {
      console.error(e)
    }
	}
}