import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

interface PortfolioPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: { media: true },
  });

  if (!project) {
    notFound();
  }

  return project;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Project Header */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/projects"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← Back to Projects
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
            <p className="text-lg text-gray-600 mb-8">{project.description}</p>

            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Live Project
              </a>
            )}
          </div>

          {/* Media Gallery */}
          {project.media && project.media.length > 0 && (
            <div className="px-8 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.media.map((media) => (
                  <div key={media.id} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {media.type === 'IMAGE' ? (
                      <Image
                        src={media.url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-full object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PortfolioPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  return {
    title: `${project.title} | CodeSpark Portfolio`,
    description: project.description,
  };
}
