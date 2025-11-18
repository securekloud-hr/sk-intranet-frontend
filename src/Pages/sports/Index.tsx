
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Racket, Baseball} from "lucide-react";

const Sports = () => {
  return (
    <IntranetLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sports & Recreation</h1>
          <p className="text-muted-foreground">Company sports events, teams, and recreational activities</p>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Sports Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Annual Cricket Tournament</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">May 15-20, 2025</p>
                  <p className="mt-2">Inter-department cricket tournament at SecureKloud Sports Complex</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Basketball League</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Basketball className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">June 1-30, 2025</p>
                  <p className="mt-2">Monthly basketball league between different teams</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Football Championship</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Football className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">July 10-12, 2025</p>
                  <p className="mt-2">Annual football championship at Downtown Sports Arena</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Tennis Tournament</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <TennisRacket className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">August 5-7, 2025</p>
                  <p className="mt-2">Singles and doubles tennis tournament at SecureKloud Courts</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="teams" className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Company Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">SecureKloud Warriors</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Basketball className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Basketball Team</p>
                  <p className="mt-2 text-sm text-muted-foreground">Practice: Tuesdays and Thursdays, 6-8pm</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Tech Titans</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Soccer className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Soccer Team</p>
                  <p className="mt-2 text-sm text-muted-foreground">Practice: Mondays and Wednesdays, 5-7pm</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Cloud Strikers</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Volleyball className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Volleyball Team</p>
                  <p className="mt-2 text-sm text-muted-foreground">Practice: Fridays, 4-6pm</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="facilities" className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Sports Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80" 
                  alt="Sports Complex" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg">SecureKloud Sports Complex</h3>
                  <p className="text-sm text-muted-foreground mt-1">Main Campus, Building C</p>
                  <p className="mt-2">Includes basketball court, table tennis, and gym facilities.</p>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&q=80" 
                  alt="Outdoor Field" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg">Outdoor Sports Field</h3>
                  <p className="text-sm text-muted-foreground mt-1">East Campus</p>
                  <p className="mt-2">Soccer field and outdoor volleyball court.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery" className="space-y-4 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Events Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&q=80" 
                  alt="Last Year's Tournament" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-2">
                  <p className="text-sm text-muted-foreground">2024 Annual Sports Day</p>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80" 
                  alt="Basketball Match" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-2">
                  <p className="text-sm text-muted-foreground">Basketball Championship Finals</p>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&q=80" 
                  alt="Soccer Match" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-2">
                  <p className="text-sm text-muted-foreground">Inter-Department Soccer Tournament</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </IntranetLayout>
  );
};

export default Sports;
