'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);// eslint-disable-line
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log(error);
      if (data?.user) setUser(data.user);
    };

    getUser();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (error) console.error('Error:', error);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth');
  };

  return (
    <main className="text-center px-4 py-8">
      <h1 className="text-2xl font-bold">Google Auth with Supabase</h1>

      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut} className="mt-4 px-4 py-2 bg-red-500 text-white">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="mt-4 px-4 py-2 bg-blue-500 text-white">
          Sign In with Google
        </button>
      )}
    </main>
  );
}
