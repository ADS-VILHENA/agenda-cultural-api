import knex from '../database/connection';
import { Request, Response } from 'express';
import { format, parseISO } from 'date-fns';

class EventoController {
    async create(request: Request, response: Response){
        
        const { 
            titulo,
            descricao,
            endereco,
            localizacao,
            telefone,
            data,
            hora,
            id_categoria
        } = request.body;

        const id_organizador = response.locals.user;
        const logo = request.file.filename;


        //querys para validação no banco de dados
        const checkEvento = await knex('eventos')
            .select('id')
            .where({
                'titulo': titulo,
                'descricao': descricao
            });        

        const checkOrganizador = await knex('organizador')
            .select('id')
            .where('id', id_organizador);

        const checkCategoria = await knex('categorias')
            .select('id')
            .where('id', id_categoria);


        
        //condições para se criar um evento
        if (checkEvento.length > 0) {
            return response.status(409).send({message: 'Evento já está cadastrado'});

        } else if (checkOrganizador.length == 0) {
            return response.status(404).send({message: 'Organizador não encontrado'});

        } else if (checkCategoria.length == 0) {
            return response.status(404).send({message: 'Categoria não encontrada'});
            
        }
        else {
            try {
                await knex('eventos').insert({
                    titulo,
                    descricao,
                    endereco,
                    localizacao,
                    telefone,
                    data,
                    hora,
                    logo,
                    id_categoria,
                    id_organizador
                });
                return response.status(200).send({message: 'Evento cadastrado com sucesso!'})
            } catch (error) {
                return response.status(500).send({message: 'Ocorreu um erro ao cadastrar o evento, tente novamente.', erro: error})
            }
        }
        
    };




    async view(request: Request, response: Response) {
        const { id } = request.params;
        
        const eventos = await knex('eventos')
            .select('titulo', 'descricao', 'id', 'status')
            .where('id_categoria', id)
            .orderBy('data');

        if (eventos.length > 0) {
            return response.status(200).send(eventos);
        } else if(eventos.length == 0){
            return response.status(404).send({message: "Nenhum evento cadastrado para essa categoria!"});
        } else {
            return response.status(500).send({message: 'Ocorreu um erro ao buscar pelos eventos relacionados a essa categoria'});
        }
    }




    async viewDetails(request: Request, response: Response) {
        const { id } = request.params;

        const detalhes = await knex.select('nome', 'eventos.endereco as evtEndereco', 'eventos.telefone as evtTelefone','*')
            .from('eventos')
            .innerJoin('organizador', 'organizador.id', 'eventos.id_organizador')
            .where('eventos.id', id);

        const serializedEvento = detalhes.map(detalhes => {
            //função do pacote date-fns para conversão de string para o tipo Date
            const date = detalhes.data;
            return {
                titulo: detalhes.titulo,
                logo: `${process.env.URL}/${detalhes.logo}`,
                descricao: detalhes.descricao,
                endereco: detalhes.evtEndereco,
                localizacao: detalhes.localizacao,
                telefone: detalhes.evtTelefone,
                data: format(date, 'dd/MM/yyyy'),
                hora: detalhes.hora,
                organizador: detalhes.nome,
                status: detalhes.status
            };
        });
    
        if(serializedEvento.length > 0){
            response.status(200).send(serializedEvento);
        } 
        else {
            return response.status(404).send({ message: 'Ops, nada para ver aqui...'})
        }
    }



    async orgView(request: Request, response: Response){
            
        const id = response.locals.user;

        const eventos = await knex('eventos').join('organizador', 'eventos.id_organizador', '=', 'organizador.id')
            .select('titulo', 'descricao', 'logo', 'eventos.id', 'data', 'nome')
            .where('id_organizador', id)
            .orderBy('data');
    
        
        const serializedEvento = eventos.map(eventos => {
            return { 
                titulo: eventos.titulo,
                logo: `${process.env.URL}/${eventos.logo}`,
                descricao: eventos.descricao,
                id: eventos.id,
                organizador: eventos.nome
            }
        }); 

        if(serializedEvento.length > 0){
            response.status(200).send(serializedEvento);
        } 
        else {
            return response.status(404).send({ message: 'Ops, nada para ver aqui...'})
        }
        
    };



    async update(request: Request, response: Response){
        
        const { id } = request.params;
        const {
            titulo,
            descricao,
            endereco,
            localizacao,
            telefone,
            data,
            hora,
            id_categoria
        } = request.body;
        let logo;

        if(typeof request.file !== 'undefined'){
            logo = request.file.filename;
        }

        const org = response.locals.user;

        const update = await knex('eventos')
            .where({
                'id': id,
                'id_organizador': org
            })
            .update({
                titulo: titulo,
                descricao: descricao,
                endereco: endereco,
                localizacao: localizacao,
                telefone: telefone,
                data: data,
                hora: hora,
                logo: logo,
                id_categoria: id_categoria 
            });
        
        if(update){
            return response.status(200).send({ message: 'Alterado com sucesso!' });
        } else {
            return response.status(404).send({ message: 'Evento não encontrado.' })
        }
        
    }
        


    async delete(request: Request, response: Response){

        const { id } = request.params;
        const org = response.locals.user;

        if (await knex('eventos').where({'id': id,'id_organizador': org}).delete()){
            return response.status(200).send({ message: 'Evento excluído com sucesso!'});
        } else{
            return response.status(404).send({ message: 'Evento não encontrado.' })
        };
    
    }

}

export default EventoController;