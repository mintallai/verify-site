<script lang="ts">
  import Button from '../../Button.svelte';
  import { rootClaimId, compareWithId } from '../../../stores';

  export let claim: IClaimSummary & IIdentifiable;
  export let isComparing: boolean = false;
</script>

{#if !isComparing && claim?._id !== $rootClaimId}
  <div class="w-full py-5 mt-4 border-t border-gray-300">
    <Button full on:click={() => compareWithId($rootClaimId)}
      >Compare to latest version</Button
    >
  </div>
{/if}
