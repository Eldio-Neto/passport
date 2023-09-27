import passport, { use } from "passport";
import { User } from "../models/User";
import { BasicStrategy } from "passport-http";
import { Request, Response, NextFunction } from "express";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import dotenv from 'dotenv';
const jwt = require('jsonwebtoken');
dotenv.config();

const notAuthorizedJson = { status: 401, message: 'Acesso não autorizado' };
/* Autenticação Basic base64 */
passport.use(new BasicStrategy(async (email, password, done) => {

    const user = await User.findOne({
        where: { email, password }
    })
    if (user) {
        return done(null, user);
    }
    return done(notAuthorizedJson, false);

}));

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('basic', (err: any, user: any) => {
        req.user = user;
        return user ? next() : next(notAuthorizedJson);
    })(req, res, next);
}

/* Autenticação Basic base64 */
let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

passport.use(new JWTStrategy(options, async (payload, done) => {

    const user = await User.findByPk(payload.id);

    if (user) {
        return done(null, user);
    }
    return done(notAuthorizedJson, false);
}))

export const generateToken = (data: any) => {
    return jwt.sign(data, process.env.JWT_SECRET as string);
}

export const privateRouteJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err: any, user: any) => {
        req.user = user;
        return user ? next() : next(notAuthorizedJson);
    })(req, res, next);
}

export default passport;