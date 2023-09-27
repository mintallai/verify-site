<script>
  import X from '$assets/svg/home/x.svg';

  let isPopupVisible = false; // <-- Add this line

  function togglePopup() {
    isPopupVisible = !isPopupVisible;
  }

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

<div class="flex h-[screen-100px] w-screen items-center justify-center">
  <div
    class="xxl:col-span-12 flex h-full w-full flex-col items-center justify-between gap-[1.25rem] self-stretch p-[2rem] md:p-[2.5rem] lg:flex-row lg:gap-[1.5rem]">
    <div
      class="xxl:col-start-1 xxl:col-end-6 flex h-full w-full items-center justify-center lg:w-1/2">
      <div
        class="flex max-w-[41rem] flex-col items-start justify-center self-stretch p-[1.5rem] lg:max-w-[25rem] xl:max-w-[41rem]">
        <h1
          class="xxl:text-hero-title-desktop lg:text-hero-title-lg pb-[2rem] text-center text-hero-title tracking-[-0.105rem] xl:text-center">
          Wait, where did this image come from?
        </h1>
        <p
          class="xxl:text-hero-sub-desktop text-center text-hero-sub text-gray-900/60">
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
        <div on:click={togglePopup}>Click me to see popup</div>
        <p
          class="flex pt-[0.5rem] text-small-description text-gray-500 md:items-start">
          Click on the pin to see the Content Credentials.
        </p>
      </div>
    </div>
  </div>
</div>

<!-- Popup content -->
{#if isPopupVisible}
  <!-- Rest of screen size -->
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-blue bg-opacity-50">
    <!-- Popup Container -->
    <div
      class="fixed bottom-0 h-auto w-screen rounded-t-xl bg-white p-0.5 text-popup-text">
      <div class="h-full rounded-xl bg-brand-white py-4 px-2">
        <div class="flex flex-row justify-between">
          <div class="py-3">
            <h1 class="px-6 pb-3 text-[24px] font-bold">Content Credentials</h1>
            <p class="px-6 text-gray-900/60">
              Issued by Adobe Inc. on Feb 2. 2023
            </p>
          </div>
          <button class="pr-4 pb-6" on:click={togglePopup}>
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
          <button class="h-full w-full rounded-full bg-brand-orange text-[24px]"
            >View more</button>
        </div>
      </div>
    </div>
  </div>
{/if}
