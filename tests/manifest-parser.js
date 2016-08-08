import parser from './../lib/server/utils/manifest-parser';
const mpdPth = 'D:/ai/PROJECTS-TEMP/dash/manifest.mpd';

console.log('START TEST MANIFEST-PARSER');
parser(mpdPth, (err, result) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('result:', result);
  }
});
