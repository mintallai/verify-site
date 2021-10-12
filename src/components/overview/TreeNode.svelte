<script lang="ts">
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyPointNode } from 'd3-hierarchy';

  export let node: HierarchyPointNode<ITreeNode>;
  export let width: number;
  export let height: number;
</script>

<rect
  height={height + 2}
  width={width + 2}
  y={-height / 2 - 1}
  x={-width / 2 - 1}
  fill="rgb(234,234,234)"
  rx={4} />
<text
  dy="60px"
  font-size={12}
  font-family="adobe-clean"
  text-anchor="middle"
  fill="#2b2b2b">
  {node.data.name}
</text>
