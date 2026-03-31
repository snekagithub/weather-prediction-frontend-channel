import { describe, test, expect, vi } from "vitest";
import { get } from "../services/api";

describe("api.get", () => {
  test("returns data from fetch", async () => {
    const mockJson = { ok: true };

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJson),
      })
    ) as any;

    const response = await get("/test");
    expect(response).toEqual(mockJson);
  });
});
