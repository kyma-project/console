import XMLParser from "react-xml-parser";
import { transformer } from "./Transformer";
class Parser {
  ParseFromString(xmlString: string): any {
    const outXmlString = transformer.transformToV4(xmlString);
    return new XMLParser().parseFromString(outXmlString);
  }
}

export const parse = new Parser();
