import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'fundamental-react/lib/Modal';
import { Button } from 'fundamental-react/lib/Button';
import LuigiClient from '@kyma-project/luigi-client';

const ModalWithForm = ({
  performRefetch,
  sendNotification,
  title,
  button,
  children,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isValid, setValid] = useState(false);
  const formElementRef = useRef(null);

  const setOpenStatus = status => {
    if (status) {
      LuigiClient.uxManager().addBackdrop();
    } else {
      LuigiClient.uxManager().removeBackdrop();
    }
    setOpen(status);
  };

  const handleFormChanged = e => {
    setValid(formElementRef.current.checkValidity());
  };

  const handleFormError = (title, message) => {
    sendNotification({
      variables: {
        content: message,
        title: title,
        color: '#BB0000',
        icon: 'decline',
      },
    });
  };
  const handleFormSuccess = (title, message) => {
    sendNotification({
      variables: {
        content: message,
        title: title,
        color: '#107E3E',
        icon: 'accept',
      },
    });
    performRefetch();
  };
  return (
    <div>
      <Button
        glyph={button.glyph}
        onClick={() => {
          setOpenStatus(true);
        }}
      >
        {button.text}
      </Button>
      <Modal
        show={isOpen}
        actions={
          <>
            <Button
              onClick={() => {
                setOpenStatus(false);
              }}
              type="standard"
            >
              Cancel
            </Button>
            <Button
              aria-disabled={!isValid}
              onClick={() => {
                const form = formElementRef.current;
                if (
                  typeof form.reportValidity === 'function'
                    ? form.reportValidity()
                    : form.checkValidity() // IE workaround; HTML validation tooltips won't be visible
                ) {
                  form.dispatchEvent(new Event('submit'));
                  setOpenStatus(false);
                }
              }}
            >
              Create
            </Button>
          </>
        }
        onClose={() => {
          setOpenStatus(false);
        }}
        title={title}
      >
        {React.createElement(children.type, {
          formElementRef,
          isValid,
          onChange: handleFormChanged,
          onError: handleFormError,
          onCompleted: handleFormSuccess,
          ...children.props,
        })}
      </Modal>
    </div>
  );
};

ModalWithForm.propTypes = {
  performRefetch: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  button: PropTypes.exact({
    text: PropTypes.string.isRequired,
    glyph: PropTypes.string,
  }).isRequired,
};

export default ModalWithForm;
