// Tests for main.ts — run with: node --test test.ts
// SPDX-License-Identifier: MIT

import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { MAX_CHARS, RANT, validateEntry, writeEntry } from "./main.ts";

const MAIN = new URL("./main.ts", import.meta.url).pathname;

test("rant satisfies the competition gate (1-400 chars, non-whitespace)", () => {
  assert.equal(typeof RANT, "string");
  assert.ok(RANT.length >= 1 && RANT.length <= MAX_CHARS);
  assert.ok(RANT.trim().length > 0);
  assert.ok(!/[\r\n]/.test(RANT), "rant must be a single paragraph");
  assert.doesNotThrow(() => validateEntry(RANT));
});

test("rant is a rant about a concrete everyday annoyance", () => {
  // The judge's first criterion: a funny rant about an everyday annoyance,
  // specific and concrete rather than a vague mood.
  assert.match(RANT, /self-checkout/i);
  assert.match(RANT, /UNEXPECTED ITEM IN THE BAGGING AREA/);
  assert.ok(RANT.split(/[.!?]/).filter((s) => s.trim().length > 0).length >= 3,
    "a few sentences, not a one-liner");
});

test("validateEntry rejects over-long, whitespace-only and multi-line input", () => {
  assert.throws(() => validateEntry("x".repeat(MAX_CHARS + 1)), /over the 400/);
  assert.throws(() => validateEntry(""), /empty/);
  assert.throws(() => validateEntry("   \t  "), /whitespace-only/);
  assert.throws(() => validateEntry("one\ntwo"), /single paragraph/);
  assert.throws(() => validateEntry("one\rtwo"), /single paragraph/);
});

test("writeEntry writes exactly the rant and returns it", () => {
  const tmp = mkdtempSync(join(tmpdir(), "angry-judge-test-"));
  try {
    const out = join(tmp, "nested", "entry.txt");
    const returned = writeEntry(out);
    assert.equal(returned, RANT);
    assert.equal(readFileSync(out, "utf8"), RANT);
    // No trailing newline: the file's byte count is exactly the rant's,
    // which is what the gate measures.
    assert.ok(!readFileSync(out, "utf8").endsWith("\n"));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("CLI --selftest passes and prints the character count", () => {
  const out = execFileSync(process.execPath, [MAIN, "--selftest"], {
    encoding: "utf8",
  });
  assert.match(out, /selftest ok/);
  assert.match(out, new RegExp(`${RANT.length} characters`));
});

test("CLI writes the file and prints the rant, exit 0", () => {
  const tmp = mkdtempSync(join(tmpdir(), "angry-judge-cli-"));
  try {
    const out = join(tmp, "entry.txt");
    const res = spawnSync(process.execPath, [MAIN, "--out", out], {
      encoding: "utf8",
    });
    assert.equal(res.status, 0, res.stderr);
    assert.equal(readFileSync(out, "utf8"), RANT);
    assert.equal(res.stdout.trim(), RANT);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("CLI rejects an unknown flag with exit 1", () => {
  const res = spawnSync(process.execPath, [MAIN, "--nope"], {
    encoding: "utf8",
  });
  assert.equal(res.status, 1);
  assert.match(res.stderr, /unknown argument/);
});
