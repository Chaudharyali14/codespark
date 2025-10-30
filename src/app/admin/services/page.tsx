'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';

interface Service {
  id: number;
  title: string;
  description: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setServices(services.filter((service) => service.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const columns = ['Title', 'Description'];

  const data = services.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Manage Services" addHref="/admin/services/create" />
      <AdminTable columns={columns} data={data} editHrefBase="/admin/services/edit" onDelete={handleDelete} />
    </div>
  );
}
