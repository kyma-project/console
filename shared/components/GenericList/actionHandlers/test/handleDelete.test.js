import { handleDelete } from '../simpleDelete';

const mockModal = jest.fn();
const mockAlert = jest.fn();

jest.mock('@luigi-project/client', () => ({
  uxManager: () => ({
    showConfirmationModal: mockModal,
    showAlert: mockAlert,
  }),
}));

describe('simpleDelete', () => {
  it('Calls delete function and custom callback with valid parameters', async () => {
    mockModal.mockImplementation(() => new Promise(resolve => resolve()));
    const deleteFunction = jest.fn();
    const customCallback = jest.fn();

    const type = 'some-type';
    const id = 'some-id';
    const name = 'some-name';

    await handleDelete(type, id, name, deleteFunction, customCallback);

    expect(mockModal).toHaveBeenCalled();
    expect(mockModal.mock.calls[0][0].body).toBe(
      `Are you sure you want to delete ${type} "${name}"?`,
    );
    expect(mockModal.mock.calls[0][0].header).toBe(`Remove ${type}`);

    expect(deleteFunction).toHaveBeenCalledWith(id, name);
    expect(customCallback).toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('Does not call any functions when user cancels', async () => {
    mockModal.mockImplementation(
      () => new Promise((_resolve, reject) => reject()),
    );
    const deleteFunction = jest.fn();
    const customCallback = jest.fn();

    await handleDelete(
      'some-type',
      'some-id',
      'some-name',
      deleteFunction,
      customCallback,
    );

    expect(deleteFunction).not.toHaveBeenCalled();
    expect(customCallback).not.toHaveBeenCalled();
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('Does not call custom callback and shows alert on delete function error', async () => {
    mockModal.mockImplementation(() => new Promise(resolve => resolve()));
    const deleteFunction = () => {
      throw Error('DANGER');
    };
    const customCallback = jest.fn();

    await handleDelete(
      'some-type',
      'some-id',
      'some-name',
      deleteFunction,
      customCallback,
    );

    expect(mockAlert).toHaveBeenCalled();
    expect(mockAlert.mock.calls[0][0].text).toMatch('DANGER');
    expect(customCallback).not.toHaveBeenCalled();
  });
});
