import { NextResponse } from "next/server";
import { auth, sessionCookieName } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName);
  if (!sessionCookie) return;

  // 1) invalide la session côté serveur
  await auth.invalidateSession(sessionCookie.value);

  // 2) recrée une réponse qui supprime **le même** cookie
  const res = NextResponse.redirect(new URL("/auth/login", process.env.NEXTAUTH_URL), { status: 303 });

  // ⚠️ Ici on utilise les mêmes attributs qu’à la création !
  const isProd = process.env.NODE_ENV === "production";
  const domain    = isProd ? "calipso.me" : undefined;
  const sameSite  = isProd ? "None" : "Lax";
  const secure    = isProd ? "Secure" : "";

  let header = `${sessionCookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=${sameSite};`;
  if (domain)   header += ` Domain=${domain};`;
  if (secure)   header += ` ${secure};`;

  res.headers.set("Set-Cookie", header);
  return res;
}
