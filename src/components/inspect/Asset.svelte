<script lang="ts">
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import cssVars from 'svelte-css-vars';
  import { navigateToId, compareWithId, primaryId } from '../../stores';

  let hover: boolean;
  export let asset: ViewableItem;
  export let id: string;
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

<style lang="postcss">
  .container {
    @apply relative mb-4 transition-all duration-200 z-0 cursor-pointer;
    height: 99px;
  }
  .container.hover {
    @apply z-10;
    height: 155px;
  }
  .item {
    @apply rounded p-2 grid gap-3 max-w-full bg-transparent transition-colors;
    grid-template-columns: 94px auto;
    min-height: 0;
    min-width: 0;
  }
  .item.current {
    @apply bg-gray-200;
  }
  .compare {
    @apply flex items-center justify-center border-t border-gray-350 text-purple-500 text-sm;
    height: 40px;
  }
  .thumbnail {
    @apply relative border border-gray-350 bg-white rounded-sm bg-contain bg-center bg-no-repeat;
    width: 94px;
    height: 94px;
    background-image: var(--backgroundImage);
  }
  .info {
    @apply absolute;
    top: 1px;
    right: 1px;
  }
  .selection {
    @apply absolute pointer-events-none inset-0 border border-gray-350 rounded;
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
  <div {id} class="item" class:current>
    {#if asset.type === 'claim'}
      <div
        class="thumbnail"
        use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }}>
        <cai-tooltip
          content="This image has attribution and history data."
          class="info">
          <cai-icon name="InfoCircle_Purple" width="20px" height="20px" />
        </cai-tooltip>
      </div>
      <dl class="attributes multiline overflow-hidden self-center">
        <dt>File Name</dt>
        <dd class="truncate">{asset.title}</dd>
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
    <div
      class="compare"
      in:scale={{ start: 0.8 }}
      on:click={() => compareWithId(asset._id)}>
      Compare to current
    </div>
  {/if}
</div>
