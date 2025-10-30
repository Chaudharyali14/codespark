
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRelativeTime } from '@/lib/utils';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';

interface Message {
  id: number;
  name: string;
  createdAt: Date;
}

interface Student {
  id: number;
  name: string;
  createdAt: Date;
}

interface Project {
  id: number;
  title: string;
  createdAt: Date;
}

interface Course {
  id: number;
  name: string;
  createdAt: Date;
}

interface Activity {
  id: string;
  description: string;
  time: string;
  createdAt: Date;
}

export const GET = withErrorHandler(async () => {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  if (!messages || !students || !projects || !courses) {
    throw new DatabaseError('Failed to fetch activity data');
  }

  const activities: Activity[] = [];

  messages.forEach((msg: Message) => {
    activities.push({
      id: `msg-${msg.id}`,
      description: `New message from: ${msg.name}`,
      time: getRelativeTime(msg.createdAt),
      createdAt: msg.createdAt,
    });
  });

  students.forEach((stu: Student) => {
    activities.push({
      id: `stu-${stu.id}`,
      description: `New student enrolled: ${stu.name}`,
      time: getRelativeTime(stu.createdAt),
      createdAt: stu.createdAt,
    });
  });

  projects.forEach((proj: Project) => {
    activities.push({
      id: `proj-${proj.id}`,
      description: `New project added: ${proj.title}`,
      time: getRelativeTime(proj.createdAt),
      createdAt: proj.createdAt,
    });
  });

  courses.forEach((course: Course) => {
    activities.push({
      id: `course-${course.id}`,
      description: `New course added: ${course.name}`,
      time: getRelativeTime(course.createdAt),
      createdAt: course.createdAt,
    });
  });

  activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return NextResponse.json(activities.slice(0, 4));
});
