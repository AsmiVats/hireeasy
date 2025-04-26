import SignInForm from "@/components/Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Login to your account",
  // other metadata
};

const SigninPage = () => {
  return (
    <>
      <SignInForm />
    </>
  );
};

export default SigninPage;
