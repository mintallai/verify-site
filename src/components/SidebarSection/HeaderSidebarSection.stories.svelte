<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import { _ } from 'svelte-i18n';
  import Checkbox from '../../routes/apply/components/Checkbox/Checkbox.svelte';
  import CheckboxGroup from '../../routes/apply/components/Checkbox/CheckboxGroup.svelte';
  import HeaderSidebarSection from './HeaderSidebarSection.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/Ia3H5aTbYu8CKZAzjUK6u1/Apply-(formerly-Claiminator)?type=design&node-id=1125-31523&t=kOsXkSrHfdkT6IuS-4',
  };
</script>

<Meta
  title="Global/HeaderSidebarSection"
  component={HeaderSidebarSection}
  parameters={{ design }} />

<Template let:args>
  <HeaderSidebarSection {...args} />
</Template>

<Story name="Example" let:args>
  <HeaderSidebarSection {...args}>
    <div slot="header">
      {$_('sidebar.apply.credit')}
    </div>
    <div slot="description">
      {$_('sidebar.apply.credit.description')}
    </div>
    <div slot="content">
      <CheckboxGroup>
        <Checkbox>{$_('sidebar.apply.credit.name')}</Checkbox>
        <Checkbox>{$_('sidebar.apply.credit.contact')}</Checkbox>
        <Checkbox>{$_('sidebar.apply.credit.AI')}</Checkbox>
      </CheckboxGroup>
    </div>
  </HeaderSidebarSection>
</Story>
