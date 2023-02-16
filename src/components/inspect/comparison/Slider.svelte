<!--
  ADOBE CONFIDENTIAL
  Copyright 2020 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import cssVars from 'svelte-css-vars';
  import interact from 'interactjs';
  import type { DragEvent } from '@interactjs/types';
  import ChevronLeft from '../../../../assets/svg/monochrome/chevron-left.svg?component';
  import ChevronRight from '../../../../assets/svg/monochrome/chevron-right.svg?component';
  import type { TippyProps } from '$lib/tippy';
  import { tippy } from '$lib/tippy';
  import { thumbnail, handleImgSrc } from '$lib/thumbnail';
  import { getFilename } from '$lib/node';
  import type { HierarchyTreeNode } from '../../../stores';

  export let side = 0;
  let slider: HTMLDivElement;
  let sliderX = 0.5;

  $: styles = {
    width: `${side}px`,
    height: `${side}px`,
    leftWidth: `${sliderX * 100}%`,
    rightWidth: `${100 - sliderX * 100}%`,
  };

  export let primary: HierarchyTreeNode;
  export let secondary: HierarchyTreeNode;

  let tippyOpts: Partial<TippyProps> = {
    placement: 'top',
    followCursor: 'initial',
    delay: [1000, 0],
    offset: [0, 15],
  };

  const restrictToParent = interact.modifiers.restrict({
    restriction: 'parent',
    elementRect: { left: 0, right: 0, top: 1, bottom: 1 },
  });

  const snap = interact.modifiers.snap({
    range: 15,
    targets: [{ x: 0 }, () => ({ x: side / 2 }), () => ({ x: side })],
    relativePoints: [{ x: 0, y: 0 }],
  });

  onMount(() => {
    let origSliderX: number;
    interact(slider).draggable({
      origin: 'parent',
      modifiers: [restrictToParent, snap],
      listeners: {
        start() {
          origSliderX = sliderX;
        },
        move(evt: DragEvent) {
          const deltaX = evt.pageX - evt.x0 - 2;
          const newPos = side * origSliderX + deltaX;
          sliderX = Math.min(newPos / side, 1);
        },
      },
    });

    return () => interact(slider).unset();
  });
</script>

<div class="inner" use:cssVars={styles}>
  <div class="slider" bind:this={slider}>
    <div class="handle">
      <div>
        <ChevronLeft width="16px" height="16px" class="text-gray-700" />
        <ChevronRight width="16px" height="16px" class="text-gray-700" />
      </div>
    </div>
  </div>
  <div class="primary">
    <div
      class="thumbnail"
      use:tippy={{ content: getFilename(primary), ...tippyOpts }}>
      <img use:thumbnail={primary} on:thumbnail={handleImgSrc} alt="" />
    </div>
  </div>
  <div
    class="secondary"
    use:tippy={{ content: getFilename(secondary), ...tippyOpts }}>
    <div class="thumbnail">
      <img use:thumbnail={secondary} on:thumbnail={handleImgSrc} alt="" />
    </div>
  </div>
</div>

<style lang="postcss">
  .inner {
    @apply relative pointer-events-none select-none;
    width: var(--width);
    height: var(--height);
  }
  .primary,
  .secondary {
    @apply absolute top-0 overflow-hidden h-full pointer-events-none;
  }
  .primary {
    left: 0;
    width: var(--leftWidth);
  }
  .secondary {
    right: 0;
    width: var(--rightWidth);
  }
  .secondary .thumbnail {
    float: right;
  }
  .thumbnail {
    @apply pointer-events-auto;
    width: var(--width);
    height: var(--height);
  }
  .thumbnail img {
    @apply h-full w-full object-contain object-center;
    width: var(--width);
    height: var(--height);
  }
  .slider {
    @apply absolute top-0 bottom-0 border-l border-r border-gray-300 bg-white z-10 pointer-events-none;
    transform: translateX(-2px);
    width: 4px;
    left: var(--leftWidth);
    touch-action: none;
  }
  .handle {
    @apply absolute flex items-center justify-center border border-gray-300 rounded-full bg-white pointer-events-auto select-none;
    top: 50%;
    width: 32px;
    height: 32px;
    transform: translate(-14px, -15px);
  }
  .handle > div {
    @apply flex relative;
  }
</style>
