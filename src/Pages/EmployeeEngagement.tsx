import { useEffect, useState } from "react";
import { Calendar, Users, Trophy, Heart } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import API from "@/config";

// ---------------------- Types ----------------------

interface EventPhotoGalleryProps {
  photos: string[];
  eventName: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: "Wellness" | "Holidays/Festivals" | "Sports/Entertainment" | "BOM-Birthdays of the Month";
  registrationOpen?: boolean;
  images?: string[];
  folder?: string;
  imageCount?: number;
  details?: { name: string; date: string; employeeId?: string }[];
  // 👇 used for dynamic BOM API
  month?: number; // 1–12
}

interface BirthdayEmployee {
  empId: string;
  name: string;
  birthday: string; // "21/06"
}

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

// ---------------------- Components ----------------------

const EventPhotoGallery = ({ photos, eventName }: EventPhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <Card
            key={idx}
            className="overflow-hidden rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <CardContent className="p-0">
              <img
                src={photo}
                alt={`${eventName} ${idx + 1}`}
                className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          {selectedPhoto && (
            <img src={selectedPhoto} alt="Selected Event" className="w-full h-auto rounded-xl" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EmployeeEngagement: React.FC = () => {
  // ---------- State ----------
  const [activeSection, setActiveSection] = useState<"upcoming" | "past">("upcoming");
  const [activeCategory, setActiveCategory] = useState<
    "all" | "Wellness" | "Holidays/Festivals" | "Sports/Entertainment" | "BOM-Birthdays of the Month"
  >("all");

  const [dynamicPastEvents, setDynamicPastEvents] = useState<Partial<Event>[]>([]);
  const [selectedPastEvent, setSelectedPastEvent] = useState<Partial<Event> | null>(null);

  const [selectedBomEvent, setSelectedBomEvent] = useState<Event | null>(null);
  const [bomBirthdays, setBomBirthdays] = useState<BirthdayEmployee[]>([]);
  const [bomLoading, setBomLoading] = useState(false);
  const [bomError, setBomError] = useState<string | null>(null);

  // ---------- Derived ----------
  // For now treat all events as upcoming so nothing is hidden
  const upcomingEvents = events;

  const filteredEvents =
    activeSection === "upcoming"
      ? activeCategory === "all"
        ? upcomingEvents
        : upcomingEvents.filter((event) => event.type === activeCategory)
      : [];

  // ---------- Effects ----------

  // Past events (photos) — from /api/past-events
  useEffect(() => {
    if (activeSection === "past") {
      fetch(`${API}/api/past-events`)
        .then((res) => res.json())
        .then((data) => setDynamicPastEvents(data))
        .catch((err) => {
          console.error("Error fetching past events:", err);
          setDynamicPastEvents([]);
        });
    }
  }, [activeSection]);

  // Load BOM birthdays dynamically when a BOM event is selected
  useEffect(() => {
    if (!selectedBomEvent || selectedBomEvent.type !== "BOM-Birthdays of the Month") {
      return;
    }

    if (!selectedBomEvent.month) {
      setBomBirthdays([]);
      setBomError("No month configured for this BOM event.");
      return;
    }

    const month = selectedBomEvent.month;

    setBomLoading(true);
    setBomError(null);
    setBomBirthdays([]);

    fetch(`${API}/api/birthdays/bom?month=${month}`)

      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data: BirthdayEmployee[]) => {
        setBomBirthdays(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching BOM birthdays:", err);
        setBomError("Failed to load birthdays. Please try again later.");
      })
      .finally(() => setBomLoading(false));
  }, [selectedBomEvent]);

  // ---------- Render ----------

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Employee Engagement</h1>
        <p className="text-muted-foreground">Connect, participate, and grow with your colleagues</p>
      </div>

      <div>
        <div className="grid w-full grid-cols-5 max-w-[600px]">
          <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-securekloud-700" />
          </div>
          <h2 className="text-2xl font-bold">Events</h2>
        </div>

        {/* Section toggle */}
        <div className="flex gap-4 mt-4">
          <Button
            variant={activeSection === "upcoming" ? "default" : "outline"}
            onClick={() => {
              setActiveSection("upcoming");
              setActiveCategory("all");
            }}
          >
            Upcoming Events
          </Button>
          <Button
            variant={activeSection === "past" ? "default" : "outline"}
            onClick={() => {
              setActiveSection("past");
              setActiveCategory("all");
            }}
          >
            Past Events
          </Button>
        </div>

        {/* Category filters for upcoming */}
        {activeSection === "upcoming" && (
          <div className="flex gap-4 mt-4 flex-wrap">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => setActiveCategory("all")}
            >
              All Events
            </Button>
            <Button
              variant={activeCategory === "Wellness" ? "default" : "outline"}
              onClick={() => setActiveCategory("Wellness")}
            >
              Wellness
            </Button>
            <Button
              variant={activeCategory === "Holidays/Festivals" ? "default" : "outline"}
              onClick={() => setActiveCategory("Holidays/Festivals")}
            >
              Holidays/Festivals
            </Button>
            <Button
              variant={activeCategory === "Sports/Entertainment" ? "default" : "outline"}
              onClick={() => setActiveCategory("Sports/Entertainment")}
            >
              Sports/Entertainment
            </Button>
            <Button
              variant={activeCategory === "BOM-Birthdays of the Month" ? "default" : "outline"}
              onClick={() => setActiveCategory("BOM-Birthdays of the Month")}
            >
              BOM-Birthdays
            </Button>
          </div>
        )}

        {/* Past events with photo gallery */}
        {activeSection === "past" ? (
          <div className="mt-6">
            <label htmlFor="past-events" className="block font-medium mb-2">
              Past Events
            </label>
            <select
              id="past-events"
              className="w-full p-2 border rounded"
              onChange={(e) => {
                const selectedEventId = e.target.value;
                const selected = dynamicPastEvents.find((ev) => ev.id === selectedEventId) || null;
                setSelectedPastEvent(selected);
              }}
            >
              <option value="">-- Select a past event --</option>
              {dynamicPastEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>

            {selectedPastEvent && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">{selectedPastEvent.title} Photos</h3>
                {selectedPastEvent.images && selectedPastEvent.images.length > 0 ? (
                  <EventPhotoGallery
                    photos={selectedPastEvent.images as string[]}
                    eventName={selectedPastEvent.title as string}
                  />
                ) : (
                  <p className="text-muted-foreground">No images available for this event.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          // Upcoming events grid
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onViewDetails={(ev) => setSelectedBomEvent(ev)} />
            ))}
          </div>
        )}
      </div>

      {/* BOM / Event Details Dialog */}
      <Dialog
        open={!!selectedBomEvent}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBomEvent(null);
            setBomBirthdays([]);
            setBomError(null);
            setBomLoading(false);
          }
        }}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{selectedBomEvent?.title || "Event Details"}</DialogTitle>
            <DialogDescription>
              {/* If not BOM, just show description */}
              {selectedBomEvent?.type !== "BOM-Birthdays of the Month" && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedBomEvent?.description || "Event details are not available."}
                </p>
              )}

              {/* BOM: Birthdays of the Month */}
              {selectedBomEvent?.type === "BOM-Birthdays of the Month" && (
                <div className="mt-4">
                  {bomLoading && <p>Loading birthdays…</p>}

                  {!bomLoading && bomError && (
                    <p className="text-sm text-red-600">{bomError}</p>
                  )}

                  {!bomLoading && !bomError && bomBirthdays.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No birthdays found for this month.
                    </p>
                  )}

                  {!bomLoading && !bomError && bomBirthdays.length > 0 && (
                    <div className="max-h-[600px] overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {bomBirthdays.map((bd) => (
                          <div
                            key={bd.empId}
                            className="flex flex-col items-center p-3 border rounded-lg shadow bg-white"
                          >
                            <img
                              src={`/employee-images/${bd.empId}.jpg`}
                              alt={bd.name}
                              className="w-24 h-24 rounded-full object-cover mb-2"
                              onError={(e) => {
                                const currentSrc = e.currentTarget.src;
                                if (currentSrc.endsWith(".jpg")) {
                                  e.currentTarget.src = `/employee-images/${bd.empId}.png`;
                                } else {
                                  e.currentTarget.src = "/employee-images/default-avatar.jpg";
                                }
                              }}
                            />
                            <p className="text-sm font-medium text-center">{bd.name}</p>
                            <p className="text-xs text-gray-500">{bd.birthday}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ---------------------- EventCard ----------------------

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Wellness":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Holidays/Festivals":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Sports/Entertainment":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "BOM-Birthdays of the Month":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Wellness":
        return Heart;
      case "Holidays/Festivals":
        return Calendar;
      case "Sports/Entertainment":
        return Trophy;
      case "BOM-Birthdays of the Month":
        return Users;
      default:
        return Calendar;
    }
  };

  const EventIcon = getEventIcon(event.type);

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);
    setStatusMsg("Submitting...");

    try {
      const res = await fetch(`${API}/api/registerEvent/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.title,
          user: "Current User", // TODO: wire real user
          email: "user@example.com", // TODO: wire real email
        }),
      });

      if (res.ok) {
        setStatusMsg("✅ Successfully registered!");
      } else {
        setStatusMsg("❌ Failed to register. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("⚠️ Network error while registering.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setStatusMsg("");
      }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <Badge className={getBadgeVariant(event.type)}>{event.type}</Badge>
          {event.registrationOpen && (
            <Badge variant="outline" className="bg-green-50 text-green-800">
              Registration Open
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center mt-1">
            <EventIcon className="h-5 w-5 text-securekloud-700" />
          </div>
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>
              {event.date} {event.location && `at ${event.location}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

        <div className="flex flex-col gap-2 mt-4">
          {event.registrationOpen && (
            <Button
              onClick={handleRegister}
              disabled={loading}
              className={`flex-1 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Submitting..." : "Register Now"}
            </Button>
          )}

          <Button className="flex-1" variant="outline" onClick={() => onViewDetails(event)}>
            View Details
          </Button>

          {statusMsg && (
            <p className="text-center text-sm text-gray-600 mt-1">{statusMsg}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeEngagement;

// ---------------------- Static Events ----------------------
// NOTE: For BOM events we add `month` so the API knows which month to query.

const events: Event[] = [
  {
    id: "4",
    title: "BOM: April Birthdays",
    date: "April 30, 2025",
    location: "",
    description: "Celebrating all April birthdays.",
    type: "BOM-Birthdays of the Month",
    month: 4,
  },
  {
    id: "8",
    title: "BOM: May Birthdays",
    date: "May 31, 2025",
    location: "",
    description: "Celebrating all May birthdays.",
    type: "BOM-Birthdays of the Month",
    month: 5,
  },
  {
    id: "12",
    title: "BOM: June Birthdays",
    date: "June 30, 2025",
    location: "",
    description: "Celebrating all June birthdays.",
    type: "BOM-Birthdays of the Month",
    month: 6,
  },
  {
    id: "17",
    title: "BOM: July Birthdays",
    date: "July 31, 2025",
    location: "",
    description: "Celebrating all July birthdays.",
    type: "BOM-Birthdays of the Month",
    month: 7,
  },
  // ... keep all your other non-BOM events exactly as before ...
  // Just ensure each BOM event has the correct `month`:
  // August = 8, September = 9, October = 10, November = 11, December = 12, etc.
];
