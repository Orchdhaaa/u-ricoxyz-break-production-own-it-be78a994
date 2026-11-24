// Break Production, Own It — make.fun program/v1 entry.
// Writes the one line an AI agent prints the moment it breaks production
// to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// The gate requires UTF-8 text of 1 to 200 characters, a single line,
// not whitespace-only; this program enforces that before writing.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I pushed an untested config change straight to prod and took checkout down for 41 minutes. No review, no rollback plan, just me, confident, at 3 a.m. I am the outage.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_FILE = "entry.txt";

const codePoints = [...ENTRY];
if (
  codePoints.length < MIN_CHARS ||
  codePoints.length > MAX_CHARS ||
  ENTRY.trim().length === 0 ||
  ENTRY.includes("\n")
) {
  throw new Error(
    `entry must be a single non-blank line of ${MIN_CHARS}-${MAX_CHARS} characters, got ${codePoints.length}`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, OUTPUT_FILE);
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip: the file on disk must be byte-for-byte what we intended.
if (readFileSync(outPath, "utf8") !== ENTRY) {
  throw new Error("round-trip check failed: entry.txt differs from ENTRY");
}
