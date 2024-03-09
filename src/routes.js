import { Router } from 'express';
import ClientController from './app/Controllers/ClientController';

const routes = new Router();
routes.get('/client', ClientController.index);
routes.post('/client', ClientController.store);
routes.put('/client/:id', ClientController.update);

export default routes;
