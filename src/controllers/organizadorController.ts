import knex from '../database/connection';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + 'src/.env'});


const saltRounds = 10;

class OrganizadorController {    
    async create (request: Request, response: Response) {
        const {
            nome,
            telefone,
            endereco,
            email,
            senha
        } = request.body;

        const checkMail = await knex
            .select('*')
            .from('organizador')
            .where('email', email);
        
        if (checkMail.length > 0){
            return response.status(409).send({message: 'Email já cadastrado'});
        }
        else {
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
            });
            return response.status(201).send({message: "Cadastro criado com sucesso!"});
        };
    }
    
    async login (request: Request, response: Response) {
        const {
            email,
            senha
        } = request.body;
    
        //verifica pelo email informado, no banco de dados
        const user =  await knex('organizador')
            .select('senha', 'id')
            .where('email', email)
            .first();   
        
        //se o retorno de usuário não for nulo é comparada a senha, usando a biblioteca bcrypt
        if(user != undefined){
            try{
                bcrypt.compare(senha, user.senha).then(async function(result) {
                    if (result){
                        const id = await knex('organizador')
                            .select('id', 'email', 'nome')
                            .where('email', email)
                            .first();
                        
                        if (request.session){
                            request.session.user = user;
                            return response.status(200).json(id);
                        }
                    }
                    else {
                        return response.status(404).send({message: 'Senha ou usuário incorreto'});
                    }
                });
            } catch(e) {
                response.status(500).send({message: "Ocorreu um erro " + e});
            }
        }else {
            return response.status(404).send({message: 'Senha ou usuário incorreto'});
        }
    };


    async redefine (request: Request, response: Response) {
        const {
            email
        } = request.body;
        
        //consulta no banco pelo email informado
        const checkMail = await knex
            .select('email')
            .from('organizador')
            .where('email', email)
            .first();
            
        //se o email corresponder a um cadastrado será realizado o envio para redefinição de senha
        if (checkMail != undefined) {
            const config = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USUARIO,
                    pass: process.env.SENHA
                }
            });
            
            const mailBody = {
                from: 'agendaculturaldevilhena@gmail.com',
                to: checkMail.email,
                subject: 'Redefinição de senha',
                text: 'teste'
            };
    
            config.sendMail(mailBody, function(error, info){
                if (error) {
                    response.status(500).send(error);
                }
                else {
                    response.status(200).send({message: 'Email de recuperação enviado com sucesso'});
                }
            });
        } else {
            
            return response.status(404).send({ message: 'Email não cadastrado' });
        }
    };

    
    async update(request: Request, response: Response){
        //verifica se o usuário está autenticado na sessão
        if(request.session){
            if(!request.session.user){
                return response.status(403).send({message: "Usuário não autenticado. Faça o login!"});
            }
        }
        
        const { id } = request.params;
        const {
            nome,
            telefone,
            endereco,
            email
        } = request.body;

        const update = await knex('organizador')
            .where('id', id)
            .update({
                nome: nome,
                telefone: telefone,
                endereco: endereco,
                email: email
            });
        
        if(update){
            return response.status(200).send({ message: 'alterado com sucesso' });
        } else {
            return response.status(404).send({ message: 'organizador não encontrado' })
        }
    };


    async delete(request: Request, response: Response){
        if(request.session){
            if(!request.session.user){
                return response.status(403).send({message: "Usuário não autenticado. Faça o login!"});
            }
        }
        const { id } = request.params;

        if (await knex('organizador').where('id', id).delete()){
            return response.status(200).send({ message: 'Conta excluída com sucesso' });
        } else{
            return response.status(404).send({ message: 'Cadastro não encontrado' })
        };
    };

}

export default OrganizadorController;