<script>
  const data = [
    {
      label: 'Open-source standards',
      description:
        'Content Credentials are based on open technical standards developed and maintained by the C2PA, a cross-industry membership organization. You can review the standards anytime.',
      id: 1,
      bgColor: '#ef9449',
    },
    {
      label: 'Clear detection of tampering',
      description:
        'Content Credentials are made possible by cryptographic processes which mean that any unsupported changes made to Content Credentials can be easily identified and exposed.',
      id: 2,
      bgColor: '#ed8089',
    },
    {
      label: 'Accountability',
      description:
        'Organizations that issue Content Credentials must identify themselves in the Content Credentials they issue. Issuers therefore stake their reputations on their ability to collect and include information with accuracy. Learn more about the Content Credentials trust model.',
      id: 3,
      bgColor: '#888ef8',
    },
  ];
</script>

<div
  class="flex w-screen items-center justify-center px-[1.5rem] lg:my-20 xl:my-40">
  <div
    class="flex flex-col items-center justify-center gap-[64px] md:gap-[80px]">
    <h2
      class="xxl:w-[58rem] xxl:text-trust-title-xxl w-[27rem] pt-20 text-center text-trust-title xs:w-[22rem] md:w-[40rem] md:text-trust-title-md xl:py-0 xl:text-trust-title-xl">
      What makes Content Credentials trustworthy
    </h2>
    <!-- Media query for screens between 991px and 1280px (lg to xl) -->
    <ul class="flex flex-col items-center xl:hidden">
      <div
        class="flex flex-col items-center lg:flex-row lg:justify-center xl:hidden">
        <li class="mb-4 xs:w-[80%] lg:mb-0 lg:mr-8">
          <!-- Add margin for consistent gap -->
          <h3
            class="rounded-t-2xl bg-brand-orange px-[32px] py-[20px] text-trust-label">
            Open-source standards
          </h3>
          <div
            class="lg:text-trust-desc-lg h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pb-20 pt-[20px] text-trust-desc lg:pb-0">
            <p class="lg:h-[269px] lg:w-[325px]">
              Content Credentials are based on open technical standards
              developed and maintained by the C2PA, a cross-industry membership
              organization. You can review the standards anytime.
            </p>
          </div>
        </li>
        <li class="mb-4 xs:w-[80%] lg:mb-0">
          <!-- Add margin for consistent gap -->
          <h3
            class="font-Norske rounded-t-2xl bg-brand-red px-[32px] py-[20px] text-trust-label">
            Clear detection of tampering
          </h3>
          <div
            class="lg:text-trust-desc-lg h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pb-20 pt-[20px] text-trust-desc lg:pb-0">
            <p class="lg:h-[269px] lg:w-[325px]">
              Content Credentials are made possible by cryptographic processes
              which mean that any unsupported changes made to Content
              Credentials can be easily identified and exposed.
            </p>
          </div>
        </li>
      </div>
      <div class="lg:hidden"></div>
      <!-- Empty div to create space between rows -->
      <li class="mb-4 xs:w-[80%] lg:mx-auto lg:mb-0 lg:w-1/2 lg:pt-12">
        <!-- Add margin for consistent gap and center the third item -->
        <div class="xl:hidden">
          <h3
            class="font-Norske rounded-t-2xl bg-brand-violet px-[32px] py-[20px] text-trust-label">
            Accountability
          </h3>
          <div
            class="lg:text-trust-desc-lg h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pb-20 pt-[20px] text-trust-desc lg:pb-0">
            <p class="lg:h-[269px] lg:w-[325px]">
              Organizations that issue Content Credentials must identify
              themselves in the Content Credentials they issue. Issuers
              therefore stake their reputations on their ability to collect and
              include information with accuracy. Learn more about the Content
              Credentials trust model.
            </p>
          </div>
        </div>
      </li>
    </ul>

    <!-- Media query for screens wider than 1280px (xl+) -->
    <ul class="hidden justify-center gap-4 xl:flex">
      {#each data as item}
        <li class="w-[389px]">
          <h3
            class="font-Norske rounded-t-2xl px-[32px] py-[20px] text-trust-label"
            style={`background-color: ${item.bgColor}`}>
            {item.label}
          </h3>
          <div
            class="xxl:text-trust-desc-xxl h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pt-[20px] text-trust-desc xl:text-trust-desc-xl">
            <p class="xl:h-[269px] xl:w-[325px]">
              {item.description}
            </p>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
