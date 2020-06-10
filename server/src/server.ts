import express, { request } from 'express';

const app = express();

const users = [
    'Diego',
    'Fernandes'
];


app.get('/users/:id', (request, response) => {
    const id = request.params.id;

})

app.listen(3333);

