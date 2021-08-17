<script lang="ts">
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import '@spectrum-web-components/button/sp-button.js';
  import heroBkg from '../../assets/svg/home/adjustedHero.noparse.svg';
  /**
   * TODO: 
   * Find a better way to import these; 
   * fix dropfile svg styling in Viewer.svelte;
   * Add mobile breakpoints and responsiveness;
   * Fix navigate to root logic
   * Strings for localization
  */
  // Section 1  
  const composition = '../../assets/png/composition@2x.png';
  // Section 2 image
  // import dancerStudio from '../../assets/svg/home/dancer-studio.svg';
  // Section 3 image
  // import snowyGaza from '../../assets/svg/home/snowy-gaza.svg';
  function upload(evt: Event) {
    window.newrelic?.addPageAction('uploadClick');
    window.location.assign('/inspect');
    evt.preventDefault();
  }
  const sectionOneText = {
    header: 'Data is forever',
    body: 'Producers using our tools attach a public, tamper-evident attribution and history record that can’t be removed from the JPG. No matter where the image shows up on the internet, the icon tells you that we confirmed its record.',
    cta: 'View more',
  };
  const sectionTwoText = {
    header: 'Explore an image\'s past',
    body: 'Find out who produced an image, what assets they used, and when and how they made it. ',
    cta: 'View more',
  };
  const sectionThreeText = {
    header: 'Track changes over time',
    body: 'View and compare an image to another version or the assets used in it.',
    cta: 'View more',
  };
  // height is 500px on mobile
</script>
<div class="theme-light overflow-show">
  <Header />
  <section id="section0" class="overflow-hidden">
    <div class="w-screen object-fill bg-cover bg-center" style="height=350px; width=100vw; background-image: url({heroBkg});"/>
    <div class="hero absolute">
      <div class="text-white lg:text-8xl sm:text-7xl font-bold relative ">Decide what content to trust</div>
      <div class="text-white lg:text-5xl sm:text-3xl font-normal relative ">Inspect tamper-evident records and compare edits, activity, and more.</div>
      <sp-button
        variant="primary"
        class="relative font-bold text-400 font-base mt-14 sm:hidden"
      >
        Upload image
      </sp-button>
    </div>
  </section>
  <section id="section1" class="overflow-hidden">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full h-72 col-span-3 lg:col-span-2 order-1 bg-blue-800">
        <img src={composition} alt="Composition"/>
      </div>
      <div class="w-full h-72 col-span-3 lg:col-span-1 order-2 text-center py-6 lg:py-11">
        <div class="text-black lg:text-5xl sm:text-3xl">{sectionOneText.header}</div>
        <div class="text-black lg:text-xl sm:text-smd">{sectionOneText.body}</div>
        <div class="text-black font-bold lg:text-xl sm:text-smd">{sectionOneText.cta}</div>
      </div>
    </div>
  </section>
  <section id="section2" class="overflow-hidden">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full h-72 col-span-3 lg:col-span-2 lg:order-2 bg-gray-600">
      </div>
      <div class="w-full h-72 col-span-3 lg:col-span-1 lg:order-1 text-center py-6 lg:py-11">
        <div class="text-black lg:text-5xl sm:text-3xl">{sectionTwoText.header}</div>
        <div class="text-black lg:text-xl sm:text-smd">{sectionTwoText.body}</div>
        <div class="text-black font-bold lg:text-xl sm:text-smd">{sectionTwoText.cta}</div>
      </div>
    </div>
  </section>
  <section id="section3" class="overflow-hidden">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full h-72 col-span-3 lg:col-span-2 order-1 bg-blue-200">
      </div>
      <div class="w-full h-72 col-span-3 lg:col-span-1 order-2 text-center py-6 lg:py-11">
        <div class="text-black lg:text-5xl sm:text-3xl">{sectionThreeText.header}</div>
        <div class="text-black lg:text-xl sm:text-smd">{sectionThreeText.body}</div>
        <div class="text-black font-bold lg:text-xl sm:text-smd">{sectionThreeText.cta}</div>
      </div>
    </div>
  </section>
  <Footer />
</div>
<style lang="postcss">
  :global(body) {
    overflow: visible;
  }
  .hero {
    @apply absolute inset-0 flex justify-center items-center flex-col;
    width: 100vw;
  }
  section {
    width: 100vw;
    max-height: 600px;
    min-height: 400px;
    position: relative;
  }
  sp-button {
    @apply inline-block bg-white px-8 py-4 rounded-full transition duration-200 outline-none text-gray-900;
  }
</style>