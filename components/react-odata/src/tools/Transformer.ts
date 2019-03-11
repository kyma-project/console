import xslt from 'xslt';
import V2V3toV4 from './V2V3toV4';
class Transformer {
  transformToV4(xmlString: string): any {
    const options = {
      fullDocument: true,
    };
    return xslt(xmlString, V2V3toV4, options);
  }
}

export const transformer = new Transformer();
