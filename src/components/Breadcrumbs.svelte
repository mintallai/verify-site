<script lang="ts">
  import Asset from './Asset.svelte';
  import Icon from './Icon.svelte';
  import { breadcrumbIds, assetsByIdentifier } from '../stores';
  import { getBreadcrumbList } from '../lib/claim';

  $: breadcrumbList = getBreadcrumbList($breadcrumbIds, $assetsByIdentifier);
</script>

<style lang="postcss">
</style>

{#if breadcrumbList?.length}
  <div class="p-2">
    <h2 class="mb-5 p-3 pb-0 flex items-center">
      <span>Breadcrumbs</span>
      <Icon size="m" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
    </h2>
    <div class="container">
      {#each breadcrumbList as asset}
        <Asset {asset} />
      {/each}
    </div>
  </div>
{/if}
