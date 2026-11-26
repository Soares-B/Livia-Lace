const encoder = new TextEncoder();

export function isValidEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

// bcrypt ignora tudo depois de 72 bytes, então senhas maiores seriam truncadas em silêncio.
export function isValidPassword(value) {
  return (
    typeof value === "string" &&
    value.length >= 8 &&
    encoder.encode(value).length <= 72
  );
}

export function isValidCPF(value) {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  for (const length of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(digits[i]) * (length + 1 - i);
    }
    const check = ((sum * 10) % 11) % 10;
    if (check !== Number(digits[length])) return false;
  }
  return true;
}

// Número da casa: aceita "123", "45B", "12-A" ou "S/N" (sem número).
export function isValidHouseNumber(value) {
  if (typeof value !== "string") return false;
  const v = value.trim();
  return (
    v.length >= 1 &&
    v.length <= 10 &&
    /^[0-9A-Za-z/\-.\s]+$/.test(v) &&
    (/\d/.test(v) || /^s\/?n$/i.test(v))
  );
}

export function normalizeHouseNumber(value) {
  const v = value.trim();
  return /^s\/?n$/i.test(v) ? "S/N" : v;
}
