"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create a companion");
  }

  return data?.[0];
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient();
  const { userId } = await auth();

  let query = supabase.from("companions").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error || !companions) {
    throw new Error(error?.message || "Failed to fetch the companions");
  }

  const companionIds = companions?.map(({ id }) => id);

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select()
    .eq("user_id", userId)
    .in("companion_id", companionIds);

  const marks = new Set(bookmarks?.map(({ companion_id }) => companion_id));

  // Add a bookmarked property to each companion

  companions.forEach((companion) => {
    companion.bookmarked = marks.has(companion.id);
  });

  return companions;

  // const companionsWithDetails =
  //   (await Promise.all(
  //     companions?.map(async (companion) => {
  //       let bookmarked = false;
  //
  //       const { data, error } = await supabase
  //         .from("bookmarks")
  //         .select()
  //         .eq("companion_id", companion?.id)
  //         .eq("user_id", userId);
  //
  //       if (error || !data) {
  //         bookmarked = false;
  //       } else if (data?.length) {
  //         bookmarked = true;
  //       }
  //
  //       return { ...(companion || {}), bookmarked };
  //     }),
  //   )) || [];
  //
  // return companionsWithDetails;
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id);

  if (error || !data) {
    throw new Error(error?.message || "Failed to fetch the companion");
  }

  return data?.[0];
};

export const addCompanionToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .insert({ companion_id: companionId, user_id: userId });

  if (error) {
    throw new Error(
      error?.message || "Failed to add the companion to session history",
    );
  }

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    throw new Error(error?.message || "Failed to fetch the recent sessions");
  }

  return data?.map(({ companions }) => companions);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    throw new Error(
      error?.message ||
        "Failed to fetch the recent sessions for the user " + userId,
    );
  }

  return data?.map(({ companions }) => companions);
};

export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error || !data) {
    throw new Error(
      error?.message || "Failed to fetch the companions for the user " + userId,
    );
  }

  return data;
};

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  const hasCorePlan = has({ plan: "core" });
  const hasProPlan = has({ plan: "pro" });

  let limit = 3; // Limit is 3 in the basic plan

  if (hasProPlan) {
    return true;
  } else if (hasCorePlan) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) {
    throw new Error(
      error?.message ||
        "Failed to fetch the companion data for the user " + userId,
    );
  }

  const companionCount = data?.length || 0;

  if (companionCount >= limit) {
    return false;
  } else {
    return true;
  }
};

export const addCompanionToBookmark = async (
  companionId: string,
  path: string,
) => {
  const { userId } = await auth();
  if (!userId) return;

  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("bookmarks")
    .insert({ companion_id: companionId, user_id: userId });

  if (error) {
    throw new Error(error?.message || "Failed to bookmark the companion");
  }

  revalidatePath(path);
};

export const removeCompanionFromBookmark = async (
  companionId: string,
  path: string,
) => {
  const { userId } = await auth();
  if (!userId) return;

  const supabase = createSupabaseClient();

  const response = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);

  if (!response?.status) {
    throw new Error("Failed to remove the companion from bookmarks");
  }

  revalidatePath(path);
};

export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();

  const query = supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId);

  const { data, error } = await query;

  if (error || !data) {
    throw new Error(
      error?.message ||
        "Failed to fetch the bookmarked companions for the user " + userId,
    );
  }

  return data?.map(({ companions }) => companions);
};

// export const companionBookmarkPermissions = async () => {
//   const { has } = await auth();
//
//   const hasCorePlan = has({ plan: "core" });
//   const hasProPlan = has({ plan: "pro" });
//
//   if (hasProPlan || hasCorePlan) {
//     return true;
//   } else {
//     return false;
//   }
// };
