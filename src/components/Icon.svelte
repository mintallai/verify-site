<script lang="ts" context="module">
  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    HelpOutlineIcon,
  } from '@spectrum-web-components/icons-workflow/lib/icons';

  const IconsUI = {};
  const IconsWorkflow = {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    HelpOutlineIcon,
  };
</script>

<script lang="ts">
  enum Sizes {
    m = `1rem`,
    s = `0.875rem`,
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
