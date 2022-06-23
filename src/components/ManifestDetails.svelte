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
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import { date, locale, time, _ } from 'svelte-i18n';
  import AlertOutlineIcon from '../../assets/svg/color/alert-outline.svg';
  import { DEFAULT_LOCALE } from '../lib/i18n';
  import {
    getBadgeProps,
    getGenerator,
    getIsOriginal,
    getManifest,
    getReviewRatings,
  } from '../lib/node';
  import type { HierarchyTreeNode } from '../stores';
  import { getFaqUrl, navigateToChild } from '../stores';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import Thumbnail from './Thumbnail.svelte';
  import Web3Address from './Web3Address.svelte';

  import AboutSection from './inspect/AboutSection.svelte';
  export let node: HierarchyTreeNode;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;

  $: currentLocale = $locale || DEFAULT_LOCALE;
  $: manifest = getManifest(node);
  $: isOriginal = getIsOriginal(node);
  $: generator = getGenerator(node);
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
  <dl>
    <AboutSection
      title={$_('comp.about.signedBy')}
      helper={$_('comp.about.signedBy.helpText')}>
      <dd class="flex space-x-2 !mb-0 " data-test-id="about.signed-by">
        <div class="relative top-0.5">
          <ProviderIcon provider={issuer} />
        </div>
        <div>
          {issuer ?? ''}
          <div data-test-id="about.signed-on">
            {#if sigDate && sigDate.toString() !== 'Invalid Date'}
              <div class="text-gray-700 -top-1.5">
                {$date(sigDate, { format: 'long' })}{' at '}
                {$time(sigDate, { format: 'short' })}
              </div>
            {:else}
              {$_('comp.about.signedOn.notAvailable')}
            {/if}
          </div>
        </div>
      </dd>
    </AboutSection>
  </dl>
</div>
<div>
  <dl data-test-id="about.produced-with">
    <AboutSection
      title={$_('comp.about.producedWith')}
      helper={$_('comp.about.producedWith.helpText')}>
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
    </AboutSection>
  </dl>
</div>
<AboutSection
  title={$_('comp.about.editsActivity.header')}
  helper={$_('comp.about.editsActivity.helpText')}>
  {#await manifest.editsAndActivity(currentLocale) then categories}
    {#if categories}
      <div>
        <dl>
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
</AboutSection>

{#if !isOriginal}
  <AboutSection
    title={$_('comp.about.assets.header')}
    helper={$_('comp.about.assets.helpText')}>
    <dl data-test-id="about.assets">
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
  </AboutSection>
{/if}

{#if producer}
  <div>
    <AboutSection
      title={$_('comp.about.producedBy')}
      helper={$_('comp.about.producedBy.helpText')}>
      <dl data-test-id="about.produced-by">
        <dd>{producer.name}</dd>
      </dl>
    </AboutSection>
  </div>
{/if}
{#if website}
  <div>
    <AboutSection
      title={$_('comp.about.website')}
      helper={$_('comp.about.website.helpText')}>
      <dl>
        <dd class="truncate">
          <a href={website} target="_blank" class="link">{website}</a>
        </dd>
      </dl>
    </AboutSection>
  </div>
{/if}
{#if socialAccounts?.length || web3Addresses?.length}
  <div class="space-y-4">
    {#if socialAccounts?.length}
      <dl>
        <AboutSection
          title={$_('comp.about.social')}
          helper={$_('comp.about.social.helpText')}>
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
        </AboutSection>
      </dl>
    {/if}
    {#if web3Addresses?.length}
      <dl>
        <AboutSection
          title={$_('comp.about.web3')}
          helper={$_('comp.about.web3.helpText')}>
          {#each web3Addresses as [type, [address]]}
            <Web3Address {type} {address} />
          {/each}
        </AboutSection>
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
