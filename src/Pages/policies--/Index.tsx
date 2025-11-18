
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search } from "lucide-react";

interface Policy {
  id: string;
  title: string;
  category: 'hr' | 'security' | 'it' | 'compliance' | 'general';
  lastUpdated: string;
  description: string;
}

const policies: Policy[] = [
  {
    id: "1",
    title: "Employee Code of Conduct",
    category: "hr",
    lastUpdated: "January 15, 2025",
    description: "Guidelines for professional behavior and ethics at SecureKloud"
  },
  {
    id: "2",
    title: "Information Security Policy",
    category: "security",
    lastUpdated: "February 20, 2025",
    description: "Standards for protecting company and client information"
  },
  {
    id: "3",
    title: "Remote Work Policy",
    category: "hr",
    lastUpdated: "March 1, 2025",
    description: "Guidelines for working remotely and maintaining productivity"
  },
  {
    id: "4",
    title: "IT Acceptable Use Policy",
    category: "it",
    lastUpdated: "January 10, 2025",
    description: "Rules for appropriate use of company IT resources"
  },
  {
    id: "5",
    title: "Data Privacy Policy",
    category: "compliance",
    lastUpdated: "March 15, 2025",
    description: "Guidelines for handling personal and sensitive data"
  },
  {
    id: "6",
    title: "Business Travel Policy",
    category: "general",
    lastUpdated: "February 5, 2025",
    description: "Rules and procedures for business travel and expenses"
  },
  {
    id: "7",
    title: "Social Media Policy",
    category: "general",
    lastUpdated: "January 25, 2025",
    description: "Guidelines for representing the company on social media"
  },
  {
    id: "8",
    title: "Device Security Policy",
    category: "security",
    lastUpdated: "March 10, 2025",
    description: "Requirements for securing company devices and data"
  },
  {
    id: "9",
    title: "Software Licensing Policy",
    category: "it",
    lastUpdated: "February 15, 2025",
    description: "Rules for software acquisition and compliance with licensing"
  },
  {
    id: "10",
    title: "Anti-Harassment Policy",
    category: "hr",
    lastUpdated: "January 20, 2025",
    description: "Guidelines for maintaining a respectful workplace"
  }
];

const Policies = () => {
  // Filter policies by category
  const hrPolicies = policies.filter(p => p.category === 'hr');
  const securityPolicies = policies.filter(p => p.category === 'security');
  const itPolicies = policies.filter(p => p.category === 'it');
  const compliancePolicies = policies.filter(p => p.category === 'compliance');
  const generalPolicies = policies.filter(p => p.category === 'general');

  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Company Policies</h1>
          <p className="text-muted-foreground">Access and download SecureKloud policies and procedures</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Policies</CardTitle>
            <CardDescription>Find the policy you need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search policies..." className="pl-8" />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="it">IT</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">All Policies</h2>
              <div className="space-y-4">
                {policies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hr" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">HR Policies</h2>
              <div className="space-y-4">
                {hrPolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Security Policies</h2>
              <div className="space-y-4">
                {securityPolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="it" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">IT Policies</h2>
              <div className="space-y-4">
                {itPolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Compliance Policies</h2>
              <div className="space-y-4">
                {compliancePolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">General Policies</h2>
              <div className="space-y-4">
                {generalPolicies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </IntranetLayout>
  );
};

interface PolicyCardProps {
  policy: Policy;
}

const PolicyCard = ({ policy }: PolicyCardProps) => {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-securekloud-700" />
        </div>
        <div>
          <h3 className="font-medium">{policy.title}</h3>
          <p className="text-sm text-muted-foreground">{policy.description}</p>
          <p className="text-xs text-muted-foreground">Last updated: {policy.lastUpdated}</p>
        </div>
      </div>
      <Button size="sm">
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  );
};

export default Policies;
