import { Request, Response, Router } from "express"
import { Message } from "../entity/Message"

const addMessage = async (req: Request, res: Response) => {
    try {
        const { message, status, sender, receiver } = req.body

        const newMessage = new Message({ message, status, sender, receiver })
        await newMessage.save()

        res.json(newMessage)
    } catch (err) {
        res.status(401).json({ error: "invalid request" })
    }
}

const getMessagesPage = async (req: Request, res: Response) => {
    try {
        let { pageNum, pageSize, deleted } = req.body
        pageSize = parseInt(pageSize)
        pageNum = parseInt(pageNum)

        let messages;

        if (pageNum === 1) {
            messages = deleted === "true" ? await Message.find({ take: pageSize, withDeleted: true, relations: ["receiver", "sender"] }) : await Message.find({ take: pageSize, relations: ["receiver", "sender"] })

        } else {
            // if page is greater than one figure out how many posts to skip
            const skips = pageSize * (pageNum - 1)
            messages = deleted === "true" ? await Message.find({ take: pageSize, skip: skips, withDeleted: true, relations: ["receiver", "sender"] }) : await Message.find({ take: pageSize, skip: skips, relations: ["receiver", "sender"] })

        }

        const totalDocs = deleted === "true" ? await Message.count({ withDeleted: true }) : await Message.count()
        const hasMore = totalDocs > pageSize * pageNum

        res.json({ messages, hasMore })
    } catch (err) {
        console.log(err)
    }
}

const updateMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { message, status } = req.body

        const oldMessage = await Message.findOneOrFail(id, { relations: ["receiver", "sender"] })


        oldMessage.message = message
        oldMessage.status = status

        await oldMessage.save()

        res.json(oldMessage)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: "invalid request" })
    }
}


const deleteMessage = async (req: Request, res: Response) => {

    try {
        const { id } = req.params

        const message = await Message.findOne({ id })

        await message.softRemove()

        res.json({ success: "true" })

    } catch (err) {
        console.log(err)
        res.status(401).json({ error: "invalid request" })
    }
}

const getMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const message = await Message.findOneOrFail(id, { relations: ["receiver", "sender"] })
        res.json(message)
    } catch (err) {
        res.status(401).json({ error: 'invalid request' })
    }
}
const router = Router()
router.post('/send', addMessage)
router.get('/messages', getMessagesPage)
router.put('/update/:id', updateMessage)
router.delete('/delete/:id', deleteMessage)
router.get('/:id', getMessage)

export default router