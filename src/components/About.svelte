<script lang="ts">
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
  import { formatDateTime } from '../lib/util/format';
  import '@contentauth/web-components/dist/components/panels/ContentProducer';
  import '@contentauth/web-components/dist/components/panels/Assets';
  import '@contentauth/web-components/dist/components/panels/CustomData';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/panels/Providers';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import type { IEditCategory, IEnhancedClaimReport } from '../lib/types';
  import debug from 'debug';

  const dbg = debug('about');

  export let claim: IEnhancedClaimReport;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;
  let element: HTMLElement;
  let categories: IEditCategory[] = [];
  let producer: string = '';
  let structureError: Error | null = null;
  let secureCapture = false;

  $: isOriginal = claim.ingredients.length === 0;
  $: {
    structureError = null;
    try {
      categories = getCategories(claim);
      producer = getProducer(claim);
    } catch (err) {
      dbg('Got structure error', err);
      structureError = err;
    }
  }
  $: assetsUsed = claim.ingredients.map((ingredient) => ({
    ...ingredient,
    thumbnailUrl: getThumbnailUrlForId($storeReport, ingredient.id),
  }));
  $: signedBy = getSignatureIssuer(claim);
  $: recorder = getRecorder(claim);
</script>

<div class="w-full flex justify-center">
  <div class="info w-full max-w-xs lg:pb-4" bind:this={element}>
    {#if structureError}
      <Alert severity="error">
        {#if structureError}
          This credential is using an invalid or outdated structure, which may
          result in missing information.
        {/if}
      </Alert>
    {/if}
    {#if isComparing}
      <div class="file-name">
        <div class="label">File name</div>
        <div class="value">
          {getTitle(claim)}
        </div>
      </div>
    {/if}
    {#if producer}
      <div>
        <dl class="attributes">
          <dt>Produced by</dt>
          <dd>{producer}</dd>
        </dl>
      </div>
    {/if}
    <div>
      <dl class="attributes">
        <dt>Produced with</dt>
        <dd class="flex space-x-2">
          <div class="relative top-0.5">
            <ProviderIcon provider={recorder} />
          </div>
          <div class="break-word">{recorder}</div>
        </dd>
      </dl>
    </div>
    {#if !(categories === null || structureError?.message === ClaimError.InvalidActionAssertion)}
      <div>
        <cai-panel-edits-activity
          {categories}
          hidedescriptions={isMobileViewer && isComparing ? true : null}
          class="theme-spectrum" />
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
          class="theme-spectrum">
          <div slot="no-assets">
            {#if isOriginal || secureCapture}
              <OriginalCreation
                type={secureCapture ? 'secureCapture' : 'original'}
                {claim} />
            {:else}
              None
            {/if}
          </div>
        </cai-panel-assets>
      </div>
    {/if}
    <div>
      <dl class="attributes">
        <dt class="flex space-x-2">
          <div>Signed by</div>
          <cai-tooltip class="theme-spectrum">
            <div slot="content" class="text-gray-700" style="width: 200px;">
              Cryptographic signatures assuring that this content record wasn’t
              tampered with.
            </div>
          </cai-tooltip>
        </dt>
        <dd class="flex space-x-2">
          <div class="relative top-0.5">
            <ProviderIcon provider={signedBy} />
          </div>
          <div>{signedBy}</div>
        </dd>
        <dt>Signed on</dt>
        <dd>{formatDateTime(getSignatureDate(claim))}</dd>
      </dl>
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
    @apply text-75 text-gray-700 font-bold uppercase mb-1;
  }
  .file-name .value {
    @apply text-150 text-gray-900 font-bold truncate;
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
