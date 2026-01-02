import { useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, HelpCircle, Globe } from "lucide-react";
import API from "@/config";

/* ================= TYPES ================= */
type Ticket = {
  _id: string;
  type: "query" | "ticket" | "payroll";
  subject?: string;   // ✅ ADD THIS
  message: string;
  status?: string;
  timestamp: string;
};


const FAQs = () => {
  /* ================= DIALOG STATES ================= */
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);

  /* ================= FORM STATES ================= */
  const [emailSubject, setEmailSubject] = useState("");
  const [emailQuery, setEmailQuery] = useState("");

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketQuery, setTicketQuery] = useState("");

  const [payrollSubject, setPayrollSubject] = useState("");
  const [payrollQuery, setPayrollQuery] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);
  const [isPayrollSubmitting, setIsPayrollSubmitting] = useState(false);

  /* ================= TABLE STATES ================= */
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  /* ================= USER ================= */
  const getUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  /* ================= TYPE MAPPER ================= */
  const getDisplayType = (type: string) => {
    switch (type) {
      case "query":
        return "HR";
      case "ticket":
        return "IT";
      case "payroll":
        return "Payroll";
      default:
        return type.toUpperCase();
    }
  };

  /* ================= FETCH TICKETS ================= */
  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const user = getUser();
      const email = user?.email || user?.mail;

      if (!email) {
        setTickets([]);
        return;
      }

      const res = await fetch(
        `${API}/api/queries?email=${encodeURIComponent(email)}`
      );

      if (!res.ok) throw new Error("Failed to fetch tickets");

      const json = await res.json();
      setTickets(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch tickets", err);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* ================= SEND EMAIL ================= */
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
      body: JSON.stringify({ name, email, subject, message, type }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed");

    await fetchTickets(); // refresh table
    return data;
  };

  /* ================= SUBMITS ================= */
  const handleEmailSubmit = async () => {
    if (!emailSubject.trim() || !emailQuery.trim()) return;
    setIsSubmitting(true);
    try {
      await sendSupportEmail(emailSubject, emailQuery, "query");
      setEmailSubject("");
      setEmailQuery("");
      setIsEmailDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketSubmit = async () => {
    if (!ticketSubject.trim() || !ticketQuery.trim()) return;
    setIsTicketSubmitting(true);
    try {
      await sendSupportEmail(ticketSubject, ticketQuery, "ticket");
      setTicketSubject("");
      setTicketQuery("");
      setIsTicketDialogOpen(false);
    } finally {
      setIsTicketSubmitting(false);
    }
  };

  const handlePayrollSubmit = async () => {
    if (!payrollSubject.trim() || !payrollQuery.trim()) return;
    setIsPayrollSubmitting(true);
    try {
      await sendSupportEmail(payrollSubject, payrollQuery, "payroll");
      setPayrollSubject("");
      setPayrollQuery("");
      setIsPayrollDialogOpen(false);
    } finally {
      setIsPayrollSubmitting(false);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredTickets = tickets.filter((ticket) => {
    if (departmentFilter === "all") return true;
    return ticket.type === departmentFilter;
  });

  return (
    <div className="space-y-8">
      {/* ================= 3 CARDS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Didn't find what you're looking for?</CardTitle>
          <CardDescription>Contact us for more help</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* HR */}
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
                  Create Ticket
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

            {/* IT */}
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

            {/* Payroll */}
            <Dialog
              open={isPayrollDialogOpen}
              onOpenChange={setIsPayrollDialogOpen}
            >
              <div className="border rounded-lg p-4 text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-securekloud-600" />
                <h3 className="font-medium mb-2">Payroll Helpdesk</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Raise payroll-related queries.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsPayrollDialogOpen(true)}
                >
                  Create Ticket
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

      {/* ================= TABLE ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Your Submitted Tickets</CardTitle>
          <CardDescription>
           <div className="flex gap-2 mt-3">
  {[
    { label: "All", value: "all" },
    { label: "HR", value: "query" },
    { label: "IT", value: "ticket" },
    { label: "Payroll", value: "payroll" },
  ].map((tab) => {
    const isActive = departmentFilter === tab.value;

    return (
      <button
        key={tab.value}
        onClick={() => setDepartmentFilter(tab.value)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
          ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-blue-600 hover:bg-blue-100"
          }`}
      >
        {tab.label}
      </button>
    );
  })}
</div>



          </CardDescription>
        </CardHeader>

        <CardContent>
          {loadingTickets ? (
            <p>Loading tickets...</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-muted-foreground">
              {departmentFilter === "all" 
                ? "No tickets yet." 
                : `No ${getDisplayType(departmentFilter)} tickets found.`}
            </p>
          ) : (
            <Table>
             <TableHeader>
  <TableRow>
 
   <TableHead>Date</TableHead>
<TableHead>Type</TableHead>
<TableHead>Subject</TableHead>
<TableHead>Message</TableHead>
<TableHead>Status</TableHead>

    
  </TableRow>
</TableHeader>


              <TableBody>
                {filteredTickets.map((t) => (
               <TableRow key={t._id}>
  {/* ✅ Date FIRST */}
  <TableCell>
    {new Date(t.timestamp).toLocaleDateString()}
  </TableCell>

  <TableCell>{getDisplayType(t.type)}</TableCell>

  <TableCell className="font-medium">
    {t.subject || "-"}
  </TableCell>

  <TableCell className="truncate max-w-md">
    {t.message}
  </TableCell>

  <TableCell className="capitalize">
    {t.status}
  </TableCell>
</TableRow>


                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQs;