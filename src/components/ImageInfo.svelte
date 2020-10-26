<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import cssVars from 'svelte-css-vars';
  import { tippy } from '../lib/tippy';
  import About from './About.svelte';
  import Button from './Button.svelte';
  import Coachmark from './Coachmark.svelte';

  export let claim: IClaimSummary;
  let coachmarkClicked = false;
  let popupElement: HTMLElement;
  let infoElement: HTMLElement;
  let shadowOpacity = 1;

  const svgData = `data:image/svg+xml;utf8,<svg width="5px" height="14px" viewBox="0 0 5 14" version="1.1" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <path
        d="M3.125,4.96945538 C3.47017797,4.96945538 3.75,5.25824913 3.75,5.61449428 L3.75,11.4198444 L4.375,11.4198444 C4.72017797,11.4198444 5,11.7086381 5,12.0648833 L5,13.3549611 C5,13.7112062 4.72017797,14 4.375,14 L0.625,14 C0.279822031,14 0,13.7112062 0,13.3549611 L0,12.0648833 C0,11.7086381 0.279822031,11.4198444 0.625,11.4198444 L1.25,11.4198444 L1.25,7.54961099 L0.625,7.54961099 C0.279822031,7.54961099 0,7.26081723 0,6.90457209 L0,5.61449428 C0,5.25824913 0.279822031,4.96945538 0.625,4.96945538 L3.125,4.96945538 Z M4.1013625,1.65764505 C4.10429583,1.7131356 4.104675,1.76866915 4.1025,1.8242457 C4.14034878,2.32510546 3.96392895,2.81797563 3.61966791,3.1731504 C3.27540687,3.52832516 2.79778671,3.71022928 2.3125,3.67099207 C1.82936347,3.70127406 1.35682203,3.51638403 1.01456349,3.16315192 C0.672304958,2.80991981 0.493158757,2.32222763 0.5225,1.82360066 C0.484498818,0.856481685 1.21333846,0.0406815661 2.1504125,0.00145606861 C2.2044375,-0.000814468318 2.25846667,-0.000414544199 2.3125,0.00265584097 C3.24929513,-0.0501485529 4.05019508,0.690814367 4.1013625,1.65764505 Z"
        fill="currentColor" fill-rule="nonzero"></path>
  </svg>`;

  function handleScroll(evt) {
    const target: HTMLElement = evt.target;
    const pct = (target.scrollTop + target.clientHeight) / target.scrollHeight;
    const tail = 1 - Math.max(0, pct - 0.9) * 10;
    shadowOpacity = tail;
  }

  onMount(() => {
    const instance = tippy(
      infoElement,
      {
        theme: 'cai',
        placement: 'left-start',
        offset: [-11, 10],
        interactive: true,
        content: popupElement,
        trigger: 'click',
        popperOptions: {
          modifiers: [
            {
              name: 'preventOverflow',
              enabled: false,
            },
            {
              name: 'flip',
              enabled: false,
            },
            {
              name: 'arrow',
              options: {
                padding: 16,
              },
            },
          ],
        },
        onShow() {
          coachmarkClicked = true;
        },
      },
      { hasPadding: false },
    );

    return () => {
      instance.destroy();
    };
  });
</script>

<style lang="postcss">
  .coachmark {
    @apply absolute z-10 pointer-events-none;
    top: -23px;
    right: -29px;
  }
  .info {
    @apply absolute bg-white text-black border border-gray-350 flex items-center justify-center rounded-full cursor-pointer;
    width: 24px;
    height: 24px;
    top: 0;
    right: 0;
  }
  .popup {
    width: 288px;
  }
  .inner {
    @apply flex flex-col;
    height: 600px;
  }
  .about {
    @apply flex-grow overflow-auto p-3 relative;
  }
  .button {
    @apply relative flex-shrink-0 p-3;
  }
  .shadow {
    @apply absolute left-0 right-0 bg-gradient-to-t from-current to-transparent z-10 pointer-events-none;
    color: rgba(0, 0, 0, 0.1);
    height: 10px;
    top: -10px;
    opacity: var(--shadowOpacity);
  }
  .logo {
    width: 16px;
    height: 16px;
  }
</style>

<div bind:this={popupElement} class="popup" use:cssVars={{ shadowOpacity }}>
  <div class="inner">
    <div on:scroll={handleScroll} class="about">
      <div class="flex items-center mb-3">
        <img
          src="images/svg/logos/cai.svg"
          class="logo"
          alt="Content Authenticity Initiative" />
        <h2 class="my-0 ml-2">About this content</h2>
      </div>
      <About {claim} isPopup={true} />
    </div>
    <div class="button">
      <div class="shadow" />
      <Button full={true}>View More</Button>
    </div>
  </div>
</div>
<div class="relative">
  {#if !coachmarkClicked}
    <div class="coachmark" transition:fade={{ duration: 250 }}>
      <Coachmark />
    </div>
  {/if}
  <div class="info" bind:this={infoElement}>
    <img src={svgData} alt="Info" />
  </div>
</div>
