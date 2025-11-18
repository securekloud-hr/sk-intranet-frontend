
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";

const OrgStructure = () => {
  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Organizational Structure</h1>
          <p className="text-muted-foreground">View company hierarchy and team structures</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Company Structure</CardTitle>
              </div>
              <CardDescription>Current organizational hierarchy and reporting lines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Leadership Team */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">Leadership Team</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 border rounded-md bg-muted/50">
                      <p className="font-medium">CEO</p>
                      <p className="text-sm text-muted-foreground">John Smith</p>
                    </div>
                    <div className="p-4 border rounded-md bg-muted/50">
                      <p className="font-medium">CTO</p>
                      <p className="text-sm text-muted-foreground">Sarah Johnson</p>
                    </div>
                    <div className="p-4 border rounded-md bg-muted/50">
                      <p className="font-medium">CFO</p>
                      <p className="text-sm text-muted-foreground">Michael Chen</p>
                    </div>
                  </div>
                </div>

                {/* Departments */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">Departments</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 border rounded-md">
                      <p className="font-medium">Engineering</p>
                      <p className="text-sm text-muted-foreground mb-2">45 team members</p>
                      <div className="text-sm">
                        <p>• Software Development</p>
                        <p>• DevOps</p>
                        <p>• QA</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="font-medium">Product</p>
                      <p className="text-sm text-muted-foreground mb-2">20 team members</p>
                      <div className="text-sm">
                        <p>• Product Management</p>
                        <p>• UX Design</p>
                        <p>• Research</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <p className="font-medium">Sales</p>
                      <p className="text-sm text-muted-foreground mb-2">30 team members</p>
                      <div className="text-sm">
                        <p>• Direct Sales</p>
                        <p>• Account Management</p>
                        <p>• Sales Operations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default OrgStructure;
