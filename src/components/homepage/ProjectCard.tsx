import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  mainImage: string | null;
  projectUrl: string | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, mainImage, projectUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
        <Link href={`/portfolio/${id}`} className="block">
            <div className="relative h-60">
                {mainImage ? (
                    <Image
                    src={mainImage}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No Image</p>
                    </div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-4 truncate">{description}</p>
                <span className="text-indigo-600 hover:underline font-semibold">
                    Learn More
                </span>
            </div>
        </Link>
    </div>
  );
};

export default ProjectCard;
