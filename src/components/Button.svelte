<script lang="ts">

</script>

<style lang="postcss">
  button {
    @apply bg-purple text-sm text-white font-bold px-4 py-2 rounded-full;
  }
  .inner {
    position: relative;
    top: -1px;
  }
</style>

<button>
  <div class="inner">
    <slot />
  </div>
</button>
