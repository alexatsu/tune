"use client";

import { signIn } from "next-auth/react";
import { icons } from "@/shared/components/icons";
import btn from "@/shared/sass/components/Button.module.scss";

const { Github, Google } = icons;

type SignInProps = { provider: string; callbackUrl: string; icon: JSX.Element };

function SignInButton({ provider, callbackUrl, icon }: SignInProps) {
  console.log(callbackUrl, "here is the callbackurl")
  return (
    <button onClick={() => signIn(provider, { callbackUrl })} className={btn.signIn}>
      <div className={btn.btnContainer}>
        <span>Sign in with</span> {icon}
      </div>
    </button>
  );
}

export function GithubSignIn() {
  return <SignInButton provider="github" callbackUrl="/music" icon={<Github />} />;
}
export function GoogleSignIn() {
  return <SignInButton provider="google" callbackUrl="/music" icon={<Google />} />;
}
