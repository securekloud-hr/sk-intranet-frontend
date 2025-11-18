
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Award } from "lucide-react";
import API from "@/config";

interface Certification {
  title: string;
  provider: string;
}

const MyCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([
    { title: "AWS Certified Solutions Architect", provider: "Amazon" },
  ]);
  const [newCert, setNewCert] = useState<Certification>({ title: "", provider: "" });
  const [showForm, setShowForm] = useState(false);

  const addCertification = async () => {
    const trimmedTitle = newCert.title.trim();
    const trimmedProvider = newCert.provider.trim();

    if (!trimmedTitle || !trimmedProvider) return;

    setCertifications([...certifications, newCert]);
    setNewCert({ title: "", provider: "" });
    setShowForm(false);

    // ? Send email to admin
    try {
      await fetch(`${API}/api/auth/login`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          provider: trimmedProvider,
          userName: "Development User", // Replace with actual user if available
          userEmail: "devuser@example.com" // Replace with actual logged-in email
        })
      });
      console.log("? Certification email sent");
    } catch (err) {
      console.error("? Failed to send certification email:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <Award className="h-5 w-5 text-green-700" />
        </div>
        <h1 className="text-2xl font-bold">My Certifications</h1>
      </div>

      {certifications.map((cert, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{cert.title}</CardTitle>
            <CardDescription>{cert.provider}</CardDescription>
          </CardHeader>
        </Card>
      ))}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Certification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Input
              placeholder="Certification Title"
              value={newCert.title}
              onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
            />
            <Input
              placeholder="Provider"
              value={newCert.provider}
              onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={addCertification}>Add</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Certification
        </Button>
      )}
    </div>
  );
};

export default MyCertifications;
