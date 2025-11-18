import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import API from "@/config";
interface Course {
  _id?: string;
  id?: number;
  title?: string;
  name?: string;
  description?: string;
  instructor?: string;
  duration?: string;
  price?: number;
  progress?: number;
  addedBy?: string;
  addedByEmail?: string;
  createdAt?: string;
}


const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [newCourse, setNewCourse] = useState({ 
    title: "", 
    progress: 0,
    description: "",
    instructor: "",
    duration: "",
    price: "",
    addedBy: "",
    addedByEmail: ""
  });

  const API_BASE_URL = typeof window !== 'undefined' && import.meta.env?.VITE_API_URL 
    ? import.meta.env.VITE_API_URL 
    : 'http://52.66.248.236:8000';

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((course: any) => ({
          ...course,
          id: course._id,
          title: course.name,
          progress: 0
        }));
        setCourses(formatted);
      }
    } catch (error) {
      console.log("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddCourse = async () => {
    if (!newCourse.title) {
      setMessage({ type: 'error', text: 'Course title is required' });
      return;
    }

    if (newCourse.addedByEmail && !isValidEmail(newCourse.addedByEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Add course to backend
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCourse.title,
          description: newCourse.description || 'No description provided',
          instructor: newCourse.instructor || 'Unknown',
          duration: newCourse.duration || 'Not specified',
          price: newCourse.price ? Number(newCourse.price) : 0,
          addedBy: newCourse.addedBy || 'Anonymous',
          addedByEmail: newCourse.addedByEmail || ''
        })
      });

      if (!response.ok) throw new Error("Failed to add course");

      await fetchCourses(); // Refresh list

      // Send email notification
      try {
        const notify = await fetch(`${API_BASE_URL}/api/sendCourseNotification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName: newCourse.title,
            userEmail: newCourse.addedByEmail || 'noreply@securekloud.com',
            userName: newCourse.addedBy || 'Anonymous'
          })
        });

        const emailData = await notify.json();

        if (notify.ok && emailData.success) {
          setMessage({ type: 'success', text: `✅ Course "${newCourse.title}" added and emails sent!` });
        } else {
          setMessage({ type: 'success', text: `✅ Course added! ⚠️ But email failed: ${emailData.error || 'unknown error'}` });
        }
      } catch (emailErr) {
        console.error(emailErr);
        setMessage({ type: 'success', text: `✅ Course added! ⚠️ Email could not be sent.` });
      }

      setNewCourse({ title: "", progress: 0, description: "", instructor: "", duration: "", price: "", addedBy: "", addedByEmail: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "❌ Failed to add course." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{course.title || course.name}</CardTitle>
                <CardDescription>
                  {course.progress === 100 ? "Completed" : "In Progress"}
                  {course.instructor && ` • Instructor: ${course.instructor}`}
                  {course.duration && ` • Duration: ${course.duration}`}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge>{course.progress}%</Badge>
                {course.price && <Badge variant="secondary">${course.price}</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {course.description && (
              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
            )}
            <Progress value={course.progress} className="h-2" />
            <Button className="mt-4">
              {course.progress === 100 ? "Review Course" : "Continue Learning"}
            </Button>
            {course.addedBy && (
              <p className="text-xs text-gray-500 mt-2">
                Added by {course.addedBy}
                {course.createdAt && ` on ${new Date(course.createdAt).toLocaleDateString()}`}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 text-white">
          Add Course
        </Button>
      )}

      {showForm && (
        <Card className="p-4 space-y-4">
          <CardTitle>Add a New Course</CardTitle>
          <Input placeholder="Course Title *" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
          <Input type="number" placeholder="Progress %" value={newCourse.progress} onChange={(e) => setNewCourse({ ...newCourse, progress: +e.target.value })} />
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Optional: Email Notification Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Instructor" value={newCourse.instructor} onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} />
              <Input placeholder="Duration" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input type="number" placeholder="Price" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} />
              <Input placeholder="Your Name" value={newCourse.addedBy} onChange={(e) => setNewCourse({ ...newCourse, addedBy: e.target.value })} />
            </div>

            <Input className="mt-4" placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
            <Input className="mt-4" type="email" placeholder="Your Email (optional)" value={newCourse.addedByEmail} onChange={(e) => setNewCourse({ ...newCourse, addedByEmail: e.target.value })} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddCourse} className="bg-green-600 text-white" disabled={loading}>
              {loading ? 'Adding...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyCourses;
