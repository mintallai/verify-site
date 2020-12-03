<script lang="ts">
  import { scale } from 'svelte/transition';
  import Icon from '../Icon.svelte';
</script>

<style lang="postcss">
</style>

<div
  class="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 pointer-events-none flex justify-center items-center">
  <div
    transition:scale={{ duration: 200, start: 0.9 }}
    class="rounded-md overflow-hidden bg-white shadow-md p-12 flex justify-center items-center flex-col">
    <div class="flex-shrink-0 mb-3">
      <Icon size="4xl" name="workflow:ImageSearch" class="text-gray-400" />
    </div>
    <h2 class="m-0 mb-3">Drop your image file here to analyze</h2>
    <span>Only JPG files are accepted.</span>
  </div>
</div>
