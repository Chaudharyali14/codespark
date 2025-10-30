
'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (data) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  };

  const columns = ['Quote', 'Author', 'Role'];

  return (
    // This page is responsive because it uses the responsive AdminHeader and AdminTable components.
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Manage Testimonials" addHref="/admin/testimonials/create" />
      <AdminTable columns={columns} data={testimonials} editHrefBase="/admin/testimonials/edit" onDelete={handleDelete} />
    </div>
  );
}
