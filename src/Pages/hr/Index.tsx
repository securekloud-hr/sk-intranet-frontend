
import { Link } from "react-router-dom";
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HROverviewTab } from "./components/HROverviewTab";
import { HRBenefitsTab } from "./components/HRBenefitsTab";
import { HRFormsTab } from "./components/HRFormsTab";
import { HRContactsTab } from "./components/HRContactsTab";

const HR = () => {
  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">HR Portal</h1>
          <p className="text-muted-foreground">Access human resources information and services</p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <HROverviewTab />
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-6 mt-6">
            <HRBenefitsTab />
          </TabsContent>
          
          <TabsContent value="forms" className="space-y-6 mt-6">
            <HRFormsTab />
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-6 mt-6">
            <HRContactsTab />
          </TabsContent>
        </Tabs>
      </div>
    </IntranetLayout>
  );
};

export default HR;
