# control-character-visualizer-core

A lightweight UTF-8 control character detection library for Node.js and TypeScript.

This core module scans raw UTF-8 byte sequences and detects invisible or problematic control characters — such as zero-width spaces, BOM, and bidirectional override codes — while returning precise byte offsets and metadata. It is designed to be UI-agnostic and suitable for use in CLI tools, CI pipelines, or browser extensions.

---

## ✨ Features

- Detects invisible or problematic characters:
  - Zero Width Space (`U+200B`)
  - Zero Width Non-Joiner (`U+200C`)
  - Zero Width Joiner (`U+200D`)
  - Right-To-Left Override (`U+202E`)
  - Backspace (`U+0008`)
  - Byte Order Mark (`U+FEFF`)
- Parses raw `Uint8Array` UTF-8 input without relying on high-level string parsing
- Returns detailed detection results including:
  - Unicode code point
  - Byte range `[start, end)`
  - Byte sequence
  - Character name
- Ignores malformed UTF-8 gracefully (skips invalid bytes)
- Framework-agnostic core logic (can be used in Node.js, CLI tools, editors, and GitHub Actions)

---

## 📦 Installation

```bash
npm install control-character-visualizer-core
```

## 🔧 Usage Example

```typescript
import { detectControlCharacters } from "control-character-visualizer-core";

// Encode input string to UTF-8 bytes
const input = new TextEncoder().encode("a\u200Bb");

// Detect control characters
const result = detectControlCharacters(input);

console.log(result);
/*
[
  {
    codePoint: "U+200B",
    byteRange: [1, 4],
    name: "Zero Width Space",
    bytes: [0xE2, 0x80, 0x8B]
  }
]
*/
```

## 🧪 Testing
To run tests:
```bash
npm install
npm test
```
Uses Jest + ts-jest with jest-fixed-jsdom to support TextEncoder.

## 📁 Project Structure
```plaintext
control-character-visualizer-core/
├── src/
│   ├── detect.ts      # Main detection logic
│   ├── table.ts       # Map of code points and control character names
│   └── types.ts       # Type definitions for detection results
├── test/
│   └── detect.test.ts # Full test coverage with edge cases
├── package.json
├── tsconfig.json
└── jest.config.js
```

## 🔮 Potential Use Cases
- GitHub browser extension to visualize invisible characters in code diffs
- CLI tools for scanning source files before commit
- CI/CD pipelines to block PRs containing problematic characters
- VS Code extensions for inline highlighting
- Static analysis / linting pipelines

## 📝 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## 🧠 Related Projects (planned)
- control-character-visualizer: GitHub browser extension based on this core
- ccv-cli: Command-line tool using this library
- ccv-action: GitHub Action to validate commits or pull requests

## Author
 Developed by kibunya_dev
 