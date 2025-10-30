import prisma from '@/lib/prisma';
import HeroSection from '@/components/homepage/HeroSection';
import ServicesSection from '@/components/homepage/ServicesSection';
import CoursesSection from '@/components/homepage/CoursesSection';
import ProjectsSection from '@/components/homepage/ProjectsSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import MissionVisionSection from '@/components/homepage/MissionVisionSection';

async function getHomepageData() {
  try {
    const siteSettings = await prisma.siteSettings.findFirst();
    const services = await prisma.service.findMany({ take: 3 });
    const courses = await prisma.course.findMany({ take: 3 });
    const projects = await prisma.project.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
    const testimonials = await prisma.testimonial.findMany({ take: 3 });
    const missions = await prisma.mission.findMany({ take: 3 });
    const visions = await prisma.vision.findMany({ take: 3 });

    return {
      siteSettings,
      services,
      courses,
      projects,
      testimonials,
      missions,
      visions,
    };
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    return {
      siteSettings: null,
      services: [],
      courses: [],
      projects: [],
      testimonials: [],
      missions: [],
      visions: [],
    };
  }
}

export default async function Home() {
  const data = await getHomepageData();

  return (
    <div className="min-h-screen bg-gray-100">
      {data.siteSettings && (
        <HeroSection
          title={data.siteSettings.heroTitle}
          subtitle={data.siteSettings.heroSubtitle}
          mainImage={data.siteSettings.heroImage1 || ''}
          secondImage={data.siteSettings.heroImage2 || ''}
        />
      )}

      {data.services && data.services.length > 0 && <ServicesSection services={data.services} />}

      {data.courses && data.courses.length > 0 && <CoursesSection courses={data.courses} />}

      {data.projects && data.projects.length > 0 && <ProjectsSection projects={data.projects} />}

      {data.testimonials && data.testimonials.length > 0 && <TestimonialsSection testimonials={data.testimonials} />}

      {data.missions && data.missions.length > 0 && data.visions && data.visions.length > 0 && (
        <MissionVisionSection missions={data.missions} visions={data.visions} />
      )}
    </div>
  );
}
