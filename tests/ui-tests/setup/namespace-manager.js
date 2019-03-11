export class NamespaceManager {
  constructor(apiClient, namespace) {
    this.api = apiClient;
    this.namespaceName = namespace;
  }

  async createIfDoesntExist() {
    if (await this.exists()) {
      console.log(
        `Namespace ${
          this.namespaceName
        } already exists. Skipping creating it...`,
      );
      return;
    }

    console.log(`Creating namespace ${this.namespaceName}...`);
    await this.api.createNamespace(this.getNamespaceObj());
  }

  async deleteIfExists() {
    if (!(await this.exists())) {
      console.log(
        `Namespace ${this.namespaceName} not found. Skipping deleting it...`,
      );
    }

    console.log(`Deleting namespace ${this.namespaceName}...`);
    await this.api.deleteNamespace(this.namespaceName);
  }

  getNamespaceObj() {
    return {
      metadata: {
        name: this.namespaceName,
        labels: { env: 'true' },
      },
    };
  }

  async exists() {
    try {
      await this.api.readNamespace(this.namespaceName);
      return true;
    } catch (err) {
      if (err.body && err.body.code !== 404) {
        throw err;
      }
    }

    return false;
  }
}
