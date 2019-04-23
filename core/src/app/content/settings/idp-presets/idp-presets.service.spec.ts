import { TestBed } from '@angular/core/testing';
import { IdpPresetsService } from './idp-presets.service';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import * as LuigiClient from '@kyma-project/luigi-client';

const idpPresetCreationSuccess = {
  createIDPPreset: {
    name: 'test'
  }
};

const idpPresetCreationFailure = {
  createIDPPreset: null,
  errors: [
    {
      message: 'IDP Preset with the name `exists` already exists',
      path: ['createIDPPreset']
    }
  ]
};

const idpPresetDeletionSuccess = {
  deleteIDPPreset: {
    name: 'delete'
  }
};

const idpPresetDeletionFailure = {
  deleteIDPPreset: null,
  errors: [
    {
      message: 'Cannot find IDP Preset `doesntExist`',
      path: ['deleteIDPPreset']
    }
  ]
};

const idpPresetsQuery = {
  IDPPresets: [
    {
      name: 'test',
      issuer: 'test',
      jwksUri: 'https://test'
    },
    {
      name: 'test1',
      issuer: 'test1',
      jwksUri: 'https://test1'
    }
  ]
};

const mockLuigiClient = {
  getEventData: () => { return {
    idToken: 'token'
  }}
}

const graphlQLClientServiceMock = {
  gqlMutation: (query, variables) => {
    switch (variables.name) {
      case 'test':
        return of(idpPresetCreationSuccess);
      case 'exists':
        return of(idpPresetCreationFailure);
      case 'delete':
        return of(idpPresetDeletionSuccess);
      case 'doesntExist':
        return of(idpPresetDeletionFailure);
      default:
        return of(idpPresetsQuery);
    }
  },
  gqlQuery: (query, variables) => {
    return of(idpPresetsQuery);
  }
};

describe('IdpPresetsService', () => {
  let idpService: IdpPresetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IdpPresetsService,
        { provide: GraphQLClientService, useValue: graphlQLClientServiceMock },
        { provide: LuigiClient, useValue: mockLuigiClient }
      ]
    });

    idpService = TestBed.get(IdpPresetsService);
  });

  it('should create new IDP Preset', async () => {
    // given
    const dataToCreateIdpPreset = {
      name: 'test',
      issuer: 'https://issuer.com',
      jwksUri: 'https://jwks.com'
    };

    // when
    const observable = await idpService.createIdpPreset(dataToCreateIdpPreset);

    // then
    observable.subscribe(res => {
      expect(res['createIDPPreset'].name).toBe(
        idpPresetCreationSuccess.createIDPPreset.name
      );
    });
  });

  it('should throw an error because of existing IDP Preset', async () => {
    // given
    const dataToCreateIdpPreset = {
      name: 'exists',
      issuer: 'https://issuer.com',
      jwksUri: 'https://jwks.com'
    };

    // when
    const observable = await idpService.createIdpPreset(dataToCreateIdpPreset);

    // then
    observable.subscribe(res => {
      expect(res['createIDPPreset']).toBeNull();
      expect(res['errors'][0].message).toBe(
        idpPresetCreationFailure.errors[0].message
      );
    });
  });

  it('should delete IDP Preset', async () => {
    // given
    const idpNameToBeDeleted = 'delete';

    // when
    const observable = await idpService.deleteIdpPreset(idpNameToBeDeleted);

    // then
    observable.subscribe(res => {
      expect(res['deleteIDPPreset'].name).toBe(
        idpPresetDeletionSuccess.deleteIDPPreset.name
      );
    });
  });

  it(`shouldn't delete IDP Preset, because it doesn't exist`, async () => {
    // given
    const idpNameToBeDeleted = 'doesntExist';

    // when
    const observable = await idpService.deleteIdpPreset(idpNameToBeDeleted);

    // then
    observable.subscribe(res => {
      expect(res['deleteIDPPreset']).toBeNull();
      expect(res['errors'][0].message).toBe(
        idpPresetDeletionFailure.errors[0].message
      );
    });
  });

  it('should fetch all IDP Presets', async () => {
    // when
    const observable = await idpService.getIDPPresets();

    // then
    observable.subscribe(res => {
      expect(res['IDPPresets']).toBe(idpPresetsQuery.IDPPresets);
    });
  });
});
