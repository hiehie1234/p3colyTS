import Phaser from "phaser";
import Server from "../server/Server";
import { IGameSceneData } from "../../../type/scenes";
import { IinputPayload } from "../../../type/message";
import {
  IWorld,
  createWorld,
  addEntity,
  addComponent,
  System,
  removeEntity,
} from "bitecs";

import { Position, Velocity, Sprite } from "../components";
import { createSpriteSystem } from "../systems/SpriteSystem";

export default class Game extends Phaser.Scene {
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  private server: Server;
  // we will assign each player visual representation here
  // by their `sessionId`
  playerEntities: { [sessionId: string]: number } = {};
  inputPayload: IinputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    tick: 0,
  };
  private world: IWorld;
  private spriteSystem: System;

  images;

  constructor() {
    super("game");
  }

  init() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image("ship_0001", "images/ship_0001.png");
  }

  async create(data: IGameSceneData) {
    const { server } = data;
    this.server = server;
    if (!server) {
      throw new Error("server instance missing");
    }
    this.world = createWorld();

    await server.join();

    this.server.onPlayerAdd(this.handlePlayerAdd, this);
    this.server.onPlayerLeave(this.handlePlayerLeave, this);
  }

  update(time: number, delta: number): void {
    if (!this.world || !this.spriteSystem) return;
    this.spriteSystem(this.world);

    // send input to the server
    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.server.movePlayer(this.inputPayload);
  }

  handlePlayerLeave(player: any, sessionId: string) {
    // const entity = this.playerEntities[sessionId]
    // if(entity){
    //   // destroy entity
    //   entity.destroy()

    //   // clear local reference
    //   delete this.playerEntities[sessionId]
    // }
    const enity = this.playerEntities[sessionId];
    removeEntity(this.world, enity);
  }

  handlePlayerAdd(player: any, sessionId: string) {
    //const entity = this.physics.add.image(player.x, player.y, 'ship_0001')
    const entity = addEntity(this.world);
    addComponent(this.world, Position, entity);
    addComponent(this.world, Velocity, entity);
    Velocity.x[entity] = 2;
    Velocity.y[entity] = 2;
    addComponent(this.world, Sprite, entity);
    Sprite.texture[entity] = 0;

    this.spriteSystem = createSpriteSystem(this, ["ship_0001"]);
    // keep a reference of it on `playerEntities`
    this.playerEntities[sessionId] = entity;
    // listening for server updates
    player.onChange(() => {
      // update local position immediately
      Position.x[entity] = player.x;
      Position.y[entity] = player.y;
    });
  }
}
