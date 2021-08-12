<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { quintOut } from 'svelte/easing';
  import {
    storeReport,
    navigateToId,
    compareWithId,
    primaryId,
  } from '../../stores';
  import NestedArrow from '../../../assets/svg/monochrome/nested-arrow.svg';
  import { getThumbnailUrlForId, getTitle, hasClaim } from '../../lib/claim';
  import '@contentauth/web-components/dist/components/Thumbnail';
  import '@contentauth/web-components/dist/components/Tooltip';
  import type { ViewableItem } from '../../lib/types';

  let hover: boolean;
  export let asset: ViewableItem | null = null;
  export let id: string | null = null;
  export let source: ISourceInfo | null = null;
  export let indented: boolean = false;
  export let hasConnector: boolean = false;
  export let current: boolean = false;
  export let isCompareSelectMode: boolean = false;

  function scaleIn(node: HTMLElement, _params: any) {
    const existingTransform = getComputedStyle(node).transform.replace(
      'none',
      '',
    );

    return {
      delay: 300,
      duration: 500,
      easing: quintOut,
      css: (t: number) => `transform: ${existingTransform} scaleY(${t})`,
    };
  }

  function getThumbnailBadge() {
    if (hasErrors) {
      return {
        type: 'missing',
        helpText: $_('comp.asset.badgeMissingHelpText'),
      };
    }
    return {
      type: 'info',
      helpText: $_('comp.asset.badgeInfoHelpText'),
    };
  }

  // FIXME: Make sure errors come through
  // $: hasErrors = !!$errorsByIdentifier[asset?.id]?.length;
  $: hasErrors = false;
  $: isCurrent = asset?.id === $primaryId;
  $: title = asset ? getTitle(asset) : '';
  $: compare = isCompareSelectMode && !isCurrent;
  $: {
    if (isCurrent) {
      hover = false;
    }
  }
  $: badge =
    asset && hasClaim(asset)
      ? getThumbnailBadge()
      : {
          type: 'none',
          helpText: null,
        };
</script>

<div
  class="container"
  class:indented
  class:hover
  class:compare
  on:mouseenter={() => (hover = isCurrent ? false : true)}
  on:mouseleave={() => (hover = false)}
  on:click={() => {
    if (asset && !isCurrent) {
      isCompareSelectMode ? compareWithId(asset.id) : navigateToId(asset.id);
    }
  }}>
  {#if hasConnector}
    <div class="connector" in:scaleIn />
  {/if}
  <div {id} class="item" class:current>
    {#if indented}
      <div class="indent-arrow">
        <NestedArrow width="19" height="17" class="text-gray-500" />
      </div>
    {/if}
    {#if asset}
      <cai-thumbnail
        src={getThumbnailUrlForId($storeReport, asset.id)}
        selected={current}
        badge={badge.type}
        badgehelptext={badge.helpText}
        class="theme-spectrum" />
      <dl class="attributes multiline overflow-hidden self-center pr-2">
        <dt>{$_('comp.asset.fileName')}</dt>
        <dd class="file-name" {title}>{title}</dd>
      </dl>
    {:else if source}
      <cai-thumbnail
        src={source.dataUrl}
        selected={current}
        class="theme-spectrum" />
      <dl class="attributes multiline overflow-hidden self-center pr-2">
        <dt>{$_('comp.asset.fileName')}</dt>
        <dd class="file-name" title={source.name}>{source.name}</dd>
      </dl>
    {/if}
  </div>
</div>

<style lang="postcss">
  .container {
    @apply relative mb-1 transition duration-200 z-0 cursor-pointer;
  }
  .item {
    @apply grid gap-3 max-w-full bg-transparent transition-all duration-200 border-blue-500 border-r-0;
    grid-template-columns: 72px auto;
    min-height: 0;
    min-width: 0;
  }
  .compare .item {
    @apply border-r-4;
  }
  .indented .item {
    grid-template-columns: 36px 72px auto;
  }
  .indent-arrow {
    @apply flex items-center justify-end;
  }
  .file-name {
    @apply truncate;
    max-width: 170px;
  }
  .connector {
    @apply absolute bg-gray-600;
    width: 2px;
    height: 20px;
    top: -20px;
    left: 36px;
    transform-origin: top;
  }
</style>
