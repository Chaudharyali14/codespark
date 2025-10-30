import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  media: { type: string; url: string } | null;
  projectUrl: string | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, media, projectUrl }) => {
  return (
    <Link href={`/portfolio/${id}`} className="block bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
      {media && (
        <div className="relative h-48">
          {media.type === 'IMAGE' ? (
            <Image
              src={media.url}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <video
              src={media.url}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-neutral-dark mb-4 truncate">{description}</p>
        {projectUrl && (
          <span className="text-accent-1 hover:underline">
            View Project
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;