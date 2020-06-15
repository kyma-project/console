import React from 'react';
import { render, fireEvent, queryByText } from '@testing-library/react';
import AccessStrategyForm from '../AccessStrategyForm';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: key => {
    let result = '';
    if (key == 'defaultIdpJwksUri') {
      result = 'http://dex-service.kyma-system.svc.cluster.local:5556/keys';
    }
    if (key == 'defaultIdpIssuer') {
      result = 'https://dex.kyma.local';
    }
    return result;
  },
}));

const allowStrategy = {
  path: '/path',
  methods: ['GET', 'PUT'],
  accessStrategies: [
    {
      name: 'noop',
      config: {},
    },
  ],
};

const oauthStrategy = {
  path: '/path',
  methods: ['GET', 'PUT'],
  accessStrategies: [
    {
      name: 'oauth2_introspection',
      config: {
        required_scope: ['scope1', 'scope2'],
      },
    },
  ],
};

const jwtStrategy = {
  path: '/path',
  methods: ['GET', 'PUT'],
  accessStrategies: [
    {
      name: 'jwt',
      config: {
        jwks_urls: ['http://jwks_1'],
        trusted_issuers: ['https://issuer_1'],
      },
    },
  ],
};

const setStrategy = jest.fn();
const removeStrategy = jest.fn();

describe('AccessStrategyForm', () => {
  beforeEach(() => {
    setStrategy.mockReset();
    removeStrategy.mockReset();
  });

  it('renders basic rule info', () => {
    const { getByLabelText } = render(
      <AccessStrategyForm
        strategy={allowStrategy}
        setStrategy={setStrategy}
        removeStrategy={removeStrategy}
        canDelete={false}
        idpPresets={[]}
        handleFormChanged={() => {}}
      />,
    );

    expect(getByLabelText('Access strategy path')).toHaveValue(
      allowStrategy.path,
    );
    expect(getByLabelText('GET')).toBeChecked();
    expect(getByLabelText('PUT')).toBeChecked();
    expect(getByLabelText('POST')).not.toBeChecked();
    expect(getByLabelText('DELETE')).not.toBeChecked();
    expect(getByLabelText('HEAD')).not.toBeChecked();
    expect(getByLabelText('PATCH')).not.toBeChecked();
  });

  it('renders OAuth2 strategy', () => {
    const { getByLabelText, queryByLabelText } = render(
      <AccessStrategyForm
        strategy={oauthStrategy}
        setStrategy={setStrategy}
        removeStrategy={removeStrategy}
        canDelete={false}
        idpPresets={[]}
        handleFormChanged={() => {}}
      />,
    );

    expect(getByLabelText('Access strategy type')).toHaveValue(
      allowStrategy.accessStrategies[0].type,
    );
    const requiredScope = queryByLabelText('Required scope');
    expect(requiredScope).toBeInTheDocument();
    oauthStrategy.accessStrategies[0].config.required_scope.forEach(scope => {
      expect(
        queryByText(requiredScope.parentElement, scope),
      ).toBeInTheDocument();
    });
  });

  it('allows to change OAuth2 strategy scopes', () => {
    const { queryByLabelText } = render(
      <AccessStrategyForm
        strategy={oauthStrategy}
        setStrategy={setStrategy}
        removeStrategy={removeStrategy}
        canDelete={false}
        idpPresets={[]}
        handleFormChanged={() => {}}
      />,
    );

    const requiredScope = queryByLabelText('Required scope');
    expect(requiredScope).toBeInTheDocument();

    fireEvent.keyDown(requiredScope, {
      key: ',',
      target: { value: 'new-scope' },
    });

    expect(setStrategy).toHaveBeenCalledWith({
      ...oauthStrategy,
      accessStrategies: [
        {
          ...oauthStrategy.accessStrategies[0],
          config: {
            required_scope: [
              ...oauthStrategy.accessStrategies[0].config.required_scope,
              'new-scope',
            ],
          },
        },
      ],
    });
  });

  it('renders JWT strategy', async () => {
    const { getByLabelText, queryByText } = render(
      <AccessStrategyForm
        strategy={jwtStrategy}
        setStrategy={setStrategy}
        removeStrategy={removeStrategy}
        canDelete={false}
        idpPresets={[]}
        handleFormChanged={() => {}}
      />,
    );

    expect(getByLabelText('Access strategy type')).toHaveValue(
      jwtStrategy.accessStrategies[0].type,
    );

    expect(getByLabelText('jwt-issuer-0').value).toBe(
      jwtStrategy.accessStrategies[0].config.trusted_issuers[0],
    );
    expect(getByLabelText('jwt-jwks-uri-0').value).toBe(
      jwtStrategy.accessStrategies[0].config.jwks_urls[0],
    );
  });

  it('disables delete button when there is one access strategy', () => {
    const { queryByLabelText } = render(
      <AccessStrategyForm
        strategy={oauthStrategy}
        setStrategy={setStrategy}
        removeStrategy={removeStrategy}
        canDelete={false}
        idpPresets={[]}
        handleFormChanged={() => {}}
      />,
    );

    const deleteButton = queryByLabelText('remove-access-strategy');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
  });

  it('disables delete button when there is more than one access strategy', () => {
    const { queryByLabelText } = render(
      <AccessStrategyForm
        strategy={oauthStrategy}
        setStrategy={setStrategy}
        removeStrategy={removeStrategy}
        canDelete={true}
        idpPresets={[]}
        handleFormChanged={() => {}}
      />,
    );

    const deleteButton = queryByLabelText('remove-access-strategy');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).not.toBeDisabled();
  });

  it('fires callback when user deletes strategy', () => {
    const { queryByLabelText } = render(
      <AccessStrategyForm
        strategy={oauthStrategy}
        setStrategy={setStrategy}
        removeStrategy={removeStrategy}
        canDelete={true}
        idpPresets={[]}
        handleFormChanged={() => {}}
      />,
    );

    const deleteButton = queryByLabelText('remove-access-strategy');
    expect(deleteButton).toBeInTheDocument();

    deleteButton.click();

    expect(removeStrategy).toHaveBeenCalled();
  });
});
