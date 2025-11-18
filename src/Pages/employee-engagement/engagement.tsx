
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, Trophy, Heart } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'social' | 'volunteer' | 'wellness' | 'team';
  registrationOpen?: boolean;
}

const events: Event[] = [
  {
    id: "1",
    title: "Company Picnic",
    date: "May 15, 2025",
    location: "Central Park",
    description: "Annual company picnic with food, games, and activities for employees and their families.",
    type: "social",
    registrationOpen: true
  },
  {
    id: "2",
    title: "Habitat for Humanity Volunteer Day",
    date: "May 22, 2025",
    location: "Downtown Build Site",
    description: "Volunteer opportunity to help build houses for those in need.",
    type: "volunteer",
    registrationOpen: true
  },
  {
    id: "3",
    title: "Wellness Wednesday: Yoga Session",
    date: "May 7, 2025",
    location: "Office Gym",
    description: "Join us for a relaxing yoga session led by a professional instructor.",
    type: "wellness",
    registrationOpen: true
  },
  {
    id: "4",
    title: "Department Team Building",
    date: "June 5, 2025",
    location: "Adventure Park",
    description: "Team building activities designed to strengthen departmental relationships.",
    type: "team"
  },
  {
    id: "5",
    title: "Blood Drive",
    date: "May 18, 2025",
    location: "Office Conference Room",
    description: "Partner with the Red Cross to donate blood and save lives.",
    type: "volunteer",
    registrationOpen: true
  },
  {
    id: "6",
    title: "Employee Awards Ceremony",
    date: "June 20, 2025",
    location: "Grand Hotel",
    description: "Annual ceremony to recognize outstanding employee contributions.",
    type: "social"
  }
];

interface Recognition {
  id: string;
  recipient: string;
  department: string;
  achievement: string;
  recognizedBy: string;
  date: string;
}

const recognitions: Recognition[] = [
  {
    id: "1",
    recipient: "Emma Thompson",
    department: "Product Development",
    achievement: "Successfully led the launch of our new cloud security solution.",
    recognizedBy: "David Chen, CTO",
    date: "April 18, 2025"
  },
  {
    id: "2",
    recipient: "James Wilson",
    department: "Customer Support",
    achievement: "Received excellent feedback from clients for resolving complex issues.",
    recognizedBy: "Sarah Johnson, Support Manager",
    date: "April 15, 2025"
  },
  {
    id: "3",
    recipient: "Michael Rodriguez",
    department: "Sales",
    achievement: "Exceeded quarterly targets by 35% and secured our largest client to date.",
    recognizedBy: "Jennifer Lee, Sales Director",
    date: "April 10, 2025"
  },
  {
    id: "4",
    recipient: "Security Team",
    department: "Information Security",
    achievement: "Successfully prevented a significant cyber attack attempt on our systems.",
    recognizedBy: "Executive Leadership",
    date: "April 5, 2025"
  }
];

const EmployeeEngagement = () => {
  // Filter events by type
  const socialEvents = events.filter(event => event.type === 'social');
  const volunteerEvents = events.filter(event => event.type === 'volunteer');
  const wellnessEvents = events.filter(event => event.type === 'wellness');
  const teamEvents = events.filter(event => event.type === 'team');

  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Employee Engagement</h1>
          <p className="text-muted-foreground">Connect, participate, and grow with your colleagues</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-securekloud-700" />
              </div>
              <div>
                <CardTitle>Employee Recognition</CardTitle>
                <CardDescription>Celebrating our outstanding team members</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recognitions.map(recognition => (
                <div key={recognition.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{recognition.recipient}</h3>
                      <p className="text-sm text-muted-foreground">{recognition.department}</p>
                    </div>
                    <Badge className="bg-securekloud-100 text-securekloud-800 hover:bg-securekloud-200">
                      {recognition.date}
                    </Badge>
                  </div>
                  <p className="mb-3">{recognition.achievement}</p>
                  <div className="text-sm text-muted-foreground">
                    Recognized by: {recognition.recognizedBy}
                  </div>
                </div>
              ))}
              <div className="text-center">
                <Button>
                  <Star className="h-4 w-4 mr-2" />
                  Recognize a Colleague
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-securekloud-700" />
            </div>
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5 max-w-[600px]">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="team">Team Building</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="volunteer" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {volunteerEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="wellness" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wellnessEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                <Heart className="h-5 w-5 text-securekloud-700" />
              </div>
              <div>
                <CardTitle>Employee Resources</CardTitle>
                <CardDescription>Support for your well-being and development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Wellness Program</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access health resources, fitness programs, and mental wellness support.
                </p>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Employee Assistance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Confidential counseling and support services for various life challenges.
                </p>
                <Button variant="outline" size="sm">Get Support</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Volunteer Opportunities</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find ways to give back to the community with company-sponsored programs.
                </p>
                <Button variant="outline" size="sm">Browse Opportunities</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </IntranetLayout>
  );
};

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  // Determine badge color based on event type
  const getBadgeVariant = (type: string) => {
    switch(type) {
      case 'social': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'volunteer': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'wellness': return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case 'team': return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default: return "";
    }
  };
  
  // Get event icon based on type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'social': return Users;
      case 'volunteer': return Heart;
      case 'wellness': return Heart;
      case 'team': return Trophy;
      default: return Calendar;
    }
  };
  
  const EventIcon = getEventIcon(event.type);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <Badge className={getBadgeVariant(event.type)}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
          {event.registrationOpen && (
            <Badge variant="outline" className="bg-green-50 text-green-800">
              Registration Open
            </Badge>
          )}
        </div>
        <div className="mt-3 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center mt-1">
            <EventIcon className="h-5 w-5 text-securekloud-700" />
          </div>
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.date} at {event.location}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <Button className="w-full">
          {event.registrationOpen ? "Register Now" : "View Details"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmployeeEngagement;
