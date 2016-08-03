import {Router} from 'express';
import db from './../db';

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
        // TODO добавить камеракодер
      }
      return cb(err, docs);
    });
  }
});

router.delete('/', function (req, res) {
  const _id = req.body.cameraId;
  db.Cameras.remove({_id}, (err, docs) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(docs);
  });
});

export default {
  route: 'cameras',
  router
};
