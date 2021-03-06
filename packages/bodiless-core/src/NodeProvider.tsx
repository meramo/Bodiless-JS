/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useContext } from 'react';
import { ContentNode, DefaultContentNode } from './ContentNode';

type NodeMap<D> = {
  activeCollection: string;
  collections: {
    [collection: string]: ContentNode<any>;
  };
};

const context = React.createContext<NodeMap<any>>({
  activeCollection: '_default',
  collections: {
    _default: DefaultContentNode.dummy(),
  },
});

const NodeConsumer = context.Consumer;

const useNode = <D extends object>(collection?: string) => {
  const map = React.useContext(context);
  // If no collection is specified, then return a node from the
  // collection which was set by the most recent NodeProvier.
  const key = collection || map.activeCollection || '_default';
  return {
    node: map.collections[key] as ContentNode<D>,
  };
};

// Gets data handlers from the current node,
const useNodeDataHandlers = <D extends object>(
  collection?: string,
  defaultValue: D = {} as D,
) => {
  const { node } = useNode<D>(collection);
  return {
    setComponentData: (data: D) => node.setData(data),
    componentData: { ...defaultValue, ...node.data },
  };
};

export type Props = {
  node: ContentNode<any>;
  collection?: string;
};

const NodeProvider: React.FC<Props> = ({ node, collection, children }) => {
  const currentValue = useContext(context);
  // If no collection specified, then create a new node in the active collection.
  const activeCollection = collection || currentValue.activeCollection || '_default';
  const newValue = {
    activeCollection,
    collections: { ...currentValue.collections, [activeCollection]: node },
  };
  return <context.Provider value={newValue}>{children}</context.Provider>;
};

export default NodeProvider;
export { NodeConsumer, useNode, useNodeDataHandlers };
