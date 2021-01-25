import { Request, Response, Router } from "express";
import { Between } from "typeorm";
import { User } from "../entity/User";

const filterUSers = async (req: Request, res: Response) => {
    try {
        const { marital_status, city, min_age, max_age, profession, sex } = req.body
        console.log(marital_status, city, min_age, max_age, profession, sex)
        const users = await User.find({
            where: [{ marital_status },
            { sex },
            { city },
            { profession }],

        })
        
        res.json(users)

    } catch (err) {
        res.status(401).json(err)
    }
}

const router = Router()
router.get('/users', filterUSers)

export default router