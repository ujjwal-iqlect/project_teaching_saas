"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // const topic = searchParams.get("topic") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery?.trim()) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "topic",
        value: debouncedSearchQuery,
      });

      router.push(newUrl);
    } else if (
      !debouncedSearchQuery.startsWith(" ") &&
      pathname === "/companions"
    ) {
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["topic"],
      });

      router.push(newUrl, { scroll: false });
    }
  }, [debouncedSearchQuery]);

  return (
    <div className="relative border border-black rounded-lg flex gap-2 items-center px-2 py-1 h-fit">
      <Image src="/icons/search.svg" alt="search" width={15} height={15} />
      <input
        placeholder="Search companions ..."
        type="text"
        className="outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
