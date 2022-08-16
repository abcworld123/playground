import response from 'modules/response';

export const hockeyRooms = new Map<string, number>();
export const moleRooms = new Map<string, number>();
export const wordleRooms = new Map<string, number>();

export function enterRoom(rooms: Map<string, number>, room: string) {
  const cnt = rooms.get(room);
  // if (cnt < 2) {
  if (1) {
    rooms.set(room, cnt + 1);
    return response(true);
  } else return response(false);
}
