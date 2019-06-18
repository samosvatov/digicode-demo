import { Typegoose, prop, Ref, ModelType, pre } from 'typegoose';
import { User, UserModel } from './User';
import { WALLET_OPERATION_TYPES } from '../enums';
import { WalletTransfer } from './WalletTransfer';

@pre<WalletTransaction>('save', async function(next) {
    const user = await UserModel.findById(this.user);
    this.balanceBefore = user.balance;
    this.balanceAfter = user.balance + this.amount;
    this.date = new Date();
    next();
})

export class WalletTransaction extends Typegoose {
    @prop({ ref: WalletTransfer, required: true })
    transfer: Ref<WalletTransfer>;

    @prop({ ref: User, required: true })
    user: Ref<User>;

    @prop({ required: true })
    date: Date;

    @prop({ required: true })
    amount: number;

    @prop({ required: true, enum: WALLET_OPERATION_TYPES })
    operationType: WALLET_OPERATION_TYPES;

    @prop({ required: true })
    balanceBefore: number;

    @prop({ required: true })
    balanceAfter: number;

}

const WalletTransactionModel: ModelType<WalletTransaction> = new WalletTransaction().getModelForClass(WalletTransaction, {
    schemaOptions: {
        collection: 'walletTransactions'
    }
});
export { WalletTransactionModel }
