import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { UserModel } from '../models';
import { Errors } from 'typescript-rest';

const JWT_SECRET: string = config.get('secrets.jwt');

export const auth = async (req: Request): Promise<Request> => {
    try {
        if (!req.header('Authorization')) {
            throw 'No Authorization header'
        }
        const token = req.header('Authorization');
        const isTokenValid = jwt.verify(token, JWT_SECRET);
        if (!isTokenValid) {
            throw 'Token not valid'
        }
        const payload = jwt.decode(token);
        const user = await UserModel.findById(payload.sub);
        if(!user) {
            throw 'User not found';
        }
        req.user = user;
        return req;
    } catch (err) {
        throw new Errors.UnauthorizedError(err);
    }

};
