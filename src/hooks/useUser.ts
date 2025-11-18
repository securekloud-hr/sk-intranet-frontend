import { useEffect, useState } from "react";
import API from "@/config";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/api/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ VERY IMPORTANT
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Unauthorized - please login again");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } else if (res.status === 403) {
            setError("Forbidden - invalid or expired token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } else {
            setError(`HTTP ${res.status}`);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        console.error("❌ User fetch error:", err);
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
