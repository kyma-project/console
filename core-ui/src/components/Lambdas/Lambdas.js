import React from 'react';

import ModalWithForm from '../Shared/ModalWithForm';
import CreateLambdaModal from './CreateLambdaModal/CreateLambdaModal';

export default function Lambdas() {
  return (
    <ModalWithForm
      title="Create new lambda"
      button={{ text: 'Create lambda', glyph: 'add' }}
      performRefetch={() => console.log('refetch')} // to be removed after subscriptions are done
    >
      <CreateLambdaModal />
    </ModalWithForm>
  );
}
