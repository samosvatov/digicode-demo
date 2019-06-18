import {Abstract, ServiceContext} from 'typescript-rest';
import { InstanceType } from 'typegoose';
import { AbstractBaseCRUDService } from '../services';

@Abstract
export abstract class AbstractBaseController<T> {

    abstract service: AbstractBaseCRUDService<T>;

    abstract async getById(
        context: ServiceContext,
        id: string
    ): Promise<InstanceType<T>>

    abstract async deleteById(
        context: ServiceContext,
        id: string
    ): Promise<InstanceType<T>>;

    abstract async updateById(
        context: ServiceContext,
        id: string
    ): Promise<InstanceType<T>>;

    abstract async create(
        context: ServiceContext,
        data: T
    ): Promise<InstanceType<T>>;
}

@Abstract
export class BaseController<T> implements AbstractBaseController<T> {

    public service: AbstractBaseCRUDService<T>;

    public async getById(
        context: ServiceContext,
        id: string
    ): Promise<InstanceType<T>> {
        return this.service.getById(id);
    }

    public async deleteById(
        context: ServiceContext,
        id: string
    ): Promise<InstanceType<T>> {
        return this.service.deleteById(id);
    };

    public async updateById(
        context: ServiceContext,
        id: string
    ): Promise<InstanceType<T>> {
        return this.service.updateById(id, context.request.body)
    };

    public async create(
        context: ServiceContext,
        data: T
    ): Promise<InstanceType<T>> {
        return this.service.create(data);
    };
}
