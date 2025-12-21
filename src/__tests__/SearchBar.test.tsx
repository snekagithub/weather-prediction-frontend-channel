import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  test("calls onSelect when pressing Enter", () => {
    const mockFn = vi.fn();
    render(<SearchBar onSelect={mockFn} />);

    const input = screen.getByPlaceholderText(/Type city/i);

    fireEvent.change(input, { target: { value: "Delhi" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockFn).toHaveBeenCalledWith("Delhi");
  });
});
