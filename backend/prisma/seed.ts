import { PERMISSIONS } from '../src/constant/permissions';
import prisma from '../src/config/db';
import { hashPassword } from '../src/utils/bcrypt';

const ALLPERMISSION = Object.values(PERMISSIONS);
const USERPERMISSSION = [PERMISSIONS.VIEW_HOTEL,PERMISSIONS.VIEW_ROOM,PERMISSIONS.CANCEL_BOOKING,PERMISSIONS.VIEW_MY_BOOKING, PERMISSIONS.ADD_BOOKiNG];

async function main(){
    // seed permission
    const permissions = await Promise.all(
        ALLPERMISSION.map((permission:string)=>
            prisma.permission.upsert({
                where:{name:permission},
                update:{},
                create:{name:permission}
            })
        )
    )

    //seed Admin
    const adminRole = await prisma.role.upsert({
        where:{name:"admin"},
        update:{},
        create:{name:"admin"}
    })

    // seed  user
    const userRole = await prisma.role.upsert({
        where:{name:"user"},
        update:{},
        create:{name:"user"}
    })


    //assign permissions to the role
    for(const permission of permissions){
        await prisma.rolePermission.upsert({
            where:{roleId_permissionId:{
                roleId:adminRole.id,
                permissionId:permission.id
            }},
            update:{},
            create:{
                roleId:adminRole.id,
                permissionId:permission.id
            }
        })
    }

    const userPermissions = permissions.filter((permission:any)=>USERPERMISSSION.includes(permission.name))
    for(const userPermission of userPermissions){
        await prisma.rolePermission.upsert({
            where:{
                roleId_permissionId:{
                    roleId: userRole.id,
                    permissionId:userPermission.id
                }
            },
            update:{},
            create:{
                roleId: userRole.id,
                permissionId:userPermission.id
            }
        })
    }
//create default admin
    const adminPassword = await hashPassword("admin@123")
    await prisma.user.upsert({
        where:{
            email:"admin@example.com",
        },
        update:{},
        create:{
            email:"admin@example.com",
            password:adminPassword,
            roleId:adminRole.id
        }
    })

    console.log("Seeder run successfully")
}

main().catch((error:any)=>console.log(error)).finally(async()=>prisma.$disconnect())