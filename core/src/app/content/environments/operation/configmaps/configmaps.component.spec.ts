import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigMapsComponent } from './configmaps.component';
import { AppModule } from '../../../../app.module';
import { ListModule } from '@kyma-project/y-generic-list';
import { APP_BASE_HREF } from '@angular/common';

describe('ConfigMapsComponent', () => {
  let component: ConfigMapsComponent;
  let fixture: ComponentFixture<ConfigMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
