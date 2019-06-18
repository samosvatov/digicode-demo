import { Types } from 'mongoose';
import { Ref } from 'typegoose';
import { User } from '../models';

export interface IWalletTransaction {
    from: string | Ref<User> | Types.ObjectId,
    to: string | Ref<User> | Types.ObjectId,
    amount: number
}
