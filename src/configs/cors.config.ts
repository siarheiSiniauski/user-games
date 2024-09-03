import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';

dotenv.config();

const arr = process.env.CORS_ORIGIN.split(',');

export const getConfigCors = (): CorsOptions | CorsOptionsDelegate<any> => {
  return {
    origin: arr, // или массив, если несколько доменов ['http://example1.com', 'http://example2.com']
    methods: process.env.CORS_METHODS,
    //credentials: true, // если нужно отправлять куки
  };
};
