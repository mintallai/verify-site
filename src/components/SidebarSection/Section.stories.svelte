<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import { _ } from 'svelte-i18n';
  import AdvancedSection from '../../routes/verify/components/InfoPanel/AdvancedSection/AdvancedSection.svelte';
  import Description from '../typography/Description.svelte';
  import Section from './Section.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/Ia3H5aTbYu8CKZAzjUK6u1/Apply-(formerly-Claiminator)?type=design&node-id=1125-31520&t=kOsXkSrHfdkT6IuS-4',
  };
</script>

<Meta title="Global/Section" component={Section} parameters={{ design }} />

<Template let:args>
  <Section {...args} />
</Template>

<Story name="Apply Section" let:args>
  <Section {...args}>
    <div slot="title">{$_('sidebar.apply.title')}</div>
    <div slot="content">
      <Description>{$_('sidebar.apply.description')}</Description>
    </div>
  </Section>
</Story>

<Story name="Verified Advanced" let:args>
  <AdvancedSection />
</Story>
