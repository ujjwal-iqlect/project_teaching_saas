import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import Cta from "@/components/CTA";

import { recentSessions } from "@/constants";

const companionCards = [
  {
    id: "1",
    name: "Neura the Brainy Explorer",
    topic: "Neural network of the brain",
    subject: "science",
    duration: 45,
    color: "#ffda6e",
  },
  {
    id: "2",
    name: "Countsy the Number Wizard",
    topic: "Derivatives & Integrals",
    subject: "maths",
    duration: 30,
    color: "#e5d0ff",
  },
  {
    id: "3",
    name: "Verba the Vocabulary Builder",
    topic: "English Literature",
    subject: "language",
    duration: 30,
    color: "#BDE7FF",
  },
];

export default function Page() {
  return (
    <main>
      <h1 className="text-2xl">Popular Companions</h1>

      <section className="home-section">
        {companionCards.map((data) => (
          <CompanionCard key={data?.id} {...data} />
        ))}
      </section>

      <section className="home-section">
        <CompanionList
          title="Recently completed sessions"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  );
}
