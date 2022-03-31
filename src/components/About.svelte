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
  import { _, date, time } from 'svelte-i18n';
  import cssVars from 'svelte-css-vars';
  import ManifestDetails from './ManifestDetails.svelte';
  import ProviderIcon from './inspect/ProviderIcon.svelte';
  import Thumbnail from './Thumbnail.svelte';
  import { getManifest, getBadgeProps, getIsOriginal } from '../lib/manifest';
  import '@contentauth/web-components/dist/components/panels/EditsActivity';
  import '@contentauth/web-components/dist/components/Tooltip';
  import '@contentauth/web-components/dist/themes/spectrum';
  import type { HierarchyTreeNode } from '../stores';
  import debug from 'debug';

  const dbg = debug('about');

  export let node: HierarchyTreeNode;
  export let isComparing: boolean = false;
  export let isMobileViewer: boolean = false;
  let colWidth = 0;

  $: data = node.data;
  $: manifest = getManifest(node);
  $: filename = data.title ?? '';
  $: issuer = manifest?.signature?.issuer;
  $: sigDate = manifest?.signature?.date;
  $: badgeProps = getBadgeProps(node);
</script>

<div data-test-id="about" class="w-full flex justify-center">
  <div class="about-info w-full max-w-xs">
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
        <dd
          class="flex space-x-2 items-center mt-1"
          data-test-id="about.file-name">
          <div class="w-12 h-12">
            <Thumbnail {node} {...badgeProps} />
          </div>
          {#if manifest}
            <div>
              <div class="flex space-x-2" data-test-id="about.signed-by">
                <div class="relative top-0.5">
                  <ProviderIcon provider={issuer} />
                </div>
                <div>
                  {issuer ?? ''}
                </div>
              </div>
              <div>
                {#if sigDate && sigDate.toString() !== 'Invalid Date'}
                  {$date(sigDate, { format: 'short' })}{', '}
                  {$time(sigDate, { format: 'short' })}
                {:else}
                  {$_('comp.about.signedOn.notAvailable')}
                {/if}
              </div>
            </div>
          {:else}
            <div>
              <h6>{$_('comp.about.fileName')}</h6>
              <div>{filename}</div>
            </div>
          {/if}
        </dd>
      </dl>
    </div>
    <div bind:clientWidth={colWidth} class="lg:hidden w-full overflow-x-hidden">
      <div use:cssVars={{ 'cai-thumbnail-size': `${colWidth}px` }}>
        <Thumbnail {node} />
        <div class="thumbnail-title">{filename}</div>
      </div>
    </div>
    {#if manifest}
      <ManifestDetails {node} />
    {:else}
      <!-- @TODO: Show badge info -->
      <div class="py-4">
        {$_('comp.contentCredentialsError.noneForFile')}
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
    :global(.about-info) {
      @apply min-h-0;
    }
  }
  @screen lg {
    .file-name .value {
      @apply max-w-full;
    }
  }
</style>
