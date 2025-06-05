import { NextResponse } from 'next/server';
import { auth, sessionCookieName } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(sessionCookieName);
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Pas de session' }, { status: 401 });
    }
    
    const { user } = await auth.validateSession(sessionCookie.value);
    
    if (!user) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erreur lors de la validation de la session:', error);
    return NextResponse.json({ error: 'Erreur de validation de session' }, { status: 500 });
  }
} 