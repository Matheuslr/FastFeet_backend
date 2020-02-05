import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliverymanDeliveriesController from './app/controllers/DeliverymanDeliveriesController';
import StartDateController from './app/controllers/StartDateController';
import EndDateController from './app/controllers/EndDateController';
import OrderProblemController from './app/controllers/OrderProblemController';
import ProblemHandlerController from './app/controllers/ProblemHandlerController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.get(
    '/deliveryman/:deliveryman_id',
    DeliverymanDeliveriesController.show
);

routes.get(
    '/deliveryman/:deliveryman_id/deliveries',
    DeliveriesController.index
);

routes.put(
    '/deliveryman/:deliveryman_id/order/:order_id/startdate',
    StartDateController.update
);

routes.put(
    '/deliveryman/:deliveryman_id/order/:order_id/enddate',
    EndDateController.update
);

routes.get('/order/:order_id/problems', OrderProblemController.index);
routes.post('/order/:order_id/problems', OrderProblemController.store);

routes.put(
    '/problem/:order_id/cancel-delivery',
    ProblemHandlerController.update
);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.put('/users', UserController.update);
routes.delete('/users', UserController.delete);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:deliverymanId', DeliverymanController.update);
routes.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:orderId', OrderController.update);
routes.delete('/orders/:orderId', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
