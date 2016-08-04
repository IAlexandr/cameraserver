import {Router} from 'express';
import db from './../db';
import cm from './../cams-manager';

const router = Router();

router.get('/', function (req, res) {
  db.Cameras.find({}, 0, 0, (err, docs) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(docs);
  });
});
// UPSERT
router.post('/', function (req, res) {
  if (!req.body) {
    return res.status(500).json(new Error('Нет данных для добавления!'));
  }
  const cb = function (err, docs) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(docs);
  };

  if (req.body._id) {
    db.Cameras.updateById(req.body._id, req.body, (err, docs) => {
      if (!err) {
        // TODO остановить камеракодер, запустить с новыми свойствами
      }
      return cb(err, docs);
    });
  } else {
    db.Cameras.insert(req.body, (err, docs) => {
      if (!err) {
        return res.status(500).json(err);
      }
      const camera = docs;
      db.CameraTypes.find({ _id: camera.cameraTypeId }, 0, 0, (err, docs) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (docs[0]) {
          cm.add({ camera: camera, type: docs[0] }, (err) => {
            if (err) {
              return res.status(500).json(err);
            }
            return cb(err, docs);
          });
        } else {
          return res.status(500).json(new Error('Нет типа камеры.'));
        }
      });
    });
  }
});

router.delete('/', function (req, res) {
  const _id = req.body.cameraId;
  cm.remove(_id, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    db.Cameras.remove({_id}, (err, docs) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.json(docs);
    });
  });
});

export default {
  route: 'cameras',
  router
};
