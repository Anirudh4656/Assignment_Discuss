import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { type IUser, UserRole } from "../schemas/User";
import createHttpError from "http-errors";
import process from "process";

//check code
export const roleAuth = (
  roles: UserRole | UserRole[],
  publicRoutes: string[] = []
): any =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (publicRoutes.includes(req.path)) {
        next();
        // console.log("in public");
        return;
      }
      //?
      console.log("why admin");
      let token = req.headers["authorization"]?.replace("Bearer ", "");
      console.log("token",token)
      // console.log("authorization token",token1);
      //logic for handling admin portel
      //   // Handle the case where the authorization header might be an array
      //   if (Array.isArray(token)) {
      //     token = token[0];
      //   }
      //   token = token.replace('Bearer ', '');
      //   const token = req.headers["Authorization"]?.replace('Bearer ', '');

      // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiZW1haWwiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwidXNlcm5hbWUiOiJpbml0Iiwicm9sZSI6ImluaXQiLCJpc0Jsb2NrZWQiOiJpbml0IiwiX2lkIjoiaW5pdCIsIl9fdiI6ImluaXQifSwic3RhdGVzIjp7InJlcXVpcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfaWQiOnRydWUsInVzZXJuYW1lIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwiZW1haWwiOnRydWUsInJvbGUiOnRydWUsImlzQmxvY2tlZCI6dHJ1ZSwiX192Ijp0cnVlfX19LCJza2lwSWQiOnRydWV9LCIkaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9pZCI6IjY2NzI3NDM5YTcxYjZiZTU5NjZhNTUwNyIsInVzZXJuYW1lIjoiYXNkZXRydHIiLCJwYXNzd29yZCI6IiQyYiQxMiRJM00wSmZKTGMuUk01dzFMUW93djJPd2ZXYmN0NzM3RThyaldqTy95SmQ5TjQxM01KSENMUyIsImVtYWlsIjoiYWlydWRoQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaXNCbG9ja2VkIjpmYWxzZSwiX192IjowfSwiaWF0IjoxNzE4Nzc3MDg0fQ.spQtCwHky2iBS6bBh01pDzGEwLxhL928hWtYOCnZvCs"
      if (!token) {
        throw createHttpError(401, {
          message: `Invalid token`,
        });
      }
      console.log("in verified", token);

      const decodedUser = jwt.verify(token!, "dghfghghjghjghjghj"!) as IUser;
      //req.user?

      req.user = decodedUser;

      console.log("decode check middleware", req.user);

      // req.userId=decodedUser._id as IUser;

      //   const user = req.user as IUser;
      //   if (user.role == null || !Object.values(UserRole).includes(user.role)) {
      //     throw createHttpError(401, { message: "Invalid user role" });
      //   }
      //   if (!roles.includes(user.role)) {
      //     const type =
      //       user.role.slice(0, 1) + user.role.slice(1).toLocaleLowerCase();

      //     throw createHttpError(401, {
      //       message: `${type} can not access this resource`,
      //     });
      //   }
      next();
    }
  );
