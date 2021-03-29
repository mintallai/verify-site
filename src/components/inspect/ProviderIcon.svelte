<script lang="ts">
  import { afterUpdate } from 'svelte';
  import '@contentauth/web-components/dist/icons/color/logos/adobe';
  import '@contentauth/web-components/dist/icons/color/logos/photoshop';

  export let slotName: string;
  export let provider: string;
  let containerElement: HTMLElement;

  const matchers = [
    { pattern: /adobe/i, icon: 'cai-icon-adobe' },
    { pattern: /photoshop/i, icon: 'cai-icon-photoshop' },
  ];

  afterUpdate(() => {
    const icon = matchers.find(({ pattern }) =>
      pattern.test(provider?.toString() ?? ''),
    )?.icon;
    while (containerElement.firstChild) {
      containerElement.removeChild(containerElement.firstChild);
    }
    if (icon) {
      const iconElement = document.createElement(icon);
      containerElement.setAttribute('slot', slotName);
      containerElement.appendChild(iconElement);
    }
  });
</script>

<div class="container" bind:this={containerElement} />

<style lang="postcss">
  .container {
    display: inline-flex;
  }
</style>
