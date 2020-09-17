<script lang="ts">
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import cssVars from 'svelte-css-vars';
  import { formatDate } from '../lib/util/format';
  import Button from './Button.svelte';
  import { getIdentifier } from '../lib/claim';
  import { navigateToId, compareWithId, primaryId } from '../stores';

  let hover: boolean;
  export let asset: ViewableItem;
  export let hasConnector: boolean = false;

  function scaleIn(node, params) {
    const existingTransform = getComputedStyle(node).transform.replace(
      'none',
      '',
    );

    return {
      delay: 300,
      duration: 500,
      easing: quintOut,
      css: (t, u) => `transform: ${existingTransform} scaleY(${t})`,
    };
  }

  $: isCurrent = asset._id === $primaryId;
  $: {
    if (isCurrent) {
      hover = false;
    }
  }
</script>

<style lang="postcss">
  .container {
    @apply relative mb-4 p-2 transition-all duration-200 z-0 cursor-pointer;
    height: 99px;
  }
  .container.hover {
    @apply z-10;
    height: 155px;
  }
  .item {
    @apply grid gap-5 max-w-full;
    grid-template-columns: 94px auto;
    min-height: 0;
    min-width: 0;
  }
  .thumbnail {
    @apply border border-gray-350 bg-white rounded-sm bg-contain bg-center bg-no-repeat;
    width: 94px;
    height: 94px;
    background-image: var(--backgroundImage);
  }
  .selection {
    @apply absolute pointer-events-none inset-0 shadow-md rounded;
    @apply transition duration-200 ease-in-out transform opacity-0 scale-90;
  }
  .selection.hover {
    @apply opacity-100 scale-100;
  }
  .connector {
    @apply absolute bg-gray-350;
    width: 2px;
    height: 25px;
    top: -14px;
    left: 54px;
    transform-origin: top;
    z-index: -1;
  }
</style>

<div
  class="container"
  class:hover
  on:mouseenter={() => (hover = isCurrent ? false : true)}
  on:mouseleave={() => (hover = false)}
  on:click={() => navigateToId(asset._id)}>
  <div class="selection" class:hover />
  {#if hasConnector}
    <div class="connector" in:scaleIn />
  {/if}
  <div class="item">
    {#if asset.type === 'claim'}
      <div
        class="thumbnail"
        use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }} />
      <dl class="attributes multiline overflow-hidden self-center">
        <dt>Edited By</dt>
        <dd>{asset.contributor}</dd>
        <dt>Export Date</dt>
        <dd>{formatDate(asset.date_created)}</dd>
      </dl>
    {:else}
      <div
        class="thumbnail"
        use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }} />
      <dl class="attributes multiline overflow-hidden self-center">
        <dt>File Name</dt>
        <dd class="truncate">{asset.title}</dd>
      </dl>
    {/if}
  </div>
  {#if hover}
    <div class="grid grid-cols-2 gap-3 mt-2" in:scale={{ start: 0.8 }}>
      <Button secondary on:click={() => navigateToId(asset._id)}>View</Button>
      <Button secondary on:click={() => compareWithId(asset._id)}>
        Compare
      </Button>
    </div>
  {/if}
</div>
