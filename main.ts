// Angry Judge: The Short Rant Contest — entry program.
// SPDX-License-Identifier: MIT
//
// Writes one short rant (the entry text) to /output/entry.txt and prints
// it to stdout. Deterministic, standard library only, no network, no
// dependencies. Runs on Node 22.18+ (native TypeScript type stripping).
//
// The rant: the self-checkout machine treating an ordinary shopper like a
// shoplifter. Concrete (the bagging-area scream is a phrase everyone has
// heard), economical (four sentences, no throat-clearing), and fresh
// against the sponsor's own examples (printer, slow bus, Monday morning).

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

// Winner of an 8-candidate duel judged against the published brief, in
// criterion order: (1) a funny rant about an everyday annoyance, (2) a real
// laugh, not a smirk at effort, (3) a specific concrete annoyance, (4)
// sharp economical wording, (5) a fresh angle. The self-checkout rant won
// on (2): "audition for a job I never applied for" is the biggest laugh of
// the eight, the bagging-area scream is instantly concrete, and the
// criminal framing carries the anger without performing it.
export const RANT =
  "The self-checkout has decided I am a criminal. I scanned one bag of rice and it screamed UNEXPECTED ITEM IN THE BAGGING AREA like I'd smuggled a television. Then a human watches me rescan it, slowly, the way you watch a toddler eat soup. I came here to buy rice, not to audition for a job I never applied for.";

export const MAX_CHARS = 400;
export const DEFAULT_OUT = "/output/entry.txt";

/** Throws an Error when `text` breaks the competition gate. */
export function validateEntry(text: string): void {
  if (text.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be whitespace-only");
  }
  if (text.length > MAX_CHARS) {
    throw new Error(
      `entry is ${text.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single paragraph (no line breaks)");
  }
}

/** Writes the rant to `outPath` (creating parent dirs) and returns it. */
export function writeEntry(outPath: string): string {
  validateEntry(RANT);
  mkdirSync(dirname(outPath), { recursive: true });
  // No trailing newline: the file is exactly the rant, so its character
  // count is exactly the rant length and the gate sees one paragraph.
  writeFileSync(outPath, RANT, "utf8");
  return RANT;
}

function printHelp(): void {
  console.log(`Usage: node main.ts [--out <path>] [--selftest|--check] [--help]

Writes the short rant to an entry file and prints it.

Options:
  --out <path>     Destination file (default: ${DEFAULT_OUT})
  --selftest       Validate the rant and exit 0 if it passes the gate
  --check          Alias for --selftest
  --help           Show this help

Exit codes: 0 on success, 1 on error (invalid rant, bad flags, write failure).`);
}

function main(argv: string[]): number {
  let outPath = DEFAULT_OUT;
  let selftest = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      return 0;
    }
    if (arg === "--selftest" || arg === "--check") {
      selftest = true;
      continue;
    }
    if (arg === "--out") {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) {
        console.error("error: --out needs a path");
        return 1;
      }
      outPath = value;
      i++;
      continue;
    }
    console.error(`error: unknown argument: ${arg}`);
    return 1;
  }

  try {
    validateEntry(RANT);
  } catch (err) {
    console.error(`error: ${(err as Error).message}`);
    return 1;
  }

  if (selftest) {
    // Prove the write path too: round-trip the rant through a temp file
    // and check the bytes read back are exactly the rant.
    const tmp = mkdtempSync(join(tmpdir(), "angry-judge-selftest-"));
    try {
      const probe = join(tmp, "entry.txt");
      writeEntry(probe);
      const back = readFileSync(probe, "utf8");
      if (back !== RANT) {
        console.error("error: selftest round-trip mismatch");
        return 1;
      }
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
    console.log(
      `selftest ok: rant is ${RANT.length} characters (gate: 1-${MAX_CHARS}), single paragraph, valid`,
    );
    return 0;
  }

  try {
    const text = writeEntry(outPath);
    console.log(text);
    return 0;
  } catch (err) {
    console.error(`error: ${(err as Error).message}`);
    return 1;
  }
}

process.exitCode = main(process.argv.slice(2));
