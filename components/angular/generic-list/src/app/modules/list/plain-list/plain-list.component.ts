import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Input,
    OnChanges,
    ReflectiveInjector,
    SimpleChange,
    Type,
    ViewChild,
    ViewContainerRef,
    ViewRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'y-plain-list',
  templateUrl: './plain-list.component.html',
  styleUrls: ['./plain-list.component.scss']
})
export class PlainListComponent implements OnChanges {
  @Input() source: Observable<any[]>;
  @Input() entryRenderer: Type<any>;
  @Input() entryEventHandler;
  @Input() entryTagName;

  @ViewChild('entries', { read: ViewContainerRef })
  entriesViewContainer: ViewContainerRef;

  data: any[];
  loaded = false;
  loading = false;
  errorMessage = '';

  componentFactoryResolver: ComponentFactoryResolver;

  constructor(componentFactoryResolver: ComponentFactoryResolver, private changeDetector: ChangeDetectorRef) {
    this.componentFactoryResolver = componentFactoryResolver;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === 'source' && changes[propName].currentValue) {
        this.render(changes[propName].currentValue);
      }
    }
  }

  setDelayedLoading() {
    // Only set loading status if it takes longer than defined ms
    Observable.of(0).delay(333).subscribe(() => {
      if (!this.loaded) {
        this.setLoading(true);
      }
    });
  }

  setLoading(status: boolean): void {
    this.loading = status;
  }

  setLoaded(status: boolean): void {
    this.loaded = status;
  }

  render(source: Observable<any[]>) {
    this.setLoaded(false);
    this.setDelayedLoading();
    source.subscribe(
      data => {
        this.setLoaded(true);
        this.setLoading(false);
        this.errorMessage = '';
        this.data = data;
        this.entriesViewContainer.clear();
        data.forEach(entry => {
          const inputProviders = [
            { provide: 'entry', useValue: entry },
            { provide: 'entryEventHandler', useValue: this.entryEventHandler }
          ];
          const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
          const injector = ReflectiveInjector.fromResolvedProviders(
            resolvedInputs,
            this.entriesViewContainer.parentInjector
          );
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
            this.entryRenderer
          );
          const entryTag = this.entryTagName
            ? document.createElement(this.entryTagName)
            : undefined;
          const component = componentFactory.create(injector, [], entryTag);
          this.entriesViewContainer.insert(component.hostView);
        });

          if (!(this.changeDetector as ViewRef).destroyed) {
              this.changeDetector.detectChanges();
          }
      },
      error => {
        this.setLoaded(true);
        this.setLoading(false);
        this.errorMessage = error.message ? error.message : error.error;
        this.data = [];
          if (!(this.changeDetector as ViewRef).destroyed) {
              this.changeDetector.detectChanges();
          }
        throw error;
      }
    );
  }
}
