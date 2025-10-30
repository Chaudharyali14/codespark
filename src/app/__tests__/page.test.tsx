import { render, screen } from '@testing-library/react';
import HomePage from '../page';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  siteSettings: {
    findFirst: jest.fn(),
  },
  service: {
    findMany: jest.fn(),
  },
  course: {
    findMany: jest.fn(),
  },
  project: {
    findMany: jest.fn(),
  },
  testimonial: {
    findMany: jest.fn(),
  },
  mission: {
    findMany: jest.fn(),
  },
  vision: {
    findMany: jest.fn(),
  },
}));

describe('HomePage', () => {
  it('renders the homepage with all sections', async () => {
    const siteSettings = {
      heroTitle: 'Test Hero Title',
      heroSubtitle: 'Test Hero Subtitle',
      heroImage1: '/hero1.png',
      heroImage2: '/hero2.png',
    };
    const services = [{ id: 1, title: 'Test Service', description: 'Test description' }];
    const courses = [{ id: 1, name: 'Test Course', description: 'Test description', price: 100 }];
    const projects = [{ id: 1, title: 'Test Project', description: 'Test description' }];
    const testimonials = [{ id: 1, quote: 'Test Testimonial', author: 'Test Author', role: 'Test role' }];
    const missions = [{ id: 1, title: 'Test Mission', description: 'Test description' }];
    const visions = [{ id: 1, title: 'Test Vision', description: 'Test description' }];

    (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue(siteSettings);
    (prisma.service.findMany as jest.Mock).mockResolvedValue(services);
    (prisma.course.findMany as jest.Mock).mockResolvedValue(courses);
    (prisma.project.findMany as jest.Mock).mockResolvedValue(projects);
    (prisma.testimonial.findMany as jest.Mock).mockResolvedValue(testimonials);
    (prisma.mission.findMany as jest.Mock).mockResolvedValue(missions);
    (prisma.vision.findMany as jest.Mock).mockResolvedValue(visions);

    render(await HomePage());

    expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Testimonial')).toBeInTheDocument();
    expect(screen.getByText('Test Mission')).toBeInTheDocument();
    expect(screen.getByText('Test Vision')).toBeInTheDocument();
  });
});
