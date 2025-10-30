'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Course {
  id: number;
  name: string;
}

const StudentForm = () => {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch available courses to populate the dropdown
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Pre-select course if courseId is in the URL
    const urlCourseId = searchParams.get('courseId');
    if (urlCourseId) {
      setCourseId(urlCourseId);
    }
  }, [searchParams, courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    if (!courseId) {
      setStatus('Please select a course.');
      return;
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, courseId: parseInt(courseId) }),
      });

      if (response.ok) {
        setStatus('Application submitted successfully!');
        setName('');
        setEmail('');
        setPhone('');
        setCourseId('');
      } else {
        const data = await response.json();
        setStatus(data.error || 'Failed to submit application.');
      }
    } catch {
      setStatus('An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg border border-border-subtle" data-testid="student-form">
      <h2 className="text-3xl font-bold text-primary mb-6">Apply for a Course</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-neutral-dark font-semibold mb-2">Full Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary-light" />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-neutral-dark font-semibold mb-2">Email Address</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary-light" />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-neutral-dark font-semibold mb-2">Phone Number (Optional)</label>
        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary-light" />
      </div>

      <div className="mb-6">
        <label htmlFor="course" className="block text-neutral-dark font-semibold mb-2">Select a Course</label>
        <select id="course" value={courseId} onChange={(e) => setCourseId(e.target.value)} required className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary text-text-primary-light">
          <option value="" disabled>Please select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="w-full bg-primary text-text-primary-dark font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-all">
        Submit Application
      </button>

      {status && <p className="mt-4 text-center text-text-primary-light">{status}</p>}
    </form>
  );
};

export default StudentForm;
