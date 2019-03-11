module.exports = {
  getStyles: async (page, elementSelector, styleProperty) => {
    const styles = await page.evaluate(elementSelector => {
      const element = document.querySelector(elementSelector);
      return JSON.parse(JSON.stringify(getComputedStyle(element)));
    }, elementSelector);
    return styleProperty ? styles[styleProperty] : styles;
  },
};
