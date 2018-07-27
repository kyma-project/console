
export class SimpleFacetMatcher {

  matches(element: any, facets: string[], facetExtractionFn): boolean {
    if (!facets || facets.length === 0) {
      return true;
    }
    let result = false;
    const elementFacets = facetExtractionFn(element);
    facets.forEach(facet => {
      if (!result && elementFacets.indexOf(facet) !== -1) {
        result = true;
      }
    });
    return result;
  }

  filter(elements: any[], facets: string[], facetExtractionFn): any[] {
    if (facets && facets.length !== 0) {
      const filteredData = [];
      elements.forEach(element => {
        if (this.matches(element, facets, facetExtractionFn)) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return elements;
    }
  }
}
