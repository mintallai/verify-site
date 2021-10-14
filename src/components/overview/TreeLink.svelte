<script lang="ts">
  import { path as d3Path, Path } from 'd3-path';
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyPointLink } from 'd3-hierarchy';

  export let link: HierarchyPointLink<ITreeNode>;
  export let ancestor: boolean = false;
  export let nodeWidth: number;
  export let nodeHeight: number;

  function curve(
    context: Path,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ) {
    const startY = y0 + nodeHeight / 2;
    const endY = y1 - nodeHeight / 2;
    context.moveTo(x0, startY);
    if (x0 === x1) {
      context.lineTo(x1, endY);
      return context;
    }
    const midOffset = (endY - startY) / 2;
    const midY = startY + midOffset;
    const left = x0 > x1;
    if (left) {
      const midX = x0 - midOffset;
      context.bezierCurveTo(x0, midY, x0 - 20, midY, midX, midY);
      context.lineTo(x1 + midOffset, midY);
      context.bezierCurveTo(x1 + midOffset, midY, x1, midY, x1, endY);
    } else {
      const midX = x0 + midOffset;
      context.bezierCurveTo(x0, midY, x0 + 20, midY, midX, midY);
      context.lineTo(x1 - midOffset, midY);
      context.bezierCurveTo(x1 - midOffset, midY, x1, midY, x1, endY);
    }
    return context;
  }

  $: source = link.source;
  $: target = link.target;
  $: path = curve(d3Path(), source.x, source.y, target.x, target.y);
  $: pathData = path.toString();
</script>

<path d={pathData} class="link" class:ancestor />

<style lang="postcss">
  .link {
    @apply stroke-current stroke-2 text-gray-400 transition-all;
    fill: none;
  }
  .link.ancestor {
    @apply text-gray-700;
  }
</style>
