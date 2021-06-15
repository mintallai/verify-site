<script lang="ts">
  import Button from '../../Button.svelte';
  import { rootClaimId, compareWithId } from '../../../stores';
  import type { IEnhancedClaimReport } from '../../../lib/types';

  export let claim: IEnhancedClaimReport;
  export let isComparing: boolean = false;
</script>

{#if !isComparing && claim?.id !== $rootClaimId}
  <div class="w-full py-5 mt-4 border-t border-gray-300">
    <Button full on:click={() => compareWithId($rootClaimId)}
      >Compare to latest version</Button
    >
  </div>
{/if}
