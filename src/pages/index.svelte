<script lang="ts">
  import { url } from '@sveltech/routify';
  import { onMount } from 'svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import Icon from '../components/Icon.svelte';
  import AspectBox from '../components/AspectBox.svelte';
  import Button from '../components/Button.svelte';
  import ImageInfo from '../components/ImageInfo.svelte';
  import { learnMoreUrl } from '../stores';
  import '@spectrum-web-components/theme/theme-lightest.js';
  import '@spectrum-web-components/theme/scale-large.js';
  import '@spectrum-web-components/theme/sp-theme.js';

  let summary1: IClaimSummary | undefined;

  onMount(async () => {
    const s1res = await fetch(`/data/sample1.json`);
    const s1coll = (await s1res.json()) as ISummaryResponse;
    summary1 = {
      ...s1coll.claims[s1coll.root_claim_id],
      type: 'claim',
    };
  });
</script>

<style lang="postcss">
  main {
    @apply font-body;
  }
  .hero {
    height: 506px;
  }
  .feature {
    @apply grid grid-cols-1 items-center;
  }
  @screen md {
    .feature {
      @apply grid-cols-2 pl-12;
    }
  }
  .feature h2 {
    @apply text-3xl leading-8 mb-6;
  }
  .feature p {
    @apply text-xl;
  }
  .feature:not(:last-of-type) {
    @apply mb-56;
  }
  .example {
    @apply w-full shadow-lg relative;
    background-color: #ccc;
  }
  .example .glyph {
    @apply absolute p-4 top-0 right-0;
  }
  .view-cta {
    @apply inline-flex text-purple-500 text-xl font-bold mt-3 items-center;
  }
  .view-cta .icon {
    @apply relative ml-1;
  }
</style>

<main>
  <Header />

  <!-- Hero -->
  <section class="hero flex items-center justify-center w-full bg-gray-150">
    <div class="max-w-full px-8">
      <h1
        class="font-black text-5xl text-center leading-tight mb-4 max-w-full"
        style="width: 600px;">
        Verify images with Content Authenticity
      </h1>
      <div class="text-center text-xl max-w-full mx-auto" style="width: 550px;">
        Use Verify to inspect and compare the history of digital images with
        Content Authenticity data.
      </div>
      <div class="text-center mt-12">
        <Button size="lg" href={$learnMoreUrl}>Learn More</Button>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="lg:container lg:mx-auto px-8 py-32">
    <!-- Feature 1 -->
    <section class="feature">
      <div class="mb-8 md:mb-0">
        <AspectBox ratio={422 / 500}>
          <div class="example">
            {#if summary1?.type === 'claim'}
              <div class="glyph">
                <ImageInfo claim={summary1} />
              </div>
            {/if}
          </div>
        </AspectBox>
      </div>
      <div class="info md:pl-12">
        <h2>
          See an image's Content Authenticity data anywhere it goes online
        </h2>
        <p>
          Content Authenticity provides a public, tamper-evident attribution and
          history layer viewable on enabled images. That data is embedded in the
          image, so it can travel with the image wherever it goes. Tap the (i)
          on the image to preview, or go straight to the Verify inspect view
          below.
        </p>
        <a href={$url('/view', { callout: 'anchor' })} class="view-cta">
          <div>Inspect Image</div>
          <div class="icon">
            <Icon
              size="2xl"
              name="workflow:ChevronRight"
              class="text-purple-500" />
          </div>
        </a>
      </div>
    </section>

    <!-- Feature 2 -->
    <section class="feature">
      <div class="mb-8 md:mb-0 md:order-1">
        <AspectBox ratio={310 / 500}>
          <div class="example" />
        </AspectBox>
      </div>
      <div class="info md:pr-12">
        <h2>Dive deep into how the image came together</h2>
        <p>
          Use Verify to see what assets were used to create an image, or explore
          further into its past.
        </p>
        <a href={$url('/view', { callout: 'asset' })} class="view-cta">
          <div>Inspect History</div>
          <div class="icon">
            <Icon
              size="2xl"
              name="workflow:ChevronRight"
              class="text-purple-500" />
          </div>
        </a>
      </div>
    </section>

    <!-- Feature 3 -->
    <section class="feature">
      <div class="flex items-center justify-center">
        <div
          class="example mb-8 md:mb-0"
          style="width: 402px; height: 500px; max-width: 100%; max-height: auto;" />
      </div>
      <div class="info md:pl-12">
        <h2>
          Compare historical versions of an image to see how changes over time
        </h2>
        <p>
          Verify enables the comparison of different versions and assets used in
          an image's history, so changes over time can be easy to see.
        </p>
        <a href={$url('/view', { callout: 'parent' })} class="view-cta">
          <div>Compare History</div>
          <div class="icon">
            <Icon
              size="2xl"
              name="workflow:ChevronRight"
              class="text-purple-500" />
          </div>
        </a>
      </div>
    </section>
  </section>

  <Footer />
</main>
