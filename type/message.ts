  // local input cache
 export interface IinputPayload {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
    tick: number,
};
export enum Message
{
  playerMove,
	PlayerIndex
}