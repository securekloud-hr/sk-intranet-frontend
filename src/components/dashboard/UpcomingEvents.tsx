import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import API from "@/config";

type Event = {
  _id?: string;
  title: string;
  date: string; // ISO string or anything new Date() can parse
};

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/api/admin/events`);

        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  // 👉 Get current month & year (based on today's date)
  const now = new Date();
  const currentMonth = now.getMonth(); // 0–11
  const currentYear = now.getFullYear();

  // 👉 Filter events for ONLY the current month & year
  const currentMonthEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    })
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime() // sort by date ascending
    );

  return (
    <Card className="sk-card">
      <CardHeader className="pb-3">
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {currentMonthEvents.length > 0 ? (
            currentMonthEvents.map((event) => (
              <div key={event._id} className="flex items-start space-x-3">
                <div className="mt-1">
                  <Calendar className="h-4 w-4 text-skcloud-purple" />
                </div>
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="mt-1">
                    <span className="text-xs bg-skcloud-purple bg-opacity-10 text-skcloud-purple px-2 py-0.5 rounded-full">
                      Event
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No events this month.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
