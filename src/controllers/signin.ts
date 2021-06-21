import * as jwt from 'jsonwebtoken';
import express from 'express';
import { DataBaseConnection } from '../models/databaseConnection';
import { getConfig } from '../models/config';
import { redisConn } from '../models/redisConn';
import { errorHandler } from '../models/errorHandler';

export class SiginController {
    public static async signinAuthentication(req: express.Request, res: express.Response) {
        const { authorization } = req.headers;
        const { email, password } = req.body;

        if (authorization) {
            const checkId = await this.getAuthTokenId(authorization)
                .catch((error) => errorHandler(error));

            const userid = checkId?.id;
            
            if (!userid)
                return res.status(400).send(checkId);

            res.send(userid);
        } else {
            if (!email || !password) {
                return res.status(400).send('Incorrect submission');
            }
            const user = await DataBaseConnection.verifyUser(email, password)
                .catch((err) => errorHandler(err));

            const userid = user[0]?.userid;
            const lastdateused = user[0]?.lastdateused;

            if (!userid && !lastdateused)
                return res.status(400).send(user[0]);

            const token = await this.createSession(email, userid)
                .catch((error) => errorHandler(error));
            res.send({ userid, token, lastdateused });
        }
    }

    private static getAuthTokenId(token: string) {
        return new Promise<any>((resolve, reject) => {
            redisConn.getValue(token)
                .then((value) => resolve(value))
                .catch((error) => reject(error));
        });
    }

    private static async createSession(email: string, id: string) {
        const token = this.signToken(email);
        return new Promise<string>((resolve, reject) => {
            redisConn.setToken(token, id)
                .then(() => resolve(token))
                .catch((error) => reject(error));
        });
    };

    private static signToken(username: string) {
        const jwtPayload = { username };
        return jwt.sign(jwtPayload, getConfig.getSecretKey(), { expiresIn: '2 days' });
    };
}