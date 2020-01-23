import React from 'react';
import CreateApplicationFromTemplateModal from '../CreateApplicationFromTemplateModal';
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
  sendNotification,
} from './mocks';

describe('CreateApplicationFromTemplateModal', () => {
  //Warning: `NaN` is an invalid value for the `left` css style property.
  console.error = jest.fn();

  afterEach(() => {
    console.error.mockReset();
  });

  async function expandTemplateList(queryByText) {
    fireEvent.click(queryByText('From template'));
    // wait for modal to open and template list to load
    await waitForDomChange();
    // click to expand the list of templates
    fireEvent.click(queryByText('Choose template'));
  }

  it('Loads list of available templates', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={[getAppTemplatesQuery]} addTypename={false}>
        <CreateApplicationFromTemplateModal
          applicationsQuery={{}}
          modalOpeningComponent={<button>From template</button>}
        />
      </MockedProvider>,
    );

    // open modal
    fireEvent.click(queryByText('From template'));

    // loading templates
    expect(queryByText('Choose template (loading...)')).toBeInTheDocument();
    await waitForDomChange();

    const chooseTemplateButton = queryByText('Choose template');
    expect(chooseTemplateButton).toBeInTheDocument();

    // click to expand the list of templates
    fireEvent.click(chooseTemplateButton);
    expect(queryByText('template-no-placeholders')).toBeInTheDocument();
    expect(queryByText('template-with-placeholders')).toBeInTheDocument();
  }, 10000); // to prevent MockedProvider timeouting

  it('Renders choosen template placeholders', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider mocks={[getAppTemplatesQuery]} addTypename={false}>
        <CreateApplicationFromTemplateModal
          applicationsQuery={{}}
          modalOpeningComponent={<button>From template</button>}
        />
      </MockedProvider>,
    );

    await expandTemplateList(queryByText);

    // choose template
    fireEvent.click(queryByText('template-with-placeholders'));

    expect(queryByLabelText('placeholder-1-description')).toBeInTheDocument();
    expect(queryByLabelText('placeholder-2-description')).toBeInTheDocument();
  }, 10000); // to prevent MockedProvider timeouting

  it('Manages form validity and submits valid form', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider
        mocks={[
          getAppTemplatesQuery,
          registerApplicationMutation,
          sendNotification,
        ]}
        addTypename={false}
        resolvers={{}}
      >
        <CreateApplicationFromTemplateModal
          applicationsQuery={{ refetch: () => {} }}
          modalOpeningComponent={<button>From template</button>}
        />
      </MockedProvider>,
    );

    await expandTemplateList(queryByText);

    // choose template
    fireEvent.click(queryByText('template-with-placeholders'));

    const createButton = queryByText('Create');
    expect(createButton).toBeDisabled();

    // fill form to enable 'Save' button
    fireEvent.change(queryByLabelText('placeholder-1-description'), {
      target: { value: '1' },
    });
    fireEvent.change(queryByLabelText('placeholder-2-description'), {
      target: { value: '2' },
    });
    await waitForDomChange();

    expect(createButton).not.toBeDisabled();

    fireEvent.click(createButton);

    await wait(() => {
      expect(registerApplicationMutation.result).toHaveBeenCalled();
    });
  }, 10000); // to prevent MockedProvider timeouting
});
