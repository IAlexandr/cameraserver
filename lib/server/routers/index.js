import { Router } from 'express';
import options from '../../../options';
import camerasRouter from './cameras';
import cameraTypesRouter from './camera-types';

const routers = [
  camerasRouter,
  cameraTypesRouter
];

const mainRouter = Router();

mainRouter.get('/', function (req, res) {
  res.json({
    version: options.version
  });
});

const root = '/api/';

export default (app) => {
  app.use(root, mainRouter);
  routers.forEach((r) => {
    const { route, router } = r;
    app.use(root + route, router);
  });
};
