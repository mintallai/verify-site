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
  import { _ } from 'svelte-i18n';
  import Dots from '../../assets/svg/monochrome/dots.svg';
  import { handleUrl } from '../lib/util/handlers';
  import { FAQ_URL } from '../stores';
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
  <button
    slot="trigger"
    on:click={onConfirm}
    aria-label="About possible content credentials matches"
    aria-haspopup="dialog"
    class="w-4 flex items-center justify-center">
    <Dots class="w-1" /></button>
  <sp-popover slot="click-content" class="max-w-[420px]">
    <sp-dialog size="s">
      <h1 slot="heading" class="font-bold ">
        {$_('dialog.manifestRecovery.headline')}
      </h1>
      <div class="justify-around">
        {$_('dialog.manifestRecovery.intro')} <br /> <br />
        {$_('dialog.manifestRecovery.search')}
      </div>
      <sp-button
        slot="button"
        treatment="outline"
        variant="secondary"
        class="border-2 border-solid border-gray-700"
        onclick={handleUrl(FAQ_URL, 'faq')}>
        {$_('dialog.manifestRecovery.buttons.learnMore')}
      </sp-button>
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
