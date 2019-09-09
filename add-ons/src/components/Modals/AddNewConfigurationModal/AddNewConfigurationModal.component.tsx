import React from 'react';
import {
  Button,
  FormSet,
  FormItem,
  FormInput,
  FormLabel,
  FormMessage,
  Icon,
} from 'fundamental-react';
import { Modal } from '@kyma-project/components';

import InlineHelp from '../../Atoms/InlineHelp';

import {
  MODAL,
  FORMS,
  HELP,
  PLACEHOLDERS,
  TOOLTIP_DATA_ERROR,
} from '../../../constants';

import { AddedUrl, StyledToken, AddLabelButtonWrapper } from './styled';

interface Props {
  nameField: any;
  labelsField: any;
  urlField: any;
  labels: string[];
  urls: string[];
  onSubmit: () => void;
  addUrl: () => void;
  removeUrl: (url: string) => void;
  addLabel: () => void;
  removeLabel: (label: string) => void;
  handleEnterDownOnLabelsField: (e: any) => void;
  handleEnterDownOnUrlField: (e: any) => void;
  onShowModal: () => void;
  error: boolean;
}

const AddNewConfigurationModalComponent: React.FunctionComponent<Props> = ({
  nameField,
  labelsField,
  urlField,
  labels,
  urls,
  onSubmit,
  addUrl,
  removeUrl,
  addLabel,
  removeLabel,
  handleEnterDownOnLabelsField,
  handleEnterDownOnUrlField,
  onShowModal,
  error,
}) => {
  const modalOpeningComponent = (
    <Button glyph="add" disabled={error}>
      {MODAL.ADD_NEW_CONFIGURATION_BUTTON_TITLE}
    </Button>
  );

  const addedLabels = () =>
    labels.length
      ? labels.map(label => (
          <StyledToken onClick={() => removeLabel(label)} key={label}>
            {label}
          </StyledToken>
        ))
      : null;

  const addedUrls = () =>
    urls.length
      ? urls.map(url => (
          <AddedUrl onClick={() => removeUrl(url)} key={url}>
            {url}
            <Icon glyph="decline" />
          </AddedUrl>
        ))
      : null;

  let disabledConfirm = Boolean(
    nameField.error || !nameField.value || labelsField.error || urlField.error,
  );
  if (!disabledConfirm && !urls.length) {
    disabledConfirm = !(urlField.value && urlField.valid);
  }

  return (
    <Modal
      width="681px"
      title={MODAL.ADD_NEW_CONFIGURATION_MODAL_TITLE}
      confirmText={MODAL.CONFIRM_TEXT}
      closeText={MODAL.CANCEL_TEXT}
      openingComponent={modalOpeningComponent}
      onConfirm={onSubmit}
      disabledConfirm={disabledConfirm}
      onOpen={onShowModal}
      tooltipData={disabledConfirm ? TOOLTIP_DATA_ERROR : undefined}
    >
      <FormSet>
        <FormItem key="name">
          <FormLabel htmlFor="name" required={true}>
            {FORMS.NAME_LABEL}
            <InlineHelp text={HELP.NAME_FIELD} />
          </FormLabel>
          <FormInput
            id="name"
            type="text"
            placeholder={PLACEHOLDERS.NAME_FIELD}
            state={nameField.checkState()}
            {...nameField.bind}
          />
          {nameField.error ? (
            <FormMessage type="error">{nameField.error}</FormMessage>
          ) : null}
        </FormItem>
        <FormItem key="labels">
          <FormLabel htmlFor="labels">
            {FORMS.LABELS_LABEL}
            <InlineHelp text={HELP.LABELS_FIELD} />
          </FormLabel>
          <FormInput
            id="labels"
            type="text"
            placeholder={PLACEHOLDERS.LABELS_FIELD}
            state={labelsField.checkState()}
            {...labelsField.bind}
            onKeyDown={handleEnterDownOnLabelsField}
          />
          {labelsField.error ? (
            <FormMessage type="error">{labelsField.error}</FormMessage>
          ) : null}
          {addedLabels()}
        </FormItem>
        <AddLabelButtonWrapper>
          <Button
            glyph="add"
            onClick={addLabel}
            option="light"
            compact={true}
            disabled={Boolean(labelsField.error || !labelsField.value)}
          >
            {FORMS.ADD_LABEL_BUTTON}
          </Button>
        </AddLabelButtonWrapper>
        <FormItem key="url">
          <FormLabel htmlFor="url" required={true}>
            {FORMS.URL_LABEL}
            <InlineHelp text={HELP.URL_FIELD} />
          </FormLabel>
          {addedUrls()}
          <FormInput
            id="url"
            type="text"
            placeholder={PLACEHOLDERS.URL_FIELD}
            state={urlField.checkState()}
            {...urlField.bind}
            onKeyDown={handleEnterDownOnUrlField}
          />
          {urlField.error ? (
            <FormMessage type="error">{urlField.error}</FormMessage>
          ) : null}
        </FormItem>
        <Button
          glyph="add"
          onClick={addUrl}
          option="light"
          compact={true}
          disabled={Boolean(urlField.error || !urlField.value)}
        >
          {FORMS.ADD_URL_BUTTON}
        </Button>
      </FormSet>
    </Modal>
  );
};

export default AddNewConfigurationModalComponent;
