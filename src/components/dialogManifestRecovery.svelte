<script lang="ts" context="module">
  import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
</script>

<script lang="ts">
  import { _ } from 'svelte-i18n';
  export let cancelLabelKey = 'dialog.buttons.cancel';
  export let confirmLabelKey = 'dialog.buttons.confirm';
  export const Open: () => void = () => {
    open: true;
  };
  export let dismissable = false;
  export let error = false;
  export let open = false;
  export let onCancel: () => void = () => {
    open: false;
  };
  export let onConfirm: () => void = () => {
    open: false;
  };
</script>

<sp-theme color="lightest" scale="medium">
  <sp-dialog
    size="medium"
    dismissable
    {open}
    underlay="true"
    cancel-label={$_(cancelLabelKey)}
    confirm-label={$_(confirmLabelKey)}
    on:cancel={onCancel}
    on:confirm={onConfirm}>
    {$_('dialog.manifestRecovery.content')}>
  </sp-dialog>
</sp-theme>
