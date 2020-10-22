<script lang="ts">
  import { url, metatags } from '@sveltech/routify';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import Button from '../components/Button.svelte';
  import { learnMoreUrl } from '../stores';
  import '@spectrum-web-components/theme/theme-lightest.js';
  import '@spectrum-web-components/theme/scale-large.js';
  import '@spectrum-web-components/theme/sp-theme.js';

  metatags.title = 'Frequently Asked Questions';
</script>

<style lang="postcss">
  main {
    @apply font-body;
  }
  .hero {
    height: 506px;
  }
  .questions dl dt {
    @apply text-3xl font-bold leading-tight mb-5;
  }
  .questions dl dd {
    @apply text-lg mb-10;
  }
  @screen md {
    .feature {
      @apply grid-cols-2;
    }
    .questions dl dt {
      @apply mb-5;
    }
  }
</style>

<main>
  <Header />

  <!-- Hero -->
  <section class="hero flex items-center justify-center w-full bg-gray-150">
    <div class="max-w-full px-8">
      <h1 class="font-black text-5xl text-center leading-tight mb-4">
        Frequently Asked Questions
      </h1>
      <div class="text-center text-xl mx-auto max-w-full" style="width: 600px;">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
      <div class="text-center mt-12">
        <Button size="lg" href={$learnMoreUrl}>Learn More</Button>
      </div>
    </div>
  </section>

  <section
    class="questions lg:container lg:mx-auto px-8 mt-24 mb-12 grid md:gap-20 grid-cols-1 md:grid-cols-2">
    <!-- Column 1 -->
    <dl>
      <dt>Will this solve all misinformation problems?</dt>
      <dd>
        We believe there are 3 areas to address misinformation: Education,
        Detection and Attribution. CAI is creating an Attribution-focused
        solution. While CAI will help efforts around Education and will serve as
        an input for Detection, the problem of misinformation will require the
        whole digital media ecosystem to collaborate further.
      </dd>
      <dt>Will this work with non-Adobe products?</dt>
      <dd>
        Yes! We are working closely with partners to create an open standard and
        encourage the digital media ecosystem to join us in implementing the CAI
        across the web.
      </dd>
      <dt>Are you telling me if a picture is fake?</dt>
      <dd>
        We are not making any judgement about the content of an image so we will
        not label content as fake or inauthentic. However, we will offer
        creators to responsibly use creative tools to transparently share their
        attribution history. That way, the user gets to understand the context
        of the who, what and how of the asset and can make that determination
        for themselves.
      </dd>
      <dt>Is this about Digital Rights Management?</dt>
      <dd>
        No. The CAI will not be enforcing any permissions around access to the
        assets themselves. While we hope that the CAI can be used as strong
        evidence in directing users towards copyright and licensing terms, we
        will not be guaranteeing these.
      </dd>
      <dt>Who is involved in the CAI?</dt>
      <dd>
        Collaborators include The New York Times, Twitter, Truepic, Witness,
        CBC, BBC, and more. We are also in active discussions with hardware
        manufacturers, software vendors and distribution platforms as we
        continue our progress.
      </dd>
    </dl>

    <!-- Column 2 -->
    <dl>
      <dt>How is this different from existing conventions with metadata?</dt>
      <dd>
        We are using existing metadata standards such as XMP as a baseline, but
        we go beyond that by addressing two key problems around misinformation:
        metadata is editable, and it can easily be stripped out. The CAI uses
        tamper-evident cryptographic signatures and flexible storage options so
        that assets can travel the web and retain a trusted history.
      </dd>
      <dt>What if I want privacy?</dt>
      <dd>
        The CAI is an opt-in feature. We will not sign any CAI information
        without you deciding to use it. And if you only want to share some
        details, you can control which categories of data you would like
        attached in your CAI summary. We will also offer a path for those with
        high privacy needs (e.g. human rights workers in authoritarian
        countries) to redact Personally Identifiable Information.
      </dd>
      <dt>Who is the target market for this product?</dt>
      <dd>
        Anyone who is interested in preserving trust on the internet should care
        about the CAI. Whether that’s social media users exposed to
        misinformation in their feeds, creative professionals who want to get
        credit for their work, news publishers who want to transparently share
        their process with their audience – we all have a role to play in this.
      </dd>
      <dt>Why is Authorship important if a creator uses AI?</dt>
      <dd>Placeholder for Q from Fast Co article</dd>
      <dt>Can a user add information to CAI after it was signed?</dt>
      <dd>Placeholder for Q from Fast Co article</dd>
    </dl>
  </section>

  <Footer />
</main>
