<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { Asset, Source } from '../lib/sdk';
  import { IBadgeProps } from '../lib/types';
  import { thumbnail, handleImgSrc, IThumbnailEvent } from '../lib/thumbnail';

  export let asset: Asset | Source;
  export let isSelected = false;
  export let badgeType: IBadgeProps['badgeType'] = 'none';
  export let badgeHelpText: IBadgeProps['badgeHelpText'] = null;
  let src = '';

  function handleThumbnail(evt: CustomEvent<IThumbnailEvent>) {
    src = evt.detail.url;
  }
</script>

<cai-thumbnail
  use:thumbnail={asset}
  on:thumbnail={handleThumbnail}
  {src}
  selected={isSelected}
  badge={badgeType}
  badgehelptext={badgeHelpText ? $_(badgeHelpText) : null}
  class="theme-spectrum" />
