import express from 'express';
import knex from './database/connection';

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

        //verifica se a query retornou algum valor
        if (checkMail.length > 0){
            return response.json({ success: false });
        }

        else{
            await knex('organizador').insert({
                nome,
                telefone,
                endereco,
                email,
                senha
            });
                    
            return response.json({ success: true });
        }
});

/* routes.get('/categorias', async (request, response) => {
    const categorias = await knex('categorias').select('*');

    return response.json({categorias});

});
*/
export default routes;