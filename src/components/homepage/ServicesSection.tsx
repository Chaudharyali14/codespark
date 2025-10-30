
import ServiceCard from './ServiceCard';

interface Service {
  id: number;
  title: string;
  description: string;
}

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Our Services</h2>
          <p className="text-lg text-gray-600 mt-2">We offer a wide range of services to help you achieve your goals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
