
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChartLine } from "lucide-react";
import API from "@/config";

const Performance = () => {
  return (
    
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Performance Management</h1>
          <p className="text-muted-foreground">Track and manage employee performance processes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Review Cycle</CardTitle>
              <CardDescription>Current review period: Q2 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Self Assessment</p>
                  <p className="text-sm text-muted-foreground">Complete your self-review</p>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Goal Setting</p>
                  <p className="text-sm text-muted-foreground">Set your quarterly objectives</p>
                </div>
                <Button variant="outline" size="sm">
                  <ChartLine className="h-4 w-4 mr-2" />
                  View Goals
                </Button>
              </div>
            </CardContent>
          </Card>          
          {/*performance d21.0000*/}
          <Card>
            <CardHeader>
              <CardTitle>Development Plan</CardTitle>
              <CardDescription>Track your professional growth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Current Skills</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership</span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-securekloud-600 w-3/4" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical</span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-securekloud-600 w-4/5" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Communication</span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-securekloud-600 w-2/3" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Update Development Plan</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
};

export default Performance;
