import { IMongoOptions } from '../interfaces';
import { connect } from 'mongoose';

export class MongoService {

    public connection: any;

    constructor(options: IMongoOptions) {
        this.connection = connect(
            options.uri,
            {
                poolSize: options.poolSize,
                dbName: options.dbName,
                useNewUrlParser: true,
            }
        );
    };
}
