import { BaseCRUDService } from './AbstractBaseService';
import { User, UserModel } from '../models';
import { ModelType, InstanceType } from 'typegoose';
import { Document } from 'mongoose';
import { Errors } from 'typescript-rest';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';

export class UserService extends BaseCRUDService<User> {
    public model: ModelType<User>;
    protected JWT_SECRET: string;

    constructor() {
        super('UserService');
        this.log('Service initiated');
        this.JWT_SECRET = config.get('secrets.jwt');
        this.model = UserModel;
    }

    public async updateById(id: string, data: User): Promise<User & Document> {
        this.log('HELLO');
        return super.updateById(id, data);
    }

    public async deleteById(id: string): Promise<User & Document> {
        return super.deleteById(id);
    }

    public async create(data: User): Promise<User & Document> {
        return super.create(data);
    }

    public async getById(id: string): Promise<User & Document> {
        return super.getById(id);
    }

    private async addToken(id: string, token: string): Promise<User & Document> {
        return this.model.findByIdAndUpdate(id, { $push: { tokens: token } });
    }

    public async login(data: { email: string, password: string }): Promise<{ user: User & Document, token: string }> {
        const user: InstanceType<User> = await this.model.findOne({ email: data.email });
        const isPasswordValid = await user.isPasswordValid(data.password);
        if(!isPasswordValid) {
            throw new Errors.UnauthorizedError('Password is incorrect');
        }
        const payload = {
            sub: user._id
        };
        const token = jwt.sign(payload, this.JWT_SECRET);
        await this.addToken(user._id, token);
        return { user, token }
    }

}
