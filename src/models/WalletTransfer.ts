import { Typegoose, prop, ModelType, pre } from 'typegoose';
import { User } from './User';
import { WALLET_TRANSFER_STATUSES } from '../enums';
import { WalletTransaction } from './WalletTransaction';
import { Types } from 'mongoose';

@pre<WalletTransfer>('save', function(next) {
    this.date = new Date();
    this.status = WALLET_TRANSFER_STATUSES.PENDING;
    next();
})

export class WalletTransfer extends Typegoose {
    @prop({ ref: WalletTransaction})
    fromTransaction?: Types.ObjectId;

    @prop({ ref: WalletTransaction })
    toTransaction?: Types.ObjectId;

    @prop({ ref: User, required: true })
    fromUser: Types.ObjectId;

    @prop({ ref: User, required: true })
    toUser: Types.ObjectId;

    @prop({ required: true })
    date: Date;

    @prop({ required: true })
    amount: number;

    @prop({ required: true, enum: WALLET_TRANSFER_STATUSES })
    status: WALLET_TRANSFER_STATUSES;

}

const WalletTransferModel: ModelType<WalletTransfer> = new WalletTransfer().getModelForClass(WalletTransfer, {
    schemaOptions: {
        collection: 'walletTransfers'
    }
});
export { WalletTransferModel }
