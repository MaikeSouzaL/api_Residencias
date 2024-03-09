import { Router } from 'express';
import ClientController from './app/Controllers/ClientController';

const routes = new Router();
routes.get('/client', ClientController.store);

export default routes;
