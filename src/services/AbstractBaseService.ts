import { ILog } from '../interfaces';
import { LOG_LEVELS } from '../enums';
import { LoggerService } from './LoggerService';
import * as moment from 'moment';
import { ModelType, InstanceType } from 'typegoose';
import { Abstract } from 'typescript-rest';
import { Provides } from 'typescript-ioc';

@Abstract
export abstract class AbstractBaseService {
    abstract name: string;
    abstract loggerService: LoggerService;
    abstract log(message: string | ILog): void;
}

@Provides(AbstractBaseService)
export class BaseService implements AbstractBaseService {
    public readonly name: string;
    public loggerService: LoggerService;

    constructor(name: string) {
        this.name = name;
        this.loggerService = new LoggerService();
    }

    public log(message: string | ILog): void {
        let fullLog: ILog = <ILog> {};
        if (typeof message === 'string') {
            fullLog.message = message;
            fullLog.level = LOG_LEVELS.INFO
        } else if ( typeof message === 'object' && message.hasOwnProperty('message')) {
            fullLog = message;
            if (!message.hasOwnProperty('level') || !message.level) {
                fullLog.level = LOG_LEVELS.INFO;
            }
        }

        fullLog.message = `[${this.name}][${moment().format()}] - ${message}`;
        this.loggerService.log(fullLog);
    }
}

@Abstract
export abstract class AbstractBaseCRUDService<T> extends AbstractBaseService {
    abstract model: ModelType<T>;

    abstract getById(id: string): Promise<InstanceType<T>>;

    abstract deleteById(id: string): Promise<InstanceType<T>>;

    abstract updateById(id: string, data: T): Promise<InstanceType<T>>;

    abstract create(data: T): Promise<InstanceType<T>>;
}

@Provides(AbstractBaseCRUDService)
export class BaseCRUDService<T> implements AbstractBaseCRUDService<T> {
    public readonly name: string;
    public model: ModelType<T>;

    public loggerService: LoggerService;

    constructor(serviceName: string) {
        this.name = serviceName;
        this.loggerService = new LoggerService();
    }

    /**
     * Create service log
     * @param message
     */
    public log(message: string | ILog): void {
        let fullLog: ILog = <ILog> {};
        if (typeof message === 'string') {
            fullLog.message = message;
            fullLog.level = LOG_LEVELS.INFO
        } else if ( typeof message === 'object' && message.hasOwnProperty('message')) {
            fullLog = message;
            if (!message.hasOwnProperty('level') || !message.level) {
                fullLog.level = LOG_LEVELS.INFO;
            }
        }

        fullLog.message = `[${this.name}][${moment().format()}] - ${message}`;
        this.loggerService.log(fullLog);
    }

    public async getById(id: string): Promise<InstanceType<T>> {
        return this.model.findById(id);
    }

    public async deleteById(id: string): Promise<InstanceType<T>> {
        return this.model.findByIdAndDelete(id);
    };

    public async updateById(id: string, data: T): Promise<InstanceType<T>> {
        return this.model.findByIdAndUpdate(id, data)
    };

    public async create(data: T): Promise<InstanceType<T>> {
        return this.model.create(data);
    };

}
