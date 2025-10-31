// src/app/services/page.tsx
import prisma from '@/lib/prisma';
import ServiceCard from '@/components/ServiceCard';

export const dynamic = 'force-dynamic';

interface Service {
  id: number;
  title: string;
  description: string;
}

async function getServices(): Promise<Service[]> {
  const services = await prisma.service.findMany();
  return services;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-background-primary text-text-primary-dark py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: Service) => (
            <ServiceCard key={service.id} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </div>
  );
}
