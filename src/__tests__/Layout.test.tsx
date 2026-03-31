import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Layout from "../components/Layout";

vi.mock("../services/weatherService", () => ({
  getForecast: vi.fn(() => Promise.resolve({
    city: "London",
    country: "UK",
    current: {
      date: "1",
      time: "1",
      tempC: 20,
      highC: 22,
      lowC: 18,
      condition: "Cloudy",
      advisories: [],
      windSpeed: 10,
      humidity: 80,
      pressure: 1010
    },
    summary: {},
    today: [],
    all: [],
  })),
}));

describe("Layout", () => {
  test("renders placeholder before selecting city", () => {
    render(<Layout />);

    expect(
      screen.getByText("Search a city to get the weather forecast.")
    ).toBeInTheDocument();
  });
});
