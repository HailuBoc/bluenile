// utils/getCurrentUserId.js
import { getSession } from "next-auth/react";

export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id || null;
}
