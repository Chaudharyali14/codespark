
import { ReactNode } from 'react';

interface MissionVisionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const MissionVisionCard: React.FC<MissionVisionCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 h-full">
        <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 ml-4">{title}</h3>
        </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default MissionVisionCard;
