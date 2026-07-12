import { AuthUser } from '../modules/auth/auth.types';
declare global{
namespace Express{
    interface Request{
         user? : AuthUser;
    }
}
}
export {}