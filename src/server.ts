import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from '../jobs/checkEvento';
import session from 'express-session';
import cookie from 'cookie-parser';
const KnexSessionStore = require('connect-session-knex')(session);

//É utilizada a instância do knex para que seja salvas as sessions dos usuários
const store = new KnexSessionStore();
const app = express();

cron.start();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: `${process.env.SECRET}`,
    resave:false, 
    saveUninitialized:false,
    cookie: {
        maxAge: 60*60*24*7, // armazena sessão para 7 dias de duração
    },
    store
}));
app.use(cookie());
app.use(routes);
app.use('/uploads/', express.static(path.resolve(__dirname, '..', 'uploads/')));
app.listen(process.env.PORT || 3333);

export default app;