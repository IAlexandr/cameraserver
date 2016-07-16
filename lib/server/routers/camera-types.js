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

export default {
  route: 'camera-types',
  router
};
