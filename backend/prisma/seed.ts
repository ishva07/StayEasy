import prisma from "../src/config/db";
import { seedAmenities } from "./seeds/amenitiesSeed";
import { seedPropertyTypes } from "./seeds/propertyTypeSeed";
import { seedRolePermissions } from "./seeds/rolePermissionSeed";

async function main(){
    await seedRolePermissions();
    await seedPropertyTypes();
    await seedAmenities();
}

main().catch((error)=>console.log(error)).finally(async()=> await prisma.$disconnect()) 