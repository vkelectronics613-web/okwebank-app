const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('--- Users ---');
  users.forEach(u => {
    console.log(`${u.username} (${u.upi_id}): ${u.balance} WBC`);
  });

  const txs = await prisma.transaction.findMany({ take: 5, orderBy: { timestamp: 'desc' } });
  console.log('\n--- Recent Transactions ---');
  txs.forEach(t => {
    console.log(`${t.from_upi} -> ${t.to_upi}: ${t.amount} (${t.status})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
