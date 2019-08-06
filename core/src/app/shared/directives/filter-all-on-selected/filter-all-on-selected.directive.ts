import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[filterAllOnSelected]'
})
export class FilterAllOnSelectedDirective {

  private _combobox = null;

  constructor(private _viewContainerRef: ViewContainerRef) {
    this._combobox = _viewContainerRef['_data'].componentView.component;
    this._combobox.filterFn = this.filterFn;
  }

  public filterFn = (content: string[], searchTerm: string): string[] => {
    const searchTermLower = searchTerm.toLocaleLowerCase();
    return content.indexOf(this._combobox.inputTextValue) >= 0
      ? content
      : content.filter(term => term.toLocaleLowerCase().indexOf(searchTermLower) >= 0);
  };

}
