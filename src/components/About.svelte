<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  export let summary: ISummaryResponse;
  export let claimId: string;
  export let isComparing: boolean = false;
  export let isPopup: boolean = false;
  const dispatch = createEventDispatcher();

  $: alternate = isComparing || isPopup;
  $: pointer = claimId?.split(':')[1] || summary?.root_claim_id;
  $: claim = summary?.claims[pointer];
</script>

<style lang="postcss">
  h2.filename {
    @apply mt-0 mb-3;
  }
  h2:first-child {
    @apply mt-0;
  }
  .close {
    @apply bg-gray-200 rounded-full cursor-pointer flex items-center justify-center;
    width: 28px;
    height: 28px;
  }
  .compare-title {
    @apply font-bold text-xl truncate mb-1;
    max-width: 240px;
  }
  .compare-thumbnail {
    @apply w-full border border-gray-350 bg-white rounded bg-contain bg-center bg-no-repeat;
    height: 280px;
  }
</style>

<div>
  <!-- Compare header -->
  {#if alternate}
    {#if isComparing}
      <h2 class="filename">
        <div>
          <div class="font-bold text-xs uppercase text-gray-500 leading-none">
            File name
          </div>
          <div class="compare-title">{claim.title}</div>
        </div>
        <div class="flex-grow flex justify-end">
          <div class="close" on:click={() => dispatch('close', { claim })}>
            <Icon size="m" name="workflow:Close" class="text-gray-400" />
          </div>
        </div>
      </h2>
    {/if}
    <div
      class="compare-thumbnail"
      style={`background-image: url("${claim.thumbnail_url}");`} />
  {/if}

  <claim-info {summary} claimid={pointer} variant="lg" />
</div>
