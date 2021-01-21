import { Request, Response, Router } from "express";
import { User } from '../entity/User'
import { isEmpty, validate } from 'class-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import auth from '../middleware/auth'

dotenv.config()

const register = async (req: Request, res: Response) => {

    try {

        const { email, username, password } = req.body

        //Validate Data
        let errors: any = {}

        const emailUser = await User.findOne({ email })
        const usernameUser = await User.findOne({ username })

        if (emailUser) errors.email = 'Email already taken'
        if (usernameUser) errors.username = 'Username already taken'

        if (Object.keys(errors).length > 0) return res.status(400).json({ errors })

        //Create User
        const user = new User({
            email, username, password
        })

        errors = await validate(user)
        if (errors.length > 0) return res.status(400).json({ errors })

        await user.save()

        //return User
        return res.json(user)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)

    }

}

const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        let errors: any = {}
        if (isEmpty(username)) errors.username = 'Username must not be empty'
        if (isEmpty(password)) errors.password = 'Password must not be empty'
        if (Object.keys(errors).length > 0) return res.status(400).json(errors)

        const user = await User.findOne({ username })
        if (!user) return res.status(404).json({ error: 'User not found' })

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (passwordMatches) return res.status(401).json({ password: 'Password is incorrect' })

        console.log(user)
        const token = jwt.sign({ username }, process.env.JWT_SECRET)

        return res.json({ ...user, token })
    } catch (error) {

    }
}

const me = async (req: Request, res: Response) => {
    res.json(res.locals.user)
}

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, me)

export default router