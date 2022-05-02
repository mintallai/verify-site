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
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import AlertOutlineIcon from '../../assets/svg/color/alert-outline.svg';
  import Thumbnail from './Thumbnail.svelte';
  import Web3Address from './Web3Address.svelte';
  import { getFaqUrl, navigateToChild } from '../stores';
  import { DEFAULT_LOCALE } from '../lib/i18n';
  import {
    getManifest,
    getBadgeProps,
    getIsOriginal,
    getReviewRatings,
  } from '../lib/node';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import type { HierarchyTreeNode } from '../stores';

  export let node: HierarchyTreeNode;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;

  $: currentLocale = $locale || DEFAULT_LOCALE;
  $: manifest = getManifest(node);
  $: isOriginal = getIsOriginal(node);
  $: generator = manifest.claimGenerator.product;
  $: issuer = manifest?.signature?.issuer;
  $: sigDate = manifest?.signature?.date;
  $: producer = manifest.producer;
  $: isBeta = manifest.isBeta;
  $: website = manifest.website;
  $: socialAccounts = manifest.socialAccounts;
  $: web3Addresses = manifest.web3;
  $: ratings = getReviewRatings(node);
  $: editsActivityStrings = JSON.stringify({
    NO_EDITS: $_('comp.about.editsActivity.none'),
  });
</script>

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
    <dd class="flex space-x-2" data-test-id="about.signed-by">
      <div class="relative top-0.5">
        <ProviderIcon provider={issuer} />
      </div>
      <div>
        {issuer ?? ''}
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
    <dd data-test-id="about.signed-on">
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
        <ProviderIcon provider={generator} class="mr-2" />
      </div>
      <div class="break-word">
        <div>{generator}</div>
        {#if isBeta}
          <div class="text-gray-700">Content Credentials (Beta)</div>
        {/if}
      </div>
    </dd>
  </dl>
</div>
{#await manifest.editsAndActivity(currentLocale) then categories}
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
        {#if ratings.hasUnknownActions || ratings.wasPossiblyModified}
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
    <OriginalCreation type="original" {node} />
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
        {#if node.children?.length}
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
      <dd>{producer.name}</dd>
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
{#if socialAccounts?.length || web3Addresses?.length}
  <div class="space-y-4">
    {#if socialAccounts?.length}
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
    {#if web3Addresses?.length}
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
  .assets-used {
    @apply grid gap-3;
    grid-template-columns: repeat(auto-fit, 48px);
  }
  .social-accounts {
    @apply grid gap-x-2 gap-y-1 items-center;
    grid-template-columns: 16px auto;
  }
  @screen md {
    .about-info {
      @apply min-h-0;
    }
  }
</style>
