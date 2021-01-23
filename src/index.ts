import "reflect-metadata"
import { createConnection } from "typeorm"
import express from "express"
import morgan from 'morgan'

import userRoutes from './routes/user'
import messageRoutes from './routes/message'

import trim from './middleware/trim'
// import {User} from "./entity/User";

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)

app.get('/', (_, res) => res.send('hello world'))
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)

app.listen(5000, async () => {
    console.log('Server running on at http://localhost:5000')

    try {
        await createConnection()
        console.log('Database connected!')
    } catch (err) {
        console.log(err)
    }
})
