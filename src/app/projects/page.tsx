'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';

interface Media {
  type: 'IMAGE' | 'VIDEO';
  url: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  mainImage: string;
  media: Media[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Projects Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                media={{ type: 'IMAGE', url: project.mainImage }}
                projectUrl={`/projects/${project.id}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}