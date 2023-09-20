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

<div class="flex w-screen items-center justify-center px-[1.5rem]">
  <div class="flex flex-col items-center justify-center pt-16">
    <div class="text-hiw-title pb-16 text-center">
      What makes Content Credential trustworthy
    </div>
    <div class="flex w-full flex-col">
      {#each data as item}
        <div class="h-[302px]">
          <div class="">
            <div
              class="text-trust-label font-Norske rounded-t-2xl px-[32px] py-[20px]"
              style={`background-color: ${item.bgColor}`}>
              {item.label}
            </div>
            <div
              class="text-trust-desc h-full rounded-b-2xl bg-[#F6F5F2] px-[32px] pt-[20px] pb-20">
              {item.description}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
