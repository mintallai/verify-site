<script lang="ts">
  import { _ } from 'svelte-i18n';

  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import '@spectrum-web-components/button/sp-button.js';

  import Arrow from '../../assets/svg/monochrome/arrow-back.svg';
  import DownArrow from '../../assets/svg/monochrome/down-arrow';

  // Section 0
  import hero from '../../assets/png/hero-img.png';
  // Section 1
  import section1 from '../../assets/png/section1.jpg';
  // Section 2 image
  import section2 from '../../assets/png/section2.png';
  // Section 3 image
  import section3 from '../../assets/png/section3.png';

  function upload(evt: Event) {
    window.newrelic?.addPageAction('uploadClick');
    window.location.assign('/inspect');
    evt.preventDefault();
  }
</script>

<div class="theme-light overflow-show">
  <Header />
  <section id="section0" class="overflow-hidden">
    <div class="hero grid grid-cols-10 my-10">
      <div
        class="row-span-full col-start-1 col-span-5 self-center order-3 ml-16 mr-8">
        <div class="lg:text-8xl text-7xl font-bold font-home">
          {$_('page.hero.tagline')}
        </div>
        <div class="lg:text-5xl text-3xl font-normal">
          {$_('page.hero.description')}
        </div>
      </div>
      <div
        class="overlap row-span-full col-span-5 col-end-11 self-center order-2 mr-16 object-contain">
        <img src={hero} alt="Person taking picture with smartphone" />
      </div>
      <a href="#section1">
        <DownArrow
          class="animate-bounce col-start-1 ml-16 mt-2 -mb-2"
          width="48px"
          height="48px" />
      </a>
    </div>
  </section>
  <section id="section1">
    <div class="grid grid-cols-3 gap-4 mx-16 my-10">
      <div class="w-full col-span-3 lg:col-span-2 order-1">
        <img src={section1} alt="Icy lake at dusk" />
      </div>
      <div
        class="w-full col-span-3 lg:col-span-1 order-2 items-center flex px-4 sm:pb-5">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.sectionOne.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.sectionOne.bodyA')}</div>
          <div class="body lg:text-xl">{$_('page.sectionOne.bodyB')}</div>
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
    <div class="grid grid-cols-3 gap-4 mx-16 my-10">
      <div class="w-full col-span-3 lg:col-span-2 lg:order-2">
        <img src={section2} alt="Yellow vector art" />
      </div>
      <div
        class="w-full col-span-3 lg:col-span-1 lg:order-1 items-center flex lg:pl-8 pl-4 pr-4 sm:pb-5">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.sectionTwo.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.sectionTwo.bodyA')}</div>
          <div class="body lg:text-xl">{$_('page.sectionTwo.bodyB')}</div>
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
    <div class="grid grid-cols-3 gap-4 mx-16 my-10">
      <div class="w-full col-span-3 lg:col-span-2 order-1">
        <img src={section3} alt="Kaleidescope vector art" />
      </div>
      <div
        class="w-full col-span-3 lg:col-span-1 order-2 items-center flex px-4 sm:pb-5">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.sectionThree.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.sectionThree.bodyA')}</div>
          <div class="body lg:text-xl">{$_('page.sectionThree.bodyB')}</div>
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
    width: 100vw;
  }

  .overlap {
    margin-top: 10%;
    margin-bottom: 10%;
  }
  section {
    width: 100vw;
    position: relative;
    overflow: hidden;
  }

  .heading {
    @apply text-black text-3xl text-left pb-4 font-home font-bold;
  }

  .body {
    @apply text-black text-smd text-left pb-4;
  }

  .cta {
    @apply inline-block text-black font-bold text-left pb-4 font-home;
  }
</style>
