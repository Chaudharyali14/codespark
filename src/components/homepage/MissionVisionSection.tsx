import MissionVisionCard from './MissionVisionCard';
import { FiTarget, FiEye } from 'react-icons/fi';

interface Mission {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Vision {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface MissionVisionSectionProps {
  missions: Mission[];
  visions: Vision[];
}

export default function MissionVisionSection({ missions, visions }: MissionVisionSectionProps) {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Mission & Vision</h2>
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Our Missions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {missions.map((mission) => (
                <MissionVisionCard
                  key={mission.id}
                  title={mission.title}
                  description={mission.description}
                  icon={<FiTarget className="text-indigo-600" size={24} />}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Our Visions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visions.map((vision) => (
                <MissionVisionCard
                  key={vision.id}
                  title={vision.title}
                  description={vision.description}
                  icon={<FiEye className="text-indigo-600" size={24} />}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
