import express from 'express';
import { DataBaseConnection } from './models/databaseConnection';
import {
    graphqlExpress
  } from 'graphql-server-express';
import { schema } from './graphql/schema';

export class Server {
    private app;
    // private dbCon;
    constructor() {
        this.app = express();
        this.routerConfig();
    }

    private routerConfig() {
        this.app.use('/graphql', express.json(), graphqlExpress({
            schema
        }));
    }

    public start = async (port: number) => {
        console.log("starting.....");
        await DataBaseConnection.init();

        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err) => reject(err));
        });
    }
}