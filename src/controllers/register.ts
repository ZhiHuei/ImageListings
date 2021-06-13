import * as jwt from 'jsonwebtoken';
import express from 'express';
import * as bcrypt from 'bcrypt';
import { DataBaseConnection } from '../models/databaseConnection';
import { errorHandler } from '../models/errorHandler';

export class RegisterController {
    public static async handleRegister(req: express.Request, res: express.Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json('incorrect form submission');
        }

        const hash = bcrypt.hashSync(password, 10);
        const userid = await DataBaseConnection.registerUser(email, hash)
            .catch((err) => errorHandler(err));

        if (userid > 0)
            res.send('Registration is successful');
        else
            res.status(400).send(userid);
    }
}