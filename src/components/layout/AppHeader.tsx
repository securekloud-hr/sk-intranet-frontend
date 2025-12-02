import React, { useMemo, useState, useEffect } from "react";
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
  if (!empID || !name) {
    return "/employee-images/default-avatar.jpg";
  }
  const cleanName = name.trim().replace(/\s+/g, " ");
  return `/employee-images/${empID}-${cleanName}.jpg`;
}

const normalizeName = (s?: string | null) =>
  s ? s.trim().replace(/\s+/g, " ").toLowerCase() : "";

const normalizeEmail = (s?: string | null) =>
  s ? s.trim().toLowerCase() : "";

export function AppHeader({ user }: { user?: any }) {
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [employeeRecord, setEmployeeRecord] = useState<EmployeeRecord | null>(
    null
  );

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
  const email = mongoUser?.email || "";
  const role = mongoUser?.role || "user";
  const jobTitle = mongoUser?.jobTitle || "";
  const createdAt = mongoUser?.createdAt
    ? new Date(mongoUser.createdAt).toLocaleDateString()
    : "";
  const initial = displayName.charAt(0).toUpperCase();

  // 🔁 Fetch employee directory and match logged-in user → record
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
          } catch (e) {
            console.error(
              "Error parsing user from localStorage in AppHeader",
              e
            );
          }
        }

        const res = await fetch(`${API}/api/employeedirectory`, {
          headers: { "x-user-role": userRole },
        });

        if (!res.ok) throw new Error("Failed to fetch employee data in AppHeader");

        const data: EmployeeRecord[] = await res.json();

        const userEmailNorm = normalizeEmail(mongoUser.email);
        const userNameNorm = normalizeName(mongoUser.name);

        const match = data.find((emp) => {
          const empEmailNorm = normalizeEmail(emp.Email);
          const empNameNorm = normalizeName(emp.EmployeeName);

          return (
            (userEmailNorm && empEmailNorm && empEmailNorm === userEmailNorm) ||
            (userNameNorm && empNameNorm && empNameNorm === userNameNorm)
          );
        });

        console.log("AppHeader: normalized user:", {
          rawName: mongoUser.name,
          userNameNorm,
          rawEmail: mongoUser.email,
          userEmailNorm,
        });
        console.log("AppHeader: first few employees:", data.slice(0, 5));
        console.log("AppHeader matched employee:", match);

        setEmployeeRecord(match || null);
      } catch (err) {
        console.error("AppHeader: error matching employee record", err);
        setEmployeeRecord(null);
      }
    };

    fetchAndMatchEmployee();
  }, [mongoUser]);

  const avatarSrc = employeeRecord
    ? getEmployeeImage(employeeRecord.EmpID, employeeRecord.EmployeeName)
    : "/employee-images/default-avatar.jpg";

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
              <div className="p-2 text-sm text-gray-500">
                No new notifications
              </div>
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
                      e.currentTarget.src =
                        "/employee-images/default-avatar.jpg";
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
        </div>
      </header>

      {/* 🪟 My Account Popup (unchanged) */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>My Account</DialogTitle>
            <DialogDescription>
              Your profile information from SecureKloud directory.
            </DialogDescription>
          </DialogHeader>

          {mongoUser ? (
            <div className="mt-2 space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={avatarSrc}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/employee-images/default-avatar.jpg";
                    }}
                  />
                  <AvatarFallback className="bg-skcloud-purple text-white">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-base">{displayName}</div>
                  {email && (
                    <div className="text-muted-foreground text-xs">
                      {email}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <InfoRow
                  label="Role"
                  value={role === "admin" ? "Admin" : "User"}
                />
                <InfoRow label="Job Title" value={jobTitle} />
                <InfoRow label="Joined On" value={createdAt} />
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-red-500">
              No profile details found. Please ensure Mongo user data is loaded
              in <code className="ml-1">localStorage.user</code>.
            </div>
          )}
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
