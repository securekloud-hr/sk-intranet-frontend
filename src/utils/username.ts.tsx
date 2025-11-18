import { useEffect, useState } from "react";

interface User {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);

        // 1️⃣ Try getting user from localStorage
        const storedUser = localStorage.getItem("user");
        const storedUserId = localStorage.getItem("userId");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } 
        else if (storedUserId) {
          // 2️⃣ Fetch from backend if we only have userId
          const res = await fetch(`http://localhost:5000/api/auth/user/${storedUserId}`);
          if (!res.ok) throw new Error("Failed to fetch user from backend");
          const data = await res.json();
          setUser({
            id: data._id,
            name: data.username || data.name,
            fullName: data.fullName || data.username,
            email: data.email,
          });
          // Optionally cache it
          localStorage.setItem("user", JSON.stringify(data));
        } 
        else {
          setError("No user found");
        }
      } catch (err: any) {
        console.error("❌ Error fetching user:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}
