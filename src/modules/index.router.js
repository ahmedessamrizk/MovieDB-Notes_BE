import authRouter from './auth/auth.router.js'
import noteRouter from './note/note.router.js'
import morgan from 'morgan'
import cors from 'cors'
import express from 'express'
import { connectDB } from '../../DB/connection.js'
import { globalErrorHandling } from '../middleware/asyncHandler.js'


export const appRouter = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}))
    app.use(cors({}));
    //Returns request endpoint and time taken to execute it
    if (process.env.MODE === 'DEV') {
        app.use(morgan("dev"))
    } else {
        app.use(morgan("combined"))
    }

    //Base URL
    const baseURL = process.env.BASEURL

    //Api Setup
    app.use(`${baseURL}/auth`, authRouter);
    app.use(`${baseURL}/note`, noteRouter);

    //Invalid routing
    app.use('*', (req, res) => {
        //res.status(404).json({ message: "Invalid Routing" })
        next(Error("404 Page not found In-valid Routing or method", { cause: 404 }))
      })

    //Error handling  
    app.use(globalErrorHandling);

    //Connection on DB
    connectDB();

    /*  if needed
    import path from 'path'
    import { fileURLToPath } from 'url'
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    dotenv.config({ path: path.join(dirname, './config/.env') })
    */
}
