import { SignUp } from "@clerk/nextjs";
import { Background } from "@/components/layout/background";

export default function SignUpPage() {
  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center">
        <SignUp />
      </div>
    </>
  );
}
