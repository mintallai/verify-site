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
  $: categories = compact(
    (claim.edits?.categories ?? []).concat(isSecureCapture(claim) && 'CAPTURE'),
  );

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
  <div class="info">
    {#if isComparing}
      <div>
        <div class="text-xs text-gray-700 uppercase leading-none mb-1">
          File name
        </div>
        <div class="text-md text-gray-900 font-bold truncate">
          {claim.title}
        </div>
      </div>
    {/if}
    <div>
      <cai-panel-content-producer
        producedby={claim.produced_by}
        producedwith={claim.produced_with}
        signedon={claim.signed_on}
        class="theme-spectrum"
      >
        <ProviderIcon
          provider={claim.produced_with}
          slotName="produced-with-icon"
        />
      </cai-panel-content-producer>
    </div>
    <div>
      <cai-panel-edits-activity {categories} class="theme-spectrum" />
    </div>
    <div>
      <cai-panel-providers
        identifiedby={upperFirst(claim.signed_by ?? '')}
        signedby={upperFirst(claim.signed_by ?? '')}
        class="theme-spectrum"
      >
        <ProviderIcon
          provider={claim.signed_by}
          slotName="identified-by-icon"
        />
        <ProviderIcon provider={claim.signed_by} slotName="signed-by-icon" />
      </cai-panel-providers>
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
</style>
