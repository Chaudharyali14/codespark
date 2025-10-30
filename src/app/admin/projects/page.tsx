
'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';

interface Project {
  id: number;
  title: string;
  description: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(projects.filter((project) => project.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const columns = ['Title', 'Description'];

  const data = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
  }));

  return (
    // This page is responsive because it uses the responsive AdminHeader and AdminTable components.
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Manage Projects" addHref="/admin/projects/create" />
      <AdminTable columns={columns} data={data} editHrefBase="/admin/projects/edit" onDelete={handleDelete} />
    </div>
  );
}
