import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex items-center justify-center xl:pt-18">
      <SignIn />
    </main>
  );
}
