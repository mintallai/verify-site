<script lang="ts">
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyPointNode } from 'd3-hierarchy';

  export let node: HierarchyPointNode<ITreeNode>;
  export let width: number;
  export let height: number;

  $: x = -width / 2;
  $: y = -height / 2;
</script>

<rect {height} {width} {x} {y} class="node" />
<foreignObject {height} {width} {x} {y}>
  <div>{node.data.name}</div>
</foreignObject>

<style lang="postcss">
  .node {
    @apply stroke-current stroke-2 text-gray-400;
    fill: var(--white);
    rx: 6px;
    ry: 6px;
  }
</style>
