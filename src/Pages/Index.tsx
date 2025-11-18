
import React from "react";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { Announcements } from "@/components/dashboard/Announcements";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { QuickStats } from "@/components/dashboard/QuickStats";

const Index = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-skcloud-dark-purple">Welcome to SecureKloud Hub</h1>
        <p className="text-muted-foreground mt-1">Your central hub for company resources and information</p>
      </div>
      
      <QuickStats />
          {/* 
      <section>
        <h2 className="section-title">Quick Access</h2>
        <QuickLinks />
      </section>
            */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <Announcements />
        </section>
        <section>
          <UpcomingEvents />
        </section>
      </div>
    </div>
  );
};

export default Index;
