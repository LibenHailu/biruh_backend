import { Request, Response, Router } from "express";
import { User } from '../entity/User'
import { isEmpty, validate } from 'class-validator'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()

const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, phone, role, profession, interests, firstname, lastname, marital_status, city, bio, sex, age } = req.body

        //Validate Data
        let errors: any = {}

        const emailUser = await User.findOne({ email })
        const phoneUser = await User.findOne({ phone })

        if (emailUser) errors.email = 'Email already taken'
        if (phoneUser) errors.phone = 'Phone already taken'

        if (Object.keys(errors).length > 0) return res.status(400).json({ errors })

        //Create User
        const user = new User({
            phone, email, role, profession, interests, firstname, lastname, marital_status, city, bio, sex, age
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

const getUsersPage = async (req: Request, res: Response) => {
    try {
        let { pageNum, pageSize, deleted } = req.body
        pageSize = parseInt(pageSize)
        pageNum = parseInt(pageNum)

        let users;

        if (pageNum === 1) {
            users = deleted === "true" ? await User.find({ take: pageSize, withDeleted: true }) : await User.find({ take: pageSize })

        } else {
            // if page is greater than one figure out how many posts to skip
            const skips = pageSize * (pageNum - 1)
            users = deleted === "true" ? await User.find({ take: pageSize, skip: skips, withDeleted: true }) : await User.find({ take: pageSize, skip: skips })

        }


        const totalDocs = deleted === "true" ? await User.count({ withDeleted: true }) : await User.count()
        const hasMore = totalDocs > pageSize * pageNum

        res.json({ users, hasMore })
    } catch (err) {
        console.log(err)
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { email, phone, profession, interests, firstname, lastname, marital_status, city, bio, sex, age } = req.body

        const user = await User.findOneOrFail(id)

        user.email = email
        user.phone = phone
        user.profession = profession
        user.interests = interests
        user.firstname = firstname
        user.lastname = lastname
        user.marital_status = marital_status
        user.city = city
        user.bio = bio
        user.sex = sex
        user.age = age

        await user.save()

        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: "invalid request" })
    }
}

const deleteUser = async (req: Request, res: Response) => {

    try {
        const { id } = req.params

        const user = await User.findOne({ id })

        await user.softRemove()

        res.json({ success: "true" })

    } catch (err) {
        res.status(401).json({ error: "invalid request" })
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findOneOrFail({ id })
        res.json(user)
    } catch (err) {
        res.status(401).json({ error: 'invalid request' })
    }
}

const router = Router()
router.post('/register', registerUser)
router.get('/users', getUsersPage)
router.put('/update/:id', updateUser)
router.delete('/delete/:id', deleteUser)
router.get('/:id', getUser)

export default router