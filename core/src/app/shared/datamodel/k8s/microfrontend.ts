import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';

export interface IMicroFrontend extends IMetaDataOwner {
  data: {};
  type: string;
  spec: any;

  isStatusOk(): boolean;

  getId(): string;

  getUid(): string;

  getLabel(): string;

  getLocation(): string;
}

export class MicroFrontend extends MetaDataOwner implements IMicroFrontend {
  data: {};
  type: string;
  spec: any;

  constructor(input: IMicroFrontend) {
    super(input.metadata, input.status);
    this.spec = input.spec;
    this.data = input.data;
    this.type = input.type;
  }

  isStatusOk(): boolean {
    return true;
  }

  public getId() {
    return this.metadata.name;
  }

  public getUid() {
    return this.metadata.uid;
  }

  public getLabel() {
    return this.spec.displayName || this.metadata.name;
  }

  public getLocation() {
    return this.spec.location;
  }

  public getNavigationNodeForPath(path: string) {
    let result = null;
    if (this.spec.navigationNodes) {
      const pathSegments = path.split('/');
      this.spec.navigationNodes.forEach(node => {
        const nodePathSegments = node.navigationPath.split('/');
        if (pathSegments.length === nodePathSegments.length) {
          let match = true;
          const params = {};
          pathSegments.forEach((segment, index) => {
            if (
              !nodePathSegments[index].startsWith(':') &&
              nodePathSegments[index] !== segment
            ) {
              match = false;
            } else if (nodePathSegments[index].startsWith(':')) {
              const paramName = nodePathSegments[index].substring(1);
              params[paramName] = segment;
            }
          });
          if (match) {
            result = { ...node };
            result.computedViewUrl = this.spec.viewBaseUrl
              ? this.spec.viewBaseUrl + node.viewUrl
              : node.viewUrl;
            Object.entries(params).forEach(entry => {
              result.computedViewUrl = result.computedViewUrl.replace(
                ':' + entry[0],
                entry[1]
              );
            });
          }
        }
      });
    }
    return result;
  }
}
