<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import { HierarchyPointNode, tree as D3Tree } from 'd3-hierarchy';
  import { select as d3Select } from 'd3-selection';
  import { zoom as d3Zoom, zoomIdentity, ZoomTransform } from 'd3-zoom';
  import partial from 'lodash/partial';
  import { onMount } from 'svelte';
  import ZoomIn from '../../../assets/svg/monochrome/zoom-in.svg';
  import ZoomOut from '../../../assets/svg/monochrome/zoom-out.svg';
  import { isAncestorOf } from '../../lib/node';
  import type {
    HierarchyTreeNode,
    TreeNode as TreeNodeType,
  } from '../../stores';
  import {
    hierarchy,
    navigateTo,
    overviewTransform,
    primaryLoc,
  } from '../../stores';
  import CollapsibleSection from '../CollapsibleSection.svelte';
  import ViewControls from '../ViewControls.svelte';
  import TreeLink from './TreeLink.svelte';
  import TreeNode from './TreeNode.svelte';
  let width = 1;
  let height = 1;
  let margin = 0.95;
  let nodeWidth = 294;
  let nodeHeight = 104;
  let hPad = 50;
  let vPad = 50;
  let svg: SVGElement;
  let svgSel: any;
  let bounds: SVGGraphicsElement;
  let boundsTransform: ZoomTransform;
  let tree: HierarchyPointNode<TreeNodeType>;
  let zoom = d3Zoom().on('zoom', (evt) => {
    if (!boundsTransform && $overviewTransform) {
      boundsTransform = $overviewTransform;
    } else {
      overviewTransform.set(evt.transform);
      boundsTransform = evt.transform;
    }
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

  function handleNodeClick(node: HierarchyTreeNode) {
    const selected = $primaryLoc === node.data.loc;
    if (!selected) {
      navigateTo(node.data.loc);
    }
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
        .scale(minScaleZoom)
        .translate(
          -(bbox.x * 2 + bbox.width) / 2,
          -(bbox.y * 6 + bbox.height) / 2,
        ),
    );
  }

  onMount(() => {
    svgSel = d3Select(svg);
    svgSel
      .call(zoom)
      // Initially center on the root
      .call(zoom.transform, zoomIdentity.translate(width / 2, height * 0.3));

    return () => {
      svgSel.on('.zoom', null);
    };
  });

  $: {
    // Once the hierarchy is ready, create the tree
    if ($hierarchy) {
      const d3Tree = D3Tree<TreeNodeType>();
      d3Tree.size([width, height]);
      d3Tree.nodeSize([nodeWidth + vPad, nodeHeight + hPad]);
      d3Tree.separation((a, b) => (a.parent == b.parent ? 1 : 1));
      tree = d3Tree($hierarchy);
    }
  }
  $: tx = boundsTransform?.x ?? 0;
  $: ty = boundsTransform?.y ?? 0;
  $: scale = boundsTransform?.k ?? 1;
  // Transformation for SVG group containing vis elements
  $: gTransform = `translate(${tx}, ${ty}) scale(${scale})`;
  // Same transformation for HTML div containing vis nodes (synced with SVG)
  $: htmlTransform = `translate3d(${tx}px, ${ty}px, 0) scale3d(${scale}, ${scale}, 1)`;
  $: links = (tree?.links() ?? [])
    .map((link, idx) => {
      const { source, target } = link;
      const ancestor =
        isAncestorOf($primaryLoc, source.data.loc) &&
        isAncestorOf($primaryLoc, target.data.loc);
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
  $: descendants = tree?.descendants() ?? [];

  $: minScaleZoom = getMinScale(width, height / 2);
  $: minScale = getMinScale(width, height);
  $: {
    // Set the proper scaleExtent whenever the width/height changes
    zoom?.scaleExtent([minScale, 1]);
  }
</script>

<div
  data-test-id="tree-view"
  class="relative bg-gray-75 w-full h-full min-h-[var(--min-screen-height)] overflow-y-auto overflow-x-hidden pt-4 sm:pt-0"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <div class="absolute p-4 justify-center w-full flex z-20">
    <ViewControls inInspect={false} inOverview={true} />
  </div>
  <svg bind:this={svg} {width} {height} view-box={`0 0 ${width} ${height}`}>
    <g bind:this={bounds} transform={gTransform}>
      {#each links as { link, idx, ancestor }, _i (idx)}
        <g>
          <TreeLink {link} {ancestor} {nodeHeight} />
        </g>
      {/each}
      {#each descendants as node, key (key)}
        <g transform={`translate(${node.x}, ${node.y})`}>
          <rect
            on:click={partial(handleNodeClick, node)}
            height={nodeHeight}
            width={nodeWidth}
            x={-nodeWidth / 2}
            y={-nodeHeight / 2}
            rx={6}
            ry={6}
            class="fill-current text-gray-200 cursor-pointer" />
        </g>
      {/each}
    </g>
  </svg>
  <!-- We have to layer the HTML nodes over the SVG paths and sync the transformations
  since Safari has a bug with foreignObject elements in SVG where you cannot use relative
  positioning. This stops us from layering the badge over the thumbnail, so we had to remove
  the need for foreignObjects. I also tried to make this fully HTML, however there were issues
  with measuring the bounding box of an element that had all absolutely-positioned nodes that
  svgElement.getBBox() doesn't have. -->
  <div class="absolute top-0 left-0 z-10 pointer-events-none select-none">
    <div class="absolute top-0 left-0" style={`transform: ${htmlTransform};`}>
      {#each descendants as node, key (key)}
        <TreeNode {node} width={nodeWidth} height={nodeHeight} />
      {/each}
    </div>
  </div>
  <div class="controls">
    <div
      class="in"
      class:disabled={boundsTransform?.k === 1}
      on:click={handleZoomIn}>
      <ZoomIn width="20px" height="20px" class="text-gray-700" />
    </div>
    <div
      class="out"
      class:disabled={boundsTransform?.k === minScale}
      on:click={handleZoomOut}>
      <ZoomOut width="20px" height="3px" class="text-gray-700" />
    </div>
  </div>
</div>

<style lang="postcss">
  .controls {
    @apply absolute bottom-4 right-4 flex flex-col rounded-full bg-white shadow-md z-20;
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
