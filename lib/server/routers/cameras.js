import { Router } from 'express';

const router = Router();

router.get('/', function (req, res) {
  res.json({
    test: 'ok'
  });
});

export default {
  route: 'cameras',
  router
};
