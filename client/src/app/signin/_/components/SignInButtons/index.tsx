"use client";

import { signIn } from "next-auth/react";

import { Github, Google } from "../icons";
import styles from "./styles.module.scss";

type SignInProps = { provider: string; callbackUrl: string; icon: JSX.Element };

function SignInButton({ provider, callbackUrl, icon }: SignInProps) {
  return (
    <button onClick={() => signIn(provider, { callbackUrl })} className={styles.signIn}>
      <div className={styles.btnContainer}>
        <span>Sign in with</span> {icon}
      </div>
    </button>
  );
}

export function GithubSignIn() {
  return <SignInButton provider="github" callbackUrl="/allmusic" icon={<Github />} />;
}
export function GoogleSignIn() {
  return <SignInButton provider="google" callbackUrl="/allmusic" icon={<Google />} />;
}
