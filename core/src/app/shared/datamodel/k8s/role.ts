export interface IRole {
  metadata: any;
  roles: any;
}

export class Role implements IRole {
  metadata: any;
  roles: any;

  constructor(input: IRole) {
    this.metadata = input.metadata;
    this.roles = input.roles;
  }
}
