<!--
  ADOBE CONFIDENTIAL
  Copyright 2020 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import { _, date, time, locale } from 'svelte-i18n';
  import cssVars from 'svelte-css-vars';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import AlertOutlineIcon from '../../assets/svg/color/alert-outline.svg';
  import Thumbnail from './Thumbnail.svelte';
  import Web3Address from './Web3Address.svelte';
  import { getFaqUrl, navigateToChild } from '../stores';
  import {
    getManifest,
    getBadgeProps,
    getIsBeta,
    getIsOriginal,
    getWebsite,
  } from '../lib/manifest';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import type { Manifest } from '../lib/sdk';
  import type { HierarchyTreeNode } from '../stores';
  import debug from 'debug';

  const dbg = debug('about');

  export let node: HierarchyTreeNode;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;
  let colWidth = 0;

  $: manifest = getManifest(node);
  $: isOriginal = getIsOriginal(manifest);
  $: claimGenerator = manifest.claimGenerator;
  $: producer = manifest.producer;
  $: isBeta = getIsBeta(manifest);
  $: website = getWebsite(manifest);

  // FIXME: Make this work
  $: hasUnknownActions = false;
  $: wasPossiblyModified = false;
  // $: actionsAssertion = claim.findAssertion(
  //   AssertionLabel.Actions,
  // ) as ActionsAssertion | null;
  // $: hasUnknownActions = actionsAssertion?.data?.metadata?.reviewRatings?.find(
  //   (ratings) => ratings.code === 'actions.unknownActionsPerformed',
  // );
  // $: wasPossiblyModified = claim.ingredients?.find((ingredient) =>
  //   ingredient.data.reviews?.find(
  //     (review) => review.code === 'ingredient.possiblyModified',
  //   ),
  // );

  // $: creativeWorkAssertion = claim.findAssertion(
  //   AssertionLabel.CreativeWork,
  // ) as CreativeWorkAssertion | null;
  // $: cryptoAssertion = claim.findAssertion(
  //   AssertionLabel.AdobeCryptoAddresses,
  // ) as AdobeCryptoAddressesAssertion | null;
  // $: producer = creativeWorkAssertion?.producer?.name ?? '';
  // $: asset = claim.asset;
  // $: filename = title ?? claim.title;
  // $: assets = claim.ingredients?.length ? claim.ingredients : null;
  // $: signedBy = claim.signature?.issuer;
  // $: sigDate = claim.signature?.date;
  // $: recorder = claim.formatRecorder(RecorderFormat.ProgramNameAndVersion);
  // $: socialAccounts = creativeWorkAssertion?.socialAccounts ?? [];
  // $: web3Addresses = (
  //   Object.entries(cryptoAssertion?.data ?? {}) as [string, string[]][]
  // ).filter(
  //   ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  // );

  $: editsActivityStrings = JSON.stringify({
    NO_EDITS: $_('comp.about.editsActivity.none'),
  });
</script>

<div>
  <dl class="attributes" data-test-id="about.produced-with">
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
        <ProviderIcon provider={claimGenerator} class="mr-2" />
      </div>
      <div class="break-word">
        <div>{claimGenerator}</div>
        {#if isBeta}
          <div class="text-gray-700">Content Credentials (Beta)</div>
        {/if}
      </div>
    </dd>
  </dl>
</div>
{#await manifest.editsAndActivity() then categories}
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
              <span>{$_('comp.contentCredentialsError.unknownActions')}</span>
              <a href={getFaqUrl()} target="_blank" class="link"
                >{$_('comp.contentCredentialsError.learnMore')}</a>
            </div>
          </dd>
        {/if}
        <dd class="mt-2" data-test-id="about.edits-and-activity">
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
    <!-- <OriginalCreation type="original" {claim} /> -->
  {:else}
    <dl class="attributes" data-test-id="about.assets">
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
        {#if node.children.length}
          <div class="assets-used">
            {#each node.children as childNode}
              <div
                class="w-12 h-12 cursor-pointer"
                on:click={() => navigateToChild(childNode.data.loc)}>
                <Thumbnail node={childNode} {...getBadgeProps(childNode)} />
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
    <dl class="attributes" data-test-id="about.produced-by">
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
{#if socialAccounts.length || web3Addresses.length}
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
            <a
              href={account['@id']}
              target="_blank"
              class="link"
              data-test-id="about.social-accounts.link">@{account.name}</a>
          {/each}
        </dd>
      </dl>
    {/if}
    {#if web3Addresses.length}
      <dl class="attributes">
        <dt class="flex space-x-2">
          <div class="whitespace-nowrap">{$_('comp.about.web3')}</div>
          <cai-tooltip placement="left" class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 150px;">
              {$_('comp.about.web3.helpText')}
            </div>
          </cai-tooltip>
        </dt>
        {#each web3Addresses as [type, [address]]}
          <Web3Address {type} {address} />
        {/each}
      </dl>
    {/if}
  </div>
{/if}

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
