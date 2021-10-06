<script lang="ts">
  import { onDestroy } from 'svelte';
  import { IThumbnail } from '../lib/sdk';

  type BadgeType = 'none' | 'info' | 'missing';

  export let thumbnail: IThumbnail;
  export let isSelected = false;
  export let badgeType: BadgeType = 'none';
  export let badgeHelpText: string | null = null;

  $: src = thumbnail.url;

  onDestroy(() => {
    thumbnail.dispose?.();
  });
</script>

<cai-thumbnail
  {src}
  selected={isSelected}
  badge={badgeType}
  badgehelptext={badgeHelpText}
  class="theme-spectrum" />
