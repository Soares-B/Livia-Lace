import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { toBRLCents, verifyMercadoPagoSignature } from "../lib/payment-security.mjs";

test("converts BRL amounts to integer cents with decimal rounding", () => {
  assert.equal(toBRLCents("19.90"), 1990);
  assert.equal(toBRLCents("19.9"), 1990);
  assert.equal(toBRLCents("1.005"), 101);
  assert.equal(toBRLCents("0.004"), 0);
  assert.throws(() => toBRLCents("-1.00"));
  assert.throws(() => toBRLCents("NaN"));
});

test("validates Mercado Pago webhook signature and rejects tampering", () => {
  const id = "123456";
  const requestId = "request-abc";
  const timestamp = "1700000000";
  const secret = "test-secret";
  const manifest = `id:${id};request-id:${requestId};ts:${timestamp};`;
  const hash = createHmac("sha256", secret).update(manifest).digest("hex");
  const signature = `ts=${timestamp},v1=${hash}`;

  assert.equal(verifyMercadoPagoSignature(signature, requestId, id, secret), true);
  assert.equal(verifyMercadoPagoSignature(signature, requestId, "654321", secret), false);
  assert.equal(verifyMercadoPagoSignature(signature, null, id, secret), false);
  assert.equal(verifyMercadoPagoSignature("ts=x,v1=not-a-hash", requestId, id, secret), false);
});

