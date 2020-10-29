import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from '../jobs/checkEvento';

const app = express();


cron.start();
//função para permitir qualquer URL ter acesso a api
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes);
app.use('/uploads/', express.static(path.resolve(__dirname, '..', 'uploads/')));
app.listen(process.env.PORT || 3333);

export default app;