import * as jwt from 'jsonwebtoken';
import express from 'express';
import * as bcrypt from 'bcrypt';
import { DataBaseConnection } from '../models/databaseConnection';

export class RegisterController {
    public static async handleRegister(req: express.Request, res:express.Response) {
        const { email, password }  = req.body;
        if (!email || !password) {
            return res.status(400).json('incorrect form submission');
        }

        const hash = bcrypt.hashSync(password, 10);
        await DataBaseConnection.registerUser(email, hash, req);
        return res.send('Registration is successful');
    }
}