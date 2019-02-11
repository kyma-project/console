module.exports = {
  getLabels: async page => {
    try {
      return await page.evaluate(() => {
        const labelSelector = 'label';
        return Array.from(document.getElementById(labelSelector).options);
      });
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
  getLabelValues: async page => {
    try {
      return await page.evaluate(() => {
        const labelSelector = 'labelValue';
        return Array.from(document.getElementById(labelSelector).options);
      });
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
  getSearchResult: async page => {
    try {
      return await page.evaluate(() => {
        const lambdasArraySelector = '.fd-table';
        return Array.from(document.querySelectorAll(lambdasArraySelector));
      });
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  }
};
