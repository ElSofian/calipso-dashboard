import { prisma } from '@/lib/prisma';

async function testCreate() {
  const session = await prisma.session.create({
    data: {
      id: 'test_case_s1',
      userId: 'cm9rf9z3l0000fxt27m2z9782',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  console.log("💾 Session créée via Prisma:", session);
}

testCreate();