import Phaser from "phaser";
import { IGameSceneData } from "../../../type/scenes";
import { TextureKeys } from "../consts";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image(TextureKeys.Ship, "images/ship_0001.png");
  }

  create(data: IGameSceneData) {
    this.createNewGame(data);
  }
  private createNewGame(data: IGameSceneData) {
    this.scene.launch("game", data);
  }
}
