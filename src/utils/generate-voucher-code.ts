export async function generateVoucherCode(): Promise<string> {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return code;
}
