<script lang="ts">
  import compact from 'lodash/compact';
  import upperFirst from 'lodash/upperFirst';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import { formatLocation, isSecureCapture } from '../lib/demo';
  import '@contentauth/web-components/dist/components/panels/ContentProducer';
  import '@contentauth/web-components/dist/components/panels/ContentRecord';
  import '@contentauth/web-components/dist/components/panels/CustomData';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/panels/Providers';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';

  export let claim: IClaimSummary;
  export let isComparing: boolean = false;
  let element: HTMLElement;

  $: categories = compact(
    (claim.edits?.categories ?? []).concat(isSecureCapture(claim) && 'CAPTURE'),
  );
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
    {#if claim.location}
      <div>
        <cai-panel-custom-data
          header="Location"
          helpText="Where this photo was taken."
          class="theme-spectrum"
        >
          <span slot="content">{formatLocation(claim.location)}</span>
        </cai-panel-custom-data>
      </div>
    {/if}
    {#if isComparing && (claim.references || isSecureCapture)}
      <div>
        <cai-panel-content-record
          references={claim.references}
          class="theme-spectrum"
        >
          {#if isSecureCapture}
            <div slot="no-references">
              <OriginalCreation />
            </div>
          {/if}
        </cai-panel-content-record>
      </div>
    {/if}
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
