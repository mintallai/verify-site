<script lang="ts">
  export let secondary: boolean = false;
</script>

<style lang="postcss">
  button {
    @apply bg-purple-500 text-sm text-white font-bold px-4 py-2 rounded-full;
  }
  button.secondary {
    @apply bg-purple-200 text-purple-500;
  }
  .inner {
    position: relative;
    top: -1px;
  }
</style>

<button class:secondary>
  <div class="inner">
    <slot />
  </div>
</button>
