
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChartLine } from "lucide-react";

export const HROverviewTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to HR Portal</CardTitle>
          <CardDescription>Your centralized human resources information center</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Human Resources (HR) portal provides SecureKloud employees with access to 
            important HR information, resources, and self-service tools. Use this portal to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your benefits information</li>
            <li>Download HR forms and documentation</li>
            <li>View company policies and procedures</li>
            <li>Find contact information for HR team members</li>
            <li>Access payroll information</li>
            <li>Submit time off requests</li>
            <li>Update your personal information</li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Benefits Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Learn about your comprehensive benefits package including healthcare, retirement, and more.
            </p>
            <Button variant="outline" className="w-full" size="sm">View Details</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Time Off Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Request time off, view your balance, and manage your schedule.
            </p>
            <Button variant="outline" className="w-full" size="sm">Request Time Off</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">HR Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access and download common HR forms and documents.
            </p>
            <Button variant="outline" className="w-full" size="sm">Browse Forms</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access performance reviews, set goals, and track your development.
            </p>
            <Button variant="outline" className="w-full" size="sm" asChild>
              <Link to="/hr/performance">
                <ChartLine className="h-4 w-4 mr-2" />
                View Performance
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
