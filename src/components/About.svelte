<script lang="ts">
  import { _, date, time, locale } from 'svelte-i18n';
  import cssVars from 'svelte-css-vars';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import AlertOutlineIcon from '../../assets/svg/color/alert-outline.svg';
  import EthereumLogo from '../../assets/svg/color/logos/crypto-eth.svg';
  import Thumbnail from './Thumbnail.svelte';
  import { getFaqUrl, navigateToChild } from '../stores';
  import {
    getBadgeProps,
    getIsBeta,
    getIsOriginal,
    getWebsite,
  } from '../lib/claim';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import {
    Claim,
    AssertionLabel,
    ActionsAssertion,
    CreativeWorkAssertion,
    RecorderFormat,
    AdobeCryptoAddressesAssertion,
  } from '../lib/sdk';
  import debug from 'debug';

  const dbg = debug('about');

  export let claim: Claim;
  // TODO: Fix this so that we get the proper information and don't need to pass this in
  export let title: string | null = null;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;
  let colWidth = 0;

  $: isOriginal = getIsOriginal(claim);
  $: actionsAssertion = claim.findAssertion(
    AssertionLabel.Actions,
  ) as ActionsAssertion | null;
  $: hasUnknownActions = actionsAssertion?.data?.metadata?.reviewRatings?.find(
    (ratings) => ratings.code === 'actions.unknownActionsPerformed',
  );
  $: wasPossiblyModified = claim.ingredients?.find((ingredient) =>
    ingredient.data.reviews?.find(
      (review) => review.code === 'ingredient.possiblyModified',
    ),
  );
  $: creativeWorkAssertion = claim.findAssertion(
    AssertionLabel.CreativeWork,
  ) as CreativeWorkAssertion | null;
  $: cryptoAssertion = claim.findAssertion(
    AssertionLabel.AdobeCryptoAddresses,
  ) as AdobeCryptoAddressesAssertion | null;
  $: producer = creativeWorkAssertion?.producer?.name ?? '';
  $: asset = claim.asset;
  $: filename = title ?? claim.title;
  $: assets = claim.ingredients?.length ? claim.ingredients : null;
  $: signedBy = claim.signature?.issuer;
  $: sigDate = claim.signature?.date;
  $: recorder = claim.formatRecorder(RecorderFormat.ProgramNameAndVersion);
  $: isBeta = getIsBeta(claim);
  $: website = getWebsite(claim);
  $: socialAccounts = creativeWorkAssertion?.socialAccounts ?? [];
  $: ethereumAddresses = cryptoAssertion?.data?.ethereum ?? [];

  $: editsActivityStrings = JSON.stringify({
    NO_EDITS: $_('comp.about.editsActivity.none'),
  });
</script>

<div data-test-id="about" class="w-full flex justify-center">
  <div class="info w-full max-w-xs">
    <div class="hidden lg:block">
      <dl class="attributes">
        <dt>
          <div>
            {$_('comp.about.contentCredentials.header')}
          </div>
          <cai-tooltip placement="left" class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 200px;">
              {$_('comp.about.contentCredentials.helpText')}
            </div>
          </cai-tooltip>
        </dt>
        <dd class="flex space-x-2 items-center mt-1">
          <div class="w-12 h-12">
            <Thumbnail {asset} {...getBadgeProps({ claim })} />
          </div>
          <div>
            <h6>File name</h6>
            <div>{filename}</div>
          </div>
        </dd>
      </dl>
    </div>
    <div bind:clientWidth={colWidth} class="lg:hidden w-full overflow-x-hidden">
      <div use:cssVars={{ 'cai-thumbnail-size': `${colWidth}px` }}>
        <Thumbnail {asset} />
        <div class="thumbnail-title">{filename}</div>
      </div>
    </div>
    <div>
      <dl class="attributes">
        <dt>
          <div>{$_('comp.about.signedBy')}</div>
          <cai-tooltip placement="left" class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 200px;">
              {$_('comp.about.signedBy.helpText')}
            </div>
          </cai-tooltip>
        </dt>
        <dd class="flex space-x-2">
          <div class="relative top-0.5">
            <ProviderIcon provider={signedBy} />
          </div>
          <div>
            {signedBy ?? ''}
          </div>
        </dd>
        <dt>
          <div>{$_('comp.about.signedOn')}</div>
          <cai-tooltip placement="left" class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 200px;">
              {$_('comp.about.signedOn.helpText')}
            </div>
          </cai-tooltip>
        </dt>
        <dd>
          {#if sigDate && sigDate.toString() !== 'Invalid Date'}
            {$date(sigDate, { format: 'short' })}{', '}
            {$time(sigDate, { format: 'short' })}
          {:else}
            {$_('comp.about.signedOn.notAvailable')}
          {/if}
        </dd>
      </dl>
    </div>
    <div>
      <dl class="attributes">
        <dt>
          <div>{$_('comp.about.producedWith')}</div>
          <cai-tooltip placement="left" class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 200px;">
              {$_('comp.about.producedWith.helpText')}
            </div>
          </cai-tooltip>
        </dt>
        <dd class="flex">
          <div class="relative top-0.5">
            <ProviderIcon provider={recorder} class="mr-2" />
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
    {#await actionsAssertion?.getCategories($locale) then categories}
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
            {#if hasUnknownActions || wasPossiblyModified}
              <dd data-test-id="about.unknownActionsAlert" class="flex mt-1">
                <div class="relative top-0.5">
                  <AlertOutlineIcon width="16px" height="16px" class="mr-2" />
                </div>
                <div class="italic text-gray-900">
                  <span
                    >{$_('comp.contentCredentialsError.unknownActions')}</span>
                  <a href={getFaqUrl()} target="_blank" class="link"
                    >{$_('comp.contentCredentialsError.learnMore')}</a>
                </div>
              </dd>
            {/if}
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
      {#if isOriginal}
        <OriginalCreation type="original" {claim} />
      {:else}
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
            {#if assets}
              <div class="assets-used">
                {#each assets as asset}
                  <div
                    class="w-12 h-12 cursor-pointer"
                    on:click={() =>
                      navigateToChild(asset.claim?.id ?? asset.id)}>
                    <Thumbnail {asset} {...getBadgeProps(asset)} />
                  </div>
                {/each}
              </div>
            {:else}
              {$_('comp.about.none')}
            {/if}
          </dd>
        </dl>
      {/if}
    </div>
    {#if producer}
      <div>
        <dl class="attributes">
          <dt class="flex space-x-2">
            <div class="whitespace-nowrap">{$_('comp.about.producedBy')}</div>
            <cai-tooltip placement="left" class="theme-spectrum">
              <div slot="content" class="text-gray-900" style="width: 150px;">
                {$_('comp.about.producedBy.helpText')}
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
                {$_('comp.about.website.helpText')}
              </div>
            </cai-tooltip>
          </dt>
          <dd class="truncate">
            <a href={website} target="_blank" class="link">{website}</a>
          </dd>
        </dl>
      </div>
    {/if}
    {#if socialAccounts.length || ethereumAddresses.length}
      <div class="space-y-4">
        {#if socialAccounts.length}
          <dl class="attributes">
            <dt class="flex space-x-2">
              <div class="whitespace-nowrap">{$_('comp.about.social')}</div>
              <cai-tooltip placement="left" class="theme-spectrum">
                <div slot="content" class="text-gray-900" style="width: 150px;">
                  {$_('comp.about.social.helpText')}
                </div>
              </cai-tooltip>
            </dt>
            <dd class="social-accounts">
              {#each socialAccounts as account (account['@id'])}
                <div class="relative top-0.5">
                  <ProviderIcon provider={account['@id']} class="mr-2" />
                </div>
                <a href={account['@id']} target="_blank" class="link"
                  >@{account.name}</a>
              {/each}
            </dd>
          </dl>
        {/if}
        {#if ethereumAddresses.length}
          <dl class="attributes">
            <dt class="flex space-x-2">
              <div class="whitespace-nowrap">{$_('comp.about.crypto')}</div>
              <cai-tooltip placement="left" class="theme-spectrum">
                <div slot="content" class="text-gray-900" style="width: 150px;">
                  {$_('comp.about.crypto.helpText')}
                </div>
              </cai-tooltip>
            </dt>
            {#each ethereumAddresses as address}
              <dd class="flex">
                <div class="relative top-0.5">
                  <EthereumLogo width="16px" height="16px" class="mr-2" />
                </div>
                <div class="break-all">{address.toString().toLowerCase()}</div>
              </dd>
            {/each}
          </dl>
        {/if}
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
    @apply border-none;
  }

  .assets-used {
    @apply grid gap-3;
    grid-template-columns: repeat(auto-fit, 48px);
  }
  .social-accounts {
    @apply grid gap-x-2 gap-y-1 items-center;
    grid-template-columns: 16px auto;
  }
  .thumbnail-title {
    @apply mt-1 truncate;
    width: var(--cai-thumbnail-size);
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
