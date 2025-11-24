import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, HelpCircle, Globe } from "lucide-react";
import API from "@/config";

const FAQs = () => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);

  // 🔹 Subject + body for each type
  const [emailSubject, setEmailSubject] = useState("");
  const [emailQuery, setEmailQuery] = useState("");

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketQuery, setTicketQuery] = useState("");

  const [payrollSubject, setPayrollSubject] = useState("");
  const [payrollQuery, setPayrollQuery] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);
  const [isPayrollSubmitting, setIsPayrollSubmitting] = useState(false);

  // 🔹 Fetch logged-in user from localStorage
  const getUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  // 🔹 Common function to call backend
  const sendSupportEmail = async (
    subject: string,
    message: string,
    type: "query" | "ticket" | "payroll"
  ) => {
    const user = getUser();

    const name = user?.fullName || user?.name || "Anonymous User";
    const email = user?.email || user?.mail || "anonymous@example.com";

    const response = await fetch(`${API}/api/sendEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        type,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed");
    return data;
  };

  // 🔹 HR submit
  const handleEmailSubmit = async () => {
    if (!emailSubject.trim() || !emailQuery.trim()) return;
    setIsSubmitting(true);

    try {
      const result = await sendSupportEmail(
        emailSubject.trim(),
        emailQuery.trim(),
        "query"
      );
      if (result.success) {
        alert("✅ HR query sent successfully!");
        setEmailSubject("");
        setEmailQuery("");
        setIsEmailDialogOpen(false);
      }
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 IT Ticket submit
  const handleTicketSubmit = async () => {
    if (!ticketSubject.trim() || !ticketQuery.trim()) return;
    setIsTicketSubmitting(true);

    try {
      const result = await sendSupportEmail(
        ticketSubject.trim(),
        ticketQuery.trim(),
        "ticket"
      );
      if (result.success) {
        alert("🎫 Ticket sent successfully!");
        setTicketSubject("");
        setTicketQuery("");
        setIsTicketDialogOpen(false);
      }
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    } finally {
      setIsTicketSubmitting(false);
    }
  };

  // 🔹 Payroll submit
  const handlePayrollSubmit = async () => {
    if (!payrollSubject.trim() || !payrollQuery.trim()) return;
    setIsPayrollSubmitting(true);

    try {
      const result = await sendSupportEmail(
        payrollSubject.trim(),
        payrollQuery.trim(),
        "payroll"
      );
      if (result.success) {
        alert("💰 Payroll query sent successfully!");
        setPayrollSubject("");
        setPayrollQuery("");
        setIsPayrollDialogOpen(false);
      }
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    } finally {
      setIsPayrollSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Didn't find what you're looking for?</CardTitle>
          <CardDescription>Contact us for more help</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ========================== HR Email ========================== */}
            <Dialog
              open={isEmailDialogOpen}
              onOpenChange={setIsEmailDialogOpen}
            >
              <div className="border rounded-lg p-4 text-center">
                <Mail className="h-8 w-8 mx-auto mb-2 text-securekloud-600" />
                <h3 className="font-medium mb-2">HR Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact HR for assistance.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsEmailDialogOpen(true)}
                >
                  Email Support
                </Button>
              </div>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit an HR Query</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Query</Label>
                    <Textarea
                      value={emailQuery}
                      onChange={(e) => setEmailQuery(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={
                      !emailSubject.trim() ||
                      !emailQuery.trim() ||
                      isSubmitting
                    }
                    onClick={handleEmailSubmit}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ========================== IT Ticket ========================== */}
            <Dialog
              open={isTicketDialogOpen}
              onOpenChange={setIsTicketDialogOpen}
            >
              <div className="border rounded-lg p-4 text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-securekloud-600" />
                <h3 className="font-medium mb-2">IT Support Ticket</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Raise an IT support ticket.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsTicketDialogOpen(true)}
                >
                  Create Ticket
                </Button>
              </div>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create an IT Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={ticketQuery}
                      onChange={(e) => setTicketQuery(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={
                      !ticketSubject.trim() ||
                      !ticketQuery.trim() ||
                      isTicketSubmitting
                    }
                    onClick={handleTicketSubmit}
                  >
                    {isTicketSubmitting ? "Creating..." : "Submit Ticket"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ========================== Payroll ========================== */}
            <Dialog
              open={isPayrollDialogOpen}
              onOpenChange={setIsPayrollDialogOpen}
            >
              <div className="border rounded-lg p-4 text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-securekloud-600" />
                <h3 className="font-medium mb-2">Payroll Helpdesk</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage payroll-related requests.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsPayrollDialogOpen(true)}
                >
                  View Payroll
                </Button>
              </div>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payroll Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={payrollSubject}
                      onChange={(e) => setPayrollSubject(e.target.value)}
                      placeholder="Subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Request</Label>
                    <Textarea
                      value={payrollQuery}
                      onChange={(e) => setPayrollQuery(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={
                      !payrollSubject.trim() ||
                      !payrollQuery.trim() ||
                      isPayrollSubmitting
                    }
                    onClick={handlePayrollSubmit}
                  >
                    {isPayrollSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQs;
