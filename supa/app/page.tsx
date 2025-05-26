"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthPage from "./components/auth";
import Chat from "./components/chat";

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
      <AuthPage />
      {userId && (
        <div>
          <p className="text-sm text-gray-500">User ID: {userId}</p>
          <Chat />
        </div>
      )}
    </main>
  );
}
