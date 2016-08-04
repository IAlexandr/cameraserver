import {Router} from 'express';
import cm from './../cams-manager';

const router = Router();

router.get('/', function (req, res) {
  cm.getCCoders((err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(result);
  });
});
router.get('/working', function (req, res) {
  cm.getWorkingCCoders((err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(result);
  });
});
router.post('/all/start', function (req, res) {
  cm.startAll();
  return res.json({ operation: 'startAll', state: 'starting' });
});

router.post('/all/stop', function (req, res) {
  cm.stopAll();
  return res.json({ operation: 'stopAll', state: 'starting' });
});

router.post('/all/restart', function (req, res) {
  cm.restartAll();
  return res.json({ operation: 'restartAll', state: 'starting' });
});

router.post('/:cameraId/start', function (req, res) {
  cm.start(req.params.cameraId, (err, ccInfo) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(ccInfo);
  });
});

router.post('/:cameraId/stop', function (req, res) {
  cm.stop(req.params.cameraId, (err, ccInfo) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(ccInfo);
  });
});

router.get('/:cameraId/restart', function (req, res) {
  cm.restart(req.params.cameraId, (err, ccInfo) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(ccInfo);
  });
});

export default {
  route: 'cameracoders',
  router
};
