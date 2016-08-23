import express, {Router} from 'express';
import options from './../../../options';
import db from './../db';
import {generate} from './../utils/mpd';
import dg from 'debug';
const debug = dg('cameraserver');
import ramSessions from './../db/ram-sessions';

const router = Router();

router.get('/:cameraId/mpd', function (req, res) {
  const cameraId = req.params.cameraId;
  const query = req.query;
  db.Cameras.findById(cameraId, (err, doc) => {
    if (err) {
	return res.status(500).json({errmessage: err.message});
    }
    if (!doc) {
      return res.status(500).json({ errmessage: 'Камера не зарегистрирована.'});
    }
    if (!ramSessions.data.hasOwnProperty(cameraId)) {
      return res.status(500).json({ errmessage: 'Сессия получения видео отстутствует.'});
    }
    debug(ramSessions.data[cameraId]);
    generate({ cameraId, session: ramSessions.data[cameraId], query }, (err, result) => {
      if (err) {
        return res.status(500).json({ errmessage: err.message });
      }
      res.set('Content-Type', 'text/xml');
      return res.send(result);
    });


    // db.Sessions.find({cameraId: _id}, 0, 0, (err, docs)=> {
    //   if (err) {
    //     return res.status(500).json(err);
    //   }
    //   if (docs[0]) {
    //     generate({ cameraId: doc._id, session: docs[0], query }, (err, result) => {
    //       if (err) {
    //         return res.status(500).json(err);
    //       }
    //       res.set('Content-Type', 'text/xml');
    //       return res.send(result);
    //     });
    //   } else {
    //     return res.status(500).json(new Error('Сессия получения видео отстутствует.'));
    //   }
    // });

  });
});

router.use('/', express.static(options.sourceDirPath));

export default {
  route: 'mpds',
  router
};
