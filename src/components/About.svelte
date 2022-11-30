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
  import debug from 'debug';
  import cssVars from 'svelte-css-vars';
  import { _ } from 'svelte-i18n';
  import { selectExif } from '../lib/exif';
  import { getBadgeProps, getFilename, getManifest } from '../lib/node';
  import { selectIsOriginal } from '../lib/sdk';
  import type { HierarchyTreeNode } from '../stores';
  import CollapsibleSection from './CollapsibleSection.svelte';
  import Exif from './Exif.svelte';
  import AboutSection from './inspect/AboutSection.svelte';
  import OriginalCreation from './inspect/OriginalCreation.svelte';
  import ManifestDetails from './ManifestDetails.svelte';
  import Thumbnail from './Thumbnail.svelte';

  const dbg = debug('about');

  export let node: HierarchyTreeNode;
  export let isComparing = false;
  export let isMobileViewer = false;

  let colWidth: number;

  $: manifest = getManifest(node);
  $: isOriginal = selectIsOriginal(manifest);
  $: exif = selectExif(manifest);
  $: filename = getFilename(node);
  $: badgeProps = getBadgeProps(node);
  $: showDetails = badgeProps?.badgeType === 'info';
</script>

<div class="w-full">
  <CollapsibleSection headerText={$_('comp.about.contentCredentials.header')}>
    <div data-test-id="about" class="w-full flex justify-center">
      <div class="about-info w-full max-w-xs">
        <div class="hidden lg:block">
          <dl>
            {#if isOriginal}
              <div class="mb-2">
                <OriginalCreation type="original" {node} />
              </div>
            {/if}
            <AboutSection>
              <dd
                class="flex space-x-2 items-center mt-1"
                data-test-id="about.file-name">
                <div class="w-12 h-12">
                  <Thumbnail {node} {...badgeProps} />
                </div>
                <div>{filename}</div>
              </dd>
            </AboutSection>
          </dl>
        </div>
        <div
          bind:clientWidth={colWidth}
          class="lg:hidden w-full overflow-x-hidden">
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
  </CollapsibleSection>
  {#if exif}
    <div class="border-t border-gray-300 pt-4">
      <CollapsibleSection
        headerText={$_('comp.about.exif.header')}
        helper={$_('comp.about.exif.helpText')}>
        <div class="about-info">
          <Exif data={exif} />
        </div>
      </CollapsibleSection>
    </div>
  {/if}
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
