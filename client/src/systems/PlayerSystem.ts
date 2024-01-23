import Phaser from "phaser";
import { defineQuery, defineSystem, enterQuery, exitQuery } from "bitecs";
import { Player, Velocity } from "../components";

export function createPlayerSystem(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  sessionIds: { [sessionId: string]: number },
  roomSessionId: string
) {
  const sessionById = new Map<number, string>();
  const playerQuery = defineQuery([Player, Velocity]);
  const playerQueryEnter = enterQuery(playerQuery);
  //const playerQueryExit = exitQuery(playerQuery);

  return defineSystem((world) => {
    const entered = playerQueryEnter(world);

    for (let i = 0; i < entered.length; i++) {
      const eid = entered[i];
      const id = Player.sessionId[eid];
      const sessionId = Object.keys(sessionIds).find(
        (key) => sessionIds[key] === id
      );
      sessionById.set(eid, sessionId ? sessionId : undefined);
    }

    const entities = playerQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];
      const sessionId = sessionById.get(eid);
      if (sessionId === roomSessionId) {
        Velocity.x[eid] = 0;
        Velocity.y[eid] = 0;
        //control current player
        if (cursors.left.isDown) {
          Velocity.x[eid] = -2;
          //Velocity.y[eid] = 0;
        } else if (cursors.right.isDown) {
          Velocity.x[eid] = 2;
          //Velocity.y[eid] = 0;
        }
        if (cursors.up.isDown) {
          //Velocity.x[eid] = 0;
          Velocity.y[eid] = -2;
        } else if (cursors.down.isDown) {
          //Velocity.x[eid] = 0;
          Velocity.y[eid] = 2;
        }
      }
    }

    return world;
  });
}
