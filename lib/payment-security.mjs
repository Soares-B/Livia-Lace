import { createHmac, timingSafeEqual } from "node:crypto";

export function toBRLCents(value) {
  const amount = value.toString().trim();
  const match = /^(\d+)(?:\.(\d+))?$/.exec(amount);
  if (!match) throw new Error("Preço inválido");
  const fraction = match[2] ?? "";
  const firstTwoDigits = fraction.slice(0, 2).padEnd(2, "0");
  const roundedCents = Number(firstTwoDigits) + (fraction[2] && Number(fraction[2]) >= 5 ? 1 : 0);
  const cents = Number(match[1]) * 100 + roundedCents;
  if (!Number.isSafeInteger(cents)) throw new Error("Preço inválido");
  return cents;
}

export function verifyMercadoPagoSignature(signature, requestId, dataId, secret) {
  if (!signature || !requestId || !dataId || !secret) return false;
  const fields = new Map(signature.split(",").map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, value.join("=")];
  }));
  const timestamp = fields.get("ts");
  const receivedHash = fields.get("v1");
  if (!timestamp || !receivedHash || !/^[a-f0-9]{64}$/i.test(receivedHash)) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest();
  const actualHash = Buffer.from(receivedHash, "hex");
  return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
}

