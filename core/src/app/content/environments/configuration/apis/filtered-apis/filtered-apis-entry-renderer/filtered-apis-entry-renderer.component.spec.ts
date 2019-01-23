import { ListModule } from 'app/generic-list';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FilteredApisEntryRendererComponent } from './filtered-apis-entry-renderer.component';
import { AppModule } from '../../../../../../app.module';
import { AppConfig } from '../../../../../../app.config';

describe('DeploymentsComponent', () => {
  let component: FilteredApisEntryRendererComponent;
  let fixture: ComponentFixture<FilteredApisEntryRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
      providers: [
        [{ provide: APP_BASE_HREF, useValue: '/my/app' }],
        {
          provide: 'entry',
          useValue: {
            name: 'entryName',
            hostname: 'hostName',
            service: {
              name: 'name',
              port: 'whatever'
            },
            authenticationPolicies: [
              {
                type: 'jwk',
                issuer: 'dex',
                jwksURI: 'dexUri'
              }
            ]
          }
        },
        [{ provide: 'entryEventHandler', useValue: {} }]
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredApisEntryRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isSecured', () => {
    it('should return true if is secured', () => {
      const api = {
        name: 'entryName',
        hostname: 'hostName',
        service: {
          name: 'name',
          port: 'whatever'
        },
        authenticationPolicies: [
          {
            type: 'jwk',
            issuer: 'dex',
            jwksURI: 'dexUri'
          }
        ]
      };
      const isSecured = component.isSecured(api);
      expect(isSecured).toEqual(true);
    });

    it("shouldn't return anything if is not secured", () => {
      const api = {
        name: 'entryName',
        hostname: 'hostName',
        service: {
          name: 'name',
          port: 'whatever'
        },
        authenticationPolicies: []
      };
      const isSecured = component.isSecured(api);
      expect(isSecured).toEqual(false);
    });
  });

  describe('getIDP', () => {
    it("should return 'Other' if issuer is not dex", () => {
      const api = {
        name: 'entryName',
        hostname: 'hostName',
        service: {
          name: 'name',
          port: 'whatever'
        },
        authenticationPolicies: [
          {
            type: 'jwk',
            issuer: 'dex',
            jwksURI: 'dexUri'
          }
        ]
      };
      const getIDP = component.getIDP(api);
      expect(getIDP).toEqual('Other');
    });

    it("should return 'DEX' if dex is the issuer", () => {
      const api = {
        name: 'entryName',
        hostname: 'hostName',
        service: {
          name: 'name',
          port: 'whatever'
        },
        authenticationPolicies: [
          {
            type: 'jwk',
            issuer: AppConfig.authIssuer,
            jwksURI: 'dexUri'
          }
        ]
      };
      const getIDP = component.getIDP(api);
      expect(getIDP).toEqual('DEX');
    });
  });
});
