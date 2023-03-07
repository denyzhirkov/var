import { cryptoRandomString } from "https://deno.land/x/crypto_random_string@1.0.0/mod.ts"

export const generateKey = (): string => {
  return cryptoRandomString({ length: 6 });
}