import { BaseService } from './AbstractBaseService';
import * as md5 from 'md5';
import { Types } from 'mongoose';

export class SignatureService extends BaseService {
    constructor() {
        super('SignatureService');
    }

    public static createSignature(data: { fromUser: Types.ObjectId, toUser: Types.ObjectId, amount: number }) {
        const payload = [data.fromUser.toHexString(), data.toUser.toHexString(), data.amount];
        return md5(payload.join(';'));
    }
}
