import knex from '../database/connection';
import { Request, Response } from 'express';


class CategoriaController {
    async create(request: Request, response: Response) {
        
        const {
            nome,
            descricao
        } = request.body;

        const imagem = request.file.filename;

        const categoriaExists = await knex('categorias')
            .select('id')
            .where('nome', nome);
        
        
        if (categoriaExists.length > 0){
            return response.status(409).send({message: 'Categoria já cadastrada.'});
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
                return response.status(200).send({message: 'Categoria cadastrada com sucesso!'});
            } catch (error) {
                return response.status(500).send({message: 'Ocorreu um erro ao cadastrar a categoria, tente novamente.', erro: error});
            }
        }
    };

    async view(request: Request, response: Response) {
        const categorias = await knex('categorias').select('*');
        
        const serializedCategoria = categorias.map(categoria => {
            return {
                id: categoria.id,
                nome: categoria.nome,
                image_url: `${process.env.URL}/${categoria.imagem}`,
                descricao: categoria.descricao
            };
        });
        if(serializedCategoria.length > 0) {
            return response.status(200).send(serializedCategoria);
        }
        else {
            return response.status(404).send({ message: 'Ops, nenhuma categoria cadastrada...'})
        }
        
    };

    async update(request: Request, response: Response) {
        
        const { id } = request.params;
        const {
            nome,
            descricao
        } = request.body;
        let imagem;

        if(typeof request.file !== 'undefined'){
            imagem = request.file.filename;
        }

        const update = await knex('categorias')
            .where('id', id)
            .update({
                nome: nome,
                descricao: descricao,
                imagem: imagem
            });
        
        if(update){
            return response.status(200).send({ message: 'Alterado com sucesso!' });
        } else {
            return response.status(404).send({ message: 'Organizador não encontrado!' })
        }
    };

    async delete(request: Request, response: Response) {
        
        const { id } = request.params;

        if (await knex('categorias').where('id', id).delete()){
            return response.status(200).send({ message: 'Conta excluída com sucesso!' });
        } else{
            return response.status(404).send({ message: 'Cadastro não encontrado.' })
        };
    };
}

export default CategoriaController;