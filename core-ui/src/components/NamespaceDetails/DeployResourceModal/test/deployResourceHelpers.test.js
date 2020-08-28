import { parseFile } from './../deployResourceHelpers';

const mockFileReader = returnValue => () => ({
  onload: res => res,
  readAsText: function() {
    // non-arrow function syntax is required here
    this.onload({ target: { result: returnValue } });
  },
});

describe('DeploResource helpers', () => {
  describe('parseFile', () => {
    it('returns error when file is null', async () => {
      const [content, error] = await parseFile(null);

      expect(content).toBeNull();
      expect(error).toBe('File is required');
    });

    it('returns error when file is empty', async () => {
      const [content, error] = await parseFile({ size: 0 });

      expect(content).toBeNull();
      expect(error).toBe('File cannot be empty');
    });

    it('return error on invalid content type', async () => {
      const [content, error] = await parseFile({
        size: 1,
        type: 'application/test',
      });

      expect(content).toBeNull();
      expect(error).toBe('Invalid file extension');
    });

    it('returns error on unparsable content', async () => {
      jest.spyOn(global, 'FileReader').mockImplementation(mockFileReader('{a'));

      const [content, error] = await parseFile({
        size: 1,
        type: 'application/json',
      });

      expect(content).toBe(null);
      expect(error).toBe('Cannot parse file content');
    });

    it('returns error on non-object content', async () => {
      jest
        .spyOn(global, 'FileReader')
        .mockImplementation(mockFileReader('true'));

      const [content, error] = await parseFile({
        size: 1,
        type: 'application/json',
      });

      expect(content).toEqual([true]);
      expect(error).toBe('Resource must be an object');
    });

    it('returns error on empty object', async () => {
      jest.spyOn(global, 'FileReader').mockImplementation(mockFileReader('{}'));

      const [content, error] = await parseFile({
        size: 1,
        type: 'application/json',
      });

      expect(content).toMatchObject({});
      expect(error).toBe(
        'Fields "apiVersion", "kind" and "metadata" are required',
      );
    });

    it('returns error on missing field', async () => {
      jest
        .spyOn(global, 'FileReader')
        .mockImplementation(mockFileReader('{a: 0}'));

      const [content, error] = await parseFile({
        size: 1,
        type: 'application/json',
      });

      expect(content).toMatchObject([{ a: 0 }]);
      expect(error).toBe(
        'Fields "apiVersion", "kind" and "metadata" are required',
      );
    });

    it('successfully parses multiple entries', async () => {
      const testContent = `
kind: 1
apiVersion: v2
metadata: 3
---
kind: 4
apiVersion: v5
metadata: 6`;

      jest
        .spyOn(global, 'FileReader')
        .mockImplementation(mockFileReader(testContent));

      const [content, error] = await parseFile({
        size: 1,
        type: 'application/json',
      });

      expect(content).toHaveLength(2);
      expect(error).toBeFalsy();
    });
  });
});
