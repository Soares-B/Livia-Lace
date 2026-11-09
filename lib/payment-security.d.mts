export function toBRLCents(value: number | string | { toString(): string }): number;
export function verifyMercadoPagoSignature(
  signature: string | null,
  requestId: string | null,
  dataId: string,
  secret: string,
): boolean;

