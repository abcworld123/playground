const allRooms = new Map();

function enterRoom(room, host) {
  let cnt = allRooms.get(room);
  if (cnt < 2) {
    allRooms.set(room, ++cnt);
    return { success: true };
  } else {
    return { success: false };
  }
}

exports.allRooms = allRooms;
exports.enterRoom = enterRoom;
