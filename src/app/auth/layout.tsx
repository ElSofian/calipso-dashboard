import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, sessionCookieName } from '@/lib/auth';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value;

  if (sessionId) {
    try {
      const session = await auth.validateSession(sessionId);
      if (session.user) {
        redirect('/');
      }
    } catch (error) {
			console.error(error);
		}
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-svh">
      {children}
    </div>
  );
}
