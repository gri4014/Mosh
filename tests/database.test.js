import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    // Test create operation
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'test-hash',
        fullName: 'Test User'
      },
    });
    console.log('✓ Create operation successful:', user.id);

    // Test read operation
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    console.log('✓ Read operation successful:', foundUser.email);

    // Test update operation
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { fullName: 'Updated Test User' },
    });
    console.log('✓ Update operation successful:', updatedUser.fullName);

    // Test relationship creation
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: 'BASELINE',
        monthlyAmount: 30.00,
        startDate: new Date(),
        status: 'ACTIVE'
      },
    });
    console.log('✓ Relationship creation successful:', subscription.id);

    // Test relationship query
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscriptions: true },
    });
    console.log('✓ Relationship query successful:', userWithSubscription.subscriptions.length === 1);

    // Cleanup: Delete test data
    await prisma.subscription.deleteMany({
      where: { userId: user.id },
    });
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log('✓ Delete operations successful');

    console.log('\n✅ All database operations completed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection().catch(console.error);
