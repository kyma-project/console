export class DocProcessor {
  constructor(doc = []) {
    // for rewrite readonly fields
    this.doc = JSON.parse(JSON.stringify(doc));
  }

  replaceImagePaths = () => {
    const assetsRegexp = /\.\/assets/g;
    const docsUrl = this.doc.substring(0, this.doc.lastIndexOf('/'));
    if (this.doc.search(assetsRegexp) !== -1) {
      this.doc = this.doc.replace(assetsRegexp, `${docsUrl}/assets`);
    }
    return this;
  };

  removeMatadata = () => {
    const metadataRegexp = '---';
    const docsBeginingIndex = this.doc.indexOf(metadataRegexp, 3) + 3;
    this.doc = this.doc.substring(docsBeginingIndex, this.doc.length);
    return this;
  };

  result() {
    return this.doc;
  }
}
