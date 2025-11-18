
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Briefcase, Search, MapPin, Clock, Building, Filter } from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  experience: string;
  postedDate: string;
  description: string;
  requirements: string[];
  featured?: boolean;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Cloud Security Engineer",
    department: "Information Security",
    location: "New York, NY (Hybrid)",
    type: "full-time",
    experience: "5+ years",
    postedDate: "April 15, 2025",
    description: "We are seeking a Senior Cloud Security Engineer to help secure our cloud infrastructure and applications. This role involves designing and implementing security controls, conducting assessments, and responding to security incidents.",
    requirements: [
      "5+ years of experience in cloud security",
      "Deep knowledge of AWS, Azure, or GCP security",
      "Experience with security tools and frameworks",
      "Strong understanding of compliance requirements"
    ],
    featured: true
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product Management",
    location: "San Francisco, CA (Hybrid)",
    type: "full-time",
    experience: "3-5 years",
    postedDate: "April 10, 2025",
    description: "Join our product team to help define and drive our product strategy and roadmap. This role involves working closely with development, design, and marketing teams to deliver innovative solutions.",
    requirements: [
      "3-5 years of product management experience",
      "Strong analytical and communication skills",
      "Experience with agile methodologies",
      "Technical background preferred"
    ]
  },
  {
    id: "3",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote (US-based)",
    type: "full-time",
    experience: "2-4 years",
    postedDate: "April 18, 2025",
    description: "We're looking for a DevOps Engineer to help automate and optimize our infrastructure and deployment processes. This role involves implementing CI/CD pipelines and managing cloud resources.",
    requirements: [
      "2-4 years of DevOps experience",
      "Strong knowledge of AWS or Azure",
      "Experience with Docker, Kubernetes, and Terraform",
      "Scripting skills in Python or Bash"
    ]
  },
  {
    id: "4",
    title: "Technical Content Writer",
    department: "Marketing",
    location: "Chicago, IL (On-site)",
    type: "part-time",
    experience: "1-3 years",
    postedDate: "April 5, 2025",
    description: "Create engaging technical content including blog posts, white papers, and documentation. This role requires both technical knowledge and excellent writing skills.",
    requirements: [
      "1-3 years of technical writing experience",
      "Understanding of cloud and security concepts",
      "Excellent writing and editing skills",
      "Ability to explain complex topics clearly"
    ]
  },
  {
    id: "5",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Boston, MA (Hybrid)",
    type: "full-time",
    experience: "3+ years",
    postedDate: "April 12, 2025",
    description: "Build and maintain strong relationships with our customers to ensure their success with our products. This role involves onboarding, training, and ongoing support.",
    requirements: [
      "3+ years in customer success or account management",
      "Strong interpersonal and communication skills",
      "Problem-solving abilities",
      "Experience with CRM tools"
    ],
    featured: true
  },
  {
    id: "6",
    title: "Data Analyst (Contract)",
    department: "Business Intelligence",
    location: "Remote",
    type: "contract",
    experience: "2+ years",
    postedDate: "April 8, 2025",
    description: "Join our analytics team on a 6-month contract to help analyze customer data and provide insights. This role involves creating reports and dashboards, and making data-driven recommendations.",
    requirements: [
      "2+ years of data analysis experience",
      "Proficiency in SQL and Excel",
      "Experience with visualization tools like Tableau or Power BI",
      "Strong analytical thinking"
    ]
  }
];

const InternalJobs = () => {
  // Filter jobs by type
  const fullTimeJobs = jobs.filter(job => job.type === 'full-time');
  const partTimeJobs = jobs.filter(job => job.type === 'part-time');
  const contractJobs = jobs.filter(job => job.type === 'contract');
  
  // Featured jobs
  const featuredJobs = jobs.filter(job => job.featured);

  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Internal Job Openings</h1>
          <p className="text-muted-foreground">Explore career opportunities within SecureKloud</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Jobs</CardTitle>
            <CardDescription>Find your next opportunity at SecureKloud</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Job title or keyword" className="pl-8" />
              </div>
              <div className="relative">
                <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Department" className="pl-8" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Location" className="pl-8" />
              </div>
            </div>
            <div className="flex justify-between">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search Jobs
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {featuredJobs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-securekloud-700" />
              </div>
              <h2 className="text-2xl font-bold">Featured Opportunities</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} featured />
              ))}
            </div>
          </div>
        )}
        
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="full-time">Full-Time</TabsTrigger>
            <TabsTrigger value="part-time">Part-Time</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="full-time" className="mt-6">
            <div className="space-y-6">
              {fullTimeJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="part-time" className="mt-6">
            <div className="space-y-6">
              {partTimeJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="contract" className="mt-6">
            <div className="space-y-6">
              {contractJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-securekloud-700" />
              </div>
              <div>
                <CardTitle>Job Alerts</CardTitle>
                <CardDescription>Get notified about new opportunities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative md:col-span-2">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="Your email address" className="pl-8" />
              </div>
              <Button className="w-full">Subscribe to Job Alerts</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              You'll receive notifications about new job openings that match your interest. You can unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </IntranetLayout>
  );
};

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

const JobCard = ({ job, featured }: JobCardProps) => {
  // Determine badge color based on job type
  const getTypeBadgeVariant = (type: string) => {
    switch(type) {
      case 'full-time': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'part-time': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'contract': return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "";
    }
  };
  
  return (
    <Card className={featured ? "border-securekloud-200 bg-securekloud-50/50" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" /> 
              {job.department}
            </CardDescription>
          </div>
          <Badge className={getTypeBadgeVariant(job.type)}>
            {job.type === 'full-time' ? 'Full-Time' : 
              job.type === 'part-time' ? 'Part-Time' : 'Contract'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {job.experience} experience
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Posted: {job.postedDate}
          </div>
        </div>
        
        <p className="text-sm">{job.description}</p>
        
        <div>
          <h4 className="font-medium mb-2">Requirements:</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-2">
          <Button>View Job Details</Button>
          <Button variant="outline">Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternalJobs;
