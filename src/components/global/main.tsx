import type { ReactNode } from 'react';
import ResponsiveLayout from '@/components/global/responsive-layout';
import { User } from '@/types';

export default function Main({ children, user }: { children: ReactNode, user: User }) {
	return (
    <ResponsiveLayout user={user}>
      {children}
    </ResponsiveLayout>
  );
}
