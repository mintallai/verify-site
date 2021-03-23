<script lang="ts">
  import Icon from './Icon.svelte';
  import type { TippyProps } from '../lib/tippy';
  import { tippy } from '../lib/tippy';

  export let content: string;
  export let size = 's';

  let defaultOpts: Partial<TippyProps> = {
    placement: 'top-start',
    popperOptions: {
      modifiers: [
        { name: 'arrow', options: { padding: 10 } },
        {
          name: 'offset',
          options: {
            offset: ({ placement }) => {
              if (placement === 'top-end' || placement === 'bottom-end') {
                return [20, 8];
              } else {
                return [-10, 8];
              }
            },
          },
        },
      ],
    },
  };
</script>

<div class={$$props.class} use:tippy={{ content, ...defaultOpts }}>
  <Icon {size} name="HelpOutline" class="text-gray-400" />
</div>
