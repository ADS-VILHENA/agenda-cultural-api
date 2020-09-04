import express from 'express';
import OrgController from './controllers/organizadorController';
import CtgController from './controllers/categoriaController';
import EvtController from './controllers/eventoController';
import { celebrate, Segments, Joi } from '../node_modules/celebrate';


const routes = express();
const orgController = new OrgController();
const ctgController = new CtgController();
const evtController = new EvtController();

//rota de cadastro de um organizador de eventos da agenda
routes.post('/organizador', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        telefone: Joi.string().required().min(10).max(11),
        endereco: Joi.string().required(),
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(6),
    })
}), orgController.create);

//rota para login do organizador
routes.post('/organizador/login', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(6)
    })
}), orgController.login);

//rota para solicitação de redefenição de senha
routes.post('/organizador/redefine', orgController.redefine);

//rota para alterar organizador
routes.put('/organizador/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), orgController.update);

//rota para deletar conta de organizador
routes.delete('/organizador/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), orgController.delete);

//rota para cadastro de categoria
routes.post('/categoria', ctgController.create);

//rota para visualização de todas categorias
routes.get('/', ctgController.view);

//rota para alterar categoria
routes.put('/categoria/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), ctgController.update);

//rota para deletar categoria
routes.delete('/categoria/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), ctgController.delete);


//rota para criação de eventos
routes.post('evento', celebrate({
    [Segments.BODY]: Joi.object().keys({
        titulo: Joi.string().required(),
        descricao: Joi.string().required(),
        endereco: Joi.string().required(),
        localizacao: Joi.string(),
        telefone: Joi.string().required(),
        data: Joi.date().required(),
        logo: Joi.string(),
        id_categoria: Joi.number().required(),
        id_organizador: Joi.number().required(),
    })
}), evtController.create)




export default routes;