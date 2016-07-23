import {Router} from 'express';
import db from './../db';

const router = Router();

router.get('/', function (req, res) {
  db.Links.find({}, 0, 0, (err, docs) => {
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
    db.Links.updateById(req.body._id, req.body, cb);
  } else {
    db.Links.insert(req.body, cb);
  }
});

export default {
  route: 'links',
  router
};
