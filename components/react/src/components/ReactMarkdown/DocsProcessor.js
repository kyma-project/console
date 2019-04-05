export class DocProcessor {
  constructor(doc = []) {
    // for rewrite readonly fields
    this.doc = JSON.parse(JSON.stringify(doc));
  }

  replaceImagePaths = () => {
    console.log(this.doc);
    const assetsRegexp = /\.\/assets/g;
    const docsUrl = this.doc.url.substring(0, this.doc.url.lastIndexOf('/'));
    if (this.doc.source.search(assetsRegexp) !== -1) {
      this.doc.source = this.doc.source.replace(
        assetsRegexp,
        `${docsUrl}/assets`,
      );
    }
    return this;
  };

  removeMatadata = () => {
    const metadataRegexp = '---';
    const docsBeginingIndex = this.doc.source.indexOf(metadataRegexp, 3) + 3;
    this.doc.source = this.doc.source.substring(
      docsBeginingIndex,
      this.doc.source.length,
    );
    return this;
  };

  result() {
    return this.doc;
  }
}
