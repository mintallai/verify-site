<!-- Popup.svelte -->
<script>
  export let isOpen = false; // To control the menu's visibility

  // Function to toggle the menu
  export function togglePopup() {
    isOpen = !isOpen;
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

<!-- Popup markup -->
<div
  class="popup shadow-lg absolute right-4 top-12 mb-10 rounded-lg p-2"
  class:visible={isOpen}>
  {#if isOpen}
    <div class="h-full w-[350px] rounded-xl bg-brand-white py-4">
      <div class="py-3">
        <h1 class="px-6 pb-3 text-[24px] font-bold">Content Credentials</h1>
        <p class="px-6 text-gray-900/60">Issued by Adobe Inc. on Feb 2. 2023</p>
      </div>
      <hr />
      <div class="px-6 py-3">
        {#each data as item}
          <div class="flex flex-row items-center gap-1 py-2">
            <div class="pb-1">{item.Notice}</div>
          </div>
          <hr class="py-1" />
          <div class="flex flex-row items-center gap-1 py-2">
            <div class="font-bold pb-1">{item.ProducedLabel}</div>
            <div>{item.ProducedValue}</div>
          </div>
          <hr class="pt-2" />
          <div class="flex flex-row items-center gap-1 py-2">
            <div class="font-bold pb-1">{item.CompanyLabel}</div>
            <div>{item.CompanyValue}</div>
          </div>
          <hr class="pt-2" />
          <div class="flex flex-row items-center gap-1 py-2">
            <div class="font-bold pb-1">{item.WebsiteLabel}</div>
            <div class="text-blue-700 underline">
              <a href={item.WebsiteValue}>{item.WebsiteValue}</a>
            </div>
          </div>
          <hr class="pt-2" />
          <div class="flex flex-col justify-center gap-1 py-2">
            <div class="font-bold py-1">{item.CaptionLabel}</div>
            <div class="pb-1">{item.CaptionValue}</div>
          </div>
          <hr class="pt-2" />
          <div class="flex flex-col justify-center gap-1 py-2">
            <div class="font-bold py-1">{item.AppLabel}</div>
            <div class="pb-1">{item.AppValue}</div>
          </div>
          <hr class="pt-2" />
          <div class="flex flex-row items-center gap-1 py-2">
            <div class="font-bold pb-1">{item.AdditionalLabel}</div>
            <div>{item.AdditionalValue}</div>
          </div>
          <hr class="pt-2" />
        {/each}
      </div>

      <!-- {#each data as item}
        <div class="px-6 py-3">
          <div class="flex flex-row items-center justify-start gap-1">
            <div class="font-bold">{item.label}</div>
            <div>{item.value}</div>
          </div>
        </div>
        <hr class="mx-6 pt-2" />
      {/each} -->
      <div class="h-[60px] w-full px-6 py-1">
        <button class="h-full w-full rounded-full bg-brand-orange text-[24px]"
          >View more</button>
      </div>
    </div>
  {/if}
</div>
