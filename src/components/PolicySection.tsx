//import React, { useEffect, useMemo, useState } from "react";
//import API from "@/config";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiEye, FiDownload } from "react-icons/fi";
import { Trash2 } from "lucide-react";

type UserLike = {
  role?: "admin" | "user";
};

type Policy = {
  name: string;
  fileUrl: string;
  updated: string;
  description?: string;
};

type CategoriesResponse = {
  [category: string]: Policy[];
};

interface Props {
  category: string;        // 👈 "HR Policies", "Admin Policies", "IT Policies"
  title: string;           // 👈 Heading text
}

const PolicySection: React.FC<Props> = ({ category, title }) => {
  const cachedUser = useMemo<UserLike | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") return JSON.parse(raw);
    } catch {}
    return null;
  }, []);

  const isAdmin = (cachedUser?.role || "user") === "admin";

  const [categories, setCategories] = useState<CategoriesResponse>({});
  const [loading, setLoading] = useState(false);

  const [docToView, setDocToView] = useState<string | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/policies`);
      const data = await res.json();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const policies = categories[category] || [];

  const uploadPolicy = async (name: string, file: File) => {
    const form = new FormData();
    form.append("file", file);

    await fetch(
      `${API}/api/policies/upload/${encodeURIComponent(category)}/${encodeURIComponent(name)}`,
      { method: "POST", body: form }
    );

    fetchPolicies();
  };

  const deletePolicy = async () => {
    if (!deleteTarget) return;

    await fetch(
      `${API}/api/policies/${encodeURIComponent(category)}/${encodeURIComponent(deleteTarget)}`,
      { method: "DELETE" }
    );

    setDeleteTarget(null);
    fetchPolicies();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      {loading ? (
        <p>Loading policies...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {policies.map((p, i) => (
            <Card key={i} className="p-2 text-xs flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>Updated: {p.updated}</CardDescription>
              </CardHeader>

              <CardContent className="mt-auto">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setDocToView(`${API}${p.fileUrl}`);
                      setShowDocModal(true);
                    }}
                    className="bg-blue-100 px-2 py-1 rounded"
                  >
                    <FiEye />
                  </button>

                  <a
                    href={`${API}/api/policies/download/${encodeURIComponent(category)}/${encodeURIComponent(p.name)}`}
                    className="bg-gray-100 px-2 py-1 rounded"
                  >
                    <FiDownload />
                  </a>

                  {isAdmin && (
                    <>
                      <input
                        type="file"
                        className="hidden"
                        id={`upload-${i}`}
                        onChange={(e) =>
                          e.target.files && uploadPolicy(p.name, e.target.files[0])
                        }
                      />
                      <label
                        htmlFor={`upload-${i}`}
                        className="bg-green-100 px-2 py-1 rounded cursor-pointer"
                      >
                        Upload
                      </label>

                      <button
                        onClick={() => setDeleteTarget(p.name)}
                        className="bg-red-100 px-2 py-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {isAdmin && (
            <Card
              className="border-dashed border-2 flex items-center justify-center cursor-pointer"
              onClick={() => setShowAddModal(true)}
            >
              + Add Policy
            </Card>
          )}
        </div>
      )}

      {/* Preview */}
     {/* Preview */}
<Dialog open={showDocModal} onOpenChange={setShowDocModal}>
  <DialogContent
    className="
      w-[95vw] max-w-[95vw]
      h-[95vh]
      p-0
      overflow-hidden
    "
  >
    {/* Top bar */}
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <DialogTitle className="text-sm font-medium">Preview</DialogTitle>

      <button
        onClick={() => setShowDocModal(false)}
        className="text-gray-500 hover:text-gray-800 text-lg"
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    {/* PDF */}
    {docToView ? (
      <iframe
        src={`${docToView}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
        className="w-full h-[calc(95vh-44px)]"
        title="PDF Preview"
      />
    ) : (
      <div className="h-[calc(95vh-44px)] flex items-center justify-center text-muted-foreground">
        No document selected
      </div>
    )}
  </DialogContent>
</Dialog>


      {/* Add */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Policy</DialogTitle>
          </DialogHeader>
          <Input placeholder="Policy name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input type="file" accept="application/pdf" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
          <Button
            onClick={() => {
              if (newFile && newName) uploadPolicy(newName, newFile);
              setShowAddModal(false);
              setNewName("");
              setNewFile(null);
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Policy</DialogTitle>
          </DialogHeader>
          <Button variant="destructive" onClick={deletePolicy}>
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PolicySection;
