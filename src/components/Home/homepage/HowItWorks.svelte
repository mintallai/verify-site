<script>
  import Hiw1 from '$assets/svg/logos/homepage/2.svg';
  import Hiw2 from '$assets/svg/logos/homepage/1.svg';
  // import Hiw3 from '$assets/svg/logos/homepage/hiw3.svg';

  import Video from '$assets/video/cr-pin.mp4';

  const data = [
    {
      id: 1,
      label:
        'Anytime content is captured, created, or edited, Content Credentials can be attached.',
      labelNumber: 1,
      labelBg: '#EF9349',
      Image: Hiw1,
      description:
        'Creators choose to digitally sign their work by creating Content Credentials, which might include things like whether they used AI or not. Voila! This information gets added to the edit history of that content.',
    },
    {
      id: 2,
      label: 'Content Credentials are viewable across the internet',
      labelNumber: 2,
      labelBg: '#FCE458',
      Image: Hiw2,
      description:
        'Once the content is published, anyone can view the information by clicking on the pin, which reveals basic information about the image directly in context.',
    },
    // {
    //   id: 3,
    //   label: 'Go deeper to see the full edit history',
    //   labelNumber: 3,
    //   labelBg: '#fe818b',
    //   Image: Hiw3,
    //   description:
    //     'Content Credentials captures the full edit history of content in a new feature called Verify. Just click “Inspect.” The feature also allows you to upload your own content to see if edit history is available.',
    // },
  ];
</script>

<div
  class="flex h-full w-screen flex-col items-center bg-[#F6F5F2] p-[1.5rem] pb-40">
  <h2
    class="xxl:text-hiw-title-xxl pt-[4rem] text-hiw-title md:text-hiw-title-md xl:text-hiw-title-xl">
    How it Works
  </h2>
  <div class="flex w-full flex-col items-center">
    <div class="">
      {#each data as item}
        <div
          class="max-w-[90rem] pt-[96px] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px] xxl:pt-[160px]">
          <div
            class="flex max-w-[86rem] flex-col items-start justify-between sm:pb-[3.5rem] lg:flex-row xl:pb-[4rem]">
            <div class="flex flex-row items-start justify-start gap-4 lg:w-1/2">
              <div
                class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full px-4 py-4"
                style={`background-color: ${item.labelBg}`}>
                {item.labelNumber}
              </div>
              <h3 class="pr-10 text-hiw-label xl:text-hiw-label-xl">
                {item.label}
              </h3>
            </div>
            <p
              class="pt-6 text-hiw-desc text-gray-900/60 lg:w-1/2 lg:pt-0 xl:text-hiw-desc-xl xxl:text-hiw-desc-xxl">
              {item.description}
            </p>
          </div>
          <img
            src={item.Image}
            alt="how it works"
            class="max-w[71.375rem] rounded-xxl xxl:w-full" />
        </div>
      {/each}
      <!-- Video Component -->
      <div
        class="max-w-[90rem] pt-[96px] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px] xxl:pt-[160px]">
        <div
          class="flex max-w-[86rem] flex-col items-start justify-between sm:pb-[3.5rem] lg:flex-row xl:pb-[4rem]">
          <div class="flex flex-row items-start justify-start gap-4 lg:w-1/2">
            <div
              class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-red px-4 py-4">
              3
            </div>
            <h3 class="pr-10 text-hiw-label xl:text-hiw-label-xl">
              Go deeper to explore the full edit history
            </h3>
          </div>
          <p
            class="pt-6 text-hiw-desc text-gray-900/60 lg:w-1/2 lg:pt-0 xl:text-hiw-desc-xl xxl:text-hiw-desc-xxl">
            Content Credentials can capture a detailed history of changes over
            time. The Verify feature allows you to explore this information in
            depth, and upload any content to see if it has Content Credentials.
          </p>
        </div>
        <video
          autoplay
          loop
          muted
          src={Video}
          class="h-full max-h-full w-full max-w-full rounded-xl object-cover xl:h-full" />
      </div>
    </div>
  </div>
</div>
