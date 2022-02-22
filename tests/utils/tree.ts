// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

interface Node<T> {
  data: T;
  locator: string;
}

interface TreeNode<T> {
  data: T;
  ingredients?: TreeNode<T>[];
}

interface NodeWrapper<T> extends TreeNode<T> {
  locator: string;
}

export function flattenTree<T>(tree: TreeNode<T>): Node<T>[] {
  const queue: NodeWrapper<T>[] = [
    {
      locator: '0',
      ...tree,
    },
  ];

  const nodeList: Node<T>[] = [];

  while (queue.length > 0) {
    const { ingredients, data, locator } = queue.shift();

    nodeList.push({
      locator,
      data,
    });

    if (ingredients) {
      queue.push(
        ...ingredients.map((child, idx) => ({
          locator: `${locator}.${idx}`,
          ...child,
        })),
      );
    }
  }

  return nodeList;
}
