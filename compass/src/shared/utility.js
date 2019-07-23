import LuigiClient from '@kyma-project/luigi-client';

export function showErrorPrompt(error) {
  LuigiClient.uxManager().showAlert({
    text: error.message,
    type: 'error',
    closeAfter: 2000,
  });
}
