import { Request, Response, Router } from "express"
import { Notification } from "../entity/Notification"

const addNotification = async (req: Request, res: Response) => {
    try {
        const { title, description, user } = req.body

        const newNotification = new Notification({ title, description, user })
        await newNotification.save()

        res.json(newNotification)
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: "invalid request" })
    }
}

const getNotificationsPage = async (req: Request, res: Response) => {
    try {
        let { pageNum, pageSize, deleted } = req.body
        pageSize = parseInt(pageSize)
        pageNum = parseInt(pageNum)

        let notifications;

        if (pageNum === 1) {
            notifications = deleted === "true" ? await Notification.find({ take: pageSize, withDeleted: true, relations: ["user"] }) : await Notification.find({ take: pageSize, relations: ["user"] })

        } else {
            // if page is greater than one figure out how many posts to skip
            const skips = pageSize * (pageNum - 1)
            notifications = deleted === "true" ? await Notification.find({ take: pageSize, skip: skips, withDeleted: true, relations: ["user"] }) : await Notification.find({ take: pageSize, skip: skips, relations: ["user"] })

        }

        const totalDocs = deleted === "true" ? await Notification.count({ withDeleted: true }) : await Notification.count()
        const hasMore = totalDocs > pageSize * pageNum

        res.json({ notifications, hasMore })
    } catch (err) {
        console.log(err)
    }
}

const updateNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title, description } = req.body

        const oldNotification = await Notification.findOneOrFail(id, { relations: ["user"] })


        oldNotification.title = title
        oldNotification.description = description

        await oldNotification.save()

        res.json(oldNotification)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: "invalid request" })
    }
}


const deleteNotification = async (req: Request, res: Response) => {

    try {
        const { id } = req.params

        const notification = await Notification.findOne({ id })

        await notification.softRemove()

        res.json({ success: "true" })

    } catch (err) {
        console.log(err)
        res.status(401).json({ error: "invalid request" })
    }
}

const getNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const notification = await Notification.findOneOrFail(id, { relations: ["user"] })
        res.json(notification)
    } catch (err) {
        res.status(401).json({ error: 'invalid request' })
    }
}
const router = Router()
router.post('/add', addNotification)
router.get('/notifications', getNotificationsPage)
router.put('/update/:id', updateNotification)
router.delete('/delete/:id', deleteNotification)
router.get('/:id', getNotification)

export default router