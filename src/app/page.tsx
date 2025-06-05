import SPA from '@/components/global/spa';
import Main from '@/components/global/main';
import { requireAuth } from '@/lib/auth';
import { User } from '@/types';

export default async function Home() {
	const session = await requireAuth();

	////console.log(session);
	return (
		<Main user={session.user as unknown as User}>
			<SPA />
		</Main>
	);
}
