"use client";

import { useUser } from "@auth0/nextjs-auth0";
import AuthPage from "./components/auth";
import Chat from "./components/chat";

export default function HomePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <main className="text-center p-8">Loading...</main>;
  }

  return (
    <main className="text-center p-8">
      <h1 className="text-lg font-bold">Welcome to Devjock Test!</h1>
      {user && (
        <div>
          <p className="text-sm text-gray-500">User ID: {user.sub}</p>
          <p>You are authorized via Auth0!</p>
          <Chat />
        </div>
      )}
    </main>
  );
}
