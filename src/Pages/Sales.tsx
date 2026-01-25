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

  createdAt?: string;
  updatedAt?: string;
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
  const todayISO = new Date().toISOString().split("T")[0];
  const loggedEmployee = getLoggedEmployee();

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    date: todayISO,
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

  // New state for month/week selection
  const [selectedMonth, setSelectedMonth] = useState(""); // format: "YYYY-M" where M is monthIndex
  const [selectedWeek, setSelectedWeek] = useState(""); // ISO start-of-week string

  const [lastLoadedDate, setLastLoadedDate] = useState<string | null>(null);

  const [isReadOnly, setIsReadOnly] = useState(false);


  /* ================= CALC ================= */
  const meetingsDone =
    formData.callsMade +
    formData.netNewMeeting +
    formData.followUpMeeting +
    formData.qualifiedMeeting;


  const normalizeDate = (d: string | Date) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split("T")[0];
};

  

    const resetFormForDate = (date: string) => {
  setFormData({
    date,
    callsMade: 0,
    netNewMeeting: 0,
    followUpMeeting: 0,
    qualifiedMeeting: 0,
    emailsOutgoing: 0,
    whatsappMessage: 0,
    proposals: 0,
    dealWon: 0,
  });
};


  /* ================= LOAD ================= */
  useEffect(() => {
    fetchSales();
    fetchISRs();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API}/api/sales`, { credentials: "include" });
      const data = await res.json();
      setSalesData(data || []);
    } catch (err) {
      console.error("❌ Failed to load sales", err);
    }
  };

  const fetchISRs = async () => {
    try {
      const res = await fetch(`${API}/api/employeedirectory`, {
        credentials: "include",
      });
      const data: Employee[] = await res.json();
      setIsrs(data.filter((e) => e.role?.toLowerCase() === "isr"));
    } catch (err) {
      console.error("❌ Failed to load ISRs", err);
    }
  };


  useEffect(() => {
  if (!loggedEmployee) return;

  const record = salesData.find(
  (s) =>
    s.empId === loggedEmployee.empId &&
    normalizeDate(s.date) === normalizeDate(formData.date)
);


  // 🟢 CASE 1: Data exists → autofill ONCE
  if (record) {
    if (lastLoadedDate !== formData.date) {
      setFormData({
        date: formData.date,
        callsMade: record.callsMade,
        netNewMeeting: record.netNewMeeting,
        followUpMeeting: record.followUpMeeting,
        qualifiedMeeting: record.qualifiedMeeting,
        emailsOutgoing: record.emailsOutgoing,
        whatsappMessage: record.whatsappMessage,
        proposals: record.proposals,
        dealWon: record.dealWon,
      });
      setLastLoadedDate(formData.date);
    }
    return;
  }

  // 🟡 CASE 2: No data → reset ONLY when date changes
  if (lastLoadedDate !== formData.date) {
    resetFormForDate(formData.date);
    setLastLoadedDate(formData.date);
  }
}, [formData.date, salesData, loggedEmployee, lastLoadedDate]);



  /* ================= HANDLERS ================= */
 const handleChange = (field: string, value: string) => {
  setFormData((prev) => ({
    ...prev,
    [field]:
      field === "date"
        ? value
        : value === ""
        ? ""
        : Number(value),
  }));
};


  /* ================= SAVE ================= */
const handleSubmit = async () => {
  if (saving || !loggedEmployee) return;

  const existing = salesData.find(
  (s) =>
    s.empId === loggedEmployee.empId &&
    normalizeDate(s.date) === normalizeDate(formData.date)
);

  // 🚨 CONFIRM OVERWRITE
  if (existing) {
    const confirmOverwrite = window.confirm(
      `Sales data already exists for ${formData.date}.
Do you want to overwrite it?`
    );

    if (!confirmOverwrite) {
      return; // ❌ user clicked NO
    }
  }

  const payload = {
    ...formData,
    callsMade: Number(formData.callsMade || 0),
    netNewMeeting: Number(formData.netNewMeeting || 0),
    followUpMeeting: Number(formData.followUpMeeting || 0),
    qualifiedMeeting: Number(formData.qualifiedMeeting || 0),
    emailsOutgoing: Number(formData.emailsOutgoing || 0),
    whatsappMessage: Number(formData.whatsappMessage || 0),
    proposals: Number(formData.proposals || 0),
    dealWon: Number(formData.dealWon || 0),
  };

  try {
    setSaving(true);

    const res = await fetch(`${API}/api/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        empId: loggedEmployee.empId,
        employeeName: loggedEmployee.employeeName,
        role: loggedEmployee.role,
        ...payload,
        meetingsDone,
      }),
    });

    if (!res.ok) throw new Error("Save failed");

    await fetchSales();

    alert(
      existing
        ? "✅ Sales data updated successfully"
        : "✅ Sales data saved successfully"
    );
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save");
  } finally {
    setSaving(false);
  }
};

  /* ================= MONTH & WEEK OPTIONS ================= */
  // Month options derived from salesData (unique year-month). Sorted newest -> oldest
  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    salesData.forEach((s) => {
      if (!s?.date) return;
      const d = new Date(s.date);
      if (isNaN(d.getTime())) return;
      set.add(`${d.getFullYear()}-${d.getMonth()}`); // year-monthIndex
    });

    const arr = Array.from(set).map((v) => {
      const [y, m] = v.split("-");
      const label = new Date(Number(y), Number(m)).toLocaleString("default", {
        month: "short",
        year: "numeric",
      }); // e.g., "Jan 2026"
      return { value: v, year: Number(y), monthIndex: Number(m), label };
    });

    // sort newest first
    arr.sort((a, b) => (a.year === b.year ? b.monthIndex - a.monthIndex : b.year - a.year));

    return arr;
  }, [salesData]);

  // Week options derived from salesData: unique Sunday-start ISO -> label
  const weekOptions = useMemo(() => {
    const map = new Map<string, string>();

    salesData.forEach((s) => {
      if (!s?.date) return;
      const d = new Date(s.date);
      if (isNaN(d.getTime())) return;

      // compute start of week (Sunday)
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const key = start.toISOString();
      if (!map.has(key)) {
        const label = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
        map.set(key, label);
      }
    });

    // convert to array and sort newest first (by start date)
    const entries = Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
      startTime: new Date(value).getTime(),
    }));

    entries.sort((a, b) => b.startTime - a.startTime);

    return entries.map((e) => ({ value: e.value, label: e.label }));
  }, [salesData]);

  // When changing filter, set sensible defaults for month/week if not already set
  useEffect(() => {
    if (filter === "monthly") {
      if (!selectedMonth && monthOptions.length) {
        setSelectedMonth(monthOptions[0].value); // most recent month
      }
    } else {
      setSelectedMonth("");
    }

    if (filter === "weekly") {
      if (!selectedWeek && weekOptions.length) {
        setSelectedWeek(weekOptions[0].value); // most recent week
      }
    } else {
      setSelectedWeek("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, monthOptions.length, weekOptions.length]);

  /* ================= FILTER LOGIC (UPDATED) ================= */
  const filteredSales = useMemo(() => {
  return salesData.filter((entry) => {

    // 🔐 ROLE-BASED VISIBILITY
    if (loggedEmployee?.role?.toLowerCase() === "isr") {
      // ISR sees ONLY their own submitted data
      if (entry.empId !== loggedEmployee.empId) return false;
    }

    // 👔 SM can see all data (no restriction)

    // 🔽 ISR dropdown filter (SM only)
    if (selectedISR !== "all" && entry.empId !== selectedISR) return false;

    const d = new Date(entry.date);
    d.setHours(0, 0, 0, 0);

    // DAILY → show all dates
    if (filter === "daily") {
      return true;
    }

    // WEEKLY
    if (filter === "weekly") {
      let start: Date;

      if (selectedWeek) {
        start = new Date(selectedWeek);
      } else {
        start = new Date();
        start.setDate(start.getDate() - start.getDay());
      }

      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      return d >= start && d <= end;
    }

    // MONTHLY
    if (filter === "monthly") {
      if (!selectedMonth) return true;
      const [y, m] = selectedMonth.split("-");
      return d.getFullYear() === Number(y) && d.getMonth() === Number(m);
    }

    return true;
  });
}, [
  salesData,
  filter,
  selectedISR,
  selectedMonth,
  selectedWeek,
  loggedEmployee,
]);

const totalMeetings = useMemo(() => {
  return filteredSales.reduce(
    (sum, item) => sum + (item.meetingsDone || 0),
    0
  );
}, [filteredSales]);



const aggregatedSales = useMemo(() => {
  // DAILY → no aggregation
  if (filter === "daily") return filteredSales;

  const map = new Map<string, SalesEntry>();

  filteredSales.forEach((item) => {
    let key = "";
    let displayDate = item.date;

    // MONTHLY grouping
    if (filter === "monthly") {
      const d = new Date(item.date);
      key = `${item.empId}-${d.getFullYear()}-${d.getMonth()}`;
      displayDate = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
    }

    // WEEKLY grouping
    if (filter === "weekly") {
      const d = new Date(item.date);
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      start.setHours(0, 0, 0, 0);
      key = `${item.empId}-${start.toISOString()}`;
      displayDate = start.toISOString();
    }

    if (!map.has(key)) {
      map.set(key, {
        ...item,
        date: displayDate,
        callsMade: 0,
        netNewMeeting: 0,
        followUpMeeting: 0,
        qualifiedMeeting: 0,
        meetingsDone: 0,
        emailsOutgoing: 0,
        whatsappMessage: 0,
        proposals: 0,
        dealWon: 0,
      });
    }

    const agg = map.get(key)!;

    agg.callsMade += item.callsMade;
    agg.netNewMeeting += item.netNewMeeting;
    agg.followUpMeeting += item.followUpMeeting;
    agg.qualifiedMeeting += item.qualifiedMeeting;
    agg.meetingsDone += item.meetingsDone;
    agg.emailsOutgoing += item.emailsOutgoing;
    agg.whatsappMessage += item.whatsappMessage;
    agg.proposals += item.proposals;
    agg.dealWon += item.dealWon;

    // latest updatedAt
    if (
      item.updatedAt &&
      (!agg.updatedAt ||
        new Date(item.updatedAt) > new Date(agg.updatedAt))
    ) {
      agg.updatedAt = item.updatedAt;
    }
  });

  return Array.from(map.values());
}, [filteredSales, filter]);



const aggregatedTotal = useMemo(() => {
  // Decide which data to total
  const source =
    filter === "daily" ? filteredSales : aggregatedSales;

  if (!source.length) return null;

  return source.reduce(
    (acc, item) => {
      acc.callsMade += item.callsMade;
      acc.netNewMeeting += item.netNewMeeting;
      acc.followUpMeeting += item.followUpMeeting;
      acc.qualifiedMeeting += item.qualifiedMeeting;
      acc.meetingsDone += item.meetingsDone;
      acc.emailsOutgoing += item.emailsOutgoing;
      acc.whatsappMessage += item.whatsappMessage;
      acc.proposals += item.proposals;
      acc.dealWon += item.dealWon;
      return acc;
    },
    {
      callsMade: 0,
      netNewMeeting: 0,
      followUpMeeting: 0,
      qualifiedMeeting: 0,
      meetingsDone: 0,
      emailsOutgoing: 0,
      whatsappMessage: 0,
      proposals: 0,
      dealWon: 0,
    }
  );
}, [filteredSales, aggregatedSales, filter]);




  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-7xl space-y-6">

      <h1 className="text-3xl font-bold">Sales Daily Tracker</h1>

   <div className="flex items-center gap-3">
  <Label className="text-sm mb-0">Date</Label>

  {/* ⬅ Previous day */}
  <Button
    variant="outline"
    size="icon"
    className="h-9 w-9"
    onClick={() => {
      const d = new Date(formData.date);
      d.setDate(d.getDate() - 1);
      setLastLoadedDate(null);
      handleChange("date", d.toISOString().split("T")[0]);
    }}
  >
    ←
  </Button>

  {/* 📅 Date picker */}
  <Input
    type="date"
    value={formData.date}
    onChange={(e) => {
      setLastLoadedDate(null);
      handleChange("date", e.target.value);
    }}
    className="w-40 h-9"
  />

  {/* ➡ Next day */}
  <Button
    variant="outline"
    size="icon"
    className="h-9 w-9"
    onClick={() => {
      const d = new Date(formData.date);
      d.setDate(d.getDate() + 1);
      setLastLoadedDate(null);
      handleChange("date", d.toISOString().split("T")[0]);
    }}
  >
    →
  </Button>
</div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TableBox title="Meetings & Calls">
         <Row
  label="Calls made"
  value={formData.callsMade}
 
  onChange={(v) => handleChange("callsMade", v)}
/>

<Row
  label="Net new meeting"
  value={formData.netNewMeeting}
 
  onChange={(v) => handleChange("netNewMeeting", v)}
/>

<Row
  label="Follow-up meeting"
  value={formData.followUpMeeting}
 
  onChange={(v) => handleChange("followUpMeeting", v)}
/>

<Row
  label="Qualified meeting"
  value={formData.qualifiedMeeting}

  onChange={(v) => handleChange("qualifiedMeeting", v)}
/>
          <tr className="bg-muted font-semibold">
            <td className="border px-4 py-2">Meetings done</td>
            <td className="border px-4 py-2">{meetingsDone}</td>
          </tr>
        </TableBox>

        <TableBox title="Outreach & Result">
          
<Row
  label="Emails outgoing"
  value={formData.emailsOutgoing}
  
  onChange={(v) => handleChange("emailsOutgoing", v)}
/>

<Row
  label="WhatsApp message"
  value={formData.whatsappMessage}
 
  onChange={(v) => handleChange("whatsappMessage", v)}
/>

<Row
  label="Proposals"
  value={formData.proposals}
  
  onChange={(v) => handleChange("proposals", v)}
/>

<Row
  label="Deal won"
  value={formData.dealWon}
  
  onChange={(v) => handleChange("dealWon", v)}
/>
        </TableBox>
      </div>

      <Button disabled={saving} onClick={handleSubmit}>

  {isReadOnly ? "Already Submitted" : saving ? "Saving..." : "Save Sales Data"}
</Button>



      <Card>
        <CardHeader>
          <CardTitle>Sales Activity</CardTitle>

          <CardDescription className="flex gap-4 items-center flex-wrap">
            {loggedEmployee?.role?.toLowerCase() === "sm" && (
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
)}


            {(["daily", "weekly", "monthly"] as FilterType[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded ${filter === t ? "bg-blue-600 text-white" : "text-blue-600"}`}
              >
                {t.toUpperCase()}
              </button>
            ))}

            {/* MONTH dropdown (shows when MONTHLY selected) */}
            {filter === "monthly" && (
              <select
                className="border rounded px-2 py-1"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All months</option>
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}

            {/* WEEK dropdown (shows when WEEKLY selected) */}
            {filter === "weekly" && (
              <select
                className="border rounded px-2 py-1"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                <option value="">Current week</option>
                {weekOptions.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
          <TableHeader>
  <TableRow>
    <TableHead>Date</TableHead>
    <TableHead>ISR</TableHead>

    <TableHead>Calls</TableHead>
    <TableHead>Net New</TableHead>
    <TableHead>Follow-up</TableHead>
    <TableHead>Qualified</TableHead>
    <TableHead>Meetings Done</TableHead>

    <TableHead>Emails</TableHead>
    <TableHead>WhatsApp</TableHead>
    <TableHead>Proposals</TableHead>
    <TableHead>Deal Won</TableHead>
    <TableHead>Updated At</TableHead>

  </TableRow>
</TableHeader>


          <TableBody>
  {aggregatedSales.map((s) => (
    <TableRow key={s._id || `${s.empId}-${s.date}`}>
      <TableCell>
        {filter === "monthly"
          ? new Date(s.date).toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          : filter === "weekly"
          ? (() => {
              const start = new Date(s.date);
              const end = new Date(start);
              end.setDate(start.getDate() + 6);
              return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
            })()
          : new Date(s.date).toLocaleDateString()}
      </TableCell>

      <TableCell>{s.employeeName}</TableCell>
      <TableCell>{s.callsMade}</TableCell>
      <TableCell>{s.netNewMeeting}</TableCell>
      <TableCell>{s.followUpMeeting}</TableCell>
      <TableCell>{s.qualifiedMeeting}</TableCell>
      <TableCell>{s.meetingsDone}</TableCell>
      <TableCell>{s.emailsOutgoing}</TableCell>
      <TableCell>{s.whatsappMessage}</TableCell>
      <TableCell>{s.proposals}</TableCell>
      <TableCell>{s.dealWon}</TableCell>
      <TableCell>
        {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "-"}
      </TableCell>
    </TableRow>
  ))}

  {/* ✅ TOTAL ROW */}
  {aggregatedTotal && (
    <TableRow className="font-semibold bg-muted">
      <TableCell>Total</TableCell>
      <TableCell />

      <TableCell>{aggregatedTotal.callsMade}</TableCell>
      <TableCell>{aggregatedTotal.netNewMeeting}</TableCell>
      <TableCell>{aggregatedTotal.followUpMeeting}</TableCell>
      <TableCell>{aggregatedTotal.qualifiedMeeting}</TableCell>
      <TableCell>{aggregatedTotal.meetingsDone}</TableCell>

      <TableCell>{aggregatedTotal.emailsOutgoing}</TableCell>
      <TableCell>{aggregatedTotal.whatsappMessage}</TableCell>
      <TableCell>{aggregatedTotal.proposals}</TableCell>
      <TableCell>{aggregatedTotal.dealWon}</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  )}
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
        value={value === "" ? "" : value}
        onChange={(e) => onChange(e.target.value)}
      />
    </td>
  </tr>
);
