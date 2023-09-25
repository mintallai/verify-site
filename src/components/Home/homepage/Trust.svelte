<script>
  const data = [
    {
      label: 'Open-source standards',
      description:
        'Content Credentials are based on open technical standards developed and maintained by the C2PA, a cross-industry membership organization. You can review the standards anytime.',
      id: 1,
      bgColor: '#84c7fc',
    },
    {
      label: 'Clear detection of tampering',
      description:
        'Content Credentials are made possible by cryptographic processes which mean that any unsupported changes made to Content Credentials can be easily identified and exposed.',
      id: 2,
      bgColor: '#5ac97d',
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
  <div class="flex flex-col items-center justify-center">
    <div
      class="text-trust-title xs:w-[22rem] w-[27rem] md:w-[40rem] 2xl:w-[58rem] text-center py-20 xl:py-0 md:text-trust-title-md xl:text-trust-title-xl 2xl:text-trust-title-2xl">
      What makes Content Credential trustworthy
    </div>
    <!-- Media query for screens between 991px and 1280px (lg to xl) -->
    <div
      class="flex flex-col items-center lg:flex-row lg:justify-center xl:hidden">
      <div class="mb-4 lg:mb-0 lg:mr-8 xs:w-[80%]">
        <!-- Add margin for consistent gap -->
        <div
          class="text-trust-label rounded-t-2xl px-[32px] py-[20px] bg-brand-blue">
          Open-source standards
        </div>
        <div
          class="text-trust-desc lg:text-trust-desc-lg h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pb-20 pt-[20px] lg:pb-0">
          <div class="lg:h-[269px] lg:w-[325px]">
            Content Credentials are based on open technical standards developed
            and maintained by the C2PA, a cross-industry membership
            organization. You can review the standards anytime.
          </div>
        </div>
      </div>
      <div class="mb-4 lg:mb-0 xs:w-[80%]">
        <!-- Add margin for consistent gap -->
        <div
          class="text-trust-label font-Norske rounded-t-2xl px-[32px] py-[20px] bg-brand-green">
          Clear detection of tampering
        </div>
        <div
          class="text-trust-desc lg:text-trust-desc-lg h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pb-20 pt-[20px] lg:pb-0">
          <div class="lg:h-[269px] lg:w-[325px]">
            Content Credentials are made possible by cryptographic processes
            which mean that any unsupported changes made to Content Credentials
            can be easily identified and exposed.
          </div>
        </div>
      </div>
    </div>
    <div class="lg:hidden"></div>
    <!-- Empty div to create space between rows -->
    <div class="mb-4 lg:mx-auto lg:mb-0 lg:pt-12 xs:w-[80%] lg:w-1/2">
      <!-- Add margin for consistent gap and center the third item -->
      <div class="xl:hidden">
        <div
          class="text-trust-label font-Norske rounded-t-2xl px-[32px] py-[20px] bg-brand-violet">
          Accountability
        </div>
        <div
          class="text-trust-desc lg:text-trust-desc-lg h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pb-20 pt-[20px] lg:pb-0">
          <div class="lg:h-[269px] lg:w-[325px]">
            Organizations that issue Content Credentials must identify
            themselves in the Content Credentials they issue. Issuers therefore
            stake their reputations on their ability to collect and include
            information with accuracy. Learn more about the Content Credentials
            trust model.
          </div>
        </div>
      </div>
    </div>
    <!-- Media query for screens wider than 1280px (xl+) -->
    <div class="hidden justify-center gap-4 xl:flex">
      {#each data as item}
        <div class="w-[389px]">
          <div
            class="text-trust-label font-Norske rounded-t-2xl px-[32px] py-[20px]"
            style={`background-color: ${item.bgColor}`}>
            {item.label}
          </div>
          <div
            class="text-trust-desc xl:text-trust-desc-xl 2xl:text-trust-desc-2xl h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pt-[20px]">
            <div class="xl:h-[269px] xl:w-[325px]">
              {item.description}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
