'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';

interface Mission {
  id: number;
  title: string;
  description: string;
}

export default function MissionPage() {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch('/api/mission');
        const data = await res.json();
        if (data) {
          setMissions(data);
        }
      } catch (error) {
        console.error('Failed to fetch missions:', error);
      }
    };
    fetchMissions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/mission/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMissions(missions.filter((mission) => mission.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete mission:', error);
    }
  };

  const columns = ['Title', 'Description'];

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Manage Missions" addHref="/admin/mission/create" />
      <AdminTable columns={columns} data={missions} editHrefBase="/admin/mission/edit" onDelete={handleDelete} />
    </div>
  );
}
