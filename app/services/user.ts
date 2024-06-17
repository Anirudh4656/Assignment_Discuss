import User, { IUser, UserRole } from "../schemas/User";
export const createUser = async (data: {
    email: string;
    role: UserRole;
    password: string;
  }) => {
    const user = await User.create({ ...data, active: true });
    return user;
  };
  