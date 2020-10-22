<script lang="ts">
  import cssVars from 'svelte-css-vars';
  export let ratio: number = 1;
</script>

<style lang="postcss">
  .aspect-box {
    @apply flex items-stretch;
  }
  .aspect-box::before {
    content: '';
    width: 1px;
    margin-left: -1px;
    float: left;
    height: 0;
    padding-top: calc((var(--ratio)) * 100%);
  }
  .aspect-box::after {
    content: '';
    display: table;
    clear: both;
  }
</style>

<div class="aspect-box" use:cssVars={{ ratio }}>
  <slot />
</div>
