import passport, { use } from "passport";
import { User } from "../models/User";
import { BasicStrategy } from "passport-http";
import {Request, Response, NextFunction } from "express";

const notAuthorizedJson = {status: 401, message:'Acesso não autorizado'};

passport.use(new BasicStrategy(async (email, password, done)=>{
 const user = await User.findOne({
    where:{email, password} 
 })
 if (user){
    return done(null, user);
    }
return done(notAuthorizedJson, false);

}));

export const privateRoute = (req:Request, res:Response, next:NextFunction)=>{
    passport.authenticate('basic', (err:any, user:any)=>{
      return user? next():next(notAuthorizedJson);
    })(req, res, next);
}

export default passport;