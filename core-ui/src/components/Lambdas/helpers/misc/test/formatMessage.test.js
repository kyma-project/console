import { formatMessage } from '../formatMessage';

describe('formatMessage', () => {
  test('should return formatted message', () => {
    const name = 'Epstein';
    const message = `{name} didn't kill himself`;
    const expected = `${name} didn't kill himself`;
    const result = formatMessage(message, {
      name,
    });

    expect(result).toEqual(expected);
  });

  test('should return formatted message without variables', () => {
    const message = `{name} didn't kill himself`;
    const result = formatMessage(message);

    expect(result).toEqual(message);
  });

  test('should return formatted message with non string variables', () => {
    const number = 2137;
    const message = `Pico {number} Bello`;
    const expected = `Pico ${number} Bello`;
    const result = formatMessage(message, {
      number,
    });

    expect(result).toEqual(expected);
  });
});
