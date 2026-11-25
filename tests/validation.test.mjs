import assert from "node:assert/strict";
import test from "node:test";
import { isValidCPF, isValidEmail, isValidPassword } from "../lib/validation.mjs";

test("accepts valid CPFs with or without punctuation", () => {
  assert.equal(isValidCPF("52998224725"), true);
  assert.equal(isValidCPF("529.982.247-25"), true);
});

test("rejects CPFs with wrong check digits, repeated digits or wrong length", () => {
  assert.equal(isValidCPF("52998224726"), false);
  assert.equal(isValidCPF("11111111111"), false);
  assert.equal(isValidCPF("1234567890"), false);
  assert.equal(isValidCPF(""), false);
  assert.equal(isValidCPF(null), false);
});

test("validates email format", () => {
  assert.equal(isValidEmail("ana@exemplo.com"), true);
  assert.equal(isValidEmail("ana@exemplo"), false);
  assert.equal(isValidEmail("ana exemplo@x.com"), false);
  assert.equal(isValidEmail(123), false);
  assert.equal(isValidEmail({ a: 1 }), false);
});

test("validates password length in characters and bytes", () => {
  assert.equal(isValidPassword("12345678"), true);
  assert.equal(isValidPassword("1234567"), false);
  assert.equal(isValidPassword("a".repeat(72)), true);
  assert.equal(isValidPassword("a".repeat(73)), false);
  assert.equal(isValidPassword("ã".repeat(37)), false); // 74 bytes
  assert.equal(isValidPassword(undefined), false);
});
