import React from 'react';
import { StyledSwagger } from './SwaggerCustomComponents/CustomSwaggerStyles';
class SwaggerConsole extends React.Component {
  async componentDidMount() {
    await this.createSwagger(this.prepareDataForCreate());
  }

  async componentWillReceiveProps(newProps) {
    await this.createSwagger(this.prepareDataForCreate());
  }

  prepareDataForCreate = () => {
    let schema = this.props.schema;
    if (this.props.url) schema = { ...schema, host: this.props.url };
    return schema;
  };

  createSwagger = schema => {
    return import('swagger-ui-dist').then(swagger => {
      const presets = [
        swagger.SwaggerUIBundle.presets.apis,
        this.props.plugins,
      ];

      const ui = swagger.SwaggerUIBundle({
        dom_id: '#swagger',
        spec: schema,
        presets,
        requestInterceptor: req => {
          const bearer = localStorage.getItem('bearer');
          req.headers = {
            ...req.headers,
            Authorization: bearer,
          };
          return req;
        },
      });

      return ui;
    });
  };

  render() {
    return <StyledSwagger id="swagger" />;
  }
}

export default SwaggerConsole;
