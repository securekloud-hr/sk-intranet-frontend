import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building, Briefcase } from "lucide-react";
import API from "@/config";

interface Job {
  _id?: string;
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  experience: string;
  postedDate: string;
  description: string;
  requirements: string[];
  featured?: boolean;
}

const JOBS_PER_PAGE = 5; // 👈 how many jobs per page

const InternalJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch jobs from backend
  useEffect(() => {
    fetch(`${API}/api/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  // ✅ Filter by selected job
  const filteredJobs = selectedJob
    ? jobs.filter((job) => job.title === selectedJob)
    : jobs;

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  // ✅ Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedJob]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Internal Job Openings</h1>
        <p className="text-muted-foreground">
          Explore career opportunities within SecureKloud
        </p>
      </div>

      {/* List Box Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Select  Job</CardTitle>
          <CardDescription>Choose a job to filter</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job._id || job.id} value={job.title}>
                {job.title}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-6">
        {paginatedJobs.map((job) => (
          <JobCard key={job._id || job.id} job={job} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "contract":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" />
              {job.department || "Not Specified"}
            </CardDescription>
          </div>
          <Badge className={getTypeBadgeVariant(job.type)}>
            {job.type === "full-time"
              ? "Full-Time"
              : job.type === "part-time"
              ? "Part-Time"
              : "Contract"}
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
