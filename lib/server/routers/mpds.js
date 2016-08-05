import express, {Router} from 'express';
import options from './../../../options';
import db from './../db';
import {generate} from './../utils/mpd';

const router = Router();

router.get('/:cameraId/mpd', function (req, res) {
  const _id = req.params.cameraId;
  db.Cameras.findById(_id, (err, doc) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!doc) {
      return res.status(500).json(new Error('Камера не зарегистрирована.'));
    }
    generate({ cameraId: doc._id }, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.set('Content-Type', 'text/xml');
      return res.send(result);
    });
  });
});

router.use('/', express.static(options.sourceDirPath));

export default {
  route: 'mpds',
  router
};
