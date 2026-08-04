import { PROPERTYTYPE } from '../src/constant/propertyType';
import prisma from '../src/config/db';

const allPropertyTypes = Object.values(PROPERTYTYPE)

export async function main(){
    const propertyType = await Promise.all(
        allPropertyTypes.map((property)=>(
            prisma.propertyType.upsert({
                where:{name:property.name},
                update:{image:property.image},
                create:{name:property.name,image:property.image}
            })
        ))
    )

    console.log("Property type added successfully",propertyType)
}

main().catch((error)=>console.log(error)).finally(async()=>await prisma.$disconnect());