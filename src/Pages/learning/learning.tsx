
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Lightbulb, BookOpen, Search, Clock, Award, Trophy } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: 'technical' | 'professional' | 'compliance' | 'leadership';
  description: string;
  duration: string;
  instructor: string;
  enrolled?: boolean;
  progress?: number;
  featured?: boolean;
  new?: boolean;
}

const courses: Course[] = [
  {
    id: "1",
    title: "Cloud Security Fundamentals",
    category: "technical",
    description: "Learn the basics of securing cloud environments and applications.",
    duration: "4 hours",
    instructor: "David Chen",
    enrolled: true,
    progress: 75,
    featured: true
  },
  {
    id: "2",
    title: "Advanced DevOps Practices",
    category: "technical",
    description: "Explore advanced DevOps methodologies and automation techniques.",
    duration: "6 hours",
    instructor: "Michelle Wong",
    new: true
  },
  {
    id: "3",
    title: "Effective Communication Skills",
    category: "professional",
    description: "Improve your verbal and written communication in the workplace.",
    duration: "3 hours",
    instructor: "James Wilson",
    enrolled: true,
    progress: 30
  },
  {
    id: "4",
    title: "Data Privacy Compliance",
    category: "compliance",
    description: "Understand data privacy regulations and compliance requirements.",
    duration: "2 hours",
    instructor: "Sarah Johnson",
    enrolled: true,
    progress: 100
  },
  {
    id: "5",
    title: "Leadership in Tech",
    category: "leadership",
    description: "Develop essential leadership skills for technology professionals.",
    duration: "5 hours",
    instructor: "Robert Zhang",
    featured: true
  },
  {
    id: "6",
    title: "Kubernetes for Developers",
    category: "technical",
    description: "Learn how to deploy and manage applications in Kubernetes.",
    duration: "8 hours",
    instructor: "Emily Davis",
    new: true
  },
  {
    id: "7",
    title: "Project Management Essentials",
    category: "professional",
    description: "Master the fundamentals of effective project management.",
    duration: "4 hours",
    instructor: "Michael Brown"
  },
  {
    id: "8",
    title: "Information Security Awareness",
    category: "compliance",
    description: "Essential security awareness training for all employees.",
    duration: "1 hour",
    instructor: "Lisa Chen",
    enrolled: true,
    progress: 50
  }
];

interface Certification {
  id: string;
  title: string;
  provider: string;
  description: string;
  reimbursement?: boolean;
}

const certifications: Certification[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    provider: "Amazon Web Services",
    description: "Design and deploy distributed systems on AWS.",
    reimbursement: true
  },
  {
    id: "2",
    title: "Microsoft Azure Administrator",
    provider: "Microsoft",
    description: "Implement, monitor, and maintain Microsoft Azure solutions.",
    reimbursement: true
  },
  {
    id: "3",
    title: "Certified Information Systems Security Professional (CISSP)",
    provider: "ISC²",
    description: "Security expertise across a broad range of domains.",
    reimbursement: true
  },
  {
    id: "4",
    title: "Google Cloud Certified - Professional Cloud Architect",
    provider: "Google Cloud",
    description: "Design, develop, and manage Google Cloud infrastructure.",
    reimbursement: true
  }
];

const Learning = () => {
  // Filter courses by category
  const technicalCourses = courses.filter(course => course.category === 'technical');
  const professionalCourses = courses.filter(course => course.category === 'professional');
  const complianceCourses = courses.filter(course => course.category === 'compliance');
  const leadershipCourses = courses.filter(course => course.category === 'leadership');
  
  // Get enrolled courses
  const enrolledCourses = courses.filter(course => course.enrolled);

  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning & Development</h1>
          <p className="text-muted-foreground">Professional growth and continuous learning resources</p>
        </div>
        
        {enrolledCourses.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-securekloud-700" />
                </div>
                <div>
                  <CardTitle>My Learning</CardTitle>
                  <CardDescription>Your enrolled courses and progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <Badge>
                        {course.progress === 100 ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button size="sm">
                      {course.progress === 100 ? "Review Course" : "Continue Learning"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Find Courses</CardTitle>
            <CardDescription>Search for training courses and learning resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search courses..." className="pl-8" />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicalCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="professional" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {professionalCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="compliance" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {complianceCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="leadership" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leadershipCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-securekloud-700" />
            </div>
            <h2 className="text-2xl font-bold">Professional Certifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map(certification => (
              <Card key={certification.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{certification.title}</CardTitle>
                    {certification.reimbursement && (
                      <Badge variant="outline" className="bg-green-50 text-green-800">
                        Reimbursable
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{certification.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{certification.description}</p>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-securekloud-700" />
              </div>
              <div>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>Additional resources to support your development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Learning Library</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access e-books, videos, and articles on various subjects.
                </p>
                <Button variant="outline" size="sm">Browse Library</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Tuition Reimbursement</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn about our program for continuing education support.
                </p>
                <Button variant="outline" size="sm">View Program</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Mentorship Program</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with experienced mentors in your field of interest.
                </p>
                <Button variant="outline" size="sm">Join Program</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </IntranetLayout>
  );
};

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          {course.new && (
            <Badge className="bg-securekloud-100 text-securekloud-800 hover:bg-securekloud-200">
              New
            </Badge>
          )}
          {course.featured && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
              Featured
            </Badge>
          )}
          {!course.new && !course.featured && <div />}
          <Badge variant="outline">
            {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
          </Badge>
        </div>
        <div className="mt-3">
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.instructor}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 flex-1">{course.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span>{course.duration}</span>
        </div>
        <Button className="w-full mt-auto">
          {course.enrolled ? "Continue Learning" : "Enroll Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Learning;
