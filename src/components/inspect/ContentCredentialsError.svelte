<script lang="ts">
  import NoCredentials from '../../../assets/svg/monochrome/no-credentials.svg';
  import Otgp from '../../../assets/svg/monochrome/otgp.svg';

  export let status: 'missing' | 'none' = 'none';
  export let isComparing: boolean = false;
</script>

<div class:comparing={isComparing} class="container">
  {#if status === 'missing'}
    <Otgp
      width="126"
      height="90"
      class="text-gray-500 mb-4 hidden lg:block mt-0 lg:mt-5"
    />
    <div class="message-heading">Missing content credentials</div>
    <div class="message-text">
      The producer edited this asset without attaching complete content
      credentials. Other data may be available in the content record. <a
        class="link"
        href="https://contentauthenticity.org/faq"
        target="_blank">Learn more</a
      >
    </div>
  {:else if status === 'none'}
    <NoCredentials
      width="126"
      height="90"
      class="text-gray-500 mb-4 hidden lg:block mt-0 lg:mt-5"
    />
    <div class="message-heading">No content credentials for this asset</div>
    <div class="message-text">
      This asset doesn’t have a content record attached.
    </div>
  {/if}
</div>

<style lang="postcss">
  .container {
    @apply h-full flex flex-col justify-center items-center p-4 mx-auto;
  }
  .comparing.container {
    @apply sticky top-0 h-screen;
  }
  @screen lgHeight {
    .comparing.container {
      @apply h-auto pt-0;
      top: 150px;
    }
  }
  @screen lg {
    .comparing.container {
      @apply relative h-full pt-4;
      top: 0;
    }
  }
</style>
