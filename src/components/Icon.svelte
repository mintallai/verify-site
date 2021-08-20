<script lang="ts" context="module">
  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CloseIcon,
    DeviceDesktopIcon,
    HelpOutlineIcon,
    InfoIcon,
    ShowMenuIcon,
  } from '@spectrum-web-components/icons-workflow/lib/icons';

  const IconsWorkflow = {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CloseIcon,
    DeviceDesktopIcon,
    HelpOutlineIcon,
    InfoIcon,
    ShowMenuIcon,
  };
</script>

<script lang="ts">
  enum Sizes {
    '4xl' = `4rem`,
    '3xl' = `2.5rem`,
    '2xl' = `1.5rem`,
    xl = `1.25rem`,
    l = `1.125rem`,
    m = `1rem`,
    s = `0.875rem`,
    xs = `0.75rem`,
  }

  export let size = 'm';
  export let name: string;
  $: dims = Sizes[size];
  let svg = '';

  $: {
    let iconFn: (args: any) => any;
    iconFn = IconsWorkflow[`${name}Icon`];
    if (iconFn) {
      svg = iconFn({
        width: dims,
        height: dims,
      });
    } else {
      console.error(`Icon "${name}" not found.`);
    }
  }
</script>

<div class={$$props.class}>
  {@html svg}
</div>
