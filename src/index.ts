import "reflect-metadata"
import { createConnection } from "typeorm"
import express from "express"
import morgan from 'morgan'

import authRoutes from './routes/user'

import trim from './middleware/trim'
// import {User} from "./entity/User";

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)

app.get('/', (_, res) => res.send('hello world'))
app.use('/api/user', authRoutes)

app.listen(5000, async () => {
    console.log('Server running on at http://localhost:5000')

    try {
        await createConnection()
        console.log('Database connected!')
    } catch (err) {
        console.log(err)
    }
})
// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
