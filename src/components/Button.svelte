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
    @apply inline-block bg-blue-500 text-sm text-white font-bold px-4 py-1.5 rounded-full transition duration-200 outline-none;
  }
  .button.full {
    @apply w-full;
  }
  .button.outline {
    @apply bg-white border-gray-800 border-2 text-gray-800;
  }
  .button.outline:hover {
    @apply text-white bg-gray-800;
  }
  .secondary {
    @apply bg-gray-100 text-gray-800;
  }
  .lg {
    @apply px-12 py-3 text-xl;
  }
  .lg .inner {
    position: relative;
    top: -1px;
  }
</style>
