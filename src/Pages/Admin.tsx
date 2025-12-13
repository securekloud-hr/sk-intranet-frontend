import React, { useEffect, useMemo, useState } from "react";
import API from "@/config";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

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

interface Policy {
  name: string;
  fileUrl: string;
  updated: string;
  description?: string;
}

type CategoriesResponse = { [category: string]: Policy[] };

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
        `${API}/api/policies/upload/${encodeURIComponent(
          ADMIN_CATEGORY
        )}/${encodeURIComponent(policyName)}`,
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

      // update UI immediately (like Policies.tsx)
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
        `${API}/api/policies/${encodeURIComponent(
          ADMIN_CATEGORY
        )}/${encodeURIComponent(deleteTarget.name)}`,
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

      <Tabs defaultValue="policy" className="space-y-6">
        <TabsList className="flex w-fit gap-2 bg-transparent p-0">
          <TabsTrigger
            value="key"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Key Information
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
            Admin policy
          </TabsTrigger>
        </TabsList>

        {/* Key info */}
        <TabsContent value="key">
          <p className="text-muted-foreground">Key information content…</p>
        </TabsContent>

        {/* Admin Team (optional placeholder) */}
        <TabsContent value="team">
          <p className="text-muted-foreground">Admin team content…</p>
        </TabsContent>

        {/* ================= Admin policy tab ================= */}
        <TabsContent value="policy" className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading Admin policies...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Policy cards */}
              {adminPolicies.map((policy, index) => (
                <Card
                  key={`${policy.name}-${index}`}
                  className="p-2 text-xs space-y-0.5 shadow-sm border rounded-md h-full flex flex-col"
                >
                  <CardHeader className="pb-2 flex-grow">
                    <CardTitle>{policy.name}</CardTitle>
                    <CardDescription>
                      Last updated: {policy.updated}
                    </CardDescription>

                    {policy.description && (
                      <p className="mt-2 text-[11px] text-gray-600 line-clamp-3">
                        {policy.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="flex-shrink-0 pt-0">
                    <div className="flex justify-center space-x-2">
                      {/* VIEW */}
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

                      {/* DOWNLOAD */}
                      <a
                        href={`${API}/api/policies/download/${encodeURIComponent(
                          ADMIN_CATEGORY
                        )}/${encodeURIComponent(policy.name)}`}
                        className="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center"
                        title="Download"
                      >
                        <FiDownload className="w-4 h-4" />
                      </a>

                      {/* UPLOAD (admin only) */}
                      {isAdmin && (
                        <>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            id={`upload-${index}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleUploadPolicyFile(policy.name, file);
                                e.target.value = "";
                              }
                            }}
                          />
                          <label
                            htmlFor={`upload-${index}`}
                            className={`text-sm px-2 py-1 rounded-md flex items-center cursor-pointer ${
                              uploadingPolicyKey === `${ADMIN_CATEGORY}::${policy.name}`
                                ? "bg-green-200 text-green-800"
                                : "bg-green-100 text-green-800"
                            }`}
                            title="Upload / Replace PDF"
                          >
                            Upload
                          </label>

                          {/* DELETE (admin only) */}
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

              {/* + Add Policy card (admin only) */}
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

      {/* ===== PDF Preview ===== */}
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
          ) : (
            <p className="text-sm text-muted-foreground px-6 pb-6">
              No document selected
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Add Policy Modal ===== */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Admin Policy</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Policy name (e.g., Travel Policy)"
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

      {/* ===== Delete Confirm Modal ===== */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Policy</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <b>{deleteTarget?.name}</b>?
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

export default Admin;
