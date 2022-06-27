import response from 'modules/response';

export const allRooms = new Map<string, number>();

export function enterRoom(room: string) {
  const cnt = allRooms.get(room);
  if (cnt < 2) {
    allRooms.set(room, cnt + 1);
    return response(true);
  } else return response(false);
}
