<script lang="ts">
  export let href: string | undefined;
  export let secondary: boolean = false;
  export let size: string = 'md';
  export let full: boolean = false;
  export let outline: boolean = false;
</script>

{#if href}
  <a
    class="button"
    class:full
    class:secondary
    class:outline
    class:lg={size === 'lg'}
    {href}
  >
    <div class="inner">
      <slot />
    </div>
  </a>
{:else}
  <button
    class="button"
    class:full
    class:secondary
    class:lg={size === 'lg'}
    on:click|stopPropagation
  >
    <div class="inner">
      <slot />
    </div>
  </button>
{/if}

<style lang="postcss">
  .button {
    @apply inline-block bg-blue-500 text-sm text-white font-bold px-6 py-2 rounded-full;
  }
  .button.full {
    @apply w-full;
  }
  .button.outline {
    @apply bg-white border-black border-2 text-black;
  }
  .secondary {
    @apply bg-gray-200 text-blue-500;
  }
  .lg {
    @apply px-12 py-3 text-xl;
  }
  .lg .inner {
    position: relative;
    top: -1px;
  }
</style>
