import { ListModule } from 'app/generic-list';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeploymentsComponent } from './deployments.component';
import { AppModule } from '../../../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { WindowTitleService } from 'shared/services/window-title.service';

describe('DeploymentsComponent', () => {
  let component: DeploymentsComponent;
  let fixture: ComponentFixture<DeploymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: WindowTitleService, useValue: { set: () => { } } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
