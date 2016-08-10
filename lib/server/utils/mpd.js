import xml from 'xml';
import dg from 'debug';
import moment from 'moment';
const debug = dg('cameraserver');
moment.locale('ru');

const declaration = { declaration: { encoding: 'UTF-8' } };

function prepMpdAttrs ({ mpdInfo, mediaPresentationDuration }) {
  const {
    minBufferTime,
    minimumUpdatePeriod,
    suggestedPresentationDelay,
    availabilityStartTime,
    publishTime,
  } = mpdInfo._attr;

  let _attr = {
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'xsi:schemaLocation': 'urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
    'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
    'type': 'dynamic',
    minBufferTime
  };

  if (!mediaPresentationDuration) {
    _attr = Object.assign(_attr, {
      minimumUpdatePeriod,
      suggestedPresentationDelay,
      availabilityStartTime,
      publishTime,
    });
  } else {
    _attr = Object.assign(_attr, {
      type: 'static',
      mediaPresentationDuration,
    });
  }

  return { _attr }
}

function prepMpd ({ mpdAttr, mpdInfo, SegmentTimeline }) {
  return [
    {
      MPD: [
        mpdAttr,
        {
          ProgramInformation: [
            {
              'Title': 'Media Presentation'
            }
          ]
        },
        {
          Period: [
            {
              _attr: {
                'start': mpdInfo.Period.attr.start
              }
            },
            {
              AdaptationSet: [
                {
                  _attr: mpdInfo.Period.AdaptationSet.attr
                },
                {
                  Representation: [
                    {
                      _attr: mpdInfo.Period.AdaptationSet.Representation.attr
                    },
                    {
                      SegmentTemplate: [
                        {
                          _attr: mpdInfo.Period.AdaptationSet.Representation.SegmentTemplate.attr
                        },
                        {
                          SegmentTimeline
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

function prepSegmentTimes ({ timeScale, segments, sessionStartTime }) {
  const segmentDurations = [];
  segments.forEach((segment) => {
    const r = segment.S._attr.r || 0;
    for (let i = 0; i <= r; i++) {
      segmentDurations.push(parseInt(segment.S._attr.d));
    }
  });
  const segmentTimeDurations = segmentDurations.map((duration) => {
    return duration / timeScale;
  });
  let currentTime = moment(sessionStartTime);
  const segmentTimes = segmentTimeDurations.map((sTimeDuration) => {
    currentTime = currentTime.add(sTimeDuration, 's');
    return currentTime.toISOString();
  });
  debug('>>segmentTimes', segmentTimes.length);
  return { segmentDurations, segmentTimeDurations, segmentTimes };
}

function prepSegmentTimeline (segmentDurations, firstSegmentIndex, lastSegmentIndex) {
  let result = [];
  let durationsTemp = 0;
  let countTemp = 0;
  const body = [];
  segmentDurations.forEach((timeDuration, i) => {
    if (i < firstSegmentIndex) {
      durationsTemp += timeDuration;
      countTemp++;
    }

    if (i >= firstSegmentIndex && i <= lastSegmentIndex) {
      body.push({
        S: [
          {
            _attr: {
              d: timeDuration
            }
          }
        ]
      });
    }
  });
  if (durationsTemp > 0) {
    result.push({
      S: [{
        _attr: {
          t: 0,
          d: segmentDurations[0]
        }
      }]
    });
    const averageDuration = parseInt(durationsTemp / countTemp);
    debug('durationsTemp', durationsTemp);
    debug('countTemp', countTemp);
    debug('averageDuration', averageDuration);
    const durationTempTail = durationsTemp - (averageDuration * parseInt(countTemp));
    debug('durationTempTail', durationTempTail);
    result.push({
      S: [{
        _attr: {
          r: countTemp,
          d: averageDuration
        }
      }]
    });
    if (durationTempTail) {
      result.push({
        S: [{
          _attr: {
            d: durationTempTail
          }
        }]
      });
    }
  }
  result = result.concat(body);
  // debug('result segmentTimeLine', JSON.stringify(result, null, 2));
  return result;
}

export function generate (prms, cb) {
  const { session, query } = prms;
  const live = !Object.keys(query).length > 0;
  const mpdInfo = session.mpdInfo;
  debug('live', live);
  if (live) {
    const mpdAttr = prepMpdAttrs({ mpdInfo });
    const SegmentTimeline = mpdInfo.Period.AdaptationSet.Representation.SegmentTemplate.SegmentTimeline;
    return cb(null, xml(prepMpd({ mpdAttr, mpdInfo, SegmentTimeline }), declaration));
  } else {
    const { startTime, endTime } = query;
    debug('query', query);
    if (!startTime || !endTime) {
      return cb(new Error('Нет параметров startTime||endTime'));
    }
    const timeScale = mpdInfo.Period.AdaptationSet.Representation.SegmentTemplate.attr.timescale;
    const sessionStartTime = mpdInfo._attr.availabilityStartTime + '.000Z';
    const segments = mpdInfo.Period.AdaptationSet.Representation.SegmentTemplate.SegmentTimeline;
    debug('sessionStartTime', sessionStartTime);
    debug('segments.length', segments.length);
    const { segmentDurations, segmentTimeDurations, segmentTimes } = prepSegmentTimes({
      timeScale,
      segments,
      sessionStartTime
    });

    const resultSegmentTimes = segmentTimes.filter((segmentTime, i) => {
      if (moment(segmentTime).isSameOrAfter(startTime) && moment(segmentTime).isSameOrBefore(endTime)) {
        debug('filter true', i, segmentTime);
        return true;
      }
      return false;
    });
    const firstSegmentIndex = segmentTimes.indexOf(resultSegmentTimes[0]);
    const lastSegmentIndex = segmentTimes.indexOf(resultSegmentTimes[resultSegmentTimes.length - 1]);
    debug('firstSegmentIndex', firstSegmentIndex);
    debug('lastSegmentIndex', lastSegmentIndex);
    let presentationTimeOffset = 0;
    for (let i = 0; i <= firstSegmentIndex; i++) {
      presentationTimeOffset += segmentDurations[i];
    }
    mpdInfo.Period.AdaptationSet.Representation.SegmentTemplate.attr.presentationTimeOffset = presentationTimeOffset;
    debug('presentationTimeOffset', presentationTimeOffset);

    let mediaPresentationDuration = 0;
    for (let i = 0; i <= lastSegmentIndex; i++) {
      if (i >= firstSegmentIndex) {
        mediaPresentationDuration += segmentDurations[i];
      }
    }
    debug('1. mediaPresentationDuration', mediaPresentationDuration);
    mediaPresentationDuration = mediaPresentationDuration / timeScale;
    debug('2. mediaPresentationDuration (/ timeScale)', mediaPresentationDuration);
    mediaPresentationDuration = 'PT' + mediaPresentationDuration.toFixed(2) + 'S';
    debug('3. mediaPresentationDuration (toFixed)', mediaPresentationDuration);

    const mpdAttr = prepMpdAttrs({ mpdInfo, mediaPresentationDuration });
    const SegmentTimeline = prepSegmentTimeline(segmentDurations, firstSegmentIndex, lastSegmentIndex);
    return cb(null, xml(prepMpd({ mpdAttr, mpdInfo, SegmentTimeline }), declaration));
  }
}
