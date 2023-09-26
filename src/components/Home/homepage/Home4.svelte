<script>
  import Video from '$assets/video/cr-pin.mp4';
</script>

<div class="px-[1.5rem] lg:grid lg:grid-cols-12 lg:gap-4 xl:max-w-[1440px]">
  <div class="lg:col-span-6">
    <!-- Your image goes here -->
    <video
      autoplay
      loop
      muted
      src={Video}
      class="max-h-full max-w-full rounded-xl xl:h-full xxl:h-full xxl:w-full" />
  </div>
  <div
    class="pt-6 lg:col-start-7 lg:col-end-13 lg:pt-0 xl:col-start-8 xl:col-end-12">
    <div class="max-w-[676px]">
      <!-- Adjust the max-width as needed -->

      <div class="pb-6 text-left text-key-title xxl:text-key-title-xl">
        Introducing the Content Credentials pin
      </div>
      <div
        class="text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl xxl:text-key-sub-text-xxl">
        Every time you see the Content Credentials pin that means Content
        Credentials have been attached to the content! Simply click on the pin
        to reveal more information.
      </div>
    </div>
  </div>
</div>
