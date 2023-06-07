<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import { _ } from 'svelte-i18n';
  import Description from '../../components/typography/Description.svelte';
  import TitleSidebarSection from './TitleSidebarSection.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/Ia3H5aTbYu8CKZAzjUK6u1/Apply-(formerly-Claiminator)?type=design&node-id=1125-31520&t=kOsXkSrHfdkT6IuS-4',
  };
</script>

<Meta
  title="Global/TitleSidebarSection"
  component={TitleSidebarSection}
  parameters={{ design }} />

<Template let:args>
  <TitleSidebarSection {...args} />
</Template>

<Story name="Custom slot" let:args>
  <TitleSidebarSection {...args}>
    <div slot="title">{$_('sidebar.apply.title')}</div>
    <div slot="content">
      <Description>{$_('sidebar.apply.description')}</Description>
    </div>
  </TitleSidebarSection>
</Story>
