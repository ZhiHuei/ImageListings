import { Pool, PoolClient, QueryResult } from 'pg';
import { getConfig } from './config';
import * as bcrypt from 'bcrypt';

// TODO: See if we can implement composite design patten here (probably in web workers periodic scanning, construct folder/file structure.)
export class DataBaseConnection {
    private static pool: Pool;
    private static client: PoolClient;

    public static async init() {
        const db = getConfig.getDb();
        this.pool = new Pool({
            user: db.user,
            host: db.host,
            database: db.database,
            password: db.password,
            port: db.port
        });

        this.client = await this.pool.connect();

        // test connection
        await this.testConnection();
    }

    private static async release() {
        this.client.release();
    }

    public static async testConnection() {
        await this.query(`SELECT id FROM ImageDetails`);
    }

    private static async query(text: string, values?: any[]) {
        return new Promise<QueryResult<any>>((resolve) => {
            resolve(this.client.query(text, values));
        })
    }

    private static async lookupImage(name: string, category?: string) {
        if (category)
            return this.query('SELECT * FROM ImageDetails WHERE name=$1 and category=$2', [name, category]);
        else
            return this.query('SELECT * FROM ImageDetails WHERE name=$1', [name]);
    }

    public static async findOrAddImage(name: string, filepath: string, category?: string) {
        return new Promise<any[]>((resolve, reject) => {
            this.lookupImage(name, category).then((image) => {
                if (image && image.rows.length > 0) {
                    resolve(image.rows);
                } else {
                    this.query(`INSERT INTO ImageDetails(name, category, filepath, uploadDate) VALUES($1, $2, $3, to_timestamp(${Date.now()} / 1000.0))`, [name, category, filepath])
                        .then((res) => {
                            if (res)
                                resolve(res.rows);
                            else
                                reject('unable to add image')
                        }).catch((err) => reject(err));
                }
            }).catch((err) => {
                this.release();
                reject(err)
            });
        });
    }
    public static async getAlbums() {
        return new Promise<string[]>((resolve, reject) => {
            // TODO: file watcher to update filepath to make sure album is in local dir
            this.query(`SELECT category FROM ImageDetails`)
                .then((res) => {
                    if (res)
                        resolve(res.rows.map(row => row.category));
                }).catch(err => {
                    this.release();
                    reject(err);
                });
        });
    }

    public static async getFilePath(name: string, category: string) {
        return new Promise<string>((resolve, reject) => {
            this.query(`SELECT filepath FROM ImageDetails WHERE name=$1 and category=$2`, [name, category])
                .then((res) => {
                    if (res && res.rowCount > 0)
                        resolve(res.rows[0].filepath);
                    resolve('');
                }).catch(err => {
                    this.release();
                    reject(err);
                });
        });
    }
    public static async registerUser(email: string, hash: string) {
        return new Promise<string | number>((resolve, reject) => {
            this.query(`INSERT INTO LoginDetails(email, hash) VALUES($1, $2) ON CONFLICT (email) DO NOTHING RETURNING ID`, [email, hash])
                .then((data) => {
                    if (data && data.rowCount > 0) {
                        this.query(`INSERT INTO UserDetails(userid, lastdateused) VALUES($1, to_timestamp(${Date.now()} / 1000.0))`, [data.rows[0].id])
                            .catch((err) => {
                                this.release();
                                reject(err);
                            })
                        resolve(data.rows[0].id as number);
                    } else {
                        resolve('Email already exists')
                    }
                }).catch(err => {
                    this.release();
                    reject(err);
                });
        });
    }

    public static async verifyUser(email: string, password: string) {
        return new Promise<any[]>((resolve, reject) => {
            this.query(`SELECT * FROM LoginDetails WHERE email=$1`, [email])
                .then((data) => {
                    if (data && data.rowCount > 0) {
                        const isValid = bcrypt.compareSync(password, data.rows[0].hash);
                        if (isValid) {
                            this.getUserDetails(data.rows[0].id)
                                .then((data) => resolve(data))
                                .catch((err) => {
                                    this.release();
                                    reject(err);
                                })
                        } else {
                            resolve(['Invalid login details']);
                        }
                    } else {
                        resolve(['Invalid login details']);
                    }
                }).catch(err => {
                    this.release();
                    reject(err);
                });
        });
    }

    private static async getUserDetails(userId: number) {
        return new Promise<any[]>((resolve, reject) => {
            this.query(`SELECT * FROM UserDetails WHERE userid=$1`, [userId])
                .then((data) => {
                    if (data && data.rowCount > 0) {
                        resolve(data.rows)
                    } else {
                        resolve(['Unable to get user'])
                    }
                }).catch(err => {
                    this.release();
                    reject(err);
                });
        });
    }
}