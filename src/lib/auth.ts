import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from './prisma';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from 'bcryptjs';

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: {
			username: string;
			grade: string;
			avatar: string;
			active_employee_id: number;
			discord_user_id: string;
			discord_avatar_hash: string;
		};
	}
}

export const sessionCookieName = process.env.NODE_ENV === 'production' ? '__Secure-session' : 'session';
const isProd = process.env.NODE_ENV === 'production';

export const auth = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
	sessionCookie: {
		name: sessionCookieName,
		expires: false,
		attributes: {
			secure: isProd,
			sameSite: isProd ? 'none' : 'lax',
			domain: isProd ? 'calipso.me' : undefined,
			path: '/'
		}
	},
	getUserAttributes: (user) => ({
		username: user.username,
		avatar: user.avatar,
		active_employee_id: user.active_employee_id,
		discord_user_id: user.discord_user_id,
		discord_avatar_hash: user.discord_avatar_hash
	})
});

export async function login(formData: FormData) {
	const username = formData.get('username') as string;
	const password = formData.get('password') as string;

	const user = await prisma.user.findUnique({
		where: { username },
		include: { employees: { include: { companies: true } } }
	});
	
	if (!user || !await bcrypt.compare(password, user.hashedPassword)) {
		throw new Error("INVALID_CREDENTIALS");
	}

	const session = await auth.createSession(user.id, {
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	});

	return { session };
}

export async function requireAuth() {
	const cookieStore = await cookies();
	const sid = cookieStore.get(sessionCookieName)?.value;
  if (!sid) redirect("/auth/login");

  const session = await auth.validateSession(sid);
  if (!session.user) redirect("/auth/login");

	session.user.avatar = getDiscordAvatarUrl(session.user.discord_user_id, session.user.discord_avatar_hash);

	const fullUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      employees: {
        include: {
          companies: true
        }
      }
    }
  });
  if (!fullUser) redirect("/auth/login");

	const gradeData = await prisma.grades.findUnique({
		where: {
			name: fullUser.employees.grade
		}
	});

	return {
		...session,
		user: {
			...session.user,
			employee: {
				...fullUser.employees,
				name: `${fullUser.employees.first_name} ${fullUser.employees.last_name}`,
				salary: gradeData?.salary || 0
			},
			company: fullUser.employees.companies
		}
	};
}

export function getDiscordAvatarUrl(userId: string, avatarHash: string | null, size: number = 128): string {
	if (!avatarHash || !userId) {
		const discriminator = parseInt(userId) % 5;
		return `https://cdn.discordapp.com/embed/avatars/${discriminator}.png`;
	}

	return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=${size}`;
}