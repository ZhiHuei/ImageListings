import express from 'express';
import { Pool } from 'pg';
import {
    graphqlExpress
  } from 'graphql-server-express';
import { DataBaseConnection } from './models/DatabaseConnection';
import bodyParser from 'body-parser';
import { schema } from './graphql/schema';

export class Server {
    private app;
    // private dbCon;
    constructor() {
        this.app = express();
        // this.dbCon = new DataBaseConnection();
        this.routerConfig();
    }

    private routerConfig() {
        this.app.use('/graphql', bodyParser.json(), graphqlExpress({
            schema
        }));
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err) => reject(err));
        });
    }


    // private config() {
    //     this.app.use(bodyParser.urlencoded({ extended:true }));
    //     this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    // }

    // private routerConfig() {
    //     this.app.use('/todos', todosRouter);
    // }
}