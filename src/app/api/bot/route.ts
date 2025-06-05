import { NextResponse } from 'next/server';

export async function POST() {
	try {
		const res = await fetch(`http://${process.env.IP}:3500/ping`, {
			method: 'GET',
			headers: {
				'X-API-Key': process.env.API_SECRET!,
			},
		});

		if (!res.ok) {
			const errorText = await res.text();
			return NextResponse.json({ error: 'Erreur de connexion avec le bot', details: errorText }, { status: res.status });
		}

		const data = await res.json();
		return NextResponse.json({ success: true, bot: data });
	} catch (error) {
		console.error('Erreur de communication avec le bot:', error);
		return NextResponse.json({ success: false, error: 'Bot injoignable' }, { status: 500 });
	}
}
