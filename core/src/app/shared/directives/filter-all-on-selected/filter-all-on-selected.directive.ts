import {Directive, ViewContainerRef, Inject} from '@angular/core';

import {ComboboxComponent} from 'fundamental-ngx/lib/combobox/combobox.component';

@Directive({
  selector: '[filterAllOnSelected]'
})
export class FilterAllOnSelectedDirective {

  private combobox: ComboboxComponent = null;

  constructor(@Inject(ComboboxComponent) private _viewContainerRef) {
    if (
      !_viewContainerRef['_data']
      || !_viewContainerRef['_data'].componentView
      || !_viewContainerRef['_data'].componentView.component
      || !_viewContainerRef['_data'].componentView.component.filterFn
    ) {
      throw new Error("filterAllOnSelected can only be used wth fd-combobox")
    }

    // Because of webpack (https://github.com/angular/angular-cli/issues/13658) we cannot import ComboboxComponent here, thus the magic
    this.combobox = _viewContainerRef['_data'].componentView.component;
    this.combobox.filterFn = this.filterFn;
  }

  public filterFn = (content: string[], searchTerm: string): string[] => {
    const searchTermLower = searchTerm.toLocaleLowerCase();
    return content.indexOf(this.combobox.inputTextValue) >= 0
      ? content
      : content.filter(term => term.toLocaleLowerCase().indexOf(searchTermLower) >= 0);
  };

}
