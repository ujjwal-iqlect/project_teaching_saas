import Image from "next/image";
import { redirect } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { currentUser } from "@clerk/nextjs/server";
import {
  getUserCompanions,
  getUserSessions,
} from "@/lib/actions/companion.actions";
import CompanionList from "@/components/CompanionList";

export default async function Profile() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user?.id);
  const sessionHistory = await getUserSessions(user?.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image
            src={user?.imageUrl}
            alt={user.firstName!}
            width={110}
            height={110}
            className="rounded-lg"
          />

          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user?.firstName} {user?.lastName}
            </h1>

            <p className="text-sm text-muted-foreground">
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/check.svg"
                alt="check"
                width={22}
                height={22}
              />

              <p className="text-2xl font-bold">{sessionHistory?.length}</p>
            </div>

            <div>Lessons completed</div>
          </div>

          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src="/icons/cap.svg" alt="cap" width={22} height={22} />

              <p className="text-2xl font-bold">{companions?.length}</p>
            </div>

            <div>Companions created</div>
          </div>
        </div>
      </section>

      <Accordion type="multiple">
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold cursor-pointer">
            Recent Sessions
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList
              title="Recent Sessions"
              companions={sessionHistory}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold cursor-pointer">
            My Companions {`(${companions?.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList title="My Companions" companions={companions} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
