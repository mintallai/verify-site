<script lang="ts">
  import { afterUpdate } from 'svelte';
  import AdobeLogo from '../../../assets/svg/color/logos/adobe.svg';
  import PhotoshopLogo from '../../../assets/svg/color/logos/photoshop.svg';
  import TruepicLogo from '../../../assets/svg/color/logos/truepic.svg';

  export let provider: string;
  let iconComponent = null;

  const matchers = [
    { pattern: /photoshop/i, icon: PhotoshopLogo },
    { pattern: /adobe/i, icon: AdobeLogo },
    { pattern: /truepic/i, icon: TruepicLogo },
  ];

  afterUpdate(() => {
    iconComponent =
      matchers.find(({ pattern }) => pattern.test(provider?.toString() ?? ''))
        ?.icon || null;
  });
</script>

<div class="flex">
  <svelte:component this={iconComponent} width="16" height="16" />
</div>
