export class DocsProcessor {
  constructor(docs = []) {
    // for rewrite readonly fields
    this.docs = JSON.parse(JSON.stringify([...docs]));
  }

  replaceImagePaths = () => {
    const assetsRegexp = /\.\/assets/g;
    let docsUrl = null;
    this.docs.map(doc => {
      docsUrl = doc.url.substring(0, doc.url.lastIndexOf('/'));
      if (doc.source.search(assetsRegexp) !== -1) {
        doc.source = doc.source.replace(assetsRegexp, `${docsUrl}/assets`);
      }
      return doc;
    });

    return this;
  };

  removeMatadata = () => {
    const metadataRegexp = '---';
    let docsBeginingIndex = null;

    this.docs.map(doc => {
      docsBeginingIndex = doc.source.indexOf(metadataRegexp, 3) + 3;
      doc.source = doc.source.substring(docsBeginingIndex, doc.source.length);
      return doc;
    });

    return this;
  };

  result() {
    return this.docs;
  }
}
