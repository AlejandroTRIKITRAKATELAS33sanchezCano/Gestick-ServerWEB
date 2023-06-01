import express from "express";
import cors from 'cors'
import { PORT } from "./config.js";
import indexRoutes from './routes/index.routes.js'
import taskRoutes from './routes/gestick.routes.js'
import session from "express-session";'express-session'


const app = express();

app.use(express.json());
app.use(cors());

app.use(indexRoutes);
app.use(taskRoutes);

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // En un entorno de producción, establezca secure en true para habilitar HTTPS
}));

app.listen(PORT);

console.log('Server is running on port ' + PORT)

