<script lang="ts">
  import compact from 'lodash/compact';
  import upperFirst from 'lodash/upperFirst';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import { formatLocation, isSecureCapture } from '../lib/demo';
  import { navigateToId, compareWithId } from '../stores';
  import '@contentauth/web-components/dist/components/panels/ContentProducer';
  import '@contentauth/web-components/dist/components/panels/Assets';
  import '@contentauth/web-components/dist/components/panels/CustomData';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/panels/Providers';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import type { IEnhancedClaimReport } from '../lib/types';

  export let claim: IEnhancedClaimReport;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;
  let element: HTMLElement;

  $: isOriginal = claim.ingredients.length === 0;
  $: secureCapture = isSecureCapture(claim);
  $: categories = compact(
    (claim.edits?.categories ?? []).concat(secureCapture && 'CAPTURE'),
  );
</script>

<div class="w-full flex justify-center">
  <div class="info w-full max-w-xs lg:pb-4" bind:this={element}>
    {#if isComparing}
      <div class="file-name">
        <div class="label">File name</div>
        <div class="value">
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
      <cai-panel-edits-activity
        {categories}
        hidedescriptions={isMobileViewer && isComparing ? true : null}
        class="theme-spectrum"
      />
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
    {#if isComparing || isMobileViewer}
      <div>
        <cai-panel-assets
          references={claim.references}
          on:reference-click={({ detail }) => {
            const identifier = getIdentifier(detail?.reference);
            if (identifier) {
              navigateToId(identifier);
              compareWithId(null);
            }
          }}
          class="theme-spectrum"
        >
          <div slot="no-references">
            {#if isOriginal || secureCapture}
              <OriginalCreation
                type={secureCapture ? 'secureCapture' : 'original'}
                {claim}
              />
            {:else}
              None
            {/if}
          </div>
        </cai-panel-assets>
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
  .info > div {
    @apply py-4 border-b border-gray-300;
  }
  .info > div:first-child {
    @apply pt-0;
  }
  .info > div:last-child {
    @apply border-none pb-0;
  }
  .file-name .label {
    @apply text-xs text-gray-700 uppercase mb-1;
  }
  .file-name .value {
    @apply text-md text-gray-900 font-bold truncate;
    max-width: calc((100vw / 2) - 30px);
  }
  @screen md {
    .info {
      @apply min-h-0;
    }
  }
  @screen lg {
    .file-name .value {
      @apply max-w-full;
    }
  }
</style>
