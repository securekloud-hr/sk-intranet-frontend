import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, Award, Building } from "lucide-react";
import API from "@/config";

enum Priority {
  High = "high",
  Medium = "medium",
  Standard = "standard",
}

interface ReferralOpportunity {
  _id?: string;
  id: string;
  title: string;
  department?: string;
  location: string;
  type: string;
  experience: string;
  postedDate: string;
  description: string;
  requirements: string[];
  priority: Priority;
  bonus: number;
}

// ----------------------- MODAL COMPONENT -----------------------
interface ModalProps {
  opportunities: ReferralOpportunity[];
}

const ViewDescriptionsModal = ({ opportunities }: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button className="mt-4" onClick={() => setShowModal(true)}>
        View Descriptions
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start pt-20 overflow-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-3/4 max-w-3xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">All Job Descriptions</h3>
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </div>

            {opportunities.length === 0 && (
              <p className="text-muted-foreground">No job opportunities available.</p>
            )}

            {opportunities.map((job) => (
              <div key={job.id} className="mb-6 border-b pb-4">
                <h4 className="font-semibold text-lg">{job.title}</h4>
                {job.department && (
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                )}
                <p className="mt-2">{job.description}</p>
                <div className="mt-2">
                  <h5 className="font-medium">Requirements:</h5>
                  <ul className="list-disc pl-5 text-sm">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ----------------------- MAIN COMPONENT -----------------------
const TalentAcquisition = () => {
  const [opportunities, setOpportunities] = useState<ReferralOpportunity[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // ✅ referral form state
  const [referral, setReferral] = useState({
    candidateName: "",
    email: "",
    phone: "",
    position: "",
    notes: "",
  });
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    fetch(`${API}/api/jobs`)
      .then((res) => res.json())
      .then((data) => setOpportunities(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${API}/api/jobs/upload`, {
      method: "POST",
      body: formData,
    });

    const res = await fetch(`${API}/api/jobs`

    );
    const data = await res.json();
    setOpportunities(data);
  };

  const handleJobSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJobId(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ✅ referral input handlers
  const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReferral({ ...referral, [name]: value });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setResume(e.target.files[0]);
  };

  const submitReferral = async () => {
    const data = new FormData();
    Object.keys(referral).forEach((key) => {
      data.append(key, (referral as any)[key]);
    });
    if (resume) data.append("resume", resume);

    const res = await fetch(`${API}/api/referral`, {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert("Referral submitted successfully!");
      setReferral({
        candidateName: "",
        email: "",
        phone: "",
        position: "",
        notes: "",
      });
      setResume(null);
    } else {
      alert("Error submitting referral.");
    }
  };

  const displayedOpportunities = selectedJobId
    ? opportunities.filter((opportunity) => opportunity.id === selectedJobId)
    : opportunities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const totalPages = Math.ceil(opportunities.length / itemsPerPage);

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Talent Acquisition</h1>
        <p className="text-muted-foreground">
          Help grow our team by referring talented candidates
        </p>
      </div>

      {/* Employee Referral Program */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Referral Program</CardTitle>
          <CardDescription>
            Earn bonuses for successful candidate referrals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold">How the Referral Program Works</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>Refer qualified candidates for open positions at SecureKloud.</li>
            <li>If your referral is hired and completes 90 days, you earn a bonus.</li>
            <li>
              Bonus amounts vary by position, with high-priority roles offering higher incentives.
            </li>
            <li>
              Submit referrals through the form below or email recruiting@securekloud.com.
            </li>
            <li>No limit to the number of referrals you can submit or bonuses you can earn.</li>
          </ul>

          <h3 className="font-semibold mt-4">Referral Incentive Structure</h3>
          <table className="w-full border text-sm mt-2">
            <thead className="bg-muted">
              <tr>
                <th className="border px-3 py-2 text-left">Roles</th>
                <th className="border px-3 py-2 text-left">Band</th>
                <th className="border px-3 py-2 text-left">Incentive</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">Fresher</td>
                <td className="border px-3 py-2">B1</td>
                <td className="border px-3 py-2">Rs. 2,500/-</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Team Member</td>
                <td className="border px-3 py-2">B2</td>
                <td className="border px-3 py-2">Rs. 10,000/-</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Senior Team Member</td>
                <td className="border px-3 py-2">B3</td>
                <td className="border px-3 py-2">Rs. 25,000/-</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Middle Management</td>
                <td className="border px-3 py-2">B4 - B5</td>
                <td className="border px-3 py-2">Rs. 50,000/-</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Management</td>
                <td className="border px-3 py-2">B6 - B7</td>
                <td className="border px-3 py-2">Rs. 75,000/-</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Senior Management and above</td>
                <td className="border px-3 py-2">B8 & Above</td>
                <td className="border px-3 py-2">Rs. 1,00,000/-</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ✅ Submit Referral Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Referral</CardTitle>
          <CardDescription>Refer a candidate and help us grow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="candidateName"
            placeholder="Candidate Name"
            value={referral.candidateName}
            onChange={handleReferralChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={referral.email}
            onChange={handleReferralChange}
            required
          />
          <Input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={referral.phone}
            onChange={handleReferralChange}
            required
          />
          <Input
            name="position"
            placeholder="Position Referred For"
            value={referral.position}
            onChange={handleReferralChange}
            required
          />
          <Input type="file" accept=".pdf" onChange={handleResumeChange} />
          <Input
            name="notes"
            placeholder="Additional Notes"
            value={referral.notes}
            onChange={handleReferralChange}
          />
          <Button className="w-full" onClick={submitReferral}>
            <UserPlus className="mr-2 h-4 w-4" /> Submit Referral
          </Button>
        </CardContent>
      </Card>

      {/* Upload Excel */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Referral Opportunities</CardTitle>
          <CardDescription>Upload an Excel sheet to update jobs list</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file}>
            Upload & Update
          </Button>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-securekloud-100 dark:bg-securekloud-700 flex items-center justify-center">
            <Award className="h-5 w-5 text-securekloud-700 dark:text-securekloud-100" />
          </div>
          <h2 className="text-2xl font-bold">Current Referral Opportunities</h2>
        </div>

        <div className="mb-4">
          <label htmlFor="jobSelect" className="text-sm font-medium mr-2">
            Select a Job:
          </label>
          <select
            id="jobSelect"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full max-w-xs"
            value={selectedJobId}
            onChange={handleJobSelect}
            aria-label="Select a job opening"
          >
            <option value="">All Jobs</option>
            {opportunities.map((job) => (
              <option key={job._id || job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {displayedOpportunities.length > 0 ? (
            displayedOpportunities.map((opportunity) => (
              <ReferralCard
                key={opportunity._id || opportunity.id}
                opportunity={opportunity}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No opportunities available.</p>
          )}
        </div>

        {!selectedJobId && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Talent Acquisition Resources with Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Talent Acquisition Resources</CardTitle>
          <CardDescription>Tools to help you refer the best candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Access detailed job descriptions for all open positions.</p>
          <ViewDescriptionsModal opportunities={opportunities} />
        </CardContent>
      </Card>
    </div>
  );
};

// ----------------------- REFERRAL CARD -----------------------
interface ReferralCardProps {
  opportunity: ReferralOpportunity;
}

const ReferralCard = ({ opportunity }: ReferralCardProps) => {
  if (!opportunity) return null;

  const getPriorityBadgeVariant = (priority: Priority) => {
    switch (priority) {
      case Priority.High:
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800";
      case Priority.Medium:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800";
      case Priority.Standard:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{opportunity.title}</CardTitle>
            {opportunity.department && (
              <CardDescription className="flex items-center mt-1">
                <Building className="h-4 w-4 mr-1" />
                {opportunity.department}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getPriorityBadgeVariant(opportunity.priority)}>
              {opportunity.priority.charAt(0).toUpperCase() +
                opportunity.priority.slice(1)}{" "}
              Priority
            </Badge>
            {opportunity.bonus > 0 && (
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                Rs. {opportunity.bonus.toLocaleString("en-IN")}/- Bonus
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1" />
            Location: {opportunity.location}
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Experience: {opportunity.experience}
          </div>
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
      </CardContent>
    </Card>
  );
};

export default TalentAcquisition;
