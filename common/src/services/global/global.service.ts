import createUseContext from 'constate';

const useGlobalService = (context: any) => ({
  ...context,
});

const { Provider, Context } = createUseContext(useGlobalService);
export { Provider as GlobalProvider, Context as GlobalService };
