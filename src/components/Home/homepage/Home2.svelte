<script>
  import Image from '$assets/svg/logos/homepage/home2.svg';
</script>

<div
  class="flex w-screen flex-col items-center justify-center px-[10rem] lg:flex-row lg:items-start lg:gap-10 xl:gap-[7rem] 2xl:max-w-[90rem]">
  <div
    class="flex w-screen flex-col items-center justify-center px-[1.5rem] lg:flex-row lg:items-start lg:gap-10 xl:gap-[7rem] 2xl:w-[90rem]">
    <!-- Left Column -->
    <div
      class="flex w-full items-center justify-center pb-10 lg:w-1/2 xl:pb-0 2xl:w-1/2">
      <img
        src={Image}
        class="max-h-full max-w-full rounded-xl xl:h-full 2xl:h-full 2xl:w-full"
        alt="placeholder" />
    </div>
    <!-- Right Column -->
    <div
      class="flex flex-col items-start justify-start lg:w-1/2 xl:items-center 2xl:w-1/2 2xl:max-w-[442px]">
      <div class="max-w-[676px]">
        <!-- Adjust the max-width as needed -->

        <div class="pb-8 text-left text-key-title 2xl:text-key-title-xl">
          Building trust in what you see online
        </div>
        <div
          class="text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl 2xl:text-key-sub-text-2xl">
          With Content Credentials, the edit history of any piece of content is
          available for everyone to access, anytime. With this information at
          your fingertips, you have the ability to decide if you trust the
          content you see—understanding if the content actually exists in the
          world and how much editing or manipulation it went through.
        </div>
      </div>
    </div>
  </div>
</div>
