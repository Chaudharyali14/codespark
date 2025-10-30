'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';

interface Course {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCourses(courses.filter((course) => course.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const columns = ['Name', 'Description', 'Price'];

  const data = courses.map((course) => ({
    id: course.id,
    name: course.name,
    description: course.description,
    price: course.price,
  }));

  return (
    // This page is responsive because it uses the responsive AdminHeader and AdminTable components.
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Manage Courses" addHref="/admin/courses/create" />
      <AdminTable columns={columns} data={data} editHrefBase="/admin/courses/edit" onDelete={handleDelete} />
    </div>
  );
}
