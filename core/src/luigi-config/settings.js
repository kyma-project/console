import { config } from './config';

const createHeader = () => {
  const logo =
    config && config.headerLogoUrl
      ? config.headerLogoUrl
      : '/assets/logo.svg';
  const title = null //config?.headerTitle || null;
  
  const favicon = config ? config.faviconUrl : undefined;
  return {
    logo,
    title,
    favicon
  };
};

export const settings = 
{
    responsiveNavigation: 'simpleMobileOnly',
    sideNavFooterText: '',
    header: createHeader(), 
    appLoadingIndicator: {
      hideAutomatically: false
    }
  };