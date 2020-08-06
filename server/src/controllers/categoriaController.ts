import knex from '../database/connection';
import { Request, Response } from 'express';


class CategoriaController {
    async create (request: Request, response: Response) {
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
    };
}

export default CategoriaController;