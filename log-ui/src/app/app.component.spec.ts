import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SearchService } from './search-form/service/search-service';
import { LuigiContextService } from './search-form/service/luigi-context.service';
import { SearchFormComponent } from './search-form/search-form.component';
import {
  BadgeLabelModule,
  FormModule,
  FundamentalNgxModule,
} from 'fundamental-ngx';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FundamentalNgxModule,
        BadgeLabelModule,
        FormModule,
        FormsModule,
        HttpClientModule,
      ],
      declarations: [AppComponent, SearchFormComponent],
      providers: [SearchService, LuigiContextService, HttpClientModule],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Kyma Log'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Kyma Log');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to oklog-ui!',
    );
  });
});
