<script lang="ts">
  import { _, date, time, locale } from 'svelte-i18n';
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
  import { asDate } from '../lib/util/format';
  import '@contentauth/web-components/dist/components/panels/Assets';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
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
      categories = getCategories(claim, $locale);
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
  $: sigDate = asDate(getSignatureDate(claim));
  $: recorder = getRecorder(claim);

  $: editsActivityStrings = JSON.stringify({
    EDITS_ACTIVITY: $_('comp.about.editsActivity.header'),
    HELP_TEXT: $_('comp.about.editsActivity.helpText'),
    NO_EDITS: $_('comp.about.editsActivity.none'),
  });
  $: assetsStrings = JSON.stringify({
    ASSETS_USED: $_('comp.about.assets.header'),
    CLAIM_INFO_HELP_TEXT: $_('comp.about.assets.claimInfoHelpText'),
    HELP_TEXT: $_('comp.about.assets.helpText'),
  });
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
        <div class="label">{$_('comp.about.fileName')}</div>
        <div class="value">
          {getTitle(claim)}
        </div>
      </div>
    {/if}
    {#if producer}
      <div>
        <dl class="attributes">
          <dt class="flex space-x-2">
            <div class="whitespace-nowrap">{$_('comp.about.producedBy')}</div>
            <cai-tooltip class="theme-spectrum">
              <div slot="content" class="text-gray-900" style="width: 150px;">
                {$_('comp.about.producedByHelpText')}
              </div>
            </cai-tooltip>
          </dt>
          <dd>{producer}</dd>
        </dl>
      </div>
    {/if}
    <div>
      <dl class="attributes">
        <dt>{$_('comp.about.producedWith')}</dt>
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
          stringmap={editsActivityStrings}
          hidedescriptions={isMobileViewer && isComparing ? true : null}
          class="theme-spectrum" />
      </div>
    {/if}
    {#if isComparing || isMobileViewer}
      <div>
        <cai-panel-assets
          stringmap={assetsStrings}
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
              {$_('comp.about.none')}
            {/if}
          </div>
        </cai-panel-assets>
      </div>
    {/if}
    <div>
      <dl class="attributes">
        <dt class="flex space-x-2">
          <div class="whitespace-nowrap">{$_('comp.about.signedBy')}</div>
          <cai-tooltip class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 200px;">
              {$_('comp.about.signedByHelpText')}
            </div>
          </cai-tooltip>
        </dt>
        <dd class="flex space-x-2">
          <div class="relative top-0.5">
            <ProviderIcon provider={signedBy} />
          </div>
          <div>{signedBy}</div>
        </dd>
        <dt>{$_('comp.about.signedOn')}</dt>
        <dd>
          {$date(sigDate, { format: 'short' })}{', '}
          {$time(sigDate, { format: 'short' })}
        </dd>
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
