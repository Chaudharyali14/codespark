// src/app/courses/page.tsx
import prisma from '@/lib/prisma';
import CourseCard from '@/components/CourseCard';

async function getCourses() {
  try {
    const courses = await prisma.course.findMany();
    return courses;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="bg-background-primary text-text-primary-dark py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">Our Courses</h1>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                description={course.description}
                price={course.price}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">No courses found.</p>
        )}
      </div>
    </div>
  );
}
