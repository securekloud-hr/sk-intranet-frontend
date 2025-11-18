import React, { Component, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { FiDownload, FiEye } from "react-icons/fi";
import API from "@/config";

interface Policy {
  name: string;
  fileUrl: string;
  updated: string;
}

type DragItem =
  | { type: "policy"; category: string; policyName: string }
  | { type: "category"; category: string };

type PendingDelete =
  | { type: "policy"; category: string; policyName: string }
  | { type: "category"; category: string };

// ---------------- ErrorBoundary ----------------
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="text-center text-red-500">
          Something went wrong. Please try again later.
        </p>
      );
    }
    return this.props.children;
  }
}

// ---------------- Main Component ----------------
const Policies: React.FC = () => {
  const [categories, setCategories] = useState<{ [key: string]: Policy[] }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [docToView, setDocToView] = useState<string | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  // Category order (for tabs)
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);

  // Add category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Add policy
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPolicyFile, setNewPolicyFile] = useState<File | null>(null);

  // Upload indicator
  const [uploadingPolicyKey, setUploadingPolicyKey] = useState<string | null>(
    null
  );

  // Drag + delete (cards / categories to trash)
  const [dragData, setDragData] = useState<DragItem | null>(null);
  const [overTrash, setOverTrash] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ---------- Helper: sync categoryOrder with categories + localStorage ----------
  const syncCategoryOrder = (allCategories: { [key: string]: Policy[] }) => {
    const keys = Object.keys(allCategories).filter((key) =>
      Array.isArray(allCategories[key])
    );

    let saved: string[] = [];
    try {
      const raw = localStorage.getItem("policyCategoryOrder");
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.error("Error reading category order from localStorage", e);
    }

    // 1) keep only categories that still exist
    let order = saved.filter((k) => keys.includes(k));
    // 2) append any new categories at the end
    const remaining = keys.filter((k) => !order.includes(k));
    order = [...order, ...remaining];

    // if nothing saved, just use current keys
    if (!order.length) order = keys;

    setCategoryOrder(order);
    try {
      localStorage.setItem("policyCategoryOrder", JSON.stringify(order));
    } catch (e) {
      console.error("Error saving category order to localStorage", e);
    }
  };

  // ---------- Effects ----------
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch(`${API}/api/policies`);
        if (!res.ok) throw new Error("Failed to load policies");
        const data = await res.json();
        setCategories(data);
        syncCategoryOrder(data);
      } catch (err) {
        console.error("❌ Error fetching policies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  // detect admin (similar logic as sidebar)
  useEffect(() => {
    try {
      let role: string | null = null;

      const rawUser = localStorage.getItem("user");
      if (rawUser && rawUser !== "undefined") {
        try {
          const parsed = JSON.parse(rawUser);
          if (parsed && typeof parsed === "object") {
            role =
              parsed.role ||
              parsed.Role ||
              parsed.userRole ||
              parsed.user_role ||
              null;
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }

      if (!role) {
        const storedRole = localStorage.getItem("role");
        if (storedRole) role = storedRole;
      }

      const isAdminRole =
        typeof role === "string" && role.toLowerCase().includes("admin");

      setIsAdmin(isAdminRole);
      console.log("🔐 Policies page role:", role, " -> isAdmin:", isAdminRole);
    } catch (err) {
      console.error("Error reading role from localStorage", err);
      setIsAdmin(false);
    }
  }, []);

  // Category keys in the current order
  const categoryKeys = categoryOrder.filter((key) =>
    Array.isArray(categories[key])
  );

  // ---------- Create Category ----------
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      setSavingCategory(true);
      const res = await fetch(`${API}/api/policies/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to create category");
        return;
      }

      const name = data.category as string;
      setCategories((prev) => {
        const updated = { ...prev, [name]: prev[name] || [] };
        syncCategoryOrder(updated);
        return updated;
      });

      setNewCategoryName("");
      setShowCategoryModal(false);
    } catch (err) {
      console.error(err);
      alert("Error creating category");
    } finally {
      setSavingCategory(false);
    }
  };

  // ---------- Upload Policy ----------
  const handleUploadPolicyFile = async (
    category: string,
    policyName: string,
    file: File
  ) => {
    const key = `${category}::${policyName}`;
    setUploadingPolicyKey(key);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API}/api/policies/upload/${encodeURIComponent(
          category
        )}/${encodeURIComponent(policyName)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to upload file");
        return;
      }

      setCategories((prev) => {
        const updated = { ...prev };
        const list = updated[category] ? [...updated[category]] : [];

        const existingIndex = list.findIndex((p) => p.name === policyName);

        const newPolicy: Policy = {
          name: policyName,
          fileUrl: data.fileUrl,
          updated: data.updated,
        };

        if (existingIndex >= 0) {
          list[existingIndex] = newPolicy;
        } else {
          list.push(newPolicy);
        }

        updated[category] = list;
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploadingPolicyKey(null);
    }
  };

  const handleCreatePolicy = async () => {
    if (!selectedCategory || !newPolicyName.trim() || !newPolicyFile) return;

    await handleUploadPolicyFile(
      selectedCategory,
      newPolicyName.trim(),
      newPolicyFile
    );

    setShowPolicyModal(false);
    setNewPolicyName("");
    setNewPolicyFile(null);
    setSelectedCategory(null);
  };

  // ---------- Drag handlers for category tabs (reorder) ----------
  const reorderCategories = (fromIndex: number, toIndex: number) => {
    setCategoryOrder((prev) => {
      const order = [...prev];
      const [moved] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, moved);
      try {
        localStorage.setItem("policyCategoryOrder", JSON.stringify(order));
      } catch (e) {
        console.error("Error saving category order to localStorage", e);
      }
      return order;
    });
  };

  const handleCategoryDragStart = (index: number, e: React.DragEvent) => {
    if (!isAdmin) return;
    setDraggedCategoryIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCategoryDrop = (index: number, e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (draggedCategoryIndex === null || draggedCategoryIndex === index) return;
    reorderCategories(draggedCategoryIndex, index);
    setDraggedCategoryIndex(null);
  };

  // ---------- Drag handlers for cards / trash ----------
  const startDragCategoryToTrash = (
    e: React.DragEvent<HTMLButtonElement>,
    category: string
  ) => {
    if (!isAdmin) return;
    const payload: DragItem = { type: "category", category };
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    setDragData(payload);
    console.log("📦 start drag category to trash:", payload);
  };

  const startDragPolicyToTrash = (
    e: React.DragEvent<HTMLDivElement>,
    category: string,
    policyName: string
  ) => {
    if (!isAdmin) return;
    const payload: DragItem = { type: "policy", category, policyName };
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    setDragData(payload);
    console.log("📦 start drag policy to trash:", payload);
  };

  const handleTrashDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isAdmin) return;
    e.preventDefault();
    setOverTrash(true);
  };

  const handleTrashDragLeave = () => {
    setOverTrash(false);
  };

  const handleTrashDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isAdmin) return;
    e.preventDefault();
    setOverTrash(false);

    let payload: DragItem | null = dragData;
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) payload = JSON.parse(raw);
      } catch {
        payload = null;
      }
    }

    console.log("🗑 drop on trash:", payload);

    if (!payload) return;
    setPendingDelete(payload);
    setShowDeleteModal(true);
  };

  // ---------- Confirm delete ----------
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      if (pendingDelete.type === "policy") {
        const { category, policyName } = pendingDelete;
        const res = await fetch(
          `${API}/api/policies/${encodeURIComponent(
            category
          )}/${encodeURIComponent(policyName)}`,
          { method: "DELETE" }
        );
        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to delete policy");
        } else {
          setCategories((prev) => {
            const updated = { ...prev };
            updated[category] = (updated[category] || []).filter(
              (p) => p.name !== policyName
            );
            return updated;
          });
        }
      } else if (pendingDelete.type === "category") {
        const { category } = pendingDelete;
        const res = await fetch(
          `${API}/api/policies/category/${encodeURIComponent(category)}`,
          { method: "DELETE" }
        );
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Failed to delete category");
        } else {
          setCategories((prev) => {
            const updated = { ...prev };
            delete updated[category];
            syncCategoryOrder(updated);
            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setPendingDelete(null);
    }
  };

  // ---------- Loading / empty ----------
  if (loading) {
    return <p className="text-center text-gray-500">Loading policies...</p>;
  }

  if (!categoryKeys.length) {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-skcloud-dark-purple">
              Company Policies
            </h1>
            <p className="text-muted-foreground mt-1">
              Access and review all current company policies
            </p>
          </div>

          {isAdmin && (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowCategoryModal(true)}>
                + Add Category
              </Button>
            </div>
          )}

          <p className="text-center text-gray-500">
            No policies available yet.
          </p>
        </div>
      </ErrorBoundary>
    );
  }

  const defaultTabValue =
    categoryKeys[0]?.toLowerCase().replace(/\s+/g, "-") ?? "";

  // ---------- Render ----------
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-skcloud-dark-purple">
            Company Policies
          </h1>
          <p className="text-muted-foreground mt-1">
            Access and review all current company policies
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            className="pl-9 max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs + Add Category + Trash */}
        <Tabs defaultValue={defaultTabValue} className="w-full">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <TabsList className="flex flex-wrap gap-2">
                {categoryKeys.map((key, index) => (
                  <TabsTrigger
                    key={key}
                    value={key.toLowerCase().replace(/\s+/g, "-")}
                    draggable={isAdmin}
                    onDragStart={(e) => handleCategoryDragStart(index, e)}
                    onDragOver={(e) => {
                      if (!isAdmin) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => handleCategoryDrop(index, e)}
                    // This onDragStart is only for deleting category by trash
                    onMouseDownCapture={(e) => {
                      // If admin wants to drag to trash, we still need payload
                      // but we don't want to break tab reorder.
                      if (!isAdmin) return;
                      // Right-click or middle-click won't start drag; fine.
                    }}
                  >
                    {key}
                  </TabsTrigger>
                ))}
              </TabsList>

              {isAdmin && (
                <Button size="sm" onClick={() => setShowCategoryModal(true)}>
                  + Add Category
                </Button>
              )}
            </div>

            {/* Trash drop zone */}
            {isAdmin && (
              <div
                onDragOver={handleTrashDragOver}
                onDragLeave={handleTrashDragLeave}
                onDrop={handleTrashDrop}
                className={`flex items-center justify-center w-10 h-10 rounded-full border text-red-600 ${
                  overTrash ? "bg-red-100 border-red-500" : "border-red-200"
                }`}
                title="Drag a policy or category here to delete"
              >
                <Trash2 className="w-5 h-5" />
              </div>
            )}
          </div>

          {categoryKeys.map((key) => {
            const filtered = (Array.isArray(categories[key])
              ? categories[key]
              : []
            ).filter((policy) =>
              policy.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const tabValue = key.toLowerCase().replace(/\s+/g, "-");

            return (
              <TabsContent key={key} value={tabValue}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((policy, index) => {
                    const uploadKey = `${key}::${policy.name}`;
                    return (
                      <Card
                        key={`${policy.name}-${index}`}
                        className="p-2 text-xs space-y-0.5 shadow-sm border rounded-md h-full flex flex-col"
                        draggable={isAdmin}
                        onDragStart={(e) =>
                          startDragPolicyToTrash(e, key, policy.name)
                        }
                      >
                        <CardHeader className="pb-2 flex-grow">
                          <CardTitle className="text-sm font-semibold break-words">
                            {policy.name}
                          </CardTitle>
                          <CardDescription>
                            Last updated: {policy.updated}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-shrink-0 pt-0">
                          <div className="flex flex-wrap justify-center gap-2">
                            {/* View */}
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

                            {/* Download */}
                            <a
                              href={`${API}${policy.fileUrl}`}
                              download
                              className="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center"
                              title="Download"
                            >
                              <FiDownload className="w-4 h-4" />
                            </a>

                            {/* Upload new version (admin only) */}
                            {isAdmin && (
                              <>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  id={`upload-${key}-${index}`}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      await handleUploadPolicyFile(
                                        key,
                                        policy.name,
                                        file
                                      );
                                      // allow re-selecting the same file later
                                      e.target.value = "";
                                    }
                                  }}
                                />
                                {/* label styled as button */}
                                <label
                                  htmlFor={`upload-${key}-${index}`}
                                  className={`text-sm px-2 py-1 rounded-md flex items-center cursor-pointer ${
                                    uploadingPolicyKey === uploadKey
                                      ? "bg-green-200 text-green-900"
                                      : "bg-green-100 text-green-800 hover:bg-green-200"
                                  }`}
                                >
                                  {uploadingPolicyKey === uploadKey
                                    ? "Uploading..."
                                    : "Upload"}
                                </label>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Add Policy card (admin only) */}
                  {isAdmin && (
                    <Card
                      className="p-4 border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedCategory(key);
                        setShowPolicyModal(true);
                      }}
                    >
                      <span className="text-sm font-medium text-gray-600">
                        + Add Policy
                      </span>
                    </Card>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Document preview dialog */}
        <Dialog open={showDocModal} onOpenChange={setShowDocModal}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
            <DialogHeader>
              <DialogTitle>Document Preview</DialogTitle>
            </DialogHeader>
            {docToView ? (
              <iframe
                src={`${docToView}#toolbar=1&navpanes=0&view=fitH`}
                title="PDF Preview"
                className="w-full h-[90vh]"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No document selected
              </p>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Category dialog */}
        <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Policy Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="e.g. Finance Policies"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory} disabled={savingCategory}>
                  {savingCategory ? "Saving..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Policy dialog */}
        <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Add Policy {selectedCategory ? `in ${selectedCategory}` : ""}
              </DialogTitle>
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
                onChange={(e) =>
                  setNewPolicyFile(e.target.files?.[0] || null)
                }
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPolicyModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePolicy}>Save Policy</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation dialog */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm delete</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-4">
              {pendingDelete?.type === "category"
                ? `Are you sure you want to delete the entire category "${pendingDelete.category}" and all its policies?`
                : pendingDelete
                ? `Are you sure you want to delete policy "${pendingDelete.policyName}" in category "${pendingDelete.category}"?`
                : ""}
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default Policies;
