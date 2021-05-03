import express from 'express';
import { DataBaseConnection } from './models/databaseConnection';
import { FileHelper } from './models/fileHelper';
import {
    graphqlExpress
  } from 'graphql-server-express';
import { schema } from './graphql/schema';

export class Server {
    private app;
    constructor() {
        this.app = express();
        this.routerConfig();
    }

    private routerConfig() {
        this.app.use('/graphql', express.json(), graphqlExpress({
            schema
        }));

        this.app.use('/getPhoto', express.json(), express.urlencoded({extended: false}), async (req, res) => {
            let name = req.query.name;
            let category = req.query.category;

            if (name && category) {
                const filepath = await DataBaseConnection.getFilePath(name as string, category as string);

                res.sendFile(filepath, (err) =>{
                    if (err)
                        throw err;
                    else
                        console.log('sent:');
                })
            }
        })
    }

    public start = async (port: number) => {
        console.log("starting.....");
        await DataBaseConnection.init();

        // read album and load into db
        FileHelper.onStartup();

        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err) => reject(err));
        });
    }
}