<script>
  import Images from '$assets/png/human.png';
</script>

<div class="px-[1.5rem] md:grid md:grid-cols-12 md:gap-4 xl:max-w-[1440px]">
  <div class="md:col-span-6 md:col-start-7 md:hidden">
    <img src={Images} alt="" class="w-full" />
  </div>
  <!-- Below hidden until Desktop -->
  <div
    class="pt-6 md:col-start-1 md:col-end-6 md:pt-0 lg:col-start-2 lg:col-end-6 xl:flex">
    <div class="max-w-[676px]">
      <h3 class="xxl:text-key-title-xl pb-6 text-left text-key-title">
        Empowering creators to get credit for their work
      </h3>
      <p
        class="xxl:text-key-sub-text-xxl text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl">
        Content is often mis-credited or not credited at all when shared online,
        creating tons of lost opportunity for creators. Content Credentials
        enable creators to get recognition for what they create—helping them
        build a following and market their work.
      </p>
    </div>
  </div>
  <!--  -->
  <div
    class="pt-6 sm:hidden md:col-start-1 md:col-end-6 md:hidden md:pt-0 xl:col-start-7 xl:col-end-13">
    <div class="max-w-[676px] xxs:hidden">
      <h3 class="xxl:text-key-title-xl pb-6 text-left text-key-title">
        Empowering creators to get credit for their work
      </h3>
      <p
        class="xxl:text-key-sub-text-xxl text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl">
        Content is often mis-credited or not credited at all when shared online,
        creating tons of lost opportunity for creators. Content Credentials
        enable creators to get recognition for what they create—helping them
        build a following and market their work.
      </p>
    </div>
  </div>
  <!-- Below hidden until Desktop -->
  <div class="w-full xxs:hidden md:col-span-6 md:col-start-7 md:flex">
    <!-- Your image goes here -->
    <img src={Images} alt="" class="w-full" />
  </div>
</div>
