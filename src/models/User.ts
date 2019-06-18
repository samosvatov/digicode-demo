import {instanceMethod, InstanceType, ModelType, pre, prop, Typegoose} from 'typegoose';
import * as bcrypt from 'bcrypt';
import { USER_ROLES } from '../enums';

@pre<User>('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    this.roles.push(USER_ROLES.USER);
    next();
})

export class User extends Typegoose {

    @prop({ required: true, unique: true })
    email: string;

    @prop({ required: true, unique: true })
    username: string;

    @prop({ required: true })
    password: string;

    @prop({ required: true, default: 0 })
    balance: number;

    @prop({})
    tokens: string[];

    @prop({ enum: USER_ROLES, default: [], required: true })
    roles: USER_ROLES[];

    @instanceMethod
    async isPasswordValid(this: InstanceType<User>, password: string) {
        return await bcrypt.compare(password, this.password);
    }
}

const UserModel: ModelType<User> = new User().getModelForClass(User);

export { UserModel }
