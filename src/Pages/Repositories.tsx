

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Archive, FileText, Folder, Search } from "lucide-react";

const Repositories = () => {
  // Example repositories data
  const repositories = [
    {
      id: "1",
      name: "Technical Documentation",
      description: "Product technical documentation and specifications",
      files: 42,
      lastUpdated: "April 10, 2025"
    },
    {
      id: "2",
      name: "Project Resources",
      description: "Templates and resources for project management",
      files: 27,
      lastUpdated: "April 8, 2025"
    },
    {
      id: "3",
      name: "Marketing Materials",
      description: "Branding assets and marketing collateral",
      files: 56,
      lastUpdated: "April 15, 2025"
    },
    {
      id: "4",
      name: "Client Presentations",
      description: "Client-facing presentations and proposals",
      files: 18,
      lastUpdated: "April 5, 2025"
    },
    {
      id: "5",
      name: "Company Forms",
      description: "Internal forms and document templates",
      files: 34,
      lastUpdated: "April 12, 2025"
    },
    {
      id: "6",
      name: "Training Resources",
      description: "Materials for employee training and development",
      files: 23,
      lastUpdated: "April 7, 2025"
    },
  ];

  return (
    
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Document Repositories</h1>
          <p className="text-muted-foreground">Access shared documents and resources</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Documents</CardTitle>
            <CardDescription>Find documents across all repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search documents..." className="pl-8" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Recent Documents</Button>
              <Button variant="outline" size="sm">My Documents</Button>
              <Button variant="outline" size="sm">Shared with Me</Button>
              <Button variant="outline" size="sm">Templates</Button>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">Document Repositories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map(repo => (
              <Card key={repo.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                      <Archive className="h-5 w-5 text-securekloud-700" />
                    </div>
                    <CardTitle className="text-lg">{repo.name}</CardTitle>
                  </div>
                  <CardDescription>{repo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <div className="text-muted-foreground">{repo.files} files</div>
                    <div className="text-muted-foreground">Updated: {repo.lastUpdated}</div>
                  </div>
                  <Button variant="outline" className="w-full">Browse Repository</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">Recent Documents</h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">Document-{i}.pdf</div>
                  <div className="text-xs text-muted-foreground">
                    Updated {Math.floor(Math.random() * 5) + 1} days ago by {["Jane", "John", "Mike", "Sarah", "Alex"][Math.floor(Math.random() * 5)]}
                  </div>
                </div>
                <Button size="sm" variant="ghost">View</Button>
                <Button size="sm" variant="ghost">Download</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
};

export default Repositories;
