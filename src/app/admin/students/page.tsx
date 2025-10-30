
'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: {
    name: string;
  };
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (data) {
          setStudents(data);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStudents(students.filter((student) => student.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  const columns = ['Name', 'Email', 'Phone', 'Course'];

  const data = students.map((student) => ({
    ...student,
    course: student.course.name,
  }));

  const exportToExcel = () => {
    const csvContent = [
      columns.join(','),
      ...data.map(row => [row.name, row.email, row.phone, row.course].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'students.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // This page is responsive because it uses the responsive AdminHeader and AdminTable components.
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Manage Students" addHref="/admin/students/create" onExport={exportToExcel} />
      <AdminTable columns={columns} data={data} editHrefBase="/admin/students/edit" onDelete={handleDelete} />
    </div>
  );
}
