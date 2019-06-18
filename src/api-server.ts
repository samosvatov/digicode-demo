import * as express from 'express';
import { Server } from 'typescript-rest';
import * as http from 'http';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import controllers from './controllers';
import { AddressInfo } from 'net';
import { MongoService } from './services/MongoService';
import * as config from 'config';
import { IMongoOptions } from './interfaces';
import { Inject } from 'typescript-ioc';

export class ApiServer {

    private readonly app: express.Application;
    private server: http.Server = null;
    public PORT: number = +process.env.PORT || 3000;
    private mongoOpts: IMongoOptions;
    @Inject mongoService: MongoService;

    constructor() {
        this.app = express();
        this.config();
        this.mongoOpts = config.get('mongoDb');
        this.mongoService = new MongoService(this.mongoOpts);

        Server.useIoC();
        Server.buildServices(this.app, ...controllers);

        Server.swagger(this.app, {
            endpoint: 'api-docs',
            filePath: './dist/swagger.json',
            host: 'localhost:3000',
            schemes: ['http']
        });

    }

    /**
     * Configure the express app.
     */
    private config(): void {
        this.app.use( bodyParser.urlencoded( { extended: false } ) );
        this.app.use( bodyParser.json( { limit: '1mb' } ) );
        this.app.use(cors());
    }

    /**
     * Start the server
     * @returns {Promise<any>}
     */
    public start(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }

                const address: AddressInfo = <AddressInfo> this.server.address();
                if (address.address === '::') address.address = 'localhost';
                console.log(`Listening to http://${address.address}:${address.port}`);

                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

}
