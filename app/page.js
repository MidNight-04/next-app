import { authOptions } from '../lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    signOut();
    return redirect('/login');
  }

  return redirect('/admin/projects');
}
