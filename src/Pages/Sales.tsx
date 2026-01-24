import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ================= TYPES ================= */
type SalesEntry = {
  id: number;
  date: string;
  callsMade: number;
  netNewMeeting: number;
  followUpMeeting: number;
  qualifiedMeeting: number;
  meetingsDone: number;
  emailsOutgoing: number;
  whatsappMessage: number;
  dealWon: number;
};

type FilterType = "daily" | "weekly" | "monthly";

const Sales = () => {
  /* ================= DATE ================= */
  const today = new Date().toISOString().split("T")[0];

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    date: today,
    callsMade: 0,
    netNewMeeting: 0,
    followUpMeeting: 0,
    qualifiedMeeting: 0,
    emailsOutgoing: 0,
    whatsappMessage: 0,
    dealWon: 0,
  });

  /* ================= TABLE STATE ================= */
  const [salesData, setSalesData] = useState<SalesEntry[]>([
    {
      id: 1,
      date: "2026-01-24",
      callsMade: 10,
      netNewMeeting: 4,
      followUpMeeting: 3,
      qualifiedMeeting: 2,
      meetingsDone: 19,
      emailsOutgoing: 12,
      whatsappMessage: 6,
      dealWon: 1,
    },
    {
      id: 2,
      date: "2026-01-23",
      callsMade: 7,
      netNewMeeting: 2,
      followUpMeeting: 1,
      qualifiedMeeting: 1,
      meetingsDone: 11,
      emailsOutgoing: 8,
      whatsappMessage: 4,
      dealWon: 0,
    },
  ]);

  const [filter, setFilter] = useState<FilterType>("daily");

  /* ================= CALCULATIONS ================= */
  const meetingsDone =
    formData.callsMade +
    formData.netNewMeeting +
    formData.followUpMeeting +
    formData.qualifiedMeeting;

  const totalMeetings = salesData.reduce(
    (sum, item) => sum + item.meetingsDone,
    0
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "date" ? value : Number(value),
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    const newEntry: SalesEntry = {
      id: Date.now(),
      ...formData,
      meetingsDone,
    };

    setSalesData((prev) => [newEntry, ...prev]);

    // reset but keep today's date
    setFormData({
      date: today,
      callsMade: 0,
      netNewMeeting: 0,
      followUpMeeting: 0,
      qualifiedMeeting: 0,
      emailsOutgoing: 0,
      whatsappMessage: 0,
      dealWon: 0,
    });
  };

  /* ================= FILTER LOGIC ================= */
  const filteredSales = salesData.filter((entry) => {
    if (filter === "daily") return true; // Daily = ALL DATA

    const entryDate = new Date(entry.date);
    const now = new Date();

    if (filter === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return entryDate >= weekAgo;
    }

    if (filter === "monthly") {
      return (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  const filteredTotalMeetings = filteredSales.reduce(
    (sum, item) => sum + item.meetingsDone,
    0
  );

  return (
    <div className="space-y-10 p-6 max-w-7xl">
      {/* ================= FORM ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Sales Daily Tracker</h1>

        <div className="mb-6">
          <Label>Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-64"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="border rounded-lg overflow-hidden">
            <h2 className="font-semibold px-4 py-2 bg-muted">
              Meetings & Calls
            </h2>
            <table className="w-full border-collapse">
              <tbody>
                <Row label="Calls made" value={formData.callsMade} onChange={(v) => handleChange("callsMade", v)} />
                <Row label="Net new meeting" value={formData.netNewMeeting} onChange={(v) => handleChange("netNewMeeting", v)} />
                <Row label="Follow-up meeting" value={formData.followUpMeeting} onChange={(v) => handleChange("followUpMeeting", v)} />
                <Row label="Qualified meeting" value={formData.qualifiedMeeting} onChange={(v) => handleChange("qualifiedMeeting", v)} />
                <tr className="bg-muted font-semibold">
                  <td className="border px-4 py-2">Meetings done</td>
                  <td className="border px-4 py-2">{meetingsDone}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RIGHT */}
          <div className="border rounded-lg overflow-hidden">
            <h2 className="font-semibold px-4 py-2 bg-muted">
              Outreach & Result
            </h2>
            <table className="w-full border-collapse">
              <tbody>
                <Row label="Emails outgoing" value={formData.emailsOutgoing} onChange={(v) => handleChange("emailsOutgoing", v)} />
                <Row label="WhatsApp message" value={formData.whatsappMessage} onChange={(v) => handleChange("whatsappMessage", v)} />
                <Row label="Deal won" value={formData.dealWon} onChange={(v) => handleChange("dealWon", v)} />
              </tbody>
            </table>
          </div>
        </div>

        <Button className="mt-6" onClick={handleSubmit}>
          Save Sales Data
        </Button>
      </div>

      {/* ================= HISTORY TABLE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Activity</CardTitle>
          <CardDescription>
            <div className="flex gap-2 mt-3">
              {["daily", "weekly", "monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as FilterType)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                    filter === t
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Calls</TableHead>
                <TableHead>Net New</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead>Qualified</TableHead>
                <TableHead>Meetings</TableHead>
                <TableHead>Emails</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Deals</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSales.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                  <TableCell>{s.callsMade}</TableCell>
                  <TableCell>{s.netNewMeeting}</TableCell>
                  <TableCell>{s.followUpMeeting}</TableCell>
                  <TableCell>{s.qualifiedMeeting}</TableCell>
                  <TableCell>{s.meetingsDone}</TableCell>
                  <TableCell>{s.emailsOutgoing}</TableCell>
                  <TableCell>{s.whatsappMessage}</TableCell>
                  <TableCell>{s.dealWon}</TableCell>
                </TableRow>
              ))}

              {/* TOTAL ROW */}
              <TableRow className="font-semibold bg-muted">
                <TableCell>Total</TableCell>
                <TableCell colSpan={4}></TableCell>
                <TableCell>{filteredTotalMeetings}</TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;

/* ================= ROW ================= */
const Row = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) => (
  <tr>
    <td className="border px-4 py-2">{label}</td>
    <td className="border px-4 py-2 w-40">
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </td>
  </tr>
);
