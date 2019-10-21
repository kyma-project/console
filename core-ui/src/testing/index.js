import { act } from 'react-dom/test-utils';

export async function componentUpdate(component, time = 0) {
  await act(async () => {
    await wait(time);
    component.update();
  });
}
