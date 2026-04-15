import prisma from '../src/config/db.js';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

try {
  // Only truncate table in development
  if (isDev) {
    await prisma.$queryRaw`TRUNCATE tasks RESTART IDENTITY;`;
    console.log('Development: tasks table truncated.');
  }
  const count = await prisma.task.count();

  if (count === 0) {
    await prisma.task.createMany({
      data: [
        { title: 'Set up project repository', completed: true },
        { title: 'Install dependencies', completed: true },
        { title: 'Create Task model', completed: false },
      ],
    });

    console.log('Database seeded successfully!');
  } else {
    console.log('Database already contains data. Skipping seed.');
  }
} catch (error) {
  console.error('Seed failed:', error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
