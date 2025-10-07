import CourseCard from '@/components/CourseCard';
import MissionCard from '@/components/MissionCard';
import VisionCard from '@/components/VisionCard';
import ProjectCard from '@/components/ProjectCard';
import ServiceCard from '@/components/ServiceCard';
import StudentForm from '@/components/StudentForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="bg-primary text-text-primary-dark py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-xl">Discover courses, projects, and more.</p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Our Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard id={1} name="Web Development" description="Learn to build modern web applications." price={5000} />
            <CourseCard id={2} name="Data Science" description="Master data analysis and machine learning." price={7000} />
            <CourseCard id={3} name="Mobile App Development" description="Create apps for iOS and Android." price={6000} />
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary-dark mb-8 text-center">Our Mission & Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MissionCard title="Our Mission" description="To provide quality education and empower learners worldwide." />
            <VisionCard title="Our Vision" description="To be the leading platform for innovative learning experiences." />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              id={1}
              title="E-commerce Website"
              description="A full-stack e-commerce platform built with Next.js."
              media={{ type: 'IMAGE', url: '/next.svg' }}
              projectUrl="https://example.com"
            />
            <ProjectCard
              id={2}
              title="Data Dashboard"
              description="Interactive dashboard for data visualization."
              media={null}
              projectUrl="https://example.com"
            />
            <ProjectCard
              id={3}
              title="Mobile App"
              description="Cross-platform mobile application."
              media={{ type: 'IMAGE', url: '/vercel.svg' }}
              projectUrl="https://example.com"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary-dark mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard title="Consulting" description="Expert advice on technology solutions." />
            <ServiceCard title="Development" description="Custom software development services." />
            <ServiceCard title="Training" description="Workshops and training programs." />
          </div>
        </div>
      </section>

      {/* Student Form Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <StudentForm />
          </div>
        </div>
      </section>
    </div>
  );
}
