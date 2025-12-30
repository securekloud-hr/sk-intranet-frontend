import React, { useEffect, useMemo, useState } from "react";
import API from "@/config";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FiDownload, FiEye } from "react-icons/fi";
import { Trash2 } from "lucide-react";
import PolicySection from "@/components/PolicySection";
/* ================= Types ================= */

type UserLike = {
  name?: string;
  email?: string;
  mail?: string;
  role?: "admin" | "user";
  fullName?: string;
};

interface Policy {
  name: string;
  fileUrl: string;
  updated: string;
  description?: string;
}

type CategoriesResponse = { [category: string]: Policy[] };

type AdminTeamMember = {
  name: string;
  designation: string;
  email?: string;
  phone?: string;
};

const adminTeamMembers: AdminTeamMember[] = [
  {
    name: "Kamatchi M",
    designation: "Lead - Front Office",
    email: "kamatchi.mohan@securekloud.com",
    phone: "8807975792",
  },
  {
    name: "Rajakumari S",
    designation: "House Keeping",
    email: "N/A",
    phone: "9176652191",
  },
  {
    name: "Selvaraj",
    designation: "Driver",
    email: "N/A",
    phone: "N/A",
  },
  {
    name: "Senthil",
    designation: "Admin Assistant",
    email: "N/A",
    phone: "9790270100",
  },
  {
    name: "Valarmathy",
    designation: "House Keeping",
    email: "N/A",
    phone: "N/A",
  },
  {
    name: "Vishnu Mohan",
    designation: "Lead - Administration",
    email: "vishnu.m@securekloud.com",
    phone: "9710199742",
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

/* ================= Constants ================= */

const ADMIN_CATEGORY = "Admin Policies";

/* ================= Component ================= */

const Admin = () => {
  // role
  const cachedUser = useMemo<UserLike | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") return JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
    return null;
  }, []);

  const isAdmin = (cachedUser?.role || "user") === "admin";

  // policies state
  const [categories, setCategories] = useState<CategoriesResponse>({});
  const [loading, setLoading] = useState(false);

  // pdf view
  const [docToView, setDocToView] = useState<string | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  // add policy modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPolicyFile, setNewPolicyFile] = useState<File | null>(null);
  const [savingNewPolicy, setSavingNewPolicy] = useState(false);

  // upload state
  const [uploadingPolicyKey, setUploadingPolicyKey] = useState<string | null>(null);

  // delete confirm modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // fetch policies
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/policies`);
      if (!res.ok) throw new Error("Failed to load policies");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("❌ policies fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const adminPolicies: Policy[] = categories[ADMIN_CATEGORY] || [];

  // upload / update PDF for a policy
  const handleUploadPolicyFile = async (policyName: string, file: File) => {
    const key = `${ADMIN_CATEGORY}::${policyName}`;
    setUploadingPolicyKey(key);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API}/api/policies/upload/${encodeURIComponent(ADMIN_CATEGORY)}/${encodeURIComponent(
          policyName
        )}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to upload file");
        return;
      }

      // update UI immediately
      setCategories((prev) => {
        const updated = { ...prev };
        const list = updated[ADMIN_CATEGORY] ? [...updated[ADMIN_CATEGORY]] : [];

        const existingIndex = list.findIndex((p) => p.name === policyName);

        const newPolicy: Policy = {
          name: policyName,
          fileUrl: data.fileUrl,
          updated: data.updated,
          description: data.description,
        };

        if (existingIndex >= 0) list[existingIndex] = newPolicy;
        else list.push(newPolicy);

        updated[ADMIN_CATEGORY] = list;
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploadingPolicyKey(null);
    }
  };

  // create new policy (name + file)
  const handleCreatePolicy = async () => {
    if (!newPolicyName.trim() || !newPolicyFile) {
      alert("Please enter policy name and select PDF");
      return;
    }

    try {
      setSavingNewPolicy(true);
      await handleUploadPolicyFile(newPolicyName.trim(), newPolicyFile);

      setShowAddModal(false);
      setNewPolicyName("");
      setNewPolicyFile(null);
    } finally {
      setSavingNewPolicy(false);
    }
  };

  // delete policy
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `${API}/api/policies/${encodeURIComponent(ADMIN_CATEGORY)}/${encodeURIComponent(
          deleteTarget.name
        )}`,
        { method: "DELETE" }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to delete policy");
        return;
      }

      setCategories((prev) => {
        const updated = { ...prev };
        updated[ADMIN_CATEGORY] = (updated[ADMIN_CATEGORY] || []).filter(
          (p) => p.name !== deleteTarget.name
        );
        return updated;
      });

      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting policy");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Admin</h1>
        <p className="text-muted-foreground">
          Administrative information and team details
        </p>
      </div>

      <Tabs defaultValue="key" className="space-y-6">
        <TabsList className="flex w-fit gap-2 bg-transparent p-0">
          <TabsTrigger
            value="key"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Key Functions
          </TabsTrigger>

          <TabsTrigger
            value="team"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Admin Team
          </TabsTrigger>

          <TabsTrigger
            value="policy"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Admin policies
          </TabsTrigger>
        </TabsList>

        {/* ✅ KEY TAB (THIS WAS MISSING IN YOUR CODE) */}
        <TabsContent value="key" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-4">
  <CardTitle className="text-lg">1️⃣ Office Administration</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Maintain office infrastructure and supplies</li>
      <li>Manage stationery, consumables, and assets</li>
      <li>Vendor coordination for office services</li>
      <li>Front-desk & reception management</li>
      <li>Meeting room and resource scheduling</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">2️⃣ Procurement & Vendor Management</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Raise purchase requests and orders</li>
      <li>Vendor onboarding and evaluation</li>
      <li>Contract management and renewals</li>
      <li>Invoice verification and payment coordination</li>
      <li>Cost optimization and negotiation</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">3️⃣ Travel & Logistics</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Employee travel booking (air, rail, hotel)</li>
      <li>Travel policy compliance</li>
      <li>Visa and passport coordination</li>
      <li>Transport and logistics arrangement</li>
      <li>Reimbursement processing support</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">4️⃣ Communication & Coordination</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Internal communication support</li>
      <li>Circulars, notices, and announcements</li>
      <li>Coordination between departments</li>
      <li>Event coordination (town halls, meetings)</li>
      <li>Visitor management</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">5️⃣ Infrastructure & Building Management</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Office space planning and utilization</li>
      <li>Building maintenance (civil, electrical, plumbing)</li>
      <li>HVAC systems management</li>
      <li>Power backup (DG sets, UPS)</li>
      <li>Energy management</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">6️⃣ Safety, Security & Access Control</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Physical security management</li>
      <li>CCTV surveillance systems</li>
      <li>Access cards and biometric systems</li>
      <li>Visitor security protocols</li>
      <li>Emergency preparedness & evacuation drills</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">7️⃣ Housekeeping & Hygiene</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Cleaning services management</li>
      <li>Pantry and cafeteria hygiene</li>
      <li>Waste management & disposal</li>
      <li>Pest control</li>
      <li>Sanitization and hygiene audits</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">8️⃣ Equipment & Asset Maintenance</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Furniture and fixture maintenance</li>
      <li>Office equipment upkeep</li>
      <li>Preventive maintenance schedules</li>
      <li>Asset tagging and tracking</li>
      <li>AMC management</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">9️⃣ Health, Safety & Environment (HSE)</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Workplace safety compliance</li>
      <li>Fire safety systems and drills</li>
      <li>First-aid and medical room management</li>
      <li>Environmental sustainability initiatives</li>
      <li>Ergonomic assessments</li>
    </ul>
  </CardDescription>
</Card>

<Card className="p-4">
  <CardTitle className="text-lg">🔟 Utilities & Services Management</CardTitle>
  <CardDescription className="mt-2">
    <ul className="list-disc pl-5 space-y-1">
      <li>Water supply and treatment</li>
      <li>Electricity usage monitoring</li>
      <li>Internet and telecom infrastructure</li>
      <li>Cafeteria and food services</li>
      <li>Parking management</li>
    </ul>
  </CardDescription>
</Card>
          </div>
        </TabsContent>

        {/* TEAM TAB */}
        <TabsContent value="team" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adminTeamMembers.map((member, idx) => {
              const emailOk = member.email && member.email !== "N/A" && member.email !== "NA";
              const phoneOk = member.phone && member.phone !== "N/A" && member.phone !== "NA";

              return (
                <Card
                  key={`${member.name}-${idx}`}
                  className="flex flex-col items-center text-center py-8 px-6"
                >
                  <div className="h-20 w-20 rounded-full bg-purple-200 flex items-center justify-center mb-4">
                    <span className="text-purple-700 font-semibold text-xl">
                      {getInitials(member.name)}
                    </span>
                  </div>

                  <CardTitle className="text-lg">{member.name}</CardTitle>

                  <CardDescription className="mb-6">{member.designation}</CardDescription>

                  <div className="text-sm space-y-2">
                    <p>
                      <strong>Email:</strong>{" "}
                      {emailOk ? (
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {phoneOk ? (
                        <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                          {member.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
{/* added by Siva on 30-Dec to call PoliceSection for getting Admin policies */}
<TabsContent value="policy">
  <PolicySection
    category="Admin Policies"
    title="Admin Policies"
  />
 </TabsContent>

        </Tabs>

 
    </div>
  );
};

export default Admin;
