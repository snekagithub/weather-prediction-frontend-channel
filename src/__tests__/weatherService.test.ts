import { describe, test, expect, vi } from "vitest";
import { getForecast } from "../services/weatherService";
import { mockWeatherResponse } from "../__mocks__/mockWeatherResponse";

vi.mock("../services/api", () => ({
  get: vi.fn(() => Promise.resolve(mockWeatherResponse)),
}));

describe("weatherService", () => {
  test("converts API response into UI format", async () => {
    const result = await getForecast("London");

    expect(result.city).toBe("London");
    expect(result.country).toBe("UK");
    expect(result.all.length).toBe(1);
    expect(result.current.tempC).toBe(24);
  });
});
