import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getMissionData() {
  const mission = await prisma.mission.findFirst();
  return mission;
}

export default async function MissionPage() {
  const mission = await getMissionData();

  if (!mission) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{mission.title}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{mission.description}</p>
        </div>
      </div>
    </div>
  );
}
