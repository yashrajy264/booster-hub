import { SignJWT, jwtVerify } from "jose";

export type DownloadClaims = {
  orderId: string;
  productId: string;
};

function getSecret() {
  const s = process.env.DOWNLOAD_JWT_SECRET;
  if (!s) {
    throw new Error("Missing DOWNLOAD_JWT_SECRET");
  }
  return new TextEncoder().encode(s);
}

export async function signDownloadToken(claims: DownloadClaims): Promise<string> {
  return new SignJWT({
    oid: claims.orderId,
    pid: claims.productId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyDownloadToken(token: string): Promise<DownloadClaims> {
  const { payload } = await jwtVerify(token, getSecret());
  const orderId = payload.oid as string | undefined;
  const productId = payload.pid as string | undefined;
  if (!orderId || !productId) {
    throw new Error("Invalid token payload");
  }
  return { orderId, productId };
}
