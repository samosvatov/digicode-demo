import { Types } from 'mongoose';
import { WALLET_TRANSFER_STATUSES } from '../enums';

export interface IWalletTransferRequest {
    amount: number,
    sign: string
}

export interface IWalletTransferRequestFull extends IWalletTransferRequest {
    fromUser: Types.ObjectId,
    toUser: Types.ObjectId,
    date?: Date,
    status?: WALLET_TRANSFER_STATUSES
}
