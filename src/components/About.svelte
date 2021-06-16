<script lang="ts">
  import upperFirst from 'lodash/upperFirst';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import Alert from './Alert.svelte';
  import { navigateToId, compareWithId, storeReport } from '../stores';
  import {
    getCategories,
    getProducer,
    getRecorder,
    getSignatureDate,
    getSignatureIssuer,
    getThumbnailUrlForId,
    getTitle,
    ClaimError,
  } from '../lib/claim';
  import '@contentauth/web-components/dist/components/panels/ContentProducer';
  import '@contentauth/web-components/dist/components/panels/Assets';
  import '@contentauth/web-components/dist/components/panels/CustomData';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/panels/Providers';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import type { IEditCategory, IEnhancedClaimReport } from '../lib/types';

  export let claim: IEnhancedClaimReport;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;
  let element: HTMLElement;
  let categories: IEditCategory[] = [];
  let producer: string = '';
  let structureError: Error;
  let secureCapture = false;

  $: isOriginal = claim.ingredients.length === 0;
  $: {
    try {
      categories = getCategories(claim);
      producer = getProducer(claim)
    } catch (err) {
      structureError = err;
    }
  }
  $: assetsUsed = claim.ingredients.map((ingredient) => ({
    ...ingredient,
    thumbnailUrl: getThumbnailUrlForId($storeReport, ingredient.id),
  }));
  $: signedBy = getSignatureIssuer(claim);

</script>

<div class="w-full flex justify-center">
  <div class="info w-full max-w-xs lg:pb-4" bind:this={element}>
    {#if isComparing}
      <div class="file-name">
        <div class="label">File name</div>
        <div class="value">
          {getTitle(claim)}
        </div>
      </div>
    {/if}
    {#if structureError}
      <Alert severity="error">
        {#if structureError}
          This credential is using an invalid or outdated structure, which may result in missing information.
        {/if}
      </Alert>
    {/if}
    <div>
      <cai-panel-content-producer
        producedby={producer}
        producedwith={getRecorder(claim)}
        signedon={getSignatureDate(claim)}
        class="theme-spectrum"
      >
        <ProviderIcon
          provider={getRecorder(claim)}
          slotName="produced-with-icon"
        />
      </cai-panel-content-producer>
    </div>
    {#if !(structureError?.message === ClaimError.InvalidActionAssertion)}
      <div>
        <cai-panel-edits-activity
          {categories}
          hidedescriptions={isMobileViewer && isComparing ? true : null}
          class="theme-spectrum"
        />
      </div>
    {/if}
    {#if isComparing || isMobileViewer}
      <div>
        <cai-panel-assets
          assets={assetsUsed}
          on:asset-click={({ detail }) => {
            const id = detail?.asset?.id;
            if (id) {
              navigateToId(id);
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
        identifiedby={upperFirst(signedBy)}
        signedby={upperFirst(signedBy)}
        class="theme-spectrum"
      >
        <ProviderIcon provider={signedBy} slotName="identified-by-icon" />
        <ProviderIcon provider={signedBy} slotName="signed-by-icon" />
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
