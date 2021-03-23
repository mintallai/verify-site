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
    DeviceDesktopIcon,
    FolderOpenOutlineIcon,
    GroupIcon,
    HelpOutlineIcon,
    HomeIcon,
    ImageSearchIcon,
    InfoIcon,
    ShapesIcon,
    TextIcon,
    UploadToCloudIcon,
    VideoOutlineIcon,
  } from '@spectrum-web-components/icons-workflow/lib/icons';
</script>

<script lang="ts">
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
    DeviceDesktopIcon,
    FolderOpenOutlineIcon,
    GroupIcon,
    HelpOutlineIcon,
    HomeIcon,
    ImageSearchIcon,
    InfoIcon,
    ShapesIcon,
    TextIcon,
    UploadToCloudIcon,
    VideoOutlineIcon,
  };

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
    const iconFn = IconsWorkflow[`${name}Icon`];
    if (iconFn) {
      svg = iconFn({
        width: dims,
        height: dims,
      });
    } else {
      console.error(
        `Icon "${name}" not found. Available options are:`,
        Object.keys(IconsWorkflow),
      );
    }
  }
</script>

<div class={$$props.class}>
  {@html svg}
</div>
