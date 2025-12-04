import React, { useState, useEffect, useMemo } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const [openPrimary, setOpenPrimary] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [isCertDialogVisible, setIsCertDialogVisible] = useState(false);

  // 🔹 Certification state (already working)
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [providerList, setProviderList] = useState<string[]>([]);
  const [certificateList, setCertificateList] = useState<string[]>([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [certsLoading, setCertsLoading] = useState(false);

  // 🔹 New: dynamic Skill data (Provider + Skill) for Primary & Secondary
  const [skillProviders, setSkillProviders] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  // Primary skill selection
  const [primarySkillProvider, setPrimarySkillProvider] = useState("");
  const [primarySkillName, setPrimarySkillName] = useState("");
  const [primarySkillOptions, setPrimarySkillOptions] = useState<string[]>([]);

  // Secondary skill selection
  const [secondarySkillProvider, setSecondarySkillProvider] = useState("");
  const [secondarySkillName, setSecondarySkillName] = useState("");
  const [secondarySkillOptions, setSecondarySkillOptions] = useState<string[]>([]);

  const [primaryError, setPrimaryError] = useState("");
  const [secondaryError, setSecondaryError] = useState("");
  const [certError, setCertError] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // ===================== GET LOGGED USER FROM LOCALSTORAGE =====================
  const currentUser = useMemo(() => {
    try {
      const r = localStorage.getItem("user");
      return r && r !== "undefined" ? JSON.parse(r) : null;
    } catch {
      return null;
    }
  }, []);

  // 🔑 Use EMAIL for API calls (support email or mail from AAD)
  const userEmail: string | undefined = (
    currentUser?.email || currentUser?.mail
  )
    ?.toString()
    .trim()
    .toLowerCase();

  // (optional) Keep name for greeting only
  const userName: string | undefined = currentUser?.name
    ?.replace(/\s+/g, " ")
    .trim();

  // ===================== FETCH EMPLOYEE DATA BY EMAIL =====================
  useEffect(() => {
    const loadSkills = async () => {
      if (!userEmail) {
        setLoadError("⚠️ User email missing from session");
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(
          `${API}/api/employee-directory/by-email/${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await resp.json();

        if (!data.success || !data.employee) {
          setLoadError("⚠️ Employee not found in Employee Directory");
        } else {
          setEmployee(data.employee);
          setPrimarySkills(data.employee.primarySkills ?? []);
          setSecondarySkills(data.employee.secondarySkills ?? []);
          setCertifications(data.employee.certifications ?? []);
        }
      } catch (err) {
        console.error(err);
        setLoadError("❌ Server not responding");
      }

      setLoading(false);
    };

    loadSkills();
  }, [userEmail]);

  // ===================== SAVE TO DB (BY EMAIL) =====================
  const saveSkills = async (
    p = primarySkills,
    s = secondarySkills,
    c = certifications
  ) => {
    if (!userEmail) return;

    try {
      await fetch(
        `${API}/api/employee-directory/by-email/${encodeURIComponent(
          userEmail
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            primarySkills: p,
            secondarySkills: s,
            certifications: c,
          }),
        }
      );
    } catch (err) {
      console.error("❌ Failed to update skills", err);
    }
  };

  // ===================== EMAIL NOTIFICATION =====================
  const sendSkillEmail = async (
    kind: "primary" | "secondary" | "certification",
    value: string
  ) => {
    if (!currentUser) return;

    const name =
      currentUser.fullName ||
      currentUser.name ||
      "Intranet User";

    const email =
      currentUser.email ||
      currentUser.mail ||
      userEmail;

    if (!email) return;

    const prettyKind =
      kind === "certification" ? "Certification" : `${kind} skill`;

    const subject = `New ${prettyKind} added - ${name}`;

    const message = `
User: ${name}
Email: ${email}
Type: ${prettyKind}
Value: ${value}

Source: Learning & Development → Add your Skills, Certifications, and Courses
    `;

    try {
      await fetch(`${API}/api/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          type: "query", // 🔹 Goes to HR + CC to user (handled in backend)
        }),
      });
    } catch (err) {
      console.error("❌ Failed to send skill email", err);
    }
  };

  // ===================== ADD SKILLS =====================
  const handleAddPrimary = async () => {
    if (!primarySkillProvider || !primarySkillName) {
      return setPrimaryError("Provider + Skill required");
    }

    const label = `${primarySkillName} - ${primarySkillProvider}`;

    if (primarySkills.includes(label)) return setPrimaryError("Duplicate");

    const updated = [...primarySkills, label];
    setPrimarySkills(updated);

    // reset dialog state
    setPrimarySkillProvider("");
    setPrimarySkillName("");
    setPrimarySkillOptions([]);
    setOpenPrimary(false);
    setPrimaryError("");

    await saveSkills(updated, secondarySkills, certifications);

    // 🔔 Notify HR + user
    sendSkillEmail("primary", label);
  };

  const handleAddSecondary = async () => {
    if (!secondarySkillProvider || !secondarySkillName) {
      return setSecondaryError("Provider + Skill required");
    }

    const label = `${secondarySkillName} - ${secondarySkillProvider}`;

    if (secondarySkills.includes(label)) return setSecondaryError("Duplicate");

    const updated = [...secondarySkills, label];
    setSecondarySkills(updated);

    // reset dialog state
    setSecondarySkillProvider("");
    setSecondarySkillName("");
    setSecondarySkillOptions([]);
    setOpenSecondary(false);
    setSecondaryError("");

    await saveSkills(primarySkills, updated, certifications);

    // 🔔 Notify HR + user
    sendSkillEmail("secondary", label);
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
    setCertError("");
    await saveSkills(primarySkills, secondarySkills, updated);

    // 🔔 Notify HR + user
    sendSkillEmail("certification", label);
  };

  // ===================== Load Cert Providers from API =====================
  const loadProviders = async () => {
    if (providerList.length > 0) return; // already loaded
    setProvidersLoading(true);
    try {
      const res = await fetch(`${API}/api/learning/certification-providers`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProviderList(json.data);
      }
    } catch (e) {
      console.error("Failed to load providers", e);
    } finally {
      setProvidersLoading(false);
    }
  };

  // ===================== Load Certificates when Provider changes =====================
  const loadCertificatesForProvider = async (provider: string) => {
    if (!provider) return;
    setCertsLoading(true);
    setCertificateList([]);
    try {
      const res = await fetch(
        `${API}/api/learning/certificates/${encodeURIComponent(provider)}`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCertificateList(json.data);
      }
    } catch (e) {
      console.error("Failed to load certificates", e);
    } finally {
      setCertsLoading(false);
    }
  };

  // ===================== Load skill providers (for primary + secondary) =====================
  const loadSkillProviders = async () => {
    if (skillProviders.length > 0) return; // already loaded
    setSkillsLoading(true);
    try {
      const res = await fetch(`${API}/api/learning/skill-providers`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSkillProviders(json.data);
      }
    } catch (e) {
      console.error("Failed to load skill providers", e);
    } finally {
      setSkillsLoading(false);
    }
  };

  // ===================== Load skills list for a provider =====================
  const loadSkillsForProvider = async (
    provider: string,
    kind: "primary" | "secondary"
  ) => {
    if (!provider) return;

    try {
      const res = await fetch(
        `${API}/api/learning/skill-list/${encodeURIComponent(provider)}`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        if (kind === "primary") {
          setPrimarySkillOptions(json.data);
        } else {
          setSecondarySkillOptions(json.data);
        }
      }
    } catch (e) {
      console.error("Failed to load skills for provider", e);
    }
  };

  // ===================== UI states =====================
  if (loading) return <div className="p-5 text-lg">Loading your profile…</div>;
  if (loadError) return <div className="p-5 text-red-600">{loadError}</div>;

  const displayName = employee?.name || userName || userEmail;

  // ========================================================================================
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold">Learning & Development</h1>
      <h1 className="text-2xl font-bold">
        Add your Skills, Certifications, and Courses
      </h1>

      <p className="opacity-60 -mt-2">Welcome {displayName} 👋</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ================= Primary Skills ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1">
              {primarySkills.length === 0 && (
                <li className="text-gray-400">None added</li>
              )}
              {primarySkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <Button
              className="mt-3 w-full bg-purple-600 text-white"
              onClick={async () => {
                setPrimaryError("");
                setOpenPrimary(true);
                await loadSkillProviders();
              }}
            >
              + Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* ================= Secondary Skills ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Secondary Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1">
              {secondarySkills.length === 0 && (
                <li className="text-gray-400">None added</li>
              )}
              {secondarySkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <Button
              className="mt-3 w-full bg-purple-600"
              onClick={async () => {
                setSecondaryError("");
                setOpenSecondary(true);
                await loadSkillProviders();
              }}
            >
              + Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* ================= Certifications ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-1">
              {certifications.length === 0 && (
                <li className="text-gray-400">No Certifications yet</li>
              )}
              {certifications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <Button
              className="mt-3 w-full bg-purple-600"
              onClick={async () => {
                setCertError("");
                setIsCertDialogVisible(true);
                await loadProviders();
              }}
            >
              + Add Certification
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================================
       Primary Skill Dialog
      ======================================================================================== */}
      <Dialog open={openPrimary} onOpenChange={setOpenPrimary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Primary Skill</DialogTitle>
          </DialogHeader>

          <label>Provider</label>
          <Select
            value={primarySkillProvider}
            onValueChange={async (v) => {
              setPrimarySkillProvider(v);
              setPrimarySkillName("");
              setPrimaryError("");
              setPrimarySkillOptions([]);
              await loadSkillsForProvider(v, "primary");
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  skillsLoading ? "Loading providers..." : "Select Provider"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {skillProviders.length === 0 && !skillsLoading && (
                <SelectItem value="__none" disabled>
                  No providers found
                </SelectItem>
              )}
              {skillProviders.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="mt-2 block">Skill</label>
          <Select
            disabled={!primarySkillProvider}
            value={primarySkillName}
            onValueChange={(v) => {
              setPrimarySkillName(v);
              setPrimaryError("");
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !primarySkillProvider
                    ? "Select provider first"
                    : "Choose Skill"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {primarySkillOptions.length === 0 && primarySkillProvider && (
                <SelectItem value="__none" disabled>
                  No skills found
                </SelectItem>
              )}
              {primarySkillOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {primaryError && (
            <p className="text-red-600 text-sm mt-1">{primaryError}</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setPrimaryError("");
                setOpenPrimary(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddPrimary}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================================
       Secondary Skill Dialog
      ======================================================================================== */}
      <Dialog open={openSecondary} onOpenChange={setOpenSecondary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Secondary Skill</DialogTitle>
          </DialogHeader>

          <label>Provider</label>
          <Select
            value={secondarySkillProvider}
            onValueChange={async (v) => {
              setSecondarySkillProvider(v);
              setSecondarySkillName("");
              setSecondaryError("");
              setSecondarySkillOptions([]);
              await loadSkillsForProvider(v, "secondary");
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  skillsLoading ? "Loading providers..." : "Select Provider"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {skillProviders.length === 0 && !skillsLoading && (
                <SelectItem value="__none" disabled>
                  No providers found
                </SelectItem>
              )}
              {skillProviders.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="mt-2 block">Skill</label>
          <Select
            disabled={!secondarySkillProvider}
            value={secondarySkillName}
            onValueChange={(v) => {
              setSecondarySkillName(v);
              setSecondaryError("");
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !secondarySkillProvider
                    ? "Select provider first"
                    : "Choose Skill"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {secondarySkillOptions.length === 0 && secondarySkillProvider && (
                <SelectItem value="__none" disabled>
                  No skills found
                </SelectItem>
              )}
              {secondarySkillOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {secondaryError && (
            <p className="text-red-600 text-sm mt-1">{secondaryError}</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSecondaryError("");
                setOpenSecondary(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSecondary}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================================
       Certification Add
      ======================================================================================== */}
      <Dialog
        open={isCertDialogVisible}
        onOpenChange={setIsCertDialogVisible}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
          </DialogHeader>

          <label>Provider</label>
          <Select
            onValueChange={async (v) => {
              setSelectedProvider(v);
              setSelectedCertificate("");
              setCertError("");
              await loadCertificatesForProvider(v);
            }}
            value={selectedProvider}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  providersLoading ? "Loading providers..." : "Select Provider"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {providerList.length === 0 && !providersLoading && (
                <SelectItem value="__none" disabled>
                  No providers found
                </SelectItem>
              )}
              {providerList.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="mt-2 block">Certificate</label>
          <Select
            disabled={!selectedProvider || certsLoading}
            onValueChange={(v) => {
              setSelectedCertificate(v);
              setCertError("");
            }}
            value={selectedCertificate}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !selectedProvider
                    ? "Select provider first"
                    : certsLoading
                    ? "Loading certificates..."
                    : "Choose Certificate"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {certificateList.length === 0 && !certsLoading && (
                <SelectItem value="__none" disabled>
                  No certificates found
                </SelectItem>
              )}
              {certificateList.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {certError && (
            <p className="text-red-500 text-sm mt-1">{certError}</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setCertError("");
                setIsCertDialogVisible(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCertification}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningDevelopment;
