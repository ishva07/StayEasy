import prisma from '../src/config/db';

const userNameMap: Record<string, { firstName: string; lastName: string }> = {
  "admin@example.com": { firstName: "Admin", lastName: "User" },
  "ishva@gmail.com": { firstName: "Ishva", lastName: "Patel" },
  "aarav.sharma@gmail.com": { firstName: "Aarav", lastName: "Sharma" },
  "vivaan.patel@yahoo.com": { firstName: "Vivaan", lastName: "Patel" },
  "aditya.reddy@outlook.com": { firstName: "Aditya", lastName: "Reddy" },
  "kabir.mehta@gmail.com": { firstName: "Kabir", lastName: "Mehta" },
  "ananya.singh@yahoo.com": { firstName: "Ananya", lastName: "Singh" },
  "diya.iyer@gmail.com": { firstName: "Diya", lastName: "Iyer" },
  "saanvi.nair@outlook.com": { firstName: "Saanvi", lastName: "Nair" },
  "myra.joshi@gmail.com": { firstName: "Myra", lastName: "Joshi" },
  "aarohi.verma@yahoo.com": { firstName: "Aarohi", lastName: "Verma" },
  "reyansh.kapoor@gmail.com": { firstName: "Reyansh", lastName: "Kapoor" },
  "vihaan.rao@gmail.com": { firstName: "Vihaan", lastName: "Rao" },
  "aanya.desai@outlook.com": { firstName: "Aanya", lastName: "Desai" },
  "kiara.menon@gmail.com": { firstName: "Kiara", lastName: "Menon" },
  "arjun.chauhan@yahoo.com": { firstName: "Arjun", lastName: "Chauhan" },
  "ishaan.gupta@gmail.com": { firstName: "Ishaan", lastName: "Gupta" },
};

async function backfillUserNames() {
  let updated = 0;
  let skipped = 0;

  for (const [email, names] of Object.entries(userNameMap)) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.warn(`No user found for ${email}, skipping.`);
      skipped++;
      continue;
    }

    if (user.firstName && user.lastName) {
      console.log(`${email} already has names, skipping.`);
      skipped++;
      continue;
    }

    await prisma.user.update({
      where: { email },
      data: { firstName: names.firstName, lastName: names.lastName },
    });
    console.log(`Updated ${email} -> ${names.firstName} ${names.lastName}`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

backfillUserNames()
  .catch((err) => {
    console.error("Backfill failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });