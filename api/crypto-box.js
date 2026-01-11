import crypto from "crypto";

const ALGO = "aes-256-gcm";
const SALT_LEN = 16;
const IV_LEN = 12;
const KEY_LEN = 32;
const ITERATIONS = 150000;
const DIGEST = "sha256";

/**
 * Derive a strong encryption key from a password
 */
function deriveKey(secret, salt) {
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, KEY_LEN, DIGEST);
}

/**
 * Encrypt a string using a password
 */
export function encrypt(plaintext, secret) {
  const salt = crypto.randomBytes(SALT_LEN);
  const iv = crypto.randomBytes(IV_LEN);

  const key = deriveKey(secret, salt);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  // Format: salt.iv.tag.ciphertext
  return [
    salt.toString("base64"),
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64")
  ].join(".");
}

/**
 * Decrypt a string using a password
 */
export function decrypt(encryptedData, secret) {
  const parts = encryptedData.split(".");
  if (parts.length !== 4) throw new Error("Invalid encrypted format");

  const [saltB64, ivB64, tagB64, dataB64] = parts;

  const salt = Buffer.from(saltB64, "base64");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");

  const key = deriveKey(secret, salt);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}
