import React, { useEffect, useMemo, useState } from "react";
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
import API from "@/config";

/* ================= TYPES ================= */
type SalesEntry = {
  _id?: string;
  empId: string;
  employeeName: string;
  role: string;
  date: string;
  callsMade: number;
  netNewMeeting: number;
  followUpMeeting: number;
  qualifiedMeeting: number;
  meetingsDone: number;
  emailsOutgoing: number;
  whatsappMessage: number;
  proposals: number;
  dealWon: number;
};

type Employee = {
  EmpID: string;
  EmployeeName: string;
  role?: string;
};

type FilterType = "daily" | "weekly" | "monthly";

/* ================= AUTH HELPER ================= */
const getLoggedEmployee = () => {
  try {
    const raw = localStorage.getItem("loggedEmployee");
    if (!raw) return null;
    return JSON.parse(raw) as {
      empId: string;
      employeeName: string;
      role: string;
    };
  } catch {
    return null;
  }
};

const Sales = () => {
  const today = new Date().toISOString().split("T")[0];
  const loggedEmployee = getLoggedEmployee();

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    date: today,
    callsMade: 0,
    netNewMeeting: 0,
    followUpMeeting: 0,
    qualifiedMeeting: 0,
    emailsOutgoing: 0,
    whatsappMessage: 0,
    proposals: 0,
    dealWon: 0,
  });

  const [salesData, setSalesData] = useState<SalesEntry[]>([]);
  const [isrs, setIsrs] = useState<Employee[]>([]);
  const [selectedISR, setSelectedISR] = useState("all");
  const [filter, setFilter] = useState<FilterType>("daily");
  const [saving, setSaving] = useState(false);

  /* ================= CALC ================= */
  const meetingsDone =
    formData.callsMade +
    formData.netNewMeeting +
    formData.followUpMeeting +
    formData.qualifiedMeeting;

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchSales();
    fetchISRs();
  }, []);

  const fetchSales = async () => {
    const res = await fetch(`${API}/api/sales`, {
      credentials: "include",
    });
    const data = await res.json();
    setSalesData(data);
  };

  const fetchISRs = async () => {
    const res = await fetch(`${API}/api/employeedirectory`, {
      credentials: "include",
    });
    const data: Employee[] = await res.json();
    setIsrs(data.filter((e) => e.role?.toLowerCase() === "isr"));
  };

  /* ================= HANDLERS ================= */
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "date" ? value : Number(value),
    }));
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    if (saving) return;

    if (!loggedEmployee) {
      alert("User not logged in");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        empId: loggedEmployee.empId,
        employeeName: loggedEmployee.employeeName,
        role: loggedEmployee.role,
        ...formData,
        meetingsDone,
      };

      const res = await fetch(`${API}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      await fetchSales();

      setFormData({
        date: today,
        callsMade: 0,
        netNewMeeting: 0,
        followUpMeeting: 0,
        qualifiedMeeting: 0,
        emailsOutgoing: 0,
        whatsappMessage: 0,
        proposals: 0,
        dealWon: 0,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredSales = useMemo(() => {
    return salesData.filter((entry) => {
      if (selectedISR !== "all" && entry.empId !== selectedISR) return false;

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
  }, [salesData, filter, selectedISR]);

  const totalMeetings = filteredSales.reduce(
    (sum, item) => sum + item.meetingsDone,
    0
  );

  /* ================= UI ================= */
  return (
    <div className="space-y-10 p-6 max-w-7xl">
      <h1 className="text-3xl font-bold">Sales Daily Tracker</h1>

      <Label>Date</Label>
      <Input
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        className="w-64"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TableBox title="Meetings & Calls">
          <Row label="Calls made" value={formData.callsMade} onChange={(v) => handleChange("callsMade", v)} />
          <Row label="Net new meeting" value={formData.netNewMeeting} onChange={(v) => handleChange("netNewMeeting", v)} />
          <Row label="Follow-up meeting" value={formData.followUpMeeting} onChange={(v) => handleChange("followUpMeeting", v)} />
          <Row label="Qualified meeting" value={formData.qualifiedMeeting} onChange={(v) => handleChange("qualifiedMeeting", v)} />
          <tr className="bg-muted font-semibold">
            <td className="border px-4 py-2">Meetings done</td>
            <td className="border px-4 py-2">{meetingsDone}</td>
          </tr>
        </TableBox>

        <TableBox title="Outreach & Result">
          <Row label="Emails outgoing" value={formData.emailsOutgoing} onChange={(v) => handleChange("emailsOutgoing", v)} />
          <Row label="WhatsApp message" value={formData.whatsappMessage} onChange={(v) => handleChange("whatsappMessage", v)} />
          <Row label="Proposals" value={formData.proposals} onChange={(v) => handleChange("proposals", v)} />
          <Row label="Deal won" value={formData.dealWon} onChange={(v) => handleChange("dealWon", v)} />
        </TableBox>
      </div>

      <Button disabled={saving} onClick={handleSubmit}>
        {saving ? "Saving..." : "Save Sales Data"}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Sales Activity</CardTitle>
          <CardDescription className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">ISR</span>
              <select
                className="border rounded px-2 py-1"
                value={selectedISR}
                onChange={(e) => setSelectedISR(e.target.value)}
              >
                <option value="all">All</option>
                {isrs.map((i) => (
                  <option key={i.EmpID} value={i.EmpID}>
                    {i.EmployeeName}
                  </option>
                ))}
              </select>
            </div>

            {["daily", "weekly", "monthly"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t as FilterType)}
                className={`px-3 py-1 rounded ${
                  filter === t ? "bg-blue-600 text-white" : "text-blue-600"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>ISR</TableHead>
                <TableHead>Calls</TableHead>
                <TableHead>Meetings</TableHead>
                <TableHead>Emails</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Proposals</TableHead>
                <TableHead>Deals</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSales.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                  <TableCell>{s.employeeName}</TableCell>
                  <TableCell>{s.callsMade}</TableCell>
                  <TableCell>{s.meetingsDone}</TableCell>
                  <TableCell>{s.emailsOutgoing}</TableCell>
                  <TableCell>{s.whatsappMessage}</TableCell>
                  <TableCell>{s.proposals}</TableCell>
                  <TableCell>{s.dealWon}</TableCell>
                </TableRow>
              ))}

              <TableRow className="font-semibold bg-muted">
                <TableCell>Total</TableCell>
                <TableCell />
                <TableCell />
                <TableCell>{totalMeetings}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;

/* ================= HELPERS ================= */
const TableBox = ({ title, children }: any) => (
  <div className="border rounded-lg overflow-hidden">
    <h2 className="font-semibold px-4 py-2 bg-muted">{title}</h2>
    <table className="w-full border-collapse">
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Row = ({ label, value, onChange }: any) => (
  <tr>
    <td className="border px-4 py-2">{label}</td>
    <td className="border px-4 py-2">
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </td>
  </tr>
);
