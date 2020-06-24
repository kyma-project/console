import React, { useState } from 'react';
import LuigiClient from '@luigi-project/client';

import { Panel, Icon, Modal, Button } from 'fundamental-react';

import { statusType } from 'components/Lambdas/helpers/lambdas';
import {
  LAMBDA_PHASES,
  LAMBDA_ERROR_PHASES,
  LAMBDA_DETAILS,
  BUTTONS,
} from 'components/Lambdas/constants';
import { formatMessage } from 'components/Lambdas/helpers/misc';

function statusIcon(phase = LAMBDA_PHASES.INITIALIZING.TYPE) {
  switch (phase) {
    case LAMBDA_PHASES.FAILED.TYPE:
      return 'sys-cancel';
    case LAMBDA_PHASES.RUNNING.TYPE:
      return 'sys-enter';
    default:
      return 'sys-help';
  }
}

function ModalWithErrorLogs({ lambdaName, error }) {
  const [show, setShow] = useState(false);

  function onOpen() {
    setShow(true);
    LuigiClient.uxManager().addBackdrop();
  }

  function onClose() {
    setShow(false);
    LuigiClient.uxManager().removeBackdrop();
  }

  const title = formatMessage(LAMBDA_DETAILS.STATUS.ERROR.MODAL.TITLE, {
    lambdaName,
  });
  const actions = (
    <Button onClick={onClose} option="light">
      {BUTTONS.CANCEL}
    </Button>
  );

  return (
    <>
      <span className="link" onClick={onOpen}>
        {LAMBDA_DETAILS.STATUS.ERROR.LINK}
      </span>
      <Modal title={title} show={show} actions={actions} onClose={onClose}>
        {error}
      </Modal>
    </>
  );
}

export default function LambdaStatusCard({ lambdaName, status }) {
  const statusPhase = status.phase;

  const texts = LAMBDA_PHASES[statusPhase];
  const className = statusType(statusPhase);
  const glyph = statusIcon(statusPhase);

  // for Failed and NewRevisionError phases error message is show in modal
  const hasErrorPhase = LAMBDA_ERROR_PHASES.includes(statusPhase);
  let message = null;
  if (hasErrorPhase) {
    const errorLogs = (
      <ModalWithErrorLogs lambdaName={lambdaName} error={status.message} />
    );

    message = (
      <p className="lambda-details-header__status-message">
        <span>{texts.MESSAGE}</span>
        {errorLogs}
      </p>
    );
  }

  return (
    <div
      className={`lambda-details-header__status lambda-details-header__status--${className}`}
    >
      <Panel>
        <Panel.Header>
          <Panel.Head title={LAMBDA_DETAILS.STATUS.TITLE} />
          <Panel.Actions>
            <Icon glyph={glyph} />
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body>
          <h3 className="lambda-details-header__status-phase">{texts.TITLE}</h3>
          {message}
        </Panel.Body>
      </Panel>
    </div>
  );
}
