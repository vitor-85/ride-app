import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './app/routes.js';
import { connectDB } from "./database/index.js";


const app = express();

connectDB(); 

app.use(cors());
app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

export default app;