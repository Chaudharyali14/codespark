
import { FiBox } from 'react-icons/fi';

interface ServiceCardProps {
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-indigo-600 transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 p-3 rounded-full">
            <FiBox className="text-indigo-600" size={24} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 ml-4">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
