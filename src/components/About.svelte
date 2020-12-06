<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import { faqUrl, rootClaimId } from '../stores';
  import { getIdentifier } from '../lib/claim';
  import Alert from './Alert.svelte';
  import Icon from './Icon.svelte';

  type TooltipElement = HTMLElement & {
    getPopper: any;
  };

  export let claim: IClaimSummary;
  export let isComparing: boolean = false;
  export let isPopup: boolean = false;
  let element: HTMLElement;
  const dispatch = createEventDispatcher();

  $: alternate = isComparing || isPopup;
  $: variant = isComparing ? 'sm' : 'lg';
  $: isSecureCapture = /truepic/i.test(claim?.produced_with);

  afterUpdate(() => {
    // We need to force tooltip repositioning if the alert components shows/hides
    element
      ?.querySelector('claim-info')
      ?.shadowRoot?.querySelectorAll('cai-tooltip')
      ?.forEach((el: TooltipElement) => el?.getPopper()?.update());
  });
</script>

<style lang="postcss">
  h2.filename {
    @apply mt-0 mb-3;
  }
  h2:first-child {
    @apply mt-0;
  }
  .close {
    @apply bg-gray-200 rounded-full cursor-pointer flex items-center justify-center;
    width: 28px;
    height: 28px;
  }
  .compare-title {
    @apply font-bold text-xl truncate mb-1;
    max-width: 240px;
  }
  .compare-thumbnail {
    @apply w-full border border-gray-350 bg-white rounded bg-contain bg-center bg-no-repeat mb-4;
    height: 280px;
  }
</style>

<div bind:this={element}>
  <!-- Compare header -->
  {#if alternate}
    {#if isComparing}
      <h2 class="filename">
        {#if getIdentifier(claim) === $rootClaimId}
          <div class="mr-2">
            <cai-icon name="Pin" width="20px" height="20px" />
          </div>
        {/if}
        <div>
          <div
            class="font-bold text-xs uppercase text-gray-500 leading-none mb-1">
            File name
          </div>
          <div class="compare-title">{claim.title}</div>
        </div>
        <div class="flex-grow flex justify-end">
          <div class="close" on:click={() => dispatch('close', { claim })}>
            <Icon size="m" name="workflow:Close" class="text-gray-400" />
          </div>
        </div>
      </h2>
    {/if}
    <div
      class="compare-thumbnail"
      style={`background-image: url("${claim.thumbnail_url}");`} />
  {:else if isSecureCapture}
    <div class="mb-4">
      <Alert
        severity="info"
        message={`This photo was captured by a secure device. <a href="${$faqUrl}" target="_blank" style="text-decoration: underline;">Learn more</a>`} />
    </div>
  {/if}

  <claim-info {claim} {variant} />
</div>
