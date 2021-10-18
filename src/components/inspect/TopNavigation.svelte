<script lang="ts">
  import { goto, params, url } from '@roxi/routify';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Icon from '../Icon.svelte';
  import {
    primaryId,
    compareMode,
    hierarchy,
    setCompareMode,
    CompareMode,
    isMobileViewerShown,
  } from '../../stores';
  import { Source } from '../../lib/sdk';
  import BreadcrumbDropdown from '../../../assets/svg/monochrome/breadcrumb-dropdown.svg';
  import LeftArrow from '../../../assets/svg/monochrome/left-arrow.svg';
  import '@contentauth/web-components/dist/icons/monochrome/cai';
  import '@contentauth/web-components/dist/components/Thumbnail';
  import '@contentauth/web-components/dist/components/Tooltip';
  import Thumbnail from '../Thumbnail.svelte';
  import { getPath } from '../../lib/claim';

  type Page = 'overview' | 'inspect';

  export let currentPage: Page = 'overview';
  export let isComparing: boolean = false;
  export let noMetadata: boolean = false;
  export let source: Source | null = null;
  export let primary: ViewableItem | null = null;
  const dispatch = createEventDispatcher();

  function handleNavChange() {
    $goto(this.selected, $params);
  }

  function handleMenuChange() {
    // TODO: Change page
  }

  function handleCompareChange() {
    setCompareMode(this.value);
  }

  $: showMenu = $isMobileViewerShown;
  // $: children = primary?.ingredients;
</script>

<div id="breadcrumb-bar" class="container" class:menu-view={showMenu}>
  <sp-theme color="lightest" scale="medium" class="w-full">
    {#if isComparing}
      <div class="flex space-x-5 py-3">
        <div
          class="flex items-center cursor-pointer"
          on:click={() => dispatch('back')}>
          <LeftArrow width="14" height="12" class="text-gray-800 mr-2" />
          <div>
            {$_('comp.topNavigation.back')}
          </div>
        </div>
        <!-- <div class="flex pl-5 items-center border-l border-gray-300">
          <sp-picker
            id="compare-picker"
            on:change={handleCompareChange}
            value={$compareMode}
            quiet
            size="m">
            <sp-menu-item value={CompareMode.Slider}>
              {$_('comp.topNavigation.slider')}
            </sp-menu-item>
            <sp-menu-item value={CompareMode.Split}>
              {$_('comp.topNavigation.split')}
            </sp-menu-item>
          </sp-picker> -->
        <!-- </div> -->
      </div>
    {:else if showMenu}
      {#if primary}
        <div class="inline align-middle">
          {#if primary?.ingredients?.length > 0}
            <sp-action-menu
              class="-ml-3 inline mt-3.5"
              value={$primaryId}
              on:change={handleMenuChange}>
              <div slot="icon" class="py-2">
                <BreadcrumbDropdown
                  slot="icon"
                  width="20"
                  height="16"
                  class="text-gray-800" />
              </div>
              <!-- {#each children as childNode (getPath(childNode).toString())}
              <svelte:self node={childNode} />
            {/each} -->
            </sp-action-menu>
            <div class="separator -ml-2 inline">
              <Icon size="s" name="ChevronRight" class="text-gray-800" />
            </div>
          {/if}
          <div class="breadcrumb-item" class:current={true}>
            <div class="inline mt-3.5">
              <Thumbnail asset={primary.asset} />
            </div>
            <span class="inline font-regular text-smd">{primary.title} </span>
          </div>
        </div>
      {/if}
    {:else}
      <sp-tabs
        selected={$url()}
        on:change={handleNavChange}
        class="nav-tabs mt-1 -ml-4">
        <sp-tab label={$_('comp.topNavigation.overview')} value="/overview" />
        <sp-tab label={$_('comp.topNavigation.inspect')} value="/inspect" />
      </sp-tabs>
    {/if}
  </sp-theme>
</div>

<style lang="postcss">
  .container {
    --spectrum-picker-m-text-color: var(--black);
    --spectrum-picker-m-text-color-hover: var(--black);
    --cai-thumbnail-size: 32px;
    @apply flex bg-white border-b-2 border-gray-200 px-5 max-w-full z-30 items-stretch;
    grid-area: breadcrumb;
    height: 60px;
  }
  .container > sp-theme {
    @apply flex items-stretch;
  }
  .breadcrumb-item {
    @apply inline-block cursor-pointer;
  }
  .breadcrumb-item.current {
    @apply font-bold cursor-default;
  }
  .separator {
    @apply inline-block relative px-2;
  }
  .nav-tabs {
    --spectrum-tabs-rule-color: var(--white);
    --spectrum-tabs-m-text-color: var(--gray-700);
    --spectrum-tabs-m-selection-indicator-color: var(--blue-500);
    --spectrum-tabs-m-rule-size: 4px;
    --spectrum-tabs-item-gap: 1.25rem;
  }
  .nav-tabs sp-tab {
    --spectrum-tabs-text-size: var(--font-size-100);
  }
  @screen lgHeight {
    .container {
      @apply sticky;
      top: 80px;
    }
  }
</style>
