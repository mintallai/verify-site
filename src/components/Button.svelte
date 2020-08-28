<script lang="ts">

</script>

<style>
  button {
    @apply text-sm text-white font-bold px-4 py-2 rounded-full;
    > div {
      position: relative;
      top: -1px;
    }
  }
</style>

<button class="bg-purple">
  <div>
    <slot />
  </div>
</button>
