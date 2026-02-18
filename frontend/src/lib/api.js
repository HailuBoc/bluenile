import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Axios instance with auth headers
const api = axios.create({
  baseURL: baseUrl,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// Generic fetcher for SWR
const fetcher = async (url) => {
  const res = await api.get(url);
  return res.data;
};

// Admin Dashboard Hooks
export function useAdminBookings() {
  return useSWR("/admin", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });
}

export function useAdminUsers() {
  return useSWR("/admin/users", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });
}

export function useAdminPayments() {
  return useSWR("/admin/bookings", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });
}

export function useAdminProperties() {
  return useSWR("/admin/properties", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });
}

export function useAdminCancellations() {
  return useSWR("/cancellations", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });
}

export function useDashboardStats() {
  return useSWR("/api/stats/dashboard", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
}

export function useQuickStats() {
  return useSWR("/api/stats/quick", fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: false,
  });
}

// Mutation hooks for actions
export function useVerifyBooking() {
  return useSWRMutation(
    "/admin/verify",
    async (url, { arg }) => {
      const res = await api.post(`${url}/${arg.id}`, { verified: arg.verified });
      return res.data;
    }
  );
}

export function useDeleteUser() {
  return useSWRMutation(
    "/admin/users",
    async (url, { arg }) => {
      const res = await api.delete(`${url}/${arg.id}`);
      return res.data;
    }
  );
}

export function useDeleteBooking() {
  return useSWRMutation(
    "/admin/bookings",
    async (url, { arg }) => {
      const res = await api.delete(`${url}/${arg.id}`);
      return res.data;
    }
  );
}

export function useUpdatePropertyStatus() {
  return useSWRMutation(
    "/admin/properties",
    async (url, { arg }) => {
      const res = await api.patch(`${url}/${arg.id}/status`, { status: arg.status });
      return res.data;
    }
  );
}

export function useApproveCancellation() {
  return useSWRMutation(
    "/cancellations",
    async (url, { arg }) => {
      const res = await api.put(`${url}/${arg.id}/approve`);
      return res.data;
    }
  );
}

export function useRejectCancellation() {
  return useSWRMutation(
    "/cancellations",
    async (url, { arg }) => {
      const res = await api.put(`${url}/${arg.id}/reject`);
      return res.data;
    }
  );
}

export function useDeleteCancellation() {
  return useSWRMutation(
    "/cancellations",
    async (url, { arg }) => {
      const res = await api.delete(`${url}/${arg.id}`);
      return res.data;
    }
  );
}

// Regular API exports for non-SWR usage
export { api, baseUrl };
