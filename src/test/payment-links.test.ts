import { describe, expect, it } from "vitest";
import { HOTMART_URL_ANUAL, HOTMART_URL_MENSUAL } from "@/lib/config";

describe("Plan checkout destinations", () => {
  it("uses the requested monthly Hotmart offer", () => {
    expect(HOTMART_URL_MENSUAL).toBe("https://pay.hotmart.com/G108414827L?off=57qu21ah");
  });

  it("uses the requested annual Hotmart offer", () => {
    expect(HOTMART_URL_ANUAL).toBe("https://pay.hotmart.com/G108414827L?off=tagtzym3");
  });
});