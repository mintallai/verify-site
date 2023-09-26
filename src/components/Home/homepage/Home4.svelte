<script>
  import Video from '$assets/video/cr-pin.mp4';
</script>

<div class="px-[1.5rem] md:grid md:grid-cols-12 md:gap-4 xl:max-w-[1440px]">
  <div class="md:col-span-6">
    <!-- Your image goes here -->
    <video
      autoplay
      loop
      muted
      src={Video}
      class="xxl:h-full xxl:w-full max-h-full max-w-full rounded-xl xl:h-full" />
  </div>
  <div
    class="pt-6 md:col-start-7 md:col-end-13 md:pt-0 xl:col-start-8 xl:col-end-12">
    <div class="max-w-[676px]">
      <!-- Adjust the max-width as needed -->

      <h3 class="xxl:text-key-title-xl pb-6 text-left text-key-title">
        Introducing the Content Credentials pin
      </h3>
      <p
        class="xxl:text-key-sub-text-xxl text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl">
        Every time you see the Content Credentials pin that means Content
        Credentials have been attached to the content! Simply click on the pin
        to reveal more information.
      </p>
    </div>
  </div>
</div>
