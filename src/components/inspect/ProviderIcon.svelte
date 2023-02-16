<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import AdobeStockLogo from '../../../assets/svg/color/logos/adobe-stock.svg?component';
  import AdobeLogo from '../../../assets/svg/color/logos/adobe.svg?component';
  import BehanceLogo from '../../../assets/svg/color/logos/behance.svg?component';
  import FacebookLogo from '../../../assets/svg/color/logos/facebook.svg?component';
  import InstagramLogo from '../../../assets/svg/color/logos/instagram.svg?component';
  import LeicaLogo from '../../../assets/svg/color/logos/leica_logo.svg?component';
  import NikonLogo from '../../../assets/svg/color/logos/nikon.svg?component';
  import PhotoshopLogo from '../../../assets/svg/color/logos/photoshop.svg?component';
  import PinterestLogo from '../../../assets/svg/color/logos/pinterest.svg?component';
  import TruepicLogo from '../../../assets/svg/color/logos/truepic.svg?component';
  import TwitterLogo from '../../../assets/svg/color/logos/twitter.svg?component';
  import VimeoLogo from '../../../assets/svg/color/logos/vimeo.svg?component';
  import YoutubeLogo from '../../../assets/svg/color/logos/YT.svg?component';

  export let provider: string;
  let className: string = '';

  const matchers = [
    { pattern: /nikon/i, icon: NikonLogo },
    { pattern: /photoshop/i, icon: PhotoshopLogo },
    { pattern: /adobe\sstock/i, icon: AdobeStockLogo },
    { pattern: /adobe/i, icon: AdobeLogo },
    { pattern: /behance\.net/i, icon: BehanceLogo },
    { pattern: /facebook\.com/i, icon: FacebookLogo },
    { pattern: /instagram\.com/i, icon: InstagramLogo },
    // Behance staging
    { pattern: /net\.s2stagehance\.com/i, icon: BehanceLogo },
    { pattern: /truepic/i, icon: TruepicLogo },
    { pattern: /twitter\.com/i, icon: TwitterLogo },
    { pattern: /pinterest\.com/i, icon: PinterestLogo },
    { pattern: /vimeo\.com/i, icon: VimeoLogo },
    { pattern: /youtube\.com/i, icon: YoutubeLogo },
    { pattern: /leica/i, icon: LeicaLogo },
    { pattern: /M11/i, icon: LeicaLogo },
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
