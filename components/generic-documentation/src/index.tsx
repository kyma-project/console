import React, { useState, useEffect } from 'react';
import {
  DC,
  Sources,
  Plugins,
  RenderEngines,
  Renderers,
} from '@kyma-project/documentation-component';
import { plugins as markdownPlugins } from '@kyma-project/dc-markdown-render-engine';
import { TabProps } from '@kyma-project/components';

import { markdownRE, openApiRE, asyncApiRE, odataRE } from './render-engines';
import {
  ContentUILayout,
  CatalogUILayout,
  InstancesUILayout,
  CompassUILayout,
} from './layouts';
import { MarkdownRenderer } from './renderers';
import {
  disableInternalLinksMutationPlugin,
  replaceImagePathsMutationPlugin,
  removeHrefFromMarkdown,
} from './render-engines/markdown/plugins';
import { loader, ClusterDocsTopic, DocsTopic } from './loader';
import { disableClickEventFromSwagger } from './helpers';
import {
  headingPrefix,
  customFirstNode,
} from './render-engines/markdown/helpers';

const PLUGINS: Plugins = [
  markdownPlugins.frontmatterMutationPlugin,
  markdownPlugins.replaceAllLessThanCharsMutationPlugin,
  {
    plugin: markdownPlugins.headersExtractorPlugin,
    options: {
      headerPrefix: headingPrefix,
      customFirstNode,
    },
  },
  markdownPlugins.tabsMutationPlugin,
  replaceImagePathsMutationPlugin,
  disableInternalLinksMutationPlugin,
  removeHrefFromMarkdown,
];

const RENDER_ENGINES: RenderEngines = [
  {
    ...markdownRE,
    sourceTypes: ['markdown', 'mdown', 'mkdn', 'md'],
  },
  openApiRE,
  asyncApiRE,
  odataRE,
];

const RENDERERS: Renderers = {
  single: [MarkdownRenderer],
};

function renderContent(type: LayoutType, props?: any): React.ReactNode {
  switch (type) {
    case LayoutType.CONTENT_UI: {
      return <ContentUILayout renderers={RENDERERS} />;
    }
    case LayoutType.CATALOG_UI: {
      return <CatalogUILayout {...props} renderers={RENDERERS} />;
    }
    case LayoutType.INSTANCES_UI: {
      return <InstancesUILayout {...props} renderers={RENDERERS} />;
    }
    case LayoutType.COMPASS_UI: {
      return <CompassUILayout renderers={RENDERERS} />;
    }
    default:
      return null;
  }
}

export enum LayoutType {
  CONTENT_UI = 'content-ui',
  CATALOG_UI = 'catalog-ui',
  INSTANCES_UI = 'instances-ui',
  COMPASS_UI = 'compass-ui',
}

export interface GenericComponentProps {
  docsTopic?: ClusterDocsTopic | DocsTopic;
  sources?: Sources;
  layout?: LayoutType;
  additionalTabs?: TabProps[];
}

export const GenericComponent: React.FunctionComponent<
  GenericComponentProps
> = ({
  docsTopic,
  sources: srcs = [],
  layout = LayoutType.CONTENT_UI,
  ...others
}) => {
  useEffect(() => {
    disableClickEventFromSwagger();
  }, []);

  const [sources, setSources] = useState<Sources>(srcs);
  useEffect(() => {
    const fetchAssets = async () => {
      if (!docsTopic) {
        return;
      }

      loader.setDocsTopic(docsTopic);
      loader.setSortServiceClassDocumentation(layout !== LayoutType.CONTENT_UI);
      await loader.fetchAssets();

      setSources(loader.getSources(layout !== LayoutType.CONTENT_UI));
    };
    fetchAssets();
  }, [docsTopic]);

  if (!sources || !sources.length) {
    return null;
  }

  return (
    <DC.Provider
      sources={sources}
      plugins={PLUGINS}
      renderEngines={RENDER_ENGINES}
    >
      {renderContent(layout, others)}
    </DC.Provider>
  );
};
