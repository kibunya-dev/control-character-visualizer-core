import { CONTROL_CHARACTERS } from "./table.js";
import { DetectedChar } from "./types.js";

export function detectControlCharacters(input: Uint8Array): DetectedChar[] {
  const result: DetectedChar[] = [];
  let i = 0;

  while (i < input.length) {
    try {
      const { codePoint, byteLength } = decodeUTF8(input, i);
      if (CONTROL_CHARACTERS.has(codePoint)) {
        result.push({
          codePoint: "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0"),
          byteRange: [i, i + byteLength],
          name: CONTROL_CHARACTERS.get(codePoint)!,
          bytes: Array.from(input.slice(i, i + byteLength))
        });
      }
      i += byteLength;
    } catch {
      i += 1; // 不正なバイト → スキップ
    }
  }

  return result;
}

// UTF-8デコードの最小実装
function decodeUTF8(input: Uint8Array, offset: number): { codePoint: number, byteLength: number } {
  const b0 = input[offset];

  if (b0 < 0x80) return { codePoint: b0, byteLength: 1 };
  if ((b0 & 0xE0) === 0xC0) return {
    codePoint: ((b0 & 0x1F) << 6) | (input[offset + 1] & 0x3F),
    byteLength: 2
  };
  if ((b0 & 0xF0) === 0xE0) return {
    codePoint: ((b0 & 0x0F) << 12) | ((input[offset + 1] & 0x3F) << 6) | (input[offset + 2] & 0x3F),
    byteLength: 3
  };
  if ((b0 & 0xF8) === 0xF0) return {
    codePoint: ((b0 & 0x07) << 18) | ((input[offset + 1] & 0x3F) << 12) |
               ((input[offset + 2] & 0x3F) << 6) | (input[offset + 3] & 0x3F),
    byteLength: 4
  };

  throw new Error("Invalid UTF-8");
}
