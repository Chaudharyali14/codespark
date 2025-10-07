import Link from 'next/link';

interface CourseCardProps {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ id, name, description, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-border-subtle flex flex-col transition-shadow hover:shadow-xl">
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-bold text-primary mb-2">{name}</h3>
        <p className="text-neutral-dark mb-4">{description || 'No description available.'}</p>
      </div>
      <div className="p-6 bg-neutral-light flex justify-between items-center">
        <p className="text-2xl font-bold text-primary">Pkr {price.toFixed()}</p>
        <Link href={`/apply?courseId=${id}`} className="bg-primary text-text-primary-dark font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-all">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
