import {Router} from 'express';
import db from './../db';

const router = Router();

router.get('/', function (req, res) {
  db.CameraTypes.find({}, 0, 0, (err, docs) => {
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
    db.CameraTypes.updateById(req.body._id, req.body, cb);
  } else {
    db.CameraTypes.insert(req.body, cb);
  }
});


router.delete('/', function (req, res) {
  const _id = req.body.cameraTypeId;
  db.CameraTypes.remove({_id}, (err, docs) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(docs);
  });
});

export default {
  route: 'camera-types',
  router
};
