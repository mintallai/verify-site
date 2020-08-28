<script lang="ts">
  import style from '../lib/util/style';

  let width = 0;
  let height = 0;
  let side = `0px`;
  let padding = 20;

  $: {
    side = `${Math.min(width, height) - padding * 2}px`;
  }
  $: styles = {
    width: side,
    height: side,
  };
</script>

<style lang="postcss">
  .inner {
    @apply rounded-md bg-white shadow-md overflow-hidden;
    width: var(--width);
    height: var(--height);
  }
</style>

<div
  class="bg-gray-100 flex items-center justify-center"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <div class="inner" use:style={styles}>
    <img
      src="/images/test/image-1.jpg"
      alt=""
      class="h-full w-full object-contain object-center" />
  </div>
</div>
