import { Pool, PoolClient } from 'pg';
import { getConfig } from './config';
import * as bcrypt from 'bcrypt';
import express from 'express';

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
        try {
            const res = await this.client.query(text, values);
            return res;
        } catch (err) {
            this.release();
            throw new Error(err);
        }
    }

    private static async lookupImage(name: string, category?: string) {
        if (category)
            return await this.query('SELECT * FROM ImageDetails WHERE name=$1 and category=$2', [name, category]);
        else
            return await this.query('SELECT * FROM ImageDetails WHERE name=$1', [name]);
    }

    public static async findOrAddImage(name: string, filepath: string, category?: string) {
        try {
            // Lookup if image exist in database
            const image = await this.lookupImage(name, category);
            if (image && image.rows.length > 0) {
                return image.rows;
            }

            // Insert if not found
            const res = await this.query(`INSERT INTO ImageDetails(name, category, filepath, uploadDate) VALUES($1, $2, $3, to_timestamp(${Date.now()} / 1000.0))`, [name, category, filepath]);
            if (res) {
                return res.rows;
            }
            return [];
        } catch (err) {
            this.release();
            throw new Error(err);
        }
    }
    public static async getAlbums() {
        try {
            const res = await this.query(`SELECT category FROM ImageDetails`);
            // TODO: make sure album is in the local directory
            if (res)
                return res.rows.map(row => row.category);
            return [];
        } catch (err) {
            this.release();
            throw new Error(err);
        }
    }

    public static async getFilePath(name: string, category: string) {
        try {
            const res = await this.query(`SELECT filepath FROM ImageDetails WHERE name=$1 and category=$2`, [name, category]);
            if (res && res.rowCount > 0)
                return res.rows[0].filepath as string;
            return '';
        } catch (err) {
            this.release();
            throw new Error(err);
        }
    }
    public static async registerUser(email: string, hash: string, req: express.Request) {
        try {
            const data = await this.query(`INSERT INTO LoginDetails(email, hash) VALUES($1, $2) RETURNING ID`, [email, hash]);            
            await this.query(`INSERT INTO UserDetails(userid, lastdateused) VALUES($1, to_timestamp(${Date.now()} / 1000.0))`, [data.rows[0].id]);
        } catch (err) {
            this.release();
            throw new Error(err);
        }
    }

    public static async verifyUser(email: string, password: string) {
        try {
            const res = await this.query(`SELECT * FROM LoginDetails WHERE email=$1`, [email]);
            console.log('verifyuser', res);

            if (res && res.rowCount > 0) {
                const isValid = bcrypt.compareSync(password, res.rows[0].hash);

                if (isValid) {
                    return await this.getUserDetails(res.rows[0].id);
                }
            }
            return [];
        } catch (err) {
            this.release();
            throw new Error(err);
        }
    }

    private static async getUserDetails(userId: number) {
        try {
            const res = await this.query(`SELECT * FROM UserDetails WHERE userid=$1`, [userId]);
            if (res && res.rowCount > 0)
                return (res.rows as string[]);
            return [];
        } catch (err) {
            this.release();
            throw new Error(err);
        }
    }
}