import React, { useMemo, useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import API from "@/config";

type EmployeeRecord = {
  EmpID?: string;
  EmployeeName?: string;
  Email?: string;
};

function getEmployeeImage(empID?: string, name?: string) {
  
  if (!empID || !name) return "/employee-images/default-avatar.jpg";
  const cleanName = name.trim().replace(/\s+/g, " ");
 
  return `/employee-images/${empID}-${cleanName}.jpg`;
}

const normalizeName = (s?: string | null) =>
  s ? s.trim().replace(/\s+/g, " ").toLowerCase() : "";

const normalizeEmail = (s?: string | null) => (s ? s.trim().toLowerCase() : "");

export function AppHeader({ user }: { user?: any }) {
  const [showAccountDialog, setShowAccountDialog] = useState(false);

  // ✅ Image preview popup
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>("");

  const [employeeRecord, setEmployeeRecord] = useState<EmployeeRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // ✅ Keep avatar in state (no reload needed)
  const [storedAvatar, setStoredAvatar] = useState<{ email?: string; avatarUrl?: string }>(() => {
    try {
      return JSON.parse(localStorage.getItem("profile-avatar") || "{}");
    } catch {
      return {};
    }
  });

  const mongoUser = useMemo(() => {
    if (user) return user;
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to read user from localStorage", e);
    }
    return null;
  }, [user]);

  const displayName = mongoUser?.name || "User";
  const role = mongoUser?.role || "user";
  const jobTitle = mongoUser?.jobTitle || "";
  const createdAt = mongoUser?.createdAt ? new Date(mongoUser.createdAt).toLocaleDateString() : "";
  const initial = displayName.charAt(0).toUpperCase();

  // Derive email from multiple possible fields
  const effectiveEmail =
    (mongoUser as any)?.email ||
    (mongoUser as any)?.upn ||
    (mongoUser as any)?.userPrincipalName ||
    (mongoUser as any)?.username ||
    "";

  // Match with Employee Directory (only to fetch EmpID + name for default employee image)
  useEffect(() => {
    if (!mongoUser) return;

    const fetchAndMatchEmployee = async () => {
      try {
        let userRole = "user";
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed?.role) userRole = parsed.role;
          } catch {}
        }

        const res = await fetch(`${API}/api/employeedirectory`, {
          headers: { "x-user-role": userRole },
        });

        const data: EmployeeRecord[] = await res.json();

        const userEmailNorm = normalizeEmail(
          (mongoUser as any)?.email || (mongoUser as any)?.userPrincipalName
        );
        const userNameNorm = normalizeName(mongoUser.name);

        const match = data.find((emp) => {
          const empEmailNorm = normalizeEmail(emp.Email);
          const empNameNorm = normalizeName(emp.EmployeeName);

          return (
            (userEmailNorm && empEmailNorm && empEmailNorm === userEmailNorm) ||
            (userNameNorm && empNameNorm && empNameNorm === userNameNorm)
          );
        });

        setEmployeeRecord(match || null);
      } catch {
        setEmployeeRecord(null);
      }
    };

    fetchAndMatchEmployee();
  }, [mongoUser]);

  // ✅ Final avatar priority
  // 1) uploaded profile avatar (/profile-images)
  // 2) employee directory photo (/employee-images)
  // 3) default
  const avatarSrc =
    storedAvatar.email?.toLowerCase() === effectiveEmail.toLowerCase() && storedAvatar.avatarUrl
      ? storedAvatar.avatarUrl
      : employeeRecord
      ? getEmployeeImage(employeeRecord.EmpID, employeeRecord.EmployeeName)
      : "/employee-images/default-avatar.jpg";

  // Click handler to trigger file input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ Open large preview
  const openPreview = (src: string) => {
    setPreviewSrc(src);
    setShowAvatarPreview(true);
  };

  // ✅ Upload handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!effectiveEmail || effectiveEmail.toLowerCase() === "user") {
      alert("No valid email found for this user – cannot upload profile image.");
      return;
    }

    const formData = new FormData();
    formData.append("email", effectiveEmail);
    formData.append("avatar", file); // ✅ matches upload.single("avatar")

    try {
      setAvatarUploading(true);

      // ✅ FIXED ENDPOINT
      const res = await fetch(`${API}/api/profile/upload`, {
        method: "POST",
        body: formData,
      });

      // ✅ Safer parsing (prevents Unexpected token '<')
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        alert("Upload failed (server returned HTML / wrong API URL).");
        return;
      }

      if (!res.ok || !data.success) {
        alert(data.error || "Upload failed");
        return;
      }

      const newObj = { email: effectiveEmail, avatarUrl: data.avatarUrl };
      localStorage.setItem("profile-avatar", JSON.stringify(newObj));
      setStoredAvatar(newObj); // ✅ update UI immediately

      // reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">SecureKloud Intranet</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* 🔔 Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 text-sm text-gray-500">No new notifications</div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 👤 User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => setShowAccountDialog(true)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={avatarSrc}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/employee-images/default-avatar.jpg";
                    }}
                  />
                  <AvatarFallback className="bg-skcloud-purple text-white">
                    {initial}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start text-left leading-tight">
                  <span className="font-medium">{displayName}</span>
                  <span className="text-sm text-muted-foreground">
                    {role === "admin" ? "🛡️ Admin" : "👤 User"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
      </header>

      {/* 🪟 My Account Popup */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>My Account</DialogTitle>
            <DialogDescription>Your profile information from SecureKloud directory.</DialogDescription>
          </DialogHeader>

          {mongoUser ? (
            <div className="mt-2 space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {/* Click avatar to preview */}
                  <button
                    type="button"
                    className="rounded-full"
                    onClick={() => openPreview(avatarSrc)}
                    title="Click to view"
                  >
                    <Avatar className="h-12 w-12 border shadow-sm cursor-pointer">
                      <AvatarImage
                        src={avatarSrc}
                        alt={displayName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/employee-images/default-avatar.jpg";
                        }}
                      />
                      <AvatarFallback className="bg-skcloud-purple text-white">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs rounded-full">
                      Uploading...
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <div className="font-semibold text-base">{displayName}</div>

                  {effectiveEmail && (
                    <div className="text-muted-foreground text-xs">{effectiveEmail}</div>
                  )}

                  <button
                    type="button"
                    className="mt-1 text-xs text-blue-600 hover:underline"
                    onClick={handleAvatarClick}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? "Uploading..." : "Edit profile picture"}
                  </button>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <InfoRow label="Role" value={role === "admin" ? "Admin" : "User"} />
                <InfoRow label="Job Title" value={jobTitle} />
                <InfoRow label="Joined On" value={createdAt} />
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-red-500">No profile details found.</div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Large Image Preview Popup */}
      <Dialog open={showAvatarPreview} onOpenChange={setShowAvatarPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
            <DialogDescription>Preview</DialogDescription>
          </DialogHeader>

          <div className="w-full flex justify-center">
            <img
              src={previewSrc || avatarSrc}
              alt="Profile Preview"
              className="max-h-[70vh] w-auto rounded-lg border object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/employee-images/default-avatar.jpg";
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right break-words">{value}</span>
    </div>
  );
}
