export type DetectedChar = {
  codePoint: string;             // "U+200B"
  byteRange: [number, number];   // [startByte, endByte)
  name: string;                  // "Zero Width Space"
  bytes: number[];               // [0xE2, 0x80, 0x8B]
};
