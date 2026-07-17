import { AMENITIES } from '../src/constant/amenities';
import prisma from '../src/config/db';

const AllAmenities = Object.values(AMENITIES);

async function main(){
    const amenities = await Promise.all(
        AllAmenities.map((amenity:string)=>{
              return prisma.amenities.upsert({
                where:{name:amenity},
                update:{},
                create:{name:amenity}
            })
        }
          
        )
    );

    console.log("Amenities added successfully.",amenities)
}

main().catch((error)=>console.log(error)).finally(async()=>prisma.$disconnect())