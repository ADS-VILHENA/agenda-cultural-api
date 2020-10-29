import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from '../jobs/checkEvento';

const app = express();


cron.start();
//variável para permitir qualquer URL ter acesso a api
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes);
app.use('/uploads/', express.static(path.resolve(__dirname, '..', 'uploads/')));
app.listen(process.env.PORT || 3333);

export default app;