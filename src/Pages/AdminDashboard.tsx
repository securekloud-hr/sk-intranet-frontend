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
  imageUrl?: string; // 👈 NEW
}

interface Event {
  _id: string;
  title: string;
  date: string;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [announcementImage, setAnnouncementImage] = useState<File | null>(null); // 👈 NEW

  const [newEvent, setNewEvent] = useState({ title: "", date: "" });

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
        formData.append("image", payload.imageFile); // 👈 must match upload.single("image") on backend
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

  // ✅ Add event
  const addEvent = useMutation({
    mutationFn: (event: { title: string; date: string }) =>
      api(`${API}/api/admin/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setNewEvent({ title: "", date: "" });
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

      {/* 🔹 Tab strip like HR: Resources / HR Team / HR Forms */}
      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="employees">Employee Directory</TabsTrigger>
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
              <div className="flex flex-col md:flex-row gap-2">
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
                <Button onClick={() => addEvent.mutate(newEvent)}>Add</Button>
              </div>

              <ul className="space-y-2">
                {events.map((ev) => (
                  <li
                    key={ev._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>
                      {ev.title} —{" "}
                      {new Date(ev.date).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Button
                      variant="destructive"
                      onClick={() => deleteEvent.mutate(ev._id)}
                    >
                      Delete
                    </Button>
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
      </Tabs>
    </div>
  );
}
