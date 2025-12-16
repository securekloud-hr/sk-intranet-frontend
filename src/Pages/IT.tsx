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

/* ================= Types ================= */

type UserLike = {
  name?: string;
  email?: string;
  mail?: string;
  role?: "admin" | "user";
  fullName?: string;
};

type TeamMember = {
  name: string;
  empId: string;
  designation: string;
  email?: string;
  phone?: string;
};

interface Policy {
  name: string;
  fileUrl: string;
  updated: string;
  description?: string;
}

type CategoriesResponse = { [category: string]: Policy[] };

/* ================= Constants ================= */

const IT_CATEGORY = "IT Policies"; // must match your Policies page tab/category name exactly

/* ================= IT TEAM DATA (replace with real) ================= */
const itTeamMembers: TeamMember[] = [
  {
    name: "Balaji S",
    empId: "B23016",
    designation: "Associate Manager - I.T. Operations",
    email: "balaji.sukumar@securekloud.com",
    phone: "9940284228",
  },
  {
    name: "Nithish Kumar C",
    empId: "B24047",
    designation: "Senior Associate - I.T. Operations",
    email: "nithishkumar.chitrarasu@securekloud.com",
    phone: "9566172598",
  },
  {
    name: "Rathinasabapathi A",
    empId: "B23011",
    designation: "Associate - I.T.Admin",
    email: "rathinasabapathi.a@securekloud.com",
    phone: "9443275260",
  },
  {
    name: "Vijayakumar P",
    empId: "B22195",
    designation: "Manager - I.T. Operations",
    email: "vijayakumar.parthiban@securekloud.com",
    phone: "9840413353",
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

/* ================= Component ================= */

const IT = () => {
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

  const itPolicies: Policy[] = categories[IT_CATEGORY] || [];

  // upload / update PDF
  const handleUploadPolicyFile = async (policyName: string, file: File) => {
    const key = `${IT_CATEGORY}::${policyName}`;
    setUploadingPolicyKey(key);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API}/api/policies/upload/${encodeURIComponent(IT_CATEGORY)}/${encodeURIComponent(
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

      // update UI instantly
      setCategories((prev) => {
        const updated = { ...prev };
        const list = updated[IT_CATEGORY] ? [...updated[IT_CATEGORY]] : [];

        const existingIndex = list.findIndex((p) => p.name === policyName);

        const newPolicy: Policy = {
          name: policyName,
          fileUrl: data.fileUrl,
          updated: data.updated,
          description: data.description,
        };

        if (existingIndex >= 0) list[existingIndex] = newPolicy;
        else list.push(newPolicy);

        updated[IT_CATEGORY] = list;
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploadingPolicyKey(null);
    }
  };

  // add new policy
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
        `${API}/api/policies/${encodeURIComponent(IT_CATEGORY)}/${encodeURIComponent(
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
        updated[IT_CATEGORY] = (updated[IT_CATEGORY] || []).filter(
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
        <h1 className="text-3xl font-bold mb-1">IT</h1>
        <p className="text-muted-foreground">
          IT information, team details and policies
        </p>
      </div>

      <Tabs defaultValue="key" className="space-y-6">
        <TabsList className="flex w-fit gap-2 bg-transparent p-0">
          <TabsTrigger
            value="key"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Key information
          </TabsTrigger>

          <TabsTrigger
            value="team"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            IT Team
          </TabsTrigger>

          <TabsTrigger
            value="policy"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            IT policies
          </TabsTrigger>
        </TabsList>

  <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-3">
        {/* Key info */}
          <p className="text-muted-foreground"></p>

        <Card>
         <CardTitle className="text-lg">
            1️⃣ IT Infrastructure Management</CardTitle>
                      <CardDescription className="mb-6">
            <ul>
            <li>Servers (physical & virtual) management</li>
            <li>Data center / cloud infrastructure</li>
            <li>Network devices (routers, switches, firewalls) </li>
            <li>LAN, WAN, Wi-Fi management</li>
            <li>Backup power & redundancy planning</li>
            </ul>
          </CardDescription>
        </Card>
 
        <Card>
         <CardTitle className="text-lg">
            2️⃣ Network & Connectivity</CardTitle>
                      <CardDescription className="mb-6">
            <ul>
            <li>Internet and MPLS management</li>
            <li>VPN and remote access setup</li>
            <li>Bandwidth monitoring and optimization</li>
            <li>Network security controls</li>
            <li>Network troubleshooting</li>
            </ul>
          </CardDescription>
        </Card>
 
        <Card>
         <CardTitle className="text-lg">
            3️⃣ End-User Computing (EUC) </CardTitle>
                      <CardDescription className="mb-6">
            <ul>
            <li>Desktop, laptop, and mobile device support</li>
            <li>OS installation and patching</li>
            <li>Software installation and upgrades</li>
            <li>Asset allocation and tracking</li>
            <li>IT helpdesk & ticket management</li>
            </ul>
          </CardDescription>
        </Card>
 
        <Card>
         <CardTitle className="text-lg">
            4️⃣ Application Management</CardTitle>
                      <CardDescription className="mb-6">
            <ul>
            <li>Business application support (ERP, CRM, HRMS) </li>
            <li>Application deployment and upgrades</li>
            <li>License management</li>
            <li>Vendor coordination</li>
            <li>Application performance monitoring</li> 
            </ul>
          </CardDescription>
        </Card>

        <Card>
         <CardTitle className="text-lg">
            5️⃣ Information Security (Cybersecurity) </CardTitle>
                      <CardDescription className="mb-6">
            <ul>
            <li>Security policies and enforcement</li>
            <li>Endpoint protection (AV, EDR) </li>
            <li>Firewalls and intrusion detection</li>
            <li>Identity and access management (IAM) </li>
            <li>Vulnerability management & patching</li>
            </ul>
          </CardDescription>
        </Card>

        <Card>
         <CardTitle className="text-lg">
            6️⃣ Data Management & Backup</CardTitle>
                      <CardDescription className="mb-6">
            <ul>
            <li>Data storage management</li>
            <li>Backup & restore operations</li>
            <li>Disaster recovery planning</li>
            <li>Data retention policies</li>
            <li>Database administration</li>
            </ul>
          </CardDescription>
        </Card>
        <Card>
         <CardTitle className="text-lg">
          7️⃣ IT Service Management (ITSM)</CardTitle>
                      <CardDescription className="mb-6">
          <ul>
          <li>Incident management</li>
          <li>Problem management</li>
          <li>Change management</li>
          <li>Configuration management (CMDB) </li>
          <li>SLA & KPI tracking</li>
          </ul>
          </CardDescription>
        </Card>

        <Card>
         <CardTitle className="text-lg">
          8️⃣ Compliance, Risk & Audit</CardTitle>
                    <CardDescription className="mb-6">
          <ul>
          <li>IT policy creation & updates</li>
          <li>ISO 27001 / SOC / GDPR support</li>
          <li>Risk assessment & mitigation</li>
          <li>Audit coordination</li>
          <li>Access review & controls</li>
            </ul>
          </CardDescription>
        </Card>

        <Card>
         <CardTitle className="text-lg">
            9️⃣🔟 Business Continuity & DR</CardTitle>
                      <CardDescription className="mb-6">
            <ul>
            <li>Business continuity planning (BCP) </li>
            <li>Disaster recovery (DR) drills</li>
            <li>System failover planning</li>
            <li>High availability design</li>
            <li>Incident response planning</li>
            </ul>
          </CardDescription>
        </Card>

</div>




        {/* IT Team */}
        <TabsContent value="team" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {itTeamMembers.map((member) => {
              const emailOk = member.email && member.email !== "N/A";
              const phoneOk = member.phone && member.phone !== "N/A";

              return (
                <Card
                  key={member.empId}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div className="h-20 w-20 rounded-full bg-purple-200 flex items-center justify-center mb-4">
                    <span className="text-purple-700 font-semibold text-xl">
                      {getInitials(member.name)}
                    </span>
                  </div>

                  <CardTitle className="text-lg">{member.name}</CardTitle>

                  <CardDescription className="mb-4">
                    {member.designation}
                  </CardDescription>

                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Email:</strong>{" "}
                      {emailOk ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {member.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {phoneOk ? (
                        <a
                          href={`tel:${member.phone}`}
                          className="text-blue-600 hover:underline"
                        >
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

        {/* IT policy */}
        <TabsContent value="policy" className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading IT policies...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {itPolicies.map((policy, index) => (
                <Card
                  key={`${policy.name}-${index}`}
                  className="p-2 text-xs space-y-0.5 shadow-sm border rounded-md h-full flex flex-col"
                >
                  <CardHeader className="pb-2 flex-grow">
                    <CardTitle>{policy.name}</CardTitle>
                    <CardDescription>Last updated: {policy.updated}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-shrink-0 pt-0">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setDocToView(`${API}${policy.fileUrl}`);
                          setShowDocModal(true);
                        }}
                        className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-md flex items-center"
                        title="View"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>

                      <a
                        href={`${API}/api/policies/download/${encodeURIComponent(
                          IT_CATEGORY
                        )}/${encodeURIComponent(policy.name)}`}
                        className="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center"
                        title="Download"
                      >
                        <FiDownload className="w-4 h-4" />
                      </a>

                      {isAdmin && (
                        <>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            id={`upload-it-${index}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleUploadPolicyFile(policy.name, file);
                                e.target.value = "";
                              }
                            }}
                          />

                          <label
                            htmlFor={`upload-it-${index}`}
                            className={`text-sm px-2 py-1 rounded-md flex items-center cursor-pointer ${
                              uploadingPolicyKey === `${IT_CATEGORY}::${policy.name}`
                                ? "bg-green-200 text-green-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            Upload
                          </label>

                          <button
                            onClick={() => {
                              setDeleteTarget({ name: policy.name });
                              setShowDeleteModal(true);
                            }}
                            className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {isAdmin && (
                <Card
                  className="p-4 border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() => setShowAddModal(true)}
                >
                  <span className="text-sm font-medium text-gray-600">
                    + Add Policy
                  </span>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* PDF Preview */}
      <Dialog open={showDocModal} onOpenChange={setShowDocModal}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>

          {docToView ? (
            <iframe
              src={`${docToView}#toolbar=1&navpanes=0&view=fitH`}
              title="PDF Preview"
              className="w-full h-[90vh]"
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Add Policy Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New IT Policy</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Policy name"
              value={newPolicyName}
              onChange={(e) => setNewPolicyName(e.target.value)}
            />

            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setNewPolicyFile(e.target.files?.[0] || null)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePolicy} disabled={savingNewPolicy}>
                Add Policy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Policy</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <b>{deleteTarget?.name}</b>?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} disabled={deleting}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IT;
