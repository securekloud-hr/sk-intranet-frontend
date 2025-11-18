import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import API from "@/config";

type Event = {
  _id?: string;
  title: string;
  date: string;
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

  return (
    <Card className="sk-card">
      <CardHeader className="pb-3">
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {events.length > 0 ? (
            events.map((event) => (
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
            <p>No upcoming events.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
