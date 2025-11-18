
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, Users, Search, Building, Briefcase, Award, Mail } from "lucide-react";

interface ReferralOpportunity {
  id: string;
  title: string;
  department: string;
  location: string;
  bonus: string;
  priority: 'high' | 'medium' | 'standard';
  description: string;
  requirements: string[];
}

const referralOpportunities: ReferralOpportunity[] = [
  {
    id: "1",
    title: "Senior Data Scientist",
    department: "Data Science",
    location: "San Francisco, CA (Hybrid)",
    bonus: "$4,000",
    priority: "high",
    description: "We're looking for an experienced Data Scientist to join our team and help extract insights from our data to drive business decisions.",
    requirements: [
      "5+ years of experience in data science",
      "Expertise in Python, R, and SQL",
      "Experience with machine learning algorithms",
      "Strong statistical background"
    ]
  },
  {
    id: "2",
    title: "Solutions Architect",
    department: "Technical Services",
    location: "New York, NY (Hybrid)",
    bonus: "$3,500",
    priority: "high",
    description: "Join our technical services team to design and implement solutions for our enterprise clients.",
    requirements: [
      "6+ years of experience in solutions architecture",
      "Strong knowledge of cloud platforms",
      "Experience with enterprise architecture",
      "Excellent client-facing skills"
    ]
  },
  {
    id: "3",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote (US-based)",
    bonus: "$2,500",
    priority: "medium",
    description: "Help build beautiful and responsive user interfaces for our cloud security products.",
    requirements: [
      "3+ years of experience in frontend development",
      "Proficiency in React and TypeScript",
      "Experience with modern CSS frameworks",
      "Strong understanding of web accessibility"
    ]
  },
  {
    id: "4",
    title: "Technical Account Manager",
    department: "Customer Success",
    location: "Chicago, IL (On-site)",
    bonus: "$3,000",
    priority: "medium",
    description: "Manage technical relationships with our enterprise clients and ensure their success with our products.",
    requirements: [
      "4+ years in customer-facing technical roles",
      "Strong communication and relationship building skills",
      "Understanding of cloud security concepts",
      "Problem-solving abilities"
    ]
  },
  {
    id: "5",
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Boston, MA (Hybrid)",
    bonus: "$2,000",
    priority: "standard",
    description: "Drive the marketing strategy for our cloud security products and help communicate their value to customers.",
    requirements: [
      "3+ years in product marketing",
      "Experience in B2B technology marketing",
      "Strong communication and storytelling skills",
      "Ability to translate technical features into benefits"
    ]
  },
  {
    id: "6",
    title: "Cloud Security Specialist",
    department: "Security Engineering",
    location: "Austin, TX (Hybrid)",
    bonus: "$3,000",
    priority: "high",
    description: "Join our security team to help protect our cloud infrastructure and applications from threats.",
    requirements: [
      "4+ years in cloud security",
      "Experience with AWS, Azure, or GCP security",
      "Knowledge of security tools and frameworks",
      "Security certifications preferred"
    ]
  }
];

interface RecruitingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  virtual?: boolean;
}

const recruitingEvents: RecruitingEvent[] = [
  {
    id: "1",
    title: "Tech Talent Career Fair",
    date: "May 15, 2025",
    location: "San Francisco Convention Center",
    description: "Join us at this major tech career fair to meet potential candidates in person."
  },
  {
    id: "2",
    title: "Cloud Security Webinar",
    date: "May 20, 2025",
    location: "Online",
    description: "Hosting a webinar on cloud security trends to attract security professionals.",
    virtual: true
  },
  {
    id: "3",
    title: "University Recruitment - MIT",
    date: "May 25, 2025",
    location: "MIT Campus, Cambridge, MA",
    description: "Campus recruitment event targeting graduating students in computer science and cybersecurity."
  },
  {
    id: "4",
    title: "Women in Tech Networking Event",
    date: "June 2, 2025",
    location: "Online",
    description: "Virtual networking event to connect with women professionals in technology roles.",
    virtual: true
  }
];

const TalentAcquisition = () => {
  // Filter opportunities by priority
  const highPriorityOpportunities = referralOpportunities.filter(opp => opp.priority === 'high');
  const mediumPriorityOpportunities = referralOpportunities.filter(opp => opp.priority === 'medium');
  const standardPriorityOpportunities = referralOpportunities.filter(opp => opp.priority === 'standard');

  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Talent Acquisition</h1>
          <p className="text-muted-foreground">Help grow our team by referring talented candidates</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-securekloud-700" />
              </div>
              <div>
                <CardTitle>Employee Referral Program</CardTitle>
                <CardDescription>Earn bonuses for successful candidate referrals</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-securekloud-50 p-4 rounded-lg border border-securekloud-200">
              <h3 className="font-medium mb-2">How the Referral Program Works</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Refer qualified candidates for open positions at SecureKloud</li>
                <li>If your referral is hired and completes 90 days of employment, you earn a referral bonus</li>
                <li>Bonus amounts vary by position, with high-priority roles offering higher bonuses</li>
                <li>Submit referrals through the form below or email recruiting@securekloud.com</li>
                <li>There is no limit to the number of referrals you can submit or bonuses you can earn</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Submit a Referral</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Candidate Name</label>
                  <Input type="text" placeholder="Full name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                  <Input type="email" placeholder="Email address" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                  <Input type="tel" placeholder="Phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Position Referred For</label>
                  <Input type="text" placeholder="Job title" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Additional Notes</label>
                  <Input type="text" placeholder="Any additional information about the candidate" />
                </div>
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Submit Referral
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-securekloud-700" />
            </div>
            <h2 className="text-2xl font-bold">Current Referral Opportunities</h2>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
              <TabsTrigger value="all">All Positions</TabsTrigger>
              <TabsTrigger value="high">High Priority</TabsTrigger>
              <TabsTrigger value="medium">Medium Priority</TabsTrigger>
              <TabsTrigger value="standard">Standard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-6">
                {referralOpportunities.map(opportunity => (
                  <ReferralCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="high" className="mt-6">
              <div className="space-y-6">
                {highPriorityOpportunities.map(opportunity => (
                  <ReferralCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="medium" className="mt-6">
              <div className="space-y-6">
                {mediumPriorityOpportunities.map(opportunity => (
                  <ReferralCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="standard" className="mt-6">
              <div className="space-y-6">
                {standardPriorityOpportunities.map(opportunity => (
                  <ReferralCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-securekloud-700" />
              </div>
              <div>
                <CardTitle>Upcoming Recruiting Events</CardTitle>
                <CardDescription>Where we're actively recruiting new talent</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recruitingEvents.map(event => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{event.title}</h3>
                    {event.virtual && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        Virtual
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    <div>{event.date}</div>
                    <div>{event.location}</div>
                  </div>
                  <p className="text-sm mb-4">{event.description}</p>
                  <Button size="sm" variant="outline">Learn More</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Talent Acquisition Resources</CardTitle>
            <CardDescription>Tools to help you refer the best candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-5 w-5 text-securekloud-700" />
                  <h3 className="font-medium">Job Descriptions</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Access detailed job descriptions for all open positions.
                </p>
                <Button variant="outline" size="sm">View Descriptions</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-securekloud-700" />
                  <h3 className="font-medium">Company Information</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Resources to help candidates learn about SecureKloud.
                </p>
                <Button variant="outline" size="sm">Access Resources</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-securekloud-700" />
                  <h3 className="font-medium">Email Templates</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Templates to use when reaching out to potential candidates.
                </p>
                <Button variant="outline" size="sm">Download Templates</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </IntranetLayout>
  );
};

interface ReferralCardProps {
  opportunity: ReferralOpportunity;
}

const ReferralCard = ({ opportunity }: ReferralCardProps) => {
  // Determine badge color based on priority
  const getPriorityBadgeVariant = (priority: string) => {
    switch(priority) {
      case 'high': return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'medium': return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case 'standard': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default: return "";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{opportunity.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" /> 
              {opportunity.department}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getPriorityBadgeVariant(opportunity.priority)}>
              {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)} Priority
            </Badge>
            <div className="text-sm font-medium text-green-700">
              ${opportunity.bonus} Bonus
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Search className="h-4 w-4 mr-1" />
          Location: {opportunity.location}
        </div>
        
        <p className="text-sm">{opportunity.description}</p>
        
        <div>
          <h4 className="font-medium mb-2">Key Requirements:</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {opportunity.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-2">
          <Button>Refer a Candidate</Button>
          <Button variant="outline">View Job Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentAcquisition;
