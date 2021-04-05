<script lang="ts" context="module">
  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    DeviceDesktopIcon,
    HelpOutlineIcon,
    InfoIcon,
    ShowMenuIcon,
  } from '@spectrum-web-components/icons-workflow/lib/icons';
  import { ArrowLeftMediumIcon } from '@spectrum-web-components/icons-ui/lib/icons';

  const IconsUI = {
    ArrowLeftMediumIcon,
  };
  const IconsWorkflow = {
    ChevronLeftIcon,
    ChevronRightIcon,
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
    const [library, icon] = name.split(':');
    let iconFn: (args: any) => any;
    if (library === 'ui') {
      iconFn = IconsUI[`${icon}Icon`];
    } else if (library === 'workflow') {
      iconFn = IconsWorkflow[`${icon}Icon`];
    } else {
      console.error(
        `Icon library must be either "ui" or "workflow". Received:`,
        library,
      );
    }
    if (iconFn) {
      svg = iconFn({
        width: dims,
        height: dims,
      });
    } else {
      console.error(
        `Icon "${icon}" not found. Available options are:`,
        Object.keys(library === 'workflow' ? IconsWorkflow : IconsUI),
      );
    }
  }
</script>

<div class={$$props.class}>
  {@html svg}
</div>
