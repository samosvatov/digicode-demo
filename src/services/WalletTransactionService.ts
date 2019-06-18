import { BaseService } from './AbstractBaseService';
import { WalletTransaction, WalletTransactionModel } from '../models';
import { ModelType, InstanceType } from 'typegoose';

export class WalletTransactionService extends BaseService {
    public model: ModelType<WalletTransaction>;
    constructor() {
        super('WalletTransactionService');
        this.log('Service initiated');
        this.model = WalletTransactionModel;
    }

    public async createTransaction(data: WalletTransaction): Promise<InstanceType<WalletTransaction>> {
        return this.model.create(data)
    }

    public async getTransactionById(id: string): Promise<InstanceType<WalletTransaction>> {
        return this.model.findById(id)
    }

    public async getTransactionsByUser(userId: string): Promise<InstanceType<WalletTransaction>[]> {
        return this.model.find({ user: userId });
    }

    public async getTransactionByTransferId(transferId: string, userId: string): Promise<InstanceType<WalletTransaction>> {
        return this.model.findOne({ user: userId, transfer: transferId });
    }
}
