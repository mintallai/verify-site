<script>
  import X from '$assets/svg/home/x.svg';

  import { onMount } from 'svelte';

  // import Image from '$assets/svg/logos/homepage/hero.svg';

  import Video from '$assets/video/cr-pin.mp4';

  import Logo from '$assets/png/_pin.png';

  let isPopupVisible = false;

  let screenWidth = window.innerWidth;

  onMount(() => {
    const handleResize = () => {
      screenWidth = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  export function togglePopup() {
    isOpen = !isOpen;
  }

  // Function to toggle the mobile popup
  function toggleMobilePopup() {
    isPopupVisible = !isPopupVisible;
  }

  let isOpen = false; // To control the desktop popup's visibility

  const data = [
    {
      id: 1,
      Notice:
        'This image combines multiple pieces of content. At least one was generated with an AI tool.',
      ProducedLabel: 'Produced by',
      ProducedValue: 'Benoit Lemoine',
      CompanyLabel: 'Company',
      CompanyValue: 'Area17',
      WebsiteLabel: 'Website',
      WebsiteValue: 'https://area17.com',
      CaptionLabel: 'Caption',
      CaptionValue:
        'Caption goes here and can wrap to multiple lines as needed',
      AppLabel: 'App or device used',
      AppValue: 'Adobe Photoshop 23.0.0',
      AItoolLabel: 'AI tool used',
      AItoolValue: 'Adobe Firefly',
      AdditionalLabel: 'Additional history',
      AdditionalValue: 'Yes',
    },
  ];
</script>

<div class="flex h-[756px] w-screen items-center justify-center max-w-[90rem]">
  <div
    class="flex h-full w-full flex-col items-center justify-between gap-[1.25rem] self-stretch p-[20px] sm:p-[2rem] lg:flex-row lg:gap-[1.5rem] xxl:col-span-12">
    <div
      class="flex h-full w-full items-center justify-center lg:w-1/2 xxl:col-start-1 xxl:col-end-6">
      <div
        class="flex max-w-[41rem] flex-col items-start justify-center self-stretch p-0 md:p-[1.5rem] xl:max-w-[41rem]">
        <h1
          class="pb-[2rem] text-center text-hero-title tracking-[-0.105rem] lg:text-hero-title-lg xl:text-center xxl:text-hero-title-desktop">
          Wait, where did this image come from?
        </h1>
        <p
          class="text-center text-hero-sub text-gray-900/60 xxl:text-hero-sub-desktop">
          Deepfakes. Voice Cloning. It's hard to tell what's accurate and
          authentic online these days.
        </p>
      </div>
    </div>
    <div
      class="flex h-full w-full flex-col items-start justify-center md:items-center lg:w-1/2 lg:items-start">
      <div class="flex flex-col items-start">
        <!-- <L2Overlay imageUrl={Image} /> -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- Logo that appears on hover and can be clicked to toggle popup -->
        <div class="group relative">
          <!-- <img src={Image} alt="Click for more info" /> -->
          <video
            autoplay
            loop
            muted
            src={Video}
            class="h-full max-h-full w-full max-w-full rounded-xl object-cover xl:h-full" />
          <div
            class="absolute right-0 top-0 z-10 flex cursor-pointer lg:opacity-0 lg:transition-opacity lg:duration-200 lg:group-hover:opacity-100"
            on:click={() =>
              screenWidth > 768 ? togglePopup() : toggleMobilePopup()}>
            <img
              src={Logo}
              alt="Toggle popup"
              class="h-full w-full pr-4 pt-4" />
            <!-- {#if isOpen && screenWidth > 768}
              <div
                class="shadow-lg popup absolute right-4 top-12 mb-10 rounded-lg bg-brand-white p-2">
                {#if isOpen}
                  <div class="h-full w-[350px] rounded-xl bg-brand-white py-4">
                    <div class="py-3">
                      <h1 class="px-6 pb-3 text-[24px] font-bold">
                        Content Credentials
                      </h1>
                      <p class="px-6 text-gray-900/60">
                        Issued by Adobe Inc. on Feb 2. 2023
                      </p>
                    </div>
                    <hr />
                    <div class="px-6 py-3">
                      {#each data as item}
                        <div class="flex flex-row items-center gap-1 py-2">
                          <div class="pb-1">{item.Notice}</div>
                        </div>
                        <hr class="py-1" />
                        <div class="flex flex-row items-center gap-1 py-2">
                          <div class="pb-1 font-bold">{item.ProducedLabel}</div>
                          <div class="pb-1">{item.ProducedValue}</div>
                        </div>
                        <hr class="pt-2" />
                        <div class="flex flex-row items-center gap-1 py-2">
                          <div class="pb-1 font-bold">{item.CompanyLabel}</div>
                          <div class="pb-1">{item.CompanyValue}</div>
                        </div>
                        <hr class="pt-2" />
                        <div class="flex flex-row items-center gap-1 py-2">
                          <div class="pb-1 font-bold">{item.WebsiteLabel}</div>
                          <div class="pb-1 text-blue-700 underline">
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
                        <div class="flex flex-row items-center gap-1 py-2">
                          <div class="pb-1 font-bold">
                            {item.AdditionalLabel}
                          </div>
                          <div class="pb-1">{item.AdditionalValue}</div>
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
                {/if}
              </div>
            {/if} -->
          </div>
        </div>

        <p
          class="flex pt-[0.5rem] text-small-description text-gray-500 md:items-start">
          Click on the pin to see the Content Credentials.
        </p>
      </div>
    </div>
  </div>
</div>

{#if screenWidth <= 768}
  {#if isPopupVisible}
    <!-- Your existing mobile popup code here -->
    <!-- Rest of screen size -->
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center md:hidden">
      <!-- Popup Container -->
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
  {/if}
{/if}

<!-- {:else if isOpen && screenWidth > 768}
  <div class="shadow-lg absolute right-4 top-12 mb-10 rounded-lg p-2"></div>
{/if}  -->

<style>
  /* .popup {
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  } */
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
</style>
