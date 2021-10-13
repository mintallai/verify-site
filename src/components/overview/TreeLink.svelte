<script lang="ts">
  import { path as d3Path, Path } from 'd3-path';
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyPointLink } from 'd3-hierarchy';

  export let link: HierarchyPointLink<ITreeNode>;

  // Default LinkVertical bezier curve implementation from D3
  function curveVertical(
    context: Path,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ) {
    context.moveTo(x0, y0);
    context.bezierCurveTo(x0, (y0 = (y0 + y1) / 2), x1, y0, x1, y1);
    return context;
  }

  $: source = link.source;
  $: target = link.target;
  $: path = curveVertical(d3Path(), source.x, source.y, target.x, target.y);
  $: pathData = path.toString();
</script>

<path d={pathData} fill="none" stroke="#000" stroke-width="1" />
