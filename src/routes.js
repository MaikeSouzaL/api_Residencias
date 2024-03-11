import { Router } from 'express';
import ClientController from './app/Controllers/ClientController';

const routes = new Router();

routes.get('/client', ClientController.index);
routes.get('/client/show', ClientController.show);
routes.post('/client', ClientController.store);
routes.put('/client/:id', ClientController.update);
routes.put('/client/update/:id', ClientController.updateclient);
routes.delete('/client/:id', ClientController.destroy);
routes.put(
  '/client/update-servico/:id',
  ClientController.updateServicoRealizado,
);

export default routes;
