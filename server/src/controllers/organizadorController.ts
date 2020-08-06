import knex from '../database/connection';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

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
            return response.json({create: "email já cadastrado"});
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
            })
            return response.json({ create: true });
        };
    }
    
    async login (request: Request, response: Response) {
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
    };

}

export default OrganizadorController;