import { act } from 'react-dom/test-utils';

export async function componentUpdate(component) {
  await act(async () => {
    await wait(0);
    component.update();
  });
}
