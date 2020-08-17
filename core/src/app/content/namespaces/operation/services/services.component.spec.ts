import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesComponent } from './services.component';
import { AppModule } from '../../../../app.module';
import { ListModule } from 'app/generic-list';
import { APP_BASE_HREF } from '@angular/common';
import { WindowTitleService } from 'shared/services/window-title.service';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
        providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' },
          { provide: WindowTitleService, useValue: { set: () => { } } }
      ]]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
