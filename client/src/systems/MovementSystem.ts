import { defineQuery, defineSystem } from "bitecs";
import { Position, Velocity } from "../components";

export const createMovementSystem = () => {
  const query = defineQuery([Position, Velocity]);

  return defineSystem((world) => {
    const entities = query(world);
    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];
      Position.x[eid] += Velocity.x[eid];
      Position.y[eid] += Velocity.y[eid];
    }

    return world;
  });
};
