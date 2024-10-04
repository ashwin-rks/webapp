import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingDepartment = await prisma.department.findFirst({
    where: {
      dept_name: {
        equals: 'Manager',
        mode: 'insensitive', 
      },
    },
  });

  if (existingDepartment) {
    console.log('Department "Manager" already exists');
  } else {
    await prisma.department.create({
      data: {
        dept_name: 'Manager',
      },
    });
    console.log('Department "Manager" created successfully');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
