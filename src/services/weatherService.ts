import { get } from "./api";
import type {
  WeatherBlock,
  ForecastDayUI,
  ForecastResponse,
  ForecastUI,
} from "../types";

function toUI(block: WeatherBlock): ForecastDayUI {
  return {
    date: block.date,
    time: block.time,

    tempC: block.temperature,
    highC: block.temperatureMax,
    lowC: block.temperatureMin,

    condition: Array.isArray(block.weatherTypes)
      ? block.weatherTypes.join(", ")
      : "",

    advisories: Array.isArray(block.recommendations)
      ? block.recommendations
      : [],

    windSpeed: block.windSpeed,
    humidity: block.humidity,
    pressure: block.pressure,
  };
}

export async function getForecast(city: string): Promise<ForecastUI> {
  const trimmed = city.trim();
  const encoded = encodeURIComponent(trimmed);
  const data = await get<ForecastResponse>(`/weather/${encoded}`);

  const all = data.days.map(toUI);
  const today = all;

  return {
    city: data.cityInfo.name,
    country: data.cityInfo.country,
    current: toUI(data.current),
    today,
    summary: toUI(data.summary),
    all,
  };
}
