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
