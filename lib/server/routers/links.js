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

router.post('/', function (req, res) {
  if (!req.body) {
    return res.status(500).json(new Error('Нет данных для добавления!'));
  }
  db.Links.insert(req.body, function (err, docs) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(docs);
  });
});

export default {
  route: 'links',
  router
};
