import { defineSystem, defineQuery, enterQuery, exitQuery } from "bitecs";
import { Position, Sprite } from "../components";

export const createSpriteSystem = (scene: Phaser.Scene, textures: string[]) => {
  const spritesById = new Map<number, Phaser.GameObjects.Sprite>();
  const spriteQuery = defineQuery([Sprite, Position]);
  const spriteQueryEnter = enterQuery(spriteQuery);
  const spriteQueryExit = exitQuery(spriteQuery);

  return defineSystem((world) => {
    const enterEntities = spriteQueryEnter(world);
    for (let i = 0; i < enterEntities.length; i++) {
      const eid = enterEntities[i];
      const texId = Sprite.texture[eid];
      const texture = textures[texId];
      spritesById.set(eid, scene.add.sprite(0, 0, texture));
    }

    const entities = spriteQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];
      const sprite = spritesById.get(eid);
      if (!sprite) continue;
      // operate directly on SoA data
      sprite.x = Position.x[eid];
      sprite.y = Position.y[eid];
    }

    const exitEntities = spriteQueryExit(world);
    for (let i = 0; i < exitEntities.length; i++) {
      const eid = exitEntities[i];
      const sprite = spritesById.get(eid);

      if (sprite) {
        sprite.destroy();
        spritesById.delete(eid);
      }
    }

    return world;
  });
};
