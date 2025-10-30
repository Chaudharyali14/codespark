import { render, screen } from '@testing-library/react';
import CoursesPage from '../page';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  course: {
    findMany: jest.fn(),
  },
}));

describe('CoursesPage', () => {
  it('renders the courses page with a list of courses', async () => {
    const courses = [
      {
        id: 1,
        name: 'Test Course 1',
        description: 'This is a test course.',
        price: 100,
      },
      {
        id: 2,
        name: 'Test Course 2',
        description: 'This is another test course.',
        price: 200,
      },
    ];

    (prisma.course.findMany as jest.Mock).mockResolvedValue(courses);

    render(await CoursesPage());

    expect(screen.getByText('Our Courses')).toBeInTheDocument();
    expect(screen.getByText('Test Course 1')).toBeInTheDocument();
    expect(screen.getByText('Test Course 2')).toBeInTheDocument();
  });
});
