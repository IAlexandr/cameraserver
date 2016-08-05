import db from './../db';
import xml from 'xml';

const declaration = { declaration: { encoding: 'UTF-8' } };

const SegmentTimeline = [
  {
    S: [
      {
        _attr: {
          't': '0',
          'd': '457194',
        }
      }
    ]
  },
  {
    S: [
      {
        _attr: {
          'r': '2',
          'd': '460795',
        }
      }
    ]
  },
  {
    S: [
      {
        _attr: {
          'd': '460797',
        }
      }
    ]
  },
  {
    S: [
      {
        _attr: {
          'd': '460793',
        }
      }
    ]
  },
  {
    S: [
      {
        _attr: {
          'd': '460796',
        }
      }
    ]
  },
  {
    S: [
      {
        _attr: {
          'd': '460795',
          'r': '3'
        }
      }
    ]
  },
  {
    S: [
      {
        _attr: {
          'd': '345595',
        }
      }
    ]
  }
];

const template = [
  {
    MPD: [
      {
        _attr: {
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'xsi:schemaLocation': 'urn:mpeg:DASH:schema:MPD:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
          'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
          'type': 'dynamic',
          'minimumUpdatePeriod': 'PT5S',
          'suggestedPresentationDelay': 'PT5S',
          'availabilityStartTime': '2016-08-05T07:05:00',
          'publishTime': '2016-08-05T07:06:21',
          'minBufferTime': 'PT5.1S'
        }
      },
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
                  'contentType': 'video',
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


export function generate (prms, cb) {

  return cb(null, xml(template, declaration));
}
