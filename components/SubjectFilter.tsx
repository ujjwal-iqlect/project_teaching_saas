"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { subjects } from "@/constants";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils";

export default function SubjectFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectQuery = searchParams.get("subject") || "";

  const onClear = () => {
    const newUrl = removeKeysFromUrlQuery({
      params: searchParams.toString(),
      keysToRemove: ["subject"],
    });

    router.push(newUrl, { scroll: false });
  };

  const onValueChange = (value: string) => {
    if (value?.trim()) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "subject",
        value,
      });

      router.push(newUrl);
    } else if (pathname === "/companions") {
      onClear();
    }
  };

  return (
    <>
      <Select
        onValueChange={onValueChange}
        value={subjectQuery}
        defaultValue={subjectQuery}
      >
        <SelectTrigger className="input capitalize placeholder:normal-case">
          <SelectValue placeholder="Select subject" />
        </SelectTrigger>
        <SelectContent>
          {subjectQuery && (
            <button
              onClick={onClear}
              className="text-sm text-red-500 underline cursor-pointer w-full text-left pl-2"
            >
              Clear
            </button>
          )}
          {subjects?.map((item) => (
            <SelectItem key={item} value={item} className="capitalize">
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
