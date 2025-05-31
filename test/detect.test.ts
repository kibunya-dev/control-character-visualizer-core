// /test/detect.test.ts
import { detectControlCharacters } from "../src/detect";

describe("detectControlCharacters", () => {
  test("detects U+200B Zero Width Space", () => {
    // UTF-8エンコーディングを手動で作成
    // "a\u200Bb" = "a" + U+200B + "b"
    // U+200B は UTF-8 で [0xE2, 0x80, 0x8B] にエンコードされる
    const input = new Uint8Array([
      0x61,             // 'a' のUTF-8バイト
      0xE2, 0x80, 0x8B, // U+200B (Zero Width Space) のUTF-8バイト
      0x62              // 'b' のUTF-8バイト
    ]);
    
    const result = detectControlCharacters(input);

    expect(result).toEqual([
      {
        codePoint: "U+200B",
        byteRange: [1, 4],
        name: "Zero Width Space",
        bytes: [0xE2, 0x80, 0x8B]
      }
    ]);
  });

  test("detects multiple control characters", () => {
    // "a\u200B\u200Cb" = "a" + ZWSP + ZWNJ + "b"
    const input = new Uint8Array([
      0x61,             // 'a'
      0xE2, 0x80, 0x8B, // U+200B (Zero Width Space)
      0xE2, 0x80, 0x8C, // U+200C (Zero Width Non-Joiner)
      0x62              // 'b'
    ]);
    
    const result = detectControlCharacters(input);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      codePoint: "U+200B",
      byteRange: [1, 4],
      name: "Zero Width Space",
      bytes: [0xE2, 0x80, 0x8B]
    });
    expect(result[1]).toEqual({
      codePoint: "U+200C",
      byteRange: [4, 7],
      name: "Zero Width Non-Joiner",
      bytes: [0xE2, 0x80, 0x8C]
    });
  });

  test("detects BOM (Byte Order Mark)", () => {
    // BOM + "test"
    // U+FEFF は UTF-8 で [0xEF, 0xBB, 0xBF] にエンコードされる
    const input = new Uint8Array([
      0xEF, 0xBB, 0xBF, // U+FEFF (BOM)
      0x74, 0x65, 0x73, 0x74 // "test"
    ]);
    
    const result = detectControlCharacters(input);

    expect(result).toEqual([
      {
        codePoint: "U+FEFF",
        byteRange: [0, 3],
        name: "Byte Order Mark",
        bytes: [0xEF, 0xBB, 0xBF]
      }
    ]);
  });

  test("detects RTL Override", () => {
    // "a\u202Eb"
    // U+202E は UTF-8 で [0xE2, 0x80, 0xAE] にエンコードされる
    const input = new Uint8Array([
      0x61,             // 'a'
      0xE2, 0x80, 0xAE, // U+202E (Right-To-Left Override)
      0x62              // 'b'
    ]);
    
    const result = detectControlCharacters(input);

    expect(result).toEqual([
      {
        codePoint: "U+202E",
        byteRange: [1, 4],
        name: "Right-To-Left Override",
        bytes: [0xE2, 0x80, 0xAE]
      }
    ]);
  });

  test("returns empty array for text without control characters", () => {
    // 通常の文字列 "hello"
    const input = new Uint8Array([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
    
    const result = detectControlCharacters(input);

    expect(result).toEqual([]);
  });

  test("handles empty input", () => {
    const input = new Uint8Array([]);
    
    const result = detectControlCharacters(input);

    expect(result).toEqual([]);
  });

  test("handles invalid UTF-8 bytes gracefully", () => {
    // 不正なUTF-8シーケンスを含むバイト列
    // 0x80は単独では不正なUTF-8バイト
    const input = new Uint8Array([
      0x61,             // 'a' (正常)
      0x80,             // 不正なバイト
      0xE2, 0x80, 0x8B, // U+200B (正常)
      0x62              // 'b' (正常)
    ]);
    
    const result = detectControlCharacters(input);

    // 不正なバイトはスキップされ、有効な制御文字のみ検出される
    expect(result).toEqual([
      {
        codePoint: "U+200B",
        byteRange: [2, 5],
        name: "Zero Width Space",
        bytes: [0xE2, 0x80, 0x8B]
      }
    ]);
  });

  test("detects control character at the beginning", () => {
    // ZWSP + "test"
    const input = new Uint8Array([
      0xE2, 0x80, 0x8B, // U+200B
      0x74, 0x65, 0x73, 0x74 // "test"
    ]);
    
    const result = detectControlCharacters(input);

    expect(result).toEqual([
      {
        codePoint: "U+200B",
        byteRange: [0, 3],
        name: "Zero Width Space",
        bytes: [0xE2, 0x80, 0x8B]
      }
    ]);
  });

  test("detects control character at the end", () => {
    // "test" + ZWSP
    const input = new Uint8Array([
      0x74, 0x65, 0x73, 0x74, // "test"
      0xE2, 0x80, 0x8B        // U+200B
    ]);
    
    const result = detectControlCharacters(input);

    expect(result).toEqual([
      {
        codePoint: "U+200B",
        byteRange: [4, 7],
        name: "Zero Width Space",
        bytes: [0xE2, 0x80, 0x8B]
      }
    ]);
  });
});