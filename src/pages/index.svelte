<script lang="ts">
  import { _ } from 'svelte-i18n';

  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import '@spectrum-web-components/button/sp-button.js';

  import heroBkg from '../../assets/svg/home/adjustedHero.noparse.svg';
  import Arrow from '../../assets/svg/monochrome/arrow-back.svg';

  // Section 0
  import hero from '../../assets/png/hero@2x.png';
  // Section 1
  import composition from '../../assets/png/section1@2x.png';
  // Section 2 image
  import dancer from '../../assets/png/section2@2x.png';
  // Section 3 image
  import snowyGiza from '../../assets/png/section3@2x.png';

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
    <div class="hero grid grid-cols-10">
      <div
        class="row-span-full col-start-1 col-span-5 self-center order-3 ml-16">
        <div class="text-white lg:text-8xl text-7xl font-bold font-serif">
          {$_('page.hero.tagline')}
        </div>
        <div class="text-white lg:text-5xl text-3xl font-normal">
          {$_('page.hero.description')}
        </div>
        <sp-button
          variant="primary"
          class="font-bold text-400 mt-8 font-base sm:hidden"
          on:click={upload}>
          {$_('comp.header.uploadImage')}
        </sp-button>
      </div>
      <div
        class="row-span-full col-span-6 col-end-11 self-center order-2 mr-16">
        <img src={hero} alt="Person taking picture with smartphone" />
      </div>
      <div
        class="row-span-full object-fill bg-cover bg-center order-1 col-start-1 col-span-full"
        style="min-height: 500px; background-image: url({heroBkg});" />
    </div>
  </section>
  <section id="section1">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full col-span-3 lg:col-span-2 order-1">
        <img src={composition} alt="Composition of woman and city skyline" />
      </div>
      <div
        class="w-full col-span-3 lg:col-span-1 order-2 lg:justify-center items-center flex px-4 sm:pb-5">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.composition.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.composition.body')}</div>
          <div class="inline-block align-middle">
            <div class="cta lg:text-xl sm:text-smd">
              {$_('page.cta.viewMore')}
            </div>
            <Arrow class="inline-block" width="14px" height="12px" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="section2">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full col-span-3 lg:col-span-2 lg:order-2">
        <img src={dancer} alt="Dancer in studio stretching" />
      </div>
      <div
        class="w-full col-span-3 lg:col-span-1 lg:order-1 lg:justify-center items-center flex lg:pl-8 pl-4 pr-4 sm:pb-5">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.dancer.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.dancer.body')}</div>
          <div class="inline-block align-middle">
            <div class="cta lg:text-xl sm:text-smd">
              {$_('page.cta.viewMore')}
            </div>
            <Arrow class="inline-block" width="14px" height="12px" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="section3">
    <div class="grid grid-cols-3 gap-4">
      <div class="w-full col-span-3 lg:col-span-2 order-1">
        <img src={snowyGiza} alt="Snowy Giza" />
      </div>
      <div
        class="w-full col-span-3 lg:col-span-1 order-2 lg:justify-center items-center flex px-4 sm:pb-5">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.snowyGiza.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.snowyGiza.body')}</div>
          <div class="inline-block align-middle">
            <div class="cta lg:text-xl sm:text-smd">
              {$_('page.cta.viewMore')}
            </div>
            <Arrow class="inline-block" width="14px" height="12px" />
          </div>
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
    /* @apply absolute inset-0 flex justify-center items-center flex-col; */
    width: 100vw;
  }
  section {
    width: 100vw;
    position: relative;
    overflow: hidden;
  }

  .heading {
    @apply text-black font-serif text-3xl text-left pb-4;
  }

  .body {
    @apply text-black text-smd text-left pb-4;
  }

  .cta {
    @apply inline-block text-black font-bold text-left pb-4;
  }

  sp-button {
    @apply inline-block bg-white px-8 py-4 rounded-full transition duration-200 outline-none text-gray-900;
  }
</style>
