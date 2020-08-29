<script lang="ts">

</script>

<style>
  button {
    @apply bg-purple text-sm text-white font-bold px-4 py-2 rounded-full;
    > div {
      position: relative;
      top: -1px;
    }
  }
</style>

<button>
  <div>
    <slot />
  </div>
</button>
