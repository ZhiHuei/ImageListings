import { Pool, PoolClient } from 'pg';
import * as config from '../../public/config.json';

// TODO: See if we can implement composite design patten here (probably in web workers periodic scanning, construct folder/file structure.)
export class DataBaseConnection {
    private static pool: Pool;
    private static client: PoolClient;

    public static async init() {
        console.log("init");

        const db = config.dev.db;
        this.pool = new Pool({
            user: db.user,
            host: db.host,
            database: db.database,
            password: db.password,
            port: db.port
        });

        this.client = await this.pool.connect();
        // console.log("Client", this.client);

        // test connection
        await this.testConnection();
    }

    public static async release() {
        this.client.release();
    }

    public static async testConnection() {
        console.log("test connection");
        await this.query(`SELECT id FROM ImageDetails`);
    }

    private static async query(text: string, values?: any[]) {
        try {
            const res = await this.client.query(text, values);
            return res;
        } catch(err) {
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
        try{
            // Lookup if image exist in database
            const image = await this.lookupImage(name, category);
            console.log("lookup");
            console.log(image);
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
}