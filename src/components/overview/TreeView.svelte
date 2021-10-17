<script lang="ts">
  import { onMount } from 'svelte';
  import { primaryPath, hierarchy } from '../../stores';
  import { getPath, isInPath } from '../../lib/claim';
  import TreeNode from './TreeNode.svelte';
  import TreeLink from './TreeLink.svelte';
  import type { ITreeNode } from '../../lib/types';
  import { select as d3Select } from 'd3-selection';
  import { zoom as d3Zoom, zoomIdentity, ZoomTransform } from 'd3-zoom';
  import { tree as D3Tree, HierarchyPointNode } from 'd3-hierarchy';
  import ZoomIn from '../../../assets/svg/monochrome/zoom-in.svg';
  import ZoomOut from '../../../assets/svg/monochrome/zoom-out.svg';

  let width = 1;
  let height = 1;
  let margin = 0.95;
  let nodeWidth = 294;
  let nodeHeight = 100;
  let hPad = 50;
  let vPad = 50;
  let svg: SVGElement;
  let svgSel: any;
  let bounds: SVGGraphicsElement;
  let boundsSel: any;
  let boundsTransform: ZoomTransform;
  let tree: HierarchyPointNode<ITreeNode>;
  let zoom = d3Zoom().on('zoom', (evt) => {
    boundsTransform = evt.transform;
  });

  function getMinScale(svgWidth: number, svgHeight: number) {
    const bbox = bounds?.getBBox();
    if (bbox) {
      const xRatio = bbox.width / svgWidth;
      const yRatio = bbox.height / svgHeight;
      return Math.min(1, margin / Math.max(xRatio, yRatio));
    }
    return 1;
  }

  function handleZoomIn() {
    zoom.scaleTo(svgSel.transition(), 1);
  }

  function handleZoomOut() {
    const sel = svgSel.transition();
    const bbox = bounds.getBBox();
    sel.call(
      zoom.transform,
      zoomIdentity
        .translate(width / 2, height / 2)
        .scale(minScale)
        .translate(
          -(bbox.x * 2 + bbox.width) / 2,
          -(bbox.y * 2 + bbox.height) / 2,
        ),
    );
  }

  onMount(() => {
    svgSel = d3Select(svg);
    boundsSel = d3Select(bounds);
    svgSel
      .call(zoom)
      // Initially center on the root
      .call(zoom.transform, zoomIdentity.translate(width / 2, height * 0.2));

    return () => {
      svgSel.on('.zoom', null);
    };
  });

  $: {
    // Once the hierarchy is ready, create the tree
    if ($hierarchy) {
      const d3Tree = D3Tree<ITreeNode>();
      d3Tree.size([width, height]);
      d3Tree.nodeSize([nodeWidth + vPad, nodeHeight + hPad]);
      d3Tree.separation((a, b) => (a.parent == b.parent ? 1 : 1));
      tree = d3Tree($hierarchy);
    }
  }
  $: {
    boundsSel?.attr('transform', boundsTransform);
  }
  $: links = (tree?.links() ?? [])
    .map((link, idx) => {
      const { source, target } = link;
      const ancestor =
        isInPath($primaryPath, getPath(source)) &&
        isInPath($primaryPath, getPath(target));
      return { link, idx, ancestor };
    })
    // Make sure the highlighted (ancestor) paths appear on top
    .sort((a, b) => {
      if (a.ancestor && !b.ancestor) {
        return 1;
      }
      if (!a.ancestor && b.ancestor) {
        return -1;
      }
      return 0;
    });
  $: descendants = (tree?.descendants() ?? []).map(
    (node) => node as HierarchyPointNode<ITreeNode>,
  );
  $: minScale = getMinScale(width, height);
  $: {
    // Set the proper scaleExtent whenever the width/height changes
    zoom?.scaleExtent([minScale, 1]);
  }
</script>

<div
  class="relative bg-gray-75 w-full h-full overflow-hidden"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <svg bind:this={svg} {width} {height} view-box={`0 0 ${width} ${height}`}>
    <g bind:this={bounds}>
      {#each links as { link, idx, ancestor }, _i (idx)}
        <g>
          <TreeLink {link} {ancestor} {nodeHeight} />
        </g>
      {/each}
      {#each descendants as node, key (key)}
        <g transform={`translate(${node.x}, ${node.y})`}>
          <TreeNode {node} width={nodeWidth} height={nodeHeight} />
        </g>
      {/each}
    </g>
  </svg>
  <div class="controls">
    <div
      class="in"
      class:disabled={boundsTransform?.k === 1}
      on:click={handleZoomIn}>
      <ZoomIn width="20" height="20" class="text-gray-700" />
    </div>
    <div
      class="out"
      class:disabled={boundsTransform?.k === minScale}
      on:click={handleZoomOut}>
      <ZoomOut width="20" height="3" class="text-gray-700" />
    </div>
  </div>
</div>

<style lang="postcss">
  .controls {
    @apply absolute bottom-4 right-4 flex flex-col rounded-full bg-white shadow-md;
    width: 44px;
    height: 88px;
  }
  .controls > div {
    @apply flex items-center justify-center mx-1.5 cursor-pointer transition-opacity;
  }
  .controls .in {
    @apply border-b border-gray-300;
    height: 44px;
  }
  .controls .out {
    height: 40px;
  }
  .controls .disabled {
    @apply pointer-events-none cursor-default opacity-30;
  }
</style>
