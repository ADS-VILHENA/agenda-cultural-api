import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes);

app.use('/uploads/eventos/', express.static(path.resolve(__dirname, '..', 'uploads/eventos/')));
app.use('/uploads/categorias/', express.static(path.resolve(__dirname, '..', 'uploads/categorias/')));

app.listen(process.env.PORT || 3333);

export default app;