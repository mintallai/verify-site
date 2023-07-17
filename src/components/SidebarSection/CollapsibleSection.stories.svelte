<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import { _ } from 'svelte-i18n';
  import Checkbox from '../../routes/apply/components/Checkbox/Checkbox.svelte';
  import CheckboxGroup from '../../routes/apply/components/Checkbox/CheckboxGroup.svelte';
  import AboutSection from '../../routes/verify/components/AboutSection/AboutSection.svelte';
  import CreditAndUsageSection from '../../routes/verify/components/CreditAndUsageSection/CreditAndUsageSection.svelte';
  import ProcessSection from '../../routes/verify/components/ProcessSection/ProcessSection.svelte';
  import CollapsibleSection from './CollapsibleSection.svelte';

  const design = {
    type: 'figma',
    url: 'https://www.figma.com/file/Ia3H5aTbYu8CKZAzjUK6u1/Apply-(formerly-Claiminator)?type=design&node-id=1125-31523&t=kOsXkSrHfdkT6IuS-4',
  };
</script>

<Meta
  title="Global/CollapsibleSection"
  component={CollapsibleSection}
  parameters={{ design }} />

<Template let:args>
  <CollapsibleSection {...args} />
</Template>

<Story name="Apply Credit and usage" let:args>
  <CollapsibleSection {...args}>
    <div slot="header">
      {$_('sidebar.credit')}
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
  </CollapsibleSection>
</Story>

<Story name="Verify Credit and usage" let:args>
  <CreditAndUsageSection />
</Story>

<Story name="Verify Process" let:args>
  <ProcessSection />
</Story>

<Story name="Verify About" let:args>
  <AboutSection />
</Story>
