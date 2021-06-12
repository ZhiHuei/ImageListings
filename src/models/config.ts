import * as config from '../../public/config.json';

interface IConfig {
    db: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number
    },
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
}

export const getConfig = new Config();