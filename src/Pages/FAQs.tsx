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
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, HelpCircle, Globe, Loader2 } from "lucide-react";
import API from "@/config";
import { useMsal } from "@azure/msal-react";

type SupportType = "hr" | "it" | "finance";

const FAQs = () => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);

  const [emailQuery, setEmailQuery] = useState("");
  const [ticketQuery, setTicketQuery] = useState("");
  const [payrollQuery, setPayrollQuery] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);
  const [isPayrollSubmitting, setIsPayrollSubmitting] = useState(false);

  // MSAL hooks
  const { instance, accounts } = useMsal();

  // Ensure the user is signed in (silent → popup)
  const ensureSignedIn = async () => {
    if (accounts && accounts[0]) return accounts[0];
    try {
      const sso = await instance.ssoSilent({
        scopes: [import.meta.env.VITE_API_SCOPE as string],
      });
      return sso.account!;
    } catch {
      const login = await instance.loginPopup({
        scopes: [import.meta.env.VITE_API_SCOPE as string],
      });
      return login.account!;
    }
  };

  // Send support email (HR, IT, Finance)
  async function sendSupportEmail(message: string, type: SupportType) {
    const acc = await ensureSignedIn();

    // Acquire a token for backend API
    let tokenResult;
    try {
      tokenResult = await instance.acquireTokenSilent({
        account: acc,
        scopes: [import.meta.env.VITE_API_SCOPE as string],
      });
    } catch {
      const login = await instance.loginPopup({
        scopes: [import.meta.env.VITE_API_SCOPE as string],
      });
      tokenResult = await instance.acquireTokenSilent({
        account: login.account!,
        scopes: [import.meta.env.VITE_API_SCOPE as string],
      });
    }

    // Call backend API
    const response = await fetch(`${API}/api/support/sendMail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResult.accessToken}`,
      },
      body: JSON.stringify({ message, type }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    return await response.json();
  }

  // Handlers for each section
  const handleEmailSubmit = async () => {
    if (!emailQuery.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await sendSupportEmail(emailQuery, "hr");
      if (result.ok || result.success) {
        alert("✅ Query submitted to HR!");
        setEmailQuery("");
        setIsEmailDialogOpen(false);
      } else {
        throw new Error("Failed to send HR query.");
      }
    } catch (err: any) {
      alert("❌ Failed to send HR query.\n\n" + (err?.message ?? err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketSubmit = async () => {
    if (!ticketQuery.trim()) return;
    setIsTicketSubmitting(true);
    try {
      const result = await sendSupportEmail(ticketQuery, "it");
      if (result.ok || result.success) {
        alert("🎫 IT ticket submitted!");
        setTicketQuery("");
        setIsTicketDialogOpen(false);
      } else {
        throw new Error("Failed to create IT ticket.");
      }
    } catch (err: any) {
      alert("❌ Failed to create IT ticket.\n\n" + (err?.message ?? err));
    } finally {
      setIsTicketSubmitting(false);
    }
  };

  const handlePayrollSubmit = async () => {
    if (!payrollQuery.trim()) return;
    setIsPayrollSubmitting(true);
    try {
      const result = await sendSupportEmail(payrollQuery, "finance");
      if (result.ok || result.success) {
        alert("✅ Payroll request sent to Finance!");
        setPayrollQuery("");
        setIsPayrollDialogOpen(false);
      } else {
        throw new Error("Failed to send payroll request.");
      }
    } catch (err: any) {
      alert("❌ Failed to send payroll request.\n\n" + (err?.message ?? err));
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
            {/* HR Email Support */}
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <div className="border rounded-lg p-4 text-center">
                <Mail className="h-8 w-8 mx-auto mb-2 text-securekloud-600" />
                <h3 className="font-medium mb-2">HR Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Email our HR support team for assistance.
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
                  <DialogTitle>Submit a Query</DialogTitle>
                  <DialogDescription>
                    Enter your question and we'll get back to you.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="query">Your Query</Label>
                  <Textarea
                    id="query"
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    placeholder="Describe your issue here..."
                    className="min-h-[100px]"
                    disabled={isSubmitting}
                  />
                  <Button
                    className="w-full"
                    disabled={!emailQuery.trim() || isSubmitting}
                    onClick={handleEmailSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* IT Support Ticket */}
            <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
              <div className="border rounded-lg p-4 text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-securekloud-600" />
                <h3 className="font-medium mb-2">Create an IT Support Ticket</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a support ticket for IT issues or troubleshooting.
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
                  <DialogTitle>Create a Support Ticket</DialogTitle>
                  <DialogDescription>
                    Tell us the issue in detail so we can assist you better.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="ticket">Issue Description</Label>
                  <Textarea
                    id="ticket"
                    value={ticketQuery}
                    onChange={(e) => setTicketQuery(e.target.value)}
                    placeholder="Describe the issue you're facing..."
                    className="min-h-[120px]"
                    disabled={isTicketSubmitting}
                  />
                  <Button
                    className="w-full"
                    disabled={!ticketQuery.trim() || isTicketSubmitting}
                    onClick={handleTicketSubmit}
                  >
                    {isTicketSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Submit Ticket"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Payroll / Finance Helpdesk */}
            <Dialog open={isPayrollDialogOpen} onOpenChange={setIsPayrollDialogOpen}>
              <div className="border rounded-lg p-4 text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-securekloud-600" />
                <h3 className="font-medium mb-2">Payroll Helpdesk</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your payroll details and requests.
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
                  <DialogTitle>Payroll Helpdesk</DialogTitle>
                  <DialogDescription>
                    Enter your payroll-related query or request below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="payroll">Your Request</Label>
                  <Textarea
                    id="payroll"
                    value={payrollQuery}
                    onChange={(e) => setPayrollQuery(e.target.value)}
                    placeholder="Describe your payroll request or issue..."
                    className="min-h-[120px]"
                    disabled={isPayrollSubmitting}
                  />
                  <Button
                    className="w-full"
                    disabled={!payrollQuery.trim() || isPayrollSubmitting}
                    onClick={handlePayrollSubmit}
                  >
                    {isPayrollSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
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
