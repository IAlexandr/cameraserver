import {Router} from 'express';
import fs from 'fs';
import options from './../../../options';

const router = Router();

router.get('/:cameraId/manifest.mpd', function (req, res) {
  const mpdPath = options.sourceDirPath + '/' + req.params.cameraId + '/manifest.mpd';
  fs.exists(mpdPath, (exists) => {
    if (exists) {
      // const mpdReadStream = fs.createReadStream(mpdPath);
      // mpdReadStream.pipe(res);
      res.sendFile(mpdPath);
    } else {
      res.status(400).json(new Error('Манифест не найден.'));
    }
  });
});

export default {
  route: 'mpds',
  router
};
