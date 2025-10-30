
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 mt-2">We are trusted by the world's best companies.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} quote={testimonial.quote} author={testimonial.author} role={testimonial.role} />
          ))}
        </div>
      </div>
    </section>
  );
}
