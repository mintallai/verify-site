<script>
  import KeyPoints from './KeyPoints.svelte';
</script>

<div
  class="flex w-screen flex-col items-center justify-evenly gap-6 p-[1.5rem] max-w-[90rem]">
  <div
    class="xxl:w-[910px] flex flex-col items-center justify-center pb-10 pt-20 xl:h-screen xl:w-[802px]">
    <h2
      class="xxl:text-home-title-xxl text-center text-home-secondary-title md:text-home-title-md xl:text-hero-title">
      Content Credentials reveals helpful information that's usually hidden
    </h2>
    <div class="flex flex-col items-center justify-center pt-10">
      <p
        class="xxl:text-home-sub-xxl text-center text-home-sub text-gray-900/60 xl:text-home-sub-XL">
        Important information about the content you see is invisible to most
        users of the internet. Content Credentials is a new open-source tool
        that exposes answers to all the questions you have about content—like if
        it was made with AI or not, who made it and when, and how it was
        made—with a simple click.
      </p>
      <a
        href="/"
        class="h-[2.75rem] flex items-center mt-10 rounded-full bg-brand-blue px-[1.25rem] py-3 hover:bg-brand-blue/80"
        >See how it works</a>
    </div>
  </div>
  <KeyPoints />
</div>
