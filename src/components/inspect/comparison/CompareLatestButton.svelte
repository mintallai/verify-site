<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Button from '../../Button.svelte';
  import { rootClaimId, compareWithPath } from '../../../stores';
  import type { Claim } from '../../../lib/sdk';

  export let claim: Claim;
  export let isComparing: boolean = false;
</script>

{#if !isComparing && claim?.id !== $rootClaimId}
  <div class="w-full py-5 mt-4 border-t border-gray-300">
    <Button full on:click={() => compareWithPath([$rootClaimId])}
      >{$_('comp.comparison.compareToLatestVersion')}</Button>
  </div>
{/if}
