<script lang="ts">
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import { getFaqUrl, rootClaimId } from '../stores';
  import { getIdentifier, isSecureCapture } from '../lib/claim';
  import compact from 'lodash/compact';
  import upperFirst from 'lodash/upperFirst';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import '@contentauth/web-components/dist/components/panels/ContentProducer';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/panels/Providers';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';

  type TooltipElement = HTMLElement & {
    getPopper: any;
  };

  export let claim: IClaimSummary;
  export let isComparing: boolean = false;
  export let isPopup: boolean = false;
  let element: HTMLElement;
  const dispatch = createEventDispatcher();

  $: alternate = isComparing || isPopup;
  $: categories = compact([
    ...claim.edits?.categories,
    isSecureCapture(claim) && 'CAPTURE',
  ]);

  /*
  afterUpdate(() => {
    // We need to force tooltip repositioning if the alert components shows/hides
    element
      ?.querySelector('claim-info')
      ?.shadowRoot?.querySelectorAll('cai-tooltip')
      ?.forEach((el: TooltipElement) => el?.getPopper()?.update());
  });
  */
</script>

<div bind:this={element}>
  {JSON.stringify(claim)}
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
            class="font-bold text-xs uppercase text-gray-500 leading-none mb-1"
          >
            File name
          </div>
          <div class="compare-title">{claim.title}</div>
        </div>
      </h2>
    {/if}
    <div
      class="compare-thumbnail"
      style={`background-image: url("${claim.thumbnail_url}");`}
    />
  {/if}

  <div class="info">
    <div>
      <cai-content-producer
        producedby={claim.produced_by}
        producedwith={claim.produced_with}
        signedon={claim.signed_on}
        class="theme-spectrum"
      >
        <ProviderIcon
          provider={claim.produced_with}
          slotName="produced-with-icon"
        />
      </cai-content-producer>
    </div>
    <div>
      <cai-edits-activity {categories} class="theme-spectrum" />
    </div>
    <div>
      <cai-providers
        identifiedby={upperFirst(claim.signed_by ?? '')}
        signedby={upperFirst(claim.signed_by ?? '')}
        class="theme-spectrum"
      >
        <ProviderIcon
          provider={claim.signed_by}
          slotName="identified-by-icon"
        />
        <ProviderIcon provider={claim.signed_by} slotName="signed-by-icon" />
      </cai-providers>
    </div>
  </div>
</div>

<style lang="postcss">
  .info {
    display: grid;
  }
  .info > div {
    @apply py-4 border-b border-gray-300;
  }
  .info > div:first-child {
    @apply pt-0;
  }
  .info > div:last-child {
    @apply border-none pb-0;
  }
  h2.filename {
    @apply mt-0 mb-3;
  }
  h2:first-child {
    @apply mt-0;
  }
  .compare-title {
    @apply font-bold text-xl truncate mb-1;
    max-width: 240px;
  }
  .compare-thumbnail {
    @apply w-full border border-gray-300 bg-white rounded bg-contain bg-center bg-no-repeat mb-4;
    height: 280px;
  }
</style>
