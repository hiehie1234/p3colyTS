import { Client, Room} from 'colyseus.js'

export default class Server{
  private client: Client
  private room: Room

  private events: Phaser.Events.EventEmitter

  constructor(){
    this.client = new Client('ws://localhost:2567')
    this.events = new Phaser.Events.EventEmitter()
  }

  async join() {
    try{
     this.room = await this.client.joinOrCreate('my_room`')
     this.room.state.players.onAdd((player, sessionId) => { 
      this.events.emit('player-onadd', player, sessionId)
     })
     this.room.state.players.onRemove((player, sessionId) => {
      this.events.emit('player-onremove', player, sessionId)
     })
    } catch(e) {
      console.error(e)
    }
	}

  onPlayerAdd(cb: (player, sessionId) => void, context?: any): void {
    this.events.on('player-onadd', cb, context)
  }
  onPlayerLeave(cb: (player, sessionId) => void, context?: any):void {
    this.events.on('player-onremove', cb, context)
  }
}