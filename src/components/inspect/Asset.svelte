<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import cssVars from 'svelte-css-vars';
  import { navigateToId, compareWithId, primaryId } from '../../stores';

  let hover: boolean;
  export let asset: ViewableItem;
  export let id: string;
  export let mini: boolean = false;
  export let hasConnector: boolean = false;
  export let current: boolean = false;

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

  $: isCurrent = asset._id === $primaryId;
  $: {
    if (isCurrent) {
      hover = false;
    }
  }
</script>

<div
  class="container"
  class:mini
  class:hover
  on:mouseenter={() => (hover = isCurrent ? false : true)}
  on:mouseleave={() => (hover = false)}
  on:click={() => navigateToId(asset._id)}
>
  {#if hasConnector}
    <div class="connector" in:scaleIn />
  {/if}
  <div {id} class="item" class:current>
    {#if asset.type === 'claim'}
      <div class="thumbnail-wrapper">
        {#if mini}
          <img src="/images/svg/nested-arrow.svg" alt="" class="nested" />
        {/if}
        <div
          class="thumbnail"
          use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }}
        >
          <cai-tooltip
            content="This image has attribution and history data."
            class="info">
            <cai-icon name="InfoCircle_Purple" width="20px" height="20px" />
          </cai-tooltip>
        </div>
      </div>
      <div>
        <dl class="attributes multiline overflow-hidden self-center">
          <dt>File Name</dt>
          <dd class="file-name" title={asset.title}>{asset.title}</dd>
        </dl>
        {#if current}
          <div class="selected">Selected</div>
        {:else}
          <div class="actions">
            <span>View</span>
            <span>·</span>
            <span on:click={() => compareWithId(asset._id)}>Compare</span>
          </div>
        {/if}
      </div>
    {:else}
      <div class="thumbnail-wrapper">
        {#if mini}
          <img src="/images/svg/nested-arrow.svg" alt="" class="nested" />
        {/if}
        <div
          class="thumbnail"
          use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }}
        />
      </div>
      <div>
        <dl class="attributes multiline overflow-hidden self-center">
          <dt>File Name</dt>
          <dd class="file-name" title={asset.title}>{asset.title}</dd>
        </dl>
        {#if current}
          <div class="selected">Selected</div>
        {:else}
          <div class="actions">
            <span>View</span>
            <span>·</span>
            <span on:click={() => compareWithId(asset._id)}>Compare</span>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .container {
    @apply relative mb-1 transition duration-200 z-0 cursor-pointer;
  }
  .item {
    @apply rounded p-2 grid gap-3 max-w-full bg-transparent transition duration-200 border border-transparent;
    grid-template-columns: 94px auto;
    min-height: 0;
    min-width: 0;
  }
  .hover .item {
    @apply border-gray-350;
  }
  .item.current {
    @apply bg-gray-200 border border-gray-200;
  }
  .mini .thumbnail-wrapper {
    @apply flex justify-between items-center;
  }
  img.nested {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
  }
  .thumbnail {
    @apply relative border border-gray-350 bg-white rounded-sm bg-contain bg-center bg-no-repeat;
    flex: 0 0 94px;
    width: 94px;
    height: 94px;
    background-image: var(--backgroundImage);
  }
  .mini .thumbnail {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
  }
  .info {
    @apply absolute;
    top: 1px;
    right: 1px;
  }
  .file-name {
    @apply truncate;
    max-width: 170px;
  }
  .selected {
    @apply italic text-sm text-gray-700;
  }
  .actions {
    @apply text-xs font-bold text-gray-700;
  }
  .connector {
    @apply absolute bg-gray-400;
    width: 2px;
    height: 25px;
    top: -14px;
    left: 54px;
    transform-origin: top;
    z-index: 5;
  }
</style>
