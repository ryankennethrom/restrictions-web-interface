// auth.js
// The expected SHA-256 hash of the password
export const EXPECTED_SECRET_HASH = "d5592a70cdcb9a5387272206e6d168c842f7a24128488fe722cc229c8c5c278d";

/**
 * Takes a password string, hashes it with SHA-256, and returns true if it matches the expected hash.
 * @param {string} password
 * @param {string} expectedHash Optional hash to check against (defaults to EXPECTED_SECRET_HASH)
 * @returns {Promise<boolean>} true if valid
 */
export async function verifySecret(password, expectedHash = EXPECTED_SECRET_HASH) {
  if (!password) return false;

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex === expectedHash;
}
