import { Client, Room } from "colyseus.js";
import { Message, IinputPayload } from "../../../type/message";

export default class Server {
  private client: Client;
  private room: Room;

  private events: Phaser.Events.EventEmitter;

  constructor() {
    this.client = new Client("ws://localhost:2567");
    this.events = new Phaser.Events.EventEmitter();
  }

  async join() {
    try {
      this.room = await this.client.joinOrCreate("my_room`");
      this.room.state.players.onAdd((player, sessionId) => {
        console.log(sessionId, "joined!");

        this.events.emit("player-onadd", player, sessionId, this.room);
      });

      this.room.state.players.onRemove((player, sessionId) => {
        console.log(sessionId, "left!");

        this.events.emit("player-onremove", player, sessionId);
      });
    } catch (e) {
      console.error(e);
    }
  }

  getActiveRoom() {
    if (!this.room) return;
    return this.room;
  }
  movePlayer(inputPayload: IinputPayload) {
    // skip loop if not connected with room yet.
    if (!this.room) {
      return;
    }

    this.room.send(Message.playerMove, inputPayload);
  }
  onPlayerAdd(
    cb: (player, sessionId, room: Room) => void,
    context?: any
  ): void {
    this.events.on("player-onadd", cb, context);
  }
  onPlayerLeave(cb: (player, sessionId) => void, context?: any): void {
    this.events.on("player-onremove", cb, context);
  }
}
