const axios = require('axios').default;

async function testWeather() {
  const body = { idx: 1, nx: 1, ny: 1 };
  const { data } = await axios.post('http://localhost:3000/weather/getWeatherDay', body);
  return data.success;
}

test('날씨 받아오기', async () => {
  const data = await testWeather();
  expect(data).toBeTruthy();
});

jest.setTimeout(10000);
