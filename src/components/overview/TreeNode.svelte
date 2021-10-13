<script lang="ts">
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyPointNode } from 'd3-hierarchy';

  export let node: HierarchyPointNode<ITreeNode>;
  export let width: number;
  export let height: number;
</script>

<rect
  {height}
  {width}
  y={-height / 2}
  x={-width / 2}
  fill="#777"
  fill-opacity="0.8">
  rx={4}></rect>
<text
  dy="60px"
  font-size={12}
  font-family="adobe-clean"
  text-anchor="middle"
  fill="#000">
  {node.data.name}
</text>
