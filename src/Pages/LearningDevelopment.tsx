import React, { useState, useEffect, useMemo } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/config";

// ===================== Certification Provider List =====================
const providersMap: Record<string, string[]> = {
  AWS: ["AWS Certified Cloud Practitioner","AWS Certified Solutions Architect","AWS Certified Developer"],
  "Microsoft Azure": ["Azure Fundamentals","Azure Administrator","Azure Developer"],
  "Google Cloud": ["Associate Cloud Engineer","Professional Cloud Architect","Professional Data Engineer"],
  Python: ["PCEP - Entry-Level Python","PCAP - Associate Python Programmer"],
  Udemy: ["100 Days Python Bootcamp","Ultimate AWS Solutions Architect"],
  Coursera: ["Google IT Support","IBM Data Science"],
};

// ===================== Employee Structure =====================
interface EmployeeSkills {
  id: string;
  EmpID: string;
  name: string;
  email: string;
  department: string;
  primarySkills: string[];
  secondarySkills: string[];
  certifications: string[]; // mapped from SpecialSkill
}

const LearningDevelopment: React.FC = () => {

  const [employee, setEmployee] = useState<EmployeeSkills | null>(null);

  const [primarySkills, setPrimarySkills] = useState<string[]>([]);
  const [secondarySkills, setSecondarySkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  const [newPrimary, setNewPrimary] = useState("");
  const [newSecondary, setNewSecondary] = useState("");

  const [openPrimary, setOpenPrimary] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [isCertDialogVisible, setIsCertDialogVisible] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState("");

  const [primaryError, setPrimaryError] = useState("");
  const [secondaryError, setSecondaryError] = useState("");
  const [certError, setCertError] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");


  // ===================== GET LOGGED USER NAME =====================
  const currentUser = useMemo(() => {
    try {
      const r = localStorage.getItem("user");
      return r && r !== "undefined" ? JSON.parse(r) : null;
    } catch { return null; }
  }, []);

  const userName: string | undefined =
    currentUser?.name?.replace(/\s+/g, " ").trim();   // 🔥 FIX – removes double spaces


  // ===================== FETCH EMPLOYEE DATA =====================
  useEffect(() => {
    const loadSkills = async () => {
      if (!userName) {
        setLoadError("⚠️ User name missing from session");
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(
          `${API}/api/employee-directory/by-name/${encodeURIComponent(userName)}`
        );
        const data = await resp.json();

        if (!data.success) {
          setLoadError("⚠️ Employee not found in Employee Directory");
        } else {
          setEmployee(data.employee);
          setPrimarySkills(data.employee.primarySkills ?? []);
          setSecondarySkills(data.employee.secondarySkills ?? []);
          setCertifications(data.employee.certifications ?? []);
        }
      } catch {
        setLoadError("❌ Server not responding");
      }

      setLoading(false);
    };

    loadSkills();
  }, [userName]);


  // ===================== SAVE TO DB =====================
  const saveSkills = async (
    p = primarySkills,
    s = secondarySkills,
    c = certifications
  ) => {
    if (!userName) return;

    try {
      await fetch(
        `${API}/api/employee-directory/by-name/${encodeURIComponent(userName)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ primarySkills:p, secondarySkills:s, certifications:c }),
        }
      );
    } catch (err) {
      console.error("❌ Failed to update skills", err);
    }
  };


  // ===================== ADD SKILLS =====================
  const handleAddPrimary = async () => {
    const t = newPrimary.trim();
    if (!t) return setPrimaryError("Required");
    if (primarySkills.includes(t)) return setPrimaryError("Duplicate");

    const updated = [...primarySkills, t];
    setPrimarySkills(updated);
    setNewPrimary("");
    setOpenPrimary(false);
    await saveSkills(updated, secondarySkills, certifications);
  };

  const handleAddSecondary = async () => {
    const t = newSecondary.trim();
    if (!t) return setSecondaryError("Required");
    if (secondarySkills.includes(t)) return setSecondaryError("Duplicate");

    const updated = [...secondarySkills, t];
    setSecondarySkills(updated);
    setNewSecondary("");
    setOpenSecondary(false);
    await saveSkills(primarySkills, updated, certifications);
  };

  const handleAddCertification = async () => {
    if (!selectedProvider || !selectedCertificate)
      return setCertError("Provider + Certificate required");

    const label = `${selectedCertificate} - ${selectedProvider}`;
    if (certifications.includes(label)) return setCertError("Already Exists");

    const updated = [...certifications, label];
    setCertifications(updated);
    setSelectedProvider("");
    setSelectedCertificate("");
    setIsCertDialogVisible(false);
    await saveSkills(primarySkills, secondarySkills, updated);
  };


  // ===================== UI states =====================
  if (loading) return <div className="p-5 text-lg">Loading your profile…</div>;
  if (loadError) return <div className="p-5 text-red-600">{loadError}</div>;

  const displayName = employee?.name || userName;


  // ========================================================================================
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold">Learning & Development</h1>
       <h1 className="text-2xl font-bold">Add your Skills, Certifications, and Courses</h1>
      

      <p className="opacity-60 -mt-2">Welcome {displayName} 👋</p>

      <div className="grid md:grid-cols-3 gap-6">


{/* ================= Primary Skills ================= */}
        <Card>
          <CardHeader><CardTitle>Primary Skills</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1">
              {primarySkills.length === 0 && <li className="text-gray-400">None added</li>}
              {primarySkills.map((s,i)=> <li key={i}>{s}</li>)}
            </ul>
            <Button className="mt-3 w-full bg-purple-600 text-white"
              onClick={()=>setOpenPrimary(true)}>+ Add Skill</Button>
          </CardContent>
        </Card>


{/* ================= Secondary Skills ================= */}
        <Card>
          <CardHeader><CardTitle>Secondary Skills</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1">
              {secondarySkills.length === 0 && <li className="text-gray-400">None added</li>}
              {secondarySkills.map((s,i)=> <li key={i}>{s}</li>)}
            </ul>
            <Button className="mt-3 w-full bg-purple-600"
              onClick={()=>setOpenSecondary(true)}>+ Add Skill</Button>
          </CardContent>
        </Card>


{/* ================= Certifications ================= */}
        <Card>
          <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1">
              {certifications.length === 0 && <li className="text-gray-400">No Certifications yet</li>}
              {certifications.map((c,i)=><li key={i}>{c}</li>)}
            </ul>
            <Button className="mt-3 w-full bg-purple-600"
              onClick={()=>setIsCertDialogVisible(true)}>+ Add Certification</Button>
          </CardContent>
        </Card>
      </div>


{/* ========================================================================================
   Primary Skill Dialog
======================================================================================== */}
      <Dialog open={openPrimary} onOpenChange={setOpenPrimary}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Primary Skill</DialogTitle></DialogHeader>
          <Input placeholder="e.g. MERN, AWS"
            value={newPrimary}
            onChange={(e)=>{setNewPrimary(e.target.value);setPrimaryError("");}}/>
          {primaryError && <p className="text-red-600">{primaryError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={()=>setOpenPrimary(false)}>Cancel</Button>
            <Button onClick={handleAddPrimary}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>


{/* ========================================================================================
   Secondary Skill Dialog
======================================================================================== */}
      <Dialog open={openSecondary} onOpenChange={setOpenSecondary}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Secondary Skill</DialogTitle></DialogHeader>
          <Input placeholder="e.g. NextJS, Python, Azure"
            value={newSecondary}
            onChange={(e)=>{setNewSecondary(e.target.value);setSecondaryError("");}}/>
          {secondaryError && <p className="text-red-600">{secondaryError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={()=>setOpenSecondary(false)}>Cancel</Button>
            <Button onClick={handleAddSecondary}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>


{/* ========================================================================================
   Certification Add
======================================================================================== */}
      <Dialog open={isCertDialogVisible} onOpenChange={setIsCertDialogVisible}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Certification</DialogTitle></DialogHeader>

          <label>Provider</label>
          <Select onValueChange={(v)=>{setSelectedProvider(v);setCertError("");}} value={selectedProvider}>
            <SelectTrigger><SelectValue placeholder="Select Provider" /></SelectTrigger>
            <SelectContent>
              {Object.keys(providersMap).map(p=> <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <label className="mt-2 block">Certificate</label>
          <Select disabled={!selectedProvider}
                  onValueChange={(v)=>{setSelectedCertificate(v);setCertError("");}}
                  value={selectedCertificate}>
            <SelectTrigger><SelectValue placeholder="Choose Certificate" /></SelectTrigger>
            <SelectContent>
              {selectedProvider && providersMap[selectedProvider].map(c=>(
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {certError && <p className="text-red-500 text-sm mt-1">{certError}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={()=>setIsCertDialogVisible(false)}>Cancel</Button>
            <Button onClick={handleAddCertification}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default LearningDevelopment;
