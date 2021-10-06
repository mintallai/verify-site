<script lang="ts">
  import { beforeUpdate, onDestroy } from 'svelte';
  import { _, date, time, locale } from 'svelte-i18n';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import Alert from './Alert.svelte';
  import { navigateToPath, compareWithId, provenance } from '../stores';
  import {
    getAssetsUsed,
    getIsBeta,
    getIsOriginal,
    getWebsite,
  } from '../lib/claim';
  import '@contentauth/web-components/dist/components/panels/Assets';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import {
    Claim,
    AssertionLabel,
    ActionsAssertion,
    CreativeWorkAssertion,
    RecorderFormat,
  } from '../lib/sdk';
  import debug from 'debug';

  const dbg = debug('about');

  export let claim: Claim;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;
  let element: HTMLElement;
  let secureCapture = false;
  let assetsUsed = [];
  let thumbnailDisposers = [];

  $: isOriginal = getIsOriginal(claim);
  $: actionsAssertion = claim.findAssertion(
    AssertionLabel.Actions,
  ) as ActionsAssertion | null;
  $: creativeWorkAssertion = claim.findAssertion(
    AssertionLabel.CreativeWork,
  ) as CreativeWorkAssertion | null;
  $: producer = creativeWorkAssertion?.producer?.name ?? '';
  $: title = claim.title;
  $: signedBy = claim.signature.issuer;
  $: sigDate = claim.signature.date;
  $: recorder = claim.formatRecorder(RecorderFormat.ProgramNameAndVersion);
  $: isBeta = getIsBeta(claim);
  $: website = getWebsite(claim);

  $: editsActivityStrings = JSON.stringify({
    NO_EDITS: $_('comp.about.editsActivity.none'),
  });
  $: assetsStrings = JSON.stringify({
    CLAIM_INFO_HELP_TEXT: $_('comp.about.assets.claimInfoHelpText'),
  });

  onDestroy(() => {
    thumbnailDisposers.forEach((fn) => fn());
  });
</script>

<div class="w-full flex justify-center">
  <div class="info w-full max-w-xs lg:pb-4" bind:this={element}>
    {#if isComparing}
      <div class="file-name">
        <div class="label">{$_('comp.about.fileName')}</div>
        <div class="value">{title}</div>
      </div>
    {/if}
    <div>
      <dl class="attributes">
        <dt>
          <div class="whitespace-nowrap">{$_('comp.about.signedBy')}</div>
          <cai-tooltip placement="left" class="theme-spectrum">
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
    <div>
      <dl class="attributes">
        <dt>{$_('comp.about.producedWith')}</dt>
        <dd class="flex space-x-2">
          <div class="relative top-0.5">
            <ProviderIcon provider={recorder} />
          </div>
          <div class="break-word">
            <div>{recorder}</div>
            {#if isBeta}
              <div class="text-gray-700">Content Credentials (Beta)</div>
            {/if}
          </div>
        </dd>
      </dl>
    </div>
    {#await actionsAssertion.getCategories($locale) then categories}
      {#if categories}
        <div>
          <dl class="attributes">
            <dt>
              <div class="whitespace-nowrap">
                {$_('comp.about.editsActivity.header')}
              </div>
              <cai-tooltip placement="left" class="theme-spectrum">
                <div slot="content" class="text-gray-900" style="width: 200px;">
                  {$_('comp.about.editsActivity.helpText')}
                </div>
              </cai-tooltip>
            </dt>
            <dd class="mt-2">
              <cai-panel-edits-activity
                {categories}
                stringmap={editsActivityStrings}
                hidedescriptions={isMobileViewer && isComparing ? true : null}
                class="theme-spectrum" />
            </dd>
          </dl>
        </div>
      {/if}
    {/await}
    <div>
      <dl class="attributes">
        <dt>
          <div class="whitespace-nowrap">
            {$_('comp.about.assets.header')}
          </div>
          <cai-tooltip placement="left" class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 200px;">
              {$_('comp.about.assets.helpText')}
            </div>
          </cai-tooltip>
        </dt>
        <dd class="pt-2 pb-1">
          <cai-panel-assets
            stringmap={assetsStrings}
            assets={assetsUsed}
            on:asset-click={({ detail }) => {
              const id = detail?.asset?.id;
              if (id) {
                // TODO: Update this to pass in the proper path
                navigateToPath([id]);
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
        </dd>
      </dl>
    </div>
    {#if producer}
      <div>
        <dl class="attributes">
          <dt class="flex space-x-2">
            <div class="whitespace-nowrap">{$_('comp.about.producedBy')}</div>
            <cai-tooltip placement="left" class="theme-spectrum">
              <div slot="content" class="text-gray-900" style="width: 150px;">
                {$_('comp.about.producedByHelpText')}
              </div>
            </cai-tooltip>
          </dt>
          <dd>{producer}</dd>
        </dl>
      </div>
    {/if}
    {#if website}
      <div>
        <dl class="attributes">
          <dt class="flex space-x-2">
            <div class="whitespace-nowrap">{$_('comp.about.website')}</div>
            <cai-tooltip placement="left" class="theme-spectrum">
              <div slot="content" class="text-gray-900" style="width: 150px;">
                {$_('comp.about.websiteHelpText')}
              </div>
            </cai-tooltip>
          </dt>
          <dd class="truncate">
            <a href={website} target="_blank" class="link">{website}</a>
          </dd>
        </dl>
      </div>
    {/if}
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
