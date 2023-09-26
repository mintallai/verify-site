<script>
  import Image from '$assets/svg/logos/homepage/hero.svg';
</script>

<div
  class="px-[1.5rem] py-[2.25rem] lg:grid lg:grid-cols-12 lg:gap-4 xl:max-w-[1440px]">
  <div
    class="px-[1.5rem] flex flex-col items-center justify-center lg:col-span-6 xxl:text-hero-title-desktop pb-6 text-center text-hero-title tracking-[-0.105rem] xl:text-center lg:text-hero-title-lg">
    Wait, where did this image come from?
    <div
      class="xxl:w-[40rem] xxl:text-hero-sub-desktop text-center text-hero-sub text-gray-900/60">
      Deepfakes. Voice cloning. It’s hard to tell what’s accurate and authentic
      online these days.
    </div>
  </div>
  <div
    class="grid pt-6 lg:col-start-7 lg:col-end-13 lg:pt-0 xl:col-start-7 xl:col-end-12">
    <img src={Image} alt="" />
    <p>placeholder</p>
  </div>
</div>
