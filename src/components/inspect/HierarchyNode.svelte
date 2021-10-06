<script lang="ts">
  import type { HierarchyNode } from 'd3-hierarchy';
  import type { ITreeNode } from '../../lib/types';

  export let node: HierarchyNode<ITreeNode>;

  $: data = node.data;
  $: children = node.children ?? [];
</script>

<div>
  {data.name}
  {#each children as childNode}
    <svelte:self node={childNode} />
  {/each}
</div>
