import { NextResponse } from "next/server";
import { auth, login } from "@/lib/auth";

export async function POST(req: Request) {
  const formData = await req.formData();
  try {
    const { session } = await login(formData);
    const sessionCookie = auth.createSessionCookie(session.id);

    const res = NextResponse.redirect(new URL(`/`, process.env.NEXTAUTH_URL), { status: 303 });
    res.cookies.set({
      name: sessionCookie.name,
      value: sessionCookie.value,
      path: sessionCookie.attributes.path,
      httpOnly: sessionCookie.attributes.httpOnly,
      secure:   sessionCookie.attributes.secure,
      sameSite: sessionCookie.attributes.sameSite as "lax" | "strict" | "none",
      maxAge:   sessionCookie.attributes.maxAge,
    });

    return res;
  } catch (e) {
    //console.error("Login failed:", e);
		const url = new URL("/auth/login", process.env.NEXTAUTH_URL);

		if (e instanceof Error) {
			switch (e.message) {
				case "INVALID_CREDENTIALS": url.searchParams.set("error", "1"); break;
				case "COMPANY_NOT_FOUND": url.searchParams.set("error", "2"); break;
				
				default:	url.searchParams.set("error", "3"); break;
			}
		}

    return NextResponse.redirect(url, { status: 303 });
  }
}
