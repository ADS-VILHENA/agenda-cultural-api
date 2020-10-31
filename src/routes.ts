import express, { Router } from 'express';
import OrgController from './controllers/organizadorController';
import CtgController from './controllers/categoriaController';
import EvtController from './controllers/eventoController';
import { celebrate, Segments, Joi } from 'celebrate';
import uploads from './controllers/imageController';
import { auth } from './middleware/auth';


const routes = express();
const orgController = new OrgController();
const ctgController = new CtgController();
const evtController = new EvtController();


/*
    Rotas que não necessitarem de token estarão como as primeiras listadas
    @Matheus Anciloto
*/


//rota para visualização de todas categorias
routes.get('/', ctgController.view);


//rota para visualização dos eventos por categoria
routes.get('/categoria/:id/eventos', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), evtController.view);


//rota para visualização dos detalhes do evento
routes.get('/detalhes/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), evtController.viewDetails);


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


/*
Rotas a partir de agora precisarão de um token para serem acessadas.

Por conta disso a linha a seguir irá tratar essa parte, chamando o fonte auth.ts

*/

routes.use(auth);


//rota para cadastro de categoria
routes.post('/categoria', uploads.single('imagem'), ctgController.create);


//rota para alterar categoria
routes.put('/categoria/:id', uploads.single('imagem'), celebrate({
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
routes.post('/evento', uploads.single('logo'), celebrate({
    [Segments.BODY]: Joi.object().keys({
        titulo: Joi.string().required(),
        descricao: Joi.string().required(),
        endereco: Joi.string().required(),
        localizacao: Joi.string().required(),
        telefone: Joi.string().required(),
        data: Joi.string().required(),
        hora: Joi.string().required(),
        id_categoria: Joi.required()
    })
}), evtController.create)




//rota para alterar um evento
routes.put('/evento/:id', uploads.single('logo'), celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), evtController.update);


//rota para deletar um evento
routes.delete('/evento/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), evtController.delete);


//rota para visualizar eventos relacionados ao organizador
routes.get('/organizador/eventos', evtController.orgView);


//rota para alterar organizador
routes.put('/organizador', orgController.update);


//rota para deletar conta de organizador
routes.delete('/organizador', orgController.delete);


export default routes;