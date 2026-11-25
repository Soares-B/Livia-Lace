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
