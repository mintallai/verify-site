<!--
  ADOBE CONFIDENTIAL
  Copyright 2022 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import Dots from '../../assets/svg/monochrome/dots.svg';
  let open: boolean = true;
  export let placement: string = 'right-start';
  const onCancel = () => {
    open = false;
  };
  const onConfirm = () => {
    open = true;
  };
</script>

<overlay-trigger {placement} type="replace" {open}>
  <button slot="trigger" on:click={onConfirm}> <Dots class="w-1" /></button>
  <sp-popover slot="click-content" class="max-w-[390px]">
    <sp-dialog size="s">
      <h1 slot="heading" class="font-bold">
        {$_('dialog.manifestRecovery.headline')}
      </h1>
      {$_('dialog.manifestRecovery.intro')} <br /> <br />
      {$_('dialog.manifestRecovery.search')}
      <a href="https://contentauthenticity.org/" class="underline text-blue-400"
        >{$_('dialog.manifestRecovery.link')}</a>
      <sp-button
        slot="button"
        treatment="outline"
        variant="primary"
        class="border-2 border-solid border-gray-800"
        onclick={onCancel}>
        {$_('dialog.manifestRecovery.buttons.OK')}
      </sp-button>
    </sp-dialog>
  </sp-popover>
</overlay-trigger>

<style>
</style>
