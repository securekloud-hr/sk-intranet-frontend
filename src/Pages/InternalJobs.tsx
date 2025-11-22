import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Building } from "lucide-react";
import API from "@/config";

interface Job {
  _id?: string;
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | string;
  experience: string;
  postedDate: string;
  description: string;
  requirements: string[];
  featured?: boolean;
}

interface UserLike {
  role?: "admin" | "user";
  fullName?: string;
  name?: string;
  email?: string;
  mail?: string;
}

const JOBS_PER_PAGE = 5;

const InternalJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ------------------- ADMIN CHECK -------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") {
        const parsed: UserLike = JSON.parse(raw);
        if (parsed.role === "admin") {
          setIsAdmin(true);
        }
      }
    } catch (err) {
      console.error("Error reading user:", err);
    }
  }, []);

  // ------------------- GET USER -------------------
  const getCurrentUser = (): UserLike | null => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  // ------------------- LOAD JOBS -------------------
  const loadInternalJobs = async () => {
    try {
      const res = await fetch(`${API}/api/internal-jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
  };

  useEffect(() => {
    loadInternalJobs();
  }, []);

  // ------------------- FILE SELECT -------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      setFile(null);
      return;
    }
    setFile(e.target.files[0]);
  };

  // ------------------- UPLOAD JOBS -------------------
  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      await fetch(`${API}/api/internal-jobs/upload`, {
        method: "POST",
        body: formData,
      });

      setFile(null);
      await loadInternalJobs();
    } catch (err) {
      console.error("Error uploading:", err);
    } finally {
      setUploading(false);
    }
  };

  // ------------------- APPLY JOB -------------------
  const handleApply = async (job: Job) => {
    const user = getCurrentUser();

    if (!user) {
      alert("Please login to apply for a job.");
      return;
    }

    const userName = user.fullName || user.name || "Anonymous User";
    const userEmail = user.email || user.mail || "";

    if (!userEmail) {
      alert("Your profile has no email.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/jobs/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id || job._id,
          jobTitle: job.title,
          department: job.department,
          location: job.location,
          userName,
          userEmail,
          message: "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed");
      }

      alert("✅ Application sent to TA. A copy was emailed to you.");
    } catch (err: any) {
      alert("❌ Failed: " + err.message);
    }
  };

  // ------------------- FILTER + PAGINATION -------------------
  const filteredJobs = selectedJob
    ? jobs.filter((job) => job.title === selectedJob)
    : jobs;

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedJob]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Internal Job Openings</h1>
        <p className="text-muted-foreground">
          Explore career opportunities within SecureKloud
        </p>
      </div>

      {/* ADMIN UPLOAD SECTION */}
      {isAdmin && (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>Upload Internal Jobs (Excel)</CardTitle>
            <CardDescription>
              Upload an Excel sheet to update the Internal Jobs list.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? "Uploading..." : "Upload Internal Jobs"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FILTER */}
      <Card>
        <CardHeader>
          <CardTitle>Select Job</CardTitle>
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

      {/* JOB LIST */}
      <div className="space-y-6">
        {paginatedJobs.map((job) => (
          <JobCard
            key={job._id || job.id}
            job={job}
            onApply={handleApply}
          />
        ))}
      </div>

      {/* PAGINATION */}
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
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

// ------------------- JOB CARD -------------------
interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

const JobCard = ({ job, onApply }: JobCardProps) => {
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

        {/* APPLY BUTTON */}
        <div className="pt-2">
          <Button variant="outline" onClick={() => onApply(job)}>
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InternalJobs;
