import dotenv from 'dotenv'
import express from 'express'
import { appRouter } from './src/modules/index.router.js';

dotenv.config({ path: ('./config/.env') })

const app = express()
const port = process.env.PORT

appRouter(app);

app.listen(port, () => console.log(`Server is running on port ${port}!`));
