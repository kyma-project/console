Cypress.Commands.overwrite('log', (subject, message) =>
  cy.task('log', message),
);

Cypress.Commands.add(
  'getIframeBody',
  (getIframeOpts = {}, index = 0, containerSelector = '.iframeContainer') => {
    return cy
      .get(`${containerSelector} iframe`, getIframeOpts)
      .eq(index)
      .iframe();
  },
);

Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
  Cypress.log({
    name: 'iframe',
    consoleProps() {
      return {
        iframe: $iframe,
      };
    },
  });
  return new Cypress.Promise(resolve => {
    onIframeReady(
      $iframe,
      () => {
        resolve($iframe.contents().find('body'));
      },
      () => {
        $iframe.on('load', () => {
          resolve($iframe.contents().find('body'));
        });
      },
    );
  });
});

function onIframeReady($iframe, successFn, errorFn) {
  try {
    const iCon = $iframe.first()[0].contentWindow,
      bl = 'about:blank',
      compl = 'complete';
    const callCallback = () => {
      try {
        const $con = $iframe.contents();
        if ($con.length === 0) {
          // https://git.io/vV8yU
          throw new Error('iframe inaccessible');
        }
        successFn($con);
      } catch (e) {
        // accessing contents failed
        errorFn();
      }
    };
    const observeOnload = () => {
      $iframe.on('load.jqueryMark', () => {
        try {
          const src = $iframe.attr('src').trim(),
            href = iCon.location.href;
          if (href !== bl || src === bl || src === '') {
            $iframe.off('load.jqueryMark');
            callCallback();
          }
        } catch (e) {
          errorFn();
        }
      });
    };
    if (iCon.document.readyState === compl) {
      const src = $iframe.attr('src').trim(),
        href = iCon.location.href;
      if (href === bl && src !== bl && src !== '') {
        observeOnload();
      } else {
        callCallback();
      }
    } else {
      observeOnload();
    }
  } catch (e) {
    // accessing contentWindow failed
    errorFn();
  }
}
