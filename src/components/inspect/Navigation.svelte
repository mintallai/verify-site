<script lang="ts">
  import { onDestroy } from 'svelte';
  import { _ } from 'svelte-i18n';
  import Button from '../Button.svelte';
  import OriginalCreation from './OriginalCreation.svelte';
  import HierarchyNode from './HierarchyNode.svelte';
  import { hierarchy, isCompareSelectMode } from '../../stores';
  import type { ViewableItem } from '../../lib/types';
  import { Claim, Source } from '../../lib/sdk';

  export let claim: ViewableItem | null = null;
  export let source: Source | null = null;
  let container: any;
  let secureCapture: false;

  onDestroy(() => isCompareSelectMode.set(false));
</script>

<div class="h-full relative">
  <div class="nav-width p-4 pb-1">
    <h2 class="my-0 mb-2">
      <span>{$_('comp.navigation.title')}</span>
    </h2>
    <div class="mb-4 leading-small text-gray-700">
      {$_('comp.navigation.subtitle')}
    </div>
  </div>
  <div class="relative pl-4">
    <div bind:this={container} class="grid space-y-4 pt-2">
      {#if $hierarchy}
        <HierarchyNode node={$hierarchy} />
      {/if}
    </div>
  </div>
  {#if secureCapture && claim instanceof Claim}
    <div class="mx-4">
      <OriginalCreation type="secureCapture" {claim} />
    </div>
  {/if}
  {#if $hierarchy?.children}
    <div
      class="sticky nav-width bottom-0 left-0 right-0 pb-4 pt-8 pointer-events-none flex justify-center w-full bg-gradient-to-t from-white via-white to-transparent">
      <div class="pointer-events-auto">
        <Button
          on:click={() => isCompareSelectMode.update((x) => !x)}
          secondary={!$isCompareSelectMode}
          >{$_('comp.contentCredentials.compare')}</Button>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .nav-width {
    max-width: var(--nav-width, 320px);
  }
</style>
