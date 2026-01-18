import { get } from "./api";
import type {
  WeatherBlock,
  ForecastDayUI,
  ForecastResponse,
  ForecastUI,
} from "../types";

const SLOT_HOURS = 3;

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function getThreeHourSlotKey(now = new Date()): string {
  const slotStart = Math.floor(now.getHours() / SLOT_HOURS) * SLOT_HOURS;
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(
    now.getDate()
  )}-${pad2(slotStart)}`;
}

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
  const data = await get<ForecastResponse>(`/weather/${encoded}`, {
    cacheKey: getThreeHourSlotKey(),
  });

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
