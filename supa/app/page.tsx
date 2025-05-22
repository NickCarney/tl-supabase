"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };

    getUser();
  }, []);

  return (
    <main className="text-center p-8">
      <h1 className="text-lg font-bold">Welcome to Devjock Test!</h1>
      {userId && <p className="text-sm text-gray-500">User ID: {userId}</p>}
    </main>
  );
}
