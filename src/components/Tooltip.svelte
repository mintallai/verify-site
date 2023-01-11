<script lang="ts">
  import type { TippyProps } from '../lib/tippy';
  import { tippy } from '../lib/tippy';

  let content;
  export let placement;
  const tippyOpts: Partial<TippyProps> = {
    interactive: true,
    trigger: 'mouseenter',
    appendTo: document.body,
    onShow() {},
    onHide() {},
  };
</script>

<div class="trigger" use:tippy={{ content: content, ...tippyOpts, placement }}>
  <slot name="trigger">
    <cai-icon-help />
  </slot>
  <slot name="content" {content} />
</div>
