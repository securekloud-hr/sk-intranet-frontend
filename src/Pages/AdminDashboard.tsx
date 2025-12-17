import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import API from "@/config";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ✅ Reusable fetch API wrapper
const api = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// ✅ Types
interface Announcement {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

type EventType = "Wellness" | "Holidays/Festivals" | "Sports/Entertainment";

interface Event {
  _id: string;
  title: string;
  date: string;
  type?: EventType;
  description?: string;
  registrationOpen?: boolean;
}
interface Registration {
  _id: string;
  user: string;
  email: string;
  empId?: string;      // ✅ new
  eventId: string;
  eventName: string;
  createdAt?: string;
}


export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [announcementImage, setAnnouncementImage] = useState<File | null>(null);

  const initialEventState = {
    title: "",
    date: "",
    type: "Wellness" as EventType,
    description: "",
    registrationOpen: false,
  };

  const [newEvent, setNewEvent] = useState(initialEventState);

  // Employee Directory Upload
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Holiday PDF → Mongo states
  const [holidayFile, setHolidayFile] = useState<File | null>(null);
  const [holidayYear, setHolidayYear] = useState<number>(
    new Date().getFullYear()
  );
  const [holidayRegion, setHolidayRegion] = useState<string>("IN");
  const [holidayBusy, setHolidayBusy] = useState<boolean>(false);

  // 🔹 Registrations dialog state
  const [regDialogOpen, setRegDialogOpen] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regEventTitle, setRegEventTitle] = useState<string>("");

  // ✅ Fetch announcements
  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: () => api(`${API}/api/admin/announcements`),
  });

  // ✅ Fetch events
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => api(`${API}/api/admin/events`),
  });

  // ✅ Add announcement (with optional image)
  const addAnnouncement = useMutation({
    mutationFn: (payload: {
      title: string;
      content: string;
      imageFile?: File | null;
    }) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      if (payload.imageFile) {
        formData.append("image", payload.imageFile);
      }

      return fetch(`${API}/api/admin/announcements`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setNewAnnouncement({ title: "", content: "" });
      setAnnouncementImage(null);
      toast({ title: "✅ Announcement added successfully" });
    },
    onError: (err: any) => {
      toast({
        title: "❌ Failed to add announcement",
        description: err.message,
      });
    },
  });

  // ✅ Delete announcement
  const deleteAnnouncement = useMutation({
    mutationFn: (id: string) =>
      api(`${API}/api/admin/announcements/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "🗑️ Announcement deleted" });
    },
    onError: (err: any) => {
      toast({
        title: "❌ Failed to delete announcement",
        description: err.message,
      });
    },
  });

  // ✅ Add event (now with type, description, registrationOpen)
  const addEvent = useMutation({
    mutationFn: (event: {
      title: string;
      date: string;
      type: EventType;
      description: string;
      registrationOpen: boolean;
    }) =>
      api(`${API}/api/admin/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setNewEvent(initialEventState);
      toast({ title: "✅ Event added successfully" });
    },
    onError: (err: any) => {
      toast({ title: "❌ Failed to add event", description: err.message });
    },
  });

  // ✅ Delete event
  const deleteEvent = useMutation({
    mutationFn: (id: string) =>
      api(`${API}/api/admin/events/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "🗑️ Event deleted" });
    },
    onError: (err: any) => {
      toast({ title: "❌ Failed to delete event", description: err.message });
    },
  });

  // 🔹 View registrations for an event
      const handleViewRegistrations = async (ev: Event) => {
  if (!ev._id) return;

  setRegDialogOpen(true);
  setRegLoading(true);
  setRegError(null);
  setRegistrations([]);
  setRegEventTitle(ev.title);

  try {
    // ✅ correct backend URL
    const res = await fetch(`${API}/api/registerEvent/event/${ev._id}`);

    if (!res.ok) throw new Error(await res.text());

    // ✅ backend returns { success, count, data }
    const json = await res.json();
    const list: Registration[] = Array.isArray(json)
      ? json
      : (json.data as Registration[]) || [];

    setRegistrations(list);
  } catch (err: any) {
    console.error("Error fetching registrations:", err);
    setRegError(err.message || "Failed to load registrations");
  } finally {
    setRegLoading(false);
  }
};

  // ✅ Upload Employee Directory Excel
  const handleEmployeeUpload = async () => {
    if (!selectedFile) {
      toast({ title: "⚠️ Please select an Excel file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    setUploading(true);

    try {
      const res = await fetch(`${API}/api/employeedirectory/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "✅ Employee Directory updated successfully!" });
      } else {
        toast({ title: "❌ Upload failed", description: data.error });
      }
    } catch (err: any) {
      toast({ title: "❌ Error uploading Excel", description: err.message });
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  // ✅ Upload Leave Balance  Excel
  const handleLeaveBalanceUpload = async () => {
    if (!selectedFile) {
      toast({ title: "⚠️ Please select an Excel file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    setUploading(true);

    try {
      const res = await fetch(`${API}/api/employeedirectory/leavebal`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "✅ Leave Balance updated successfully!" });
      } else {
        toast({ title: "❌ Upload failed", description: data.error });
      }
    } catch (err: any) {
      toast({ title: "❌ Error uploading Excel", description: err.message });
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };


  // 🔹 Upload & Extract Holiday PDF → MongoDB
  const handleHolidayPdfIngest = async () => {
    if (!holidayFile) {
      toast({ title: "⚠️ Please select a Holiday PDF first." });
      return;
    }
    if (!holidayYear) {
      toast({ title: "⚠️ Please enter a valid Year." });
      return;
    }

    const form = new FormData();
    form.append("file", holidayFile);
    form.append("year", String(holidayYear));
    form.append("region", holidayRegion.toUpperCase());

    setHolidayBusy(true);
    try {
      const res = await fetch(`${API}/api/holidays/ingest-pdf`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }
      const data = await res.json();

      toast({
        title: "✅ Holiday PDF processed",
        description: `Detected ${data.detectedRows}, Upserts ${data.upserts}, Modified ${data.modified}`,
      });
    } catch (err: any) {
      toast({ title: "❌ Holiday ingest failed", description: err.message });
    } finally {
      setHolidayBusy(false);
      setHolidayFile(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header – same style as HR page */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage announcements, events, employee data, and holidays.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList className="grid  max-w-[45vw] grid-cols-5" >
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="employees">Employee Directory</TabsTrigger>
          <TabsTrigger value="leave">Leave Balance</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>

        {/* === Announcements === */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>
                Create and remove announcements visible on the intranet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Inputs */}
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                />
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Content"
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      content: e.target.value,
                    })
                  }
                />
              </div>

              {/* Image + Add button */}
              <div className="flex flex-col md:flex-row items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded w-full md:w-64"
                  onChange={(e) =>
                    setAnnouncementImage(e.target.files?.[0] || null)
                  }
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                  onClick={() =>
                    addAnnouncement.mutate({
                      ...newAnnouncement,
                      imageFile: announcementImage,
                    })
                  }
                >
                  Add
                </Button>
              </div>

              {announcementImage && (
                <p className="text-xs text-muted-foreground">
                  Selected image: <strong>{announcementImage.name}</strong>
                </p>
              )}

              {/* List */}
              <ul className="space-y-2">
                {announcements.map((a) => (
                  <li
                    key={a._id}
                    className="flex justify-between items-center border-b py-2 gap-4"
                  >
                    <div className="flex items-start gap-3">
                      {a.imageUrl && (
                        <img
                          src={a.imageUrl}
                          alt={a.title}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{a.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.content}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => deleteAnnouncement.mutate(a._id)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
                {announcements.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No announcements yet.
                  </p>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Events === */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Add or delete events shown to all employees.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
                <select
                  className="border p-2 rounded"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      type: e.target.value as EventType,
                    })
                  }
                >
                  <option value="Wellness">Wellness</option>
                  <option value="Holidays/Festivals">Holidays/Festivals</option>
                  <option value="Sports/Entertainment">
                    Sports/Entertainment
                  </option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newEvent.registrationOpen}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        registrationOpen: e.target.checked,
                      })
                    }
                  />
                  Registration
                </label>
              </div>

              <textarea
                className="border p-2 rounded w-full"
                placeholder="Event Description"
                rows={2}
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    description: e.target.value,
                  })
                }
              />

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                onClick={() =>
                  addEvent.mutate({
                    title: newEvent.title,
                    date: newEvent.date,
                    type: newEvent.type,
                    description: newEvent.description,
                    registrationOpen: newEvent.registrationOpen,
                  })
                }
              >
                Add
              </Button>

              {/* List */}
              <ul className="space-y-2">
                {events.map((ev) => (
                  <li
                    key={ev._id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center border-b py-2 gap-2"
                  >
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(ev.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        {ev.type && ` • ${ev.type}`}
                        {ev.registrationOpen ? " • Registration Open" : ""}
                      </div>
                      {ev.description && (
                        <div className="text-xs text-gray-600">
                          {ev.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRegistrations(ev)}
                      >
                        View Registrations
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEvent.mutate(ev._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
                {events.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No events configured.
                  </p>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Employee Directory === */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory Upload</CardTitle>
              <CardDescription>
                Upload an Excel file to refresh the employee directory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) =>
                    setSelectedFile(e.target.files?.[0] || null)
                  }
                  className="border p-2 rounded w-full"
                />
                <Button onClick={handleEmployeeUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Selected file: <strong>{selectedFile.name}</strong>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Leave Balance === */}
        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Leave BalanceUpload</CardTitle>
              <CardDescription>
                Upload an Excel file to upload the leave balance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) =>
                    setSelectedFile(e.target.files?.[0] || null)
                  }
                  className="border p-2 rounded w-full"
                />
                <Button onClick={handleLeaveBalanceUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Selected file: <strong>{selectedFile.name}</strong>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Holidays === */}
        <TabsContent value="holidays">
          <Card>
            <CardHeader>
              <CardTitle>Holiday PDF → MongoDB (Extract)</CardTitle>
              <CardDescription>
                Upload a holiday calendar PDF. The server will parse and save
                holidays.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <input
                  type="number"
                  className="border p-2 rounded w-32"
                  value={holidayYear}
                  onChange={(e) => setHolidayYear(Number(e.target.value))}
                  placeholder="Year"
                />
                <input
                  className="border p-2 rounded w-32"
                  value={holidayRegion}
                  onChange={(e) =>
                    setHolidayRegion(e.target.value.toUpperCase())
                  }
                  placeholder="Region (e.g. IN)"
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setHolidayFile(e.target.files?.[0] || null)
                  }
                  className="border p-2 rounded w-full"
                />
                <Button onClick={handleHolidayPdfIngest} disabled={holidayBusy}>
                  {holidayBusy ? "Processing…" : "Upload & Extract"}
                </Button>
              </div>
              {holidayFile && (
                <p className="text-sm text-gray-600">
                  Selected file: <strong>{holidayFile.name}</strong>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Backend route <code>POST /api/holidays/ingest-pdf</code>{" "}
                parses dates like <code>01 January 2025</code>,{" "}
                <code>26-01-2025</code>, <code>Jan 26, 2025</code> and stores
                them in MongoDB.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🔹 Registrations Dialog */}
        <Dialog open={regDialogOpen} onOpenChange={setRegDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrations for {regEventTitle}</DialogTitle>
            </DialogHeader>

            {regLoading && <p>Loading registrations…</p>}

            {!regLoading && regError && (
              <p className="text-sm text-red-600">{regError}</p>
            )}

            {!regLoading && !regError && registrations.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No one has registered for this event yet.
              </p>
            )}

            {!regLoading && !regError && registrations.length > 0 && (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
               {registrations.map((r) => (
  <li
    key={r._id}
    className="border rounded-md p-2 text-sm space-y-0.5"
  >
    <div className="font-medium">
      {r.user}
      {r.empId && (
        <span className="ml-1 text-xs text-muted-foreground">
          ({r.empId})
        </span>
      )}
    </div>
    <div className="text-muted-foreground">{r.email}</div>
    {r.createdAt && (
      <div className="text-xs text-muted-foreground">
        Registered on {new Date(r.createdAt).toLocaleString()}
      </div>
    )}
  </li>
))}

              </ul>
            )}
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
}
