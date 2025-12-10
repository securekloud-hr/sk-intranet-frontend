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

  // 🔹 Selected year (default = current year, you can change to 2026 if you want)
const [year, setYear] = useState<number>(2026);


  // dynamic data state
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // fetch from backend for the selected year
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

  // --- Calendar Initial Month Logic ---
  const sortedHolidays = useMemo(
    () => [...holidays].sort((a, b) => a.date.getTime() - b.date.getTime()),
    [holidays]
  );

  const currentMonthHolidays = useMemo(
    () =>
      sortedHolidays.filter(
        (h) =>
          h.date.getMonth() === today.getMonth() &&
          h.date.getFullYear() === today.getFullYear()
      ),
    [sortedHolidays, today]
  );

  const lastCurrentMonthHoliday =
    currentMonthHolidays.length > 0
      ? currentMonthHolidays[currentMonthHolidays.length - 1].date
      : null;

  let initialCalendarMonth: Date | undefined = today;

  if (year !== today.getFullYear()) {
    if (sortedHolidays.length > 0) {
      initialCalendarMonth = sortedHolidays[0].date;
    }
  } else {
    if (
      lastCurrentMonthHoliday &&
      today.getTime() > lastCurrentMonthHoliday.getTime()
    ) {
      const nextUpcomingHoliday = sortedHolidays.find(
        (h) => h.date.getTime() > today.getTime()
      );
      if (nextUpcomingHoliday) {
        initialCalendarMonth = nextUpcomingHoliday.date;
      }
    }
  }

  const [month, setMonth] = useState<Date | undefined>(initialCalendarMonth);

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

  const orderedMonths = useMemo(() => {
    const currentMonthName = today.toLocaleString("default", { month: "long" });
    const startIndex = ALL_MONTHS.indexOf(currentMonthName);
    if (startIndex === -1) return ALL_MONTHS;
    const monthsFromCurrent = ALL_MONTHS.slice(startIndex);
    const monthsBeforeCurrent = ALL_MONTHS.slice(0, startIndex);
    return [...monthsFromCurrent, ...monthsBeforeCurrent];
  }, [ALL_MONTHS, today]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold mb-1">Company Holidays</h1>
          <p className="text-muted-foreground">
            Official holidays and time off schedule for {year}
          </p>
        </div>

        {/* 🔹 Year selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Year:</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
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
            <CardTitle>{year} Holiday Calendar</CardTitle>
            <CardDescription>View all company holidays</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="default"
              month={month}
              onMonthChange={setMonth}
              defaultMonth={initialCalendarMonth}
              modifiers={{
                holiday: isHoliday,
              }}
              modifiersClassNames={{
                holiday: "bg-red-100 text-red-900 font-bold",
              }}
            />
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

      <Card>
        <CardHeader>
          <CardTitle>Holiday Policy Highlights ...</CardTitle>
          <CardDescription>
            Key points from our company holiday policy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-disc pl-6">
            <li>
              <span className="font-medium">Observed Holidays:</span>{" "}
              SecureKloud observes the holidays listed above.
            </li>
          </ul>
          <div className="mt-4 p-4 bg-securekloud-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-5 w-5 text-securekloud-700" />
              <h3 className="font-medium">Time Off Requests</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              For additional time off requests, please submit your request
              through the{" "}
              <a
                href="https://online.apac.adp.com/signin/v1/?APPID=ADPVISTA-IN&productId=ff803a24-0ee0-47fc-e053-f282530bfabe&returnURL=https://www.vista.adp.com/in/&callingAppId=ADPVISTA&TARGET=-SM-https://www.vista.adp.com/in/ess/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-medium hover:text-blue-800 cursor-pointer"
              >
                HR Portal
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Holidays;
