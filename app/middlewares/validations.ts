import {type Response ,type Request ,type NextFunction } from "express";
import expressAsyncHandler from 'express-async-handler';
import {validationResult} from "express-validator";
import createHttpError from 'http-errors';
import { createUser } from "../services/user";
import {create} from "../helper/validations/user";
export const validate=(validationName:string):any[]=>{
    switch(validationName){
        case "users:create":{
            return create;
        }
    }
}