import React from 'react';
import { SwaggerUIBundle } from 'swagger-ui-dist';

class SwaggerConsole extends React.Component {
  componentDidMount() {
    this.createSwagger(this.prepareDataForCreate());
  }

  componentWillReceiveProps(newProps) {
    this.createSwagger(this.prepareDataForCreate());
  }

  prepareDataForCreate = () => {
    let schema = this.props.schema;
    if (this.props.url) schema = { ...schema, host: this.props.url };
    return schema;
  };

  createSwagger = schema => {
    const presets = [SwaggerUIBundle.presets.apis, this.props.plugins];

    const ui = SwaggerUIBundle({
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
  };

  render() {
    return <div id="swagger" />;
  }
}

export default SwaggerConsole;
