import { SignIn } from "@clerk/nextjs";
import { Background } from "@/components/layout/background";

export default function SignInPage() {
  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center">
        <SignIn />
      </div>
    </>
  );
}
