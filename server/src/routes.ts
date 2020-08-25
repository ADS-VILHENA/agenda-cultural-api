import express from 'express';
import OrgController from './controllers/organizadorController';
import CtgController from './controllers/categoriaController';

const routes = express.Router();
const orgController = new OrgController();
const ctgController = new CtgController();

//rota de cadastro de um organizador de eventos da agenda
routes.post('/organizador', orgController.create);

//rota para login do organizador
routes.post('/organizador/login', orgController.login);

//rota para cadastro de categoria
routes.post('/categoria', ctgController.create);

//rota para solicitação de redefenição de senha
routes.post('/organizador/redefine', orgController.redefine);

export default routes;