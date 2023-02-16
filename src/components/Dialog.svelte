<script lang="ts">
  import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';

  import { _ } from 'svelte-i18n';
  export let cancelLabelKey = 'dialog.buttons.cancel';
  export let confirmLabelKey = 'dialog.buttons.confirm';
  export let contentKey = '';
  export let dismissable = false;
  export let error = false;
  export let headlineKey = '';
  export let onCancel: () => void = () => {};
  export let onConfirm: () => void = () => {};
  export let open = false;
  export let size: 's' | 'm' | 'l' | undefined = 'm';
  $: headline = headlineKey ? $_(headlineKey) : '';
  $: content = contentKey ? $_(contentKey) : '';
</script>

<sp-theme color="lightest" scale="medium">
  <sp-dialog-wrapper
    {headline}
    {dismissable}
    {error}
    {open}
    {size}
    underlay={true}
    cancel-label={$_(cancelLabelKey)}
    confirm-label={$_(confirmLabelKey)}
    on:cancel={onCancel}
    on:confirm={onConfirm}>
    {content}
  </sp-dialog-wrapper>
</sp-theme>
