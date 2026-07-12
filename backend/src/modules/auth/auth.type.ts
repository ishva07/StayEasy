export interface RegisterUserInterface {
  email: string;
  password: string;
  roleId: string;
}

export interface LoginUserInterface {
  email: string;
  password: string;
  roleId: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roleId: string;
  role: {
    name: string;
    permissions: {
        permission:{
            id:string;
            name:string;
        }
    }[];
  };
}
