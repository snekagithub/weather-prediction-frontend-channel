import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ForecastCard from "../components/ForecastCard";

const mockDay = {
  date: "2025-01-01",
  time: "12:00",
  tempC: 26.5,
  highC: 27.3,
  lowC: 25.1,
  condition: "Rain",
  advisories: ["Carry umbrella"],
  windSpeed: 12,
  humidity: 70,
  pressure: 1012,
};

describe("ForecastCard", () => {
  test("renders main weather info", () => {
    render(<ForecastCard day={mockDay} />);

    expect(screen.getByText("26.5°C")).toBeInTheDocument();
    expect(screen.getByText("Rain")).toBeInTheDocument();
    expect(screen.getByText("High 27.3°")).toBeInTheDocument();
  });
});
