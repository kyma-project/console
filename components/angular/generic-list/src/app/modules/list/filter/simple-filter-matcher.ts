import { Filter } from './Filter';

export class SimpleFilterMatcher {
  matches(element: any, filters: Filter[]): boolean {
    if (!filters) {
      return true;
    }
    const validFilters = filters.filter(filter => {
      return filter.value;
    });
    if (validFilters.length === 0) {
      return true;
    }
    let result = false;
    validFilters.forEach(filter => {
      if (
        !result &&
        this.propertyMatches(
          this.getPropertyValue(element, filter.property.split('.')),
          filter.value
        )
      ) {
        result = true;
      }
    });
    return result;
  }

  getPropertyValue(element, propertyPath) {
    if (!element || propertyPath.length === 0) {
      return undefined;
    } else if (propertyPath.length === 1) {
      return element[propertyPath[0]];
    } else {
      return this.getPropertyValue(
        element[propertyPath[0]],
        propertyPath.slice(1, propertyPath.length)
      );
    }
  }

  propertyMatches(propertyValue, value) {
    if (!value) {
      return true;
    }
    if (!propertyValue) {
      return false;
    }
    return propertyValue.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }

  filter(elements: any[], filters: Filter[]): any[] {
    if (filters) {
      const filteredData = [];
      elements.forEach(element => {
        if (this.matches(element, filters)) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return elements;
    }
  }
}
