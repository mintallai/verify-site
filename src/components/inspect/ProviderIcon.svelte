<script lang="ts">
  import AdobeLogo from '../../../assets/svg/color/logos/adobe.svg';
  import AdobeStockLogo from '../../../assets/svg/color/logos/adobe-stock.svg';
  import PhotoshopLogo from '../../../assets/svg/color/logos/photoshop.svg';
  import TruepicLogo from '../../../assets/svg/color/logos/truepic.svg';

  export let provider: string;
  let className: string = '';

  const matchers = [
    { pattern: /photoshop/i, icon: PhotoshopLogo },
    { pattern: /adobe\sstock/i, icon: AdobeStockLogo },
    { pattern: /adobe/i, icon: AdobeLogo },
    { pattern: /truepic/i, icon: TruepicLogo },
  ];

  $: iconComponent =
    matchers.find(({ pattern }) => pattern.test(provider?.toString() ?? ''))
      ?.icon ?? null;

  export { className as class };
</script>

{#if iconComponent}
  <div class={`w-4 h-4 ${className}`}>
    <svelte:component this={iconComponent} width="16" height="16" />
  </div>
{/if}
