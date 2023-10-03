<script>
  import Video from '$assets/video/cr-pin.mp4';
</script>

<div class="md:grid md:grid-cols-12 md:gap-4 xl:max-w-[1440px]">
  <div class="md:col-span-6">
    <div class="video-container">
      <video
        autoplay
        loop
        muted
        src={Video}
        class="w-full h-full max-h-full max-w-full rounded-xl xl:h-full object-cover" />
    </div>
  </div>
  <div
    class="pt-6 md:col-start-7 md:col-end-13 md:pt-0 lg:col-start-8 lg:col-end-12">
    <div class="max-w-[676px]">
      <h3 class="2xl:text-key-title-xl pb-6 text-left text-key-title">
        Introducing the Content Credentials pin
      </h3>
      <p
        class="2xl:text-key-sub-text-2xl text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl">
        Every time you see the Content Credentials pin that means Content
        Credentials have been attached to the content! Simply click on the pin
        to reveal more information.
      </p>
    </div>
  </div>
</div>

<style>
  /* CSS to set the aspect ratio for the video container */
  .video-container {
    position: relative;
    padding-bottom: 66.67%; /* 3:2 aspect ratio (2/3) */
    overflow: hidden;
  }

  /* Style the video to fill the container */
  .video-container video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
