<script>
  export let isOpen = false; // To control the menu's visibility

  // Function to toggle the menu
  export function togglePopup() {
    isOpen = !isOpen;
  }

  const data = [
    {
      id: 0,
      label: ' ',
      value:
        'This image combines multiple pieces of content. At least one was generated with an AI tool.',
    },
    {
      id: 1,
      label: 'Produced by',
      value: 'Benoit Lemoine',
    },
    {
      id: 2,
      label: 'Company',
      value: 'Area17',
    },
    {
      id: 3,
      label: 'Website',
      value: 'https://area17.com',
    },
    {
      id: 4,
      label: 'Caption',
      value: 'Caption goes here and can wrap to multiple lines as needed',
    },
    {
      id: 5,
      label: 'App or device used',
      value: 'Adobe Photoshop 23.0.0',
    },
    {
      id: 6,
      label: 'AI tool used',
      value: 'Adobe Firefly',
    },
    {
      id: 7,
      label: 'Additional history',
      value: 'Yes',
    },
  ];
</script>

<div
  class="popup shadow-lg absolute right-4 top-12 rounded-lg p-2 mb-10"
  class:visible={isOpen}>
  {#if isOpen}
    <div class="h-full w-[350px] rounded-xl bg-brand-white py-4">
      <div class="py-3">
        <h1 class="px-6 pb-3 text-[24px] font-bold">
          Mobile Content Credentials
        </h1>
        <p class="px-6 text-gray-900/60">Issued by Adobe Inc. on Feb 2. 2023</p>
      </div>
      <hr />
      {#each data as item}
        <div class="px-6 py-3">
          <div class="flex flex-row items-center justify-start gap-1">
            <div class="font-bold">{item.label}</div>
            <div>{item.value}</div>
          </div>
        </div>
        <hr class="mx-6 pt-2" />
      {/each}
      <div class="h-[60px] w-full px-6 py-1">
        <button class="h-full w-full rounded-full bg-brand-orange text-[24px]"
          >View more</button>
      </div>
    </div>
  {/if}
</div>
