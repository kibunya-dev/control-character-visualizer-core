export const CONTROL_CHARACTERS = new Map<number, string>([
  [0x200B, "Zero Width Space"],
  [0x200C, "Zero Width Non-Joiner"],
  [0x200D, "Zero Width Joiner"],
  [0x202E, "Right-To-Left Override"],
  [0x0008, "Backspace"],
  [0xFEFF, "Byte Order Mark"],
  // 必要に応じて追加
]);
