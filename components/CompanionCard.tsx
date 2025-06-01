"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import {
  addCompanionToBookmark,
  // companionBookmarkPermissions,
  removeCompanionFromBookmark,
} from "@/lib/actions/companion.actions";
import { usePathname } from "next/navigation";
import { Protect } from "@clerk/nextjs";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

export default function CompanionCard({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) {
  const pathname = usePathname();

  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);

      if (bookmarked) {
        await removeCompanionFromBookmark(id, pathname);
      } else {
        await addCompanionToBookmark(id, pathname);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <article
      className="companion-card"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <Protect
          condition={(has) => has({ plan: "core" }) || has({ plan: "pro" })}
        >
          <button
            className="companion-bookmark"
            onClick={handleBookmark}
            disabled={isBookmarking}
          >
            <Image
              src={
                bookmarked
                  ? "/icons/bookmark-filled.svg"
                  : "/icons/bookmark.svg"
              }
              alt="bookmark"
              width={12.5}
              height={15}
            />
          </button>
        </Protect>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image
          src="/icons/clock.svg"
          alt="duration"
          width={13.5}
          height={13.5}
        />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`/companions/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">
          Launch Lesson
        </button>
      </Link>
    </article>
  );
}
