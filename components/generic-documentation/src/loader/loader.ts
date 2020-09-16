import {
  Asset,
  File,
  ClusterAssetGroup,
  AssetGroup,
} from '@kyma-project/common';
import {
  SourceWithOptions,
  Sources,
} from '@kyma-project/documentation-component';
import {
  markdownDefinition,
  openApiDefinition,
  asyncApiDefinition,
  odataDefinition,
} from '../constants';

type AG = ClusterAssetGroup | AssetGroup;

export class DocsLoader {
  private sources: SourceWithOptions[] = [];
  private assetGroup: AG = {} as AG;
  private sortServiceClassDocumentation: boolean = false;

  setAssetGroup(assetGroup: AG): void {
    this.assetGroup = assetGroup;
    this.clear();
  }

  setSortServiceClassDocumentation(sort: boolean = false): void {
    this.sortServiceClassDocumentation = sort;
  }

  async fetchAssets(): Promise<void> {
    await Promise.all([
      await this.setDocumentation(),
      await this.setSpecification(openApiDefinition.possibleTypes),
      await this.setSpecification(asyncApiDefinition.possibleTypes),
      await this.setSpecification(odataDefinition.possibleTypes),
    ]).then(r => (this.sources = r.flat()));
  }

  getSources(considerAsGroup: boolean = false): Sources {
    if (!considerAsGroup) {
      return this.sources;
    }

    const sources: Sources = [
      {
        sources: this.sources,
      },
    ];
    return sources;
  }

  private async setDocumentation(): Promise<SourceWithOptions[]> {
    const markdownFiles = this.extractDocumentation();

    if (markdownFiles) {
      const sources = (
        await Promise.all(markdownFiles.map(file => this.fetchFile(file, 'md')))
      ).filter(source => source && source !== undefined) as SourceWithOptions[];

      if (sources && sources.length) {
        return sources;
      }
    }
    return [];
  }

  private sortByURL(f1: File, f2: File): number {
    return f1.url.localeCompare(f2.url);
  }

  private async setSpecification(
    types: string[],
  ): Promise<SourceWithOptions[]> {
    const specification = this.extractSpecification(types);

    const newSources = (await Promise.all(
      specification.map(async file =>
        this.fetchFile(file, types[0]).then(res => res),
      ),
    )) as SourceWithOptions[];

    return newSources.map((sourceToCheck, index) => {
      if (
        sourceToCheck.source.data &&
        newSources.findIndex(
          otherSource =>
            otherSource.source.data &&
            sourceToCheck.source.data &&
            otherSource.source.data.displayName ===
              sourceToCheck.source.data.displayName,
        ) !== index
      ) {
        // there's a source with the same displayName
        sourceToCheck.source.data.displayName += ` [${index}]`;
      }
      return sourceToCheck;
    });
  }

  private async fetchFile(
    file: File | undefined,
    type: string,
  ): Promise<SourceWithOptions | undefined> {
    if (!file) {
      return;
    }

    return await fetch(file.url)
      .then(response => response.text())
      .then(text => {
        if (markdownDefinition.possibleTypes.includes(type)) {
          return this.serializeMarkdownFile(file, text);
        }

        const source: SourceWithOptions = {
          source: {
            type,
            rawContent: text,
            data: {
              displayName: file.displayName,
              frontmatter: file.metadata,
              url: file.url,
            },
          },
        };

        return source;
      })
      .catch(err => {
        throw err;
      });
  }

  private serializeMarkdownFile(
    file: File,
    rawContent: any,
  ): SourceWithOptions {
    const source: SourceWithOptions = {
      source: {
        type: 'md',
        rawContent,
        data: {
          frontmatter: file.metadata,
          url: file.url,
          disableRelativeLinks: this.isTrue(
            file.parameters && file.parameters.disableRelativeLinks,
          ),
        },
      },
    };

    const fileName = file.url
      .split('/')
      .reverse()[0]
      .replace('.md', '');
    let frontmatter = source.source.data!.frontmatter;

    if (!frontmatter) {
      frontmatter = {};
    }

    if (!frontmatter.title) {
      frontmatter.title = fileName;
      if (!frontmatter.type) {
        frontmatter.type = fileName;
      }
    }
    source.source.data!.frontmatter = frontmatter;

    return source;
  }

  private extractDocumentation(): File[] {
    const markdownAssets = this.extractAssets(markdownDefinition.possibleTypes);

    let data: File[] = [];
    if (markdownAssets) {
      markdownAssets.map(asset => {
        if (asset.files) {
          const files = asset.files
            .filter(el => el.url.endsWith('.md'))
            .map(
              el =>
                ({
                  ...el,
                  parameters: {
                    disableRelativeLinks:
                      asset.parameters && asset.parameters.disableRelativeLinks,
                  },
                } as File),
            );

          data = [...data, ...files];
        }
      });
    }

    if (data && this.sortServiceClassDocumentation) {
      data = data.sort((first, sec) => {
        const nameA =
          first.metadata &&
          (first.metadata.title || first.metadata.type || '').toLowerCase();
        const nameB =
          first.metadata &&
          (sec.metadata.title || sec.metadata.type || '').toLowerCase();

        if (nameA === 'overview') {
          return -1;
        }
        if (nameB === 'overview') {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }

    return data;
  }

  private extractSpecification(types: string[]): File[] {
    const assets = this.extractAssets(types);

    const files =
      assets &&
      assets
        .map(asset => {
          const newFile = asset.files && asset.files[0];
          if (newFile) {
            newFile.displayName = asset.displayName || '';
          }
          return newFile;
        })
        .filter(a => a)
        .sort(this.sortByURL);

    return files || [];
  }

  private extractAssets(types: string[]): Asset[] | undefined {
    const assets = this.assetGroup && (this.assetGroup.assets as Asset[]);
    return assets.filter(asset => types.includes(asset.type));
  }

  private clear(): void {
    this.sources = [];
  }

  private isTrue(value: any): boolean {
    if (!value) {
      return false;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return !!value;
  }
}

export const loader = new DocsLoader();
