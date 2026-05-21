import crypto from "crypto";

/*
  Hash session tokens for storage and lookup

  - Purpose: convert a raw access token (JWT or similar) into a fixed-length
    SHA-256 hex digest so the server can persist and query sessions for
    revocation/lookup without storing the raw token.
  - Deterministic: this uses an unsalted SHA-256 digest intentionally so
    the same token always yields the same digest (enables exact DB lookups).
    Do NOT add a salt here unless you also change the lookup/revocation
    logic to use the same keyed/salted approach.
  - Security notes:
    * The digest is still sensitive — protect DB backups and logs where it
      might appear. Treat stored digests as secrets for operational security.
    * For stronger guarantees you can use an HMAC with a server-side secret
      (keyed hashing) but that requires consistent use during both create and
      lookup operations.
  - Output: 64-character lowercase hex string (the SHA-256 digest).
*/
export const hashSessionToken = (token) => {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
};
