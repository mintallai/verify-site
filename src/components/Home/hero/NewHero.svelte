<script>
  let isPopupVisible = false; // <-- Add this line

  function togglePopup() {
    isPopupVisible = !isPopupVisible;
  }
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
      class="fixed w-screen h-full max-h-[465px] rounded-t-xl bg-white p-4 bottom-0">
      <div class="w-screen font-bold">
        Content Credentials
        <div class="font-normal">Issued by Adobe Inc. on Feb 2, 2023</div>
        <button
          class="bg-red-500 text-black-500 mt-2 rounded p-2"
          on:click={togglePopup}>
          X
        </button>
      </div>
    </div>
  </div>
{/if}
