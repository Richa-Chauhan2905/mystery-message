"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className="bg-orange-400 rounded-2xl py-1.5 px-4 my-2 mx-3"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
