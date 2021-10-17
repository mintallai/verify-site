<script lang="ts">
  import equal from 'fast-deep-equal';
  import { primaryPath, navigateToPath } from '../../stores';
  import Thumbnail from '../Thumbnail.svelte';
  import { getBadgeProps, getPath, isInPath } from '../../lib/claim';
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyPointNode } from 'd3-hierarchy';

  export let node: HierarchyPointNode<ITreeNode>;
  export let width: number;
  export let height: number;
  let overflow = [40, 20];

  $: x = -width / 2;
  $: y = -height / 2;
  $: path = getPath(node);
  $: isSelected = equal($primaryPath, path);
  $: isAncestor = !isSelected && isInPath($primaryPath, path);

  function handleClick() {
    if (!isSelected) {
      navigateToPath(path);
    }
  }
</script>

<rect
  {height}
  {width}
  {x}
  {y}
  class="node"
  class:selected={isSelected}
  class:ancestor={isAncestor} />
<foreignObject
  width={width + overflow[0] * 2}
  height={height + overflow[1] * 2}
  x={x - overflow[0]}
  y={y - overflow[1]}>
  <div style={`padding-left: ${overflow[0]}px; padding-top: ${overflow[1]}px;`}>
    <div class="content" on:click={handleClick}>
      <Thumbnail
        asset={node.data.asset}
        {...getBadgeProps({ claim: node.data.claim })} />
      <div>
        <h6>File name</h6>
        <div class="file-name">{node.data.name}</div>
      </div>
    </div>
  </div>
</foreignObject>

<style lang="postcss">
  .node {
    @apply stroke-current stroke-2 text-gray-400 transition;
    fill: var(--white);
    rx: 6px;
    ry: 6px;
  }
  .node.selected {
    @apply text-blue;
  }
  .node.ancestor {
    @apply text-gray-700;
  }
  .content {
    @apply grid gap-x-2 items-center w-full h-full p-2.5 bg-transparent cursor-pointer;
    grid-template-columns: 80px auto;
    --cai-thumbnail-size: 80px;
    --cai-thumbnail-badge-icon-width: 20px;
    --cai-thumbnail-badge-icon-height: 20px;
  }
  .file-name {
    @apply truncate;
    width: 185px;
  }
</style>
