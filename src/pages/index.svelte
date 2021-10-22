<!-- routify:options reset=true -->
<script lang="ts">
  import { _ } from 'svelte-i18n';

  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';

  import Arrow from '../../assets/svg/monochrome/arrow-back.svg';
  import DownArrow from '../../assets/svg/monochrome/down-arrow.svg';

  // Section 0
  import hero from '../../assets/png/hero-img.png';
  // Section 1
  import section1 from '../../assets/png/section1.jpg';
  // Section 2 image
  import section2 from '../../assets/png/section2.png';
  // Section 3 image
  import section3 from '../../assets/png/section3.png';
  import { isMobileViewerShown } from '../stores';

  function upload(evt: Event) {
    window.newrelic?.addPageAction('uploadClick');
    window.location.assign('/inspect');
    evt.preventDefault();
  }

  function generateOverviewImageUrl(asset: string) {
    const page = isMobile ? 'inspect' : 'overview';
    const url = new URL(`${window.location.origin}/${page}`);
    url.searchParams.set('source', asset);
    return url.toString();
  }

  $: isMobile = $isMobileViewerShown;
</script>

<div class="theme-light overflow-show">
  <Header />
  <section id="section0" class="overflow-hidden">
    <div class="hero grid grid-cols-10 my-10">
      <div class="hero-text row-span-full col-span-full self-center mx-7">
        <div
          class="lg:text-8xl text-7xl font-bold font-home text-center lg:text-left leading-4 pb-4 max-w-prose">
          {$_('page.hero.tagline')}
        </div>
        <div
          class="lg:text-5xl text-3xl font-normal text-center lg:text-left max-w-prose">
          {$_('page.hero.description')}
        </div>
      </div>
      <div class="overlap hidden max-w-3xl">
        <img id="hero" src={hero} alt="Person taking picture with smartphone" />
      </div>

      <div
        class="lg:col-start-1 3xl:ml-4 xl:ml-7 lg:ml-16 xl:mt-2 md:mt-6 mt-4 -mb-2 col-span-2 col-start-5 flex lg:col-span-1 justify-center items-center">
        <DownArrow class="animate-bounce" width="48px" height="48px"
          ><a href="#section1" />
        </DownArrow>
      </div>
    </div>
  </section>
  <section id="section1">
    <div class="section-grid">
      <div class="content order-1">
        <img id="section1Img" src={section1} alt="Icy lake at dusk" />
      </div>
      <div class="content-body order-2">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.sectionOne.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.sectionOne.bodyA')}</div>
          <div class="body lg:text-xl">{$_('page.sectionOne.bodyB')}</div>
          <div class="inline-block align-middle">
            <a href={generateOverviewImageUrl(section1)}>
              <div class="cta lg:text-xl sm:text-smd">
                {$_('page.cta.viewMore')}
              </div>
            </a>
            <Arrow class="inline-block" width="14px" height="12px" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="section2">
    <div class="section-grid">
      <div class="content lg:order-2">
        <img id="section2Img" src={section2} alt="Yellow vector art" />
      </div>
      <div class="content-body lg:order-1">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.sectionTwo.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.sectionTwo.bodyA')}</div>
          <div class="body lg:text-xl">{$_('page.sectionTwo.bodyB')}</div>
          <div class="inline-block align-middle">
            <a href={generateOverviewImageUrl(section2)}>
              <div class="cta lg:text-xl sm:text-smd">
                {$_('page.cta.viewMore')}
              </div>
            </a>
            <Arrow class="inline-block" width="14px" height="12px" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="section3">
    <div class="section-grid">
      <div class="content order-1">
        <img id="section3Img" src={section3} alt="Kaleidescope vector art" />
      </div>
      <div class="content-body order-2">
        <div>
          <div class="heading lg:text-5xl">
            {$_('page.sectionThree.header')}
          </div>
          <div class="body lg:text-xl">{$_('page.sectionThree.bodyA')}</div>
          <div class="body lg:text-xl">{$_('page.sectionThree.bodyB')}</div>
          <div class="inline-block align-middle">
            <a href={generateOverviewImageUrl(section3)}>
              <div class="cta lg:text-xl sm:text-smd">
                {$_('page.cta.viewMore')}
              </div>
            </a>
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

  :global(footer) {
    @apply h-14;
  }

  .hero {
    width: 100vw;
    max-width: 1680px;
  }

  .hero-text {
    @apply lg:col-start-1 lg:col-span-5 lg:ml-16 lg:mr-8;
  }

  .overlap {
    margin-top: 10%;
    margin-bottom: 10%;
    @apply lg:row-span-full lg:col-span-5 lg:col-end-11 lg:self-center lg:mr-16 lg:object-contain lg:inline;
  }
  section {
    width: 100vw;
    position: relative;
    overflow: hidden;
    max-width: 1680px;
    @apply 3xl:mx-auto 3xl:justify-center;
  }

  .section-grid {
    @apply grid grid-cols-3 gap-4 lg:mx-16 lg:my-10 mb-4;
  }

  .content {
    @apply w-full lg:col-span-2 col-span-full;
  }

  .content-body {
    @apply w-full lg:col-span-1 col-span-full items-center flex px-4;
  }
  .heading {
    @apply text-black text-3xl text-left pb-4 font-home font-bold;
  }

  .body {
    @apply text-black text-smd text-left pb-4 max-w-prose;
  }

  .cta {
    @apply inline-block text-black font-bold text-left pb-4 font-home;
  }
</style>
