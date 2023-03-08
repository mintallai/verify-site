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
  import { DEFAULT_LOCALE } from '$lib/i18n';
  import { getBadgeProps, getManifest } from '$lib/node';
  import {
    selectEditsAndActivityExists,
    selectFormattedDate,
    selectFormattedGenerator,
    selectIsBeta,
    selectIsOriginal,
    selectReviewRatings,
    selectWeb3,
    selectWebsite,
  } from '$lib/sdk';
  import { selectGenerativeInfo } from '$lib/selectGenerativeInfo';
  import {
    selectEditsAndActivity,
    selectProducer,
    selectSocialAccounts,
  } from 'c2pa';
  import { locale, _ } from 'svelte-i18n';
  import AlertOutlineIcon from '../../assets/svg/color/alert-outline.svg?component';
  import AiModelIcon from '../../assets/svg/monochrome/ai-model.svg?component';
  import InfoIcon from '../../assets/svg/monochrome/info.svg?component';
  import type { HierarchyTreeNode } from '../stores';
  import { navigateToChild, unknownLearnMoreUrl } from '../stores';
  import FormattedDateTime from './FormattedDateTime.svelte';
  import AboutSection from './inspect/AboutSection.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import Thumbnail from './Thumbnail.svelte';
  import Web3Address from './Web3Address.svelte';

  export let node: HierarchyTreeNode;

  $: currentLocale = $locale || DEFAULT_LOCALE;
  $: manifest = getManifest(node);
  $: isOriginal = selectIsOriginal(manifest);
  $: generator = selectFormattedGenerator(manifest);
  $: issuer = manifest?.signatureInfo.issuer;
  $: sigDate = selectFormattedDate(manifest);
  $: producer = selectProducer(manifest);
  $: isBeta = selectIsBeta(manifest);
  $: website = selectWebsite(manifest);
  $: socialAccounts = selectSocialAccounts(manifest);
  $: web3Addresses = selectWeb3(manifest);
  $: ratings = selectReviewRatings(manifest);
  $: hasEditsAndActivity = selectEditsAndActivityExists(manifest);
  $: generativeInfo = selectGenerativeInfo(manifest);
  $: isGenerated = !!generativeInfo?.modelName;
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
            {#if sigDate}
              <FormattedDateTime {sigDate} />
            {/if}
          </div>
        </div>
      </dd>
    </AboutSection>
  </dl>
</div>
{#if isGenerated}
  <div>
    <dl data-test-id="about.content-summary">
      <AboutSection title={$_('comp.about.contentSummary')}>
        <dd class="flex space-x-2">
          <div class="relative top-0.5">
            <InfoIcon width="16" height="16" />
          </div>
          <div class="break-word">
            {$_('comp.about.contentSummary.createdWithAi')}
          </div>
        </dd>
      </AboutSection>
    </dl>
  </div>
  <div>
    <dl data-test-id="about.ai-model-used">
      <AboutSection title={$_('comp.about.aiModelUsed')}>
        <dd class="flex space-x-2">
          <div class="relative top-0.5">
            <AiModelIcon width="16" height="16" />
          </div>
          <div class="break-word">
            {generativeInfo.modelName}
            {generativeInfo.modelVersion}
          </div>
        </dd>
      </AboutSection>
    </dl>
  </div>
{/if}
{#if producer}
  <div>
    <dl>
      <AboutSection
        title={$_('comp.about.producedBy')}
        helper={$_('comp.about.producedBy.helpText')}>
        <dl data-test-id="about.produced-by">
          <dd>{producer.name}</dd>
        </dl>
      </AboutSection>
    </dl>
  </div>
{/if}
{#if website}
  <div>
    <AboutSection
      title={$_('comp.about.website')}
      helper={$_('comp.about.website.helpText')}>
      <dl>
        <dd class="truncate">
          <a href={website} target="_blank" rel="noreferrer" class="link"
            >{website}</a>
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
          <dd class="accounts">
            {#each socialAccounts as account (account['@id'])}
              <div class="relative top-0.5">
                <ProviderIcon provider={account['@id']} class="mr-2" />
              </div>
              <a
                href={account['@id']}
                target="_blank"
                rel="noreferrer"
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
            <div class="pb-1">
              <Web3Address {type} {address} />
            </div>
          {/each}
        </AboutSection>
      </dl>
    {/if}
  </div>
{/if}
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
            <div class="text-gray-700">
              {$_('comp.about.producedWith.contentCredentialsBeta')}
            </div>
          {/if}
        </div>
      </dd>
    </AboutSection>
  </dl>
</div>
{#if hasEditsAndActivity}
  <AboutSection
    title={$_('comp.about.editsActivity.header')}
    helper={$_('comp.about.editsActivity.helpText')}>
    {#await selectEditsAndActivity(manifest, currentLocale) then categories}
      {#if categories?.length > 0}
        <div>
          <dl>
            {#if ratings.hasUnknownActions || ratings.wasPossiblyModified}
              <dd data-test-id="about.unknownActionsAlert" class="flex mt-1">
                <div class="relative top-0.5">
                  <AlertOutlineIcon width="16px" height="16px" class="mr-2" />
                </div>
                <div class="italic text-gray-900">
                  <span
                    >{$_('comp.contentCredentialsError.unknownActions')}</span>
                  <a
                    href={$unknownLearnMoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    class="link"
                    >{$_('comp.contentCredentialsError.learnMore')}</a>
                </div>
              </dd>
            {/if}
            <dd
              class="edits-and-activity-list"
              data-test-id="about.edits-and-activity">
              {#each categories as category}
                <div class="theme-spectrum mb-2">
                  <dt class="flex items-center">
                    {#if category.icon}
                      <img
                        src={category.icon}
                        alt={category.label}
                        class="mr-2 w-4" />
                    {/if}
                    <span class="edits-and-activity-label">
                      {category.label}
                    </span>
                  </dt>
                  <dd
                    class={category.icon
                      ? ' text-gray-700 text-[13px] ml-6'
                      : ' text-gray-700 text-[13px] ml-0'}>
                    {category.description}
                  </dd>
                </div>
              {/each}
            </dd>
          </dl>
        </div>
      {:else}
        <div>{$_('comp.about.editsActivity.none')}</div>
      {/if}
    {/await}
  </AboutSection>
{/if}
{#if !isOriginal}
  <AboutSection
    title={$_('comp.about.assets.header')}
    helper={$_('comp.about.assets.helpText')}>
    <dl data-test-id="about.assets">
      <dd class="pt-2 pb-1">
        {#if node.children?.length}
          <div class="assets-used">
            {#each node.children as childNode}
              <button
                class="w-12 h-12 cursor-pointer"
                on:click={() => navigateToChild(childNode.data.loc)}>
                <Thumbnail node={childNode} {...getBadgeProps(childNode)} />
              </button>
            {/each}
          </div>
        {:else}
          {$_('comp.about.none')}
        {/if}
      </dd>
    </dl>
  </AboutSection>
{/if}

<style lang="postcss">
  .assets-used {
    @apply grid gap-3;
    grid-template-columns: repeat(auto-fit, 48px);
  }
  .accounts {
    @apply grid gap-x-2 gap-y-1 items-center;
    grid-template-columns: 16px auto;
  }

  .edits-and-activity-list {
    @apply flex flex-col p-0 m-0 overflow-hidden gap-[6px];
    list-style: none;
  }

  .edits-and-activity-label {
    @apply overflow-hidden whitespace-nowrap text-[15px] text-gray-900;
    text-overflow: ellipsis;
  }
</style>
