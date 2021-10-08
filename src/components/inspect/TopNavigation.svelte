<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Icon from '../Icon.svelte';
  import {
    primaryId,
    compareMode,
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

  export let isComparing: boolean = false;
  export let noMetadata: boolean = false;
  export let source: Source | null = null;
  const dispatch = createEventDispatcher();

  $: selectedCompareText =
    $compareMode === CompareMode.Slider
      ? 'comp.topNavigation.slider'
      : 'comp.topNavigation.split';

  function handleNavChange() {
    // TODO: Change page
  }

  function handleMenuChange() {
    // navigateToId(this.value);
  }

  $: showMenu = $isMobileViewerShown;
</script>

<div id="breadcrumb-bar" class="container" class:menu-view={showMenu}>
  <sp-theme color="light" scale="medium" class="w-full">
    {#if isComparing}
      <div
        class="flex items-center cursor-pointer"
        on:click={() => dispatch('back')}>
        <LeftArrow width="14" height="12" class="text-gray-800 mr-2" />
        <div>
          {$_('comp.topNavigation.back')}
        </div>
      </div>
      <!-- <div>
          <sp-field-label for="compare-picker" size="m">
            {$_(selectedCompareText)}
          </sp-field-label>
          <sp-picker id="compare-picker" quiet size="m" label="Selection type">
            <sp-menu-item>{$_('comp.topNavigation.slider')}</sp-menu-item>
            <sp-menu-item>{$_('comp.topNavigation.split')}</sp-menu-item>
          </sp-picker>
        </div> -->
    {:else if showMenu}
      <sp-action-menu
        class="-ml-3"
        value={$primaryId}
        on:change={handleMenuChange}>
        <div slot="icon" class="py-2">
          <BreadcrumbDropdown
            slot="icon"
            width="20"
            height="16"
            class="text-gray-800" />
        </div>
      </sp-action-menu>
      <div class="separator -ml-2">
        <Icon size="s" name="ChevronRight" class="text-gray-800" />
      </div>
      <div class="breadcrumb-item" class:current={true} />
    {:else}
      <sp-tabs
        selected="inspect"
        on:change={handleNavChange}
        class="nav-tabs mt-1">
        <sp-tab label={$_('comp.topNavigation.overview')} value="overview" />
        <sp-tab label={$_('comp.topNavigation.inspect')} value="inspect" />
      </sp-tabs>
    {/if}
  </sp-theme>
</div>

<style lang="postcss">
  .container {
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
