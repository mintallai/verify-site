<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon.svelte';

  export let ingredient: IReference;
  export let isComparing: boolean = false;
  const dispatch = createEventDispatcher();
</script>

<style lang="postcss">
  .info {
    @apply border-gray-500 border text-center rounded px-2 py-3;
    font-size: 13px;
  }
</style>

<div class="info">This image has no attribution or history data.</div>
