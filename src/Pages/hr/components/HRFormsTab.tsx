
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const HRFormsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Forms</CardTitle>
        <CardDescription>Access and download commonly used HR forms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Personal Information Update</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal contact information
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Time Off Request</h3>
              <p className="text-sm text-muted-foreground">
                Request vacation, sick leave, or personal time
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Benefits Enrollment</h3>
              <p className="text-sm text-muted-foreground">
                Enroll in or update benefits selections
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Expense Reimbursement</h3>
              <p className="text-sm text-muted-foreground">
                Submit expenses for reimbursement
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Performance Review</h3>
              <p className="text-sm text-muted-foreground">
                Annual performance review form
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
