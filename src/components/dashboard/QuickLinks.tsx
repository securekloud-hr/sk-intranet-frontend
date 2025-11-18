
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Users, BookOpen, HelpCircle, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickLinks() {
  const links = [
    { title: "HR Portal", icon: Users, href: "/hr", description: "Access HR resources and tools" },
    { title: "Policies", icon: FileText, href: "/policies", description: "View company policies and guidelines" },
    { title: "Holiday Calendar", icon: Calendar, href: "/holidays", description: "View upcoming holidays and events" },
    { title: "Learning Hub", icon: GraduationCap, href: "/learning", description: "Access training and development resources" },
    { title: "FAQs", icon: HelpCircle, href: "/faqs", description: "Find answers to common questions" },
    { title: "Repositories", icon: BookOpen, href: "/repositories", description: "Access company knowledge base" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link, index) => (
        <Card key={index} className="sk-card">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-skcloud-purple bg-opacity-10 flex items-center justify-center text-skcloud-purple">
                <link.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{link.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{link.description}</p>
                <Link to={link.href}>
                  <Button variant="outline" size="sm" className="w-full border-skcloud-purple text-skcloud-purple hover:bg-skcloud-purple hover:text-white">
                    Access
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
