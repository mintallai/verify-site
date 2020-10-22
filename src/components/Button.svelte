<script lang="ts">
  export let href: string | undefined;
  export let secondary: boolean = false;
  export let size: string = 'md';
</script>

<style lang="postcss">
  .button {
    @apply inline-block bg-purple-500 text-sm text-white font-bold px-6 py-2 rounded-full;
  }
  .secondary {
    @apply bg-purple-200 text-purple-500;
  }
  .lg {
    @apply px-12 py-3 text-xl;
  }
  .lg .inner {
    position: relative;
    top: -1px;
  }
</style>

{#if href}
  <a class="button" class:secondary class:lg={size === 'lg'} {href}>
    <div class="inner">
      <slot />
    </div>
  </a>
{:else}
  <button
    class="button"
    class:secondary
    class:lg={size === 'lg'}
    on:click|stopPropagation>
    <div class="inner">
      <slot />
    </div>
  </button>
{/if}
