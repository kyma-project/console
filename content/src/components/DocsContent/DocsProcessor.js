export class DocsProcessor {
  constructor(docs = []) {
    // for rewrite readonly fields
    this.docs = JSON.parse(JSON.stringify([...docs]))
  }

  replaceImagePaths = ({ type, id, version, versions }) => {
    const isVersionLatest = version === "latest";
    const currentVersion = isVersionLatest ? versions.releases[0] : version;

    this.docs = this.docs.map(doc => {
      if (doc.source.search(/.?\/?assets/g) !== -1) {
        doc.source = doc.source.replace(
          /src="\.?\/?assets/g,
          `src="/documentation/${currentVersion}/${type}/${id}/assets`,
        );
      }

      return doc;
    });

    return this;
  };

  sortByOrder = () => {
    this.docs = this.docs.sort(this.sortFnByProperty("order"));
    return this;
  };

  sortByType = () => {
    let docsTypes = [];
    this.docs.map(doc => {
      if (!docsTypes.includes(doc.type || doc.title)) {
        docsTypes.push(doc.type || doc.title);
      }
      return doc;
    });

    let sortedDocs = [];
    for (const type of docsTypes) {
      for (const doc of this.docs) {
        if (type === doc.type || (!doc.type && type === doc.title)) {
          sortedDocs.push(doc);
        }
      }
    }
    this.docs = sortedDocs;

    return this;
  };

  sortFnByProperty = sortBy => {
    return (a, b) => {
      if (a[sortBy] && b[sortBy]) {
        const nameA = a[sortBy].toString().toLowerCase();
        const nameB = b[sortBy].toString().toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      }
      return 0;
    };
  };

  filterExternal = () => {
    this.docs = this.docs.filter(item => !item.internal);
    return this;
  };

  improveRelativeLinks = () => {
    const hrefLinksRegexp = /href="\/docs(.*?)"/g;
    this.docs.map(doc => {
      if (doc.source.search(hrefLinksRegexp) !== -1) {
        try {
          doc.source = doc.source.replace(
            hrefLinksRegexp,
            occurrence => {
              hrefLinksRegexp.lastIndex = 0;
              let href = hrefLinksRegexp.exec(occurrence);
          
              if (!href || !href[1]) return occurrence;
              return `href=${href[1]}`
            }
          );
        } catch(e) {
          console.error(e)
        }
      }

      return doc;
    })

    return this
  }

  changeHeadersAtrs = () => {
    const headerIDRegexp = /id=("|')(.*?)("|')/g;
    this.docs.map(doc => {
      if (doc.source.search(headerIDRegexp) !== -1) {
        try {
          const docType = doc.type || doc.title;
          const docTitle = doc.title;

          doc.source = doc.source.replace(
            headerIDRegexp,
            occurrence => {
              headerIDRegexp.lastIndex = 0;
              let id = headerIDRegexp.exec(occurrence);

              if (!id || !id[2]) return occurrence;
              id = id[2];


              const typeLowerCased = docType.toLowerCase().replace(/ /g, "-");
              const titleLowerCased = docTitle.toLowerCase().replace(/ /g, "-");
              const typeWithTitle = `${typeLowerCased}-${titleLowerCased}`;
          
              return `id="${typeWithTitle}-${id}" data-scrollspy-node-type="header"`;
            }
          )
        } catch(e) {
          console.error(e);
        }
      }

      return doc;
    })

    return this;
  }

  result() {
    return this.docs;
  }
}
