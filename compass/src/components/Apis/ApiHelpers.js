import { CREDENTIAL_TYPE_OAUTH } from 'components/Api/Forms/CredentialForms/OAuthCredentialsForm';

// import jsyaml from 'js-yaml';
// import xmlJS from 'xml-js';

export function createApiData(basicApiData, specData, credentials) {
  const { name, description, group, targetURL, type } = basicApiData;

  let defaultAuth = null;
  if (credentials.type === CREDENTIAL_TYPE_OAUTH) {
    defaultAuth = {
      credential: {
        oauth: credentials.oAuth,
      },
    };
  }

  return {
    name,
    description,
    group: group ? group : null, // if group is '', just write null
    targetUrl: targetURL,
    spec: {
      ...specData,
      type,
    },
    defaultAuth,
  };
}

export function createEventAPIData(basicApiData, specData) {
  const { name, description, group } = basicApiData;
  const spec = specData
    ? {
        ...specData,
        eventSpecType: 'ASYNC_API',
      }
    : null;
  return {
    name,
    description,
    group: group ? group : null, // if group is '', just write null
    spec,
  };
}

export function isYAML(file) {
  return file.name.endsWith('.yaml') || file.name.endsWith('.yml');
}

export function isJSON(file) {
  return file.name.endsWith('.json');
}

export function isXML(file) {
  return file.name.endsWith('.xml');
}

export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsText(file);
  });
}

// export function parseXML(textData) {
//   const parsed = xmlJS.xml2js(textData, { compact: true });
//   // xmlJS returns empty object if parsing failed
//   if (!Object.keys(parsed).length) {
//     return null;
//   }
//   return parsed;
// }

// export function parseSpecFromText(textData) {
//   const parsers = {
//     JSON: JSON.parse,
//     XML: parseXML,
//     YAML: jsyaml.safeLoad,
//   };

//   const errors = [];
//   /* eslint-disable no-unused-vars */
//   for (const type of Object.keys(parsers)) {
//     try {
//       return {
//         spec: parsers[type](textData),
//         type,
//       };
//     } catch (e) {
//       errors.push(e);
//       // move on to the next parser
//     }
//   }
//   /* eslint-enable no-unused-vars */

//   // warn only if no parser succeeded
//   errors.forEach(console.warn);

//   return null;
// }

// export function getSpecType(spec) {
//   // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
//   if ('asyncapi' in spec) {
//     return {
//       mainType: 'ASYNC_API',
//       subType: 'ASYNC_API',
//     };
//   }
//   // according to https://swagger.io/specification/#fixed-fields
//   if ('openapi' in spec) {
//     return {
//       mainType: 'API',
//       subType: 'OPEN_API',
//     };
//   }
//   // OData should be in EDMX format
//   if ('edmx:Edmx' in spec) {
//     return {
//       mainType: 'API',
//       subType: 'ODATA',
//     };
//   }

//   return null;
// }
