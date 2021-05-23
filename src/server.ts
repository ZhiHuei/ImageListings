import express from 'express';
import cors from 'cors';
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
        this.app.use(cors());
        this.routerConfig();
    }

    private routerConfig() {
        this.app.use('/graphql', express.json(), express.urlencoded({extended: false}), graphqlExpress({
            schema
        }));

        this.app.get('/getPhoto/:category', express.json(), express.urlencoded({extended: false}), async (req, res) => {
            let name = req.query.name;
            let category = req.params.category;

            if (name) {
                const filepath = await DataBaseConnection.getFilePath(name as string, category as string);

                if (filepath.length) {
                    res.sendFile(filepath, (err) =>{
                        if (err)
                            throw err;
                        else
                            console.log('sent:');
                        res.end();
                    })
                } else {
                    res.status(400).send('File is not found')
                }
            } else {
                // Return names of photos in an album
                res.send(FileHelper.getAllPhotos(category));
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