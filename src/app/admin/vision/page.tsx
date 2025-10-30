'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';

interface Vision {
  id: number;
  title: string;
  description: string;
}

export default function VisionPage() {
  const [visions, setVisions] = useState<Vision[]>([]);

  useEffect(() => {
    const fetchVisions = async () => {
      try {
        const res = await fetch('/api/vision');
        const data = await res.json();
        if (data) {
          setVisions(data);
        }
      } catch (error) {
        console.error('Failed to fetch visions:', error);
      }
    };
    fetchVisions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/vision/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setVisions(visions.filter((vision) => vision.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete vision:', error);
    }
  };

  const columns = ['Title', 'Description'];

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Manage Visions" addHref="/admin/vision/create" />
      <AdminTable columns={columns} data={visions} editHrefBase="/admin/vision/edit" onDelete={handleDelete} />
    </div>
  );
}
