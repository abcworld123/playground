const allRooms = new Map();
exports.allRooms = allRooms;

exports.enterRoom = (req, res, next) => {
  const room = req.params.roomname;
  const host = req.query.host;
  let cnt = allRooms.get(room);
  if (cnt < 2) {
    allRooms.set(room, ++cnt);
    res.render('wordle/playboard', { host, room });
  } else {
    next();
  }
};
