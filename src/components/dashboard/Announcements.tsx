import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import API from "@/config";


type Announcement = {
  _id?: string;
  title: string;
  content: string;
  date?: string;
  category?: string;
};

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API}/api/admin/announcements`);
        if (!res.ok) throw new Error("Failed to fetch announcements");
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const getCategoryColor = (category: string = "General"): string => {
    switch (category) {
      case "HR":
        return "bg-blue-100 text-blue-800";
      case "Policies":
        return "bg-amber-100 text-amber-800";
      case "Employee Engagement":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p>Loading announcements...</p>;

  return (
    <Card className="sk-card">
      <CardHeader className="pb-3">
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <div
              key={a._id}
              className="flex flex-col space-y-2 border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{a.title}</h4>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {a.date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(
                        a.category
                      )}`}
                    >
                      {a.category || "General"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No announcements available.</p>
        )}
      </CardContent>
    </Card>
  );
}
