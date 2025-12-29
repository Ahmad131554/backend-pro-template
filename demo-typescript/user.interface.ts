import { IRole } from "./roleInterface";

export interface IUser {
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
  password: string;
  role: IRole;
}
