﻿import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { FiDownload, FiEye } from "react-icons/fi";
import mammoth from "mammoth"; // Add this import for .docx rendering
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SignaturePad from "signature_pad";
import API from "@/config";





// Full employee directory data from the provided Excel file
// (Optional) define an interface for clarity (TS)
interface Employee {
  _id: string;
  EmpID?: string;
  EmployeeName?: string;
  PhoneNumber?: string;
  Email?: string;
  BloodGroup?: string;
  CurrentAddress?: string;
  PermanentAddress?: string;
  PAN?: string;
  Aadhar?: string;
  EmergencyContact?: string;
  SpecialSkill?: string;
  [key: string]: any;
}


const formsData = {
  onboarding: [
    { name: "Access Request Form", fileName: "Access Request Form (1).docx", updated: "Jun 16, 2025", purpose: "For email Id & other access creation" },
    { name: "Employee Information Form", fileName: "Employee_Information_FormV1.0(1).docx", updated: "Jun 16, 2025", purpose: "Employee master details" },
    { name: "Form11", fileName: "Form11.pdf", updated: "Jun 16, 2025", purpose: "Provident Fund eligibility and compliance under EPF regulations." },
    { name: "Gratuity Nomination Form", fileName: "Gratuity_Nomination_Form.pdf", updated: "Jun 16, 2025", purpose: "To nominate a beneficiary to receive gratuity benefits in the absence of the employee" },
    { name: "Insurance Enrolment Form", fileName: "Insurance_Enrolment_Form.pdf", updated: "Jun 16, 2025", purpose: "To capture employee & dependents details for coverage under the Group Mediclaim Policy" },
    { name: "Letter of Undertaking Onboarding", fileName: "Letter_of_Undertaking_Onboarding.pdf", updated: "Jun 16, 2025", purpose: "To confirm the employee’s acceptance of company policies, rules, and responsibilities." },
  ],
  bgv: [
    { name: "Candidate Information form", fileName: "Candidate_Information_form_BGV.pdf", updated: "Jun 16, 2025", purpose: "To Collect personal, academic, and professional details required for background verification." },
    { name: "Letter of Authorization", fileName: "Letter_of_Authorization_BGV.pdf", updated: "Jun 16, 2025", purpose: "To grant consent for verifying the candidate’s details" },
  ],
  rewards: [
    { name: "Nomination Form - Star of the Quarter", fileName: "Nomination_Star_Quarter.pdf", updated: "Jun 16, 2025" },
    { name: "Nomination Form - Team of the Quarter", fileName: "Nomination_Team_Quarter.pdf", updated: "Jun 16, 2025" },
    { name: "Nomination Form - Associate of the Year", fileName: "Nomination_Associate_Year.pdf", updated: "Jun 16, 2025" },
    { name: "Nomination Form - Team of the Year", fileName: "Nomination_Team_Year.pdf", updated: "Jun 16, 2025" },
  ],
  others: [
    { name: "Contract Invoice Template ", fileName: "Contract_Invoice_Template.pdf", updated: "Jun 16, 2025", purpose: "To standardize billing details for services rendered under a contract." },
    { name: "Contract Timesheet Template", fileName: "Contract_Timesheet_Template.pdf", updated: "Jun 16, 2025", purpose: "To record and track hours worked by contract employees for payment processing." },
    { name: "Expense Reimbursement Form ", fileName: "Expense Reimbursement Form.docx", updated: "Jun 16, 2025", purpose: "To claim and process repayment of business/certifications related expenses incurred by employees." },
    { name: "Induction Feedback Form", fileName: "Induction_Feedback_Form.pdf", updated: "Jun 16, 2025", purpose: "To gather employee feedback on the onboarding and induction program for improvement." },
    { name: "Intern to Onroll Movement Template", fileName: "Intern_to_Onroll_Template.pdf", updated: "Jun 16, 2025", purpose: "To formalize and document the transition of an intern to a full-time employee." },
    { name: "PIP Letter Template", fileName: "PIP_Letter_Template_2.pdf", updated: "Jun 16, 2025", purpose: "To outline performance concerns and set clear goals for employee improvement within a defined timeframe." },
  ],
  separation: [
    { name: "Associate Clearance Form", fileName: "Associate_Clearance_Form.pdf", updated: "Jun 16, 2025", purpose: "To ensure all company assets and responsibilities are settled before an employee’s departure." },
    { name: "Exit Interview Template", fileName: "Exit_Interview_Template.pdf", updated: "Jun 16, 2025", purpose: "To capture feedback from departing employees to identify areas for organizational improvement." },
    { name: "Gratuity Declaration Form", fileName: "Gratuity_Declaration_Form.pdf", updated: "Jun 16, 2025", purpose: "To confirm and process the employee’s eligibility and claim for gratuity benefits." },
    { name: "Leave Encashment Declaration Form", fileName: "Leave_Encashment_Declaration_Form.pdf", updated: "Jun 16, 2025", purpose: "To document and process payment for an employee’s unused leave balance." },
    { name: "Letter of Undertaking Separation", fileName: "Letter_of_Undertaking(2).pdf", updated: "Jun 16, 2025", purpose: "To confirm the employee’s compliance with pending obligations and company policies after resignation." },
  ],
};

const team = [
  {
    name: "Sivakumar Natarajan",
    role: "Head - People & Culture",
    email: "siva.kumar@securekloud.com",
    phone: "9940103400",
  },
  {
    name: "Cynthia V",
    role: "Manager - H.R.",
    email: "cynthia.v@securekloud.com",
    phone: "9841550407",
  },
  {
    name: "Ezhilarasi S",
    role: "Lead - H.R.",
    email: "ezhilarasi.sekar@securekloud.com",
    phone: "8610841056",
  },
];
// 🔍 Employee Directory Filters
 // 🧩 Employee Directory state
 

const HR = () => {
// 🧩 Employee Directory (fetched from backend)
 const [employeeDirectory, setEmployeeDirectory] = useState<any[]>([]);
const [isAdmin, setIsAdmin] = useState(false);
const [submittingForm, setSubmittingForm] = useState<string | null>(null);
const [submitStatus, setSubmitStatus] = useState("");




// 🔍 Employee Directory Filters
const [selectedDepartment, setSelectedDepartment] = useState("");
const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
const [skillsInput, setSkillsInput] = useState("");
const [nameSearch, setNameSearch] = useState("");
const [searchTerm, setSearchTerm] = useState(""); // ✅ keep this one
const [useAndFilter, setUseAndFilter] = useState(false);

const [loadingEmployees, setLoadingEmployees] = useState(true);
const [errorEmployees, setErrorEmployees] = useState("");

// 🔁 Fetch employee data from backend
  // 🔁 Fetch employee data from backend with role-based access
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Get role from localStorage
        let role = "user";
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed?.role) role = parsed.role;
          } catch (e) {
            console.error("Error parsing user from localStorage", e);
          }
        }

        // Set admin flag for UI
        setIsAdmin(role === "admin");

        // Fetch with role header
        const res = await fetch(`${API}/api/employeedirectory`, {
          headers: { "x-user-role": role },
        });

        if (!res.ok) throw new Error("Failed to fetch employee data");

        const data = await res.json();
        setEmployeeDirectory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setErrorEmployees("Unable to load employee directory. Please try again later.");
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);
 

// 🧩 Apply filters
const filteredEmployees = employeeDirectory.filter((emp) => {
  const matchDept =
    !selectedDepartment ||
    emp.Dept === selectedDepartment ||
    emp.department === selectedDepartment;

  const matchBlood =
    !selectedBloodGroup || emp.BloodGroup === selectedBloodGroup;

  const skills = (
    emp.SpecialSkill ||
    emp.Tech1 ||
    emp.Tech2 ||
    ""
  ).toLowerCase();
  const inputSkills = skillsInput.toLowerCase().split(/[, ]+/).filter(Boolean);

  let matchSkills = true;
  if (inputSkills.length > 0) {
    if (useAndFilter) {
      matchSkills = inputSkills.every((skill) => skills.includes(skill));
    } else {
      matchSkills = inputSkills.some((skill) => skills.includes(skill));
    }
  }
   // ✅ Name filter
  const name = (emp.EmployeeName || "").toLowerCase();
  const matchName = !searchTerm || name.includes(searchTerm.toLowerCase());


  return matchDept && matchBlood && matchSkills;
});


// 🏢 Get unique departments dynamically
const uniqueDepartments = Array.from(
  new Set(
    employeeDirectory
      .map((emp) => emp.Department?.trim() || emp.department?.trim() || "")
      .filter(Boolean)
  )
).sort();



 
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [nominationData, setNominationData] = useState({
    associateName: "",
    doj: "",
    designation: "",
    project: "",
    roleSince: "",
    nominationPeriod: "",
    accomplishments: {
      exceptionalDeliverable: "",
      resourceUtilization: "",
      resourceProductivity: "",
      teamKnowledge: "",
      riskManagement: "",
      customerFeedback: "",
      teamBonding: "",
      processCompliance: "",
      thers: "",
    },
    nominatedBy: "",
    nominatedByDesignation: "",
    routedBy: "",
    routedByDesignation: "",
  });
  // Star of the Quarter modal state
  const [showStarNominationForm, setShowStarNominationForm] = useState(false);
  const [starNominationData, setStarNominationData] = useState({
    associateName: "",
    doj: "",
    designation: "",
    project: "",
    roleSince: "",
    nominationPeriod: "",
    accomplishments: {
      exceptionalPerformance: "",
      processCompliance: "",
      initiatives: "",
      learning: "",
      knowledgeSharing: "",
      policyAdherence: "",
      clientAppreciation: "",
      potential: "",
      participation: "",
      others: "",
    },
    nominatedBy: "",
    nominatedByDesignation: "",
    routedBy: "",
    routedByDesignation: "",
  });
  const [isSubmittingStarNomination, setIsSubmittingStarNomination] = useState(false);

  // Associate of the Year modal state
  const [showAssociateNominationForm, setShowAssociateNominationForm] = useState(false);
  const [associateNominationData, setAssociateNominationData] = useState({
    associateName: "",
    doj: "",
    designation: "",
    project: "",
    roleSince: "",
    nominationPeriod: "",
    accomplishments: {
      starOfQuarter: "",
      exceptionalPerformance: "",
      initiatives: "",
      learning: "",
      knowledgeSharing: "",
      policyAdherence: "",
      processCompliance: "",
      clientAppreciation: "",
      potential: "",
      participation: "",
      impact: "",
      others: "",
    },
    nominatedBy: "",
    nominatedByDesignation: "",
    routedBy: "",
    routedByDesignation: "",
  });
  // Team of the Year modal state
  const [showTeamYearNominationForm, setShowTeamYearNominationForm] = useState(false);
  const [teamYearNominationData, setTeamYearNominationData] = useState({
    project: "",
    commencementDate: "",
    numberOfMembers: "",
    memberNames: "",
    nominationPeriod: "",
    previousNominations: "",
    accomplishments: {
      exceptionalDeliverable: "",
      resourceUtilization: "",
      resourceProductivity: "",
      teamKnowledge: "",
      riskManagement: "",
      customerFeedback: "",
      teamBonding: "",
      processCompliance: "",
      impact: "",
      costEffective: "",
      contribution: "",
      others: "",
    },
    nominatedBy: "",
    nominatedByDesignation: "",
    routedBy: "",
    routedByDesignation: "",
  });
  const [showCandidateInfoForm, setShowCandidateInfoForm] = useState(false);
const [candidateInfoData, setCandidateInfoData] = useState({
  candidateName: "",
  fatherName: "",
  dob: "",
  mobile: "",
  email: "",
  pan: "",
  passport: "",
  ssn: "",
  course: "",
  registrationNo: "",
  duration: "",
  passingYear: "",
  specialization: "",
  college: "",
  university: "",
  companyName: "",
  empId: "",
  designation: "",
  department: "",
  employmentPeriod: "",
  salary: "",
  resignationReason: "",
  reportingManager: "",
  hrManager: "",
});
const [showAuthorizationForm, setShowAuthorizationForm] = useState(false);
const [authorizationData, setAuthorizationData] = useState({
  name: "",
  date: "",
  signature: "",
});
// Associate Clearance form state
const [showAssociateClearanceForm, setShowAssociateClearanceForm] = useState(false);
const [associateClearanceData, setAssociateClearanceData] = useState({
  associateName: "",
  associateId: "",
  designation: "",
  department: "",
  dateOfJoining: "",
  reportingTo: "",
  dateOfResignation: "",
  dateOfRelieving: "",
  // Manager / Dept Head clearance
  docAssetStatus: "Returned", // default
  ktStatus: "Returned",
  clientEmailStatus: "Returned",
  clientWebStatus: "Returned",
  otherToolsStatus: "Returned",
  ktReceiver: "",
  deptHeadSignature: "",
  // IT clearance
  loginCredentials: "Returned",
  laptopStatus: "Returned",
  emailAccess: "Disabled",
  cloudAccess: "Disabled",
  biometricAccess: "Disabled",
  adDeactivation: "Disabled",
  itSignature: "",
  // Accounts
  loansRemarks: "",
  claimsRemarks: "",
  accountsSignature: "",
  // Admin
  mobileStatus: "Returned",
  keysStatus: "Returned",
  adminSignature: "",
  // HR
  idCardStatus: "Returned",
  timesheetStatus: "Disabled",
  louStatus: "",
  insuranceStatus: "",
  taxDocsStatus: "",
  hrSignature: "",
  // Declaration & associate
  declaration: `I state that I am aware of the Non-Compete, Non-Disclosure, Non-Solicitation Agreement signed along with the appointment letter is binding on me for period of twelve months from my last working day. I am also aware that it is my responsibility to submit all the Bills for reimbursement and Income Tax exemption based on my tax declaration. I am aware that my last month salary will be paid to me along with the Full and Final settlement.`,
  associateSignature: "", // will store dataURL of image
  associateAddress: "",
  date: "",
});

const [showExitInterviewForm, setShowExitInterviewForm] = useState(false);
const [exitInterviewData, setExitInterviewData] = useState({
  associateName: "",
  associateId: "",
  designation: "",
  bandLevel: "",
  department: "",
  departmentHead: "",
  joiningDate: "",
  exitSurveyDate: "",
  reasonsForJoining: [],
  reasonsForQuitting: [],
  jobItself: {},
  supervisor: {},
  company: {},
  remuneration: {},
  management: {},
  hrRemarks: "",
  hrName: "",
  date: "",
});
const handleSubmitExitInterview = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());
  data.reasons = formData.getAll("reasons");

  await submitNomination("Exit Interview Survey", data);
  setShowExitInterviewForm(false);
};

const [showGratuityForm, setShowGratuityForm] = useState(false);
const [gratuityData, setGratuityData] = useState({
  employeeName: "",
  employeeId: "",
  address: "",
  declarationOption: "A", // or "B"
  gratuityAmount: "",
  date: "",
  place: "",
  signature: "",
});
const [showLeaveEncashForm, setShowLeaveEncashForm] = useState(false);
const [leaveEncashData, setLeaveEncashData] = useState({
  employeeName: "",
  employeeId: "",
  address: "",
  declarationOption: "A",
  exemptionAmount: "",
  date: "",
  place: "",
  signature: "",
});


const [showUndertakingForm, setShowUndertakingForm] = useState(false);
const [undertakingData, setUndertakingData] = useState({
  date: "",
  associateName: "",
  relation: "",
  relativeName: "",
  address: "",
  designation: "",
  joiningDate: "",
  resignationDate: "",
  isDirector: false,
  signature: "",
  place: "Chennai",
});
const [showInvoiceForm, setShowInvoiceForm] = useState(false);
const [invoiceData, setInvoiceData] = useState({
  invoiceNumber: "",
  invoiceDate: "",
  consultantName: "",
  consultantAddress: "",
  consultantMobile: "",
  services: [
    { description: "", hours: 0, rate: 0, amount: 0 }
  ],
  bankName: "",
  bankBranch: "",
  ifscCode: "",
  accountNumber: "",
  panNumber: "",
  signature: ""
});
const [showTimesheetForm, setShowTimesheetForm] = useState(false);
const [timesheetData, setTimesheetData] = useState({
  consultantName: "",
  entries: [
    { date: "", module: "", hours: 0 }
  ],
  description: ""
});
const [showExpenseForm, setShowExpenseForm] = useState(false);
const [expenseData, setExpenseData] = useState({
  employeeName: "",
  empId: "",
  managerName: "",
  department: "",
  fromDate: "",
  toDate: "",
  businessPurpose: "",
  expenses: [
    { date: "", description: "", category: "", cost: 0 }
  ],
  cashAdvance: 0,
  receipts: [],
  employeeSignature: "",
  employeeDate: "",
  approvalSignature: "",
  approvalDate: ""
});
const [showInductionForm, setShowInductionForm] = useState(false);
const [inductionData, setInductionData] = useState({
  associateName: "",
  employeeNumber: "",
  designation: "",
  department: "",
  trainers: "",
  trainingDate: "",
  responses: Array(6).fill(""),
  ratings: Array(6).fill(0),
  suggestions: "",
  overall: "",
  comments: "",
  signature: "",
  date: ""
});
const [showInternOnrollForm, setShowInternOnrollForm] = useState(false);
const [internOnrollData, setInternOnrollData] = useState({
  internId: "",
  internName: "",
  joiningDate: "",
  completionDate: "",
  projectTitle: "",
  department: "",
  reportingManager: "",
  departmentHead: "",
  onrollDate: "",
  ratings: {
    learnability: 0,
    technical: 0,
    responsibility: 0,
    attendance: 0,
    teamwork: 0,
    attitude: 0,
  },
  recommendation: "",
  justification: "",
  signature: "",
  date: ""
});
const [showPipForm, setShowPipForm] = useState(false);
const [pipData, setPipData] = useState({
  date: "",
  employeeName: "",
  employeeId: "",
  designation: "",
  department: "",
  manager: "",
  concerns: "",
  improvementAreas: "",
  goals: "",
  support: "",
  reviewStart: "",
  reviewEnd: "",
  reviewFrequency: "",
  employeeComments: "",
  employeeSignature: "",
  employeeDate: "",
  managerSignature: "",
  managerDate: "",
  hrSignature: "",
  hrDate: ""
});










  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");
  const [activeFormTab, setActiveFormTab] = useState("onboarding");
  const [docToView, setDocToView] = useState(null);
  const [docContent, setDocContent] = useState(null); // For rendered .docx HTML
  const [isDocx, setIsDocx] = useState(false); // Flag for .docx files
  const [showDocModal, setShowDocModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Map HR team to employee directory for email/phone where applicable
  const enrichedEmployeeDirectory = employeeDirectory.map(emp => {
    const hrMatch = team.find(t => t.name === emp.EmployeeName);
    return {
      ...emp,
      email: hrMatch ? hrMatch.email : `${emp.EmployeeName.replace(/\s+/g, '.').toLowerCase()}@securekloud.com`,
      phone: hrMatch ? hrMatch.phone : "N/A",
    };
  });

  const handleView = async (fileName) => {
    if (fileName) {
      const filePath = `/files/${fileName}`;


      setDocToView(filePath);
      if (fileName.endsWith('.docx')) {
        setIsDocx(true);
        try {
          const response = await fetch(filePath);
          const arrayBuffer = await response.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setDocContent(result.value);
        } catch (error) {
          console.error("Error rendering .docx:", error);
          alert("Failed to render .docx file.");
          return;
        }
      } else {
        setIsDocx(false);
        setDocContent(null);
      }
      setShowDocModal(true);
    } else {
      alert("File not found for: " + fileName);
    }
  };

  const handleDownload = (fileName) => {
    if (fileName) {
      const link = document.createElement("a");
      link.href = `/files/${fileName}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("File not found for: " + fileName);
    }
  };
  const handleSubmit = (fileName) => {
    if (fileName === "Nomination_Team_Quarter.pdf") {
      setShowNominationForm(true);
    } else if (fileName === "Nomination_Star_Quarter.pdf") {
      setShowStarNominationForm(true);
    } else if (fileName === "Nomination_Associate_Year.pdf") {
      setShowAssociateNominationForm(true);
    } else if (fileName === "Nomination_Team_Year.pdf") {
      setShowTeamYearNominationForm(true);
    }
    else if (fileName === "Candidate_Information_form_BGV.pdf") {
  setShowCandidateInfoForm(true);
}
else if (fileName === "Letter_of_Authorization_BGV.pdf") {
  setShowAuthorizationForm(true);
}
else if (fileName === "Associate_Clearance_Form.pdf") {
  setShowAssociateClearanceForm(true);
}
else if (fileName === "Exit_Interview_Template.pdf") {
  setShowExitInterviewForm(true);
}
else if (fileName === "Gratuity_Declaration_Form.pdf") {
  setShowGratuityForm(true);
}
else if (fileName === "Leave_Encashment_Declaration_Form.pdf") {
  setShowLeaveEncashmentForm(true);
}

else if (fileName === "Contract_Invoice_Template.pdf") {
  setShowInvoiceForm(true);
}
else if (fileName === "Contract_Timesheet_Template.pdf") {
  setShowTimesheetForm(true);
}
else if (fileName === "Expense_Reimbursement_Form.pdf") {
  setShowExpenseForm(true);
}
else if (fileName === "Induction_Feedback_Form.pdf") {
  setShowInductionForm(true);
}
else if (fileName === "Intern_Onroll_Movement_Template.pdf") {
  setShowInternOnrollForm(true);
}
else if (fileName === "PIP_Letter_Template.pdf") {
  setShowPipForm(true);
}
else if (fileName === "Expense Reimbursement Form.docx") {
  setShowExpenseForm(true);
}
else if (fileName === "Intern_to_Onroll_Template.pdf") {
  setShowInternOnrollForm(true);
}
else if (fileName === "PIP_Letter_Template_2.pdf") {
  setShowPipForm(true);
}
else if (fileName === "Letter_of_Undertaking(2).pdf") {
  setShowUndertakingForm(true);
}

  };
 const handleUniversalSubmit = (fileName: string) => {
  if (!fileName) return;

  // ⛔ If this form is already submitting, ignore further clicks
  if (submittingForm === fileName) return;

  // Mark this card as submitting (locks its Submit button)
  setSubmittingForm(fileName);
  setSubmitStatus("Submitting...");

  // Open the correct modal (your existing mapping)
  handleSubmit(fileName);

  // ⚠️ Do NOT reset here.
  // We will reset when the modal is closed or after real submit.
};



  const renderFormTabContent = (tabForms, tabName) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {tabForms.map((form, index) => {
      const isSubmitting = submittingForm === form.fileName;

      return (
        <Card
          key={index}
          className="p-2 text-xs space-y-0.5 shadow-sm border rounded-md h-full flex flex-col"
        >
          <CardHeader className="pb-2 flex-grow">
            <CardTitle>{form.name}</CardTitle>
            {form.purpose && <CardDescription>{form.purpose}</CardDescription>}
            <CardDescription>Last updated: {form.updated}</CardDescription>
          </CardHeader>

          <CardContent className="flex-shrink-0 pt-0">
            <div className="flex justify-center space-x-2">
              {/* 👁 View */}
              <button
                onClick={() => handleView(form.fileName)}
                className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-md flex items-center"
                title="View"
                disabled={isSubmitting}
              >
                <FiEye className="w-4 h-4" />
              </button>

              {/* ⬇ Download */}
              <a
                href={`/files/${form.fileName}`}
                download
                className={`text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center ${
                  isSubmitting ? "opacity-60 pointer-events-none" : ""
                }`}
                title="Download"
              >
                <FiDownload className="w-4 h-4" />
              </a>

              {/* ✅ Submit */}
              <button
                onClick={() => handleUniversalSubmit(form.fileName)}
                disabled={isSubmitting}
                className={`text-sm px-2 py-1 rounded-md ${
                  isSubmitting
                    ? "bg-green-200 text-green-800 cursor-not-allowed"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Optional status message */}
            {isSubmitting && (
              <p className="text-center text-xs mt-1 text-gray-600">
                {submitStatus}
              </p>
            )}
          </CardContent>
        </Card>
      );
    })}
  </div>
);

  const renderFormTabs = () => (
    <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="mt-6">
      <TabsList className="grid w-full sm:w-[800px] grid-cols-5">
        <TabsTrigger value="onboarding">On board Forms</TabsTrigger>
        <TabsTrigger value="bgv">BGV Forms</TabsTrigger>
        <TabsTrigger value="rewards">Rewards & Recognition</TabsTrigger>
        <TabsTrigger value="others">Others</TabsTrigger>
        <TabsTrigger value="separation">Exit Forms</TabsTrigger>
      </TabsList>
      <TabsContent value="onboarding" className="pt-6">
        {renderFormTabContent(formsData.onboarding, "onboarding")}
      </TabsContent>
      <TabsContent value="bgv" className="pt-6">
        {renderFormTabContent(formsData.bgv, "bgv")}
      </TabsContent>
      <TabsContent value="rewards" className="pt-6">
        {renderFormTabContent(formsData.rewards, "rewards")}
      </TabsContent>
      <TabsContent value="others" className="pt-6">
        {renderFormTabContent(formsData.others, "others")}
      </TabsContent>
      <TabsContent value="separation" className="pt-6">
        {renderFormTabContent(formsData.separation, "separation")}
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-skcloud-dark-purple">Human Resources</h1>
        <p className="text-muted-foreground mt-1">Access HR resources, tools, and information</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full sm:w-[600px] grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="team">HR Team</TabsTrigger>
          <TabsTrigger value="forms">HR Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
             {
                title: "Employee Handbook",
                description: "Company policies and procedures",
                content: "Access the latest employee handbook containing all company policies, procedures, and guidelines.",
                fileName: "Employee_Handbook_SecureKloud_2025.pdf",
              },
              {
                title: "Benefits Information",
                description: "Health, retirement, and more",
                content: "Learn about your benefits package, including health insurance, retirement plans, and additional perks.",
              },
              {
                title: "Leave Management",
                description: "Request and track time off",
                content: "Submit leave requests, view your balance, and track approval status for time off.",
              },
              {
                title: "Payroll Information",
                description: "Pay slips and tax documents",
                content: "Access your pay slips, tax documents, and manage your payment details.",
              },
              {
                title: "Employee Directory",
                description: "Find and connect with colleagues",
                content: "View details of all employees including contact information and certifications.",
              },
            ].map((card, i) => (
              <Card key={i} className="sk-card">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{card.content}</p>
                  <Button
                    variant="outline"
                    className="w-full border-skcloud-purple text-skcloud-purple hover:bg-skcloud-purple hover:text-white"
                    onClick={() => {
                      if (card.title === "Payroll Information") {
                        setShowPayrollModal(true);
                      } else if (card.title === "Benefits Information") {
                        setShowBenefitsModal(true);
                      } else if (card.title === "Leave Management") {
                        setShowLeaveModal(true);
                      } else if (card.title === "Employee Directory") {
                        setShowEmployeeModal(true);
                      } else if (card.title === "Employee Handbook" && card.fileName) {
                        handleView(card.fileName);
                      }
                    }}
                  >
                    View {card.title.split(" ")[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <Card key={idx} className="sk-card">
                <CardHeader>
                  <div className="w-24 h-24 rounded-full bg-skcloud-purple/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-skcloud-purple">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <CardTitle className="text-center mt-3">{member.name}</CardTitle>
                  <CardDescription className="text-center">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm mb-2">Email: {member.email}</p>
                  <p className="text-sm">Phone: {member.phone}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forms" className="mt-6">
          {renderFormTabs()}
        </TabsContent>
      </Tabs>

      <Dialog
  open={showNominationForm}
  onOpenChange={(open) => {
    setShowNominationForm(open);
    if (!open) {
      setSubmittingForm(null);
      setSubmitStatus("");
    }
  }}
>


        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nomination Form - Team of the Quarter</DialogTitle>
            <DialogDescription>
              <div>Version No: 1.0</div>
              <div>Version Date: 14-Jan-21</div>
              <div>Please fill in the details below</div>
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 p-4">
            {/* Team Details */}
            <h3 className="font-bold">TEAM DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name of the Project</label>
                <input
                  type="text"
                  value={nominationData.project}
                  onChange={(e) => setNominationData({ ...nominationData, project: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date of Commencement</label>
                <input
                  type="date"
                  value={nominationData.doj}
                  onChange={(e) => setNominationData({ ...nominationData, doj: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Number of Members</label>
                <input
                  type="text"
                  value={nominationData.roleSince}
                  onChange={(e) => setNominationData({ ...nominationData, roleSince: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Names of Members</label>
                <input
                  type="text"
                  value={nominationData.nominationPeriod}
                  onChange={(e) => setNominationData({ ...nominationData, nominationPeriod: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            {/* Criteria Table */}
            <h3 className="font-bold">CRITERIA AND ACCOMPLISHMENTS</h3>
            <div className="max-h-60 overflow-y-auto border rounded">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-blue-600 text-white">
                  <tr>
                    <th className="p-2">SL. NO.</th>
                    <th className="p-2">CRITERIA</th>
                    <th className="p-2">ACCOMPLISHMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sl: "01", criteria: "Consistently Exceptional Deliverable", key: "exceptionalDeliverable" },
                    { sl: "02", criteria: "Utilization of Resources", key: "resourceUtilization" },
                    { sl: "03", criteria: "Productivity of Resources", key: "resourceProductivity" },
                    { sl: "04", criteria: "Knowledge within the team", key: "teamKnowledge" },
                    { sl: "05", criteria: "Risk Management", key: "riskManagement" },
                    { sl: "06", criteria: "Customer Satisfaction Report / Feedback", key: "customerFeedback" },
                    { sl: "07", criteria: "Team Bonding / Motivation", key: "teamBonding" },
                    { sl: "08", criteria: "Process Compliance / Quality of Work", key: "processCompliance" },
                    { sl: "09", criteria: "Others, if any", key: "others" },
                  ].map((item) => (
                    <tr key={item.sl} className="border-t">
                      <td className="p-2">{item.sl}</td>
                      <td className="p-2">{item.criteria}</td>
                      <td className="p-2">
                        <textarea
                          className="w-full border p-2 rounded"
                          value={nominationData.accomplishments[item.key] || ""}
                          onChange={(e) =>
                            setNominationData({
                              ...nominationData,
                              accomplishments: {
                                ...nominationData.accomplishments,
                                [item.key]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Nomination Footer */}
            <h3 className="font-bold">NOMINATION DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nominated By</label>
                <input
                  type="text"
                  value={nominationData.nominatedBy}
                  onChange={(e) => setNominationData({ ...nominationData, nominatedBy: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Designation</label>
                <input
                  type="text"
                  value={nominationData.nominatedByDesignation}
                  onChange={(e) => setNominationData({ ...nominationData, nominatedByDesignation: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Routed By</label>
                <input
                  type="text"
                  value={nominationData.routedBy}
                  onChange={(e) => setNominationData({ ...nominationData, routedBy: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Designation</label>
                <input
                  type="text"
                  value={nominationData.routedByDesignation}
                  onChange={(e) => setNominationData({ ...nominationData, routedByDesignation: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
      <button
  type="button"
  onClick={async () => {
    try {
    const mappedData = {
  type: "Team of the Quarter",
  formData: {
    project_name: nominationData.project,
    date_commencement: nominationData.doj, // from input
    number_of_members: nominationData.roleSince, // from input
    names_of_members: nominationData.nominationPeriod, // from input
    nomination_period: nominationData.nominationPeriod,

    a_deliverable: nominationData.accomplishments?.exceptionalDeliverable,
    a_utilization: nominationData.accomplishments?.resourceUtilization,
    a_productivity: nominationData.accomplishments?.resourceProductivity,
    a_knowledge: nominationData.accomplishments?.teamKnowledge,
    a_risk: nominationData.accomplishments?.riskManagement,
    a_customer_sat: nominationData.accomplishments?.customerFeedback,
    a_team_bonding: nominationData.accomplishments?.teamBonding,
    a_compliance: nominationData.accomplishments?.processCompliance,
    a_others: nominationData.accomplishments?.others,

    nominated_by: nominationData.nominatedBy,
    nominator_designation: nominationData.nominatedByDesignation,
    routed_by: nominationData.routedBy,
    router_designation: nominationData.routedByDesignation,
  },
  submittedBy: nominationData.nominatedBy,
};

      console.log("Submitting Team Nomination:", mappedData);

      const response = await fetch(`${API}/api/nomination/submitNomination`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedData),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        alert("✅ Team Nomination submitted successfully!");
      } else {
        alert(`❌ Failed to submit Team Nomination!\n${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error("❌ Frontend Error:", err);
      alert("Submission failed due to frontend error!");
    }
  }}
  className="px-4 py-2 bg-green-600 text-white rounded"
>
  Submit Nomination
</button>


           
          </form>
        </DialogContent>
      </Dialog>

      {/* Nomination Form - Star of the Quarter */}
      <Dialog
  open={showStarNominationForm}
  onOpenChange={(open) => {
    setShowStarNominationForm(open);

    if (!open) {
      // when modal closes (submit or cancel), unlock everything
      setIsSubmittingStarNomination(false);
      setSubmittingForm(null);
      setSubmitStatus("");
    }
  }}
>

        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nomination Form - Star of the Quarter</DialogTitle>
            <DialogDescription>
              <p>Version No: 1.0</p>
              <p>Version Date: 14-Jan-21</p>
              <p>Please fill in the details below</p>
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 p-4">
            {/* ASSOCIATE DETAILS */}
            <h3 className="font-bold">ASSOCIATE DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Associate Name"
                value={starNominationData.associateName}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, associateName: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="date"
                placeholder="Date of Joining"
                value={starNominationData.doj}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, doj: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Designation"
                value={starNominationData.designation}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, designation: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Name of Project / Dept."
                value={starNominationData.project}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, project: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="In this Role Since"
                value={starNominationData.roleSince}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, roleSince: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Nomination Period"
                value={starNominationData.nominationPeriod}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, nominationPeriod: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>

            {/* CRITERIA */}
            <h3 className="font-bold">CRITERIA AND ACCOMPLISHMENTS</h3>
            <div className="max-h-60 overflow-y-auto border rounded">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-blue-600 text-white">
                  <tr>
                    <th className="p-2">Sl. No.</th>
                    <th className="p-2">Criteria</th>
                    <th className="p-2">Accomplishment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sl: "01", label: "Consistently Exceptional Performance", key: "exceptionalPerformance" },
                    { sl: "02", label: "Process Compliance / Quality of Work", key: "processCompliance" },
                    { sl: "03", label: "Initiatives Rolled out", key: "initiatives" },
                    { sl: "04", label: "Learning", key: "learning" },
                    { sl: "05", label: "Knowledge Sharing / Training Imparted", key: "knowledgeSharing" },
                    { sl: "06", label: "Awareness and Adherence to Policies", key: "policyAdherence" },
                    { sl: "07", label: "Client Appreciation, if any", key: "clientAppreciation" },
                    { sl: "08", label: "Potential Shown for the next role, if any", key: "potential" },
                    { sl: "09", label: "Participation in Team / Organizational activities", key: "participation" },
                    { sl: "10", label: "Others, if any", key: "others" },
                  ].map((row) => (
                    <tr key={row.sl} className="border-t">
                      <td className="p-2">{row.sl}</td>
                      <td className="p-2">{row.label}</td>
                      <td className="p-2">
                        <textarea
                          className="w-full border p-2 rounded"
                          value={starNominationData.accomplishments[row.key]}
                          onChange={(e) =>
                            setStarNominationData({
                              ...starNominationData,
                              accomplishments: {
                                ...starNominationData.accomplishments,
                                [row.key]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NOMINATION DETAILS */}
            <h3 className="font-bold">NOMINATION DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nominated By"
                value={starNominationData.nominatedBy}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, nominatedBy: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Designation"
                value={starNominationData.nominatedByDesignation}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, nominatedByDesignation: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Routed By"
                value={starNominationData.routedBy}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, routedBy: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Designation"
                value={starNominationData.routedByDesignation}
                onChange={(e) =>
                  setStarNominationData({ ...starNominationData, routedByDesignation: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <button
  type="button"
  disabled={isSubmittingStarNomination}
  className={`px-4 py-2 rounded text-white ${
    isSubmittingStarNomination
      ? "bg-green-300 cursor-not-allowed"
      : "bg-green-600"
  }`}
  onClick={async () => {
    // prevent double click while already submitting
    if (isSubmittingStarNomination) return;

    setIsSubmittingStarNomination(true);

    try {
      const res = await fetch(`${API}/api/nomination/submitNomination`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Star of the Quarter",
          formData: {
            associate_name: starNominationData.associateName,
            doj: starNominationData.doj,
            designation: starNominationData.designation,
            project: starNominationData.project,
            role_since: starNominationData.roleSince,
            nomination_period: starNominationData.nominationPeriod,
            nominated_by: starNominationData.nominatedBy,
            nominated_by_designation:
              starNominationData.nominatedByDesignation,
            routed_by: starNominationData.routedBy,
            routed_by_designation:
              starNominationData.routedByDesignation,
            accomplishments: starNominationData.accomplishments,
          },
          submittedBy: starNominationData.nominatedBy,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Nomination submitted successfully!");

        // close modal and unlock card button
        setShowStarNominationForm(false);
        setSubmittingForm(null);
        setSubmitStatus("");
      } else {
        alert("Error: " + (data.error || "unknown"));
      }
    } catch (err) {
      console.error("❌ Frontend Error:", err);
      alert("Submission failed");
    } finally {
      // if it failed or modal still open, allow retry
      setIsSubmittingStarNomination(false);
    }
  }}
>
  {isSubmittingStarNomination ? "Submitting..." : "Submit Nomination"}
</button>

          </form>
        </DialogContent>
      </Dialog>

      {/* Nomination Form - Associate of the Year */}
      <Dialog open={showAssociateNominationForm} onOpenChange={setShowAssociateNominationForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nomination Form - Associate of the Year</DialogTitle>
            <DialogDescription>
              <p>Version No: 1.0</p>
              <p>Version Date: 14-Jan-21</p>
              <p>Please fill in the details below</p>
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 p-4">
            {/* ASSOCIATE DETAILS */}
            <h3 className="font-bold">ASSOCIATE DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Associate Name"
                value={associateNominationData.associateName}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, associateName: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="date" placeholder="Date of Joining"
                value={associateNominationData.doj}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, doj: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Designation"
                value={associateNominationData.designation}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, designation: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Name of Project / Dept."
                value={associateNominationData.project}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, project: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="In this Role Since"
                value={associateNominationData.roleSince}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, roleSince: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Nomination Period"
                value={associateNominationData.nominationPeriod}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, nominationPeriod: e.target.value })}
                className="border p-2 rounded w-full" />
            </div>

            {/* CRITERIA */}
            <h3 className="font-bold">CRITERIA AND ACCOMPLISHMENTS</h3>
            <div className="max-h-60 overflow-y-auto border rounded">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-blue-600 text-white">
                  <tr>
                    <th className="p-2">Sl. No.</th>
                    <th className="p-2">Criteria</th>
                    <th className="p-2">Accomplishment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sl: "01", label: "Nominated for Star of the Quarter", key: "starOfQuarter" },
                    { sl: "02", label: "Consistently Exceptional Performance", key: "exceptionalPerformance" },
                    { sl: "03", label: "Initiatives Rolled out", key: "initiatives" },
                    { sl: "04", label: "Learning", key: "learning" },
                    { sl: "05", label: "Knowledge Sharing / Training Imparted", key: "knowledgeSharing" },
                    { sl: "06", label: "Awareness and Adherence to Policies", key: "policyAdherence" },
                    { sl: "07", label: "Process Compliance / Quality of Work", key: "processCompliance" },
                    { sl: "08", label: "Client Appreciation, if any", key: "clientAppreciation" },
                    { sl: "09", label: "Potential Shown for the next role, if any", key: "potential" },
                    { sl: "10", label: "Participation in Team / Organizational activities", key: "participation" },
                    { sl: "11", label: "Impact on Project / Customer / Organization", key: "impact" },
                    { sl: "12", label: "Others, if any", key: "others" },
                  ].map((row) => (
                    <tr key={row.sl} className="border-t">
                      <td className="p-2">{row.sl}</td>
                      <td className="p-2">{row.label}</td>
                      <td className="p-2">
                        <textarea
                          className="w-full border p-2 rounded"
                          value={associateNominationData.accomplishments[row.key]}
                          onChange={(e) =>
                            setAssociateNominationData({
                              ...associateNominationData,
                              accomplishments: {
                                ...associateNominationData.accomplishments,
                                [row.key]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NOMINATION DETAILS */}
            <h3 className="font-bold">NOMINATION DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nominated By"
                value={associateNominationData.nominatedBy}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, nominatedBy: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Designation"
                value={associateNominationData.nominatedByDesignation}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, nominatedByDesignation: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Routed By"
                value={associateNominationData.routedBy}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, routedBy: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Designation"
                value={associateNominationData.routedByDesignation}
                onChange={(e) => setAssociateNominationData({ ...associateNominationData, routedByDesignation: e.target.value })}
                className="border p-2 rounded w-full" />
            </div>

           <button
  type="button"
  onClick={async () => {
    try {
     const mappedData = {
  type: "Associate of the Year",
  formData: {
    associate_name: associateNominationData.associateName,
    date_of_joining: associateNominationData.doj,
    designation: associateNominationData.designation,
    project_dept: associateNominationData.project,
    role_since: associateNominationData.roleSince,
    nomination_period: associateNominationData.nominationPeriod,

    a_star_of_q: associateNominationData.accomplishments?.starOfQuarter,
    a_performance: associateNominationData.accomplishments?.exceptionalPerformance,
    a_initiatives: associateNominationData.accomplishments?.initiatives,
    a_learning: associateNominationData.accomplishments?.learning,
    a_sharing: associateNominationData.accomplishments?.knowledgeSharing,
    a_policies: associateNominationData.accomplishments?.policyAdherence,
    a_compliance: associateNominationData.accomplishments?.processCompliance,
    a_client_appreciation: associateNominationData.accomplishments?.clientAppreciation,
    a_potential: associateNominationData.accomplishments?.potential,
    a_participation: associateNominationData.accomplishments?.participation,
    a_impact: associateNominationData.accomplishments?.impact,
    a_others: associateNominationData.accomplishments?.others,

    nominated_by: associateNominationData.nominatedBy,
    nominator_designation: associateNominationData.nominatedByDesignation,
    routed_by: associateNominationData.routedBy,
    router_designation: associateNominationData.routedByDesignation,
  },
  submittedBy: associateNominationData.nominatedBy,
};


      const response = await fetch(`${API}/api/nomination/submitNomination`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedData),
      });

      if (response.ok) {
        alert("✅ Associate of the Year nomination submitted successfully!");
      } else {
        alert("❌ Submission failed!");
      }
    } catch (err) {
      console.error("❌ Frontend Error:", err);
      alert("Submission failed due to frontend error!");
    }
  }}
  className="px-4 py-2 bg-green-600 text-white rounded"
>
  Submit Associate of the Year Nomination
</button>


          </form>
        </DialogContent>
      </Dialog>
      {/* Nomination Form - Team of the Year */}
      <Dialog open={showTeamYearNominationForm} onOpenChange={setShowTeamYearNominationForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nomination Form - Team of the Year</DialogTitle>
            <DialogDescription>
              <p>Version No: 1.0</p>
              <p>Version Date: 14-Jan-21</p>
              <p>Please fill in the details below</p>
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 p-4">
            {/* TEAM DETAILS */}
            <h3 className="font-bold">TEAM DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Name of the Project"
                value={teamYearNominationData.project}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, project: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="date" placeholder="Date of Commencement"
                value={teamYearNominationData.commencementDate}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, commencementDate: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Number of Members"
                value={teamYearNominationData.numberOfMembers}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, numberOfMembers: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Names of Members"
                value={teamYearNominationData.memberNames}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, memberNames: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Nomination Period"
                value={teamYearNominationData.nominationPeriod}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, nominationPeriod: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Previous Nomination Details"
                value={teamYearNominationData.previousNominations}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, previousNominations: e.target.value })}
                className="border p-2 rounded w-full" />
            </div>

            {/* CRITERIA */}
            <h3 className="font-bold">CRITERIA AND ACCOMPLISHMENTS</h3>
            <div className="max-h-60 overflow-y-auto border rounded">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-blue-600 text-white">
                  <tr>
                    <th className="p-2">Sl. No.</th>
                    <th className="p-2">Criteria</th>
                    <th className="p-2">Accomplishment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sl: "01", label: "Consistently Exceptional Deliverable", key: "exceptionalDeliverable" },
                    { sl: "02", label: "Utilization of Resources", key: "resourceUtilization" },
                    { sl: "03", label: "Productivity of Resources", key: "resourceProductivity" },
                    { sl: "04", label: "Knowledge within the team", key: "teamKnowledge" },
                    { sl: "05", label: "Risk Management", key: "riskManagement" },
                    { sl: "06", label: "Customer Satisfaction Report / Feedback", key: "customerFeedback" },
                    { sl: "07", label: "Team Bonding / Motivation", key: "teamBonding" },
                    { sl: "08", label: "Process Compliance / Quality of Work", key: "processCompliance" },
                    { sl: "09", label: "Impact on Project / Business / Customer", key: "impact" },
                    { sl: "10", label: "Cost Effective Initiatives", key: "costEffective" },
                    { sl: "11", label: "Contribution to Organizational Targets", key: "contribution" },
                    { sl: "12", label: "Others, if any", key: "others" },
                  ].map((row) => (
                    <tr key={row.sl} className="border-t">
                      <td className="p-2">{row.sl}</td>
                      <td className="p-2">{row.label}</td>
                      <td className="p-2">
                        <textarea
                          className="w-full border p-2 rounded"
                          value={teamYearNominationData.accomplishments[row.key]}
                          onChange={(e) =>
                            setTeamYearNominationData({
                              ...teamYearNominationData,
                              accomplishments: {
                                ...teamYearNominationData.accomplishments,
                                [row.key]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NOMINATION DETAILS */}
            <h3 className="font-bold">NOMINATION DETAILS</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nominated By"
                value={teamYearNominationData.nominatedBy}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, nominatedBy: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Designation"
                value={teamYearNominationData.nominatedByDesignation}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, nominatedByDesignation: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Routed By"
                value={teamYearNominationData.routedBy}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, routedBy: e.target.value })}
                className="border p-2 rounded w-full" />
              <input type="text" placeholder="Designation"
                value={teamYearNominationData.routedByDesignation}
                onChange={(e) => setTeamYearNominationData({ ...teamYearNominationData, routedByDesignation: e.target.value })}
                className="border p-2 rounded w-full" />
            </div>

           <button
  type="button"
  onClick={async () => {
    try {
      // 🔹 Map frontend camelCase data to backend snake_case format
      const mappedData = {
        type: "Team of the Year",
        formData: {
          project_name: teamYearNominationData.projectName,
          date_commencement: teamYearNominationData.dateCommencement,
          number_of_members: teamYearNominationData.numberOfMembers,
          nomination_period: teamYearNominationData.nominationPeriod,
          names_of_members: teamYearNominationData.namesOfMembers,
          previous_nomination_details: teamYearNominationData.previousNominationDetails,

          a_deliverable: teamYearNominationData.accomplishments?.deliverable,
          a_utilization: teamYearNominationData.accomplishments?.utilization,
          a_productivity: teamYearNominationData.accomplishments?.productivity,
          a_knowledge: teamYearNominationData.accomplishments?.knowledge,
          a_risk: teamYearNominationData.accomplishments?.risk,
          a_customer_sat: teamYearNominationData.accomplishments?.customerSatisfaction,
          a_team_bonding: teamYearNominationData.accomplishments?.teamBonding,
          a_compliance: teamYearNominationData.accomplishments?.compliance,
          a_impact: teamYearNominationData.accomplishments?.impact,
          a_cost_effective: teamYearNominationData.accomplishments?.costEffective,
          a_contribution: teamYearNominationData.accomplishments?.contribution,
          a_others: teamYearNominationData.accomplishments?.others,

          nominated_by: teamYearNominationData.nominatedBy,
          nominator_designation: teamYearNominationData.nominatedByDesignation,
          routed_by: teamYearNominationData.routedBy,
          router_designation: teamYearNominationData.routedByDesignation,
        },
        submittedBy: teamYearNominationData.nominatedBy,
      };

      // 🔹 Send the mapped data to backend
      const res = await fetch(`${API}/api/nomination/submitNomination`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedData),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Team of the Year Nomination submitted successfully!");
        setShowTeamYearNominationForm(false);
      } else {
        alert("❌ Error: " + (data.error || "unknown"));
      }
    } catch (err) {
      console.error("❌ Frontend Error:", err);
      alert("Submission failed");
    }
  }}
  className="px-4 py-2 bg-green-600 text-white rounded"
>
  Submit Nomination
</button>


          </form>
        </DialogContent>
      </Dialog>
      {/* Candidate Information Form - BGV */}
<Dialog open={showCandidateInfoForm} onOpenChange={setShowCandidateInfoForm}>
  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Candidate Information Form</DialogTitle>
      <DialogDescription>
        Please fill in all mandatory details for background verification
      </DialogDescription>
    </DialogHeader>

    <form className="space-y-6 p-4">
      {/* Mandatory Fields */}
      <h3 className="font-semibold text-lg">Mandatory Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Candidate Name"
          value={candidateInfoData.candidateName}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, candidateName: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Father's Name"
          value={candidateInfoData.fatherName}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, fatherName: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="date" placeholder="Date of Birth"
          value={candidateInfoData.dob}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, dob: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="tel" placeholder="Mobile No."
          value={candidateInfoData.mobile}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, mobile: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="email" placeholder="Email ID"
          value={candidateInfoData.email}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, email: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="PAN Card No."
          value={candidateInfoData.pan}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, pan: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Passport No."
          value={candidateInfoData.passport}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, passport: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="SSN No (if applicable)"
          value={candidateInfoData.ssn}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, ssn: e.target.value })}
          className="border p-2 rounded w-full" />
      </div>

      {/* Education */}
      <h3 className="font-semibold text-lg">Education Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Course Name"
          value={candidateInfoData.course}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, course: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Registration No."
          value={candidateInfoData.registrationNo}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, registrationNo: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Duration (From / To)"
          value={candidateInfoData.duration}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, duration: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Year of Passing"
          value={candidateInfoData.passingYear}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, passingYear: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Specialization"
          value={candidateInfoData.specialization}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, specialization: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="College / Institution"
          value={candidateInfoData.college}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, college: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="University"
          value={candidateInfoData.university}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, university: e.target.value })}
          className="border p-2 rounded w-full" />
      </div>

      {/* Employment */}
      <h3 className="font-semibold text-lg">Previous Employment (Optional)</h3>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Company Name"
          value={candidateInfoData.companyName}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, companyName: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Employee ID"
          value={candidateInfoData.empId}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, empId: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Designation"
          value={candidateInfoData.designation}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, designation: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Department"
          value={candidateInfoData.department}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, department: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Period of Employment"
          value={candidateInfoData.employmentPeriod}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, employmentPeriod: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Monthly Salary"
          value={candidateInfoData.salary}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, salary: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Reason for Resignation"
          value={candidateInfoData.resignationReason}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, resignationReason: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Reporting Manager"
          value={candidateInfoData.reportingManager}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, reportingManager: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="HR Manager"
          value={candidateInfoData.hrManager}
          onChange={(e) => setCandidateInfoData({ ...candidateInfoData, hrManager: e.target.value })}
          className="border p-2 rounded w-full" />
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await fetch(`${API}/api/nomination/submitNomination`,
                
               {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "Candidate Information Form - BGV",
                  formData: candidateInfoData,
                  submittedBy: candidateInfoData.candidateName,
                }),
              });
              const data = await res.json();
              if (data.success) {
                alert("Candidate Info submitted successfully!");
                setShowCandidateInfoForm(false);
              } else {
                alert("Error: " + (data.error || "unknown"));
              }
            } catch (err) {
              console.error("❌ Frontend Error:", err);
              alert("Submission failed");
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit Form
        </button>
        <button
          type="button"
          onClick={() => setShowCandidateInfoForm(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>
{/* Letter of Authorization - BGV */}
<Dialog open={showAuthorizationForm} onOpenChange={setShowAuthorizationForm}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Letter of Authorization</DialogTitle>
      <DialogDescription>
        Please read the declaration and fill in your details
      </DialogDescription>
    </DialogHeader>

    <form className="space-y-6 p-4">
      {/* Declaration Text */}
      <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
        <p>
          I hereby authorize <b>M/s Securekloud Technologies Ltd</b> and its authorized
          representatives to verify information provided in my resume and application
          of employment, and to conduct enquiries as may be necessary, at the company's
          discretion.
        </p>
        <p className="mt-2">
          I authorize all persons who may have information relevant to this enquiry
          to disclose it to <b>M/s Securekloud Technologies Ltd</b> or its representative.
          I release all persons from liability on account of such disclosure.
        </p>
        <p className="mt-2">
          I hereby authorize concerned authorities to dispatch my confidential reports
          to <b>M/s Securekloud Technologies Ltd</b> or to its authorized representative.
        </p>
      </div>

      {/* Inputs */}
      <input
        type="text"
        placeholder="Name"
        value={authorizationData.name}
        onChange={(e) => setAuthorizationData({ ...authorizationData, name: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <input
        type="date"
        value={authorizationData.date}
        onChange={(e) => setAuthorizationData({ ...authorizationData, date: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthorizationData({ ...authorizationData, signature: reader.result }); // base64
      };
      reader.readAsDataURL(file);
    }
  }}
  className="border p-2 rounded w-full"
/>


      {/* Submit + Cancel */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await fetch(`${API}/api/nomination/submitNomination`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "Letter of Authorization - BGV",
                  formData: authorizationData,
                  submittedBy: authorizationData.name,
                }),
              });
              const data = await res.json();
              if (data.success) {
                alert("Authorization form submitted successfully!");
                setShowAuthorizationForm(false);
              } else {
                alert("Error: " + (data.error || "unknown"));
              }
            } catch (err) {
              console.error("❌ Frontend Error:", err);
              alert("Submission failed");
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit Form
        </button>
        <button
          type="button"
          onClick={() => setShowAuthorizationForm(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>

{/* ---------------- Associate Clearance Form Dialog ---------------- */}
<Dialog open={showAssociateClearanceForm} onOpenChange={setShowAssociateClearanceForm}>
  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>ASSOCIATE CLEARANCE FORM</DialogTitle>
      <DialogDescription>Read the sections below, fill in the fields and submit.</DialogDescription>
    </DialogHeader>

    <div className="p-4 space-y-4">
      {/* Top details */}
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Associate Name" value={associateClearanceData.associateName}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, associateName: e.target.value })}
          className="border p-2 rounded" />
        <input type="text" placeholder="Associate I.D." value={associateClearanceData.associateId}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, associateId: e.target.value })}
          className="border p-2 rounded" />

        <input type="text" placeholder="Designation" value={associateClearanceData.designation}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, designation: e.target.value })}
          className="border p-2 rounded" />
        <input type="text" placeholder="Department" value={associateClearanceData.department}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, department: e.target.value })}
          className="border p-2 rounded" />

        <div>
          <label className="block text-sm">Date of Joining</label>
          <input type="date" value={associateClearanceData.dateOfJoining}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, dateOfJoining: e.target.value })}
            className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm">Reporting To</label>
          <input type="text" value={associateClearanceData.reportingTo}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, reportingTo: e.target.value })}
            className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block text-sm">Date of Resignation</label>
          <input type="date" value={associateClearanceData.dateOfResignation}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, dateOfResignation: e.target.value })}
            className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm">Date of Relieving</label>
          <input type="date" value={associateClearanceData.dateOfRelieving}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, dateOfRelieving: e.target.value })}
            className="border p-2 rounded w-full" />
        </div>
      </div>

      {/* Manager / Dept Head clearance */}
      <section className="border p-3 rounded">
        <h4 className="font-semibold">Clearance from Manager / Department Head</h4>

        <div className="grid grid-cols-2 gap-4 mt-2">
          {[
            ["Documentation / Asset Handover", "docAssetStatus"],
            ["Knowledge Transfer", "ktStatus"],
            ["Client E-Mail Login", "clientEmailStatus"],
            ["Client Web Service Access", "clientWebStatus"],
            ["Other Tools and repository logins", "otherToolsStatus"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium">{label}</label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name={key} checked={associateClearanceData[key] === "Returned"}
                    onChange={() => setAssociateClearanceData(prev => ({ ...prev, [key]: "Returned" }))} />
                  <span>Returned</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name={key} checked={associateClearanceData[key] === "Disabled"}
                    onChange={() => setAssociateClearanceData(prev => ({ ...prev, [key]: "Disabled" }))} />
                  <span>Disabled</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input type="text" placeholder="Signature of K.T. receiver & Date"
            value={associateClearanceData.ktReceiver}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, ktReceiver: e.target.value })}
            className="border p-2 rounded" />
          <input type="text" placeholder="Signature of Department Head & Date"
            value={associateClearanceData.deptHeadSignature}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, deptHeadSignature: e.target.value })}
            className="border p-2 rounded" />
        </div>
      </section>

      {/* IT Admin clearance */}
      <section className="border p-3 rounded">
        <h4 className="font-semibold">Clearance from I.T. Admin Department</h4>

        <div className="grid grid-cols-2 gap-4 mt-2">
          {[
            ["Login Credentials", "loginCredentials"],
            ["Laptop / Desktop", "laptopStatus"],
            ["Email Access deactivated", "emailAccess"],
            ["AWS / MS Azure / Google Cloud Login", "cloudAccess"],
            ["Biometric & Other Access deactivated", "biometricAccess"],
            ["Active Directory Deactivation", "adDeactivation"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium">{label}</label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name={key} checked={associateClearanceData[key] === "Returned"}
                    onChange={() => setAssociateClearanceData(prev => ({ ...prev, [key]: "Returned" }))} />
                  <span>Returned</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name={key} checked={associateClearanceData[key] === "Disabled"}
                    onChange={() => setAssociateClearanceData(prev => ({ ...prev, [key]: "Disabled" }))} />
                  <span>Disabled</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <input type="text" placeholder="Signature & Date" value={associateClearanceData.itSignature}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, itSignature: e.target.value })}
            className="border p-2 rounded w-full" />
        </div>
      </section>

      {/* Accounts, Admin, HR */}
      <section className="border p-3 rounded space-y-3">
        <h4 className="font-semibold">Clearance from Accounts Department</h4>
        <textarea placeholder="Loans / Advance / Reimbursement / Others - Remarks" value={associateClearanceData.loansRemarks}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, loansRemarks: e.target.value })}
          className="border p-2 rounded w-full h-20" />
        <textarea placeholder="Claims Submitted - Remarks" value={associateClearanceData.claimsRemarks}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, claimsRemarks: e.target.value })}
          className="border p-2 rounded w-full h-20" />
        <input type="text" placeholder="Signature & Date" value={associateClearanceData.accountsSignature}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, accountsSignature: e.target.value })}
          className="border p-2 rounded w-full" />
      </section>

      <section className="border p-3 rounded space-y-3">
        <h4 className="font-semibold">Clearance from Admin Department</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Mobile / SIM</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="mobileStatus" checked={associateClearanceData.mobileStatus === "Returned"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, mobileStatus: "Returned" }))} />
                <span>Returned</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="mobileStatus" checked={associateClearanceData.mobileStatus === "Disabled"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, mobileStatus: "Disabled" }))} />
                <span>Disabled</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm">Drawer Keys</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="keysStatus" checked={associateClearanceData.keysStatus === "Returned"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, keysStatus: "Returned" }))} />
                <span>Returned</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="keysStatus" checked={associateClearanceData.keysStatus === "Disabled"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, keysStatus: "Disabled" }))} />
                <span>Disabled</span>
              </label>
            </div>
          </div>
        </div>
        <input type="text" placeholder="Signature & Date" value={associateClearanceData.adminSignature}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, adminSignature: e.target.value })}
          className="border p-2 rounded w-full" />
      </section>

      <section className="border p-3 rounded space-y-3">
        <h4 className="font-semibold">Clearance from H.R.</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Identity Card to be Returned</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="idCardStatus" checked={associateClearanceData.idCardStatus === "Returned"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, idCardStatus: "Returned" }))} />
                <span>Returned</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="idCardStatus" checked={associateClearanceData.idCardStatus === "Disabled"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, idCardStatus: "Disabled" }))} />
                <span>Disabled</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm">Time Sheet Login Disable</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="timesheetStatus" checked={associateClearanceData.timesheetStatus === "Returned"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, timesheetStatus: "Returned" }))} />
                <span>Returned</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="timesheetStatus" checked={associateClearanceData.timesheetStatus === "Disabled"}
                  onChange={() => setAssociateClearanceData(prev => ({ ...prev, timesheetStatus: "Disabled" }))} />
                <span>Disabled</span>
              </label>
            </div>
          </div>
        </div>

        <textarea placeholder="Letter of Undertaking / other HR notes" value={associateClearanceData.louStatus}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, louStatus: e.target.value })}
          className="border p-2 rounded w-full h-20" />
        <input type="text" placeholder="Medical Insurance Deletion Intimation" value={associateClearanceData.insuranceStatus}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, insuranceStatus: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="text" placeholder="Documents submitted as per Tax Declaration in ADP portal" value={associateClearanceData.taxDocsStatus}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, taxDocsStatus: e.target.value })}
          className="border p-2 rounded w-full" />

        <input type="text" placeholder="Signature & Date" value={associateClearanceData.hrSignature}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, hrSignature: e.target.value })}
          className="border p-2 rounded w-full" />
      </section>

      {/* Declaration by the associate */}
      <section className="border p-3 rounded space-y-3">
        <h4 className="font-semibold">Declaration by the Associate</h4>
        <textarea className="border p-2 rounded w-full h-28" value={associateClearanceData.declaration}
          onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, declaration: e.target.value })} />

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Associate Signature & Date" value={associateClearanceData.associateSignature}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, associateSignature: e.target.value })}
            className="border p-2 rounded w-full" />
          <input type="text" placeholder="Associate Address & Phone No" value={associateClearanceData.associateAddress}
            onChange={(e) => setAssociateClearanceData({ ...associateClearanceData, associateAddress: e.target.value })}
            className="border p-2 rounded w-full" />
        </div>
      </section>

      {/* Signature upload */}
      <div>
        <label className="block font-medium">Upload Signature (image)</label>
        <input type="file" accept="image/*" onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          handleSignatureFile(f || null, "associateSignature");
        }} />
        <p className="text-sm text-gray-500 mt-1">Optional. If uploaded, signature will be embedded into PDF.</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowAssociateClearanceForm(false)}>Cancel</button>
        <button type="button" className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={async () => {
            try {
              const res = await fetch(`${API}/api/nomination/submitNomination`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "Associate Clearance Form",
                  formData: associateClearanceData,
                  submittedBy: associateClearanceData.associateName || "N/A",
                }),
              });
              const data = await res.json();
              if (data.success) {
                alert("Associate Clearance Form submitted successfully!");
                setShowAssociateClearanceForm(false);
              } else {
                alert("Error: " + (data.error || "unknown"));
              }
            } catch (err) {
              console.error("Submit Error:", err);
              alert("Submission failed");
            }
          }}
        >
          Submit Form
        </button>
      </div>
    </div>
  </DialogContent>
</Dialog>
{/* ---------------- end Associate Clearance Form Dialog ---------------- */}

{/* ---------------- Exit Interview Template Form ---------------- */}
<Dialog open={showExitInterviewForm} onOpenChange={setShowExitInterviewForm}>
  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Exit Interview Template</DialogTitle>
      <DialogDescription>
        Please fill out this survey before your last working day
      </DialogDescription>
    </DialogHeader>

    <form
      onSubmit={handleSubmitExitInterview}
      className="space-y-4 p-4 text-sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="Associate Name" name="associateName" className="border p-2 rounded w-full" />
        <input type="text" placeholder="Associate ID" name="associateId" className="border p-2 rounded w-full" />
        <input type="text" placeholder="Designation" name="designation" className="border p-2 rounded w-full" />
        <input type="text" placeholder="Band / Level" name="bandLevel" className="border p-2 rounded w-full" />
        <input type="text" placeholder="Department" name="department" className="border p-2 rounded w-full" />
        <input type="text" placeholder="Department Head" name="departmentHead" className="border p-2 rounded w-full" />
        <input type="date" placeholder="Date of Joining" name="joiningDate" className="border p-2 rounded w-full" />
        <input type="date" placeholder="Exit Survey Date" name="exitSurveyDate" className="border p-2 rounded w-full" />
      </div>

      <h3 className="font-semibold mt-4">Reasons for Joining SecureKloud</h3>
      <div className="grid grid-cols-2 gap-2">
        {["Career growth", "Compensation", "Company reputation", "Work culture", "Location"].map((reason) => (
          <label key={reason} className="flex items-center space-x-2">
            <input type="checkbox" name="reasonsForJoining" value={reason} />
            <span>{reason}</span>
          </label>
        ))}
      </div>

      <h3 className="font-semibold mt-4">Reasons for Leaving SecureKloud</h3>
      <div className="grid grid-cols-2 gap-2">
        {["Better opportunity", "Work environment", "Compensation", "Relocation", "Personal reasons"].map((reason) => (
          <label key={reason} className="flex items-center space-x-2">
            <input type="checkbox" name="reasonsForQuitting" value={reason} />
            <span>{reason}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mt-4">HR Remarks</h3>
        <textarea name="hrRemarks" className="border p-2 rounded w-full" rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="HR Name" name="hrName" className="border p-2 rounded w-full" />
        <input type="date" placeholder="Date" name="date" className="border p-2 rounded w-full" />
      </div>

      <div className="flex justify-end space-x-2">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          Submit Form
        </button>
        <button
          type="button"
          onClick={() => setShowExitInterviewForm(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>
{/* ---------------- Gratuity Declaration Form Dialog ---------------- */}
<Dialog open={showGratuityForm} onOpenChange={setShowGratuityForm}>
  <DialogTrigger asChild>
    {/* Add a button somewhere in the UI to open the form — if you already have a menu item, use that */}
   
  </DialogTrigger>

  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle className="text-center font-bold text-xl">
      GRATUITY DECLARATION FORM
    </DialogTitle>
    <DialogDescription className="text-center text-gray-600">
      (As per Payment of Gratuity Act, 1972)
    </DialogDescription>
  </DialogHeader>

  <form className="space-y-6 p-4">
    <div className="text-sm text-gray-700 leading-relaxed space-y-3">
      <p>
        I, <b>{gratuityData.employeeName || "__________"}</b> (Employee ID:{" "}
        <b>{gratuityData.employeeId || "__________"}</b>), hereby declare that
        I have been informed about the provisions of the Payment of Gratuity Act, 1972.
      </p>
      <p>
        I understand that the gratuity payable to me on separation from the
        organization will be as per the terms and eligibility prescribed under
        the said Act.
      </p>
      <p>
        I hereby confirm my declaration under the following option:
      </p>
    </div>

    <div className="space-y-2">
      <label className="font-semibold">Declaration Option</label>
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="A"
            checked={gratuityData.declarationOption === "A"}
            onChange={(e) =>
              setGratuityData({ ...gratuityData, declarationOption: e.target.value })
            }
          />
          <span>
            A. I wish to claim gratuity as per the Payment of Gratuity Act, 1972.
          </span>
        </label>
      </div>
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="B"
            checked={gratuityData.declarationOption === "B"}
            onChange={(e) =>
              setGratuityData({ ...gratuityData, declarationOption: e.target.value })
            }
          />
          <span>
            B. I do not wish to claim gratuity benefits under the Act.
          </span>
        </label>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Employee Name"
        value={gratuityData.employeeName}
        onChange={(e) => setGratuityData({ ...gratuityData, employeeName: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Employee ID"
        value={gratuityData.employeeId}
        onChange={(e) => setGratuityData({ ...gratuityData, employeeId: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Address"
        value={gratuityData.address}
        onChange={(e) => setGratuityData({ ...gratuityData, address: e.target.value })}
        className="border p-2 rounded w-full col-span-2"
      />
      <input
        type="text"
        placeholder="Place"
        value={gratuityData.place}
        onChange={(e) => setGratuityData({ ...gratuityData, place: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="date"
        placeholder="Date"
        value={gratuityData.date}
        onChange={(e) => setGratuityData({ ...gratuityData, date: e.target.value })}
        className="border p-2 rounded w-full"
      />
    </div>

    <div className="space-y-2">
      <label className="font-semibold">Upload Signature</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
              setGratuityData({ ...gratuityData, signature: reader.result as string });
            reader.readAsDataURL(file);
          }
        }}
        className="border p-2 rounded w-full"
      />
      {gratuityData.signature && (
        <img
          src={gratuityData.signature}
          alt="Signature Preview"
          className="w-32 h-16 border rounded mt-2"
        />
      )}
    </div>

    <div className="flex justify-end space-x-2">
      <button
        type="button"
        onClick={() => setShowGratuityForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(`${API}/api/nomination/submitNomination`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "Gratuity Declaration Form",
                formData: gratuityData,
                submittedBy: gratuityData.employeeName,
              }),
            });
            const data = await res.json();
            if (data.success) {
              alert("Form submitted successfully!");
              setShowGratuityForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ Frontend Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
    </div>
  </form>
</DialogContent>

</Dialog>
{/* ---------------- end Gratuity Dialog ---------------- */}


<Dialog open={showUndertakingForm} onOpenChange={setShowUndertakingForm}>
  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Letter of Undertaking & Confirmation</DialogTitle>
    </DialogHeader>

    {/* Date */}
    <input
      type="date"
      value={undertakingData.date}
      onChange={(e) =>
        setUndertakingData({ ...undertakingData, date: e.target.value })
      }
      className="border p-2 rounded w-full mb-4"
    />

    {/* Company Address */}
    <p className="text-sm mb-4">
      Secure Kloud Technologies Limited<br />
      5th floor, Bascon Futura Sv It Park,<br />
      SV 10/1, Venkatnarayana Road,<br />
      T-Nagar, Chennai – 600 017.
    </p>

    <p className="font-semibold mb-4">
      Sub: Letter of Undertaking & Confirmation
    </p>

    {/* Associate Introduction */}
    <p>I,</p>
    <input
      type="text"
      placeholder="Associate Name"
      value={undertakingData.associateName}
      onChange={(e) =>
        setUndertakingData({
          ...undertakingData,
          associateName: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />

    <p>son/daughter/wife of</p>
    <input
      type="text"
      placeholder="Relative Name"
      value={undertakingData.relativeName}
      onChange={(e) =>
        setUndertakingData({
          ...undertakingData,
          relativeName: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />

    <p>residing at</p>
    <textarea
      placeholder="Address"
      value={undertakingData.address}
      onChange={(e) =>
        setUndertakingData({
          ...undertakingData,
          address: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />

    <p>employed with Secure Kloud Technologies Limited …</p>

    {/* Clause 1 */}
    <p className="mt-4">1. I was employed as</p>
    <input
      type="text"
      placeholder="Designation"
      value={undertakingData.designation}
      onChange={(e) =>
        setUndertakingData({
          ...undertakingData,
          designation: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />
    <p>with the Company since</p>
    <input
      type="date"
      value={undertakingData.joiningDate}
      onChange={(e) =>
        setUndertakingData({
          ...undertakingData,
          joiningDate: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />

    {/* Clause 2 */}
    <p className="mt-4">
      2. I have voluntarily resigned … vide my email dated
    </p>
    <input
      type="date"
      value={undertakingData.resignationDate}
      onChange={(e) =>
        setUndertakingData({
          ...undertakingData,
          resignationDate: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />

    {/* Clause 3–6, 8–11 (static text) */}
    <p className="mt-4 text-sm">
      3. I understand and confirm … (insert full clause text from PDF here)
    </p>
    <p className="mt-2 text-sm">
      4. (Full clause 4 text from PDF)
    </p>
    <p className="mt-2 text-sm">
      5. (Full clause 5 text from PDF)
    </p>
    <p className="mt-2 text-sm">
      6. (Full clause 6 text from PDF)
    </p>
    {/* Clause 7 with checkbox */}
    <div className="mt-4">
      <label>
        <input
          type="checkbox"
          checked={undertakingData.isDirector}
          onChange={(e) =>
            setUndertakingData({
              ...undertakingData,
              isDirector: e.target.checked,
            })
          }
        />{" "}
        Applicable for Director and above (include Clause 7)
      </label>
    </div>
    <p className="mt-2 text-sm">
      8. (Full clause 8 text from PDF)
    </p>
    <p className="mt-2 text-sm">
      9. (Full clause 9 text from PDF)
    </p>
    <p className="mt-2 text-sm">
      10. (Full clause 10 text from PDF)
    </p>
    <p className="mt-2 text-sm">
      11. (Full clause 11 text from PDF)
    </p>

    {/* Footer */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <input
        type="text"
        placeholder="Place"
        value={undertakingData.place}
        onChange={(e) =>
          setUndertakingData({
            ...undertakingData,
            place: e.target.value,
          })
        }
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Name of Associate"
        value={undertakingData.associateName}
        onChange={(e) =>
          setUndertakingData({
            ...undertakingData,
            associateName: e.target.value,
          })
        }
        className="border p-2 rounded"
      />
    </div>

    <div className="mt-4">
      <label className="block mb-2">Signature of Associate</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setUndertakingData({
            ...undertakingData,
            signature: e.target.files?.[0]?.name || "",
          })
        }
        className="border p-2 rounded w-full"
      />
    </div>

    {/* Submit + Cancel */}
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(
              `${API}/api/nomination/submitNomination`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "Letter of Undertaking Separation",
                  formData: undertakingData,
                  submittedBy: undertakingData.associateName,
                }),
              }
            );
            const data = await res.json();
            if (data.success) {
              alert("Letter of Undertaking submitted successfully!");
              setShowUndertakingForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ Undertaking Submit Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setShowUndertakingForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>
<Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Contract Invoice Template</DialogTitle>
    </DialogHeader>

    {/* Invoice Details */}
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Invoice Number"
        value={invoiceData.invoiceNumber}
        onChange={(e) =>
          setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })
        }
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={invoiceData.invoiceDate}
        onChange={(e) =>
          setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })
        }
        className="border p-2 rounded"
      />
    </div>

    {/* Consultant Details */}
    <input
      type="text"
      placeholder="Consultant Name"
      value={invoiceData.consultantName}
      onChange={(e) =>
        setInvoiceData({ ...invoiceData, consultantName: e.target.value })
      }
      className="border p-2 rounded w-full mt-2"
    />
    <textarea
      placeholder="Consultant Address"
      value={invoiceData.consultantAddress}
      onChange={(e) =>
        setInvoiceData({ ...invoiceData, consultantAddress: e.target.value })
      }
      className="border p-2 rounded w-full mt-2"
    />
    <input
      type="text"
      placeholder="Mobile Number"
      value={invoiceData.consultantMobile}
      onChange={(e) =>
        setInvoiceData({ ...invoiceData, consultantMobile: e.target.value })
      }
      className="border p-2 rounded w-full mt-2"
    />

    {/* Bill To (static) */}
    <p className="font-semibold mt-4">Bill To:</p>
    <p className="text-sm">
      SecureKloud Technologies Limited<br />
      5th Floor, No. 37 & 38, ASV Ramana Towers,<br />
      Venkat Narayana Road, T Nagar, Chennai – 600017.
    </p>

    {/* Services */}
    <div className="mt-4">
      <p className="font-semibold mb-2">Services</p>
      {invoiceData.services.map((service, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
          <input
            type="text"
            placeholder="Description"
            value={service.description}
            onChange={(e) => {
              const services = [...invoiceData.services];
              services[index].description = e.target.value;
              setInvoiceData({ ...invoiceData, services });
            }}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Hours"
            value={service.hours}
            onChange={(e) => {
              const services = [...invoiceData.services];
              services[index].hours = Number(e.target.value);
              services[index].amount =
                services[index].hours * services[index].rate;
              setInvoiceData({ ...invoiceData, services });
            }}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Rate"
            value={service.rate}
            onChange={(e) => {
              const services = [...invoiceData.services];
              services[index].rate = Number(e.target.value);
              services[index].amount =
                services[index].hours * services[index].rate;
              setInvoiceData({ ...invoiceData, services });
            }}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={service.amount}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setInvoiceData({
            ...invoiceData,
            services: [
              ...invoiceData.services,
              { description: "", hours: 0, rate: 0, amount: 0 },
            ],
          })
        }
        className="px-2 py-1 bg-blue-600 text-white rounded"
      >
        + Add Row
      </button>
    </div>

    {/* Total */}
    <p className="mt-4 font-semibold">
      Total Amount: ₹
      {invoiceData.services.reduce((sum, s) => sum + s.amount, 0)}
    </p>

    {/* Bank Details */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <input
        type="text"
        placeholder="Bank Name"
        value={invoiceData.bankName}
        onChange={(e) =>
          setInvoiceData({ ...invoiceData, bankName: e.target.value })
        }
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Bank Branch"
        value={invoiceData.bankBranch}
        onChange={(e) =>
          setInvoiceData({ ...invoiceData, bankBranch: e.target.value })
        }
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="IFSC Code"
        value={invoiceData.ifscCode}
        onChange={(e) =>
          setInvoiceData({ ...invoiceData, ifscCode: e.target.value })
        }
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Account Number"
        value={invoiceData.accountNumber}
        onChange={(e) =>
          setInvoiceData({ ...invoiceData, accountNumber: e.target.value })
        }
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="PAN Number"
        value={invoiceData.panNumber}
        onChange={(e) =>
          setInvoiceData({ ...invoiceData, panNumber: e.target.value })
        }
        className="border p-2 rounded"
      />
    </div>

    {/* Signature */}
    <div className="mt-4">
      <label className="block mb-2">Signature</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setInvoiceData({
            ...invoiceData,
            signature: e.target.files?.[0]?.name || "",
          })
        }
        className="border p-2 rounded w-full"
      />
    </div>

    <p className="mt-2 text-sm italic">
      Note: I am below the GST threshold of 20 Lakhs per annum.
    </p>

    {/* Submit + Cancel */}
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(
              `${API}/api/nomination/submitNomination`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "Contract Invoice Template",
                  formData: invoiceData,
                  submittedBy: invoiceData.consultantName,
                }),
              }
            );
            const data = await res.json();
            if (data.success) {
              alert("Invoice submitted successfully!");
              setShowInvoiceForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ Invoice Submit Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setShowInvoiceForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>
<Dialog open={showTimesheetForm} onOpenChange={setShowTimesheetForm}>
  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Contract Timesheet Template</DialogTitle>
    </DialogHeader>

    {/* Consultant Name */}
    <input
      type="text"
      placeholder="Consultant Name"
      value={timesheetData.consultantName}
      onChange={(e) =>
        setTimesheetData({ ...timesheetData, consultantName: e.target.value })
      }
      className="border p-2 rounded w-full mb-4"
    />

    {/* Timesheet Table */}
    <div>
      <p className="font-semibold mb-2">Timesheet Entries</p>
      {timesheetData.entries.map((entry, index) => (
        <div key={index} className="grid grid-cols-3 gap-2 mb-2">
          <input
            type="date"
            value={entry.date}
            onChange={(e) => {
              const entries = [...timesheetData.entries];
              entries[index].date = e.target.value;
              setTimesheetData({ ...timesheetData, entries });
            }}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Module"
            value={entry.module}
            onChange={(e) => {
              const entries = [...timesheetData.entries];
              entries[index].module = e.target.value;
              setTimesheetData({ ...timesheetData, entries });
            }}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Hours Worked"
            value={entry.hours}
            onChange={(e) => {
              const entries = [...timesheetData.entries];
              entries[index].hours = Number(e.target.value);
              setTimesheetData({ ...timesheetData, entries });
            }}
            className="border p-2 rounded"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setTimesheetData({
            ...timesheetData,
            entries: [
              ...timesheetData.entries,
              { date: "", module: "", hours: 0 },
            ],
          })
        }
        className="px-2 py-1 bg-blue-600 text-white rounded"
      >
        + Add Row
      </button>
    </div>

    {/* Total Hours */}
    <p className="mt-4 font-semibold">
      Total Hours:{" "}
      {timesheetData.entries.reduce((sum, e) => sum + e.hours, 0)}
    </p>

    {/* Description */}
    <textarea
      placeholder="Description of modules and activity"
      value={timesheetData.description}
      onChange={(e) =>
        setTimesheetData({ ...timesheetData, description: e.target.value })
      }
      className="border p-2 rounded w-full mt-4"
    />

    {/* Submit + Cancel */}
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(
              `${API}/api/nomination/submitNomination`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "Contract Timesheet Template",
                  formData: timesheetData,
                  submittedBy: timesheetData.consultantName,
                }),
              }
            );
            const data = await res.json();
            if (data.success) {
              alert("Timesheet submitted successfully!");
              setShowTimesheetForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ Timesheet Submit Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setShowTimesheetForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>
<Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Expense Reimbursement Form</DialogTitle>
    </DialogHeader>

    {/* Employee Info */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <input
        type="text"
        placeholder="Employee Name"
        value={expenseData.employeeName}
        onChange={(e) => setExpenseData({ ...expenseData, employeeName: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="EMP ID"
        value={expenseData.empId}
        onChange={(e) => setExpenseData({ ...expenseData, empId: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Manager Name"
        value={expenseData.managerName}
        onChange={(e) => setExpenseData({ ...expenseData, managerName: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Department"
        value={expenseData.department}
        onChange={(e) => setExpenseData({ ...expenseData, department: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={expenseData.fromDate}
        onChange={(e) => setExpenseData({ ...expenseData, fromDate: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={expenseData.toDate}
        onChange={(e) => setExpenseData({ ...expenseData, toDate: e.target.value })}
        className="border p-2 rounded"
      />
    </div>

    <input
      type="text"
      placeholder="Business Purpose / Project"
      value={expenseData.businessPurpose}
      onChange={(e) => setExpenseData({ ...expenseData, businessPurpose: e.target.value })}
      className="border p-2 rounded w-full mb-4"
    />

    {/* Expenses Table */}
    <div>
      <p className="font-semibold mb-2">Itemized Expenses</p>
      {expenseData.expenses.map((exp, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
          <input
            type="date"
            value={exp.date}
            onChange={(e) => {
              const expenses = [...expenseData.expenses];
              expenses[index].date = e.target.value;
              setExpenseData({ ...expenseData, expenses });
            }}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={exp.description}
            onChange={(e) => {
              const expenses = [...expenseData.expenses];
              expenses[index].description = e.target.value;
              setExpenseData({ ...expenseData, expenses });
            }}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={exp.category}
            onChange={(e) => {
              const expenses = [...expenseData.expenses];
              expenses[index].category = e.target.value;
              setExpenseData({ ...expenseData, expenses });
            }}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Cost"
            value={exp.cost}
            onChange={(e) => {
              const expenses = [...expenseData.expenses];
              expenses[index].cost = Number(e.target.value);
              setExpenseData({ ...expenseData, expenses });
            }}
            className="border p-2 rounded"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setExpenseData({
            ...expenseData,
            expenses: [...expenseData.expenses, { date: "", description: "", category: "", cost: 0 }],
          })
        }
        className="px-2 py-1 bg-blue-600 text-white rounded"
      >
        + Add Row
      </button>
    </div>

    {/* Totals */}
    <p className="mt-4">Subtotal: ₹{expenseData.expenses.reduce((sum, e) => sum + e.cost, 0)}</p>
    <input
      type="number"
      placeholder="Less Cash Advance"
      value={expenseData.cashAdvance}
      onChange={(e) => setExpenseData({ ...expenseData, cashAdvance: Number(e.target.value) })}
      className="border p-2 rounded mt-2"
    />
    <p className="mt-2 font-semibold">
      Total: ₹{expenseData.expenses.reduce((sum, e) => sum + e.cost, 0) - expenseData.cashAdvance}
    </p>

    {/* Receipts */}
    <div className="mt-4">
      <label className="block mb-2">Attach Receipts</label>
      <input
        type="file"
        multiple
        onChange={(e) =>
          setExpenseData({ ...expenseData, receipts: Array.from(e.target.files || []) })
        }
        className="border p-2 rounded w-full"
      />
    </div>

    {/* Signatures */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label className="block mb-2">Employee Signature</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setExpenseData({ ...expenseData, employeeSignature: e.target.files?.[0]?.name || "" })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={expenseData.employeeDate}
          onChange={(e) => setExpenseData({ ...expenseData, employeeDate: e.target.value })}
          className="border p-2 rounded mt-2 w-full"
        />
      </div>
      <div>
        <label className="block mb-2">Approval Signature</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setExpenseData({ ...expenseData, approvalSignature: e.target.files?.[0]?.name || "" })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={expenseData.approvalDate}
          onChange={(e) => setExpenseData({ ...expenseData, approvalDate: e.target.value })}
          className="border p-2 rounded mt-2 w-full"
        />
      </div>
    </div>

    {/* Submit + Cancel */}
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(`${API}/api/nomination/submitNomination`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "Expense Reimbursement Form",
                formData: expenseData,
                submittedBy: expenseData.employeeName,
              }),
            });
            const data = await res.json();
            if (data.success) {
              alert("Expense Reimbursement submitted successfully!");
              setShowExpenseForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ Expense Submit Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setShowExpenseForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>
<Dialog open={showInductionForm} onOpenChange={setShowInductionForm}>
  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Induction Feedback Form</DialogTitle>
    </DialogHeader>

    {/* Associate Details */}
    <div className="grid grid-cols-2 gap-4">
      <input type="text" placeholder="Associate Name"
        value={inductionData.associateName}
        onChange={(e) => setInductionData({ ...inductionData, associateName: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Employee Number"
        value={inductionData.employeeNumber}
        onChange={(e) => setInductionData({ ...inductionData, employeeNumber: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Designation"
        value={inductionData.designation}
        onChange={(e) => setInductionData({ ...inductionData, designation: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Department"
        value={inductionData.department}
        onChange={(e) => setInductionData({ ...inductionData, department: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Trainer(s)"
        value={inductionData.trainers}
        onChange={(e) => setInductionData({ ...inductionData, trainers: e.target.value })}
        className="border p-2 rounded" />
      <input type="date"
        value={inductionData.trainingDate}
        onChange={(e) => setInductionData({ ...inductionData, trainingDate: e.target.value })}
        className="border p-2 rounded" />
    </div>

    {/* Tick where appropriate */}
    <div className="mt-6">
      <p className="font-semibold mb-2">Please tick where appropriate</p>
      {[
        "Onboarding in Person / Virtual was smooth",
        "Induction programme duration was adequate",
        "Induction programme was well managed",
        "I have been well informed of the organization Policies",
        "Information provided helped me understand the business better",
        "Introduced to Manager / Supervisor within 3 days"
      ].map((q, idx) => (
        <div key={idx} className="mb-2">
          <p>{q}</p>
          {["Agree", "Somewhat Agree", "Disagree"].map((opt) => (
            <label key={opt} className="ml-2">
              <input type="radio" name={`q${idx}`} value={opt}
                checked={inductionData.responses[idx] === opt}
                onChange={() => {
                  const responses = [...inductionData.responses];
                  responses[idx] = opt;
                  setInductionData({ ...inductionData, responses });
                }} />
              {opt}
            </label>
          ))}
        </div>
      ))}
    </div>

    {/* Ratings Table */}
    <div className="mt-6">
      <p className="font-semibold mb-2">Rate the following (1-4)</p>
      {["Coverage Duration Speaker", "Business Orientation", "H.R. Orientation", "Finance Orientation", "Marketing Orientation", "I.T Admin Orientation"].map((param, idx) => (
        <div key={idx} className="mb-2">
          <p>{param}</p>
          {[1, 2, 3, 4].map((val) => (
            <label key={val} className="ml-2">
              <input type="radio" name={`rating${idx}`} value={val}
                checked={inductionData.ratings[idx] === val}
                onChange={() => {
                  const ratings = [...inductionData.ratings];
                  ratings[idx] = val;
                  setInductionData({ ...inductionData, ratings });
                }} />
              {val}
            </label>
          ))}
        </div>
      ))}
    </div>

    {/* Suggestions */}
    <textarea
      placeholder="Do you have any suggestions on improving these sessions?"
      value={inductionData.suggestions}
      onChange={(e) => setInductionData({ ...inductionData, suggestions: e.target.value })}
      className="border p-2 rounded w-full mt-4"
    />

    {/* Overall Rating */}
    <div className="mt-6">
      <p className="font-semibold mb-2">Overall, how would you rate the induction programme?</p>
      {["Exceeds Expectation", "Meets Expectation", "Needs Improvement", "Unsatisfactory"].map((opt) => (
        <label key={opt} className="block">
          <input type="radio" name="overall" value={opt}
            checked={inductionData.overall === opt}
            onChange={() => setInductionData({ ...inductionData, overall: opt })} />
          {opt}
        </label>
      ))}
    </div>

    {/* Additional Comments */}
    <textarea
      placeholder="Additional comments or suggestions"
      value={inductionData.comments}
      onChange={(e) => setInductionData({ ...inductionData, comments: e.target.value })}
      className="border p-2 rounded w-full mt-4"
    />

    {/* Footer */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <input type="text" placeholder="Signature of Associate"
        value={inductionData.signature}
        onChange={(e) => setInductionData({ ...inductionData, signature: e.target.value })}
        className="border p-2 rounded" />
      <input type="date"
        value={inductionData.date}
        onChange={(e) => setInductionData({ ...inductionData, date: e.target.value })}
        className="border p-2 rounded" />
    </div>

    {/* Submit + Cancel */}
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(`${API}/api/nomination/submitNomination`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "Induction Feedback Form",
                formData: inductionData,
                submittedBy: inductionData.associateName,
              }),
            });
            const data = await res.json();
            if (data.success) {
              alert("Induction Feedback submitted successfully!");
              setShowInductionForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ Induction Feedback Submit Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setShowInductionForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>
<Dialog open={showInternOnrollForm} onOpenChange={setShowInternOnrollForm}>
  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Intern to Onroll Movement Template</DialogTitle>
    </DialogHeader>

    {/* Intern Details */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <input type="text" placeholder="Intern ID"
        value={internOnrollData.internId}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, internId: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Intern Name"
        value={internOnrollData.internName}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, internName: e.target.value })}
        className="border p-2 rounded" />
      <input type="date" placeholder="Joining Date"
        value={internOnrollData.joiningDate}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, joiningDate: e.target.value })}
        className="border p-2 rounded" />
      <input type="date" placeholder="Completion Date"
        value={internOnrollData.completionDate}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, completionDate: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Internship Title / Project"
        value={internOnrollData.projectTitle}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, projectTitle: e.target.value })}
        className="border p-2 rounded col-span-2" />
      <input type="text" placeholder="Department"
        value={internOnrollData.department}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, department: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Reporting Manager"
        value={internOnrollData.reportingManager}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, reportingManager: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Department Head"
        value={internOnrollData.departmentHead}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, departmentHead: e.target.value })}
        className="border p-2 rounded" />
      <input type="date" placeholder="Onroll Date"
        value={internOnrollData.onrollDate}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, onrollDate: e.target.value })}
        className="border p-2 rounded" />
    </div>

    {/* Ratings */}
    <div className="mt-4">
      <p className="font-semibold">Areas of Assessment (1–5)</p>
      {[
        ["Learnability", "learnability"],
        ["Technical Competence – Skills acquired", "technical"],
        ["Responsibility / Accountability", "responsibility"],
        ["Attendance", "attendance"],
        ["Teamwork", "teamwork"],
        ["Attitude", "attitude"],
      ].map(([label, key]) => (
        <div key={key} className="mb-2">
          <p>{label}</p>
          {[1, 2, 3, 4, 5].map((val) => (
            <label key={val} className="ml-2">
              <input
                type="radio"
                name={key}
                value={val}
                checked={internOnrollData.ratings[key] === val}
                onChange={() =>
                  setInternOnrollData({
                    ...internOnrollData,
                    ratings: { ...internOnrollData.ratings, [key]: val },
                  })
                }
              />
              {val}
            </label>
          ))}
        </div>
      ))}
    </div>

    {/* Recommendation */}
    <div className="mt-4">
      <p className="font-semibold">Recommendation (Justification)</p>
      <textarea
        placeholder="Justification for conversion to on roll"
        value={internOnrollData.justification}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, justification: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <div className="mt-2">
        <label>
          <input
            type="radio"
            value="Yes"
            checked={internOnrollData.recommendation === "Yes"}
            onChange={() => setInternOnrollData({ ...internOnrollData, recommendation: "Yes" })}
          />
          Recommended to be part of SecureKloud
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="No"
            checked={internOnrollData.recommendation === "No"}
            onChange={() => setInternOnrollData({ ...internOnrollData, recommendation: "No" })}
          />
          Not Recommended
        </label>
      </div>
    </div>

    {/* Footer */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <input type="text" placeholder="Signature"
        value={internOnrollData.signature}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, signature: e.target.value })}
        className="border p-2 rounded" />
      <input type="date"
        value={internOnrollData.date}
        onChange={(e) => setInternOnrollData({ ...internOnrollData, date: e.target.value })}
        className="border p-2 rounded" />
    </div>

    {/* Submit + Cancel */}
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(`${API}/api/nomination/submitNomination`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "Intern to Onroll Movement",
                formData: internOnrollData,
                submittedBy: internOnrollData.internName,
              }),
            });
            const data = await res.json();
            if (data.success) {
              alert("Intern Onroll Movement submitted successfully!");
              setShowInternOnrollForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ Intern Onroll Submit Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setShowInternOnrollForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>
<Dialog open={showPipForm} onOpenChange={setShowPipForm}>
  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Performance Improvement Plan (PIP) Letter</DialogTitle>
    </DialogHeader>

    {/* Header Info */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <input type="date"
        value={pipData.date}
        onChange={(e) => setPipData({ ...pipData, date: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Employee Name"
        value={pipData.employeeName}
        onChange={(e) => setPipData({ ...pipData, employeeName: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Employee ID"
        value={pipData.employeeId}
        onChange={(e) => setPipData({ ...pipData, employeeId: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Designation"
        value={pipData.designation}
        onChange={(e) => setPipData({ ...pipData, designation: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Department"
        value={pipData.department}
        onChange={(e) => setPipData({ ...pipData, department: e.target.value })}
        className="border p-2 rounded" />
      <input type="text" placeholder="Manager"
        value={pipData.manager}
        onChange={(e) => setPipData({ ...pipData, manager: e.target.value })}
        className="border p-2 rounded" />
    </div>

    {/* PIP Details */}
    <textarea
      placeholder="Performance Concerns"
      value={pipData.concerns}
      onChange={(e) => setPipData({ ...pipData, concerns: e.target.value })}
      className="border p-2 rounded w-full mb-4"
    />
    <textarea
      placeholder="Improvement Areas"
      value={pipData.improvementAreas}
      onChange={(e) => setPipData({ ...pipData, improvementAreas: e.target.value })}
      className="border p-2 rounded w-full mb-4"
    />
    <textarea
      placeholder="Goals / Targets to be achieved"
      value={pipData.goals}
      onChange={(e) => setPipData({ ...pipData, goals: e.target.value })}
      className="border p-2 rounded w-full mb-4"
    />
    <textarea
      placeholder="Support & Resources provided"
      value={pipData.support}
      onChange={(e) => setPipData({ ...pipData, support: e.target.value })}
      className="border p-2 rounded w-full mb-4"
    />

    {/* Review Period */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <input type="date"
        value={pipData.reviewStart}
        onChange={(e) => setPipData({ ...pipData, reviewStart: e.target.value })}
        className="border p-2 rounded" />
      <input type="date"
        value={pipData.reviewEnd}
        onChange={(e) => setPipData({ ...pipData, reviewEnd: e.target.value })}
        className="border p-2 rounded" />
    </div>

    {/* Review Frequency */}
    <div className="mb-4">
      <p className="font-semibold">Review Frequency</p>
      {["Weekly", "Bi-Weekly", "Monthly"].map((opt) => (
        <label key={opt} className="ml-2">
          <input
            type="radio"
            name="reviewFrequency"
            value={opt}
            checked={pipData.reviewFrequency === opt}
            onChange={() => setPipData({ ...pipData, reviewFrequency: opt })}
          />
          {opt}
        </label>
      ))}
    </div>

    {/* Acknowledgement */}
    <textarea
      placeholder="Employee Comments"
      value={pipData.employeeComments}
      onChange={(e) => setPipData({ ...pipData, employeeComments: e.target.value })}
      className="border p-2 rounded w-full mb-4"
    />

    {/* Signatures */}
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div>
        <label>Employee Signature</label>
        <input type="text" placeholder="Employee Signature"
          value={pipData.employeeSignature}
          onChange={(e) => setPipData({ ...pipData, employeeSignature: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="date"
          value={pipData.employeeDate}
          onChange={(e) => setPipData({ ...pipData, employeeDate: e.target.value })}
          className="border p-2 rounded w-full mt-2" />
      </div>
      <div>
        <label>Manager Signature</label>
        <input type="text" placeholder="Manager Signature"
          value={pipData.managerSignature}
          onChange={(e) => setPipData({ ...pipData, managerSignature: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="date"
          value={pipData.managerDate}
          onChange={(e) => setPipData({ ...pipData, managerDate: e.target.value })}
          className="border p-2 rounded w-full mt-2" />
      </div>
      <div>
        <label>HR Signature</label>
        <input type="text" placeholder="HR Signature"
          value={pipData.hrSignature}
          onChange={(e) => setPipData({ ...pipData, hrSignature: e.target.value })}
          className="border p-2 rounded w-full" />
        <input type="date"
          value={pipData.hrDate}
          onChange={(e) => setPipData({ ...pipData, hrDate: e.target.value })}
          className="border p-2 rounded w-full mt-2" />
      </div>
    </div>

    {/* Submit + Cancel */}
    <div className="flex justify-end space-x-2 mt-4">
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(`${API}/api/nomination/submitNomination`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "PIP Letter Template",
                formData: pipData,
                submittedBy: pipData.employeeName,
              }),
            });
            const data = await res.json();
            if (data.success) {
              alert("PIP Letter submitted successfully!");
              setShowPipForm(false);
            } else {
              alert("Error: " + (data.error || "unknown"));
            }
          } catch (err) {
            console.error("❌ PIP Submit Error:", err);
            alert("Submission failed");
          }
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => setShowPipForm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
    </div>
  </DialogContent>
</Dialog>




      {/* Payroll Modal */}
      <Dialog open={showPayrollModal} onOpenChange={setShowPayrollModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payroll Information</DialogTitle>
            <DialogDescription>
              <div className="text-left text-sm space-y-6 mt-4 text-muted-foreground">
                <table className="w-full text-sm border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-blue-600 text-white text-left">
                      <th className="p-2 w-1/2">Details</th>
                      <th className="p-2 w-1/2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        detail: "Payroll Cycle",
                        description: "The payroll cycle for a month is 21st of previous month to the 20th of the current month.",
                      },
                      {
                        detail: "Associate Responsibilities",
                        description: "Associates must apply for Leaves, Compensatory Leave, and On Duty in ADP by 20th.",
                      },
                      {
                        detail: "Manager Approvals",
                        description: "Manager approvals are required by the 20th; else system auto-approves.",
                      },
                      {
                        detail: "Timesheets",
                        description: "Timesheets validated by managers and department heads are essential for allowance claims.",
                      },
                      {
                        detail: "Late Inputs",
                        description: "Late inputs after the 20th won’t be processed for payroll.",
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-2 font-medium">{item.detail}</td>
                        <td className="p-2">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Benefits Modal */}
      <Dialog open={showBenefitsModal} onOpenChange={setShowBenefitsModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Benefits Information</DialogTitle>
            <DialogDescription className="text-left text-sm space-y-6 mt-4 text-muted-foreground">
              <div>
                <h2 className="font-semibold text-base mb-2">Group Mediclaim Insurance (Oct-24 to Oct-25)</h2>
                <table className="w-full text-sm border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-blue-600 text-white text-left">
                      <th className="p-2 w-1/2">Details</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Name of the Insurer", "Bajaj Allianz General Insurance Co Ltd"],
                      ["Name of the Broker", "Spot Solutions"],
                      ["Contact Number in case of Emergency", "Ms. Dhanalakshmi – 9710444021"],
                      ["Coverage", "2.0 Lakhs (1 + 5 – Employee, Spouse, 2Kids & Parents or In-Laws) as already provided to us. Newly married spouse and new born kids shall be added within 30 days."],
                      ["Co-Payment", "No Co-pay from the employee"],
                      ["Pre-Existing Disease", "Covered"],
                      ["Maternity", "Covered up to Rs. 50,000/-"],
                      ["Day 1 cover for new born baby", "Covered upto floater Sum Insured"],
                      ["Pre-Hospitalization Covered", "30 Days before hospitalization"],
                      ["Post Hospitalization Covered", "60 Days after hospitalization"],
                      ["Room Rent Limits Including Boarding, Nursing Charges etc.", "Single Standard AC Room per day Rs. 12,000 per day (For I.C.U)"],
                      ["Ambulance Expenses Limits", "Rs. 2,000 per Hospitalization"],
                      ["Claim Intimation", "Within 24 Hrs of hospitalization (email)"],
                      ["Claim Submission Period", "15 Days"],
                      ["Chemotherapy / Oral Chemotherapy", "Chemotherapy Covered and Oral Chemotherapy not covered"],
                      ["AYUSH Treatment", "Ayurvedic Treatment covered only in Govt registered Hospitals restricted to 25% of the Sum Insured subject to maximum of Rs. 25,000/-"],
                    ].map(([label, value], i) => (
                      <tr key={i} className="border-t border-gray-200">
                        <td className="p-2 font-medium">{label}</td>
                        <td className="p-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="font-semibold text-base mb-2">Group Personal Accident Insurance (Nov-24 to Nov-25)</h2>
                <table className="w-full text-sm border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-blue-600 text-white text-left">
                      <th className="p-2 w-1/2">Details</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Insurer", "ICICI Lombard"],
                      ["Broker", "E-Medlife Insurance Broking"],
                      ["Emergency Contact", "Mr. Siva Raman - 9840088954, Ms. Srividhya - 9840001568"],
                      ["Sum Insured", "5x Annual Fixed CTC"],
                      ["Coverage", "Total/Partial/Temporary Disablement, Death Cover"],
                      ["Weekly Compensation", "1% of CSI up to 104 weeks (max ₹5,000/week)"],
                      ["Ambulance Charges", "₹2,000"],
                      ["Education Funds", "₹10,000 per child (max 2, up to 25 years)"],
                      ["Repatriation", "₹10,000 or actual"],
                      ["Dead Body Carriage", "2% of SI or max ₹2,500"],
                    ].map(([label, value], index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-2 font-medium">{label}</td>
                        <td className="p-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="font-semibold text-base">Certification Reimbursement</h2>
                <p>
                  Certification costs are reimbursed upon prior approval from both SBU Head and HR Head. Associates must email the certificate, invoice, and reimbursement form after completing the course. Team HR and People & Culture Head will review and forward approval to Team Accounts. Reimbursement is credited post-approval.
                </p>
                <p>
                  <strong>Note:</strong> Employee must serve at least 1 year after claiming reimbursement, else amount is recovered from F&F.
                </p>
              </div>
              <div>
                <h2 className="font-semibold text-base">Working in Night Shift / On-call Support</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Night Shift Allowance:</strong> ₹300/night for working between 9:00 PM to 7:00 AM (not for regular night shift roles)</li>
                  <li><strong>On-call Support:</strong> ₹300/day beyond normal hours</li>
                  <li>Manager must submit validated data to <a href="mailto:hr@securekloud.com" className="underline">hr@securekloud.com</a> by 20th of each month</li>
                </ul>
              </div>
              <div>
                <h2 className="font-semibold text-base">Local Travel</h2>
                <p>
                  Business travel expenses reimbursed upon prior approval. Submit expense form with bills to Team Accounts after Manager/Dept. Head approval.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>₹8/km for two-wheelers</li>
                  <li>₹12/km for four-wheelers</li>
                  <li>Reimbursement within 2 weeks of claim submission</li>
                </ul>
              </div>
              <div>
                <h2 className="font-semibold text-base">Team Outing Allowance</h2>
                <p>
                  ₹1,500 is allowed twice a year for organized team lunches/dinners. Expenses must be pre-approved and follow reimbursement procedures.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Leave Modal */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle>Leave Management</DialogTitle>
            <DialogDescription className="text-left mt-4 space-y-6 text-muted-foreground text-sm">
              <div>
                <h2 className="font-semibold text-base mb-2">Leave Types</h2>
                <table className="w-full text-sm border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-blue-600 text-white text-left">
                      <th className="p-2 w-1/4">Leave Type</th>
                      <th className="p-2 w-1/4">Applicability</th>
                      <th className="p-2 w-1/4">Eligibility</th>
                      <th className="p-2 w-1/4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        type: "Sick and Casual Leave",
                        applicability: "To all employees",
                        eligibility: "24 working days",
                        remarks: ["No carry forward for next year", "No encashment"],
                      },
                      {
                        type: "Earned / Privilege Leave",
                        applicability: "To all confirmed employees",
                        eligibility: "12 working days",
                        remarks: ["Can carry forward maximum 45 days", "Encashment at the time of relieving"],
                      },
                      {
                        type: "Maternity Leave",
                        applicability: "Female employees who have worked for 80 days",
                        eligibility: "26 weeks (including all weekends and holidays)",
                        remarks: [
                          "Leave has to be availed 1 month before expected delivery",
                          "6 weeks of miscarriage leave in lieu of maternity leave",
                          "Only for first 2 deliveries",
                          "No carry forward or encashed",
                        ],
                      },
                      {
                        type: "Paternity Leave",
                        applicability: "Male employees who have worked for 80 days post confirmation",
                        eligibility: "5 working days",
                        remarks: ["Only for first 2 children", "No carry forward or encashed"],
                      },
                      {
                        type: "Marriage Leave",
                        applicability: "To all confirmed employees",
                        eligibility: "5 working days",
                        remarks: [
                          "Only for the first marriage",
                          "Once in the lifetime of the employee",
                          "No carry forward or encashed",
                        ],
                      },
                    ].map((leave, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-2 font-medium">{leave.type}</td>
                        <td className="p-2">{leave.applicability}</td>
                        <td className="p-2">{leave.eligibility}</td>
                        <td className="p-2">
                          <ul className="list-disc pl-5 space-y-1">
                            {leave.remarks.map((remark, i) => (
                              <li key={i}>{remark}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
        {/* Document View Modal */}
      <Dialog open={showDocModal} onOpenChange={setShowDocModal}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {docToView ? (
            isDocx ? (
              <div
                className="p-4 overflow-y-auto h-[calc(90vh-60px)]"
                dangerouslySetInnerHTML={{ __html: docContent }}
              />
            ) : (
              <iframe
                src={`${docToView}#toolbar=1&navpanes=0&view=fitH`}
                title="Document Viewer"
                className="w-full h-[90vh]"
              />
            )
          ) : (
            <p className="text-sm text-muted-foreground">No document selected</p>
          )}
        </DialogContent>
      </Dialog>
{/* Employee Directory Dialog */}
{/* Employee Directory Dialog */}
{/* Employee Directory Dialog */}
<Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
  <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
    <DialogHeader className="text-center">
      <DialogTitle className="text-2xl font-semibold text-gray-800">
        Employee Directory
      </DialogTitle>
      <DialogDescription className="text-gray-500">
        {isAdmin
          ? "You are viewing full employee details (Admin access)."
          : "You are viewing limited employee details. Sensitive information is hidden."}
      </DialogDescription>
    </DialogHeader>

    {loadingEmployees ? (
      <div className="text-center py-8 text-gray-500">
        Loading employees...
      </div>
    ) : errorEmployees ? (
      <div className="text-center py-8 text-red-600">
        {errorEmployees}
      </div>
    ) : (
      <>
        {/* 🔽 Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* 🏢 Department Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Department
            </label>
            <select
              className="border p-2 rounded"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* 🩸 Blood Group Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Blood Group
            </label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              <option value="A+Ve">A+Ve</option>
              <option value="A-Ve">A-Ve</option>
              <option value="B+Ve">B+Ve</option>
              <option value="B-Ve">B-Ve</option>
              <option value="O+Ve">O+Ve</option>
              <option value="O-Ve">O-Ve</option>
              <option value="AB+Ve">AB+Ve</option>
              <option value="AB-Ve">AB-Ve</option>
            </select>
          </div>

          {/* 🧠 Skills Filter */}
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium mb-1">Skills</label>
            <textarea
              placeholder="Enter skills (e.g. Java HTML React)"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="border p-2 rounded h-16"
            />
            <label className="flex items-center mt-1 text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={useAndFilter}
                onChange={(e) => setUseAndFilter(e.target.checked)}
              />
              Match all skills (AND)
            </label>
          </div>
        </div>

        {/* 🔍 Search by Name */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by employee name"
            className="border p-2 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 🧩 Filter + List */}
        {(() => {
          const filteredEmployees = employeeDirectory.filter((emp) => {
            const matchDept =
              !selectedDepartment ||
              emp.Department === selectedDepartment ||
              emp.department === selectedDepartment;

            const matchBlood =
              !selectedBloodGroup ||
              emp.BloodGroup === selectedBloodGroup;

            const skillsText = (
              emp.SpecialSkill ||
              emp.Tech1 ||
              emp.Tech2 ||
              ""
            ).toLowerCase();

            const inputSkills = skillsInput
              .toLowerCase()
              .split(/[, ]+/)
              .filter(Boolean);

            let matchSkills = true;
            if (inputSkills.length > 0) {
              matchSkills = useAndFilter
                ? inputSkills.every((s) => skillsText.includes(s))
                : inputSkills.some((s) => skillsText.includes(s));
            }

            const matchName =
              !searchTerm ||
              emp.EmployeeName?.toLowerCase().includes(
                searchTerm.toLowerCase()
              );

            return matchDept && matchBlood && matchSkills && matchName;
          });

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {filteredEmployees.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No employees found.
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <div
                    key={emp._id || emp.EmpID}
                    className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                  >
                    {/* Top section with initials */}
                    <div className="bg-purple-50 rounded-t-2xl p-4 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-xl font-semibold">
                        {emp.EmployeeName
                          ? emp.EmployeeName.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "NA"}
                      </div>
                      <h2 className="mt-3 text-lg font-semibold text-gray-800 text-center">
                        {emp.EmployeeName || "Unnamed"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Emp ID: {emp.EmpID || "N/A"}
                      </p>
                    </div>

                    {/* Employee details */}
                    <div className="p-4 text-sm space-y-1">
                      {/* ✅ Shown to everyone */}
                      <p>
                        <strong>Name:</strong>{" "}
                        {emp.EmployeeName || "N/A"}
                      </p>
                      <p>
                        <strong>Emp ID:</strong> {emp.EmpID || "N/A"}
                      </p>
                      <p>
                        <strong>Department:</strong>{" "}
                        {emp.Department || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {emp.Email || "N/A"}
                      </p>
                      <p>
                        <strong>Primary Skills:</strong>{" "}
                        {emp.Tech1 || "N/A"}
                      </p>
                      <p>
                        <strong>Secondary Skills:</strong>{" "}
                        {emp.Tech2 || "N/A"}
                      </p>
                      <p>
                        <strong>Special Skill:</strong>{" "}
                        {emp.SpecialSkill || "N/A"}
                      </p>

                      {/* 🔐 Only admins see sensitive info */}
                      {isAdmin && (
                        <>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {emp.PhoneNumber || "N/A"}
                          </p>
                          <p>
                            <strong>Blood Group:</strong>{" "}
                            {emp.BloodGroup || "N/A"}
                          </p>
                          <p>
                            <strong>Emergency Contact:</strong>{" "}
                            {emp.EmergencyContact || "N/A"}
                          </p>
                          <p>
                            <strong>Current Address:</strong>{" "}
                            {emp.CurrentAddress || "N/A"}
                          </p>
                          <p>
                            <strong>Permanent Address:</strong>{" "}
                            {emp.PermanentAddress || "N/A"}
                          </p>
                          <p>
                            <strong>PAN:</strong>{" "}
                            {emp.PAN || "N/A"}
                          </p>
                          <p>
                            <strong>Aadhar:</strong>{" "}
                            {emp.Aadhar || "N/A"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })()}
      </>
    )}
  </DialogContent>
</Dialog>



    </div>
  );
};

export default HR;