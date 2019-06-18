import { WalletTransferService } from '../services';
import { Inject } from 'typescript-ioc';
import { WalletTransfer } from '../models';
import {Context, Path, PathParam, POST, PreProcessor, ServiceContext} from 'typescript-rest';
import { auth } from '../middlewares';
import {Types} from 'mongoose';

@Path('/transfer')
export class WalletTransferController  {
    @Inject
    private service: WalletTransferService;

    constructor() {
        this.service = new WalletTransferService();
    }

    @Path('/:toId')
    @POST
    @PreProcessor(auth)
    public async create(
        data: WalletTransfer,
        @Context context: ServiceContext,
        @PathParam('toId') toId: string
    ): Promise<any> {
        data.fromUser = context.request.user._id;
        data.toUser = Types.ObjectId(toId);
        return await this.service.createTransfer(data);
    }
}
