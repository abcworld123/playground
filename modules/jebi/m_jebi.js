const Ranking = require('#model/jebiRanking');

/* 랭킹 저장 & 불러오기 */
exports.submitRanking = async (req, res, next) => {
  try {
    const { n, dog } = req.body;
    let ranking = await Ranking.findOne({ n });
    if (!ranking) {
      ranking = new Ranking({ n, count: Array(n).fill(0), total: 0 });
      await ranking.save();
    }
    const rank = ranking.count.slice(dog + 1, n).reduce((a, b) => a + b, 0) + 1;
    const total = ++ranking.total;
    const top = parseInt(rank * 100 / total);
    res.send({ success: true, body: { rank, total, top } });
    ranking.count[dog]++;
    await ranking.save();
  }
  catch (err) {
    console.error('오류:', err);
    res.send({ success: false });
  }
};
