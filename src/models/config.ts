import * as config from '../../public/config.json';

interface IConfig {
    db: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number
    },
    redis_uri: string,
    repo: string,
    secretKey: string
}
class Config {
    private _config: IConfig = {
        db: {
            user: "",
            host: "",
            database: "",
            password: "",
            port: 0
        },
        redis_uri: "",
        repo: "",
        secretKey: ""
    };
    constructor() {
        if (process.env.NODE_ENV === 'docker') {
            this._config = config.docker;
        } else if (process.env.NODE_ENV === 'dev') {
            this._config = config.dev;
        }
    }

    public getDb = () => this._config.db;

    public getSecretKey = () => this._config.secretKey;

    public getRedisUri = () => this._config.redis_uri;
}

export const getConfig = new Config();