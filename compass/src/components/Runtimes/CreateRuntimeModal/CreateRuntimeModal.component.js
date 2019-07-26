import React, { useState, useRef } from 'react';
import { Modal } from 'fundamental-react/lib/Modal';
import { Button } from 'fundamental-react/lib/Button';
import LuigiClient from '@kyma-project/luigi-client';
import CreateRuntimeForm from './CreateRuntimeForm.container';

const CreateRuntimeModal = ({ performRefetch, sendNotification }) => {
  const [isOpen, setOpen] = useState(false);
  const [isValid, setValid] = useState(false);
  const formElement = useRef(null);

  const setOpenStatus = status => {
    if (status) {
      LuigiClient.uxManager().addBackdrop();
    } else {
      LuigiClient.uxManager().removeBackdrop();
    }
    setOpen(status);
  };

  const handleFormChanged = e => {
    setValid(formElement.current.checkValidity());
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
        glyph="add"
        onClick={() => {
          setOpenStatus(true);
        }}
      >
        Create runtime
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
                const form = formElement.current;
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
        title="Create new runtime"
      >
        <CreateRuntimeForm
          formElement={formElement}
          onChange={handleFormChanged}
          isValid={isValid}
          onError={handleFormError}
          onCompleted={handleFormSuccess}
        />
      </Modal>
    </div>
  );
};

export default CreateRuntimeModal;
