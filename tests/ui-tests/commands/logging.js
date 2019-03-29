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
        const resultRowArraySelector = '.fd-table > fd-table-body > tbody > tr';
        return Array.from(document.querySelectorAll(resultRowArraySelector));
      });
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
};
