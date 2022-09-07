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
  import debug from 'debug';
  import cssVars from 'svelte-css-vars';
  import { _ } from 'svelte-i18n';
  import { getBadgeProps, getFilename, getManifest } from '../lib/node';
  import { selectIsOriginal } from '../lib/sdk';
  import type { HierarchyTreeNode } from '../stores';
  import AboutSection from './inspect/AboutSection.svelte';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ManifestDetails from './ManifestDetails.svelte';
  import Thumbnail from './Thumbnail.svelte';

  const dbg = debug('about');

  export let node: HierarchyTreeNode;
  export let isComparing = false;
  export let isMobileViewer = false;

  let colWidth: number;

  $: isOriginal = selectIsOriginal(getManifest(node));
  $: filename = getFilename(node);
  $: badgeProps = getBadgeProps(node);
  $: showDetails = badgeProps?.badgeType === 'info';
</script>

<div data-test-id="about" class="w-full flex justify-center">
  <div class="about-info w-full max-w-xs">
    <div class="hidden lg:block">
      <dl>
        <AboutSection
          title={$_('comp.about.contentCredentials.header')}
          helper={$_('comp.about.contentCredentials.helpText')}
          collapsible={false}>
          <dd
            class="flex space-x-2 items-center mt-1"
            data-test-id="about.file-name">
            <div class="w-12 h-12">
              <Thumbnail {node} {...badgeProps} />
            </div>
            <div>
              <h6>{$_('comp.about.fileName')}</h6>
              <div>{filename}</div>
            </div>
          </dd>
          {#if isOriginal}
            <div class="mt-4">
              <OriginalCreation type="original" {node} />
            </div>
          {/if}
        </AboutSection>
      </dl>
    </div>
    <div bind:clientWidth={colWidth} class="lg:hidden w-full overflow-x-hidden">
      <div use:cssVars={{ 'cai-thumbnail-size': `${colWidth}px` }}>
        <Thumbnail {node} />
        <div class="thumbnail-title">{filename}</div>
      </div>
    </div>
    {#if showDetails}
      <ManifestDetails {node} {isComparing} {isMobileViewer} />
    {:else}
      <div class="py-4">
        {#if badgeProps?.badgeHelpText}
          {$_(badgeProps.badgeHelpText)}
        {:else}
          {$_('comp.contentCredentialsError.noneForFile')}
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  :global(.about-info > div) {
    @apply py-4 border-b border-gray-300;
  }
  :global(.about-info > div:first-child) {
    @apply pt-0;
  }
  :global(.about-info > div:last-child) {
    @apply border-none;
  }
  .thumbnail-title {
    @apply mt-1 truncate;
    width: var(--cai-thumbnail-size);
  }

  @screen md {
    .about-info {
      @apply min-h-0;
    }
  }
  @screen lg {
    .file-name .value {
      @apply max-w-full;
    }
  }
</style>
