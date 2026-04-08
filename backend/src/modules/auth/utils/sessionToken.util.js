import crypto from "crypto";

// Never persist raw JWTs. Store deterministic SHA-256 digest for lookup/revocation.
export const hashSessionToken = (token) => {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
};
