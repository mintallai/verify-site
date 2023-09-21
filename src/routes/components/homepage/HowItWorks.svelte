<script>
  import Hiw1 from '../../../../assets/png/hiw1.png';
  import Hiw2 from '../../../../assets/png/hiw2.png';
  import Hiw3 from '../../../../assets/png/hiw3.png';

  const data = [
    {
      id: 1,
      label: 'Content Credentials are created',
      labelNumber: 1,
      labelBg: '#EF9349',
      Image: Hiw1,
      description:
        'Creators choose to digitally sign their work by creating Content Credentials, which might include things like whether they used AI or not. Voila—this information gets attached to what they create!',
    },
    {
      id: 2,
      label: 'Once content is published, Content Credentials are too',
      labelNumber: 2,
      labelBg: '#FCE458',
      Image: Hiw2,
      description:
        'Once the content is published, anyone can view the information by clicking on the pin. You can also access the information through a tool called Verify, which allows you to upload content and view associated Content Credentials.',
    },
    {
      id: 3,
      label:
        'As content is edited, Content Credentials are updated to reflect what’s new',
      labelNumber: 3,
      labelBg: '#fe818b',
      Image: Hiw3,
      description:
        'Digital content is constantly being edited and remixed. Content Credentials capture the full edit history of any piece of content, so you can see how it has changed over time.',
    },
  ];
</script>

<div
  class="flex h-full w-screen flex-col items-center bg-[#F6F5F2] pb-40 p-[1.5rem]">
  <div class="text-hiw-title pt-12">How it Works</div>
  <div class="flex w-full flex-col items-center">
    <div class="">
      {#each data as item}
        <div class="lg:pt-8 xl:px-[7rem] xl:py-14 max-w-[116rem]">
          <div
            class="max-w-[86rem] flex flex-col items-start justify-between pt-12 pb-12 lg:flex-row">
            <div class="flex flex-row items-start justify-start gap-4 lg:w-1/2">
              <div
                class="flex h-[22px] w-[22px] items-center justify-center rounded-full mr-0.5 px-4 py-4"
                style={`background-color: ${item.labelBg}`}>
                {item.labelNumber}
              </div>
              <div class="text-hiw-label pr-10 xl:text-hiw-label-xl">
                {item.label}
              </div>
            </div>
            <div
              class="text-hiw-desc text-brand-gray pt-6 lg:pt-0 lg:w-1/2 xl:text-hiw-desc-xl 2xl:text-hiw-desc-2xl">
              {item.description}
            </div>
          </div>
          <img
            src={item.Image}
            alt="how it works"
            class="max-w[71.375rem] rounded-2xl 2xl:w-full" />
        </div>
      {/each}
    </div>
  </div>
</div>
