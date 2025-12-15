import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import API from "@/config";

interface Holiday {
  id: string;
  name: string;
  date: Date;
  description?: string;
}

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

  // 🔹 Get weekday name
  const getDayName = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long" });

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Company Holidays</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Year:</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={yearsLoading}
            className="border rounded px-2 py-1 text-sm"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-sm">Loading holidays…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>
              Your leave balance as of beginning of the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>Earned Leave: 5</li>
              <li>Sick Leave: 10</li>
              <li>Casual Leave: 5</li>
            </ul>

            <div className="flex items-center gap-2 mt-4">
              <CalendarIcon className="h-5 w-5" />
              <span className="font-medium">Time Off Requests</span>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Holiday Calendar</CardTitle>
            <CardDescription>
              Calendar view of all company holidays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              month={month}
              onMonthChange={setMonth}
              modifiers={{ holiday: isHoliday }}
              modifiersClassNames={{
                holiday: "bg-red-100 text-red-900 font-bold",
              }}
            />
          </CardContent>
        </Card>

        {/* Holiday List */}
        <Card>
          <CardHeader>
            <CardTitle>Holiday List</CardTitle>
            <CardDescription>Holidays for {year}</CardDescription>
          </CardHeader>

          <CardContent>
            {ALL_MONTHS.map((monthName) => {
              const list = holidaysByMonth[monthName];
              if (!list.length) return null;

              return (
                <div key={monthName} className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">{monthName}</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="text-left px-2 py-1 w-[60px]">
                            Date
                          </th>
                          <th className="text-left px-2 py-1 w-[120px]">
                            Day
                          </th>
                          <th className="text-left px-2 py-1">
                            Holiday
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {list.map((h) => (
                          <tr
                            key={h.id}
                            className="border-b hover:bg-muted/30"
                          >
                            <td className="px-2 py-1 font-medium">
                              {h.date.getDate()}
                            </td>
                            <td className="px-2 py-1 text-muted-foreground">
                              {getDayName(h.date)}
                            </td>
                            <td className="px-2 py-1">
                              <div className="font-medium">{h.name}</div>
                              {h.description && (
                                <div className="text-xs text-muted-foreground">
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
