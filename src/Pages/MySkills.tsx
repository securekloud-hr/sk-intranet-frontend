import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Lightbulb } from "lucide-react";
import API from "@/config";

const MySkills = () => {
  const [skills, setSkills] = useState<string[]>(["React", "JavaScript"]);
  const [newSkill, setNewSkill] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addSkill = async () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    setSkills([...skills, trimmed]);
    setNewSkill("");
    setShowForm(false);

    // ✅ Send skill notification to admin
    try {
      await fetch(`${API}/api/sendSkillNotification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: trimmed,
          userName: "Development User", // Replace with real name if available
          userEmail: "devuser@example.com" // Replace with logged-in user email if available
        })
      });
      console.log("✅ Skill email sent");
    } catch (err) {
      console.error("❌ Failed to send skill email:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-yellow-700" />
        </div>
        <h1 className="text-2xl font-bold">My Skills</h1>
      </div>

      {skills.map((skill, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{skill}</CardTitle>
          </CardHeader>
        </Card>
      ))}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Skill</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Input
              placeholder="Enter skill name"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={addSkill}>Add</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      )}
    </div>
  );
};

export default MySkills;
