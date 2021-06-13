import * as jwt from 'jsonwebtoken';
import express from 'express';
import { DataBaseConnection } from '../models/databaseConnection';
import { getConfig } from '../models/config';
import { errorHandler } from '../models/errorHandler';

export class SiginController {
    public static async signinAuthentication(req: express.Request, res: express.Response) {
        const { authorization } = req.headers;
        const { email, password } = req.body;


        if (authorization) {
            res.send(this.getAuthTokenId());
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

            const token = this.createSession(email);
            res.send({ userid, token, lastdateused });
        }
    }

    private static getAuthTokenId() {
        console.log('Auth ok');
    }

    private static createSession(email: string) {
        const token = this.signToken(email);
        return token;
    };

    private static signToken(username: string) {
        const jwtPayload = { username };
        return jwt.sign(jwtPayload, getConfig.getSecretKey(), { expiresIn: '2 days' });
    };
}