<script lang="ts">
  import { hierarchy } from '../../stores';
  import TreeNode from './TreeNode.svelte';
  import TreeLink from './TreeLink.svelte';
  import type { ITreeNode } from '../../lib/types';
  import { tree as D3Tree, HierarchyPointNode } from 'd3-hierarchy';

  let width = 0;
  let height = 0;
  let nodeWidth = 294;
  let nodeHeight = 100;
  let hPad = 50;
  let vPad = 50;
  let svg: SVGElement;
  let tree: HierarchyPointNode<ITreeNode>;

  $: {
    if ($hierarchy) {
      const d3Tree = D3Tree<ITreeNode>();
      d3Tree.size([width, height]);
      d3Tree.nodeSize([nodeWidth + vPad, nodeHeight + hPad]);
      d3Tree.separation((a, b) => (a.parent === b.parent ? 2 : 1) / a.depth);
      tree = d3Tree($hierarchy);
    }
  }
  $: links = tree?.links() ?? [];
  $: descendants = (tree?.descendants() ?? []).map(
    (node) => node as HierarchyPointNode<ITreeNode>,
  );
</script>

<div class="bg-gray-75" bind:clientWidth={width} bind:clientHeight={height}>
  <svg bind:this={svg} {width} {height}>
    <g transform="translate(500, 100)">
      {#each links as link, key (key)}
        <g>
          <TreeLink {link} />
        </g>
      {/each}
      {#each descendants as node, key (key)}
        <g transform={`translate(${node.x}, ${node.y})`}>
          <TreeNode {node} width={nodeWidth} height={nodeHeight} />
        </g>
      {/each}
    </g>
  </svg>
</div>
