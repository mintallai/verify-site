<script lang="ts">
  import { afterUpdate } from 'svelte';
  import AdobeLogo from '../../../assets/svg/color/logos/adobe.svg';
  import PhotoshopLogo from '../../../assets/svg/color/logos/photoshop.svg';
  import TruepicLogo from '../../../assets/svg/color/logos/truepic.svg';

  export let slotName: string;
  export let provider: string;
  let containerElement: HTMLElement;
  let iconComponent = null;

  const matchers = [
    { pattern: /adobe/i, icon: AdobeLogo },
    { pattern: /photoshop/i, icon: PhotoshopLogo },
    { pattern: /truepic/i, icon: TruepicLogo },
  ];

  afterUpdate(() => {
    iconComponent =
      matchers.find(({ pattern }) => pattern.test(provider?.toString() ?? ''))
        ?.icon || null;

    containerElement.setAttribute('slot', slotName);
  });
</script>

<div class="flex" bind:this={containerElement}>
  <svelte:component this={iconComponent} width="16" height="16" />
</div>
