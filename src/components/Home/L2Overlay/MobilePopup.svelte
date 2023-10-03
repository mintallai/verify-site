<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  export let isOpen = false;

  let isMobile = false;

  // Function to toggle the menu
  export function togglePopup() {
    isOpen = !isOpen;
  }

  onMount(() => {
    function handleResize() {
      isMobile = window.innerWidth <= 768;
    }

    handleResize(); // Initialize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // const data = [
  //   {
  //     id: 1,
  //     Notice:
  //       'This image combines multiple pieces of content. At least one was generated with an AI tool.',
  //     ProducedLabel: 'Produced by',
  //     ProducedValue: 'Benoit Lemoine',
  //     CompanyLabel: 'Company',
  //     CompanyValue: 'Area17',
  //     WebsiteLabel: 'Website',
  //     WebsiteValue: 'https://area17.com',
  //     CaptionLabel: 'Caption',
  //     CaptionValue:
  //       'Caption goes here and can wrap to multiple lines as needed',
  //     AppLabel: 'App or device used',
  //     AppValue: 'Adobe Photoshop 23.0.0',
  //     AItoolLabel: 'AI tool used',
  //     AItoolValue: 'Adobe Firefly',
  //     AdditionalLabel: 'Additional history',
  //     AdditionalValue: 'Yes',
  //   },
  // ];
</script>

<div
  class:visible={isOpen}
  style={isMobile
    ? 'position: fixed; bottom: 0; left: 0; width: 100%; height: auto; z-index: 1000;'
    : ''}
  class="popup shadow-lg absolute right-4 top-12 mb-10 rounded-lg p-2"
  transition:fly={{ y: 200, duration: 300 }}>
  {#if isOpen}
    <div class="h-20 bg-brand-orange">hello world!</div>
  {/if}
</div>

<!-- Code from original in Hero
  {#if isPopupVisible}
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center md:hidden">
      <div
        class="top-rounded-shadow fixed bottom-0 h-auto w-screen rounded-t-xl bg-white p-0.5 text-popup-text">
        <div class="h-full rounded-xl bg-brand-white px-2 py-4">
          <div class="flex flex-row justify-between">
            <div class="py-3">
              <h1 class="px-6 pb-3 text-[24px] font-bold">
                Content Credentials
              </h1>
              <p class="px-6 text-gray-900/60">
                Issued by Adobe Inc. on Feb 2. 2023
              </p>
            </div>
            <button class="pb-6 pr-4" on:click={toggleMobilePopup}>
              <img src={X} alt="close" />
            </button>
          </div>
          <hr />
          <div class="px-6 py-3">
            {#each data as item}
              <div class="flex flex-row items-center gap-1 py-2">
                <div class="pb-1 text-popup-text">{item.Notice}</div>
              </div>
              <hr class="py-1" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.ProducedLabel}</div>
                <div>{item.ProducedValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.CompanyLabel}</div>
                <div>{item.CompanyValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.WebsiteLabel}</div>
                <div class="text-blue-700 underline">
                  <a href={item.WebsiteValue}>{item.WebsiteValue}</a>
                </div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-col justify-center gap-1 py-2">
                <div class="py-1 font-bold">{item.CaptionLabel}</div>
                <div class="pb-1">{item.CaptionValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-col justify-center gap-1 py-2">
                <div class="py-1 font-bold">{item.AppLabel}</div>
                <div class="pb-1">{item.AppValue}</div>
              </div>
              <hr class="pt-2" />
              <div class="flex flex-row gap-1 py-2">
                <div class="pb-1 font-bold">{item.AdditionalLabel}</div>
                <div>{item.AdditionalValue}</div>
              </div>
              <hr class="pt-2" />
            {/each}
          </div>
          <div class="h-[60px] w-full px-6 py-1">
            <button
              class="h-full w-full rounded-full bg-brand-orange text-[24px]"
              >View more</button>
          </div>
        </div>
      </div>
    </div>
  {/if} -->
<!-- {:else if isOpen && screenWidth > 768}
  <div class="shadow-lg absolute right-4 top-12 mb-10 rounded-lg p-2"></div> -->
<!-- {/if} -->

<!-- <style>
  .top-rounded-shadow::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px; /* Height of the shadow */
    border-radius: 12px 12px 0 0;
    box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);
  }
</style> -->
