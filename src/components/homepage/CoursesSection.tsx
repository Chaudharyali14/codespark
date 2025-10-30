
import CourseCard from './CourseCard';

interface Course {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

interface CoursesSectionProps {
  courses: Course[];
}

export default function CoursesSection({ courses }: CoursesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Our Popular Courses</h2>
          <p className="text-lg text-gray-600 mt-2">Choose from a wide range of courses and take the next step in your career.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} id={course.id} name={course.name} description={course.description} price={course.price} />
          ))}
        </div>
      </div>
    </section>
  );
}
