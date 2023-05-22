<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import Hamburger from './Hamburger.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/06v2bXJZ4mpgTpZJ81af6Y/Verify-2.0?type=design&node-id=352%3A37940&t=WHkOoDMn2UY6KS84-1',
  };
</script>

<Meta title="Global/Hamburger" component={Hamburger} parameters={{ design }} />

<Template let:args>
  <Hamburger {...args} />
</Template>

<Story name="Default" />

<Story name="Open" source args={{ open: true }} />
