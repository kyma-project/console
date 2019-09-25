import {
  SourceWithOptions,
  Sources,
} from '@kyma-project/documentation-component';
import { Asset, File, DT } from './types';
import {
  markdownTypes,
  openApiTypes,
  asyncApiTypes,
  odataTypes,
} from '../constants';

export class DocsLoader {
  private sources: SourceWithOptions[] = [];
  private docsTopic: DT = {} as DT;
  private sortServiceClassDocumentation: boolean = false;

  setDocsTopic(docsTopic: DT): void {
    this.docsTopic = docsTopic;
    this.clear();
  }

  setSortServiceClassDocumentation(sort: boolean = false): void {
    this.sortServiceClassDocumentation = sort;
  }

  async fetchAssets(): Promise<void> {
    await Promise.all([
      await this.setDocumentation(),
      await this.setSpecification(openApiTypes),
      await this.setSpecification(asyncApiTypes),
      await this.setSpecification(odataTypes),
    ]);
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

  private async setDocumentation(): Promise<void> {
    const markdownFiles = this.extractDocumentation();

    if (markdownFiles) {
      const sources = (await Promise.all(
        markdownFiles.map(file => this.fetchFile(file, 'md')),
      )).filter(
        source => source && source !== undefined,
      ) as SourceWithOptions[];

      if (sources && sources.length) {
        this.sources.push(...sources);
      }
    }
  }

  private async setSpecification(types: string[]): Promise<void> {
    const specification = this.extractSpecification(types);

    if (specification) {
      const source = await this.fetchFile(specification, types[0]);
      if (source) {
        this.sources.push(source);
      }
    }
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
        if (markdownTypes.includes(type)) {
          return this.serializeMarkdownFile(file, text);
        }

        const source: SourceWithOptions = {
          source: {
            type,
            rawContent: text,
            data: {
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
    const markdownAssets = this.extractAssets(markdownTypes);

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
                      asset.metadata && asset.metadata.disableRelativeLinks,
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

  private extractSpecification(types: string[]) {
    const assets = this.extractAssets(types);

    const file = assets && assets[0] && assets[0].files && assets[0].files[0];

    return file;
  }

  private extractAssets(types: string[]): Asset[] | undefined {
    const assets = this.docsTopic && (this.docsTopic.assets as Asset[]);

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
