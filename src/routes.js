import { Router } from 'express';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
routes.get('/users', UserController.index);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);

routes.post('/recipients', RecipientController.store);

routes.put('/users', UserController.update);
routes.put('/recipients/:id', RecipientController.update);

routes.delete('/users', UserController.delete);
routes.delete('/recipients/:id', RecipientController.delete);
export default routes;
