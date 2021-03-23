<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import cssVars from 'svelte-css-vars';
  import { navigateToId, compareWithId, primaryId } from '../../stores';

  let hover: boolean;
  export let asset: ViewableItem;
  export let id: string;
  export let indented: boolean = false;
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
  class:indented
  class:hover
  on:mouseenter={() => (hover = isCurrent ? false : true)}
  on:mouseleave={() => (hover = false)}
  on:click={() => navigateToId(asset._id)}
>
  {#if hasConnector}
    <div class="connector" in:scaleIn />
  {/if}
  <div {id} class="item" class:current>
    {#if indented}
      <div class="indent-arrow">
        <img src="/images/svg/nested-arrow.svg" alt="" />
      </div>
    {/if}
    {#if asset.type === 'claim'}
      <div
        class="thumbnail"
        use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }}
      >
        <cai-tooltip
          content="This image has attribution and history data."
          class="info"
        >
          <cai-icon name="InfoCircle_Purple" width="20px" height="20px" />
        </cai-tooltip>
      </div>
      <div class="flex items-center">
        <dl class="attributes multiline overflow-hidden self-center">
          <dt>File Name</dt>
          <dd class="file-name" title={asset.title}>{asset.title}</dd>
        </dl>
      </div>
    {:else}
      <div
        class="thumbnail"
        use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }}
      />
      <div>
        <dl class="attributes multiline overflow-hidden self-center">
          <dt>File Name</dt>
          <dd class="file-name" title={asset.title}>{asset.title}</dd>
        </dl>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .container {
    @apply relative mb-1 transition duration-200 z-0 cursor-pointer;
  }
  .item {
    @apply rounded grid gap-3 max-w-full bg-transparent transition duration-200;
    grid-template-columns: 72px auto;
    min-height: 0;
    min-width: 0;
  }
  .hover .item {
    @apply border-gray-300;
  }
  .indented .item {
    grid-template-columns: 36px 72px auto;
  }
  .indent-arrow {
    @apply flex items-center justify-center;
  }
  .indent-arrow img {
    width: 20px;
    height: 20px;
  }
  .thumbnail {
    @apply relative border-transparent bg-gray-200 rounded bg-contain bg-center bg-no-repeat;
    flex: 0 0 72px;
    width: 72px;
    height: 72px;
    background-image: var(--backgroundImage);
  }
  .item.current .thumbnail {
    @apply shadow-selected;
  }
  .indented .thumbnail {
    flex: 0 0 72px;
    width: 72px;
    height: 72px;
  }
  .info {
    @apply absolute;
    top: 4px;
    right: 4px;
  }
  .file-name {
    @apply truncate;
    max-width: 170px;
  }
  .connector {
    @apply absolute bg-gray-400;
    width: 2px;
    height: 24px;
    top: -14px;
    left: 54px;
    transform-origin: top;
    z-index: 5;
  }
</style>
