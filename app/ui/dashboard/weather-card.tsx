import { lusitana } from '@/app/ui/fonts';

type WeatherData = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

function getWeatherInfo(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: '快晴', emoji: '☀️' };
  if (code <= 3) return { label: '晴れ〜曇り', emoji: '⛅' };
  if (code <= 48) return { label: '霧', emoji: '🌫️' };
  if (code <= 55) return { label: '小雨', emoji: '🌦️' };
  if (code <= 65) return { label: '雨', emoji: '🌧️' };
  if (code <= 75) return { label: '雪', emoji: '❄️' };
  if (code <= 82) return { label: 'にわか雨', emoji: '🌨️' };
  if (code <= 99) return { label: '雷雨', emoji: '⛈️' };
  return { label: '不明', emoji: '🌡️' };
}

async function fetchTokyoWeather(): Promise<WeatherData> {
  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo',
    { next: { revalidate: 1800 } },
  );
  if (!res.ok) throw new Error('天気データの取得に失敗しました');
  return res.json();
}

export default async function WeatherCard() {
  const data = await fetchTokyoWeather();
  const { current, daily } = data;
  const { label, emoji } = getWeatherInfo(current.weather_code);

  return (
    <div className="col-span-full rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 p-4 shadow-sm md:col-span-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h3 className="text-sm font-semibold text-gray-700">
          東京の今日の天気
        </h3>
      </div>

      <div className="flex items-end gap-4">
        <p className={`${lusitana.className} text-5xl font-bold text-blue-700`}>
          {Math.round(current.temperature_2m)}°C
        </p>
        <div className="mb-1 text-sm text-gray-600">
          <p>{label}</p>
          <p>体感 {Math.round(current.apparent_temperature)}°C</p>
        </div>
      </div>

      <div className="mt-3 flex gap-6 text-xs text-gray-500">
        <span>最高 {Math.round(daily.temperature_2m_max[0])}°C</span>
        <span>最低 {Math.round(daily.temperature_2m_min[0])}°C</span>
        <span>湿度 {current.relative_humidity_2m}%</span>
        <span>風速 {Math.round(current.wind_speed_10m)} km/h</span>
      </div>
    </div>
  );
}
