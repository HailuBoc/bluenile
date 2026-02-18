"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export function useAdminAuth() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      router.push("/admin/login");
      return;
    }

    try {
      await axios.get(`${baseUrl}/admin/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthorized(true);
      setError(null);
    } catch (err) {
      console.error("Auth verification failed:", err);
      localStorage.removeItem("token");
      setAuthorized(false);
      setError("Session expired. Please login again.");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const handleAuthError = useCallback((err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      setAuthorized(false);
      router.push("/admin/login");
      return true;
    }
    return false;
  }, [router]);

  return {
    authorized,
    loading,
    error,
    getAuthHeaders,
    handleAuthError,
    verifyToken,
  };
}
