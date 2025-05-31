import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import Cta from "@/components/CTA";

import {
  getAllCompanions,
  getRecentSessions,
} from "@/lib/actions/companion.actions";

import { getSubjectColor } from "@/lib/utils";

export default async function HomePage() {
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main>
      <h1 className="text-2xl">Popular Companions</h1>

      <section className="home-section">
        {companions?.map((data) => (
          <CompanionCard
            {...data}
            key={data?.id}
            color={getSubjectColor(data?.subject)}
          />
        ))}
      </section>

      <section className="home-section">
        <CompanionList
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          classNames="w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  );
}
