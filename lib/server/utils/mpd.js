import db from './../db';
import xml from 'xml';

const declaration = { declaration: { encoding: 'UTF-8' } };

const SegmentTimeline = [
  {
    S: [
      {
        _attr: {
          't': '0',
          'd': '1',
          'r': '99999999'
        }
      }
    ]
  }
];

function prepMpdAttrs ({ periodProps, sessionProps }) {
  const {
    minBufferTime,
    minimumUpdatePeriod,
    suggestedPresentationDelay,
    availabilityStartTime,
    publishTime,
  } = sessionProps.MPD._attr;

  const { live } = periodProps;

  let _attr = {
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'xsi:schemaLocation': 'urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
    'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
    'type': 'dynamic',
    minBufferTime
  };

  if (live) {
    _attr = Object.assign(_attr, {
      minimumUpdatePeriod,
      suggestedPresentationDelay,
      availabilityStartTime,
      publishTime,
    });
  } else {
    // TODO
  }

  return { _attr }
}

// TODO по периоду (архив)
function prepMpd ({ live, sessionProps }) {
  // TODO
  const mpdAttr = prepMpdAttrs(live, sessionProps);
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
                'start': 'PT0.0S'
              }
            },
            {
              AdaptationSet: [
                {
                  _attr: {
                    'contentType': sessionProps.MPD.AdaptationSet._attr,
                    'segmentAlignment': 'true',
                    'bitstreamSwitching': 'true',
                    'frameRate': '25/1',
                  }
                },
                {
                  Representation: [
                    {
                      _attr: {
                        'id': '0',
                        'mimeType': 'video/mp4',
                        'codecs': 'avc1.420029',
                        'width': '704',
                        'height': '576',
                        'frameRate': '25/1'
                      }
                    },
                    {
                      SegmentTemplate: [
                        {
                          _attr: {
                            'timescale': '90000',
                            'initialization': 'init-stream$RepresentationID$.m4s',
                            'media': 'chunk-stream$RepresentationID$-$Number%05d$.m4s',
                            'startNumber': '1'
                          }
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


export function generate (prms, cb) {

  return cb(null, xml(template, declaration));
}
