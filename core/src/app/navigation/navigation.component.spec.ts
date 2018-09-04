import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { AppModule } from '../app.module';
import { ExtensionsService } from '../extensibility/services/extensions.service';
import { Observable } from 'rxjs/Observable';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  const ExtensionsServiceStub = {
    getExtensions() {
      return Observable.of([]);
    },
    getClusterExtensions() {
      return Observable.of([]);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        [
          { provide: APP_BASE_HREF, useValue: '/my/app' },
          { provide: ExtensionsService, useValue: ExtensionsServiceStub }
        ]
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    component.navCtx = 'env';
    fixture.detectChanges();
  });

  it('should create', done => {
    expect(component).toBeTruthy();
    done();
  });
});
