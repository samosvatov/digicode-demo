import {LOG_LEVELS} from '../enums';

export interface ILog {
    message: string,
    level?: LOG_LEVELS,
    data?: object
}
