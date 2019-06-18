import { BaseController } from './AbstractBaseController';
import { User } from '../models';
import { UserService } from '../services';
import {
    Context,
    DELETE,
    GET,
    Path,
    PathParam,
    POST, PreProcessor,
    ServiceContext
} from 'typescript-rest';
import { auth, checkRights } from '../middlewares';

@Path('/user')
export class UserController extends BaseController<User> {
    public service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    /**
     *
     * @param context
     * @param data
     * @return User & { token: string }
     */
    @Path('/login')
    @POST
    public async login(
        @Context context: ServiceContext,
        data: { email: string, password: string }
    ): Promise<any> {
        return await this.service.login(data);
    }

    /**
     *
     * @param context
     * @param id
     * @return User
     */
    @Path(':id')
    @GET
    @PreProcessor(auth)
    @PreProcessor(checkRights)
    public async getById(
        @Context context: ServiceContext,
        @PathParam('id') id: string
    ): Promise<any> {
        return await super.getById(context, id);
    }

    /**
     *
     * @param context
     * @param id
     * @return User
     */
    @Path(':id')
    @POST
    @PreProcessor(auth)
    @PreProcessor(checkRights)
    public async updateById(
        @Context context: ServiceContext,
        @PathParam('id') id: string
    ): Promise<any> {
        return await super.updateById(context.request.body, id);
    }

    /**
     *
     * @param context
     * @param id
     * @return User
     */
    @Path(':id')
    @DELETE
    @PreProcessor(auth)
    @PreProcessor(checkRights)
    public async deleteById(
        @Context context: ServiceContext,
        @PathParam('id') id: string
    ): Promise<any> {
        return await super.deleteById(context, id);
    }

    /**
     *
     * @param context
     * @param data
     * @return User
     */
    @Path('/')
    @POST
    public async create(
        @Context context: ServiceContext,
        data: User
    ): Promise<any> {
        return await super.create(context, data);
    }
}
