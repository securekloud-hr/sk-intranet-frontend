
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const HRBenefitsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Benefits</CardTitle>
        <CardDescription>Comprehensive benefits package for SecureKloud employees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Health Insurance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive health insurance covering medical, dental, and vision care.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Plan Details
            </Button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Retirement Plan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              401(k) plan with company matching contributions.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Plan Details
            </Button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Paid Time Off</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generous vacation, sick leave, and holidays.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Policy
            </Button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Professional Development</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Training, education assistance, and career development.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Opportunities
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
