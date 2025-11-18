import React, { useState } from "react";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const HR = () => {
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");
  const [activeFormTab, setActiveFormTab] = useState("onboarding");
  const [docToView, setDocToView] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const formsData = {
    "onboarding": [
      { name: "Access Request Form", fileName: "Access_Request_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Employee Information Form", fileName: "Employee_Information_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Form11", fileName: "Form11.pdf", updated: "Jun 16, 2025" },
      { name: "Gratuity Nomination Form", fileName: "Gratuity_Nomination_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Insurance Enrolment Form", fileName: "Insurance_Enrolment_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Letter of Undertaking Onboarding", fileName: "Letter_of_Undertaking_Onboarding.pdf", updated: "Jun 16, 2025" },
    ],
    "bgv": [
      { name: "Candidate Information form", fileName: "Candidate_Information_form_BGV.pdf", updated: "Jun 16, 2025" },
      { name: "Letter of Authorization", fileName: "Letter_of_Authorization_BGV.pdf", updated: "Jun 16, 2025" },
    ],
    "rewards": [
      { name: "Nomination Form - Associate of the Year", fileName: "Nomination_Associate_Year.pdf", updated: "Jun 16, 2025" },
      { name: "Nomination Form - Star of the Quarter", fileName: "Nomination_Star_Quarter.pdf", updated: "Jun 16, 2025" },
      { name: "Nomination Form - Team of the Quarter", fileName: "Nomination_Team_Quarter.pdf", updated: "Jun 16, 2025" },
      { name: "Nomination Form - Team of the Year", fileName: "Nomination_Team_Year.pdf", updated: "Jun 16, 2025" },
    ],
    "others": [
      { name: "Contract Invoice Template ", fileName: "Contract_Invoice_Template.pdf", updated: "Jun 16, 2025" },
      { name: "Contract Timesheet Template", fileName: "Contract_Timesheet_Template.pdf", updated: "Jun 16, 2025" },
      { name: "Expense Reimbursement Form 3", fileName: "Expense_Reimbursement_Form_3.pdf", updated: "Jun 16, 2025" },
      { name: "Induction Feedback Form", fileName: "Induction_Feedback_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Intern to Onroll Movement Template", fileName: "Intern_to_Onroll_Template.pdf", updated: "Jun 16, 2025" },
      { name: "PIP Letter Template 2", fileName: "PIP_Letter_Template_2.pdf", updated: "Jun 16, 2025" },
    ],
    "separation": [
      { name: "Associate Clearance Form", fileName: "Associate_Clearance_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Exit Interview Template", fileName: "Exit_Interview_Template.pdf", updated: "Jun 16, 2025" },
      { name: "Gratuity Declaration Form", fileName: "Gratuity_Declaration_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Leave Encashment Declaration Form", fileName: "Leave_Encashment_Declaration_Form.pdf", updated: "Jun 16, 2025" },
      { name: "Letter of Undertaking", fileName: "Letter_of_Undertaking.pdf", updated: "Jun 16, 2025" },
    ],
  };

  const team = [
    {
      name: "Siva Kumar",
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

  const handleView = (fileName) => {
    if (fileName) {
      setDocToView(`/files/${fileName}`);
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

  const renderFormTabContent = (tabForms) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tabForms.map((form, index) => (
        <Card
          key={index}
          className="p-2 text-xs space-y-0.5 shadow-sm border rounded-md"
        >
          <CardHeader className="pb-2">
            <CardTitle>{form.name}</CardTitle>
            <CardDescription>Last updated: {form.updated}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {form.fileName && (
                <>
                  {form.fileName.endsWith(".pdf") && (
                    <button
                      onClick={() => handleView(form.fileName)}
                      className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-md"
                    >
                      View
                    </button>
                  )}
                  <a
                    href={`/files/${form.fileName}`}
                    download
                    className="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded-md"
                  >
                    Download
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFormTabs = () => (
    <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="mt-6">
      <TabsList className="grid w-full sm:w-[800px] grid-cols-5">
        <TabsTrigger value="onboarding">On board Forms</TabsTrigger>
        <TabsTrigger value="bgv">BGV Forms</TabsTrigger>
        <TabsTrigger value="rewards">Rewards & Recognition</TabsTrigger>
        <TabsTrigger value="others">Others</TabsTrigger>
        <TabsTrigger value="separation">Separation</TabsTrigger>
      </TabsList>
      <TabsContent value="onboarding" className="pt-6">
        {renderFormTabContent(formsData["onboarding"])}
      </TabsContent>
      <TabsContent value="bgv" className="pt-6">
        {renderFormTabContent(formsData["bgv"])}
      </TabsContent>
      <TabsContent value="rewards" className="pt-6">
        {renderFormTabContent(formsData["rewards"])}
      </TabsContent>
      <TabsContent value="others" className="pt-6">
        {renderFormTabContent(formsData["others"])}
      </TabsContent>
      <TabsContent value="separation" className="pt-6">
        {renderFormTabContent(formsData["separation"])}
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
                content: "Search for employees, view contact information, and organization structure.",
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
        {/* Group Mediclaim Insurance Table */}
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
                ["Insurer", "ICICI Lombard"],
                ["Broker", "E-Medlife Insurance Broking"],
                ["Emergency Contact", "Mr. Siva Raman - 9840088954, Ms. Srividhya - 9840001568"],
                ["Sum Insured", "5x Annual Fixed CTC"],
                ["Coverage", "Total/Partial/Temporary Disablement, Death Cover"],
                ["Weekly Compensation", "1% of CSI up to 104 weeks (max ₹5,000/week)"],
                ["Accident Medical Expenses", "40% of claim or 10% SI or actual (whichever is less)"],
                ["Ambulance Charges", "₹2,000"],
                ["Education Funds", "₹10,000 per child (max 2, up to 25 years)"],
                ["Repatriation", "₹10,000 or actual"],
                ["Dead Body Carriage", "2% of SI or max ₹2,500"],
              ].map(([label, value], i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="p-2 font-medium">{label}</td>
                  <td className="p-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Group Personal Accident Insurance Table */}
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
                ["Accident Medical Expenses", "40% of claim or 10% SI or actual (whichever is less)"],
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

        {/* Keep rest unchanged */}
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
  <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                  remarks: [
                    "No carry forward for next year",
                    "No encashment",
                  ],
                },
                {
                  type: "Earned / Privilege Leave",
                  applicability: "To all confirmed employees",
                  eligibility: "12 working days",
                  remarks: [
                    "Can carry forward maximum 45 days",
                    "Encashment at the time of relieving",
                  ],
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
                  remarks: [
                    "Only for first 2 children",
                    "No carry forward or encashed",
                  ],
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
            <iframe
              src={`${docToView}#toolbar=1&navpanes=0&view=fitH`}
              title="Document Viewer"
              className="w-full h-[90vh]"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No document selected</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HR;