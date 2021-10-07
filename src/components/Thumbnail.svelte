<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { onDestroy } from 'svelte';
  import { IThumbnail } from '../lib/sdk';
  import { IBadgeProps } from '../lib/types';

  export let thumbnail: IThumbnail;
  export let isSelected = false;
  export let badgeType: IBadgeProps['badgeType'] = 'none';
  export let badgeHelpText: IBadgeProps['badgeHelpText'] = null;

  $: src = thumbnail.url;

  onDestroy(() => {
    thumbnail.dispose?.();
  });
</script>

<cai-thumbnail
  {src}
  selected={isSelected}
  badge={badgeType}
  badgehelptext={badgeHelpText ? $_(badgeHelpText) : null}
  class="theme-spectrum" />
