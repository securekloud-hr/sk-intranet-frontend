
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export const HRContactsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Team Contacts</CardTitle>
        <CardDescription>Connect with our HR professionals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-securekloud-700" />
                </div>
                <div>
                  <h3 className="font-medium">James Wilson</h3>
                  <p className="text-sm text-muted-foreground">HR Director</p>
                </div>
              </div>
              <div className="text-sm">
                <p>Email: james.wilson@securekloud.com</p>
                <p>Phone: (123) 456-7890</p>
                <p>Areas: Strategy, Policy Development</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-securekloud-700" />
                </div>
                <div>
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <p className="text-sm text-muted-foreground">Benefits Manager</p>
                </div>
              </div>
              <div className="text-sm">
                <p>Email: sarah.johnson@securekloud.com</p>
                <p>Phone: (123) 456-7891</p>
                <p>Areas: Benefits, Compensation</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-securekloud-700" />
                </div>
                <div>
                  <h3 className="font-medium">Michael Chen</h3>
                  <p className="text-sm text-muted-foreground">Talent Acquisition</p>
                </div>
              </div>
              <div className="text-sm">
                <p>Email: michael.chen@securekloud.com</p>
                <p>Phone: (123) 456-7892</p>
                <p>Areas: Recruitment, Onboarding</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-securekloud-700" />
                </div>
                <div>
                  <h3 className="font-medium">Lisa Rodriguez</h3>
                  <p className="text-sm text-muted-foreground">Employee Relations</p>
                </div>
              </div>
              <div className="text-sm">
                <p>Email: lisa.rodriguez@securekloud.com</p>
                <p>Phone: (123) 456-7893</p>
                <p>Areas: Engagement, Conflict Resolution</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
