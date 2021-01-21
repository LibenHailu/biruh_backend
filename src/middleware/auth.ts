import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { User } from '../entity/User'

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split("Bearer ")[1];
            if (token) {
                try {
                    const user = await jwt.verify(token, process.env.JWT_SECRET);
                    const authUser = await User.findOne({ username: user.username })
                    res.locals.user = authUser
                    return next()

                } catch (err) {
                    res.status(401).json({ error: "Invalid/Expired token" });
                }
            }
            res.status(401).json({
                error:
                    "Authorization token must be 'Bearer [token]"
            });
        }
        res.status(401).json({
            error: "Authorization header must be provided"
        });

    } catch (err) {
        console.log(err)
    }
};