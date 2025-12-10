import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

type UserLike = {
  name?: string;
  email?: string;
  mail?: string; // for AAD "mail"
  role?: "admin" | "user";
  fullName?: string;
  type?: string;
};

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

/* ------------ TA TEAM DATA (for TA Details tab) ------------ */

type TaTeamMember = {
  name: string;
  empId: string;
  designation: string;
  email: string;
  phone: string;
};

const taTeamMembers: TaTeamMember[] = [
  {
    name: "Riswana Fathima M S",
    empId: "B24046",
    designation: "Associate - Talent Acquisition",
    email: "riswana.mohammed@securekloud.com",
    phone: "7395972828",
  },
  {
    name: "Senthamizhselvan P",
    empId: "B25005",
    designation: "Trainee - Talent Acquisition",
    email: "senthamizhselvan.pooranachandiran@securekloud.com",
    phone: "9566618781",
  },
  {
    name: "Sriram R",
    empId: "B22131",
    designation: "Associate - Talent Acquisition",
    email: "sriram.ravirajan@securekloud.com",
    phone: "8072446248",
  },
  {
    name: "Sruthi S",
    empId: "B21104",
    designation: "Senior Associate - Talent Acquisition",
    email: "sruthi.sankaranarayanan@securekloud.com",
    phone: "7010639532",
  },
  {
    name: "Valarmathi V",
    empId: "B22152",
    designation: "Associate - Talent Acquisition",
    email: "valarmathi.venkatesan@securekloud.com",
    phone: "8056140918",
  },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ----------------------- MODAL COMPONENT ----------------------- */

interface ModalProps {
  opportunities: ReferralOpportunity[];
}

const ViewDescriptionsModal = ({ opportunities }: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  if (!opportunities || opportunities.length === 0) return null;

  return (
    <>
      <Button variant="outline" onClick={() => setShowModal(true)}>
        View Descriptions
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Job Descriptions ({opportunities.length})
              </h2>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>

            <div className="space-y-6">
              {opportunities.map((op) => (
                <div
                  key={op._id || op.id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="font-semibold">{op.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {op.location} • {op.experience}
                      </p>
                    </div>
                    <Badge className="text-xs">
                      {op.priority.charAt(0).toUpperCase() +
                        op.priority.slice(1)}{" "}
                      Priority
                    </Badge>
                  </div>
                  <p className="text-sm mb-2 whitespace-pre-line">
                    {op.description}
                  </p>
                  {op.requirements?.length > 0 && (
                    <>
                      <p className="text-xs font-semibold mb-1">
                        Key Requirements:
                      </p>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        {op.requirements.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ----------------------- MAIN COMPONENT ----------------------- */

const TalentAcquisition = () => {
  const [opportunities, setOpportunities] = useState<ReferralOpportunity[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // referral form state (candidate details)
  const [referral, setReferral] = useState({
    candidateName: "",
    email: "",
    phone: "",
    position: "",
    notes: "",
  });
  const [resume, setResume] = useState<File | null>(null);

  // Read user from localStorage and determine role
  const cachedUser = useMemo<UserLike | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") return JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
    return null;
  }, []);

  const role = cachedUser?.role || "user";
  const isAdmin = role === "admin";

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

    const res = await fetch(`${API}/api/jobs`);
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

  // referral input handlers
  const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReferral({ ...referral, [name]: value });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setResume(e.target.files[0]);
  };

  // Submit referral – includes logged-in user info (with mail fallback)
  const submitReferral = async () => {
    if (!cachedUser) {
      alert("Please login before submitting a referral.");
      return;
    }

    const referrerName = cachedUser.fullName || cachedUser.name || "Employee";
    const referrerEmail = cachedUser.email || cachedUser.mail || "";

    if (!referrerEmail) {
      alert("Your profile does not have an email address.");
      return;
    }

    const data = new FormData();
    data.append("candidateName", referral.candidateName);
    data.append("candidateEmail", referral.email);
    data.append("phone", referral.phone);
    data.append("position", referral.position);
    data.append("notes", referral.notes);
    data.append("referrerName", referrerName);
    data.append("referrerEmail", referrerEmail);
    if (resume) data.append("resume", resume);

    const res = await fetch(`${API}/api/referral`, {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert(
        "Referral submitted successfully! TA and you will receive a confirmation email."
      );
      setReferral({
        candidateName: "",
        email: "",
        phone: "",
        position: "",
        notes: "",
      });
      setResume(null);
    } else {
      const err = await res.json().catch(() => null);
      alert("Error submitting referral." + (err?.error ? ` ${err.error}` : ""));
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
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Talent Acquisition</h1>
        <p className="text-muted-foreground">
          Help grow our team by referring talented candidates
        </p>
      </div>

      {/* Tabs wrapper */}
      <Tabs defaultValue="referral" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="referral">Referral Program</TabsTrigger>
          <TabsTrigger value="details">TA Team</TabsTrigger>
          <TabsTrigger value="jobs">Job Openings</TabsTrigger>
        </TabsList>

        {/* 1️⃣ Referral Program tab */}
       <TabsContent value="referral" className="space-y-6">
  {/* Left: Program + Incentive   Right: Submit Referral */}
  <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
    {/* LEFT CARD: Employee Referral Program + Incentive Structure */}
    <Card>
      <CardHeader>
        <CardTitle>Employee Referral Program</CardTitle>
        <CardDescription>
          Earn bonuses for successful candidate referrals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* How the Referral Program Works */}
        <div>
          <h3 className="font-semibold">How the Referral Program Works</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>Refer qualified candidates for open positions at SecureKloud.</li>
            <li>
              If your referral is hired and completes 90 days, you earn a bonus.
            </li>
            <li>
              Bonus amounts vary by position, with high-priority roles offering
              higher incentives.
            </li>
            <li>
              Submit referrals through the form below or email{" "}
              recruiting@securekloud.com.
            </li>
            <li>
              No limit to the number of referrals you can submit or bonuses you
              can earn.
            </li>
          </ul>
        </div>

        {/* Referral Incentive Structure INSIDE the same card */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-1">Referral Incentive Structure</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Bonus amounts by role and band
          </p>

          {/* compact table */}
          <table className="w-full max-w-md text-xs border-collapse border rounded-md">
            <thead className="bg-muted">
              <tr>
                <th className="border px-2 py-1 text-left">Roles</th>
                <th className="border px-2 py-1 text-left">Band</th>
                <th className="border px-2 py-1 text-left">Incentive</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Fresher</td>
                <td className="border px-2 py-1">B1</td>
                <td className="border px-2 py-1">Rs. 2,500/-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Team Member</td>
                <td className="border px-2 py-1">B2</td>
                <td className="border px-2 py-1">Rs. 10,000/-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Senior Team Member</td>
                <td className="border px-2 py-1">B3</td>
                <td className="border px-2 py-1">Rs. 25,000/-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Middle Management</td>
                <td className="border px-2 py-1">B4 - B5</td>
                <td className="border px-2 py-1">Rs. 50,000/-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Management</td>
                <td className="border px-2 py-1">B6 - B7</td>
                <td className="border px-2 py-1">Rs. 75,000/-</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Senior Management and above</td>
                <td className="border px-2 py-1">B8 &amp; Above</td>
                <td className="border px-2 py-1">Rs. 1,00,000/-</td>
              </tr>
            </tbody>
          </table>
        </div> {/* ✅ closes border-t div */}
      </CardContent> {/* ✅ closes CardContent */}
    </Card> {/* ✅ closes LEFT Card */}

    {/* RIGHT CARD: Submit a Referral */}
    <Card>
      <CardHeader>
        <CardTitle>Submit a Referral</CardTitle>
        <CardDescription>
          Refer a candidate and help us grow
        </CardDescription>
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
        <Input
          type="file"
          accept=".pdf"
          onChange={handleResumeChange}
        />
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
  </div>
</TabsContent>

        {/* 3️⃣ Jobs tab */}
        <TabsContent value="jobs" className="space-y-6">
          {/* Upload Excel – only for Admin */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Referral Opportunities</CardTitle>
                <CardDescription>
                  Upload an Excel sheet to update jobs list
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
                <Button onClick={handleUpload} disabled={!file}>
                  Upload &amp; Update
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Jobs List */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-securekloud-100 dark:bg-securekloud-700 flex items-center justify-center">
                <Award className="h-5 w-5 text-securekloud-700 dark:text-securekloud-100" />
              </div>
              <h2 className="text-2xl font-bold">
                Current Referral Opportunities
              </h2>
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
                <p className="text-muted-foreground">
                  No opportunities available.
                </p>
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
         
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ----------------------- REFERRAL CARD ----------------------- */

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
