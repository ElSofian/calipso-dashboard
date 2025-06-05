export async function POST(request: Request) {
  const data = await request.json();
  console.log('[LOG CLIENT]:', data);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
} 