import { WalletTransferService } from '../services';
import { Inject } from 'typescript-ioc';
import { Context, Path, PathParam, POST, PreProcessor, ServiceContext } from 'typescript-rest';
import { auth } from '../middlewares';
import { Types } from 'mongoose';
import { IWalletTransferRequest, IWalletTransferRequestFull } from '../interfaces';

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
        data: IWalletTransferRequest,
        @Context context: ServiceContext,
        @PathParam('toId') toId: string
    ): Promise<any> {
        const fullData: IWalletTransferRequestFull = {
            ...data,
            fromUser: context.request.user._id,
            toUser: Types.ObjectId(toId)
        };
        return await this.service.createTransfer(fullData);
    }
}
