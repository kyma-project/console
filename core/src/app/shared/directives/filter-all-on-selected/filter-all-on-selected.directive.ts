import { Directive, ViewContainerRef, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ComboboxComponent } from 'fundamental-ngx/lib/combobox/combobox.component';

@Directive({
  selector: '[filterAllOnSelected]'
})
export class FilterAllOnSelectedDirective implements OnInit, OnDestroy {
  private combobox: ComboboxComponent = null;
  @HostListener('mousedown') onMouseEnter() {
    event.stopPropagation();
  }

  constructor(private _viewContainerRef: ViewContainerRef) {
    if (
      !_viewContainerRef['_data'] ||
      !_viewContainerRef['_data'].componentView ||
      !_viewContainerRef['_data'].componentView.component ||
      !_viewContainerRef['_data'].componentView.component.filterFn
    ) {
      throw new Error('filterAllOnSelected can only be used wth fd-combobox');
    }

    // Because of webpack (https://github.com/angular/angular-cli/issues/13658) we cannot use ComboboxComponent as argument
    this.combobox = _viewContainerRef['_data'].componentView.component;
    this.combobox.filterFn = this.filterFn;
  }

  public filterFn = (content: string[], searchTerm: string): string[] => {
    const searchTermLower = searchTerm.toLocaleLowerCase();
    return content.indexOf(searchTerm) >= 0 && !this.combobox.isOpen
      ? content
      : content.filter(
        term => term.toLocaleLowerCase().indexOf(searchTermLower) >= 0
      );
  };

  public onOutsideDropdownClick = () => {
    const searchValue = this.combobox.inputTextValue;
    if (!this.combobox.dropdownValues.includes(searchValue)) {
      this.combobox.inputTextValue = '';
      this.combobox.handleSearchTermChange()
    }
  };

  public ngOnInit() {
    window.addEventListener('mousedown', this.onOutsideDropdownClick);
  };

  public ngOnDestroy() {
    window.removeEventListener('mousedown', this.onOutsideDropdownClick);
  };
}
