<script>
  import Images from '$assets/png/human.png';
</script>

<div class="px-[1.5rem] lg:grid lg:grid-cols-12 lg:gap-4 xl:max-w-[1440px]">
  <div class="lg:col-span-6 lg:col-start-7 lg:hidden">
    <img src={Images} alt="" />
  </div>
  <!-- Below hidden until Desktop -->
  <div
    class="pt-6 lg:col-start-1 lg:col-end-6 lg:pt-0 xl:col-start-2 xl:col-end-6 xl:flex">
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
    class="pt-6 sm:hidden lg:col-start-1 lg:col-end-6 lg:hidden lg:pt-0 xl:col-start-8 xl:col-end-12">
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
  <!-- Below hidden until Desktop -->
  <div class="sm:hidden lg:col-span-6 lg:col-start-7 lg:flex">
    <!-- Your image goes here -->
    <img src={Images} alt="" />
  </div>
</div>
