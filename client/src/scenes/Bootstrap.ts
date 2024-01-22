import Phaser from "phaser";
import Server from "../server/Server";

export default class Bootstrap extends Phaser.Scene {
  private server: Server;
  constructor() {
    super("bootstrap");
  }

  init() {
    this.server = new Server();
  }

  create() {
    this.createNewGame();
  }
  private createNewGame() {
    this.scene.launch("preloader", {
      server: this.server,
    });
  }
}
