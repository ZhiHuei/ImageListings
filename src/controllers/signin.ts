import * as jwt from 'jsonwebtoken';
import express from 'express';
import { DataBaseConnection } from '../models/databaseConnection';
import { getConfig } from '../models/config';

export class SiginController {
    public static async signinAuthentication(req: express.Request, res: express.Response) {
        const { authorization } = req.headers;
        const { email, password } = req.body;
        try {
            if (authorization) {
                res.send(this.getAuthTokenId());
            } else {
                if (!email || !password) {
                    res.status(400).send('Incorrect submission');
                }
                const user = await DataBaseConnection.verifyUser(email, password);
                const { userid, lastdateused } = user[0] as any;
                console.log({userid, lastdateused});
                
                if (userid && lastdateused) {
                    const token = this.createSession(email);
                    res.send({ userid, token, lastdateused });
                } else {
                    res.status(400).send('User is not found');
                }
            }
        } catch (err) {
            res.status(400).send(err);
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