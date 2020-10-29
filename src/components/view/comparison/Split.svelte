<script lang="ts">
  import cssVars from 'svelte-css-vars';
  import partial from 'lodash/partial';
  import type { TippyProps } from '../../../lib/tippy';
  import { tippy } from '../../../lib/tippy';

  enum Layout {
    Stacked = 'stacked',
    SideBySide = 'sideBySide',
  }

  export let side = 0;
  export let primary: ViewableItem;
  export let secondary: ViewableItem;
  let layout: Layout | undefined;
  let aspectRatios = {
    primary: null,
    secondary: null,
  };

  function processImage(id, evt) {
    const { naturalWidth, naturalHeight } = evt.target as HTMLImageElement;
    aspectRatios = { ...aspectRatios, [id]: naturalWidth / naturalHeight };
  }

  $: {
    if (Object.values(aspectRatios).every((x) => x !== null)) {
      const avg = (aspectRatios.primary + aspectRatios.secondary) / 2;
      layout = avg >= 1 ? Layout.Stacked : Layout.SideBySide;
    }
  }

  $: styles = {
    width: `${side}px`,
    height: `${side}px`,
  };

  let tippyOpts: Partial<TippyProps> = {
    placement: 'top',
    followCursor: 'initial',
    delay: [1000, 0],
    offset: [0, 15],
  };
</script>

<style lang="postcss">
  .inner {
    @apply flex rounded-md overflow-hidden bg-white shadow-md pointer-events-none;
    width: var(--width);
    height: var(--height);
  }
  .inner.layout-stacked {
    @apply flex-col;
  }
  .thumbnail {
    @apply relative;
  }
  .thumbnail img {
    @apply w-full h-full object-contain pointer-events-auto;
  }
  .primary,
  .secondary {
    @apply overflow-hidden select-none;
    flex: 0 0 calc((var(--width) / 2) - 0.5px);
  }
  .divider {
    @apply bg-gray-350;
    flex: 0 0 1px;
  }
</style>

<div
  class="inner"
  class:layout-stacked={layout === Layout.Stacked}
  class:layout-sideBySide={layout === Layout.SideBySide}
  use:cssVars={styles}>
  <div class="primary thumbnail" class:invisible={!layout}>
    <img
      use:tippy={{ content: primary.title, ...tippyOpts }}
      src={primary.thumbnail_url}
      alt=""
      on:load={partial(processImage, 'primary')} />
  </div>
  <div class="divider" />
  <div class="secondary thumbnail" class:invisible={!layout}>
    <img
      use:tippy={{ content: secondary.title, ...tippyOpts }}
      src={secondary.thumbnail_url}
      alt=""
      on:load={partial(processImage, 'secondary')} />
  </div>
</div>
