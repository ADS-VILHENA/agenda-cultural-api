import express, { request, response } from 'express';
import knex from './database/connection';
import expressValidator from 'express-validator';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';



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
        const checkMail = await knex
            .select('*')
            .from('organizador')
            .where('email', email);


        //verifica se a query retornou algum valor, para que não seja cadastrado um email duplicado
        if (checkMail.length > 0){
            return response.json({ create: false });
        }

        else{
            //gravando senha criptografada no banco, usando bcrypt e hash
            bcrypt.hash(senha, saltRounds, async function (err, hash){
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

    
    const user =  await knex('organizador')
        .select('senha')
        .where('email', email)
        .first();   
    
    if(user != undefined){
        bcrypt.compare(senha, user.senha).then(async function(result) {
            if (result){
                const id = await knex('organizador').select('id', 'email', 'nome').where('email', email).first();
                return response.json(id);
            }
            else {
                return response.json({login: "senha ou usuário incorreto"});
            }
        });
    }else {
        return response.json({login: "senha ou usuário incorreto"})
    }
});


//rota para cadastro de categoria
routes.post('/categoria', async (request, response) => {
    
    const {
        nome,
        descricao,
        imagem
    } = request.body;

    const categoriaExists = await knex('categorias')
        .select('id')
        .where('nome', nome);
    
    
    if (categoriaExists.length > 0){
        return response.json({exists: "categoria já cadastrada no sistema"});
    }
    else {
        await gravaCategoria();
    }

    async function gravaCategoria(){
        try {
            await knex('categorias').insert({
                nome,
                descricao,
                imagem
            });
            return response.json(true);
        } catch (e) {
            console.log(e);
            return response.json(false);
        }
    }
});



export default routes;