import { describe, expect, it } from "vitest";
import { chunkValue, parsePaidMetadata, readChunked } from "./metadata";

describe("chunkValue/readChunked", () => {
  it("runder tur-retur for små og store verdier", () => {
    const small = { a: 1 };
    const large = { text: "æøå ".repeat(800) }; // > 3 chunks med multibyte-tegn

    const smallChunks = chunkValue("s", small);
    expect(smallChunks.s_n).toBe("1");
    expect(readChunked(smallChunks, "s")).toEqual(small);

    const largeChunks = chunkValue("l", large);
    expect(Number(largeChunks.l_n)).toBeGreaterThan(3);
    expect(readChunked(largeChunks, "l")).toEqual(large);
  });

  it("null-stiller overskytende chunks fra forrige skriving", () => {
    const first = chunkValue("ai", { text: "x".repeat(2000) });
    const second = chunkValue("ai", { text: "kort" }, first);
    expect(second.ai_n).toBe("1");
    // chunk 1..4 fra forrige skriving skal tømmes
    expect(second.ai_1).toBe("");
    expect(readChunked({ ...first, ...second }, "ai")).toEqual({ text: "kort" });
  });

  it("kaster når verdien er for stor for metadata-budsjettet", () => {
    expect(() => chunkValue("x", { text: "y".repeat(10_000) })).toThrow();
  });

  it("tåler manglende/korrupte chunks", () => {
    expect(readChunked({}, "finn")).toBeNull();
    expect(readChunked({ finn_n: "2", finn_0: '{"a":' }, "finn")).toBeNull();
    expect(readChunked({ finn_n: "1", finn_0: "ikke json" }, "finn")).toBeNull();
  });
});

describe("parsePaidMetadata", () => {
  it("leser tilstander riktig", () => {
    expect(parsePaidMetadata({}).state).toEqual({ kind: "new" });
    expect(parsePaidMetadata({ state: "fulfilled" }).state).toEqual({
      kind: "fulfilled",
    });
    expect(parsePaidMetadata({ state: "refunded:NOT_FOUND" }).state).toEqual({
      kind: "failed",
      code: "NOT_FOUND",
      refunded: true,
    });
    expect(parsePaidMetadata({ state: "failed:BLOCKED" }).state).toEqual({
      kind: "failed",
      code: "BLOCKED",
      refunded: false,
    });
  });

  it("leser ai_runs og hash", () => {
    const parsed = parsePaidMetadata({ ai_runs: "2", inputs_hash: "abc" });
    expect(parsed.aiRuns).toBe(2);
    expect(parsed.inputsHash).toBe("abc");
  });
});
