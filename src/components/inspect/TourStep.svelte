<script lang="ts">
  export let title: string;
  export let content: string;
  export let stepNum: number;
  export let stepTotal: number;

  let element: HTMLElement;

  export const getElement = () => element;
</script>

<style lang="postcss">
  .step {
    @apply text-white text-base;
  }
  h3 {
    @apply font-bold mb-3;
  }
  .content {
    @apply leading-snug;
  }
  .footer {
    @apply flex justify-between w-full mt-3;
  }
</style>

<div class="step" bind:this={element}>
  <h3>{title}</h3>
  <div class="content">{content}</div>
  <div class="footer">
    <div>{stepNum} of {stepTotal}</div>
    <button>Next</button>
  </div>
</div>
