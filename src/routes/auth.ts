import { Request, Response, Router } from "express";
import { User } from '../entity/User'
import { validate } from 'class-validator'

const register = async (req: Request, res: Response) => {

    try {
        const { email, username, password } = req.body
        // TODO: Validate Data
        let errors: any = {}

        const emailUser = await User.findOne({ email })
        const usernameUser = await User.findOne({ username })

        if (emailUser) errors.email = 'Email already taken'
        if (usernameUser) errors.username = 'Username already taken'

        if (Object.keys(errors).length > 0) return res.status(400).json({ errors })
        // TODO: Create the user
        const user = new User({
            email, username, password
        })

        errors = await validate(user)
        if (errors.length > 0) return res.status(400).json({ errors })

        await user.save()

        // TODO: return the user
        return res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)

    }

}

const router = Router()
router.post('/register', register)

export default router