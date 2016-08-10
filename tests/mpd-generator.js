import {generate} from './../lib/server/utils/mpd';
import db from './../lib/server/db';
import dg from 'debug';
const debug = dg('cam-mpd-generator-test');

const cameraId = 'sJNPJo2aDLjvu9Nr';
const query = {
  startTime: '2016-08-10T13:35:00.000Z',
  endTime: '2016-08-10T13:35:30.000Z'
};

db.Sessions.find({cameraId}, 0, 0, (err, docs)=> {
  if (err) {
    debug('err', err);
  }
  if (docs[0]) {
    generate({ session: docs[0], query }, (err, result) => {
      if (err) {
        debug('err', err);
      } else {

      }

      debug(result);
    });
  } else {
    debug('Сессия получения видео отстутствует.');
  }
});
