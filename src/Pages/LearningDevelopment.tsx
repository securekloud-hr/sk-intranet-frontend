import React, { useState, useEffect } from "react";

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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/config";

interface Course {
  id: string;
  title: string;
  category: "technical" | "professional" | "compliance" | "leadership";
  description: string;
  duration: string;
  instructor: string;
  enrolled?: boolean;
  progress?: number;
}

const baseCourses: Course[] = [
  {
    id: "1",
    title: "Cloud Security Fundamentals",
    category: "technical",
    description: "Learn the basics of securing cloud environments and applications.",
    duration: "4 hours",
    instructor: "David Chen",
    enrolled: true,
    progress: 75,
  },
  {
    id: "2",
    title: "Effective Communication Skills",
    category: "professional",
    description: "Improve your communication skills.",
    duration: "3 hours",
    instructor: "James Wilson",
    enrolled: true,
    progress: 30,
  },
];

const LearningDevelopment = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<{ title: string; provider: string }[]>([]);
  const [courses, setCourses] = useState<Course[]>([...baseCourses]);

  const [newSkill, setNewSkill] = useState("");
  const [newCert, setNewCert] = useState({ title: "", provider: "" });
  const [newCourse, setNewCourse] = useState({ title: "", instructor: "", duration: "", category: "technical" as const });
  const [searchTerm, setSearchTerm] = useState("");

  const [openSkill, setOpenSkill] = useState(false);
  const [openManualCert, setOpenManualCert] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);

  const [skillError, setSkillError] = useState("");
  const [certError, setCertError] = useState("");
  const [courseError, setCourseError] = useState("");

  const [isCertDialogVisible, setIsCertDialogVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState("");

  const providers = {
    "AWS": ["AWS Certified Cloud Practitioner", "AWS Certified Solutions Architect", "AWS Certified Developer"],
    "Microsoft Azure": ["Azure Fundamentals", "Azure Administrator", "Azure Developer"],
    "Google Cloud": ["Associate Cloud Engineer", "Professional Cloud Architect", "Professional Data Engineer"],
    "Python": ["PCEP - Certified Entry-Level Python Programmer", "PCAP - Certified Associate in Python Programming"],
    "Udemy": ["100 Days of Code: The Complete Python Pro Bootcamp", "Ultimate AWS Certified Solutions Architect Associate"],
    "Coursera": ["Google IT Support Professional Certificate", "IBM Data Science Professional Certificate"]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsResp, certsResp, coursesResp] = await Promise.all([
          fetch(`${API}/api/skills/mukund`),
          fetch(`${API}/api/certificates/mukund`),
          fetch(`${API}/api/courses/mukund`),
          fetch(`${API}/api/courses/mukund`),
        ]);
        const [skillsData, certsData, coursesData] = await Promise.all([
          skillsResp.json(),
          certsResp.json(),
          coursesResp.json(),
        ]);
        if (skillsResp.ok) setSkills(skillsData.map((s: any) => s.skillName));
        if (certsResp.ok) setCertifications(certsData.map((c: any) => ({ title: c.title, provider: c.provider })));
        if (coursesResp.ok) setCourses(coursesData);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const filterCourses = (category: string) =>
    courses.filter(
      (course) =>
        (category === "all" || course.category === category) &&
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const addSkill = async () => {
  const trimmed = newSkill.trim();
  if (!trimmed) return setSkillError("Skill cannot be empty");
  if (skills.includes(trimmed)) return setSkillError("Skill already exists");
  try {
    const response = await fetch(`${API}/api/add-skill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "mukund", skillName: trimmed }),
    });
    const data = await response.json();
    if (response.ok) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
      setSkillError("");
      setOpenSkill(false);

      // 📧 Send email notification
      await fetch(`${API}api/sendSkillNotification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: trimmed, user: "mukund" }),
      });
    
    } else {
      setSkillError(data.error || "Failed to add skill");
    }
  } catch (err) {
    setSkillError("Network error, please try again");
  }
};


 const handleAddCertificationFromDialog = async () => {
  if (!selectedProvider || !selectedCertificate) {
    setCertError("Please select both provider and certificate");
    return;
  }
  if (certifications.some((c) => c.title === selectedCertificate && c.provider === selectedProvider))
    return setCertError("This certification already exists");
  try {
    const response = await fetch(`${API}/api/add-certificate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "mukund", title: selectedCertificate, provider: selectedProvider }),
    });
    const data = await response.json();
    if (response.ok) {
      setCertifications([...certifications, { title: selectedCertificate, provider: selectedProvider }]);
      setSelectedProvider("");
      setSelectedCertificate("");
      setIsCertDialogVisible(false);
      setCertError("");

      // 📧 Send email notification
      await fetch(`${API}/api/sendCertificationNotification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certification: selectedCertificate, provider: selectedProvider, user: "mukund" }),
      });
    } else {
      setCertError(data.error || "Failed to add certificate");
    }
  } catch (err) {
    setCertError("Network error, please try again");
  }
};

 const addCourse = async () => {
  const { title, instructor, duration, category } = newCourse;
  if (!title.trim() || !instructor.trim() || !duration.trim()) return setCourseError("All fields required");
  if (courses.some((c) => c.title === title)) return setCourseError("Course already exists");
  try {
    const response = await fetch(`${API}/api/add-course`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "mukund", title, instructor, duration, category }),
    });
    const data = await response.json();
    if (response.ok) {
      setCourses([
        ...courses,
        { id: String(courses.length + 1), title, instructor, duration, description: "Newly added course", category, enrolled: false, progress: 0 },
      ]);
      setNewCourse({ title: "", instructor: "", duration: "", category: "technical" });
      setOpenCourse(false);
      setCourseError("");

      // 📧 Send email notification
      // 📧 Send email notification
await fetch(`${API}/api/sendCourseNotification`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title,
    instructor,
    duration,
    category,
    user: "mukund",
  }),
});

    } else {
      setCourseError(data.error || "Failed to add course");
    }
  } catch (err) {
    setCourseError("Network error, please try again");
  }
};

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-bold">Learning & Development</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside mb-3">
              {skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <Button className="w-full bg-purple-600 text-white" onClick={() => setOpenSkill(true)}>+ Add Skill</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside mb-3">
              {certifications.map((c, i) => <li key={i}>{c.title} - {c.provider}</li>)}
            </ul>
            <Button className="w-full bg-purple-600 text-white" onClick={() => setIsCertDialogVisible(true)}>+ Add Certification</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Courses</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside mb-3">
              {courses.map((c, i) => <li key={i}>{c.title} - {c.instructor}</li>)}
            </ul>
            <Button className="w-full bg-purple-600 text-white" onClick={() => setOpenCourse(true)}>+ Add Course</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openSkill} onOpenChange={setOpenSkill}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription>Enter the skill name and click Add to save.</DialogDescription>
          </DialogHeader>
          <Input placeholder="Skill" value={newSkill} onChange={(e) => { setNewSkill(e.target.value); setSkillError(""); }} />
          {skillError && <p className="text-red-500 text-sm mt-2">{skillError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenSkill(false)}>Cancel</Button>
            <Button onClick={addSkill}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openCourse} onOpenChange={setOpenCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>Fill out course details and click Add.</DialogDescription>
          </DialogHeader>
          <Input placeholder="Title" value={newCourse.title} onChange={(e) => { setNewCourse({ ...newCourse, title: e.target.value }); setCourseError(""); }} />
          <Input placeholder="Instructor" value={newCourse.instructor} onChange={(e) => { setNewCourse({ ...newCourse, instructor: e.target.value }); setCourseError(""); }} />
          <Input placeholder="Duration" value={newCourse.duration} onChange={(e) => { setNewCourse({ ...newCourse, duration: e.target.value }); setCourseError(""); }} />
          {courseError && <p className="text-red-500 text-sm mt-2">{courseError}</p>}
          <Select value={newCourse.category} onValueChange={(value) => setNewCourse({ ...newCourse, category: value as Course["category"] })}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenCourse(false)}>Cancel</Button>
            <Button onClick={addCourse}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCertDialogVisible} onOpenChange={setIsCertDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
            <DialogDescription>Select a provider and certificate.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Provider</label>
              <Select onValueChange={(v) => { setSelectedProvider(v); setCertError(""); }} value={selectedProvider}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a Provider" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(providers).map(provider => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Certificates</label>
              <Select onValueChange={(v) => { setSelectedCertificate(v); setCertError(""); }} value={selectedCertificate} disabled={!selectedProvider}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a Certificate" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider && providers[selectedProvider]?.map(cert => (
                    <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {certError && <p className="text-red-500 text-sm mt-2">{certError}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCertDialogVisible(false)}>Cancel</Button>
            <Button onClick={handleAddCertificationFromDialog}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningDevelopment;