
import express, {type Express ,type Request,type Response} from "express";
import dotenv from 'dotenv';
import {initDb} from "./app/services/initDB";
import bodyParser from "body-parser";
import * as http from 'http';
import { IUser, UserRole } from "./app/schemas/User";
import userRoutes from "./app/routes/authRoutes";
import discussionRoutes from "./app/routes/discussionRoutes"
import adminRoutes from "./app/routes/adminRoutes";
import { initPassport } from "./app/services/passport-jwt";
import { roleAuth } from "./app/middlewares/roleAuth";
import cors from "cors";
import errorHandler from "./app/middlewares/errorHandler";
const app:Express=express();
const router  =express.Router;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port= 5000;
dotenv.config();
declare global{
    namespace Express{
        interface User extends Omit<IUser,"password">{}
        interface Request {
            user?:User;
            userId?:User;
        }
    }
}

const initApp=async():Promise<void>=>{
   initDb();
   app.use(errorHandler);
  initPassport();
    app.get('/',(req:Request,res:Response)=>{
        res.send({status:"ok"});
    });
    app.use('/api',userRoutes);
   
    app.use('/api',roleAuth(UserRole.USER,['/getDiscussion']), discussionRoutes);
    app.use('/api/admin',roleAuth(UserRole.ADMIN),adminRoutes);

   
    http.createServer(app).listen(port,()=>{
        console.log("server is running",port);
    });
}
initApp();
