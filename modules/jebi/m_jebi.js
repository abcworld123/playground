const Ranking = require('#model/jebiRanking');

/* 랭킹 저장 & 불러오기 */
async function submitRanking(n, dog) {
  try {
    let ranking = await Ranking.findOne({ n });
    if (!ranking) {
      ranking = new Ranking({ n, count: Array(n).fill(0), total: 0 });
      await ranking.save();
    }
    const rank = ranking.count.slice(dog + 1, n).reduce((a, b) => a + b, 0) + 1;
    const total = ++ranking.total;
    const top = parseInt(rank * 100 / total);
    ranking.count[dog]++;
    await ranking.save();
    return { success: true, body: { rank, total, top } };
  }
  catch (err) {
    console.error('오류:', err);
    return { success: false };
  }
}

exports.submitRanking = submitRanking;
