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

        if (checkEvento.length > 0) {
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
        const { id } = request.params;
        
        const eventos = await knex('eventos')
            .select('titulo', 'descricao')
            .where('id_categoria', id);

        if (eventos) {
            return response.status(200).send(eventos);
        } else {
            return response.status(500).send({message: 'Ocorreu um erro ao buscar pelos eventos relacionados a essa categoria'});
        }
    }

    async viewDetails(request: Request, response: Response) {
        const { id } = request.params;

        const detalhes = await knex('eventos')
            .select('nome', '*')
            .innerJoin('organizador', 'organizador.id', 'eventos.id_organizador')
            .where('eventos.id', id);

        const serializedEvento = detalhes.map(detalhes => {
            return {
                titulo: detalhes.titulo,
                logo: `http://localhost:3333/uploads/${detalhes.logo}`,
                descricao: detalhes.descricao,
                endereco: detalhes.endereco,
                localizacao: detalhes.localizacao,
                telefone: detalhes.telefone,
                data: detalhes.data,
                organizador: detalhes.nome,
            };
        });
    
        if(serializedEvento.length > 0){
            response.status(200).send(serializedEvento);
        } 
        else {
            return response.status(404).send({ message: 'Ops, nada para ver aqui...'})
        }
    }
}

export default EventoController;