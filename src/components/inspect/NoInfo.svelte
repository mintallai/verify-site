<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon.svelte';

  export let ingredient: IReference;
  export let isComparing: boolean = false;
  const dispatch = createEventDispatcher();
</script>

<div>
  {#if isComparing}
    <h2 class="filename">
      <div>
        <div class="font-bold text-xs uppercase text-gray-500 leading-none">
          File name
        </div>
        <div class="compare-title">{ingredient.title}</div>
      </div>
      <div class="flex-grow flex justify-end">
        <div class="close" on:click={() => dispatch('close', { ingredient })}>
          <Icon size="m" name="workflow:Close" class="text-gray-400" />
        </div>
      </div>
    </h2>
  {/if}
  <div
    class="compare-thumbnail"
    style={`background-image: url("${ingredient.thumbnail_url}");`}
  />
  <div class="info">This image has no attribution or history data.</div>
</div>

<style lang="postcss">
  .info {
    @apply border-gray-500 border text-center rounded px-2 py-3 mt-2;
    font-size: 13px;
  }
  h2.filename {
    @apply mt-0 mb-3;
  }
  .compare-title {
    @apply font-bold text-xl truncate mb-1;
    max-width: 240px;
  }
  .compare-thumbnail {
    @apply w-full border border-gray-300 bg-white rounded bg-contain bg-center bg-no-repeat mb-5;
    height: 280px;
  }
  .close {
    @apply bg-gray-200 rounded-full cursor-pointer flex items-center justify-center;
    width: 28px;
    height: 28px;
  }
</style>
