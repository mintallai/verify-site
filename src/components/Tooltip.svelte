<script lang="ts">
  import { onMount } from 'svelte';
  import type { Placement, Props as TippyProps } from 'tippy.js';
  import tippy from 'tippy.js';
  let triggerElement: HTMLElement;
  let contentElement: HTMLElement;
  export let placement: Placement = 'auto-start';
  const defaultProps: Partial<TippyProps> = {
    allowHTML: true,
    theme: 'cai',
  };
  onMount(() => {
    const tippyInstance = tippy(triggerElement, {
      content: contentElement,
      placement,
      ...defaultProps,
    });
    console.log('tippyInstance', tippyInstance);
    return () => {
      tippyInstance.destroy();
    };
  });
</script>

<div class="trigger">
  <div bind:this={triggerElement}>
    <slot name="trigger">
      <cai-icon-help />
    </slot>
  </div>
  <div bind:this={contentElement} class="content"><slot name="content" /></div>
</div>

<style>
  .trigger {
    --cai-icon-width: 16px;
    --cai-icon-height: 16px;
    --cai-icon-fill: #a8a8a8;
    cursor: pointer;
  }
</style>
