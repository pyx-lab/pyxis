import type { Metadata } from "next";
import SignInWrapper from "./signinwrapper";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Pyxis account to continue searching the web privately.",
};

export default function SignInPage() {
  return <SignInWrapper />;
}