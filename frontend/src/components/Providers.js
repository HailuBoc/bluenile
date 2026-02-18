// src/components/Providers.jsx
"use client";

import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

async function fetcher(url) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${baseUrl}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }
    }
    throw new Error("Failed to fetch");
  }

  return res.json();
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher,
          onError: (error, key) => {
            console.error(`SWR Error for ${key}:`, error);
          },
          revalidateOnFocus: false,
          dedupingInterval: 5000,
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
