import express, { request, response } from 'express';
import knex from './database/connection';
import expressValidator from 'express-validator';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const routes = express.Router();

//rota de cadastro de um organizador de eventos da agenda
routes.post('/organizador', async (request, response) => {
        const {
            nome,
            telefone,
            endereco,
            email,
            senha
        } =  request.body;

        //query que busca email informado no banco de dados
        async function queryEmail(){
            return await knex.select('*').from('organizador').where('email', email);
        };

        const checkMail = await queryEmail();

        //verifica se a query retornou algum valor, para que não seja cadastrado um email duplicado
        if (checkMail.length > 0){
            return response.json({ create: false });
        }

        else{
            bcrypt.hash(senha, saltRounds, async function(err, hash){
                const senha = hash;
                await knex('organizador').insert({
                    nome,
                    telefone,
                    endereco,
                    email,
                    senha
                }); 
            })
            return response.json({ create: true });
        };
});


//rota para login do organizador
routes.post('/organizador/login', async (request, response) => {
    const {
        email,
        senha
    } = request.body;

    async function queryLogin(){
        return await knex.select('id').from('organizador').where({
            'email': email,
            'senha': senha
        });
    }

    const checkLogin = await queryLogin();

    if(checkLogin.length > 0){
        return response.json({ login: true });
    }
    else{
        return response.json({ login: false });
    }


});


/* routes.get('/categorias', async (request, response) => {
    const categorias = await knex('categorias').select('*');

    return response.json({categorias});

});
*/
export default routes;