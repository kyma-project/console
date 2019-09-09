import FontFaceObserver from 'fontfaceobserver';

function configureFonts() {
  // You could add multiple fonts here, but for this example, we're only using one.
  const fonts = ['72', 'SAP-icons'];
  const fontObserver = new FontFaceObserver(fonts);

  function fontLoadSuccess() {
    document.body.classList.add('fonts-loaded');
  }

  function fontLoadFailure() {
    document.body.classList.remove('fonts-loaded');
  }

  Promise.all([fontObserver].map(o => o.load())).then(
    fontLoadSuccess,
    fontLoadFailure,
  );

  return true;
}

export default configureFonts;
