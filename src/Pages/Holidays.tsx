import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
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

  // 🔹 Selected year for data (holidays API)
  const [year, setYear] = useState<number>(today.getFullYear());

  // 🔹 Years coming from backend (for dropdown)
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [yearsLoading, setYearsLoading] = useState<boolean>(true);

  // 🔹 Calendar currently visible month (always starts at *current* month/year)
  const [month, setMonth] = useState<Date>(() => new Date());

  // dynamic data state
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 🔹 Fetch years from backend once
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
          .map((y) => Number(y))
          .filter((y) => !Number.isNaN(y))
          .sort((a, b) => a - b);

        setAvailableYears(yrs);

        // if current year is not in list, default to latest year
        if (yrs.length > 0 && !yrs.includes(year)) {
          setYear(yrs[yrs.length - 1]);
        }
      } catch (err) {
        console.error("Failed to load years:", err);
      } finally {
        setYearsLoading(false);
      }
    };

    loadYears();
  }, []); // run once on mount

  // 🔹 Fetch holidays whenever `year` changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const url = new URL(`${API}/api/holidays`);
        url.searchParams.set("year", String(year));
        url.searchParams.set("region", "IN");
        const res = await fetch(url.toString(), { credentials: "include" });
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as {
          year: number;
          items: Array<{
            _id: string;
            name: string;
            date: string;
            description?: string;
          }>;
        };

        const parsed: Holiday[] = (data.items || []).map((h) => ({
          id: h._id || h.date,
          name: h.name,
          date: new Date(h.date), // ISO -> Date
          description: h.description || "",
        }));

        setHolidays(parsed.filter((h) => h.date.getFullYear() === year));
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

  const isHoliday = (day: Date) => {
    return holidays.some(
      (holiday) =>
        day.getDate() === holiday.date.getDate() &&
        day.getMonth() === holiday.date.getMonth() &&
        day.getFullYear() === holiday.date.getFullYear()
    );
  };

  const holidaysByMonth: Record<string, Holiday[]> = useMemo(() => {
    const map: Record<string, Holiday[]> = {};
    ALL_MONTHS.forEach((m) => (map[m] = []));
    holidays.forEach((holiday) => {
      const monthName = holiday.date.toLocaleString("default", {
        month: "long",
      });
      if (holiday.date.getFullYear() === year) {
        map[monthName].push(holiday);
      }
    });
    Object.keys(map).forEach((m) =>
      map[m].sort((a, b) => a.date.getDate() - b.date.getDate())
    );
    return map;
  }, [holidays, ALL_MONTHS, year]);

  const orderedMonths = ALL_MONTHS;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold mb-1">Company Holidays</h1>
        </div>

        {/* 🔹 Year selector (now dynamic) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Year:</span>
          <select
            value={year}
            onChange={(e) => {
              const newYear = Number(e.target.value);
              setYear(newYear);
            }}
            disabled={yearsLoading || availableYears.length === 0}
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

      {loading && (
        <div className="text-sm text-muted-foreground">Loading holidays…</div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          Failed to load holidays: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Holiday Calendar</CardTitle>
            <CardDescription>
              Calendar view of all company holidays (across all years)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="default"
              month={month}
              onMonthChange={setMonth}
              modifiers={{
                holiday: isHoliday,
              }}
              modifiersClassNames={{
                holiday: "bg-red-100 text-red-900 font-bold",
              }}
            />

            <div className="flex items-center gap-2 mb-2 mt-4">
              <CalendarIcon className="h-5 w-5 text-securekloud-700" />
              <h3 className="font-medium">Time Off Requests</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              For time off requests, please submit your request through the{" "}
              <a
                href="https://online.apac.adp.com/signin/v1/?APPID=ADPVISTA-IN&productId=ff803a24-0ee0-47fc-e053-f282530bfabe&returnURL=https://www.vista.adp.com/in/&callingAppId=ADPVISTA&TARGET=-SM-https://www.vista.adp.com/in/ess/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-medium hover:text-blue-800 cursor-pointer"
              >
                ADP Portal
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Holiday List</CardTitle>
            <CardDescription>
              Complete list of company holidays for {year}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {orderedMonths.map((monthName) => {
              const monthHolidays = holidaysByMonth[monthName];
              if (!monthHolidays || monthHolidays.length === 0) return null;

              return (
                <div key={monthName} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-lg mb-3">{monthName}</h3>

                  <div className="space-y-3">
                    {monthHolidays.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="flex items-start gap-4 border-l-2 border-red-400 pl-4 py-1"
                      >
                        <div className="min-w-[45px] text-sm font-medium">
                          {holiday.date.getDate()}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {holiday.name}
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-800 hover:bg-red-100"
                            >
                              Holiday
                            </Badge>
                          </div>
                          {holiday.description && (
                            <div className="text-sm text-muted-foreground">
                              {holiday.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
