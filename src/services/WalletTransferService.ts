import { BaseService } from './AbstractBaseService';
import { UserModel, WalletTransactionModel, WalletTransfer, WalletTransferModel } from '../models';
import { InstanceType, ModelType } from 'typegoose';
import { ClientSession, startSession } from 'mongoose';
import { WALLET_OPERATION_TYPES, WALLET_TRANSFER_STATUSES } from '../enums';
import { Errors } from 'typescript-rest'

export class WalletTransferService extends BaseService {
    public model: ModelType<WalletTransfer>;

    constructor() {
        super('WalletTransferService');
        this.log('Service initiated');
        this.model = WalletTransferModel;
    }

    public async createTransfer(data: WalletTransfer): Promise<WalletTransfer> {
        data.status = WALLET_TRANSFER_STATUSES.PENDING;
        data.date = new Date();
        const session: ClientSession = await startSession();
        const fromUser = await UserModel.findById(data.fromUser);
        if (fromUser.balance < data.amount) {
            throw new Errors.ForbiddenError('Not enough balance');
        }
        const walletTransfer = await this.model.create(data);
        try {
            session.startTransaction();
            await UserModel.updateOne({ _id: walletTransfer.fromUser }, { $inc: { balance: -walletTransfer.amount } }, { session });
            await UserModel.updateOne({ _id: walletTransfer.toUser }, { $inc: { balance: walletTransfer.amount } }, { session });
            const walletTransactionsData = {
                credit: {
                    transfer: walletTransfer._id,
                    user: walletTransfer.fromUser,
                    amount: -walletTransfer.amount,
                    operationType: WALLET_OPERATION_TYPES.CREDIT,
                    balanceBefore: 0,
                    balanceAfter: 0,
                    date: new Date()
                },
                debit: {
                    transfer: walletTransfer._id,
                    user: walletTransfer.toUser,
                    amount: walletTransfer.amount,
                    operationType: WALLET_OPERATION_TYPES.DEBIT,
                    balanceBefore: 0,
                    balanceAfter: 0,
                    date: new Date()
                }
            };

            const walletTransactionCredit = (await WalletTransactionModel.create([walletTransactionsData.credit], { session }))[0];
            const walletTransactionDebit = (await WalletTransactionModel.create([walletTransactionsData.debit], { session }))[0];
            await this.model.updateOne({ _id: walletTransfer._id }, {
                fromTransaction: walletTransactionCredit._id,
                toTransaction: walletTransactionDebit._id,
                status: WALLET_TRANSFER_STATUSES.SUCCESS
            }, { session });
            await session.commitTransaction();
            session.endSession();

            return await this.model.findById(walletTransfer._id);

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            await this.model.updateOne({ _id: walletTransfer._id }, {
                status: WALLET_TRANSFER_STATUSES.FAIL
            });
            throw new Errors.InternalServerError(err);
        }

    }

    public async getTransferById(id: string): Promise<InstanceType<WalletTransfer>> {
        return this.model.findById(id);
    }

    public async getTransfersByUser(userId: string): Promise<InstanceType<WalletTransfer>[]> {
        return this.model.find({ user: userId });
    }

    public async getTransferByTransferId(transferId: string, userId: string): Promise<InstanceType<WalletTransfer>> {
        return this.model.findOne({ user: userId, transfer: transferId });
    }
}
