<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { hierarchy } from '../../stores';
  import TreeNode from './TreeNode.svelte';
  import TreeLink from './TreeLink.svelte';
  import type { ITreeNode } from '../../lib/types';
  import { select as d3Select } from 'd3-selection';
  import { zoom as d3Zoom, ZoomBehavior, zoomIdentity } from 'd3-zoom';
  import { tree as D3Tree, HierarchyPointNode } from 'd3-hierarchy';

  let width = 1;
  let height = 1;
  let margin = 50;
  let nodeWidth = 294;
  let nodeHeight = 100;
  let hPad = 50;
  let vPad = 50;
  let svg: SVGElement;
  let bounds: SVGGraphicsElement;
  let tree: HierarchyPointNode<ITreeNode>;
  let zoom: ZoomBehavior<any, any>;

  onMount(() => {
    const svgSel = d3Select(svg);
    const boundsSel = d3Select(bounds);
    zoom = d3Zoom().on('zoom', (evt) => {
      boundsSel.attr('transform', evt.transform);
    });
    svgSel.call(zoom).call(zoom.transform, zoomIdentity);

    return () => {
      svgSel.on('.zoom', null);
    };
  });

  $: tx = width / 2;
  $: ty = height * 0.2;
  $: {
    if ($hierarchy) {
      const d3Tree = D3Tree<ITreeNode>();
      d3Tree.size([width, height]);
      d3Tree.nodeSize([nodeWidth + vPad, nodeHeight + hPad]);
      d3Tree.separation((a, b) => (a.parent === b.parent ? 2 : 1) / a.depth);
      tree = d3Tree($hierarchy);
      console.log('tree', tree);
    }
  }
  $: links = tree?.links() ?? [];
  $: descendants = (tree?.descendants() ?? []).map(
    (node) => node as HierarchyPointNode<ITreeNode>,
  );
  // We're manually calculating the dimensions and not relying on `getBBox()` or `getBoundingClientRect()`
  // here since these aren't immediately available on the group element
  $: dims = descendants.reduce(
    (acc, { x, y }) => {
      return {
        xMin: Math.min(acc.xMin, x),
        xMax: Math.max(acc.xMax, x + nodeWidth),
        yMin: Math.min(acc.yMin, y),
        yMax: Math.max(acc.yMax, y + nodeHeight),
      };
    },
    { xMin: 0, xMax: 0, yMin: 0, yMax: 0 },
  );
  $: scale = Math.min(
    width / (dims.xMax - dims.xMin + margin * 2),
    height / (dims.yMax - dims.yMin + margin * 2),
    1,
  );
  $: {
    console.log('dims', dims);
    console.log('scale', scale);
    zoom?.scaleExtent([scale, 1]);
  }
</script>

<div
  class="bg-gray-75 w-full h-full overflow-hidden"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <svg bind:this={svg} {width} {height}>
    <g bind:this={bounds}>
      <g transform={`translate(${tx}, ${ty})`}>
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
    </g>
  </svg>
</div>
