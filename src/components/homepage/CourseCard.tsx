
import Link from 'next/link';
import { FiBookOpen } from 'react-icons/fi';

interface CourseCardProps {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ id, name, description, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <div className="p-8 grow">
        <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
                <FiBookOpen className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 ml-4">{name}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description || 'No description available.'}</p>
      </div>
      <div className="p-6 bg-gray-50 flex justify-between items-center">
        <p className="text-2xl font-bold text-indigo-600">Pkr {price.toFixed()}</p>
        <Link href={`/apply?courseId=${id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300 ease-in-out">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
