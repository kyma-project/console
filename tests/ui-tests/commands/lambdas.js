import config from '../config';
import request from 'request';

module.exports = {
  getLambdas: async page => {
    try {
      return await page.evaluate(() => {
        const lambdasArraySelector = 'tbody tr';
        return Array.from(document.querySelectorAll(lambdasArraySelector));
      });
    } catch (e) {
      console.log(document.documentElement.innerHTML);
      throw e;
    }
  },
  clearData: token => {
    const req = {
      url: `https://apiserver.${
        config.domain
      }/apis/kubeless.io/v1beta1/namespaces/qa/functions/${config.testLambda}`,
      method: 'DELETE',
      headers: { Authorization: token },
    };

    return new Promise((resolve, reject) => {
      request(req, (error, response) => {
        if (error) {
          reject(error);
        }

        if (response) {
          console.log(
            '####################\nREMOVE LAMBDA\n####################',
          );
          resolve(response);
        }
      });
    });
  },
};
