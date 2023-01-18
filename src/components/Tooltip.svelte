<script lang="ts">
  import { onMount } from 'svelte';
  import type { Placement, Props as TippyProps } from 'tippy.js';
  import tippy from 'tippy.js';

  export let placement: Placement = 'auto-start';
  let triggerElement: HTMLElement;
  let contentElement: HTMLElement;

  onMount(() => {
    const tippyProps: Partial<TippyProps> = {
      content: contentElement,
      placement,
      allowHTML: true,
      theme: 'cai',
    };
    const tippyInstance = tippy(triggerElement, tippyProps);

    return () => {
      tippyInstance.destroy();
    };
  });
</script>

<div>
  <div bind:this={triggerElement} class="trigger" tabindex="0">
    <slot name="trigger">
      <cai-icon-help />
    </slot>
  </div>
  <div bind:this={contentElement}><slot name="content" /></div>
</div>

<style lang="postcss">
  .trigger {
    @apply cursor-default;
    --cai-icon-width: 16px;
    --cai-icon-height: 16px;
    --cai-icon-fill: #a8a8a8;
  }
</style>
