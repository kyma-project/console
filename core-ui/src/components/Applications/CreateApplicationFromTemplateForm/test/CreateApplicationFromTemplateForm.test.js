import React from 'react';
import CreateApplicationFromTemplateForm from '../CreateApplicationFromTemplateForm';
import {
  render,
  fireEvent,
  wait,
  waitForDomChange,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import {
  getAppTemplatesQuery,
  registerApplicationMutation,
  compassApplicationRefetchQuery,
} from './mocks';

jest.mock('@kyma-project/common', () => ({
  getApiUrl: () => 'kyma.local',
}));

jest.mock('index', () => ({ CompassGqlContext: {} }));

describe('CreateApplicationFromTemplateForm', () => {
  //Warning: `NaN` is an invalid value for the `left` css style property.
  console.error = jest.fn();

  afterEach(() => {
    console.error.mockReset();
  });

  it('Loads list of available templates', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={[getAppTemplatesQuery]} addTypename={false}>
        <CreateApplicationFromTemplateForm
          formElementRef={{ current: null }}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
        />
      </MockedProvider>,
    );

    // loading templates
    expect(queryByText('Choose template (loading...)')).toBeInTheDocument();
    await waitForDomChange();

    const chooseTemplateButton = queryByText('Choose template');
    expect(chooseTemplateButton).toBeInTheDocument();

    // click to expand the list of templates
    fireEvent.click(chooseTemplateButton);
    expect(queryByText('template-no-placeholders')).toBeInTheDocument();
    expect(queryByText('template-with-placeholders')).toBeInTheDocument();
  });

  it('Renders choosen template placeholders', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider mocks={[getAppTemplatesQuery]} addTypename={false}>
        <CreateApplicationFromTemplateForm
          formElementRef={{ current: null }}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
        />
      </MockedProvider>,
    );

    await waitForDomChange();
    fireEvent.click(queryByText('Choose template'));

    // choose template
    fireEvent.click(queryByText('template-with-placeholders'));

    expect(queryByLabelText('placeholder-1-description')).toBeInTheDocument();
    expect(queryByLabelText('placeholder-2-description')).toBeInTheDocument();
  });

  it('Sends request on form submit', async () => {
    const formRef = React.createRef();

    const { queryByText, queryByLabelText } = render(
      <MockedProvider
        mocks={[
          getAppTemplatesQuery,
          registerApplicationMutation,
          compassApplicationRefetchQuery,
        ]}
        addTypename={false}
        resolvers={{}}
      >
        <CreateApplicationFromTemplateForm
          formElementRef={formRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
        />
      </MockedProvider>,
    );

    await waitForDomChange();
    fireEvent.click(queryByText('Choose template'));

    // choose template
    fireEvent.click(queryByText('template-with-placeholders'));

    // fill form to enable 'Save' button
    fireEvent.change(queryByLabelText('placeholder-1-description'), {
      target: { value: '1' },
    });
    fireEvent.change(queryByLabelText('placeholder-2-description'), {
      target: { value: '2' },
    });

    // simulate form submit from outside
    formRef.current.dispatchEvent(new Event('submit'));

    await wait(() => {
      expect(registerApplicationMutation.result).toHaveBeenCalled();
    });
  });
});
