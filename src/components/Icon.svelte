<script lang="ts" context="module">
  import {
    ActionsIcon,
    AlertIcon,
    AlgorithmIcon,
    BrushIcon,
    CameraIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    ColorPaletteIcon,
    FolderOpenOutlineIcon,
    GroupIcon,
    InfoIcon,
    HelpOutlineIcon,
    ShapesIcon,
    TextIcon,
    UploadToCloudIcon,
    VideoOutlineIcon,
  } from '@spectrum-web-components/icons-workflow/lib/icons';

  const IconsUI = {};
  const IconsWorkflow = {
    ActionsIcon,
    AlertIcon,
    AlgorithmIcon,
    BrushIcon,
    CameraIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    ColorPaletteIcon,
    FolderOpenOutlineIcon,
    GroupIcon,
    HelpOutlineIcon,
    InfoIcon,
    ShapesIcon,
    TextIcon,
    UploadToCloudIcon,
    VideoOutlineIcon,
  };
</script>

<script lang="ts">
  enum Sizes {
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
