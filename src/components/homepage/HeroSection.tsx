
import HeroImage from './HeroImage';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  mainImage: string;
  secondImage: string;
}

export default function HeroSection({ title, subtitle, mainImage, secondImage }: HeroSectionProps) {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{title}</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">{subtitle}</p>
            <div className="flex space-x-4">
              <a href="/apply" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out">Apply Now</a>
              <a href="/courses" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out">View Courses</a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <HeroImage mainImage={mainImage} secondImage={secondImage} />
          </div>
        </div>
      </div>
    </section>
  );
}
