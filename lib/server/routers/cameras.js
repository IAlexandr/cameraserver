import {Router} from 'express';
import db from './../db';

const router = Router();

router.get('/', function (req, res) {
  db.Cameras.find({}, (err, docs) => {
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