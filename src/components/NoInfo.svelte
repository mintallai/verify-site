<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  export let isComparing: boolean = false;
  const dispatch = createEventDispatcher();
</script>

<div class="p-5">
  <h2 class="mb-5 flex items-center">
    <span>No Info</span>
    {#if isComparing}
      <div
        class="flex-grow flex justify-end cursor-pointer"
        on:click={() => dispatch('close')}>
        <Icon size="m" name="workflow:Close" class="text-gray-400 ml-2" />
      </div>
    {/if}
  </h2>
</div>
