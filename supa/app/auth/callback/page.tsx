"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      await supabase.auth.getSession();
      router.push("/");
    };

    handleAuth();
  }, [router]);

  return <div>Loading...</div>;
}
