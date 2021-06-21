import express, { NextFunction } from "express";
import { errorHandler } from "../models/errorHandler";
import { redisConn } from "../models/redisConn";

export class Authorization {
    public static async requireAuth(req: express.Request, res: express.Response, next: NextFunction) {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).send('Unauthorized');
        }
        const checkid = await redisConn.getValue(authorization)
            .catch((error) => errorHandler(error));
        if (checkid === 'Unauthorized')
            return res.status(401).send('Unauthorized');
        return next();
    }
}