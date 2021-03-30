<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { navigateToId, compareWithId, primaryId } from '../../stores';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/components/Thumbnail';

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
  $: badge =
    asset.type === 'claim'
      ? {
          type: 'info',
          helpText: 'This image has attribution and history data.',
        }
      : {
          type: 'none',
        };
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
        <svg viewBox="0 0 19 17" xmlns="http://www.w3.org/2000/svg">
          <g
            stroke="#A8A8A8"
            stroke-width="2"
            fill="none"
            fill-rule="evenodd"
            stroke-linecap="round"
          >
            <path d="M1.5 1v5a4 4 0 004 4h10" />
            <path d="M11.25 4l6 6-6 6" />
          </g>
        </svg>
      </div>
    {/if}
    <cai-thumbnail
      src={asset.thumbnail_url}
      selected={current}
      badge={badge.type}
      badgehelptext={badge.helpText}
      class="theme-spectrum"
    />
    <div class="flex items-center">
      <dl class="attributes multiline overflow-hidden self-center">
        <dt>File Name</dt>
        <dd class="file-name" title={asset.title}>{asset.title}</dd>
      </dl>
    </div>
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
    @apply flex items-center justify-end;
  }
  .indent-arrow svg {
    width: 19px;
    height: 17px;
  }
  .file-name {
    @apply truncate;
    max-width: 170px;
  }
  .connector {
    @apply absolute bg-gray-600;
    width: 2px;
    height: 17px;
    top: -20px;
    left: 36px;
    transform-origin: top;
    z-index: 5;
  }
</style>
