"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();
  console.log(session)


  if (session) {
    return (
      <>
        Signed in as {session.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("github")}>Sign in</button>
    </>
  );
}


export function NavMenu() {
  return (
    <div style={{maxHeight: "200px", color: "white"}}>
      <AuthButton />
    </div>
  );
}