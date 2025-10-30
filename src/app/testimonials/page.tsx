
'use client';

import { useState, useEffect } from 'react';
import TestimonialCard from '@/components/TestimonialCard';

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
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-light">
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
