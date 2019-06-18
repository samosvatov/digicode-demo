import * as winston from 'winston';
import { ILog } from '../interfaces';

export class LoggerService {
    private logger: winston.Logger;
    private options: winston.LoggerOptions;
    private readonly transports: any[];

    constructor() {
        this.transports = [new winston.transports.Console()];
        this.options = {
            levels: winston.config.syslog.levels,
            transports: this.transports,
            // format: winston.format.json()
        };
        this.logger = winston.createLogger(this.options);
    }

    public log(logData: ILog): void {
        this.logger.log(logData.level, logData.message, logData.data);
    }

}
