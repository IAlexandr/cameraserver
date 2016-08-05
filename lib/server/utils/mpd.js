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

function prepMpdAttrs ({ live, mpdInfo }) {
  const {
    minBufferTime,
    minimumUpdatePeriod,
    suggestedPresentationDelay,
    availabilityStartTime,
    publishTime,
  } = mpdInfo.attr;

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
function prepMpd ({ live, mpdInfo }) {
  // TODO
  const mpdAttr = prepMpdAttrs(live, mpdInfo);
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


export function generate (prms, cb) {
  const {session} = prms;

  return cb(null, xml(prepMpd({live: true, mpdInfo: session.mpdInfo}), declaration));
}
