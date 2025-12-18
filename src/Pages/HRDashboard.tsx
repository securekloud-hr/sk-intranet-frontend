import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Briefcase, Calendar } from "lucide-react";


export default function HRDashboard() {
const stats = [
{ title: "Total Employees", value: 248, icon: Users },
{ title: "New Hires (MTD)", value: 12, icon: UserPlus },
{ title: "Open Positions", value: 9, icon: Briefcase },
{ title: "Leave Requests", value: 5, icon: Calendar },
];


return (
<div className="p-6 space-y-6">
<h1 className="text-2xl font-semibold">HR Dashboard</h1>


{/* KPI Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{stats.map((stat) => (
<Card key={stat.title} className="rounded-2xl shadow-sm">
<CardContent className="p-4 flex items-center justify-between">
<div>
<p className="text-sm text-muted-foreground">{stat.title}</p>
<p className="text-2xl font-bold">{stat.value}</p>
</div>
<stat.icon className="h-8 w-8 text-muted-foreground" />
</CardContent>
</Card>
))}
</div>


{/* Recent Activity */}
<Card className="rounded-2xl">
<CardContent className="p-4">
<h2 className="text-lg font-medium mb-3">Recent HR Activity</h2>
<ul className="space-y-2 text-sm">
<li>👤 Arjun Kumar joined as Software Engineer</li>
<li>📄 Leave approved for Priya S</li>
<li>🧑‍💼 Interview scheduled for DevOps role</li>
<li>📢 New HR policy published</li>
</ul>
</CardContent>
</Card>
</div>
);
}