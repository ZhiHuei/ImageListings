import * as redis from 'redis';
import { getConfig } from './config';

class RedisConn {
    private redisClient!: redis.RedisClient;
    constructor() {
        this.redisClient = redis.createClient(getConfig.getRedisUri());
    }

    public setToken(key: string, value: string) {
        return new Promise<boolean>((resolve, reject) => {
            const success = this.redisClient.setex(key, 7200, value);
            success ? resolve(true) : reject(false);
        });
    }

    public getValue(key: string) {
        return new Promise<any>((resolve, reject) => {
            const success = this.redisClient.get(key, (err, reply) => {
                if (err || !reply) {
                    resolve('Unauthorized');
                }
                resolve({id: reply});
            });
            if (!success) reject('Get Key error');
        });
    }
}

export const redisConn = new RedisConn();