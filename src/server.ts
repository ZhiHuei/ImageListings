import express from 'express';
import { DataBaseConnection } from './models/databaseConnection';
import {
    graphqlExpress
  } from 'graphql-server-express';
import { schema } from './graphql/schema';
import * as config from '../public/config.json';

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

        // read album and load into db
        const fs = require('fs');
        fs.readdir(config.dev.repo, (err: any, files: any[]) => {
            if (err)
                throw new Error(err);

            files.forEach(category => {
                fs.lstat(config.dev.repo + '\\' + category, async (err: any, stats: any) => {
                    if (err)
                        throw new Error(err);

                    // Catogorised images
                    if (stats.isDirectory()) {
                        fs.readdir(config.dev.repo + '\\' + category, (err: any, files: any[]) => {
                            if (err)
                                throw new Error(err);

                            files.forEach(async image => {
                                await DataBaseConnection.findOrAddImage(image.split('.').slice(0, -1).join('.'), category);
                            });
                            console.log(`${files.length} loaded from ${category}`);
                        });
                    }
                    // Uncategorised images
                    else {
                        await DataBaseConnection.findOrAddImage(category.split('.').slice(0, -1).join('.'), 'Uncategorized');
                    }

                });
            });
        });

        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err) => reject(err));
        });
    }
}