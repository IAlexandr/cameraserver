import express, { Router } from 'express';
import options from '../../../options';
import camerasRouter from './cameras';
import cameraTypesRouter from './camera-types';
import linksRouter from './links';
import cameracoderRouter from './cameracoders';
import path from 'path';

const routers = [
  camerasRouter,
  cameraTypesRouter,
  linksRouter,
  cameracoderRouter
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
  app.use(root + 'static', express.static(path.resolve(process.cwd(), 'lib/static')));
  app.use(root + 'mpds', express.static(options.sourceDirPath));
};
