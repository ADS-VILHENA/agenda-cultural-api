import knex from '../database/connection';
import { Request, Response } from 'express';

class EventoController {
    async create(request: Request, response: Response){
        const { 
            titulo,
            descricao,
            endereco,
            localizacao,
            telefone,
            data,
            logo,
            id_categoria,
            id_organizador
        } = request.body;

        const checkEvento = await knex('eventos')
            .select('id')
            .where({
                'titulo': titulo,
                'descricao': descricao
        })

        if (checkEvento != undefined) {
            return response.status(409).send({message: 'evento já está cadastrado'});
        } 
        else {
            await gravaEvento();
        }

        async function gravaEvento(){
            try {
                await knex('eventos').insert({
                    titulo,
                    descricao,
                    endereco,
                    localizacao,
                    telefone,
                    data,
                    logo,
                    id_categoria,
                    id_organizador
                });
                return response.status(200).send({message: 'Evento cadastrado com sucesso!'})
            } catch (error) {
                return response.status(500).send({message: 'Ocorreu um erro ao cadastrar o evento, tente novamente.', erro: error})
            }
        };
    }

    async view(request: Request, response: Response) {
        const eventos = await knex('eventos').select('*');
    }
}

export default EventoController;