
import ProjectCard from './ProjectCard';

interface Project {
  id: number;
  title: string;
  description: string;
  mainImage: string | null;
  projectUrl: string | null;
}

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Our Recent Projects</h2>
          <p className="text-lg text-gray-600 mt-2">Check out some of our latest work.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} id={project.id} title={project.title} description={project.description} mainImage={project.mainImage} projectUrl={project.projectUrl} />
          ))}
        </div>
        <div className="text-center mt-12">
            <a href="/projects" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out">View All Projects</a>
        </div>
      </div>
    </section>
  );
}
