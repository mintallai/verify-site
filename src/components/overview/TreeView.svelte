<script lang="ts">
  import { onMount } from 'svelte';
  import { hierarchy } from '../../stores';
  import TreeNode from './TreeNode.svelte';
  import TreeLink from './TreeLink.svelte';
  import type { ITreeNode } from '../../lib/types';
  import { select as d3Select, Selection } from 'd3-selection';
  import { zoom as d3Zoom, ZoomBehavior, zoomIdentity } from 'd3-zoom';
  import { tree as D3Tree, HierarchyPointNode } from 'd3-hierarchy';
  import ZoomIn from '../../../assets/svg/monochrome/zoom-in.svg';
  import ZoomOut from '../../../assets/svg/monochrome/zoom-out.svg';

  let width = 1;
  let height = 1;
  let margin = 50;
  let nodeWidth = 294;
  let nodeHeight = 100;
  let hPad = 50;
  let vPad = 50;
  let svg: SVGElement;
  let bounds: SVGGraphicsElement;
  let boundsSel;
  let tree: HierarchyPointNode<ITreeNode>;
  let zoom: ZoomBehavior<any, any>;

  onMount(() => {
    const svgSel = d3Select(svg);
    boundsSel = d3Select(bounds);
    zoom = d3Zoom().on('zoom', (evt) => {
      boundsSel.attr('transform', evt.transform);
    });
    svgSel.call(zoom).call(zoom.transform, zoomIdentity);

    return () => {
      svgSel.on('.zoom', null);
    };
  });

  function handleZoomIn() {
    zoom?.scaleTo(boundsSel.transition(), 1);
  }

  function handleZoomOut() {
    const sel = boundsSel.transition();
    console.log('dims', dims);
    zoom?.scaleTo(sel, scale);
    // zoom?.translateTo(sel, 0, dims.yMin + dims.yMax / 2);
  }

  $: tx = width / 2;
  $: ty = height * 0.2;
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
    zoom?.scaleExtent([scale, 1]);
  }
</script>

<div
  class="relative bg-gray-75 w-full h-full overflow-hidden"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <svg bind:this={svg} {width} {height}>
    <g bind:this={bounds}>
      <g transform={`translate(${tx}, ${ty})`}>
        {#each links as link, key (key)}
          <g>
            <TreeLink {link} {nodeWidth} {nodeHeight} />
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
  <!-- <div class="controls">
    <div class="in" on:click={handleZoomIn}>
      <ZoomIn width="20" height="20" class="text-gray-700" />
    </div>
    <div class="out" on:click={handleZoomOut}>
      <ZoomOut width="20" height="3" class="text-gray-700" />
    </div>
  </div> -->
</div>

<style lang="postcss">
  .controls {
    @apply absolute bottom-4 right-4 flex flex-col rounded-full bg-white shadow-md;
    width: 44px;
    height: 88px;
  }
  .controls > div {
    @apply flex items-center justify-center mx-1.5 cursor-pointer;
  }
  .controls .in {
    @apply border-b border-gray-300;
    height: 44px;
  }
  .controls .out {
    height: 40px;
  }
</style>
