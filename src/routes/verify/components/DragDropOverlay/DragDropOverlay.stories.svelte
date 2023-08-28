<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import DragDropOverlay from './DragDropOverlay.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/06v2bXJZ4mpgTpZJ81af6Y/Verify-2.0?type=design&node-id=2769-102165&mode=dev',
  };
</script>

<Meta
  title="Verify/DragDropOverlay"
  component={DragDropOverlay}
  parameters={{ design }} />

<Template let:args>
  <DragDropOverlay {...args} />
</Template>

<Story name="Default" />
