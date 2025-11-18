
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";

interface Holiday {
  id: string;
  name: string;
  date: Date;
  description?: string;
}

// Sample holidays for 2025
const holidays: Holiday[] = [
  {
    id: "1",
    name: "New Year's Day",
    date: new Date(2025, 0, 1), // January 1, 2025
    description: "First day of the year"
  },
  {
    id: "2",
    name: "Martin Luther King Jr. Day",
    date: new Date(2025, 0, 20), // January 20, 2025
    description: "Honoring Dr. Martin Luther King Jr."
  },
  {
    id: "3",
    name: "Presidents' Day",
    date: new Date(2025, 1, 17), // February 17, 2025
    description: "Honoring U.S. presidents"
  },
  {
    id: "4",
    name: "Memorial Day",
    date: new Date(2025, 4, 26), // May 26, 2025
    description: "Honoring those who died in military service"
  },
  {
    id: "5",
    name: "Independence Day",
    date: new Date(2025, 6, 4), // July 4, 2025
    description: "U.S. Independence Day"
  },
  {
    id: "6",
    name: "Labor Day",
    date: new Date(2025, 8, 1), // September 1, 2025
    description: "Honoring the American labor movement"
  },
  {
    id: "7",
    name: "Veterans Day",
    date: new Date(2025, 10, 11), // November 11, 2025
    description: "Honoring military veterans"
  },
  {
    id: "8",
    name: "Thanksgiving Day",
    date: new Date(2025, 10, 27), // November 27, 2025
    description: "Day of giving thanks"
  },
  {
    id: "9",
    name: "Day after Thanksgiving",
    date: new Date(2025, 10, 28), // November 28, 2025
  },
  {
    id: "10",
    name: "Christmas Eve",
    date: new Date(2025, 11, 24), // December 24, 2025
  },
  {
    id: "11",
    name: "Christmas Day",
    date: new Date(2025, 11, 25), // December 25, 2025
    description: "Christmas celebration"
  },
  {
    id: "12",
    name: "New Year's Eve",
    date: new Date(2025, 11, 31), // December 31, 2025
  }
];

const Holidays = () => {
  // Function to highlight holiday dates on calendar
  const isHoliday = (day: Date) => {
    return holidays.some(holiday => 
      day.getDate() === holiday.date.getDate() && 
      day.getMonth() === holiday.date.getMonth() && 
      day.getFullYear() === holiday.date.getFullYear()
    );
  };

  // Group holidays by month for display
  const holidaysByMonth: Record<string, Holiday[]> = {};
  
  holidays.forEach(holiday => {
    const month = holiday.date.toLocaleString('default', { month: 'long' });
    if (!holidaysByMonth[month]) {
      holidaysByMonth[month] = [];
    }
    holidaysByMonth[month].push(holiday);
  });

  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Company Holidays</h1>
          <p className="text-muted-foreground">Official holidays and time off schedule for 2025</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>2025 Holiday Calendar</CardTitle>
              <CardDescription>View all company holidays</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="default"
                modifiers={{
                  holiday: isHoliday
                }}
                modifiersClassNames={{
                  holiday: "bg-red-100 text-red-900 font-bold"
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Holiday List</CardTitle>
              <CardDescription>Complete list of company holidays for 2025</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {Object.entries(holidaysByMonth).map(([month, monthHolidays]) => (
                <div key={month} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-lg mb-3">{month}</h3>
                  <div className="space-y-3">
                    {monthHolidays.map(holiday => (
                      <div key={holiday.id} className="flex items-start gap-4 border-l-2 border-red-400 pl-4 py-1">
                        <div className="min-w-[45px] text-sm font-medium">
                          {holiday.date.getDate()}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {holiday.name}
                            <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-100">Holiday</Badge>
                          </div>
                          {holiday.description && (
                            <div className="text-sm text-muted-foreground">{holiday.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Holiday Policy Highlights</CardTitle>
            <CardDescription>Key points from our company holiday policy</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc pl-6">
              <li>
                <span className="font-medium">Observed Holidays:</span> SecureKloud observes the 12 holidays listed above.
              </li>
              <li>
                <span className="font-medium">Weekend Holidays:</span> If a holiday falls on a weekend, it will be observed on the nearest Friday or Monday.
              </li>
              <li>
                <span className="font-medium">Floating Holidays:</span> All full-time employees receive 2 floating holidays each year to use at their discretion.
              </li>
              <li>
                <span className="font-medium">Holiday Pay:</span> Eligible employees will receive regular pay for holidays even if they don't work on those days.
              </li>
              <li>
                <span className="font-medium">Religious Accommodations:</span> Employees may request time off for religious holidays not on this calendar.
              </li>
            </ul>
            <div className="mt-4 p-4 bg-securekloud-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-5 w-5 text-securekloud-700" />
                <h3 className="font-medium">Time Off Requests</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For additional time off requests, please submit your request through the HR Portal at least two weeks in advance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IntranetLayout>
  );
};

export default Holidays;
