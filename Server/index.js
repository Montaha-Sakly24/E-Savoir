import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT } from './utils/config.js';
import connectToMongoDB from './utils/config.js';
import { createAdminAccount } from './utils/createAdminAccount.js';

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import articleRouter from './routes/articleRoutes.js';

const app = express ();
app.use(express.json());
app.use(cors());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/articles', articleRouter);


connectToMongoDB().then(async () => {
  await createAdminAccount();

  app.listen(PORT || 5000, () => {
       console.log(`App is listening to port : ${PORT || 5000}`);
    });
}).catch((err) => {
     console.error(err.message);
});