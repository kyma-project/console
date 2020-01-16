import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';
import {
  Menu,
  Dropdown,
  Button,
  Popover,
  FormItem,
  FormLabel,
  FormInput,
} from 'fundamental-react';
import { Modal } from './../../../shared/components/Modal/Modal';
import './CreateApplicationFromTemplateModal.scss';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_TEMPLATES, REGISTER_APPLICATION_FROM_TEMPLATE } from '../gql';
import { SEND_NOTIFICATION } from 'gql';

CreateApplicationFromTemplateModal.propTypes = {
  applicationsQuery: PropTypes.object.isRequired,
  modalOpeningComponent: PropTypes.node.isRequired,
};

const PlaceholderInput = ({
  placeholder: { name, description, value },
  onChange,
}) => (
  <FormItem>
    <FormLabel htmlFor={name}>{description}</FormLabel>
    <FormInput
      id={name}
      type="text"
      value={value}
      placeholder={description}
      onChange={onChange}
      required
    />
  </FormItem>
);

export default function CreateApplicationFromTemplateModal({
  applicationsQuery,
  modalOpeningComponent,
}) {
  const templatesQuery = useQuery(GET_TEMPLATES);
  const [registerApplicationFromTemplate] = useMutation(
    REGISTER_APPLICATION_FROM_TEMPLATE,
  );
  const [sendNotification] = useMutation(SEND_NOTIFICATION);

  const [template, setTemplate] = React.useState(null);
  const [placeholders, setPlaceholders] = React.useState([]);

  React.useEffect(() => {
    if (template) {
      const placeholders = template.placeholders.map(placeholder => ({
        ...placeholder,
        value: '',
      }));
      setPlaceholders(placeholders);
    }
  }, [template]);

  const AvailableTemplatesList = ({ data, error, loading }) => {
    if (error || loading) {
      return null;
    }

    const templates = data.applicationTemplates.data;
    return (
      <Menu className="template-list">
        {templates.length ? (
          templates.map(template => (
            <Menu.Item key={template.id} onClick={() => setTemplate(template)}>
              {template.name}
            </Menu.Item>
          ))
        ) : (
          <Menu.Item>No templates available</Menu.Item>
        )}
      </Menu>
    );
  };

  const dropdownControlText = () => {
    if (template) {
      return template.name;
    } else if (templatesQuery.error) {
      console.warn(templatesQuery.error);
      return 'Error! Cannot load templates list.';
    } else if (templatesQuery.loading) {
      return 'Choose template (loading...)';
    } else {
      return 'Choose template';
    }
  };

  const content = (
    <section className="create-application__template-form">
      <Dropdown>
        <Popover
          body={<AvailableTemplatesList {...templatesQuery} />}
          control={
            <Button className="fd-dropdown__control">
              {dropdownControlText()}
            </Button>
          }
          widthSizingType="matchTarget"
        />
      </Dropdown>
      <section className="placeholders-form">
        {placeholders.map(placeholder => (
          <PlaceholderInput
            key={placeholder.name}
            placeholder={placeholder}
            onChange={e =>
              setPlaceholders(
                placeholders.map(p =>
                  p.name === placeholder.name
                    ? { ...p, value: e.target.value }
                    : p,
                ),
              )
            }
          />
        ))}
      </section>
    </section>
  );

  const addApplication = async () => {
    const placeholdersValues = Array.from(
      Object.values(placeholders).map(placeholder => ({
        placeholder: placeholder.name,
        value: placeholder.value,
      })),
    );

    try {
      const result = await registerApplicationFromTemplate({
        variables: {
          in: {
            templateName: template.name,
            values: placeholdersValues,
          },
        },
      });

      const name = result.data.registerApplicationFromTemplate.name;
      sendNotification({
        variables: {
          content: `Created application "${name}".`,
          title: name,
          color: '#359c46',
          icon: 'accept',
          instanceName: name,
        },
      });
      applicationsQuery.refetch();
    } catch (e) {
      console.warn(e);
      let message = e.message;
      if (e.message.match('Object is not unique')) {
        message =
          'Application with that name already exists, please choose another template.';
      }
      LuigiClient.uxManager().showAlert({
        text: `Cannot create application: ${message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  const arePlaceholdersFilled = Object.values(placeholders).every(placeholder =>
    placeholder.value.trim(),
  );

  return (
    <Modal
      title="Create application from template"
      type={'emphasized'}
      modalOpeningComponent={modalOpeningComponent}
      confirmText="Create"
      cancelText="Cancel"
      disabledConfirm={!template || !arePlaceholdersFilled}
      onConfirm={() => addApplication()}
      onHide={() => {
        setTemplate(null);
        setPlaceholders([]);
      }}
    >
      {content}
    </Modal>
  );
}
