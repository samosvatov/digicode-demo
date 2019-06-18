import { Request } from 'express';
import { Errors } from 'typescript-rest';

export const checkRights = (req: Request): Request => {
    if (!req.user === req.params.id) {
        throw new Errors.ForbiddenError();
    }
    return req;
};
