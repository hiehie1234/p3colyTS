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

import { Position, Velocity, Sprite, Player } from "../components";
import { createSpriteSystem } from "../systems/SpriteSystem";
import { createMovementSystem } from "../systems/MovementSystem";
import { createPlayerSystem } from "../systems/PlayerSystem";
import { TextureKeys } from "../consts";

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
  private movementSystem: System;
  private playerSystem: System;

  remoteRef: Phaser.GameObjects.Rectangle;
  room: any;
  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  constructor() {
    super("game");
  }

  init() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
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

    this.spriteSystem = createSpriteSystem(this, [TextureKeys.Ship]);
    this.movementSystem = createMovementSystem();
  }

  update(time: number, delta: number): void {
    if (!this.world) return;

    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }
  }

  fixedTick(time: number, delta: number) {
    console.log(delta);
    // send input to the server
    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.server.movePlayer(this.inputPayload);

    this.playerSystem?.(this.world);
    this.movementSystem?.(this.world);
    this.spriteSystem?.(this.world);
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
    if (enity >= 0) {
      removeEntity(this.world, enity);
      delete this.playerEntities[sessionId];
    }
  }

  handlePlayerAdd(player: any, sessionId: string, room: any) {
    //const entity = this.physics.add.image(player.x, player.y, 'ship_0001')
    this.room = room;
    const entity = addEntity(this.world);
    addComponent(this.world, Position, entity);
    Position.x[entity] = player.x;
    Position.y[entity] = player.y;
    addComponent(this.world, Velocity, entity);
    addComponent(this.world, Sprite, entity);
    Sprite.texture[entity] = 0;
    // this.sessionIds.push(sessionId);
    // console.log(this.sessionIds[0]);
    addComponent(this.world, Player, entity);
    Player.sessionId[entity] = entity;

    // keep a reference of it on `playerEntities`
    this.playerEntities[sessionId] = entity;
    this.playerSystem = createPlayerSystem(
      this.cursorKeys,
      this.playerEntities,
      room.sessionId
    );
    if (sessionId === room.sessionId) {
      // this is the current player!
      // remoteRef is being used for debug only
      this.remoteRef = this.add.rectangle(0, 0, 32, 32);
      this.remoteRef.setStrokeStyle(1, 0xff0000);
      player.onChange(() => {
        this.remoteRef.x = player.x;
        this.remoteRef.y = player.y;
      });
      //this.remoteRef.visible = false;
    } else {
      //listening for server updates
      player.onChange(() => {
        // update local position immediately
        Position.x[entity] = player.x;
        Position.y[entity] = player.y;
      });
    }
  }
}
