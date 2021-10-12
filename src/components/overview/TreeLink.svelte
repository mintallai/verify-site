<script lang="ts">
  import { Link, linkVertical } from 'd3-shape';
  import type { ITreeNode } from '../../lib/types';
  import type { HierarchyLink, HierarchyPointLink } from 'd3-hierarchy';

  export let link: HierarchyPointLink<ITreeNode>;
  let pathData = '';

  $: {
    const lv = linkVertical();
    console.log('lv', link, lv.source);
    lv.source(link.source as any);
    lv.target(link.target as any);
    pathData = lv(link as any);
    console.log('pathData', pathData);
  }
</script>

<path d={pathData} />
