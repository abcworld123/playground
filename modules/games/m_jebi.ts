import Ranking from 'model/games/jebi/Ranking';
import response from 'modules/response';

/* 랭킹 저장 & 불러오기 */
export async function submitRanking(n: number, dog: number) {
  try {
    let ranking = await Ranking.findOne({ n });
    if (!ranking) {
      ranking = new Ranking({ n, count: Array<number>(n).fill(0), total: 0 });
      await ranking.save();
    }
    const rank = ranking.count.slice(dog + 1, n).reduce((a, b) => a + b, 0) + 1;
    const total = ++ranking.total;
    const top = Math.floor(rank * 100 / total);
    ranking.count[dog]++;
    await ranking.save();
    return response(true, { rank, total, top });
  }
  catch (err) {
    console.error('오류:', err);
    return response(false);
  }
}
