<script lang="ts">
  import { _ } from 'svelte-i18n';
  
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import '@spectrum-web-components/button/sp-button.js';

  import heroBkg from '../../assets/svg/home/adjustedHero.noparse.svg';
  import Arrow from '../../assets/svg/monochrome/left-arrow.svg';

  // Section 1  
  import composition from '../../assets/png/composition@2x.png';
  // Section 2 image
  import dancer from '../../assets/png/dancer@2x.png';
  // Section 3 image
  import snowyGiza from '../../assets/png/snowy-giza@2x.png';

  function upload(evt: Event) {
    window.newrelic?.addPageAction('uploadClick');
    window.location.assign('/inspect');
    evt.preventDefault();
  }
  // height is 500px on mobile
</script>
<div class="theme-light overflow-show">
  <Header />
  <section id="section0" class="overflow-hidden">
    <div class="w-screen object-fill bg-cover bg-center" style="max-height: 600px; min-height: 500px; background-image: url({heroBkg});"/>
    <div class="hero">
      <div class="text-white lg:text-8xl text-7xl font-bold text-center">{$_('page.hero.tagline')}</div>
      <div class="text-white lg:text-5xl text-3xl font-normal text-center">{$_('page.hero.description')}</div>
      <sp-button
        variant="primary"
        class="relative font-bold text-400 font-base mt-14 sm:hidden"
        on:click={upload}
      >
        {$_('comp.header.uploadImage')}
      </sp-button>
    </div>
  </section>
  <section id="section1">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full col-span-3 lg:col-span-2 order-1">
        <img src={composition} alt="Composition of woman and city skyline"/>
      </div>
      <div class="w-full col-span-3 lg:col-span-1 order-2 justify-center items-center flex px-4 sm:pb-5">
        <div>
          <div class="heading">{$_('page.composition.header')}</div>
          <div class="body">{$_('page.composition.body')}</div>
          <div class="cta">{$_('page.cta.viewMore')}</div>
         
       </div>
      </div>
    </div>
  </section>
  <section id="section2">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full col-span-3 lg:col-span-2 lg:order-2">
        <img src={dancer} alt="Dancer in studio stretching"/>
      </div>
      <div class="w-full col-span-3 lg:col-span-1 lg:order-1 justify-center items-center flex lg:pl-8 pl-4 pr-4 sm:pb-5">
        <div>
          <div class="heading">{$_('page.dancer.header')}</div>
          <div class="body">{$_('page.dancer.body')}</div>
          <div class="cta">{$_('page.cta.viewMore')}</div>
        </div>
      </div>
    </div>
  </section>
  <section id="section3">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full col-span-3 lg:col-span-2 order-1">
        <img src={snowyGiza} alt="Snowy Giza"/>
      </div>
      <div class="w-full col-span-3 lg:col-span-1 order-2 justify-center items-center flex px-4 sm:pb-5">
        <div>
          <div class="heading">{$_('page.snowyGiza.header')}</div>
          <div class="body">{$_('page.snowyGiza.body')}</div>
          <div class="cta">{$_('page.cta.viewMore')}</div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</div>
<style lang="postcss">
  :global(body) {
    overflow: visible;
    @apply font-base;
  }
  .hero {
    @apply absolute inset-0 flex justify-center items-center flex-col;
    width: 100vw;
  }
  section {
    width: 100vw;
    max-height: 600px;
    position: relative;
    overflow: hidden;
  }

  .heading {
    @apply text-black lg:text-5xl text-3xl text-left lg:pb-14 sm:pb-5;
  }

  .body {
    @apply text-black lg:text-xl text-smd text-left pb-5;
  }

  .cta {
    @apply text-black font-bold lg:text-xl sm:text-smd text-left pb-4;
  }
  sp-button {
    @apply inline-block bg-white px-8 py-4 rounded-full transition duration-200 outline-none text-gray-900;
  }
</style>