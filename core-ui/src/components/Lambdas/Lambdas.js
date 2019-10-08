import React from 'react';

import ModalWithForm from '../ModalWithForm/ModalWithForm';
import CreateLambdaModal from './CreateLambdaModal/CreateLambdaModal';

export default function Lambdas() {
  return (
    <ModalWithForm
      title="Create new lambda"
      button={{ text: 'Create lambda', glyph: 'add' }}
      id="add-lambda-modal"
      renderForm={props => <CreateLambdaModal {...props} />}
    ></ModalWithForm>
  );
}
