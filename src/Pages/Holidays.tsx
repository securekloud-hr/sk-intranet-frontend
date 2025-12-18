import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import API from "@/config";

interface Holiday {
  id: string;
  name: string;
  date: Date;
  description?: string;
}

// ✅ Leave fields from Employee Directory
type LeaveBalance = {
  EarnedLeave?: number | null;
  CasualLeave?: number | null;
  SickLeave?: number | null;
  MarriageLeave?: number | null;
  PaternityLeave?: number | null;
};

type UserLike = {
  email?: string;
  mail?: string; // Azure AD
  name?: string;
  fullName?: string;
  role?: "admin" | "user";
};

const Holidays = () => {
  const today = new Date();

  // 🔹 Selected year
  const [year, setYear] = useState<number>(today.getFullYear());

  // 🔹 Available years
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [yearsLoading, setYearsLoading] = useState<boolean>(true);

  // 🔹 Calendar month
  const [month, setMonth] = useState<Date>(new Date());

  // 🔹 Holidays data
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ✅ Leave balance state
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [leave, setLeave] = useState<LeaveBalance>({
    EarnedLeave: 0,
    CasualLeave: 0,
    SickLeave: 0,
    MarriageLeave: 0,
    PaternityLeave: 0,
  });

  // ✅ Logged in user
  const currentUser = useMemo<UserLike | null>(() => {
    try {
      const r = localStorage.getItem("user");
      return r && r !== "undefined" ? JSON.parse(r) : null;
    } catch {
      return null;
    }
  }, []);

  const userEmail: string | undefined = (
    currentUser?.email || currentUser?.mail
  )
    ?.toString()
    .trim()
    .toLowerCase();

  // 🔹 Get weekday name
  const getDayName = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long" });

  // ✅ helper: null -> 0
  const n0 = (v: number | null | undefined) => (v == null ? 0 : Number(v));

  // ✅ Fetch leave balance
  useEffect(() => {
    const loadLeave = async () => {
      if (!userEmail) {
        setLeaveError("⚠️ User email missing from session");
        return;
      }

      try {
        setLeaveLoading(true);
        setLeaveError("");

        const res = await fetch(
          `${API}/api/employee-directory/by-email/${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await res.json();

        if (!data.success || !data.employee) {
          setLeaveError("⚠️ Employee not found in Employee Directory");
          return;
        }

        const emp = data.employee;

        setLeave({
          EarnedLeave: n0(emp.EarnedLeave),
          CasualLeave: n0(emp.CasualLeave),
          SickLeave: n0(emp.SickLeave),
          MarriageLeave: n0(emp.MarriageLeave),
          PaternityLeave: n0(emp.PaternityLeave),
        });
      } catch (e) {
        setLeaveError("❌ Failed to load leave balance");
      } finally {
        setLeaveLoading(false);
      }
    };

    loadLeave();
  }, [userEmail]);

  // 🔹 Fetch years
  useEffect(() => {
    const loadYears = async () => {
      try {
        setYearsLoading(true);
        const res = await fetch(`${API}/api/holidays/years?region=IN`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());

        const data = (await res.json()) as { years: number[] };
        const yrs = (data.years || [])
          .map(Number)
          .filter((y) => !Number.isNaN(y))
          .sort((a, b) => a - b);

        setAvailableYears(yrs);

        if (yrs.length && !yrs.includes(year)) {
          setYear(yrs[yrs.length - 1]);
        }
      } catch (err) {
        console.error("Failed to load years:", err);
      } finally {
        setYearsLoading(false);
      }
    };

    loadYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Fetch holidays
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const url = new URL(`${API}/api/holidays`);
        url.searchParams.set("year", String(year));
        url.searchParams.set("region", "IN");

        const res = await fetch(url.toString(), { credentials: "include" });
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();

        const parsed: Holiday[] = (data.items || []).map((h: any) => ({
          id: h._id || h.date,
          name: h.name,
          date: new Date(h.date),
          description: h.description || "",
        }));

        setHolidays(parsed);
      } catch (e: any) {
        setError(e.message || "Failed to load holidays");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [year]);

  const ALL_MONTHS = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const isHoliday = (day: Date) =>
    holidays.some(
      (h) =>
        h.date.getDate() === day.getDate() &&
        h.date.getMonth() === day.getMonth() &&
        h.date.getFullYear() === day.getFullYear()
    );

  const holidaysByMonth = useMemo(() => {
    const map: Record<string, Holiday[]> = {};
    ALL_MONTHS.forEach((m) => (map[m] = []));

    holidays.forEach((h) => {
      const monthName = h.date.toLocaleString("default", { month: "long" });
      map[monthName].push(h);
    });

    Object.keys(map).forEach((m) =>
      map[m].sort((a, b) => a.date.getDate() - b.date.getDate())
    );

    return map;
  }, [holidays, ALL_MONTHS]);

  // ✅ all cards same height (change this one value if you want)
  const CARD_HEIGHT = "h-[430px]";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Holidays</h1>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Year:</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={yearsLoading}
            className="border rounded px-2 py-1 text-xs"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-xs">Loading holidays…</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* ✅ Leave Balance */}
        <Card className={`${CARD_HEIGHT} p-3 flex flex-col`}>
          <CardHeader className="pb-2 space-y-1">
            <CardTitle className="text-base">Leave Balance</CardTitle>
            <CardDescription className="text-xs">
              Your leave balance as of last Friday
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 flex-1 overflow-y-auto text-sm pr-2">
            {leaveLoading ? (
              <div className="text-xs">Loading your leave balance…</div>
            ) : leaveError ? (
              <div className="text-xs text-red-600">{leaveError}</div>
            ) : (

                  <table className="w-full max-w-md text-xs border-collapse border rounded-md">
                    <thead className="bg-muted">
                      <tr>
                        <th className="border px-2 py-1 text-left">Leave Type</th>
                        <th className="border px-2 py-1 text-left">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-2 py-1">Earned Leave</td>
                        <td className="border px-2 py-1">{leave.EarnedLeave}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">Casual Leave </td>
                        <td className="border px-2 py-1">{leave.CasualLeave}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">Sick Leave</td>
                        <td className="border px-2 py-1">{leave.SickLeave}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">Marriage Leave</td>
                        <td className="border px-2 py-1">{leave.MarriageLeave}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1">Paternity Leave</td>
                        <td className="border px-2 py-1">{leave.PaternityLeave}</td>
                      </tr>
                    </tbody>
                  </table>



            )}

            <div className="mt-4 border-t pt-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Time Off Requests</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                For time off requests, please submit your request through the{" "}
                <a
                  href="https://online.apac.adp.com/signin/v1/?APPID=ADPVISTA-IN&productId=ff803a24-0ee0-47fc-e053-f282530bfabe&returnURL=https://www.vista.adp.com/in/&callingAppId=ADPVISTA&TARGET=-SM-https://www.vista.adp.com/in/ess/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  ADP Portal
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ✅ Calendar */}
        <Card className={`${CARD_HEIGHT} p-3 flex flex-col`}>
          <CardHeader className="pb-2 space-y-1">
            <CardTitle className="text-base">Holiday Calendar</CardTitle>
            <CardDescription className="text-xs">
              Calendar view of all company holidays
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 flex-1 overflow-hidden">
            <div className="h-full flex items-start justify-center">
              <Calendar
                className="scale-90 origin-top"
                month={month}
                onMonthChange={setMonth}
                modifiers={{ holiday: isHoliday }}
                modifiersClassNames={{
                  holiday: "bg-red-100 text-red-900 font-bold",
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* ✅ Holiday List */}
        <Card className={`${CARD_HEIGHT} p-3 flex flex-col`}>
          <CardHeader className="pb-2 space-y-1">
            <CardTitle className="text-base">Holiday List</CardTitle>
            <CardDescription className="text-xs">
              Holidays for {year}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 flex-1 overflow-y-auto pr-2">
            {ALL_MONTHS.map((monthName) => {
              const list = holidaysByMonth[monthName];
              if (!list.length) return null;

              return (
                <div key={monthName} className="mb-3">
                  <h3 className="font-semibold text-sm mb-1">{monthName}</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="text-left px-2 py-1 w-[50px]">Date</th>
                          <th className="text-left px-2 py-1 w-[110px]">Day</th>
                          <th className="text-left px-2 py-1">Holiday</th>
                        </tr>
                      </thead>

                      <tbody>
                        {list.map((h) => (
                          <tr key={h.id} className="border-b hover:bg-muted/30">
                            <td className="px-2 py-1 font-medium">
                              {h.date.getDate()}
                            </td>
                            <td className="px-2 py-1 text-muted-foreground">
                              {getDayName(h.date)}
                            </td>
                            <td className="px-2 py-1">
                              <div className="font-medium">{h.name}</div>
                              {h.description && (
                                <div className="text-[11px] text-muted-foreground">
                                  {h.description}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Holidays;
