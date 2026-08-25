import prisma from "../src/config/db";
import { seedAmenities } from "./amenitiesSeed";
import { seedUser } from "./userSeed";

async function main() {
  await seedUser();
  await seedAmenities();
}

main()
  .catch((error) => console.log(error))
  .finally(async () => await prisma.$disconnect());
