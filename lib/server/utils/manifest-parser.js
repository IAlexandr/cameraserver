import xmldoc from 'xmldoc';
import fs from 'fs';

export default function (mpdPth, callback) {
  const resultMpd = {};

  fs.readFile(mpdPth, (err, data) => {
    if (err) {
      return callback(err);
    }
    const xmlString = data.toString();
    const MPD = new xmldoc.XmlDocument(xmlString);
    resultMpd._attr = MPD.attr;
    const Period = MPD.childNamed('Period');
    resultMpd['Period'] = {attr: Period.attr};
    const AdaptationSet = Period.childNamed('AdaptationSet');
    resultMpd['Period']['AdaptationSet'] = {attr: AdaptationSet.attr};
    const Representation = AdaptationSet.childNamed('Representation');
    resultMpd['Period']['AdaptationSet']['Representation'] = {attr: Representation.attr};
    const SegmentTemplate = Representation.childNamed('SegmentTemplate');
    resultMpd['Period']['AdaptationSet']['Representation']['SegmentTemplate'] = {attr: SegmentTemplate.attr};


    // const xmlTag =  document.valueWithPath('type');
    // console.log(xmlTag);
    // const version =  xmlTag.valueWithPath('@version');
    // console.log(version);
    return callback(null, resultMpd);
  });
}
